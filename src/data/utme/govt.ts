import { buildUtmeSubjectCurriculum } from './builder';
import { GOVT_SEC1_SPECS } from './govtSec1';
import { GOVT_SEC2_SPECS } from './govtSec2';
import { GOVT_SEC3_SPECS } from './govtSec3';

// Wait — let's double-check that Section 1 has 14 topics, Section 2 has 14 topics, and Section 3 has 5 topics = 33 topics!
export function buildGovtCurriculum() {
  return buildUtmeSubjectCurriculum([
    ...GOVT_SEC1_SPECS,
    ...GOVT_SEC2_SPECS,
    ...GOVT_SEC3_SPECS,
  ]);
}
