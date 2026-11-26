import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEnglishCoachSystemPrompt,
  buildMadScientistSystemPrompt,
  extractBeatSpeechScript,
  extractLabStepSpeechScript,
  extractMissionSpeechScript,
  extractNotePartSpeechScript,
  extractQuestionSpeechScript,
  extractTopicOverviewSpeechScript,
  float32ToPcm16Base64,
  htmlToSpeakableChem,
  pcm16Base64ToFloat32,
} from './chemVoiceLogic';
import { SUBJECTS } from '../data/curriculum';

test('htmlToSpeakableChem converts HTML, subscripts, ions, and reaction arrows cleanly', () => {
  const raw =
    '<p><b> Cu²⁺(aq) </b> + 2OH⁻(aq) → Cu(OH)₂(s)↓ and H<sub>2</sub>SO<sub>4</sub></p>';
  const spoken = htmlToSpeakableChem(raw);
  assert.ok(!spoken.includes('<'), 'strips all HTML tags');
  assert.ok(spoken.includes('reacts to form'), 'expands reaction arrow');
  assert.ok(spoken.includes('aqueous'), 'expands (aq) state symbol');
  assert.ok(spoken.includes('solid'), 'expands (s) state symbol');
  assert.ok(spoken.includes('plus'), 'expands positive charge superscript');
  assert.ok(spoken.includes('minus'), 'expands negative charge superscript');

  const econRaw = 'When price rises from ₦2,500 to ₦3,000 and GDP hits ₦40bn, x̄ shifts.';
  const econSpoken = htmlToSpeakableChem(econRaw);
  assert.ok(econSpoken.includes('2,500 naira'));
  assert.ok(econSpoken.includes('40 billion naira'));
  assert.ok(econSpoken.includes('x bar'));
  assert.ok(!econSpoken.includes('₦'));
});

test('htmlToSpeakableChem converts Oral English IPA slash transcriptions into spoken phonetic cues', () => {
  const raw = 'Compare /ɜː/ in bird, /θ/ in thin, /ʃ/ in shoe, and /ə/ in teacher.';
  const spoken = htmlToSpeakableChem(raw);
  assert.ok(spoken.includes('long er sound as in bird'));
  assert.ok(spoken.includes('voiceless th sound as in thin'));
  assert.ok(spoken.includes('sh sound as in shoe'));
  assert.ok(spoken.includes('schwa sound'));
  assert.ok(!spoken.includes('/θ/'));
});

