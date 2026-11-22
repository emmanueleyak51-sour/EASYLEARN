import 'dotenv/config';
import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, Type, type LiveServerMessage, type Session } from '@google/genai';
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
  sanitizePromptSnippet,
  SlidingWindowRateLimiter,
} from './src/utils/securityPolicy.ts';
import crypto from 'node:crypto';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { requireAuth, requireVerifiedAuth, type AuthRequest } from './src/middleware/auth.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';
import {
  getCloudSyncState,
  listDailyCbtStandings,
  listDuelEntriesByDuelId,
  listPublicLeaderboard,
  publishDuelAndScoreEntry,
  saveCloudSyncBundle,
  upsertDailyCbtStanding,
  upsertLeaderboardStanding,
} from './src/db/repository.ts';
import {
  BillingUserError,
  completeVerifiedPaystackTransaction,
  createAdminVoucherBatch,
  createPendingPaystackTransaction,
  deriveAuthoritativeDeviceKey,
  getActiveSubscriptionReceipt,
  getAdminBillingOverview,
  getEntitlementPublicKeyJwk,
  getOrCreateTrialReceipt,
  redeemAccessVoucher,
} from './src/db/billingRepository.ts';
import {
  PREMIUM_PLANS,
  getPremiumPlanById,
  isValidDeviceSecretToken,
  isValidEmailAddress,
  isValidPaystackReference,
} from './src/utils/paywallLogic.ts';
import { SUBJECT_TUTOR_REGISTRY } from './src/utils/tutorRegistry.ts';
import { cleanBibleVerseText, validateBibleQuery, validateQuranSurah } from './src/utils/studioCalculators.ts';
import type { SubjectId } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

const MAD_SCIENTIST_STYLE =
  'A charismatic, theatrical, brilliant chemistry professor teaching live beside a student in a bubbling laboratory — NEVER sounding like someone reading notes aloud. ' +
  'Uses warm Socratic pacing, natural thoughtful pauses before key insights, conspiratorial excitement on conceptual traps, and crisp articulation of every formula and ion.';

const MATH_COACH_STYLE =
  'An energetic, warm, razor-sharp Nigerian master mathematics teacher coaching a student live at a chalkboard — NEVER sounding like a flat audiobook reader. ' +
  'Uses conversational classroom cadence, clear emphasis on the decisive algebraic move, natural micro-pauses, and crisp pronunciation of equations and theorems.';

const MATH_LAB_STYLE =
  'A warm, calm, encouraging master geometry teacher guiding a student step-by-step at a slate chalkboard with natural classroom presence and unhurried precision.';

const ENG_COACH_STYLE =
  'A warm, articulate, poised female Nigerian English Language master teacher coaching live in a diction studio — NEVER sounding stiff or scripted. ' +
  'Speaks with graceful conversational rhythm, natural teacher inflection on contrasts and usage traps, and crisp phonetic articulation of vowels, consonants, and stress.';

const PHYS_COACH_STYLE =
  'A charismatic, lucid, authoritative Nigerian experimental Physics professor teaching live at an optics and mechanics bench — NEVER reading monotonously. ' +
  'Speaks with vivid physical intuition, conversational classroom energy, natural pauses before conclusions, and crisp articulation of SI units and laws.';

const BIO_COACH_STYLE =
  'A warm, luminous, authoritative female Nigerian Biology professor teaching live at a microscopy bench — NEVER sounding like a textbook reader. ' +
  'Speaks with engaging classroom warmth, vivid cellular intuition, natural emphasis on key contrasts, and crisp pronunciation of biological terms.';

const AGRIC_COACH_STYLE =
  'A warm, inspiring, authoritative female Nigerian Agronomist and Farm Scientist teaching live on a research farm and soil bench — NEVER sounding like someone reading notes aloud. ' +
  'Speaks with practical field clarity, engaging Socratic warmth, natural emphasis on soil-crop-livestock contrasts and traps, and crisp articulation of agronomic ratios and nutrients.';

const ECON_COACH_STYLE =
  'A poised, incisive, encouraging female Nigerian Economics professor teaching live at a policy and market-analysis desk — NEVER sounding like someone reading notes aloud. ' +
  'Speaks with warm conversational authority, natural classroom pacing, vivid emphasis on cause-and-effect market intuition and traps, and crisp clarity on Naira figures, elasticities, and multipliers.';

const CIVIC_COACH_STYLE =
  'A resonant, principled, inspiring male Nigerian Constitutional Advocate and Civic Education professor teaching live — NEVER sounding like someone reading notes aloud. ' +
  'Speaks with warm courtroom clarity, dignified cadence, vivid real-world civic analogies, and sharp emphasis on constitutional rights, duties, and conceptual traps.';

const FMATH_COACH_STYLE =
  'A razor-sharp, inspiring Nigerian Further Mathematics professor teaching calculus, vectors, matrices, and mechanics live at an analytical chalkboard — NEVER sounding like someone reading notes aloud. ' +
  'Speaks with crisp university precision, warm Socratic enthusiasm on elegant derivations and algebraic traps, and natural spoken clarity on integrals, derivatives, and vectors.';

const GEOG_COACH_STYLE =
  'A charismatic, field-seasoned Nigerian Geographer and Cartographer teaching mapwork, geomorphology, climate, and regional Nigeria/Africa live — NEVER sounding like a flat textbook reader. ' +
  'Speaks with vivid spatial imagery, warm classroom authority, clear numerical precision on scales, gradients, and longitudes, and sharp emphasis on exam watchouts.';

const DIGITECH_COACH_STYLE =
  'An energetic, lucid, hands-on Nigerian Computer Systems Architect teaching binary arithmetic, CPU architecture, logic gates, networking, coding, and cybersecurity live — NEVER sounding like someone reading notes aloud. ' +
  'Speaks with crisp engineering clarity, warm Socratic enthusiasm, natural classroom pacing, and sharp emphasis on bit-vs-byte and hardware traps.';

const DATAPROC_COACH_STYLE =
  'A warm, razor-sharp, authoritative female Nigerian Database Architect and Data Processing professor teaching relational databases, normalization, SQL, spreadsheets, and data integrity live — NEVER sounding like a flat textbook reader. ' +
  'Speaks with poised classroom warmth, crystal-clear logic on primary/foreign keys and SQL clauses, and sharp emphasis on exam watchouts.';

type VoiceProfile = SubjectId | 'math' | 'fmath' | 'mathLab';

function resolveVoiceProfile(raw: unknown): VoiceProfile {
  if (typeof raw !== 'string') return 'eng';
  if (raw === 'math' || raw === 'fmath' || raw === 'mathLab') return raw;
  if (Object.prototype.hasOwnProperty.call(SUBJECT_TUTOR_REGISTRY, raw)) {
    return raw as SubjectId;
  }
  return 'eng';
}

function voiceProfileToSubjectId(profile: VoiceProfile): SubjectId {
  if (profile === 'math' || profile === 'mathLab') return 'maths';
  if (profile === 'fmath') return 'fmaths';
  return profile;
}

function createAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please check Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID') || raw.includes('GEMINI_API_KEY')) {
    return {
      status: 403,
      message: 'Service configuration error. Please check your project secrets.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message: 'Service rate quota reached temporarily. Please retry shortly.',
    };
  }
  // Log raw diagnostic internally but never leak stack traces or internal upstream SDK errors to clients
  console.error('[server] Upstream Gemini error:', raw.slice(0, 300));
  return {
    status: 502,
    message: 'Upstream studio service is temporarily unavailable. Please retry shortly.',
  };
}

// Bounded in-memory cache so replaying or pre-synthesizing any step/chapter is instant
const ttsCache = new Map<string, string>();
const MAX_TTS_CACHE = 256;

