import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, ThinkingLevel, Type, type LiveServerMessage, type Session } from '@google/genai';
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
  recoverEmailPasswordViaGoogle,
  registerUniqueEmailAccount,
  saveCloudSyncBundle,
  upsertDailyCbtStanding,
  upsertLeaderboardStanding,
  verifyEmailPasswordLogin,
} from './src/db/repository.ts';
import {
  BillingUserError,
  cancelLinkedTrial,
  cancelRecurringSubscription,
  completeVerifiedPaystackTransaction,
  createOwnerPassPins,
  createPendingPaystackTransaction,
  deriveAuthoritativeDeviceKey,
  getActiveSubscriptionReceipt,
  getAdminBillingOverview,
  getEntitlementPublicKeyJwk,
  getLinkedTrialSubscription,
  getOrCreateTrialReceipt,
  getSubscriptionAutoRenewState,
  linkAndStartOneDayTrial,
  listOwnerPassPins,
  redeemAccessPassPin,
  resumeRecurringSubscription,
  revokeOwnerPassPin,
} from './src/db/billingRepository.ts';
import {
  PREMIUM_PLANS,
  calculatePaystackSeatQuote,
  getPremiumPlanById,
  isConfiguredPaystackSecretKey,
  isValidDeviceSecretToken,
  isValidEmailAddress,
  isValidPaystackReference,
  parseScholarEmailList,
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

const NOVEL_NARRATOR_WARM_STYLE =
  'A warm, deeply expressive West African literary audiobook narrator reading a celebrated novel study chapter aloud with vivid emotional cadence, crisp diction, thoughtful pauses between turning points, and engaging storyteller presence.';

const NOVEL_NARRATOR_CLASSIC_STYLE =
  'A poised, resonant classic literary narrator with BBC-calibre articulation, rich dramatic pacing, clear character emphasis, and unhurried storytelling clarity for serious examination scholars.';

const NOVEL_NARRATOR_CLEAR_STYLE =
  'A bright, crystal-clear, encouraging female Nigerian literature educator narrating chapter events and memory anchors aloud with lively rhythm, crisp pronunciation of African and English names, and high recall clarity.';

type VoiceProfile =
  | SubjectId
  | 'math'
  | 'fmath'
  | 'mathLab'
  | 'novelWarm'
  | 'novelClassic'
  | 'novelClear';

function resolveVoiceProfile(raw: unknown): VoiceProfile {
  if (typeof raw !== 'string') return 'eng';
  if (
    raw === 'math' ||
    raw === 'fmath' ||
    raw === 'mathLab' ||
    raw === 'novelWarm' ||
    raw === 'novelClassic' ||
    raw === 'novelClear'
  ) {
    return raw;
  }
  if (Object.prototype.hasOwnProperty.call(SUBJECT_TUTOR_REGISTRY, raw)) {
    return raw as SubjectId;
  }
  return 'eng';
}

function voiceProfileToSubjectId(profile: VoiceProfile): SubjectId {
  if (profile === 'math' || profile === 'mathLab') return 'maths';
  if (profile === 'fmath') return 'fmaths';
  if (profile === 'novelWarm' || profile === 'novelClassic' || profile === 'novelClear') {
    return 'lit';
  }
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

// Bounded in-memory + persistent tmpdir cache + in-flight deduplication + 429 backoff
const ttsCache = new Map<string, string>();
const inFlightTts = new Map<string, Promise<string>>();
const MAX_TTS_CACHE = 256;
const TTS_DISK_DIR = path.join(os.tmpdir(), 'eyak-studio-tts-v3');
let ttsUpstreamChain: Promise<void> = Promise.resolve();

function getDiskCachePath(cacheKey: string): string {
  const digest = crypto.createHash('sha256').update(cacheKey).digest('hex');
  return path.join(TTS_DISK_DIR, `${digest}.b64`);
}

function readCachedTts(cacheKey: string): string | null {
  const mem = ttsCache.get(cacheKey);
  if (mem) return mem;
  try {
    const filePath = getDiskCachePath(cacheKey);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8').trim();
      if (data.length > 64) {
        setMemoryCachedTts(cacheKey, data);
        return data;
      }
    }
  } catch {
    /* ignore disk cache read errors */
  }
  return null;
}

function setMemoryCachedTts(key: string, audioBase64: string) {
  if (ttsCache.size >= MAX_TTS_CACHE) {
    const oldest = ttsCache.keys().next().value;
    if (oldest) ttsCache.delete(oldest);
  }
  ttsCache.set(key, audioBase64);
}

function persistCachedTts(key: string, audioBase64: string) {
  setMemoryCachedTts(key, audioBase64);
  try {
    fs.mkdirSync(TTS_DISK_DIR, { recursive: true });
    fs.writeFileSync(getDiskCachePath(key), audioBase64, 'utf8');
  } catch {
    /* ignore disk cache write errors */
  }
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function wrapPcm24kMonoToWav(pcm: Buffer, sampleRate = 24000): Buffer {
  const header = Buffer.alloc(44);
  const dataLen = pcm.length;
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + dataLen, 4);
  header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii');
  header.writeUInt32LE(16, 16); // PCM subchunk size
  header.writeUInt16LE(1, 20); // AudioFormat = 1 (Linear PCM)
  header.writeUInt16LE(1, 22); // NumChannels = 1 (Mono)
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // ByteRate = sampleRate * 1 * 2
  header.writeUInt16LE(2, 32); // BlockAlign
  header.writeUInt16LE(16, 34); // BitsPerSample
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(dataLen, 40);
  return Buffer.concat([header, pcm]);
}

async function synthesizeViaGeminiLiveWav(
  ai: GoogleGenAI,
  scriptText: string,
  voiceName: string,
  stylePrompt: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const pcmChunks: Buffer[] = [];
    let settled = false;
    let liveSession: Session | null = null;

    const finish = (err?: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          /* ignore */
        }
        liveSession = null;
      }
      if (err) {
        reject(err);
        return;
      }
      const combinedPcm = Buffer.concat(pcmChunks);
      if (combinedPcm.length < 480) {
        reject(new Error('Studio audio stream returned empty.'));
        return;
      }
      const wavBuf = wrapPcm24kMonoToWav(combinedPcm, 24000);
      resolve(wavBuf.toString('base64'));
    };

    const timeoutId = setTimeout(() => {
      if (pcmChunks.length > 0) {
        finish();
      } else {
        finish(new Error('Timed out waiting for studio voice audio.'));
      }
    }, 14_000);

    const sessionPromise = ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
        systemInstruction:
          `${stylePrompt}\n\n` +
          'CRITICAL VOICEOVER MODE: Speak ONLY the exact text provided by the user verbatim, in your natural spoken classroom voice. Do NOT add any extra words, preambles, or commentary before or after.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const content = message.serverContent;
          for (const part of content?.modelTurn?.parts ?? []) {
            if (part.inlineData?.data) {
              pcmChunks.push(Buffer.from(part.inlineData.data, 'base64'));
            }
          }
          if (content?.turnComplete) {
            finish();
          }
        },
        onerror: (err: unknown) => {
          finish(err);
        },
        onclose: () => {
          if (!settled) {
            if (pcmChunks.length > 0) finish();
            else finish(new Error('Studio audio session closed before audio arrived.'));
          }
        },
      },
    });

    sessionPromise
      .then((session) => {
        if (settled) {
          session.close();
          return;
        }
        liveSession = session;
        session.sendClientContent({
          turns: [{ role: 'user', parts: [{ text: scriptText }] }],
          turnComplete: true,
        });
      })
      .catch((err) => {
        finish(err);
      });
  });
}