test('extractBeatSpeechScript announces Topic focus ONLY on Step 1 and omits intro on Steps 2+ across Chem & English', () => {
  const chemTopics = SUBJECTS.chem.topics;
  assert.equal(chemTopics.length, 32);
  for (const topic of chemTopics) {
    const il = SUBJECTS.chem.il[topic.id];
    assert.ok(il && il.parts.length > 0);
    const firstBeat = il.parts[0].beats[0];
    const step1Script = extractBeatSpeechScript(firstBeat, topic.name, il.parts[0].title, true);
    assert.ok(step1Script.includes('Topic focus:'), 'Step 1 includes Topic focus');
    assert.ok(!step1Script.includes('Welcome to Professor Spark'), 'Zero repeated self-intro');
    assert.ok(step1Script.length <= 1120, `script for ${topic.id} stays bounded`);
    assert.ok(!step1Script.includes('<span'), `script for ${topic.id} has no raw HTML`);

    const secondBeat = il.parts[0].beats[1] || firstBeat;
    const step2Script = extractBeatSpeechScript(secondBeat, topic.name, il.parts[0].title, false);
    assert.ok(!step2Script.includes('Topic focus:'), 'Step 2+ omits Topic focus header');
  }

  const engTopics = SUBJECTS.eng.topics;
  assert.equal(engTopics.length, 34);
  for (const topic of engTopics) {
    const il = SUBJECTS.eng.il[topic.id];
    assert.ok(il && il.parts.length > 0, `English lesson exists for ${topic.id}`);
    const firstBeat = il.parts[0].beats[0];
    const step1Eng = extractBeatSpeechScript(firstBeat, topic.name, il.parts[0].title, true, 'eng');
    assert.ok(step1Eng.includes('Topic focus:'), 'English Step 1 includes Topic focus');
    const secondBeat = il.parts[0].beats[1] || firstBeat;
    const step2Eng = extractBeatSpeechScript(secondBeat, topic.name, il.parts[0].title, false, 'eng');
    assert.ok(!step2Eng.includes('Topic focus:'), 'English Step 2+ omits Topic focus');
  }

  const econTopics = SUBJECTS.econ.topics;
  assert.equal(econTopics.length, 30);
  for (const topic of econTopics) {
    const il = SUBJECTS.econ.il[topic.id];
    assert.ok(il && il.parts.length > 0, `Economics lesson exists for ${topic.id}`);
    const firstBeat = il.parts[0].beats[0];
    const step1Econ = extractBeatSpeechScript(firstBeat, topic.name, il.parts[0].title, true, 'econ');
    assert.ok(step1Econ.includes('Topic focus:'), 'Economics Step 1 includes Topic focus');
    assert.ok(step1Econ.length <= 920, `Economics beat script for ${topic.id} stays concise`);
    const secondBeat = il.parts[0].beats[1] || firstBeat;
    const step2Econ = extractBeatSpeechScript(secondBeat, topic.name, il.parts[0].title, false, 'econ');
    assert.ok(!step2Econ.includes('Topic focus:'), 'Economics Step 2+ omits Topic focus');
  }
});

test('extractLabStepSpeechScript introduces experiment ONLY on Step 1 for both Chemistry and Maths Labs', () => {
  const chemStep1 = extractLabStepSpeechScript(
    'Acid–base titration',
    0,
    { say: 'Transfer 25.0 cm³ of NaOH(aq) into a conical flask.' },
    'Read the bottom of the meniscus.',
    false,
    'chem'
  );
  assert.ok(chemStep1.startsWith('Investigation: Acid–base titration. Step 1:'));
  assert.ok(!chemStep1.includes('Professor Spark'));

  const chemStep2 = extractLabStepSpeechScript(
    'Acid–base titration',
    1,
    { say: 'Add two drops of methyl orange indicator.' },
    'Read the bottom of the meniscus.',
    false,
    'chem'
  );
  assert.ok(!chemStep2.includes('Investigation:'), 'Step 2 must not repeat Investigation header');
  assert.ok(!chemStep2.includes('Acid–base titration'), 'Step 2 must not repeat experiment title');
  assert.ok(chemStep2.startsWith('Step 2:'), 'Step 2 starts directly with Step 2:');

  const mathStep1 = extractLabStepSpeechScript(
    'Construct an angle of 30°',
    0,
    { say: 'Draw a straight line and mark O on it.' },
    undefined,
    false,
    'maths'
  );
  assert.ok(mathStep1.startsWith('Investigation: Construct an angle of 30 degrees . Step 1:') || mathStep1.startsWith('Investigation: Construct an angle of 30'));
  assert.ok(!mathStep1.includes('Professor Spark'));

  const mathStep3 = extractLabStepSpeechScript(
    'Construct an angle of 30°',
    2,
    { say: 'Bisect the 60° angle to obtain 30°.' },
    'Keep compass radius equal.',
    true,
    'maths'
  );
  assert.ok(mathStep3.startsWith('Step 3:'));
  assert.ok(mathStep3.includes('Practical tip: Keep compass radius equal.'));
  assert.ok(!mathStep3.includes('Investigation:'));
});

