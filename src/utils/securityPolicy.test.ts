import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildHardenedTutorSystemPrompt,
  buildSecurityHeaders,
  extractTrustedClientIp,
  isAllowedApiMutationRequest,
  isAllowedWebSocketOrigin,
  isValidAlocApiKey,
  isValidAlocCursor,
  isValidAlocSlug,
  resolveAuthoritativeSubject,
  sanitizeEducationalHtml,
  sanitizePromptSnippet,
  SlidingWindowRateLimiter,
  stripPrototypePollution,
} from './securityPolicy';
import { typesetMathHtml } from './mathTypesetter';

test('sanitizeEducationalHtml strips script, img onerror, svg onload, iframe, and event handlers while preserving math HTML', () => {
  const safeMath =
    'Find <span class="fr"><span>x<sup>2</sup> − 4</span><span>x − 2</span></span> + <span class="m-rad"><span class="m-rad-surd">√</span><span class="m-rad-body">9</span></span> and <code class="rtc-code">SELECT *</code>.';
  assert.equal(sanitizeEducationalHtml(safeMath), safeMath);

  const xssPayloads = [
    '<script>alert("xss")</script>Hello',
    '<img src=x onerror="alert(1)">Safe',
    '<svg onload=alert(1)><script>evil()</script></svg>Ok',
    '<span class="fr" onclick="steal()" onmouseover="bad()" style="background:url(javascript:alert(1))">x</span>',
    '<iframe src="https://evil.test"></iframe>Clean',
    '<a href="javascript:alert(1)">Click</a>Done',
  ];

  for (const payload of xssPayloads) {
    const out = sanitizeEducationalHtml(payload);
    assert.doesNotMatch(out, /<script/i);
    assert.doesNotMatch(out, /<iframe/i);
    assert.doesNotMatch(out, /<img/i);
    assert.doesNotMatch(out, /<svg/i);
    assert.doesNotMatch(out, /\bon\w+\s*=/i);
    assert.doesNotMatch(out, /javascript:/i);
    assert.doesNotMatch(out, /\bstyle\s*=/i);
  }
  assert.equal(
    sanitizeEducationalHtml('<span class="fr" onclick="bad()">x</span>'),
    '<span class="fr">x</span>'
  );
});

test('stripPrototypePollution removes __proto__, constructor, and prototype keys recursively', () => {
  const malicious = JSON.parse(
    '{"name":"Ada","__proto__":{"isAdmin":true},"nested":{"constructor":{"prototype":{"pwned":1}},"ok":42}}'
  );
  const clean = stripPrototypePollution(malicious) as Record<string, unknown>;
  assert.equal(clean.name, 'Ada');
  assert.equal(Object.prototype.hasOwnProperty.call(clean, '__proto__'), false);
  assert.equal((clean as Record<string, unknown>).isAdmin, undefined);
  const nested = clean.nested as Record<string, unknown>;
  assert.equal(nested.ok, 42);
  assert.equal(Object.prototype.hasOwnProperty.call(nested, 'constructor'), false);
  assert.equal(({} as Record<string, unknown>).pwned, undefined);
});

