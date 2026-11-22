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
  premiumOnly: boolean;
  unlockGoalPct: number;
  tagline: string;
  lightPreview: ThemePreviewPalette;
  darkPreview: ThemePreviewPalette;
}

/**
 * Platform colour themes — each supporting both Light and Dark mode.
 * Playful grape (`stage-1-adire`) is the standard theme for all students.
 * The remaining 9 themes are reserved for Premium students.
 */
export const MASTERY_THEMES: readonly MasteryThemeDef[] = [
  {
    id: 'stage-1-adire',
    stage: 1,
    name: 'Playful grape',
    tierLabel: 'Standard theme',
    premiumOnly: false,
    unlockGoalPct: 0,
    tagline: 'Signature lavender paper and lively grape for calm daily study.',
    lightPreview: {
      bg: '#F5F1FF',
      card: '#FFFFFF',
      line: '#E2DAFB',
      ink: '#241A45',
      accent: '#5B2BD6',
      heroStart: '#4920B5',
      heroEnd: '#6B3FE6',
      badge: '#FFE1D1',
    },
    darkPreview: {
      bg: '#15102B',
      card: '#1E1739',
      line: '#34295F',
      ink: '#F1ECFF',
      accent: '#9D7BFF',
      heroStart: '#2A2052',
      heroEnd: '#6A45E0',
      badge: '#FFE1D1',
    },
  },
  {
    id: 'stage-2-savanna',
    stage: 2,
    name: 'Savanna sunrise',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 12,
    tagline: 'Warm linen and glowing terracotta amber.',
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
    name: 'Rainforest jade',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 24,
    tagline: 'Botanical mist and deep canopy emerald focus.',
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
    name: 'Atlantic lagoon',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 36,
    tagline: 'Coastal sky surfaces and crisp cerulean marine ink.',
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
    name: 'Harmattan garnet',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 48,
    tagline: 'Rose-vellum canvas and scholarly crimson garnet.',
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
    name: 'Benin bronze',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 60,
    tagline: 'Sculpted limestone and burnished court copper-bronze.',
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
    name: 'Imperial mulberry',
    tierLabel: 'Premium theme',
    premiumOnly: true,
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
    name: 'Archive emerald',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 84,
    tagline: 'Collegiate library vellum, bottle-green leather and brass.',
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
    name: 'Starlight observatory',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 94,
    tagline: 'Astral slate and luminous sapphire observatory focus.',
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
    name: 'Chancellor obsidian',
    tierLabel: 'Premium theme',
    premiumOnly: true,
    unlockGoalPct: 100,
    tagline: 'Sovereign ivory or onyx and gleaming academic gold.',
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
