import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXAM_TRACK_SHOWCASES,
  LIVE_TRAP_CHALLENGES,
  UNIVERSITY_COURSE_PRESETS,
  buildWebsiteSubjectDirectory,
  computeAdmissionCompassPlan,
  evaluateWebsiteTrapAttempt,
  filterWebsiteSubjects,
  formatNairaPrice,
  getCourseTeacherQuartet,
  getFeaturedWebsiteTeachers,
  getTeacherScriptForTrack,
  getWebsitePricingPlans,
  getWebsiteSubjectCounts,
  validateSchoolParentInquiry,
} from './websiteContentLogic';

test('EXAM_TRACK_SHOWCASES covers jamb, waec, and 70/30 combined tracks accurately', () => {
  assert.equal(EXAM_TRACK_SHOWCASES.jamb.id, 'jamb');
  assert.equal(EXAM_TRACK_SHOWCASES.jamb.jambWeightPct, 100);
  assert.match(EXAM_TRACK_SHOWCASES.jamb.trainingStandardLabel, /6\/7 in 3:30/);
  assert.equal(EXAM_TRACK_SHOWCASES.waec.id, 'waec');
  assert.equal(EXAM_TRACK_SHOWCASES.waec.waecWeightPct, 100);
  assert.match(EXAM_TRACK_SHOWCASES.waec.focusRatioLabel, /Paper 2 Theory/);
  assert.equal(EXAM_TRACK_SHOWCASES.both.id, 'both');
  assert.equal(EXAM_TRACK_SHOWCASES.both.jambWeightPct, 70);
  assert.equal(EXAM_TRACK_SHOWCASES.both.waecWeightPct, 30);
});

test('LIVE_TRAP_CHALLENGES and evaluateWebsiteTrapAttempt diagnose twin-option traps and pace', () => {
  assert.equal(LIVE_TRAP_CHALLENGES.length, 5);
  for (const ch of LIVE_TRAP_CHALLENGES) {
    assert.equal(ch.options.length, 4);
    assert.notEqual(ch.correctIdx, ch.twinTrapIdx);
    assert.equal(ch.waecRubricSteps.length, 3);
  }

  const chem = LIVE_TRAP_CHALLENGES[0];
  const trapAttempt = evaluateWebsiteTrapAttempt(chem, chem.twinTrapIdx, 18);
  assert.equal(trapAttempt.isCorrect, false);
  assert.equal(trapAttempt.fellForTwinTrap, true);
  assert.match(trapAttempt.feedbackHeadline, /twin-option distractor/i);

  const fastWin = evaluateWebsiteTrapAttempt(chem, chem.correctIdx, 22);
  assert.equal(fastWin.isCorrect, true);
  assert.equal(fastWin.fellForTwinTrap, false);
  assert.match(fastWin.paceVerdict, /Within 30s/);
});

test('computeAdmissionCompassPlan maps Nigerian university courses to compulsory 4 JAMB subjects and teachers', () => {
  assert.equal(UNIVERSITY_COURSE_PRESETS.length, 8);

  const medLow = computeAdmissionCompassPlan('med', 225);
  assert.deepEqual(medLow.course.jambQuartet, ['eng', 'bio', 'chem', 'phys']);
  assert.equal(medLow.gapToCutOff, 85);
  assert.equal(medLow.statusKind, 'building');
  assert.equal(medLow.fourTeachers.length, 4);

  const csHigh = computeAdmissionCompassPlan('cs', 315);
  assert.equal(csHigh.gapToCutOff, 0);
  assert.equal(csHigh.statusKind, 'exceeding');

  const lawQuartet = getCourseTeacherQuartet('law');
  assert.deepEqual(
    lawQuartet.map((t) => t.subj),
    ['eng', 'lit', 'govt', 'crs']
  );
});