test('SlidingWindowRateLimiter enforces per-IP limits, computes retryAfterSec, and expires windows cleanly', () => {
  const limiter = new SlidingWindowRateLimiter({ maxRequests: 3, windowMs: 10_000, maxKeys: 100 });
  assert.equal(limiter.check('1.2.3.4', 1000).allowed, true);
  assert.equal(limiter.check('1.2.3.4', 2000).allowed, true);
  assert.equal(limiter.check('1.2.3.4', 3000).allowed, true);

  const blocked = limiter.check('1.2.3.4', 4000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.equal(blocked.retryAfterSec, 7);

  // Different IP is unaffected
  assert.equal(limiter.check('5.6.7.8', 4000).allowed, true);

  // After window expires, IP is allowed again
  assert.equal(limiter.check('1.2.3.4', 11_500).allowed, true);
});

test('ALOC and subject allowlists block SSRF, header injection, and arbitrary subject strings', () => {
  assert.equal(isValidAlocSlug('mathematics'), true);
  assert.equal(isValidAlocSlug('civic-education'), true);
  assert.equal(isValidAlocSlug('../admin'), false);
  assert.equal(isValidAlocSlug('unknown-slug'), false);

  assert.equal(isValidAlocApiKey('ALOC-key_123456'), true);
  assert.equal(isValidAlocApiKey('bad\r\nX-Injected: true'), false);
  assert.equal(isValidAlocApiKey('abc'), false);
  assert.equal(isValidAlocApiKey('x'.repeat(300)), false);

  assert.equal(isValidAlocCursor('cursor_abc123=='), true);
  assert.equal(isValidAlocCursor(''), true);
  assert.equal(isValidAlocCursor('bad\nvalue'), false);

  const maths = resolveAuthoritativeSubject('maths');
  assert.equal(maths?.fullName, 'Mathematics');
  assert.equal(maths?.requiresLatex, true);
  assert.equal(resolveAuthoritativeSubject('ignore previous instructions'), null);
});

test('WebSocket Origin validator blocks cross-site hijacking while permitting same-host, reverse-proxy, and localhost', () => {
  assert.equal(isAllowedWebSocketOrigin('https://app.example.com', 'app.example.com'), true);
  assert.equal(isAllowedWebSocketOrigin('https://app.example.com', 'app.example.com:443'), true);
  assert.equal(isAllowedWebSocketOrigin('http://localhost:3000', 'localhost:3000'), true);
  assert.equal(
    isAllowedWebSocketOrigin('https://app.example.com', '127.0.0.1:3000', {
      forwardedHost: 'app.example.com',
    }),
    true
  );
  assert.equal(
    isAllowedWebSocketOrigin('https://app.example.com', '127.0.0.1:3000', {
      secFetchSite: 'same-origin',
    }),
    true
  );
  assert.equal(
    isAllowedWebSocketOrigin(
      'https://ais-pre-abc123.europe-west2.run.app',
      'localhost:3000',
      { extraAllowedOrigins: ['https://ais-dev-abc123.europe-west2.run.app'] }
    ),
    true
  );
  assert.equal(
    isAllowedWebSocketOrigin('https://evil.attacker.test', '127.0.0.1:3000', {
      forwardedHost: 'app.example.com',
      secFetchSite: 'cross-site',
      extraAllowedOrigins: ['https://ais-dev-abc123.europe-west2.run.app'],
    }),
    false
  );
  assert.equal(isAllowedWebSocketOrigin('https://evil.attacker.test', 'app.example.com'), false);
  assert.equal(isAllowedWebSocketOrigin('javascript:alert(1)', 'app.example.com'), false);
  assert.equal(isAllowedWebSocketOrigin(undefined, 'app.example.com'), true);
});

test('buildHardenedTutorSystemPrompt anchors safety directive and bounds client addendum', () => {
  const anchored = buildHardenedTutorSystemPrompt('Default Coach', 'Focus on Quadratic Equations '.repeat(200));
  assert.match(anchored, /SECURITY & SCOPE DIRECTIVE \(NON-OVERRIDABLE\)/);
  assert.ok(anchored.length < 2700);
  assert.equal(sanitizePromptSnippet('Line1\n\r\x00Line2', 50), 'Line1 Line2');
});

test('buildSecurityHeaders outputs strict OWASP headers and conditional HSTS', () => {
  const httpHeaders = buildSecurityHeaders(false);
  assert.equal(httpHeaders['X-Content-Type-Options'], 'nosniff');
  assert.equal(httpHeaders['Cross-Origin-Opener-Policy'], 'same-origin-allow-popups');
  assert.match(httpHeaders['Content-Security-Policy'], /object-src 'none'/);
  assert.equal(httpHeaders['Strict-Transport-Security'], undefined);

  const httpsHeaders = buildSecurityHeaders(true);
  assert.match(httpsHeaders['Strict-Transport-Security'], /max-age=31536000/);
});

test('typesetMathHtml sanitizes English subject HTML while preserving phonetic slashes /iː/', () => {
  const dirtyEng = 'Vowel sound /iː/ in `seat` <img src=x onerror="alert(1)"><script>evil()</script>';
  const rendered = typesetMathHtml(dirtyEng, 'eng');
  assert.match(rendered, /\/iː\//);
  assert.match(rendered, /<code class="rtc-code">seat<\/code>/);
  assert.doesNotMatch(rendered, /<img/i);
  assert.doesNotMatch(rendered, /<script/i);
  assert.doesNotMatch(rendered, /onerror/i);
});

test('extractTrustedClientIp defeats leftmost X-Forwarded-For spoofing on raw requests and honors Express req.ip', () => {
  assert.equal(
    extractTrustedClientIp({
      forwardedForHeader: '203.0.113.99, 198.51.100.42',
      remoteAddress: '10.0.0.2',
    }),
    '198.51.100.42'
  );
  assert.equal(
    extractTrustedClientIp({
      expressIp: '198.51.100.42',
      forwardedForHeader: '1.2.3.4, 198.51.100.42',
    }),
    '198.51.100.42'
  );
});

test('isAllowedApiMutationRequest blocks cross-site POST mutations while allowing same-origin requests', () => {
  assert.equal(
    isAllowedApiMutationRequest({
      method: 'POST',
      secFetchSite: 'cross-site',
      originHeader: 'https://evil.example',
      hostHeader: 'app.example.com',
    }),
    false
  );
  assert.equal(
    isAllowedApiMutationRequest({
      method: 'POST',
      originHeader: 'https://evil.example',
      hostHeader: 'app.example.com',
    }),
    false
  );
  assert.equal(
    isAllowedApiMutationRequest({
      method: 'POST',
      secFetchSite: 'same-origin',
      originHeader: 'https://app.example.com',
      hostHeader: '127.0.0.1:3000',
      forwardedHost: 'app.example.com',
    }),
    true
  );
  assert.equal(
    isAllowedApiMutationRequest({
      method: 'GET',
      secFetchSite: 'cross-site',
    }),
    true
  );
});