async function generateStudioTtsWav(scriptText: string, profile: VoiceProfile = 'chem'): Promise<string> {
  const cacheKey = `tts-v3:${profile}:${scriptText}`;
  const hit = readCachedTts(cacheKey);
  if (hit) return hit;

  const existingFlight = inFlightTts.get(cacheKey);
  if (existingFlight) return existingFlight;

  const flight = (async (): Promise<string> => {
    const prev = ttsUpstreamChain;
    let releaseQueue!: () => void;
    ttsUpstreamChain = new Promise<void>((resolve) => {
      releaseQueue = resolve;
    });
    await prev.catch(() => {});

    try {
      const recheck = readCachedTts(cacheKey);
      if (recheck) return recheck;

      const ai = createAiClient();
      const isMathLab = profile === 'mathLab';
      const subjId = voiceProfileToSubjectId(profile);
      const meta = SUBJECT_TUTOR_REGISTRY[subjId];
      const voiceName =
        profile === 'novelWarm'
          ? 'Charon'
          : profile === 'novelClassic'
            ? 'Fenrir'
            : profile === 'novelClear'
              ? 'Kore'
              : isMathLab
                ? 'Puck'
                : meta.geminiVoice;
      const stylePrompt =
        profile === 'novelWarm'
          ? NOVEL_NARRATOR_WARM_STYLE
          : profile === 'novelClassic'
            ? NOVEL_NARRATOR_CLASSIC_STYLE
            : profile === 'novelClear'
              ? NOVEL_NARRATOR_CLEAR_STYLE
              : subjId === 'dataproc'
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
      let sawRateLimit = false;

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
            persistCachedTts(cacheKey, base64Audio);
            return base64Audio;
          }
        } catch (err) {
          lastErr = err;
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
            sawRateLimit = true;
          }
        }
      }

      // When unary TTS free-tier quota is exhausted (429), seamlessly synthesize via Gemini Live native audio ('gemini-3.8-live')
      if (sawRateLimit) {
        try {
          const liveWavBase64 = await synthesizeViaGeminiLiveWav(
            ai,
            scriptText,
            voiceName,
            stylePrompt
          );
          persistCachedTts(cacheKey, liveWavBase64);
          return liveWavBase64;
        } catch (liveErr) {
          lastErr = liveErr;
        }
      }

      throw lastErr || new Error('Studio voice engine returned an empty audio response.');
    } finally {
      inFlightTts.delete(cacheKey);
      await sleepMs(150);
      releaseQueue();
    }
  })();

  inFlightTts.set(cacheKey, flight);
  return flight;
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

  app.use(
    express.json({
      limit: '512kb',
      verify: (req, _res, buf) => {
        (req as express.Request & { rawBody?: Buffer }).rawBody = Buffer.from(buf);
      },
    })
  );

  // Block cross-site state-changing API requests (CSRF / cross-origin quota abuse),
  // exempting server-to-server Paystack webhook which verifies HMAC-SHA512 signature directly.
  app.use('/api', (req, res, next) => {
    if (req.path === '/billing/paystack/webhook') {
      next();
      return;
    }
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
  const passPinRedeemLimiter = new SlidingWindowRateLimiter({ maxRequests: 10, windowMs: 10 * 60_000 });
  const webhookLimiter = new SlidingWindowRateLimiter({ maxRequests: 120, windowMs: 60_000 });

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

  const novelTtsLimiter = new SlidingWindowRateLimiter({ maxRequests: 60, windowMs: 60_000 });
  app.post('/api/chem/tts', enforceRateLimit(ttsLimiter), handleTtsRequest);
  app.post('/api/lab/tts', enforceRateLimit(ttsLimiter), handleTtsRequest);
  app.post('/api/novels/tts', enforceRateLimit(novelTtsLimiter), handleTtsRequest);

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
        res.status(502).json({ error: 'Question engine returned an empty response for this batch.' });
        return;
      }

      let items: unknown;
      try {
        items = JSON.parse(rawText);
      } catch {
        res.status(502).json({ error: 'Question engine returned invalid data for this batch. Retrying...' });
        return;
      }

      if (!Array.isArray(items)) {
        res.status(502).json({ error: 'Question engine returned an unexpected format.' });
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
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Personalised 4-Stage Learning Adventure Generator (Server-Side Structured JSON)
  app.post('/api/universe/adventure', enforceRateLimit(genLimiter), async (req, res) => {
    try {
      const subjectSpec = resolveAuthoritativeSubject(req.body?.subject);
      if (!subjectSpec) {
        res.status(400).json({ error: 'A valid curriculum subject is required.' });
        return;
      }
      const topicName = sanitizePromptSnippet(req.body?.topicName, 100);
      if (topicName.length < 2) {
        res.status(400).json({ error: 'Please select a valid syllabus topic.' });
        return;
      }
      const sectionName = sanitizePromptSnippet(req.body?.sectionName, 80) || 'Core Syllabus';
      const examTrap = sanitizePromptSnippet(req.body?.examTrap, 180);
      const classLevelRaw = sanitizePromptSnippet(req.body?.classLevel, 16).toUpperCase();
      const classLabel =
        classLevelRaw === 'SS1' || classLevelRaw === 'SS2' || classLevelRaw === 'SS3'
          ? classLevelRaw
          : 'SS1–SS3 / UTME';
      const tutor = SUBJECT_TUTOR_REGISTRY[subjectSpec.id] || SUBJECT_TUTOR_REGISTRY.bio;

      const ai = createAiClient();
      const prompt = [
        `Design an engaging, academically rigorous 4-stage interactive learning mission for a Nigerian Senior Secondary (${classLabel}) student studying "${topicName}" (${sectionName}) in ${subjectSpec.fullName}.`,
        `Field guide persona: ${tutor.tutorName} (${tutor.roleTitle}).`,
        examTrap ? `Target this common student misconception/exam trap: ${examTrap}.` : '',
        `Rules:`,
        `1. Write natural, concise, vivid mission prose (never mention prompts, AI, or internal instructions).`,
        `2. Stage 1 (Discover) introduces a concrete real-world or scientific problem scenario and 3 crisp principles.`,
        `3. Stage 2 (Explore) defines 4 sequential interactive inspection checkpoints showing cause and effect.`,
        `4. Stage 3 (Decision) & Stage 4 (Application + Teach-Back) must each have 3 plausible options where Option Index 0, 1, or 2 is factually/mathematically verified, plus 2 helpful Socratic hints and a clear worked explanation.`,
        `5. Use clean plain-text mathematical/scientific symbols (e.g. H₂O, x², √, →, °C, Ω) rather than raw LaTeX backslashes.`,
      ]
        .filter(Boolean)
        .join('\n');

      const questionSchema = {
        type: Type.OBJECT,
        properties: {
          prompt: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Exactly 3 distinct options',
          },
          correctIndex: {
            type: Type.INTEGER,
            description: '0, 1, or 2 matching the verified correct option',
          },
          hints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 progressive Socratic hints without giving away the letter directly',
          },
          explanation: { type: Type.STRING },
        },
        required: ['prompt', 'options', 'correctIndex', 'hints', 'explanation'],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              unlockTitle: { type: Type.STRING },
              hook: { type: Type.STRING },
              companionIntro: { type: Type.STRING },
              keyFacts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                  required: ['label', 'detail'],
                },
              },
              exploreInstruction: { type: Type.STRING },
              pathwayNodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    stateNote: { type: Type.STRING },
                  },
                  required: ['label', 'stateNote'],
                },
              },
              scenarioContext: { type: Type.STRING },
              decision: questionSchema,
              applicationChallenge: questionSchema,
              teachBackChallenge: questionSchema,
              victoryNarrative: { type: Type.STRING },
            },
            required: [
              'title',
              'subtitle',
              'unlockTitle',
              'hook',
              'companionIntro',
              'keyFacts',
              'exploreInstruction',
              'pathwayNodes',
              'scenarioContext',
              'decision',
              'applicationChallenge',
              'teachBackChallenge',
              'victoryNarrative',
            ],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        res.status(502).json({ error: 'Adventure builder returned an empty response.' });
        return;
      }

      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const normalizeCheck = (rawCheck: unknown) => {
        const c = (rawCheck && typeof rawCheck === 'object' ? rawCheck : {}) as Record<
          string,
          unknown
        >;
        const opts = Array.isArray(c.options)
          ? c.options
              .map((o) => String(o || '').trim().slice(0, 220))
              .filter(Boolean)
              .slice(0, 4)
          : [];
        if (opts.length < 2) return null;
        const idxRaw = Number(c.correctIndex);
        const correctIndex =
          Number.isInteger(idxRaw) && idxRaw >= 0 && idxRaw < opts.length ? idxRaw : 0;
        const rawHints = Array.isArray(c.hints)
          ? c.hints.map((h) => String(h || '').trim().slice(0, 200)).filter(Boolean)
          : [];
        const hints: [string, string] = [
          rawHints[0] || 'Check the core principle from Stage 1.',
          rawHints[1] || 'Eliminate options that violate units or conditions.',
        ];
        return {
          prompt: String(c.prompt || '').trim().slice(0, 320),
          options: opts,
          correctIndex,
          hints,
          explanation: String(c.explanation || 'Verified from first principles.').trim().slice(0, 340),
        };
      };

      const dec = normalizeCheck(parsed.decision);
      const appCheck = normalizeCheck(parsed.applicationChallenge);
      const tbCheck = normalizeCheck(parsed.teachBackChallenge);
      if (!dec || !appCheck || !tbCheck || !dec.prompt || !appCheck.prompt || !tbCheck.prompt) {
        res.status(502).json({ error: 'Generated adventure was incomplete. Please try again.' });
        return;
      }

      const keyFacts = Array.isArray(parsed.keyFacts)
        ? parsed.keyFacts
            .slice(0, 3)
            .map((kf: unknown, i: number) => {
              const item = (kf && typeof kf === 'object' ? kf : {}) as Record<string, unknown>;
              return {
                label: String(item.label || `Key Principle 0${i + 1}`).trim().slice(0, 60),
                detail: String(item.detail || '').trim().slice(0, 240),
              };
            })
            .filter((k) => k.detail.length > 0)
        : [];

      const pathwayNodes = Array.isArray(parsed.pathwayNodes)
        ? parsed.pathwayNodes
            .slice(0, 4)
            .map((pn: unknown, i: number) => {
              const item = (pn && typeof pn === 'object' ? pn : {}) as Record<string, unknown>;
              return {
                id: `cp-${i + 1}`,
                label: String(item.label || `${i + 1}. Checkpoint ${i + 1}`).trim().slice(0, 60),
                stateNote: String(item.stateNote || '').trim().slice(0, 140),
              };
            })
            .filter((n) => n.stateNote.length > 0)
        : [];

      res.json({
        mission: {
          id: `custom-${subjectSpec.id}-${Date.now()}`,
          worldId: subjectSpec.id,
          levelLabel: 'Personalised Mission',
          title: String(parsed.title || `Operation: ${topicName}`).trim().slice(0, 90),
          subtitle: String(parsed.subtitle || `Master ${topicName} through active problem solving.`)
            .trim()
            .slice(0, 200),
          xpReward: 250,
          unlockTitle: String(parsed.unlockTitle || `${topicName.split(' ')[0]} Specialist`)
            .trim()
            .slice(0, 44),
          isDynamicRescue: true,
          stage1Discover: {
            hook: String(parsed.hook || `Field challenge detected in ${topicName}.`)
              .trim()
              .slice(0, 260),
            companionIntro: String(
              parsed.companionIntro || `${tutor.tutorName} guides you through ${topicName}.`
            )
              .trim()
              .slice(0, 300),
            keyFacts:
              keyFacts.length > 0
                ? keyFacts
                : [{ label: topicName, detail: `Apply core principles of ${sectionName}.` }],
          },
          stage2Explore: {
            simulationKind: 'concept_pathway',
            instruction: String(
              parsed.exploreInstruction || `Inspect each reasoning step for ${topicName}.`
            )
              .trim()
              .slice(0, 200),
            targetGoalLabel: 'Inspect all 4 interactive checkpoints',
            pathwayNodes: pathwayNodes.length >= 2 ? pathwayNodes : undefined,
          },
          stage3Decision: {
            scenarioContext: String(
              parsed.scenarioContext || `Apply ${topicName} to make the right call.`
            )
              .trim()
              .slice(0, 240),
            ...dec,
          },
          stage4Complete: {
            applicationChallenge: appCheck,
            teachBackChallenge: tbCheck,
            victoryNarrative: String(
              parsed.victoryNarrative || `Mission accomplished! You proved mastery of ${topicName}.`
            )
              .trim()
              .slice(0, 220),
          },
        },
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Contextual In-World Companion Guidance for 3D Circulatory Adventure
  app.post('/api/universe/companion', enforceRateLimit(genLimiter), async (req, res) => {
    try {
      const currentZone = sanitizePromptSnippet(req.body?.currentZone, 80) || 'Right Ventricle';
      const missionPhase = sanitizePromptSnippet(req.body?.missionPhase, 80) || 'Pulmonary Launch';
      const lastAction = sanitizePromptSnippet(req.body?.lastAction, 160);
      const heartRateBpm = Math.min(180, Math.max(40, Math.round(Number(req.body?.heartRateBpm) || 72)));
      const oxygenSatPct = Math.min(100, Math.max(35, Math.round(Number(req.body?.oxygenSatPct) || 45)));
      const valveLeakActive = Boolean(req.body?.valveLeakActive);
      const studentQuestion = sanitizePromptSnippet(req.body?.question, 200);

      const ai = createAiClient();
      const prompt = [
        `You are Dr. Amaka, a warm, razor-sharp Nigerian cardiovascular scientist guiding a student piloting a micro-vessel inside a living 3D human circulatory system.`,
        `Current 3D location: ${currentZone}.`,
        `Active mission objective: ${missionPhase}.`,
        `Live physiology state: Heart Rate ${heartRateBpm} BPM, Blood O₂ Saturation ${oxygenSatPct}%, Valve Regurgitation: ${valveLeakActive ? 'Leaky (backflow occurring)' : 'Sealed one-way'}.`,
        lastAction ? `Recent student action in 3D space: ${lastAction}.` : '',
        studentQuestion ? `Student asks: "${studentQuestion}"` : 'Give one concise, high-impact contextual clue for what to observe or do next without spoiling the fun.',
        `Rules:`,
        `1. Keep guidance to 1-2 short, vivid sentences (max 38 words) so it never interrupts gameplay.`,
        `2. Ground every word in accurate mammalian double-circulation biology (chambers, tricuspid/mitral/semilunar valves, pulmonary gas exchange, thick left ventricular wall).`,
        `3. Never mention AI, prompts, models, or software.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              guidance: {
                type: Type.STRING,
                description: '1-2 short sentences of contextual biological guidance (max 220 chars)',
              },
              scientificPrinciple: {
                type: Type.STRING,
                description: 'Short 3-7 word physiological rule tag',
              },
            },
            required: ['guidance', 'scientificPrinciple'],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        res.status(502).json({ error: 'Companion channel temporarily unavailable.' });
        return;
      }
      const parsed = JSON.parse(rawText) as { guidance?: unknown; scientificPrinciple?: unknown };
      const guidance = String(parsed.guidance || '').trim().slice(0, 260);
      const scientificPrinciple = String(parsed.scientificPrinciple || 'Double Circulation').trim().slice(0, 64);
      if (!guidance) {
        res.status(502).json({ error: 'Companion response was empty.' });
        return;
      }
      res.json({ guidance, scientificPrinciple });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // ── Unique Email Registration & Google-Verified Password Recovery ──
  const emailAuthLimiter = new SlidingWindowRateLimiter({ maxRequests: 25, windowMs: 60_000 });

  app.post('/api/auth/register-email', enforceRateLimit(emailAuthLimiter), async (req, res) => {
    try {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      const displayName = typeof req.body?.displayName === 'string' ? req.body.displayName.trim() : '';
      const password = typeof req.body?.password === 'string' ? req.body.password : '';

      if (!isValidEmailAddress(email)) {
        res.status(400).json({ error: 'Enter a valid email address.' });
        return;
      }
      if (displayName.length < 2 || displayName.length > 60) {
        res.status(400).json({ error: 'First name must be between 2 and 60 characters.' });
        return;
      }
      if (password.length < 4 || password.length > 128) {
        res.status(400).json({ error: 'Password must be at least 4 characters long.' });
        return;
      }

      const result = await registerUniqueEmailAccount({ email, displayName, password });
      if (!result.ok) {
        res.status(409).json({ duplicateEmail: true, error: result.error });
        return;
      }
      res.json({ ok: true, email: result.email, displayName: result.displayName });
    } catch (err) {
      console.error('Failed to register email account:', err);
      res.status(500).json({ error: 'Could not verify account registration right now.' });
    }
  });

  app.post('/api/auth/login-email', enforceRateLimit(emailAuthLimiter), async (req, res) => {
    try {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      const password = typeof req.body?.password === 'string' ? req.body.password : '';
      if (!isValidEmailAddress(email) || password.length < 4) {
        res.status(400).json({ error: 'Enter your email address and password.' });
        return;
      }
      const result = await verifyEmailPasswordLogin({ email, password });
      if (!result.ok) {
        res.status(result.notFound ? 404 : 401).json({
          ok: false,
          notFound: Boolean(result.notFound),
          error: result.error,
        });
        return;
      }
      res.json({ ok: true, email: result.email, displayName: result.displayName });
    } catch (err) {
      console.error('Failed to verify email login:', err);
      res.status(500).json({ error: 'Could not verify sign-in right now.' });
    }
  });

  app.post('/api/auth/google-recover', enforceRateLimit(emailAuthLimiter), requireAuth, async (req: AuthRequest, res) => {
    try {
      const verifiedEmail = req.user?.email?.trim().toLowerCase() || '';
      if (!verifiedEmail) {
        res.status(401).json({
          error: 'Google verification with an email address is required before resetting your password.',
        });
        return;
      }
      const newPassword =
        typeof req.body?.newPassword === 'string' ? req.body.newPassword : undefined;
      if (newPassword !== undefined && (newPassword.length < 4 || newPassword.length > 128)) {
        res.status(400).json({ error: 'New password must be at least 4 characters long.' });
        return;
      }
      const result = await recoverEmailPasswordViaGoogle({
        verifiedEmail,
        displayName: req.user?.name || undefined,
        newPassword,
      });
      res.json(result);
    } catch (err) {
      console.error('Failed to complete Google recovery:', err);
      res.status(500).json({ error: 'Could not complete Google account recovery right now.' });
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

  const getConfiguredPaystackSecretKey = (): string | null => {
    const raw = process.env.PAYSTACK_SECRET_KEY?.trim() || '';
    return isConfiguredPaystackSecretKey(raw) ? raw : null;
  };

  // ── Easy Learn 100% Automated Paystack Checkout, Sponsorship & Webhook Endpoints ──
  app.get('/api/billing/status', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const decoded = await tryDecodeBearerToken(req);
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : null;
      const verifiedEmail =
        decoded?.email_verified && typeof decoded.email === 'string' ? decoded.email : null;
      const [pro, trial, trialLink, entitlementPublicKey] = await Promise.all([
        getActiveSubscriptionReceipt({
          uid: decoded?.uid || null,
          deviceToken: rawDeviceToken,
          email: decoded?.email || null,
          verifiedEmail,
        }),
        getOrCreateTrialReceipt({
          uid: decoded?.uid || null,
          deviceToken: rawDeviceToken,
        }),
        getLinkedTrialSubscription({
          uid: decoded?.uid || null,
          deviceToken: rawDeviceToken,
        }),
        getEntitlementPublicKeyJwk(),
      ]);
      const subscriptionAutoRenew = await getSubscriptionAutoRenewState({
        uid: decoded?.uid || null,
        deviceToken: rawDeviceToken,
        activePro: pro,
      });
      res.json({
        plans: PREMIUM_PLANS,
        paystackEnabled: Boolean(getConfiguredPaystackSecretKey()),
        isAdmin: isAdminDecodedUser(decoded),
        entitlementPublicKey,
        pro,
        trial,
        trialLink,
        subscriptionAutoRenew,
      });
    } catch (err) {
      console.error('Failed to check billing status:', err);
      res.status(500).json({ error: 'Unable to check subscription status right now.' });
    }
  });

  // ── 1-Day Free Trial Google Pay / Payment Account Linking + 1-Click Cancel Anytime ──
  app.post('/api/billing/trial/link', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const decoded = await tryDecodeBearerToken(req);
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';
      const methodType = req.body?.methodType === 'card_bank' ? 'card_bank' : 'google_pay';
      const billingEmail =
        typeof req.body?.billingEmail === 'string'
          ? req.body.billingEmail
          : decoded?.email || '';
      const accountLabel =
        typeof req.body?.accountLabel === 'string' ? req.body.accountLabel : '';

      const [result, entitlementPublicKey] = await Promise.all([
        linkAndStartOneDayTrial({
          uid: decoded?.uid || null,
          deviceToken: isValidDeviceSecretToken(rawDeviceToken) ? rawDeviceToken : undefined,
          methodType,
          billingEmail,
          accountLabel,
        }),
        getEntitlementPublicKeyJwk(),
      ]);

      res.json({
        ok: true,
        entitlementPublicKey,
        trial: result.trial,
        trialLink: result.trialLink,
      });
    } catch (err) {
      if (err instanceof BillingUserError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      console.error('Failed to link 1-day free trial payment account:', err);
      res.status(500).json({ error: 'Unable to link your payment account right now.' });
    }
  });

  app.post('/api/billing/trial/cancel', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const decoded = await tryDecodeBearerToken(req);
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';
      const trialLink = await cancelLinkedTrial({
        uid: decoded?.uid || null,
        deviceToken: isValidDeviceSecretToken(rawDeviceToken) ? rawDeviceToken : undefined,
      });
      res.json({ ok: true, trialLink });
    } catch (err) {
      if (err instanceof BillingUserError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      console.error('Failed to cancel linked 1-day trial:', err);
      res.status(500).json({ error: 'Unable to cancel your trial right now.' });
    }
  });

  // ── Recurring Plan Auto-Debit Control (Monthly, 6-Month, Yearly — excludes Lifetime) ──
  app.post('/api/billing/subscription/cancel', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const decoded = await tryDecodeBearerToken(req);
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';
      const verifiedEmail =
        decoded?.email_verified && typeof decoded.email === 'string' ? decoded.email : null;
      const activePro = await getActiveSubscriptionReceipt({
        uid: decoded?.uid || null,
        deviceToken: rawDeviceToken,
        email: decoded?.email || null,
        verifiedEmail,
      });
      const subscriptionAutoRenew = await cancelRecurringSubscription({
        uid: decoded?.uid || null,
        deviceToken: isValidDeviceSecretToken(rawDeviceToken) ? rawDeviceToken : undefined,
        activePro,
      });
      res.json({ ok: true, subscriptionAutoRenew });
    } catch (err) {
      if (err instanceof BillingUserError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      console.error('Failed to cancel recurring subscription:', err);
      res.status(500).json({ error: 'Unable to cancel auto-renewal right now.' });
    }
  });

  app.post('/api/billing/subscription/resume', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const decoded = await tryDecodeBearerToken(req);
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';
      const verifiedEmail =
        decoded?.email_verified && typeof decoded.email === 'string' ? decoded.email : null;
      const activePro = await getActiveSubscriptionReceipt({
        uid: decoded?.uid || null,
        deviceToken: rawDeviceToken,
        email: decoded?.email || null,
        verifiedEmail,
      });
      const subscriptionAutoRenew = await resumeRecurringSubscription({
        uid: decoded?.uid || null,
        deviceToken: isValidDeviceSecretToken(rawDeviceToken) ? rawDeviceToken : undefined,
        activePro,
      });
      res.json({ ok: true, subscriptionAutoRenew });
    } catch (err) {
      if (err instanceof BillingUserError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      console.error('Failed to resume recurring subscription:', err);
      res.status(500).json({ error: 'Unable to resume auto-renewal right now.' });
    }
  });

  app.post('/api/billing/redeem', enforceRateLimit(passPinRedeemLimiter), async (req, res) => {
    try {
      const rawCode = typeof req.body?.code === 'string' ? req.body.code : '';
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';
      const decoded = await tryDecodeBearerToken(req);

      const [redeemed, entitlementPublicKey] = await Promise.all([
        redeemAccessPassPin({
          rawCode,
          uid: decoded?.uid || null,
          deviceToken: isValidDeviceSecretToken(rawDeviceToken) ? rawDeviceToken : null,
          email: decoded?.email || (typeof req.body?.email === 'string' ? req.body.email : null),
        }),
        getEntitlementPublicKeyJwk(),
      ]);

      res.json({
        ok: true,
        entitlementPublicKey,
        ...redeemed,
      });
    } catch (err) {
      if (err instanceof BillingUserError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      console.error('Failed to redeem Pass PIN:', err);
      res.status(500).json({ error: 'Could not activate Pass PIN right now. Please try again.' });
    }
  });

  app.post('/api/billing/paystack/initialize', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const secretKey = getConfiguredPaystackSecretKey();
      if (!secretKey) {
        res.status(200).json({
          ok: false,
          paystackDisabled: true,
          error:
            'Paystack online checkout is awaiting an active PAYSTACK_SECRET_KEY (sk_live_... or sk_test_...) in environment settings.',
        });
        return;
      }

      const plan = getPremiumPlanById(typeof req.body?.planId === 'string' ? req.body.planId : '');
      if (!plan) {
        res.status(400).json({ error: 'Choose a valid Easy Learn Premium plan.' });
        return;
      }
      if (!isValidEmailAddress(req.body?.email)) {
        res.status(400).json({ error: 'Enter a valid email address for your Paystack receipt.' });
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

      const paystackPlanCodeMap: Partial<Record<string, string>> = {
        monthly: process.env.PAYSTACK_PLAN_MONTHLY?.trim(),
        biannual: process.env.PAYSTACK_PLAN_BIANNUAL?.trim(),
        annual: process.env.PAYSTACK_PLAN_ANNUAL?.trim(),
      };
      const recurringPlanCode = plan.isRecurring ? paystackPlanCodeMap[plan.id] : undefined;

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
          ...(recurringPlanCode ? { plan: recurringPlanCode } : {}),
          metadata: {
            planId: plan.id,
            recurring: plan.isRecurring,
            autoRenew: plan.isRecurring,
            billingCycleDays: plan.days,
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

      if (upstream.status === 401 || upstream.status === 403) {
        res.status(200).json({
          ok: false,
          paystackDisabled: true,
          error:
            'Paystack rejected PAYSTACK_SECRET_KEY. Update PAYSTACK_SECRET_KEY in environment settings with an active sk_live_... or sk_test_... key from your Paystack Dashboard.',
        });
        return;
      }

      if (!upstream.ok || !payload?.status || !isTrustedPaystackCheckout) {
        res.status(502).json({
          error: 'Could not start Paystack checkout right now. Please try again in a moment.',
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

  // Automated Parent Sponsorship & School Seat Checkout via Paystack (1 to 200 scholars, zero PINs)
  app.post(
    '/api/billing/paystack/sponsor-initialize',
    enforceRateLimit(billingLimiter),
    async (req, res) => {
      try {
        const plan = getPremiumPlanById(
          typeof req.body?.planId === 'string' ? req.body.planId : 'annual'
        );
        if (!plan) {
          res.status(400).json({ error: 'Choose a valid Easy Learn study pass duration.' });
          return;
        }

        const payerEmail =
          typeof req.body?.payerEmail === 'string' ? req.body.payerEmail.trim().toLowerCase() : '';
        if (!isValidEmailAddress(payerEmail)) {
          res.status(400).json({
            error: 'Enter a valid receipt email address (for example parent@gmail.com).',
          });
          return;
        }

        const parsedScholars = parseScholarEmailList(req.body?.scholarEmails, 200);
        if (parsedScholars.invalidEntries.length > 0) {
          res.status(400).json({
            error: `Check scholar email format: "${parsedScholars.invalidEntries[0]}" is not a valid email address.`,
          });
          return;
        }
        if (parsedScholars.emails.length < 1) {
          res.status(400).json({
            error: 'Enter at least one scholar account email address to activate automatically.',
          });
          return;
        }

        const quote = calculatePaystackSeatQuote(parsedScholars.emails.length, plan.id);
        const secretKey = getConfiguredPaystackSecretKey();
        if (!secretKey) {
          res.status(200).json({
            ok: false,
            paystackDisabled: true,
            quote,
            error:
              'Paystack live key is not configured in environment settings yet. Once PAYSTACK_SECRET_KEY is added, this button opens Paystack checkout directly.',
          });
          return;
        }

        const reference = `eyak_seat_${plan.id}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
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
            email: payerEmail,
            amount: quote.totalKobo,
            currency: 'NGN',
            reference,
            callback_url: callbackUrl,
            metadata: {
              planId: plan.id,
              seats: quote.seats,
              discountPct: quote.discountPct,
              sponsorCheckout: true,
            },
          }),
        });

        const payload = (await upstream.json().catch(() => null)) as {
          status?: boolean;
          data?: { authorization_url?: string; reference?: string };
        } | null;

        const authUrl = payload?.data?.authorization_url || '';
        const isTrustedPaystackCheckout =
          authUrl.startsWith('https://checkout.paystack.com/') ||
          authUrl.startsWith('https://standard.paystack.co/');

        if (upstream.status === 401 || upstream.status === 403) {
          res.status(200).json({
            ok: false,
            paystackDisabled: true,
            quote,
            error:
              'Paystack rejected PAYSTACK_SECRET_KEY. Update PAYSTACK_SECRET_KEY in environment settings with an active sk_live_... or sk_test_... key from your Paystack Dashboard.',
          });
          return;
        }

        if (!upstream.ok || !payload?.status || !isTrustedPaystackCheckout) {
          res.status(502).json({
            error: 'Could not start Paystack checkout right now. Please try again in a moment.',
          });
          return;
        }

        const finalRef =
          typeof payload?.data?.reference === 'string' &&
          isValidPaystackReference(payload.data.reference)
            ? payload.data.reference.trim()
            : reference;

        await createPendingPaystackTransaction({
          reference: finalRef,
          planId: plan.id,
          amountKobo: quote.totalKobo,
          email: parsedScholars.emails.join(','),
          systemDeviceKey: 'PAYSTACK_SPONSOR',
        });

        res.json({
          ok: true,
          authorizationUrl: authUrl,
          reference: finalRef,
          seats: quote.seats,
          totalNgn: quote.totalNgn,
        });
      } catch (err) {
        console.error('Failed to initialize Paystack sponsor checkout:', err);
        res.status(502).json({ error: 'Unable to reach Paystack right now. Please retry shortly.' });
      }
    }
  );

  app.post('/api/billing/paystack/verify', enforceRateLimit(billingLimiter), async (req, res) => {
    try {
      const secretKey = getConfiguredPaystackSecretKey();
      if (!secretKey) {
        res.status(200).json({
          ok: false,
          paystackDisabled: true,
          error: 'Paystack payment verification requires an active PAYSTACK_SECRET_KEY in environment settings.',
        });
        return;
      }

      const rawRef = typeof req.body?.reference === 'string' ? req.body.reference.trim() : '';
      if (!isValidPaystackReference(rawRef)) {
        res.status(400).json({ error: 'A valid Paystack payment reference is required.' });
        return;
      }
      const rawDeviceToken =
        typeof req.headers['x-device-token'] === 'string' ? req.headers['x-device-token'] : '';

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
          customerEmail: String(payload.data.customer?.email || decoded?.email || 'student@easylearn.ng'),
          deviceToken: isValidDeviceSecretToken(rawDeviceToken) ? rawDeviceToken : undefined,
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

  // Server-to-server Paystack Webhook (HMAC-SHA512 verified) for automatic background activation
  app.post('/api/billing/paystack/webhook', enforceRateLimit(webhookLimiter), async (req, res) => {
    try {
      const secretKey = getConfiguredPaystackSecretKey();
      if (!secretKey) {
        res.status(503).json({ error: 'Paystack webhook secret not configured.' });
        return;
      }
      const signature =
        typeof req.headers['x-paystack-signature'] === 'string'
          ? req.headers['x-paystack-signature'].trim().toLowerCase()
          : '';
      const rawBody = (req as express.Request & { rawBody?: Buffer }).rawBody;
      if (!signature || !rawBody || !/^[0-9a-f]{128}$/.test(signature)) {
        res.status(401).json({ error: 'Invalid Paystack webhook signature.' });
        return;
      }

      const expectedHex = crypto
        .createHmac('sha512', secretKey)
        .update(rawBody)
        .digest('hex')
        .toLowerCase();
      const expectedBuf = Buffer.from(expectedHex, 'utf8');
      const actualBuf = Buffer.from(signature, 'utf8');
      if (
        expectedBuf.length !== actualBuf.length ||
        !crypto.timingSafeEqual(expectedBuf, actualBuf)
      ) {
        res.status(401).json({ error: 'Paystack signature verification failed.' });
        return;
      }

      const event = typeof req.body?.event === 'string' ? req.body.event : '';
      const data = req.body?.data as
        | {
            reference?: string;
            status?: string;
            amount?: number;
            currency?: string;
            customer?: { email?: string };
            metadata?: { planId?: string };
          }
        | undefined;

      if (
        event === 'charge.success' &&
        data?.status === 'success' &&
        typeof data.reference === 'string' &&
        isValidPaystackReference(data.reference)
      ) {
        const planMeta = getPremiumPlanById(data.metadata?.planId || null);
        await completeVerifiedPaystackTransaction({
          reference: data.reference.trim(),
          verifiedPlanId: planMeta?.id || null,
          paidAmountKobo: Number(data.amount || 0),
          currency: String(data.currency || 'NGN'),
          customerEmail: String(data.customer?.email || 'student@easylearn.ng'),
          allowServerWebhook: true,
        });
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error('Paystack webhook processing error:', err);
      res.status(500).json({ error: 'Webhook processing error.' });
    }
  });

  // ── Owner Read-Only Paystack Revenue & Subscriptions Monitor ──
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
        console.error('Failed to load admin Paystack overview:', err);
        res.status(500).json({ error: 'Unable to load Paystack billing overview right now.' });
      }
    }
  );

  // ── Owner-Only Pass PIN Studio (STRICTLY locked to verified owner Google account) ──
  app.get(
    '/api/admin/billing/vouchers',
    enforceRateLimit(billingLimiter),
    requireVerifiedAuth,
    async (req: AuthRequest, res) => {
      if (!isAdminDecodedUser(req.user)) {
        res.status(403).json({ error: 'Forbidden: Only the platform owner can view Pass PINs.' });
        return;
      }
      try {
        const result = await listOwnerPassPins(80);
        res.json({ ok: true, ...result });
      } catch (err) {
        console.error('Failed to list owner Pass PINs:', err);
        res.status(500).json({ error: 'Unable to load your Pass PINs right now.' });
      }
    }
  );

  app.post(
    '/api/admin/billing/vouchers',
    enforceRateLimit(billingLimiter),
    requireVerifiedAuth,
    async (req: AuthRequest, res) => {
      if (!isAdminDecodedUser(req.user)) {
        res.status(403).json({ error: 'Forbidden: Only the platform owner can create Pass PINs.' });
        return;
      }
      try {
        const planId = typeof req.body?.planId === 'string' ? req.body.planId : 'monthly';
        const count = Number(req.body?.count ?? 1);
        const note = typeof req.body?.note === 'string' ? req.body.note : '';
        const created = await createOwnerPassPins({
          planId,
          count,
          note,
          createdByEmail: req.user!.email!,
        });
        res.status(201).json({ ok: true, created });
      } catch (err) {
        if (err instanceof BillingUserError) {
          res.status(err.statusCode).json({ error: err.message });
          return;
        }
        console.error('Failed to create owner Pass PINs:', err);
        res.status(500).json({ error: 'Unable to generate Pass PINs right now.' });
      }
    }
  );

  app.post(
    '/api/admin/billing/vouchers/:code/revoke',
    enforceRateLimit(billingLimiter),
    requireVerifiedAuth,
    async (req: AuthRequest, res) => {
      if (!isAdminDecodedUser(req.user)) {
        res.status(403).json({ error: 'Forbidden: Only the platform owner can revoke Pass PINs.' });
        return;
      }
      try {
        const result = await revokeOwnerPassPin(String(req.params.code || ''));
        res.json({ ok: true, ...result });
      } catch (err) {
        if (err instanceof BillingUserError) {
          res.status(err.statusCode).json({ error: err.message });
          return;
        }
        console.error('Failed to revoke owner Pass PIN:', err);
        res.status(500).json({ error: 'Unable to revoke Pass PIN right now.' });
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
          headers: { Accept: 'application/json', 'User-Agent': 'EasyLearn-Study-Reader/1.0' },
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
          headers: { Accept: 'application/json', 'User-Agent': 'EasyLearn-Study-Reader/1.0' },
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
        headers: { Accept: 'application/json', 'User-Agent': 'EasyLearn-Study-Reader/1.0' },
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
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('manifest.webmanifest')) {
            res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          } else if (
            filePath.endsWith('sw.js') ||
            filePath.endsWith('registerSW.js') ||
            filePath.endsWith('index.html')
          ) {
            if (filePath.endsWith('sw.js') || filePath.endsWith('registerSW.js')) {
              res.setHeader('Service-Worker-Allowed', '/');
            }
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          }
        },
      })
    );
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Easy Learn server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