test('featured website teachers carry distinct personalities and track-specific scripts', () => {
  const teachers = getFeaturedWebsiteTeachers();
  assert.equal(teachers.length, 8);
  const uniqueTags = new Set(teachers.map((t) => t.personalityTag));
  assert.equal(uniqueTags.size, teachers.length);

  const chem = teachers.find((t) => t.subj === 'chem');
  assert.ok(chem);
  assert.notEqual(
    getTeacherScriptForTrack(chem, 'jamb'),
    getTeacherScriptForTrack(chem, 'waec')
  );
  assert.notEqual(
    getTeacherScriptForTrack(chem, 'jamb'),
    getTeacherScriptForTrack(chem, 'both')
  );
});

test('49-subject website directory filters accurately by category and search query', () => {
  const counts = getWebsiteSubjectCounts();
  assert.equal(counts.total, 49);
  assert.equal(counts.jamb, 25);
  assert.equal(counts.waecSchool, 14);
  assert.equal(counts.waecTrade, 10);
  assert.equal(counts.jamb + counts.waecOnlyTotal, 49);

  const directory = buildWebsiteSubjectDirectory();
  assert.equal(directory.length, 49);

  const jambOnly = filterWebsiteSubjects(directory, 'jamb', '');
  assert.equal(jambOnly.length, 25);

  const tradeOnly = filterWebsiteSubjects(directory, 'waec-trade', '');
  assert.equal(tradeOnly.length, 10);

  const sparkSearch = filterWebsiteSubjects(directory, 'all', 'Prof. Spark');
  assert.equal(sparkSearch.length, 1);
  assert.equal(sparkSearch[0].id, 'chem');
});

test('pricing plans match canonical PREMIUM_PLANS Naira values', () => {
  assert.equal(formatNairaPrice(4500), '₦4,500');
  assert.equal(formatNairaPrice(27800), '₦27,800');

  const pricing = getWebsitePricingPlans();
  assert.equal(pricing.freeTrialDays, 1);
  assert.equal(pricing.plans.length, 4);
  assert.equal(pricing.plans.find((p) => p.id === 'annual')?.isRecommended, true);
});

test('school and parent inquiry validation rejects invalid inputs and confirms valid Nigerian phone or email', () => {
  const emptyCheck = validateSchoolParentInquiry({
    contactName: '',
    role: 'parent',
    emailOrPhone: '',
    schoolOrCity: '',
    studentCount: '1',
  });
  assert.equal(emptyCheck.ok, false);

  const badContact = validateSchoolParentInquiry({
    contactName: 'Mrs. Adeyemi',
    role: 'parent',
    emailOrPhone: 'not-an-email',
    schoolOrCity: 'Ikeja, Lagos',
    studentCount: '2',
  });
  assert.equal(badContact.ok, false);

  const validPhone = validateSchoolParentInquiry({
    contactName: 'Mrs. Adeyemi',
    role: 'parent',
    emailOrPhone: '0803 456 7890',
    schoolOrCity: 'Ikeja, Lagos',
    studentCount: '2',
  });
  assert.equal(validPhone.ok, true);
  assert.match(validPhone.referenceCode || '', /^ELRN-\d{4}$/);

  const validSchool = validateSchoolParentInquiry({
    contactName: 'Mr. Okonkwo',
    role: 'school',
    emailOrPhone: 'principal@queenscollege.edu.ng',
    schoolOrCity: 'Yaba, Lagos',
    studentCount: '120',
  });
  assert.equal(validSchool.ok, true);
  assert.match(validSchool.summaryLine || '', /120 scholars/);
});