test('Chemistry & English overview, notes, mission, and quiz voice script builders generate clean scripts', () => {
  const topic = SUBJECTS.chem.topics[0];
  const overview = extractTopicOverviewSpeechScript(topic);
  assert.ok(overview.includes(topic.name));

  const mission = extractMissionSpeechScript(topic.name, 'lesson', 4, topic.trap);
  assert.ok(mission.includes('Chemistry'));

  const engTopic = SUBJECTS.eng.topics[0];
  const engMission = extractMissionSpeechScript(engTopic.name, 'lesson', 5, engTopic.trap, 'eng');
  assert.ok(engMission.includes('English'));

  const bioTopic = SUBJECTS.bio.topics[0];
  const bioMission = extractMissionSpeechScript(bioTopic.name, 'lesson', 4, bioTopic.trap, 'bio');
  assert.ok(bioMission.includes('Biology'));

  const econTopic = SUBJECTS.econ.topics[0];
  const econMission = extractMissionSpeechScript(econTopic.name, 'lesson', 5, econTopic.trap, 'econ');
  assert.ok(econMission.includes('Economics'));

  const noteScript = extractNotePartSpeechScript(topic.name, 0, topic.parts[0], { trap: topic.trap });
  assert.ok(noteScript.includes("Come closer — let's teach through"));
  assert.ok(noteScript.includes('Picture the big idea first:'), 'Teaches big idea like a Socratic mentor instead of reading raw prose');
  assert.ok(noteScript.length <= 940, 'Mentor note teaching script stays concise (~35-50s)');
  const ch2Script = extractNotePartSpeechScript(topic.name, 1, topic.parts[1] || topic.parts[0]);
  assert.ok(ch2Script.includes('Chapter 2'));

  const q = topic.qs[0];
  const askScript = extractQuestionSpeechScript(q, topic.name, null, [0, 1, 2, 3]);
  assert.ok(askScript.includes('Option A:'));
  assert.ok(!askScript.includes('Spot on!'));

  const rightScript = extractQuestionSpeechScript(q, topic.name, q.a, [0, 1, 2, 3]);
  assert.ok(rightScript.startsWith('Spot on!'));

  const wrongIdx = (q.a + 1) % q.o.length;
  const wrongScript = extractQuestionSpeechScript(q, topic.name, wrongIdx, [0, 1, 2, 3]);
  assert.ok(wrongScript.startsWith('Careful!'));
});

test('buildMadScientistSystemPrompt and buildEnglishCoachSystemPrompt ground coaches and forbid repeated intros', () => {
  const prompt = buildMadScientistSystemPrompt({
    topicName: 'Electrolysis',
    sectionName: 'Section II',
    partTitle: 'Faraday Laws',
    stepLabel: 'LEARN',
    stepText: 'Mass deposited is proportional to charge Q = It.',
    examTrap: 'Remember 1 Faraday = 96,500 C per mole of electrons.',
  });
  assert.ok(prompt.includes('Professor Spark'));
  assert.ok(prompt.includes('NEVER introduce yourself'));
  assert.ok(prompt.includes('Electrolysis'));
  assert.ok(prompt.includes('96,500 C'));

  const engPrompt = buildEnglishCoachSystemPrompt({
    topicName: 'Concord (Subject–Verb Agreement)',
    sectionName: 'Grammar & Structure',
    partTitle: 'Accompaniment & Proximity',
    stepLabel: 'Rule Check',
    stepText: 'Neither the players nor the coach was late.',
    examTrap: 'With "as well as", match the first subject.',
  });
  assert.ok(engPrompt.includes('Miss Adaeze'));
  assert.ok(engPrompt.includes('NEVER introduce yourself'));
  assert.ok(engPrompt.includes('Concord'));
});

test('PCM16 base64 encoder and decoder round-trip audio samples accurately', () => {
  const input = new Float32Array([0, 0.5, -0.5, 0.99, -0.99, 0.125]);
  const b64 = float32ToPcm16Base64(input);
  assert.ok(b64.length > 0);
  const decoded = pcm16Base64ToFloat32(b64);
  assert.equal(decoded.length, input.length);
  for (let i = 0; i < input.length; i++) {
    assert.ok(
      Math.abs(decoded[i] - input[i]) < 0.001,
      `sample ${i}: expected ~${input[i]}, got ${decoded[i]}`
    );
  }
});