function setCachedTts(key: string, audioBase64: string) {
  if (ttsCache.size >= MAX_TTS_CACHE) {
    const oldest = ttsCache.keys().next().value;
    if (oldest) ttsCache.delete(oldest);
  }
  ttsCache.set(key, audioBase64);
}

async function generateStudioTtsWav(scriptText: string, profile: VoiceProfile = 'chem'): Promise<string> {
  const cacheKey = `tts-v3:${profile}:${scriptText}`;
  const hit = ttsCache.get(cacheKey);
  if (hit) return hit;

  const ai = createAiClient();
  const isMathLab = profile === 'mathLab';
  const subjId = voiceProfileToSubjectId(profile);
  const meta = SUBJECT_TUTOR_REGISTRY[subjId];
  const voiceName = isMathLab ? 'Puck' : meta.geminiVoice;
  const stylePrompt =
    subjId === 'dataproc'
      ? DATAPROC_COACH_STYLE
      : subjId === 'digitech'
        ? DIGITECH_COACH_STYLE
        : subjId === 'civic'
          ? CIVIC_COACH_STYLE
          : subjId === 'eng'
            ? ENG_COACH_STYLE
            : subjId === 'econ'
              ? ECON_COACH_STYLE
              : subjId === 'geog'
                ? GEOG_COACH_STYLE
                : subjId === 'agric'
                  ? AGRIC_COACH_STYLE
                  : subjId === 'bio'
                    ? BIO_COACH_STYLE
                    : subjId === 'phys'
                      ? PHYS_COACH_STYLE
                      : subjId === 'fmaths'
                        ? FMATH_COACH_STYLE
                        : isMathLab
                          ? MATH_LAB_STYLE
                          : subjId === 'maths'
                            ? MATH_COACH_STYLE
                            : subjId === 'chem'
                              ? MAD_SCIENTIST_STYLE
                              : meta.voiceStyle;

  const modelsToTry = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];
  let lastErr: unknown = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: scriptText,
                speechMetadata: {
                  style: stylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setCachedTts(cacheKey, base64Audio);
        return base64Audio;
      }
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('Gemini TTS returned an empty audio response.');
}

function getClientIp(req: http.IncomingMessage): string {
  const expressReq = req as Partial<express.Request>;
  return extractTrustedClientIp({
    expressIp: typeof expressReq.ip === 'string' ? expressReq.ip : undefined,
    forwardedForHeader: req.headers['x-forwarded-for'],
    remoteAddress: req.socket?.remoteAddress,
  });
}

const DEFAULT_OWNER_EMAIL = 'emmanueleyak51@gmail.com';

function isAdminDecodedUser(decoded?: DecodedIdToken | null): boolean {
  if (!decoded?.email_verified || typeof decoded.email !== 'string') return false;
  const configured = (process.env.ADMIN_EMAIL || DEFAULT_OWNER_EMAIL).trim().toLowerCase();
  return Boolean(configured) && decoded.email.trim().toLowerCase() === configured;
}

async function tryDecodeBearerToken(req: express.Request): Promise<DecodedIdToken | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token || token.length > 8192) return null;
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}

