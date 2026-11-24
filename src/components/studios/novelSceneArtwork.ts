import type { NovelSceneArtworkKey } from '../../data/jambWaecNovels';
import assemblySceneImg from '../../assets/images/scene_lekki_assembly_1795452924031.jpg';
import airportSceneImg from '../../assets/images/scene_airport_departure_1795452926191.jpg';
import courtyardSceneImg from '../../assets/images/scene_courtyard_storytelling_1795452925433.jpg';
import campusSceneImg from '../../assets/images/scene_exam_hall_campus_1795452926680.jpg';
import courtroomSceneImg from '../../assets/images/scene_courtroom_justice_1795452926399.jpg';
import manuscriptSceneImg from '../../assets/images/scene_diaspora_manuscript_1795452925839.jpg';

export interface NovelSceneVisualMeta {
  src: string;
  alt: string;
  fallbackGradient: string;
  badgeLabel: string;
}

export const NOVEL_SCENE_ARTWORK: Record<NovelSceneArtworkKey, NovelSceneVisualMeta> = {
  assembly: {
    src: assemblySceneImg,
    alt: 'School assembly podium and students at morning dawn',
    fallbackGradient: 'linear-gradient(135deg, #27374D 0%, #526D82 48%, #B47B34 100%)',
    badgeLabel: 'School & Leadership Scene',
  },
  airport: {
    src: airportSceneImg,
    alt: 'International departure terminal at twilight before a life-changing journey',
    fallbackGradient: 'linear-gradient(135deg, #1E293B 0%, #312E81 52%, #C2410C 100%)',
    badgeLabel: 'Migration & Crossroads Scene',
  },
  courtyard: {
    src: courtyardSceneImg,
    alt: 'Warm family courtyard storytelling under a shade tree at dusk',
    fallbackGradient: 'linear-gradient(135deg, #5C2B18 0%, #9A4A24 54%, #D99B38 100%)',
    badgeLabel: 'Family & Heritage Scene',
  },
  campus: {
    src: campusSceneImg,
    alt: 'University examination hall bathed in afternoon light',
    fallbackGradient: 'linear-gradient(135deg, #1E3A5F 0%, #2B6CB0 50%, #B7791F 100%)',
    badgeLabel: 'Campus & Examination Scene',
  },
  courtroom: {
    src: courtroomSceneImg,
    alt: 'Sunlit historic wooden courtroom during a pivotal trial for justice',
    fallbackGradient: 'linear-gradient(135deg, #3B2314 0%, #6B3F22 52%, #C28A38 100%)',
    badgeLabel: 'Justice & Truth Scene',
  },
  manuscript: {
    src: manuscriptSceneImg,
    alt: 'Writer desk with handwritten manuscript beside a sunrise window',
    fallbackGradient: 'linear-gradient(135deg, #134E4A 0%, #1E3A5F 52%, #D97706 100%)',
    badgeLabel: 'Resilience & Dawn Scene',
  },
};