test('volumetric titration simulator computes diprotic 25.0 cm3 equivalence point accurately', async () => {
  const {
    computeWebsiteTitrationState,
    buildTitrationCurvePolyline,
    calculateCohortPassEstimate,
    PLATFORM_COMPARISON_ROWS,
  } = await import('./websiteContentLogic');

  const start = computeWebsiteTitrationState(0);
  assert.equal(start.phase, 'alkaline');
  assert.ok(start.ph > 13);

  const exact = computeWebsiteTitrationState(25.0);
  assert.equal(exact.phase, 'endpoint');
  assert.equal(exact.ph, 7.0);

  const over = computeWebsiteTitrationState(32.0);
  assert.equal(over.phase, 'acidic');
  assert.ok(over.ph < 2);

  const polyline = buildTitrationCurvePolyline();
  assert.ok(polyline.split(' ').length >= 20);

  const solo = calculateCohortPassEstimate(1, 'annual');
  assert.equal(solo.discountPct, 0);
  assert.equal(solo.totalNgn, 9000);

  const school50 = calculateCohortPassEstimate(50, 'annual');
  assert.equal(school50.discountPct, 25);
  assert.equal(school50.subtotalNgn, 450000);
  assert.equal(school50.totalNgn, 337500);

  assert.equal(PLATFORM_COMPARISON_ROWS.length, 6);
});

test('compass construction simulator and connected study roadmap wire track, course, teachers, and labs together', async () => {
  const {
    computeCompassConstructionState,
    buildConnectedStudyRoadmap,
    buildWebsiteBlueprintSummary,
  } = await import('./websiteContentLogic');

  const c60 = computeCompassConstructionState(60);
  assert.equal(c60.angleDeg, 60);
  assert.equal(c60.constructionKind, 'canonical-compass');
  assert.equal(c60.bearingThreeFig, '030°');
  assert.equal(c60.rubricSteps.length, 3);

  const c72 = computeCompassConstructionState(72);
  assert.equal(c72.angleDeg, 72);
  assert.equal(c72.constructionKind, 'protractor-locus');
  assert.equal(c72.bearingThreeFig, '018°');

  const bothMedQueue = buildConnectedStudyRoadmap('both', 'med', 225);
  assert.equal(bothMedQueue.length, 4);
  assert.equal(bothMedQueue[0].subj, 'eng');
  assert.equal(bothMedQueue[0].activityKind, 'lesson');
  assert.equal(bothMedQueue[2].subj, 'chem');
  assert.equal(bothMedQueue[2].activityKind, 'lab');
  assert.equal(bothMedQueue[2].labId, 'c-titration');
  assert.equal(bothMedQueue[3].activityKind, 'theory');

  const jambLawQueue = buildConnectedStudyRoadmap('jamb', 'law', 260);
  assert.deepEqual(
    jambLawQueue.map((s) => s.subj),
    ['eng', 'lit', 'govt', 'crs']
  );

  const bp = buildWebsiteBlueprintSummary('both', 'engr', 240, 'stage-3-jade', 'annual');
  assert.match(bp.campusGoal, /Engineering/);
  assert.deepEqual(bp.preset.jambQuartet, ['eng', 'maths', 'phys', 'chem']);
  assert.equal(bp.preset.selectedPlanId, 'annual');
  assert.equal(bp.preset.previewThemeId, 'stage-3-jade');
});

