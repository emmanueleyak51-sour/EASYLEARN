import type { MasteryThemeId, ThemeAppearanceMode } from '../types';

export interface ThemePreviewPalette {
  bg: string;
  card: string;
  line: string;
  ink: string;
  accent: string;
  heroStart: string;
  heroEnd: string;
  badge: string;
}

export interface MasteryThemeDef {
  id: MasteryThemeId;
  stage: number; // 1..10
  name: string;
  tierLabel: string;
  unlockGoalPct: number; // 0..100 (% of student's target mastery goal)
  tagline: string;
  lightPreview: ThemePreviewPalette;
  darkPreview: ThemePreviewPalette;
}

/**
 * 10 Platform-Wide Mastery Progression Themes — each supporting both Light and Dark mode.
 * Each stage represents a milestone from 0% to 100% of the student's exam mastery goal.
 */
export const MASTERY_THEMES: readonly MasteryThemeDef[] = [
  {
    id: 'stage-1-adire',
    stage: 1,
    name: 'Adire Indigo',
    tierLabel: 'Fresh Starter',
    unlockGoalPct: 0,
    tagline: 'Studio slate & royal Adire indigo for day one.',
    lightPreview: {
      bg: '#EEF1F7',
      card: '#FFFFFF',
      line: '#D6DDE9',
      ink: '#141C33',
      accent: '#3346DB',
      heroStart: '#2435BC',
      heroEnd: '#4256EC',
      badge: '#FFD84D',
    },
    darkPreview: {
      bg: '#0D1222',
      card: '#151D35',
      line: '#263357',
      ink: '#EEF2FF',
      accent: '#6376FF',
      heroStart: '#19267A',
      heroEnd: '#3B4FE4',
      badge: '#FFD84D',
    },
  },
  {
    id: 'stage-2-savanna',
    stage: 2,
    name: 'Savanna Sunrise',
    tierLabel: 'Early Momentum',
    unlockGoalPct: 12,
    tagline: 'Warm linen & glowing terracotta amber.',
    lightPreview: {
      bg: '#F6EFE6',
      card: '#FFFDF9',
      line: '#E6D8C5',
      ink: '#2A1810',
      accent: '#C24D16',
      heroStart: '#8C2F0A',
      heroEnd: '#D65A1E',
      badge: '#FFE066',
    },
    darkPreview: {
      bg: '#17110D',
      card: '#231A14',
      line: '#3B2B20',
      ink: '#FBF1E8',
      accent: '#F07B3F',
      heroStart: '#5E2209',
      heroEnd: '#B84614',
      badge: '#FFE066',
    },
  },
  {
    id: 'stage-3-jade',
    stage: 3,
    name: 'Rainforest Jade',
    tierLabel: 'Growing Roots',
    unlockGoalPct: 24,
    tagline: 'Botanical mist & deep canopy emerald focus.',
    lightPreview: {
      bg: '#EAF4EE',
      card: '#FAFFFC',
      line: '#CBE1D4',
      ink: '#10281E',
      accent: '#0E7852',
      heroStart: '#0A4F36',
      heroEnd: '#128E62',
      badge: '#FFD84D',
    },
    darkPreview: {
      bg: '#0B1712',
      card: '#12241C',
      line: '#213F32',
      ink: '#E9F7F0',
      accent: '#28C084',
      heroStart: '#083D29',
      heroEnd: '#117A53',
      badge: '#FFD84D',
    },
  },
  {
    id: 'stage-4-lagoon',
    stage: 4,
    name: 'Atlantic Lagoon',
    tierLabel: 'Steady Current',
    unlockGoalPct: 36,
    tagline: 'Coastal sky surfaces & crisp cerulean marine ink.',
    lightPreview: {
      bg: '#E9F3F8',
      card: '#FAFDFF',
      line: '#C8DCE8',
      ink: '#0E2433',
      accent: '#0369A1',
      heroStart: '#074870',
      heroEnd: '#0284C7',
      badge: '#FDE047',
    },
    darkPreview: {
      bg: '#0A151E',
      card: '#112230',
      line: '#1F3A50',
      ink: '#E8F4FC',
      accent: '#38BDF8',
      heroStart: '#083A5B',
      heroEnd: '#0369A1',
      badge: '#FDE047',
    },
  },
  {
    id: 'stage-5-garnet',
    stage: 5,
    name: 'Harmattan Garnet',
    tierLabel: 'Halfway Fire',
    unlockGoalPct: 48,
    tagline: 'Rose-vellum canvas & scholarly crimson garnet.',
    lightPreview: {
      bg: '#F7EDF0',
      card: '#FFFBFC',
      line: '#E5CED5',
      ink: '#2C121B',
      accent: '#B41E47',
      heroStart: '#7C1130',
      heroEnd: '#CE2755',
      badge: '#FFE066',
    },
    darkPreview: {
      bg: '#180D12',
      card: '#25151D',
      line: '#402331',
      ink: '#FCEEF3',
      accent: '#F45B84',
      heroStart: '#5E0E26',
      heroEnd: '#A61B43',
      badge: '#FFE066',
    },
  },
  {
    id: 'stage-6-bronze',
    stage: 6,
    name: 'Benin Bronze',
    tierLabel: 'Forged Precision',
    unlockGoalPct: 60,
    tagline: 'Sculpted limestone & burnished court copper-bronze.',
    lightPreview: {
      bg: '#F2ECE1',
      card: '#FDFBF6',
      line: '#DFD3BE',
      ink: '#261C12',
      accent: '#9A4E12',
      heroStart: '#5C2D09',
      heroEnd: '#B45D18',
      badge: '#FACC15',
    },
    darkPreview: {
      bg: '#16120D',
      card: '#221C14',
      line: '#3B3022',
      ink: '#F8F0E3',
      accent: '#E08B3E',
      heroStart: '#472307',
      heroEnd: '#8F4811',
      badge: '#FACC15',
    },
  },
  {
    id: 'stage-7-plum',
    stage: 7,
    name: 'Imperial Mulberry',
    tierLabel: 'Commanding Range',
    unlockGoalPct: 72,
    tagline: 'Orchid stone paired with regal mulberry violet.',
    lightPreview: {
      bg: '#F2ECF8',
      card: '#FDFBFF',
      line: '#D9CCE8',
      ink: '#211332',
      accent: '#6D28D9',
      heroStart: '#4C1D95',
      heroEnd: '#7C3AED',
      badge: '#FDE047',
    },
    darkPreview: {
      bg: '#130E1E',
      card: '#1D152E',
      line: '#332550',
      ink: '#F4EEFF',
      accent: '#A77BFF',
      heroStart: '#3B1578',
      heroEnd: '#6D28D9',
      badge: '#FDE047',
    },
  },
  {
    id: 'stage-8-scholar',
    stage: 8,
    name: 'Archive Emerald',
    tierLabel: 'Distinction Bound',
    unlockGoalPct: 84,
    tagline: 'Collegiate library vellum, bottle-green leather & brass.',
    lightPreview: {
      bg: '#F1EFE3',
      card: '#FFFEF9',
      line: '#D8D4C0',
      ink: '#16241C',
      accent: '#165B40',
      heroStart: '#0E3F2B',
      heroEnd: '#1E7251',
      badge: '#F5C451',
    },
    darkPreview: {
      bg: '#0E1511',
      card: '#16211B',
      line: '#283B30',
      ink: '#F2F5EC',
      accent: '#44B886',
      heroStart: '#0C3323',
      heroEnd: '#186043',
      badge: '#F5C451',
    },
  },
  {
    id: 'stage-9-starlight',
    stage: 9,
    name: 'Starlight Observatory',
    tierLabel: 'Near-Target Elite',
    unlockGoalPct: 94,
    tagline: 'Astral slate & luminous sapphire observatory focus.',
    lightPreview: {
      bg: '#ECF2FA',
      card: '#FFFFFF',
      line: '#CBD9EC',
      ink: '#0F1D35',
      accent: '#1D4ED8',
      heroStart: '#132D6B',
      heroEnd: '#2563EB',
      badge: '#FACC15',
    },
    darkPreview: {
      bg: '#0C1424',
      card: '#131F35',
      line: '#263959',
      ink: '#ECF3FF',
      accent: '#5294FF',
      heroStart: '#0F2557',
      heroEnd: '#2563EB',
      badge: '#FACC15',
    },
  },
  {
    id: 'stage-10-chancellor',
    stage: 10,
    name: 'Chancellor Obsidian',
    tierLabel: 'Goal Mastered',
    unlockGoalPct: 100,
    tagline: 'Sovereign ivory or onyx & gleaming academic gold.',
    lightPreview: {
      bg: '#F4EFE4',
      card: '#FFFDF8',
      line: '#DFD4BC',
      ink: '#1E190E',
      accent: '#9A650C',
      heroStart: '#2B210E',
      heroEnd: '#6E4F16',
      badge: '#FFD84D',
    },
    darkPreview: {
      bg: '#101015',
      card: '#181922',
      line: '#2D2F40',
      ink: '#F8F5EC',
      accent: '#E5A93B',
      heroStart: '#1E180B',
      heroEnd: '#5C4417',
      badge: '#FFD84D',
    },
  },
];

export const DEFAULT_MASTERY_THEME_ID: MasteryThemeId = 'stage-1-adire';

export function getMasteryThemeById(id?: string | null): MasteryThemeDef {
  return MASTERY_THEMES.find((t) => t.id === id) || MASTERY_THEMES[0];
}

export function getThemePreview(
  theme: MasteryThemeDef,
  mode: ThemeAppearanceMode = 'light'
): ThemePreviewPalette {
  return mode === 'dark' ? theme.darkPreview : theme.lightPreview;
}