function buildSafeBillingCallbackUrl(req: express.Request, reference: string): string {
  const configuredAppUrl = process.env.APP_URL?.trim();
  if (configuredAppUrl) {
    try {
      const parsed = new URL(configuredAppUrl);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        parsed.searchParams.set('paystack_ref', reference);
        return parsed.toString();
      }
    } catch {
      /* fallback to request host */
    }
  }
  const rawHost = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000')
    .split(',')[0]
    .trim();
  const safeHost = /^[a-zA-Z0-9.:-]{1,120}$/.test(rawHost) ? rawHost : 'localhost:3000';
  const isHttps =
    req.secure ||
    String(req.headers['x-forwarded-proto'] || '').toLowerCase() === 'https' ||
    IS_PROD;
  const url = new URL(`${isHttps ? 'https' : 'http'}://${safeHost}/`);
  url.searchParams.set('paystack_ref', reference);
  return url.toString();
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Defense-in-depth OWASP HTTP security headers & CSP
  app.use((req, res, next) => {
    const isHttps =
      req.secure ||
      String(req.headers['x-forwarded-proto'] || '').toLowerCase() === 'https' ||
      IS_PROD;
    const headers = buildSecurityHeaders(isHttps);
    for (const [k, v] of Object.entries(headers)) {
      res.setHeader(k, v);
    }
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  });

  app.use(express.json({ limit: '512kb' }));

  // Block cross-site state-changing API requests (CSRF / cross-origin quota abuse)
  app.use('/api', (req, res, next) => {
    const allowed = isAllowedApiMutationRequest({
      method: req.method,
      originHeader: typeof req.headers.origin === 'string' ? req.headers.origin : undefined,
      hostHeader: typeof req.headers.host === 'string' ? req.headers.host : undefined,
      forwardedHost:
        typeof req.headers['x-forwarded-host'] === 'string'
          ? req.headers['x-forwarded-host']
          : undefined,
      secFetchSite:
        typeof req.headers['sec-fetch-site'] === 'string'
          ? req.headers['sec-fetch-site']
          : undefined,
      extraAllowedOrigins: [process.env.APP_URL || '', process.env.SHARED_APP_URL || ''],
    });
    if (!allowed) {
      res.status(403).json({ error: 'Cross-site API requests are not permitted.' });
      return;
    }
    next();
  });

  const ttsLimiter = new SlidingWindowRateLimiter({ maxRequests: 40, windowMs: 60_000 });
  const alocLimiter = new SlidingWindowRateLimiter({ maxRequests: 60, windowMs: 60_000 });
  const genLimiter = new SlidingWindowRateLimiter({ maxRequests: 10, windowMs: 60_000 });
  const cloudDbLimiter = new SlidingWindowRateLimiter({ maxRequests: 120, windowMs: 60_000 });
  const wsUpgradeLimiter = new SlidingWindowRateLimiter({ maxRequests: 30, windowMs: 60_000 });
  const refLimiter = new SlidingWindowRateLimiter({ maxRequests: 60, windowMs: 60_000 });
  const billingLimiter = new SlidingWindowRateLimiter({ maxRequests: 40, windowMs: 60_000 });
  const redeemLimiter = new SlidingWindowRateLimiter({ maxRequests: 12, windowMs: 60_000 });

  const enforceRateLimit =
    (limiter: SlidingWindowRateLimiter): express.RequestHandler =>
    (req, res, next) => {
      const verdict = limiter.check(getClientIp(req));
      if (!verdict.allowed) {
        res.setHeader('Retry-After', String(verdict.retryAfterSec));
        res.status(429).json({
          error: `Too many requests. Please wait ${verdict.retryAfterSec}s before retrying.`,
        });
        return;
      }
      next();
    };

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  const handleTtsRequest: express.RequestHandler = async (req, res) => {
    try {
      const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
      if (!text) {
        res.status(400).json({ error: 'Lesson script text is required.' });
        return;
      }
      const profile: VoiceProfile = resolveVoiceProfile(req.body?.voiceProfile);
      const boundedText = text.slice(0, 2800);
      const audioBase64 = await generateStudioTtsWav(boundedText, profile);
      res.json({ audioBase64, mimeType: 'audio/wav' });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  };

  app.post('/api/chem/tts', enforceRateLimit(ttsLimiter), handleTtsRequest);
  app.post('/api/lab/tts', enforceRateLimit(ttsLimiter), handleTtsRequest);

  // Source A — Real Past Questions Fetcher Proxy (ALOC v1 API)
  app.post('/api/question-bank/aloc', enforceRateLimit(alocLimiter), async (req, res) => {
    try {
      const apiKey = typeof req.body?.apiKey === 'string' ? req.body.apiKey.trim() : '';
      const alocSlug = typeof req.body?.alocSlug === 'string' ? req.body.alocSlug.trim().toLowerCase() : '';
      const rawExamType = typeof req.body?.examType === 'string' ? req.body.examType.trim().toLowerCase() : 'jamb';
      const examType = rawExamType === 'waec' || rawExamType === 'neco' ? rawExamType : 'jamb';
      const rawLimit = Number(req.body?.limit);
      const limit = Number.isFinite(rawLimit) ? Math.min(25, Math.max(1, Math.floor(rawLimit))) : 15;
      const cursor = typeof req.body?.cursor === 'string' ? req.body.cursor.trim() : '';

      if (!isValidAlocApiKey(apiKey)) {
        res.status(400).json({ error: 'A valid ALOC API key is required.' });
        return;
      }
      if (!isValidAlocSlug(alocSlug)) {
        res.status(400).json({ error: 'Unsupported ALOC subject slug.' });
        return;
      }
      if (!isValidAlocCursor(cursor)) {
        res.status(400).json({ error: 'Invalid pagination cursor.' });
        return;
      }

      const url = new URL('https://dev.aloc.com.ng/api/v1/questions');
      url.searchParams.set('subject', alocSlug);
      url.searchParams.set('examType', examType);
      url.searchParams.set('limit', String(limit));
      if (cursor) {
        url.searchParams.set('cursor', cursor);
      }

      const upstream = await fetch(url.toString(), {
        method: 'GET',
        redirect: 'error',
        signal: AbortSignal.timeout(15_000),
        headers: {
          'X-API-Key': apiKey,
          Accept: 'application/json',
        },
      });

      const textBody = await upstream.text();
      if (textBody.length > 2 * 1024 * 1024) {
        res.status(502).json({ error: 'Upstream ALOC response exceeded safe size limit.' });
        return;
      }
      let parsed: unknown = null;
      try {
        parsed = textBody ? JSON.parse(textBody) : null;
      } catch {
        parsed = null;
      }

      if (!upstream.ok) {
        const safeStatus = upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502;
        const msg =
          safeStatus === 401 || safeStatus === 403
            ? 'ALOC rejected the API key. Check your key and try again.'
            : safeStatus === 429
              ? 'ALOC rate limit reached. Please pause and retry shortly.'
              : `ALOC API returned HTTP ${safeStatus}.`;
        res.status(safeStatus).json({ error: msg, status: safeStatus });
        return;
      }

      res.json(parsed ?? { data: [] });
    } catch {
      res.status(502).json({ error: 'Could not reach ALOC API within timeout.' });
    }
  });

  // Source B — Gemini Batch Question Generator (Structured JSON Output, 25 Qs/call)
  app.post('/api/question-bank/generate', enforceRateLimit(genLimiter), async (req, res) => {
    try {
      const subjectSpec = resolveAuthoritativeSubject(req.body?.subject);
      if (!subjectSpec) {
        res.status(400).json({ error: 'A valid curriculum subject ID is required.' });
        return;
      }
      const subject = subjectSpec.id;
      const subjectName = subjectSpec.fullName;
      const requiresLatex = subjectSpec.requiresLatex;
      const rawExamType = typeof req.body?.examType === 'string' ? req.body.examType.trim().toUpperCase() : 'MIXED';
      const examMode =
        rawExamType === 'JAMB' || rawExamType === 'WAEC' || rawExamType === 'NECO' ? rawExamType : 'MIXED';
      const rawBatch = Number(req.body?.batchSize);
      const batchSize = Number.isFinite(rawBatch) ? Math.min(25, Math.max(5, Math.floor(rawBatch))) : 25;
      const topics = Array.isArray(req.body?.topics)
        ? req.body.topics
            .map((t: unknown) => sanitizePromptSnippet(t, 100))
            .filter((t: string) => t.length > 0)
            .slice(0, 16)
        : [];
      const existingSamples = Array.isArray(req.body?.existingSamples)
        ? req.body.existingSamples
            .map((s: unknown) => sanitizePromptSnippet(s, 160))
            .filter((s: string) => s.length > 0)
            .slice(0, 15)
        : [];
      const batchIndex = Number.isFinite(Number(req.body?.batchIndex))
        ? Math.min(1000, Math.max(1, Math.floor(Number(req.body?.batchIndex))))
        : 1;

      const ai = createAiClient();

      const latexInstruction = requiresLatex
        ? 'CRITICAL FORMATTING RULE: Use clean inline LaTeX wrapped in single dollar signs ($...$) for ALL equations, algebraic expressions, powers, fractions, chemical formulas, ions, and SI units (e.g., $\\frac{2x^2 - 8}{x - 2}$, $H_2SO_4$, $v^2 = u^2 + 2as$, $6.02 \\times 10^{23}$). Never leave raw unescaped LaTeX outside $...$.'
        : 'Use crisp, unambiguous academic Nigerian SSCE/UTME phrasing with accurate technical terminology (e.g., SQL clauses, normalization forms 1NF-3NF, binary/hex values, Nigerian constitutional clauses, or agronomic/economic terms as appropriate).';

      const examInstruction =
        examMode === 'JAMB'
          ? 'Set examType strictly to "JAMB" (years 2015–2025). TOUGH JAMB CALIBRATION: Every question must demand deep conceptual understanding rather than surface recall, and options A, B, C, D MUST include tricky look-alike distractors (options that look very similar on the surface—such as near-miss signs, powers, concord/exception rules, or transposed ratios—that trap hasty candidates).'
          : examMode === 'WAEC'
            ? 'Set examType strictly to "WAEC" (years 2015–2025). WAEC MARKING-SCHEME CALIBRATION: Mirror authentic WASSCE Paper 1 & Paper 2 precision and explicitly test the common mistakes candidates make (omitted SI units, incomplete definitions, sign slips, and misread qualifiers).'
            : examMode === 'MIXED'
              ? 'Distribute examType authentically across "JAMB" (with tricky look-alike options requiring deep conceptual understanding), "WAEC", and "NECO" with realistic recent exam years between 2014 and 2025.'
              : `Set examType strictly to "${examMode}" for every question with realistic exam years between 2014 and 2025.`;

      const topicInstruction =
        topics.length > 0
          ? `Spread the ${batchSize} questions evenly across these official NERDC/JAMB/WAEC/NECO syllabus topics: ${topics.join('; ')}.`
          : `Spread the ${batchSize} questions across diverse core SS1–SS3 Nigerian NERDC/JAMB/WAEC/NECO syllabus topics for ${subjectName}.`;

      const avoidInstruction =
        existingSamples.length > 0
          ? `Do NOT repeat or closely paraphrase any of these already-stored questions:\n- ${existingSamples.join('\n- ')}`
          : 'Ensure every single question in this batch tests a distinct concept, numerical scenario, or application.';

      const prompt = [
        `You are a chief Nigerian Senior Secondary examiner for JAMB UTME, WAEC WASSCE, and NECO SSCE.`,
        `Generate exactly ${batchSize} authentic, high-rigor, syllabus-aligned multiple-choice questions for ${subjectName} (Batch #${batchIndex}).`,
        examInstruction,
        topicInstruction,
        latexInstruction,
        `Requirements for EVERY question:`,
        `1. Exactly 4 distinct options labeled A, B, C, D with plausible look-alike exam distractors (no "All of the above" laziness).`,
        `2. "answer" must be strictly one of "A", "B", "C", or "D" matching the true mathematically/factually verified option.`,
        `3. "explanation" must give a concise, step-by-step worked solution and highlight the common trap to avoid (2–3 sentences max).`,
        `4. Self-contained questions only (never reference "the diagram above" or "passage below" unless the full data/table/excerpt is included inside the question text).`,
        avoidInstruction,
      ].join('\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: `An array of exactly ${batchSize} syllabus-aligned ${subjectName} exam questions.`,
            items: {
              type: Type.OBJECT,
              properties: {
                examType: {
                  type: Type.STRING,
                  description: 'Must be JAMB, WAEC, or NECO',
                },
                year: {
                  type: Type.INTEGER,
                  description: 'Exam year between 2014 and 2025',
                },
                topic: {
                  type: Type.STRING,
                  description: 'Specific syllabus topic name',
                },
                question: {
                  type: Type.STRING,
                  description: 'Complete self-contained question stem',
                },
                options: {
                  type: Type.OBJECT,
                  properties: {
                    A: { type: Type.STRING },
                    B: { type: Type.STRING },
                    C: { type: Type.STRING },
                    D: { type: Type.STRING },
                  },
                  required: ['A', 'B', 'C', 'D'],
                },
                answer: {
                  type: Type.STRING,
                  description: 'Correct option letter: A, B, C, or D',
                },
                explanation: {
                  type: Type.STRING,
                  description: 'Concise worked solution explaining why the answer is correct',
                },
              },
              required: ['examType', 'year', 'topic', 'question', 'options', 'answer', 'explanation'],
            },
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        res.status(502).json({ error: 'Gemini returned an empty response for this batch.' });
        return;
      }

      let items: unknown;
      try {
        items = JSON.parse(rawText);
      } catch {
        res.status(502).json({ error: 'Gemini returned invalid JSON for this batch. Retrying...' });
        return;
      }

      if (!Array.isArray(items)) {
        res.status(502).json({ error: 'Gemini response was not an array of questions.' });
        return;
      }

      const validQuestions: Record<string, unknown>[] = [];
      const ts = Date.now();
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (!it || typeof it !== 'object') continue;
        const r = it as Record<string, unknown>;
        const qText = String(r.question || '').trim();
        const opt = (r.options || {}) as Record<string, unknown>;
        const A = String(opt.A ?? '').trim();
        const B = String(opt.B ?? '').trim();
        const C = String(opt.C ?? '').trim();
        const D = String(opt.D ?? '').trim();
        const ansRaw = String(r.answer || '').trim().toUpperCase();
        const answer = ansRaw === 'A' || ansRaw === 'B' || ansRaw === 'C' || ansRaw === 'D' ? ansRaw : null;
        if (qText.length < 6 || !A || !B || !C || !D || !answer) continue;

        const etRaw = String(r.examType || '').trim().toUpperCase();
        const examType =
          examMode !== 'MIXED'
            ? examMode
            : etRaw === 'WAEC' || etRaw === 'NECO' || etRaw === 'JAMB'
              ? etRaw
              : 'JAMB';
        const yrRaw = Number.parseInt(String(r.year ?? 2024), 10);
        const year = Number.isFinite(yrRaw) && yrRaw >= 2000 && yrRaw <= 2026 ? yrRaw : 2024;
        const topic = String(r.topic || 'General Syllabus').trim().slice(0, 120) || 'General Syllabus';
        const explanation = String(r.explanation || `Correct option is ${answer}.`).trim();

        validQuestions.push({
          id: `ai-${subject}-${ts}-${batchIndex}-${i}`,
          subject,
          examType,
          year,
          topic,
          question: qText,
          options: { A, B, C, D },
          answer,
          explanation,
          source: 'ai',
        });
      }

      res.json({
        questions: validQuestions,
        generatedCount: validQuestions.length,
        model: 'gemini-4-hydrogen',
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // ── Authenticated Cloud SQL (PostgreSQL) Persistence Endpoints ──
  app.get('/api/cloud/sync', enforceRateLimit(cloudDbLimiter), requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const row = await getCloudSyncState(uid);
      res.json({
        exists: Boolean(row),
        progress: row?.progress ?? null,
        schemaVersion: row?.schemaVersion ?? 1,
        updatedAtMs: row?.updatedAt instanceof Date ? row.updatedAt.getTime() : null,
      });
    } catch (err) {
      console.error('Failed to fetch cloud sync state:', err);
      res.status(500).json({ error: 'Unable to load cloud progress right now.' });
    }
  });

  app.post('/api/cloud/sync', enforceRateLimit(cloudDbLimiter), requireVerifiedAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || 'scholar@roadtocampus.local';
      const body = (req.body || {}) as Record<string, unknown>;
      const profileRaw = (body.profile && typeof body.profile === 'object' ? body.profile : {}) as Record<string, unknown>;
      const progressRaw =
        body.progress && typeof body.progress === 'object' && !Array.isArray(body.progress)
          ? (body.progress as Record<string, unknown>)
          : null;

      if (!progressRaw) {
        res.status(400).json({ error: 'A valid progress payload is required.' });
        return;
      }

      const lbRaw =
        body.leaderboard && typeof body.leaderboard === 'object' && !Array.isArray(body.leaderboard)
          ? (body.leaderboard as Record<string, unknown>)
          : null;

      const result = await saveCloudSyncBundle({
        profile: {
          uid,
          email,
          displayName: String(profileRaw.displayName || req.user!.name || 'Scholar'),
          target: Number(profileRaw.target ?? 70),
          xp: Number(profileRaw.xp ?? 0),
          streakCount: Number(profileRaw.streakCount ?? 0),
          activeSubj: String(profileRaw.activeSubj || 'maths'),
          examType: typeof profileRaw.examType === 'string' ? profileRaw.examType : null,
          examDate: typeof profileRaw.examDate === 'string' ? profileRaw.examDate : null,
        },
        progress: progressRaw,
        schemaVersion: Number(body.schemaVersion ?? 1),
        leaderboard: lbRaw
          ? {
              uid,
              email,
              displayName: String(lbRaw.displayName || profileRaw.displayName || req.user!.name || 'Scholar'),
              campusGoal: String(lbRaw.campusGoal ?? 'National Scholar'),
              primarySubj: String(lbRaw.primarySubj || 'maths'),
              isPublic: lbRaw.isPublic !== false,
              masteryIndex: Number(lbRaw.masteryIndex ?? 0),
              topicsPassed: Number(lbRaw.topicsPassed ?? 0),
              totalAnswered: Number(lbRaw.totalAnswered ?? 0),
              accuracyPct: Number(lbRaw.accuracyPct ?? 0),
              bestCbtScore: Number(lbRaw.bestCbtScore ?? 0),
              streakCount: Number(lbRaw.streakCount ?? 0),
              duelsCompleted: Number(lbRaw.duelsCompleted ?? 0),
              subjectMastery:
                lbRaw.subjectMastery && typeof lbRaw.subjectMastery === 'object'
                  ? (lbRaw.subjectMastery as Record<string, number>)
                  : {},
            }
          : undefined,
      });

      res.json(result);
    } catch (err) {
      console.error('Failed to save cloud sync bundle:', err);
      res.status(500).json({ error: 'Cloud sync is temporarily unavailable.' });
    }
  });

  app.get('/api/cloud/leaderboard', enforceRateLimit(cloudDbLimiter), requireAuth, async (_req: AuthRequest, res) => {
    try {
      const entries = await listPublicLeaderboard(100);
      res.json({ entries });
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      res.status(500).json({ error: 'Unable to load leaderboard standings right now.' });
    }
  });

  app.post('/api/cloud/leaderboard', enforceRateLimit(cloudDbLimiter), requireVerifiedAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || 'scholar@roadtocampus.local';
      const body = (req.body || {}) as Record<string, unknown>;

      const result = await upsertLeaderboardStanding({
        uid,
        email,
        displayName: String(body.displayName || req.user!.name || 'Scholar'),
        campusGoal: String(body.campusGoal ?? 'National Scholar'),
        primarySubj: String(body.primarySubj || 'maths'),
        isPublic: body.isPublic !== false,
        masteryIndex: Number(body.masteryIndex ?? 0),
        topicsPassed: Number(body.topicsPassed ?? 0),
        totalAnswered: Number(body.totalAnswered ?? 0),
        accuracyPct: Number(body.accuracyPct ?? 0),
        bestCbtScore: Number(body.bestCbtScore ?? 0),
        streakCount: Number(body.streakCount ?? 0),
        duelsCompleted: Number(body.duelsCompleted ?? 0),
        subjectMastery:
          body.subjectMastery && typeof body.subjectMastery === 'object'
            ? (body.subjectMastery as Record<string, number>)
            : {},
      });

      res.json(result);
    } catch (err) {
      console.error('Failed to update leaderboard standing:', err);
      res.status(500).json({ error: 'Unable to publish leaderboard standing right now.' });
    }
  });

  app.post('/api/cloud/duels', enforceRateLimit(cloudDbLimiter), requireVerifiedAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || 'scholar@roadtocampus.local';
      const body = (req.body || {}) as Record<string, unknown>;
      const duelId = typeof body.duelId === 'string' ? body.duelId.trim() : '';

      if (!/^[a-zA-Z0-9_-]{4,40}$/.test(duelId)) {
        res.status(400).json({ error: 'A valid duel code is required.' });
        return;
      }

      const result = await publishDuelAndScoreEntry({
        duelId,
        uid,
        email,
        displayName: String(body.displayName || req.user!.name || 'Scholar'),
        subject: String(body.subject || 'maths'),
        title: String(body.title || 'Study Duel'),
        seed: String(body.seed || 'DUEL01'),
        questionCount: Number(body.questionCount ?? 10),
        score: Number(body.score ?? 0),
        total: Number(body.total ?? 10),
        timeSeconds: Number(body.timeSeconds ?? 0),
      });

      res.json(result);
    } catch (err) {
      console.error('Failed to publish duel score:', err);
      res.status(500).json({ error: 'Unable to record duel result right now.' });
    }
  });

  app.get('/api/cloud/duels/:duelId/entries', enforceRateLimit(cloudDbLimiter), requireAuth, async (req: AuthRequest, res) => {
    try {
      const duelId = String(req.params.duelId || '').trim();
      if (!/^[a-zA-Z0-9_-]{4,40}$/.test(duelId)) {
        res.status(400).json({ error: 'Invalid duel code.' });
        return;
      }
      const entries = await listDuelEntriesByDuelId(duelId);
      res.json({ entries });
    } catch (err) {
      console.error('Failed to load duel entries:', err);
      res.status(500).json({ error: 'Unable to load duel entries right now.' });
    }
  });

  // ── Same-Day National CBT Cohort Standings (Ranks every student who wrote CBT today in WAT) ──
  const resolveCbtParticipantKey = async (req: express.Request): Promise<string | null> => {
    const decoded = await tryDecodeBearerToken(req);
    if (decoded?.uid) {
      const cleanUid = decoded.uid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);
      if (cleanUid) return `uid_${cleanUid}`;
    }
    const rawDeviceToken =
      typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : null;
    const { deviceKey } = deriveAuthoritativeDeviceKey(rawDeviceToken);
    return deviceKey;
  };

  app.get('/api/cloud/cbt-daily', enforceRateLimit(cloudDbLimiter), async (req, res) => {
    try {
      const watDayNumber = Math.floor((Date.now() + 3_600_000) / 86_400_000);
      const mode = String(req.query.mode || 'jamb').toLowerCase() === 'waec' ? 'waec' : 'jamb';
      const [myParticipantKey, entries] = await Promise.all([
        resolveCbtParticipantKey(req),
        listDailyCbtStandings(watDayNumber, mode, 150),
      ]);
      res.json({
        dayNumber: watDayNumber,
        mode,
        myParticipantKey,
        totalParticipants: entries.length,
        entries,
      });
    } catch (err) {
      console.error('Failed to load daily CBT standings:', err);
      res.status(500).json({ error: 'Unable to load today’s CBT cohort standings right now.' });
    }
  });

  app.post('/api/cloud/cbt-daily', enforceRateLimit(cloudDbLimiter), async (req, res) => {
    try {
      const myParticipantKey = await resolveCbtParticipantKey(req);
      if (!myParticipantKey) {
        res.status(401).json({ error: 'Valid student session or device token required to rank CBT.' });
        return;
      }
      const watDayNumber = Math.floor((Date.now() + 3_600_000) / 86_400_000);
      const body = (req.body || {}) as Record<string, unknown>;
      const mode = String(body.mode || 'jamb').toLowerCase() === 'waec' ? 'waec' : 'jamb';
      const entries = await upsertDailyCbtStanding({
        dayNumber: watDayNumber,
        mode,
        participantKey: myParticipantKey,
        displayName: sanitizePromptSnippet(body.displayName || 'Scholar', 60) || 'Scholar',
        campusGoal: sanitizePromptSnippet(body.campusGoal || 'National Scholar', 48) || 'National Scholar',
        scaledScore: Number(body.scaledScore ?? 0),
        maxScale: mode === 'waec' ? 100 : 400,
        rawCorrect: Number(body.rawCorrect ?? 0),
        totalQuestions: Number(body.totalQuestions ?? 40),
        accuracyPct: Number(body.accuracyPct ?? 0),
        durationSec: Number(body.durationSec ?? 600),
      });
      res.json({
        ok: true,
        dayNumber: watDayNumber,
        mode,
        myParticipantKey,
        totalParticipants: entries.length,
        entries,
      });
    } catch (err) {
      console.error('Failed to record daily CBT standing:', err);
      res.status(500).json({ error: 'Unable to publish today’s CBT score right now.' });
    }
  });

  // ── EYAK Premium Pass, Voucher Activation & Paystack Checkout Endpoints ──
  app.get('/api/billing/status', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const decoded = await tryDecodeBearerToken(req);
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : null;
      const [pro, trial, entitlementPublicKey] = await Promise.all([
        getActiveSubscriptionReceipt({
          uid: decoded?.uid || null,
          deviceToken: rawDeviceToken,
          email: decoded?.email || null,
        }),
        getOrCreateTrialReceipt({
          uid: decoded?.uid || null,
          deviceToken: rawDeviceToken,
        }),
        getEntitlementPublicKeyJwk(),
      ]);
      res.json({
        plans: PREMIUM_PLANS,
        paystackEnabled: Boolean(process.env.PAYSTACK_SECRET_KEY?.trim()),
        isAdmin: isAdminDecodedUser(decoded),
        entitlementPublicKey,
        pro,
        trial,
      });
    } catch (err) {
      console.error('Failed to check billing status:', err);
      res.status(500).json({ error: 'Unable to check subscription status right now.' });
    }
  });

  app.post('/api/billing/redeem', enforceRateLimit(redeemLimiter), async (req, res) => {
    try {
      const decoded = await tryDecodeBearerToken(req);
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : null;
      const [result, entitlementPublicKey] = await Promise.all([
        redeemAccessVoucher({
          rawCode: req.body?.code,
          deviceToken: rawDeviceToken,
          uid: decoded?.uid || null,
          email: decoded?.email || null,
        }),
        getEntitlementPublicKeyJwk(),
      ]);
      res.json({ ok: true, entitlementPublicKey, ...result });
    } catch (err) {
      if (err instanceof BillingUserError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      console.error('Failed to redeem Pass PIN:', err);
      res.status(500).json({ error: 'Unable to verify Pass PIN right now. Please retry.' });
    }
  });

  app.post('/api/billing/paystack/initialize', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();
      if (!secretKey) {
        res.status(503).json({
          error:
            'Online card and bank-transfer checkout is not enabled yet. Switch to Enter Pass PIN to activate immediately.',
        });
        return;
      }

      const plan = getPremiumPlanById(typeof req.body?.planId === 'string' ? req.body.planId : '');
      if (!plan) {
        res.status(400).json({ error: 'Choose a valid EYAK Premium plan.' });
        return;
      }
      if (!isValidEmailAddress(req.body?.email)) {
        res.status(400).json({ error: 'Enter a valid email address for your payment receipt.' });
        return;
      }
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';
      if (!isValidDeviceSecretToken(rawDeviceToken)) {
        res.status(400).json({ error: 'A valid secure device session is required. Refresh and retry.' });
        return;
      }

      const decoded = await tryDecodeBearerToken(req);
      const safeEmail = String(req.body.email).trim().toLowerCase();
      const { deviceKey } = deriveAuthoritativeDeviceKey(rawDeviceToken);
      const reference = `eyak_${plan.id}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const callbackUrl = buildSafeBillingCallbackUrl(req, reference);

      const upstream = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(12_000),
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: safeEmail,
          amount: plan.priceKobo,
          currency: 'NGN',
          reference,
          callback_url: callbackUrl,
          metadata: {
            planId: plan.id,
            deviceId: deviceKey || '',
            uid: decoded?.uid || '',
          },
        }),
      });

      const payload = (await upstream.json().catch(() => null)) as {
        status?: boolean;
        message?: string;
        data?: { authorization_url?: string; reference?: string };
      } | null;

      const authUrl = payload?.data?.authorization_url || '';
      const isTrustedPaystackCheckout =
        authUrl.startsWith('https://checkout.paystack.com/') ||
        authUrl.startsWith('https://standard.paystack.co/');

      if (!upstream.ok || !payload?.status || !isTrustedPaystackCheckout) {
        res.status(502).json({
          error: 'Could not start Paystack checkout right now. Please try again or use a Pass PIN.',
        });
        return;
      }

      const finalRef =
        typeof payload?.data?.reference === 'string' && isValidPaystackReference(payload.data.reference)
          ? payload.data.reference.trim()
          : reference;

      await createPendingPaystackTransaction({
        reference: finalRef,
        planId: plan.id,
        amountKobo: plan.priceKobo,
        email: safeEmail,
        uid: decoded?.uid || null,
        deviceToken: rawDeviceToken,
      });

      res.json({
        ok: true,
        authorizationUrl: authUrl,
        reference: finalRef,
      });
    } catch (err) {
      console.error('Failed to initialize Paystack transaction:', err);
      res.status(502).json({ error: 'Unable to reach Paystack right now. Please retry shortly.' });
    }
  });

  app.post('/api/billing/paystack/verify', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();
      if (!secretKey) {
        res.status(503).json({ error: 'Online payment verification is not configured.' });
        return;
      }

      const rawRef = typeof req.body?.reference === 'string' ? req.body.reference.trim() : '';
      if (!isValidPaystackReference(rawRef)) {
        res.status(400).json({ error: 'A valid payment reference is required.' });
        return;
      }
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';
      if (!isValidDeviceSecretToken(rawDeviceToken)) {
        res.status(400).json({ error: 'A valid secure device session is required. Refresh and retry.' });
        return;
      }

      const decoded = await tryDecodeBearerToken(req);
      const upstream = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(rawRef)}`,
        {
          method: 'GET',
          redirect: 'error',
          signal: AbortSignal.timeout(12_000),
          headers: {
            Authorization: `Bearer ${secretKey}`,
            Accept: 'application/json',
          },
        }
      );

      const payload = (await upstream.json().catch(() => null)) as {
        status?: boolean;
        data?: {
          status?: string;
          amount?: number;
          currency?: string;
          customer?: { email?: string };
          metadata?: { planId?: string };
        };
      } | null;

      if (!upstream.ok || !payload?.status || !payload.data) {
        res.status(502).json({ error: 'Could not verify transaction with Paystack right now.' });
        return;
      }

      if (payload.data.status !== 'success') {
        res.status(402).json({
          error:
            'Payment is not marked complete yet. Finish checkout on Paystack, then tap Verify payment status.',
        });
        return;
      }

      const planMeta = getPremiumPlanById(payload.data.metadata?.planId || null);
      const [completed, entitlementPublicKey] = await Promise.all([
        completeVerifiedPaystackTransaction({
          reference: rawRef,
          verifiedPlanId: planMeta?.id || null,
          paidAmountKobo: Number(payload.data.amount || 0),
          currency: String(payload.data.currency || 'NGN'),
          customerEmail: String(payload.data.customer?.email || decoded?.email || 'student@eyak.ng'),
          deviceToken: rawDeviceToken,
          uid: decoded?.uid || null,
        }),
        getEntitlementPublicKeyJwk(),
      ]);

      res.json({ ok: true, entitlementPublicKey, ...completed });
    } catch (err) {
      if (err instanceof BillingUserError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      console.error('Failed to verify Paystack transaction:', err);
      res.status(502).json({ error: 'Unable to verify payment right now. Please retry shortly.' });
    }
  });

  // ── Owner / Admin Pass PIN Studio Endpoints ──
  app.get(
    '/api/admin/billing/overview',
    enforceRateLimit(billingLimiter),
    requireVerifiedAuth,
    async (req: AuthRequest, res) => {
      if (!isAdminDecodedUser(req.user)) {
        res.status(403).json({ error: 'Forbidden: Owner account required.' });
        return;
      }
      try {
        const overview = await getAdminBillingOverview();
        res.json(overview);
      } catch (err) {
        console.error('Failed to load admin billing overview:', err);
        res.status(500).json({ error: 'Unable to load voucher overview right now.' });
      }
    }
  );

  app.post(
    '/api/admin/billing/vouchers',
    enforceRateLimit(billingLimiter),
    requireVerifiedAuth,
    async (req: AuthRequest, res) => {
      if (!isAdminDecodedUser(req.user)) {
        res.status(403).json({ error: 'Forbidden: Owner account required.' });
        return;
      }
      try {
        const batch = await createAdminVoucherBatch({
          planId: typeof req.body?.planId === 'string' ? req.body.planId : '',
          count: Number(req.body?.count ?? 1),
          note: typeof req.body?.note === 'string' ? req.body.note : '',
          adminEmail: req.user!.email!,
        });
        res.json({ ok: true, batch });
      } catch (err) {
        if (err instanceof BillingUserError) {
          res.status(err.statusCode).json({ error: err.message });
          return;
        }
        console.error('Failed to generate admin voucher batch:', err);
        res.status(500).json({ error: 'Unable to generate Pass PINs right now.' });
      }
    }
  );

  // Allowlisted, bounded-cache scripture reference proxies (CRS 5-version Bible & IRS 5-edition Qur'an)
  const bibleCache = new Map<string, Record<string, unknown>>();
  const quranCache = new Map<number, Record<string, unknown>>();

  const BOLLS_BIBLE_VERSIONS = new Set(['rsv', 'nkjv', 'gnt', 'nlt', 'amp', 'esv', 'msg', 'nasb', 'erv']);
  const BIBLE_VERSION_LABELS: Record<string, string> = {
    rsv: 'Revised Standard Version',
    kjv: 'King James Version',
    nkjv: 'New King James Version',
    gnt: 'Good News Translation',
    nlt: 'New Living Translation',
    amp: 'Amplified Bible',
    esv: 'English Standard Version',
    msg: 'The Message',
    nasb: 'New American Standard Bible',
    erv: 'Easy-to-Read Version',
    web: 'World English Bible',
    bbe: 'Bible in Basic English',
  };

  app.get('/api/reference/bible', enforceRateLimit(refLimiter), async (req, res) => {
    const check = validateBibleQuery(req.query.book, req.query.chapter, req.query.version);
    if (!check.ok) {
      res.status(400).json({ error: check.error });
      return;
    }
    const cacheKey = `${check.book}|${check.chapter}|${check.version}`;
    const cached = bibleCache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }
    try {
      let verses: Array<{ verse: number; text: string }> = [];
      let reference = `${check.book} ${check.chapter}`;
      let versionName = BIBLE_VERSION_LABELS[check.version] || check.version.toUpperCase();

      if (BOLLS_BIBLE_VERSIONS.has(check.version)) {
        const bollsCode = check.version.toUpperCase();
        const upstreamUrl = `https://bolls.life/get-text/${encodeURIComponent(bollsCode)}/${check.bookNumber}/${check.chapter}/`;
        const upstream = await fetch(upstreamUrl, {
          signal: AbortSignal.timeout(8000),
          headers: { Accept: 'application/json', 'User-Agent': 'EYAK-Study-Reader/1.0' },
        });
        if (!upstream.ok) {
          res.status(502).json({ error: 'Could not reach the online Bible library right now.' });
          return;
        }
        const rawText = await upstream.text();
        if (rawText.length > 500_000) {
          res.status(502).json({ error: 'Chapter response was too large.' });
          return;
        }
        const list = JSON.parse(rawText) as Array<{ verse?: number; text?: string }>;
        verses = Array.isArray(list)
          ? list
              .filter((v) => typeof v?.verse === 'number' && typeof v?.text === 'string')
              .map((v) => ({ verse: Number(v.verse), text: cleanBibleVerseText(String(v.text)) }))
              .filter((v) => v.text.length > 0)
          : [];
      } else {
        const upstreamUrl = `https://bible-api.com/${encodeURIComponent(`${check.book} ${check.chapter}`)}?translation=${encodeURIComponent(check.version)}`;
        const upstream = await fetch(upstreamUrl, {
          signal: AbortSignal.timeout(8000),
          headers: { Accept: 'application/json', 'User-Agent': 'EYAK-Study-Reader/1.0' },
        });
        if (!upstream.ok) {
          res.status(502).json({ error: 'Could not reach the online Bible library right now.' });
          return;
        }
        const rawText = await upstream.text();
        if (rawText.length > 400_000) {
          res.status(502).json({ error: 'Chapter response was too large.' });
          return;
        }
        const data = JSON.parse(rawText) as {
          reference?: string;
          translation_name?: string;
          verses?: Array<{ verse?: number; text?: string }>;
        };
        if (typeof data.reference === 'string') reference = data.reference;
        if (typeof data.translation_name === 'string') versionName = data.translation_name;
        verses = Array.isArray(data.verses)
          ? data.verses
              .filter((v) => typeof v?.verse === 'number' && typeof v?.text === 'string')
              .map((v) => ({ verse: Number(v.verse), text: cleanBibleVerseText(String(v.text)) }))
              .filter((v) => v.text.length > 0)
          : [];
      }

      if (!verses.length) {
        res.status(404).json({ error: 'No verses were found for that chapter.' });
        return;
      }
      const payload = {
        book: check.book,
        chapter: check.chapter,
        version: check.version,
        versionName,
        reference,
        verses,
        source: 'live',
      };
      if (bibleCache.size >= 400) {
        const oldest = bibleCache.keys().next().value;
        if (oldest) bibleCache.delete(oldest);
      }
      bibleCache.set(cacheKey, payload);
      res.json(payload);
    } catch {
      res.status(502).json({ error: 'Online Bible service is temporarily unreachable.' });
    }
  });

  app.get('/api/reference/quran', enforceRateLimit(refLimiter), async (req, res) => {
    const check = validateQuranSurah(req.query.surah);
    if (!check.ok) {
      res.status(400).json({ error: check.error });
      return;
    }
    const cached = quranCache.get(check.surah);
    if (cached) {
      res.json(cached);
      return;
    }
    try {
      const upstreamUrl = `https://api.alquran.cloud/v1/surah/${check.surah}/editions/quran-uthmani,en.transliteration,en.sahih,en.yusufali,en.pickthall`;
      const upstream = await fetch(upstreamUrl, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: 'application/json', 'User-Agent': 'EYAK-Study-Reader/1.0' },
      });
      if (!upstream.ok) {
        res.status(502).json({ error: 'Could not reach the online Qur’an library right now.' });
        return;
      }
      const rawText = await upstream.text();
      if (rawText.length > 1_200_000) {
        res.status(502).json({ error: 'Surah response was too large.' });
        return;
      }
      const parsed = JSON.parse(rawText) as {
        data?: Array<{
          englishName?: string;
          name?: string;
          ayahs?: Array<{ numberInSurah?: number; text?: string }>;
        }>;
      };
      const editions = Array.isArray(parsed.data) ? parsed.data : [];
      if (editions.length < 5 || !Array.isArray(editions[0]?.ayahs)) {
        res.status(502).json({ error: 'Incomplete Surah data received.' });
        return;
      }
      const baseAyahs = editions[0].ayahs;
      const ayahs = baseAyahs.map((a, idx) => ({
        numberInSurah: Number(a.numberInSurah || idx + 1),
        arabic: String(a.text || '').trim(),
        transliteration: String(editions[1]?.ayahs?.[idx]?.text || '').trim(),
        sahih: String(editions[2]?.ayahs?.[idx]?.text || '').trim(),
        yusufali: String(editions[3]?.ayahs?.[idx]?.text || '').trim(),
        pickthall: String(editions[4]?.ayahs?.[idx]?.text || '').trim(),
      }));
      const payload = {
        surah: check.surah,
        name: String(editions[0].name || ''),
        englishName: String(editions[0].englishName || `Surah ${check.surah}`),
        ayahs,
        source: 'live',
      };
      if (quranCache.size >= 120) {
        const oldest = quranCache.keys().next().value;
        if (oldest !== undefined) quranCache.delete(oldest);
      }
      quranCache.set(check.surah, payload);
      res.json(payload);
    } catch {
      res.status(502).json({ error: 'Online Qur’an service is temporarily unreachable.' });
    }
  });

  const server = http.createServer(app);

  // WebSocket Server for Real-Time Gemini Live Tutor (bounded payload, CSWSH Origin guard, session caps)
  const wss = new WebSocketServer({ noServer: true, maxPayload: 256 * 1024 });
  const activeWsByIp = new Map<string, number>();
  let totalActiveWs = 0;
  const MAX_WS_PER_IP = 6;
  const MAX_TOTAL_WS = 100;
  const WS_IDLE_TIMEOUT_MS = 10 * 60 * 1000;
  const EXTRA_ALLOWED_WS_ORIGINS = [process.env.APP_URL, process.env.SHARED_APP_URL].filter(
    (v): v is string => typeof v === 'string' && v.trim().length > 0
  );

  server.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname !== '/api/chem/live') {
        socket.destroy();
        return;
      }
      const originHeader = typeof request.headers.origin === 'string' ? request.headers.origin : undefined;
      const hostHeader = typeof request.headers.host === 'string' ? request.headers.host : undefined;
      const forwardedHost =
        typeof request.headers['x-forwarded-host'] === 'string'
          ? request.headers['x-forwarded-host']
          : typeof request.headers['x-original-host'] === 'string'
            ? request.headers['x-original-host']
            : undefined;
      const secFetchSite =
        typeof request.headers['sec-fetch-site'] === 'string'
          ? request.headers['sec-fetch-site']
          : undefined;
      if (
        !isAllowedWebSocketOrigin(originHeader, hostHeader, {
          forwardedHost,
          secFetchSite,
          extraAllowedOrigins: EXTRA_ALLOWED_WS_ORIGINS,
        })
      ) {
        console.warn('[ws] Rejected Live Studio upgrade origin:', {
          origin: originHeader,
          host: hostHeader,
          forwardedHost,
          secFetchSite,
        });
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }
      const clientIp = getClientIp(request);
      if (!wsUpgradeLimiter.check(clientIp).allowed) {
        socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
        socket.destroy();
        return;
      }
      const ipCount = activeWsByIp.get(clientIp) || 0;
      if (ipCount >= MAX_WS_PER_IP || totalActiveWs >= MAX_TOTAL_WS) {
        socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
        socket.destroy();
        return;
      }
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', (clientWs: WebSocket, request: http.IncomingMessage) => {
    const clientIp = getClientIp(request);
    activeWsByIp.set(clientIp, (activeWsByIp.get(clientIp) || 0) + 1);
    totalActiveWs++;

    let sessionPromise: Promise<Session> | null = null;
    let closed = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const pingTimer = setInterval(() => {
      if (!closed && clientWs.readyState === WebSocket.OPEN) {
        try {
          clientWs.ping();
        } catch {
          /* ignore ping errors */
        }
      }
    }, 25_000);
    const msgLimiter = new SlidingWindowRateLimiter({ maxRequests: 600, windowMs: 10_000, maxKeys: 10 });

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!closed) {
          clientWs.close(1000, 'Idle timeout');
        }
      }, WS_IDLE_TIMEOUT_MS);
    };
    resetIdleTimer();

    const safeSend = (payload: Record<string, unknown>) => {
      if (!closed && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    const connectLiveSession = (
      systemInstruction: string,
      greetPrompt?: string,
      liveProfile: VoiceProfile = 'chem'
    ) => {
      try {
        const ai = createAiClient();
        const voiceName = SUBJECT_TUTOR_REGISTRY[voiceProfileToSubjectId(liveProfile)].geminiVoice;
        const p = ai.live.connect({
          model: 'gemini-3.8-live',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction,
          },
          callbacks: {
            onopen: () => {
              safeSend({ type: 'ready' });
            },
            onmessage: (message: LiveServerMessage) => {
              const content = message.serverContent;
              if (content?.inputTranscription?.text) {
                safeSend({ type: 'inputTranscript', text: content.inputTranscription.text });
              }
              if (content?.outputTranscription?.text) {
                safeSend({ type: 'outputTranscript', text: content.outputTranscription.text });
              }
              for (const part of content?.modelTurn?.parts ?? []) {
                if (part.inlineData?.data) {
                  safeSend({ type: 'audio', audio: part.inlineData.data });
                }
              }
              if (content?.interrupted) {
                safeSend({ type: 'interrupted' });
              }
              if (content?.turnComplete) {
                safeSend({ type: 'turnComplete' });
              }
            },
            onerror: (err: unknown) => {
              const formatted = formatGeminiError(err);
              safeSend({ type: 'error', error: formatted.message });
            },
            onclose: () => {
              safeSend({ type: 'closed' });
            },
          },
        });

        p.then((session) => {
          if (closed) {
            session.close();
            return;
          }
          if (greetPrompt) {
            session.sendClientContent({
              turns: [{ role: 'user', parts: [{ text: greetPrompt }] }],
              turnComplete: true,
            });
          }
        }).catch((err) => {
          const formatted = formatGeminiError(err);
          safeSend({ type: 'error', error: formatted.message });
        });

        return p;
      } catch (err) {
        const formatted = formatGeminiError(err);
        safeSend({ type: 'error', error: formatted.message });
        return null;
      }
    };

    clientWs.on('message', (raw) => {
      try {
        resetIdleTimer();
        if (!msgLimiter.check('msg').allowed) {
          return;
        }
        const rawStr = raw.toString();
        if (rawStr.length > 200_000) return;
        const msg = JSON.parse(rawStr);
        if (msg.type === 'init' && !sessionPromise) {
          const liveProfile: VoiceProfile = resolveVoiceProfile(msg.voiceProfile);
          const meta = SUBJECT_TUTOR_REGISTRY[voiceProfileToSubjectId(liveProfile)];
          const defaultPersona = `You are an experienced Nigerian ${meta.name} (${meta.roleTitle}) mentoring a secondary school student preparing for JAMB UTME and WAEC/NECO. CRITICAL: Never introduce yourself by name, title, or welcome the student to a studio or lab; jump straight into teaching or answering.`;
          // Always anchor with non-overridable server-side safety directive
          const sys = buildHardenedTutorSystemPrompt(defaultPersona, msg.systemInstruction);
          const greet =
            typeof msg.greetPrompt === 'string' && msg.greetPrompt.trim()
              ? sanitizePromptSnippet(msg.greetPrompt, 400)
              : undefined;
          sessionPromise = connectLiveSession(sys, greet, liveProfile);
          return;
        }

        if (!sessionPromise) return;

        if (msg.type === 'audio' && typeof msg.data === 'string' && msg.data.length <= 140_000) {
          sessionPromise
            .then((session) => {
              if (!closed) {
                session.sendRealtimeInput({
                  audio: { data: msg.data, mimeType: 'audio/pcm;rate=16000' },
                });
              }
            })
            .catch(() => {});
        } else if (msg.type === 'text' && typeof msg.text === 'string' && msg.text.trim()) {
          const userText = sanitizePromptSnippet(msg.text, 600);
          if (!userText) return;
          sessionPromise
            .then((session) => {
              if (!closed) {
                session.sendClientContent({
                  turns: [{ role: 'user', parts: [{ text: userText }] }],
                  turnComplete: true,
                });
              }
            })
            .catch(() => {});
        } else if (msg.type === 'context' && typeof msg.text === 'string' && msg.text.trim()) {
          const ctxText = sanitizePromptSnippet(msg.text, 700);
          if (!ctxText) return;
          const shouldSpeak = Boolean(msg.speak);
          sessionPromise
            .then((session) => {
              if (!closed) {
                session.sendClientContent({
                  turns: [{ role: 'user', parts: [{ text: ctxText }] }],
                  turnComplete: shouldSpeak,
                });
              }
            })
            .catch(() => {});
        }
      } catch {
        /* ignore malformed ws frame */
      }
    });

    clientWs.on('close', () => {
      closed = true;
      if (idleTimer) clearTimeout(idleTimer);
      clearInterval(pingTimer);
      totalActiveWs = Math.max(0, totalActiveWs - 1);
      const nextCount = (activeWsByIp.get(clientIp) || 1) - 1;
      if (nextCount <= 0) activeWsByIp.delete(clientIp);
      else activeWsByIp.set(clientIp, nextCount);
      if (sessionPromise) {
        sessionPromise.then((session) => session.close()).catch(() => {});
      }
    });
  });

  if (!IS_PROD) {
    // Serve a WebSocket-free @vite/client shim because HMR is intentionally disabled
    // in this environment and Vite 8 middlewareMode otherwise opens a port-24678 WS.
    app.get('/@vite/client', (_req, res) => {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(`
const sheetsMap = new Map();
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  }
  style.textContent = content;
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    style.remove();
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url) {
  return url;
}
export class ErrorOverlay extends HTMLElement {}
`);
    });

    const viteReadyPromise = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
        appType: 'spa',
      })
    );
    viteReadyPromise.catch((err) => {
      console.error('Failed to initialize Vite dev middleware:', err);
    });

    app.use(async (req, res, next) => {
      try {
        const vite = await viteReadyPromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`EYAK server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