test('thin-lens ray optics simulator, subject inspector builder, and blueprint storage parser work deterministically', async () => {
  const {
    computeLensOpticsState,
    buildSubjectInspectorSummary,
    parseStoredWebsiteBlueprint,
  } = await import('./websiteContentLogic');

  const at2F = computeLensOpticsState(20, 10);
  assert.equal(at2F.regime, 'at-2f');
  assert.equal(at2F.imageDistCm, 20);
  assert.equal(at2F.magnification, 1);
  assert.equal(at2F.isVirtual, false);

  const projector = computeLensOpticsState(15, 10);
  assert.equal(projector.regime, 'between-f-2f');
  assert.equal(projector.imageDistCm, 30);
  assert.equal(projector.magnification, 2);
  assert.equal(projector.imgOnBench, true);

  const magnifier7 = computeLensOpticsState(7.0, 10);
  assert.equal(magnifier7.regime, 'within-f');
  assert.equal(magnifier7.isVirtual, true);
  assert.equal(magnifier7.imgOnBench, true);
  assert.ok(magnifier7.virtualBackRay1 && magnifier7.virtualBackRay2);
  assert.equal(magnifier7.virtualBackRay1.x2, magnifier7.imgX);
  assert.equal(magnifier7.virtualBackRay2.y2, magnifier7.imgTopY);

  const magnifier = computeLensOpticsState(7.5, 10);
  assert.equal(magnifier.regime, 'within-f');
  assert.equal(magnifier.imageDistCm, -30);
  assert.equal(magnifier.magnification, 4);
  assert.equal(magnifier.isVirtual, true);

  const atFocus = computeLensOpticsState(10, 10);
  assert.equal(atFocus.regime, 'at-f');
  assert.equal(atFocus.imageDistCm, null);

  // Verify every 0.5 cm slider position stays strictly inside SVG optical bench bounds [14, 250] x [18, 162]
  for (let u = 6; u <= 34; u += 0.5) {
    const st = computeLensOpticsState(u, 10);
    for (const seg of [
      st.ray1Incident,
      st.ray1Refracted,
      st.ray2ThroughCentre,
      st.virtualBackRay1,
      st.virtualBackRay2,
    ]) {
      if (!seg) continue;
      assert.ok(seg.x1 >= 14 && seg.x1 <= 250, `x1 out of bounds at u=${u}: ${seg.x1}`);
      assert.ok(seg.x2 >= 14 && seg.x2 <= 250, `x2 out of bounds at u=${u}: ${seg.x2}`);
      assert.ok(seg.y1 >= 18 && seg.y1 <= 162, `y1 out of bounds at u=${u}: ${seg.y1}`);
      assert.ok(seg.y2 >= 18 && seg.y2 <= 162, `y2 out of bounds at u=${u}: ${seg.y2}`);
    }
  }

  const econInspector = buildSubjectInspectorSummary('econ', 'both', [
    { id: 'ec-1', name: 'Nature & Scope of Economics', nerdcClass: 'ss1' },
    { id: 'ec-2', name: 'Demand, Supply & Price Elasticity', nerdcClass: 'ss1' },
  ]);
  assert.equal(econInspector.subj, 'econ');
  assert.equal(econInspector.isJamb, true);
  assert.equal(econInspector.totalTopics, 2);
  assert.equal(econInspector.previewTopics.length, 2);
  assert.ok(econInspector.voiceGreeting.length > 20);

  const gsmInspector = buildSubjectInspectorSummary('gsm', 'jamb', [
    { id: 'gsm-1', name: 'Mobile Handset Architecture' },
  ]);
  assert.equal(gsmInspector.isJamb, false);
  assert.equal(gsmInspector.isTrade, true);

  const stored = parseStoredWebsiteBlueprint(
    JSON.stringify({
      selectedTrack: 'jamb',
      selectedCourseId: 'engr',
      practiceScore: 275,
      previewThemeId: 'stage-4-lagoon',
    })
  );
  assert.deepEqual(stored, {
    selectedTrack: 'jamb',
    selectedCourseId: 'engr',
    practiceScore: 275,
    previewThemeId: 'stage-4-lagoon',
  });
  assert.equal(parseStoredWebsiteBlueprint('not-json'), null);
});

test('Hero quick challenge diagnoses twin-option proximity concord trap and awards reflex win', async () => {
  const { HERO_QUICK_CHALLENGE, evaluateHeroQuickChallenge } = await import(
    './websiteContentLogic'
  );
  assert.equal(HERO_QUICK_CHALLENGE.subj, 'eng');
  assert.equal(HERO_QUICK_CHALLENGE.options.length, 4);

  const win = evaluateHeroQuickChallenge(HERO_QUICK_CHALLENGE.correctIdx);
  assert.equal(win.isCorrect, true);
  assert.equal(win.isTrapOption, false);
  assert.match(win.statusLine, /\+12 XP/);

  const trap = evaluateHeroQuickChallenge(HERO_QUICK_CHALLENGE.trapIdx);
  assert.equal(trap.isCorrect, false);
  assert.equal(trap.isTrapOption, true);
  assert.match(trap.statusLine, /Trap Caught/i);
});


