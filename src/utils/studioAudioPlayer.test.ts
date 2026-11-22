import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeTtsBase64Audio,
  estimateWavDurationSeconds,
  isValidWavBuffer,
} from './studioAudioPlayer';

function makeTestWavBase64(pcmSampleCount: number, sampleRate = 24000): string {
  const dataBytes = pcmSampleCount * 2; // 16-bit mono
  const totalBytes = 44 + dataBytes;
  const buf = Buffer.alloc(totalBytes);
  buf.write('RIFF', 0, 'ascii');
  buf.writeUInt32LE(totalBytes - 8, 4);
  buf.write('WAVE', 8, 'ascii');
  buf.write('fmt ', 12, 'ascii');
  buf.writeUInt32LE(16, 16); // PCM chunk size
  buf.writeUInt16LE(1, 20); // AudioFormat = 1 (PCM)
  buf.writeUInt16LE(1, 22); // NumChannels = 1
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28); // ByteRate = sampleRate * 1 * 2
  buf.writeUInt16LE(2, 32); // BlockAlign
  buf.writeUInt16LE(16, 34); // BitsPerSample
  buf.write('data', 36, 'ascii');
  buf.writeUInt32LE(dataBytes, 40);
  return buf.toString('base64');
}

test('decodeTtsBase64Audio decodes valid 24kHz WAV base64 and computes duration', () => {
  // 2.5 seconds at 24,000 Hz = 60,000 samples
  const b64 = makeTestWavBase64(60000, 24000);
  const decoded = decodeTtsBase64Audio(b64, 'audio/wav');
  assert.equal(isValidWavBuffer(decoded.bytes), true);
  assert.equal(decoded.mimeType, 'audio/wav');
  assert.equal(decoded.bytes.byteLength, 44 + 120000);
  assert.equal(decoded.durationEstimateSec, 2.5);
});

test('isValidWavBuffer rejects truncated or non-RIFF payloads', () => {
  assert.equal(isValidWavBuffer(new Uint8Array(10)), false);
  const fake = new Uint8Array(64);
  assert.equal(isValidWavBuffer(fake), false);
  assert.equal(estimateWavDurationSeconds(fake), 0);
});

test('decodeTtsBase64Audio throws clean error on empty or truncated base64', () => {
  assert.throws(() => decodeTtsBase64Audio(''), /empty audio payload/i);
  assert.throws(() => decodeTtsBase64Audio(Buffer.from('short').toString('base64')), /truncated/i);
});
