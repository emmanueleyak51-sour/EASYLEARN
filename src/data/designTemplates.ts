export type DesignTemplateId =
  | 'sovereign'
  | 'precision'
  | 'kinetic'
  | 'swiss'
  | 'botanical'
  | 'nocturnal'
  | 'scholar-os'
  | 'broadsheet'
  | 'pocket'
  | 'chalkboard';

export type TemplateLayoutStyle = 'sidebar' | 'topbar' | 'compact-rail' | 'focused';

export type TemplateCategory = 'editorial' | 'minimal' | 'interactive' | 'exam';

export interface DesignTemplateSpec {
  id: DesignTemplateId;
  index: number;
  name: string;
  subtitle: string;
  category: TemplateCategory;
  layoutStyle: TemplateLayoutStyle;
  preferredMode: 'light' | 'dark';
  summary: string;
  bestFor: string;
  displayFontName: string;
  bodyFontName: string;
  displayFontStack: string;
  bodyFontStack: string;
  radiusLabel: string;
  preview: {
    canvas: string;
    surface: string;
    sidebar: string;
    border: string;
    ink: string;
    dim: string;
    accent: string;
    accentSoft: string;
    onAccent: string;
    heroBg: string;
    heroAccent: string;
    radiusPx: number;
    dark: boolean;
  };
}

export const TEMPLATE_STORAGE_KEY = 'eyak_design_template_v1';

export const EYAK_DESIGN_TEMPLATES: readonly DesignTemplateSpec[] = [
  {
    id: 'sovereign',
    index: 1,
    name: 'Sovereign Academy',
    subtitle: 'Modern Prestige Institution',
    category: 'editorial',
    layoutStyle: 'sidebar',
    preferredMode: 'light',
    summary:
      'Warm alabaster paper, deep royal indigo, and serif exam papers that evoke a prestige university press.',
    bestFor: 'Parent-trusted authority & calm academic prestige',
    displayFontName: 'Fraunces',
    bodyFontName: 'Plus Jakarta Sans',
    displayFontStack: "'Fraunces', Georgia, serif",
    bodyFontStack: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '16px refined',
    preview: {
      canvas: '#F6F4EE',
      surface: '#FFFDF8',
      sidebar: '#FFFFFF',
      border: '#DFD9CA',
      ink: '#161D36',
      dim: '#5B6278',
      accent: '#1E3A8A',
      accentSoft: '#E8EEFC',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #172554 0%, #1E3A8A 100%)',
      heroAccent: '#EAB308',
      radiusPx: 14,
      dark: false,
    },
  },
  {
    id: 'precision',
    index: 2,
    name: 'Precision Studio',
    subtitle: 'Linear-Grade Command Desk',
    category: 'minimal',
    layoutStyle: 'compact-rail',
    preferredMode: 'light',
    summary:
      'Ultra-clean monochrome canvas, razor-sharp 1px hairlines, compact icon rail, and crisp electric cobalt focus.',
    bestFor: 'Fast JAMB 340+ scorers who want zero visual noise',
    displayFontName: 'Manrope',
    bodyFontName: 'Manrope',
    displayFontStack: "'Manrope', ui-sans-serif, system-ui, sans-serif",
    bodyFontStack: "'Manrope', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '10px crisp',
    preview: {
      canvas: '#F7F8FA',
      surface: '#FFFFFF',
      sidebar: '#FBFBFC',
      border: '#E2E6EE',
      ink: '#0F172A',
      dim: '#64748B',
      accent: '#2563EB',
      accentSoft: '#EFF6FF',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      heroAccent: '#60A5FA',
      radiusPx: 8,
      dark: false,
    },
  },
  {
    id: 'kinetic',
    index: 3,
    name: 'Kinetic Campus',
    subtitle: 'Tactile Momentum Flow',
    category: 'interactive',
    layoutStyle: 'sidebar',
    preferredMode: 'light',
    summary:
      'Vibrant emerald mastery accents, tactile 3D-bevel keys, and friendly expressive headings built for daily momentum.',
    bestFor: 'Beating uLesson on SS1–SS2 daily engagement & habit loops',
    displayFontName: 'Bricolage Grotesque',
    bodyFontName: 'DM Sans',
    displayFontStack: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
    bodyFontStack: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '20px tactile',
    preview: {
      canvas: '#F4F8F6',
      surface: '#FFFFFF',
      sidebar: '#FFFFFF',
      border: '#D3E5DC',
      ink: '#0F241C',
      dim: '#4D6B5E',
      accent: '#059669',
      accentSoft: '#D1FAE5',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
      heroAccent: '#FDE047',
      radiusPx: 18,
      dark: false,
    },
  },
  {
    id: 'swiss',
    index: 4,
    name: 'Swiss Exam Hall',
    subtitle: 'Proctored Institutional Grid',
    category: 'exam',
    layoutStyle: 'sidebar',
    preferredMode: 'light',
    summary:
      'Stark Swiss typography, architectural 4px corners, cool drafting paper, and signal-crimson exam alerts.',
    bestFor: 'Crushing TestDriller & MySchool CBT on official exam realism',
    displayFontName: 'Archivo',
    bodyFontName: 'DM Sans',
    displayFontStack: "'Archivo', ui-sans-serif, system-ui, sans-serif",
    bodyFontStack: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '4px architectural',
    preview: {
      canvas: '#F1F2F4',
      surface: '#FFFFFF',
      sidebar: '#FAFAFB',
      border: '#CFCFD6',
      ink: '#111113',
      dim: '#55555F',
      accent: '#1D4ED8',
      accentSoft: '#E8EEFF',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #111113 0%, #26262C 100%)',
      heroAccent: '#EF4444',
      radiusPx: 4,
      dark: false,
    },
  },
  {
    id: 'botanical',
    index: 5,
    name: 'Botanical Lab Atelier',
    subtitle: 'Scientific Monograph Workbench',
    category: 'editorial',
    layoutStyle: 'sidebar',
    preferredMode: 'light',
    summary:
      'Soft archival linen, deep botanical forest green, and burnished brass gold crafted for science labs & textbooks.',
    bestFor: 'Unmistakable visual originality across Biology, Chem & Physics',
    displayFontName: 'Playfair Display',
    bodyFontName: 'Plus Jakarta Sans',
    displayFontStack: "'Playfair Display', Georgia, serif",
    bodyFontStack: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '14px monograph',
    preview: {
      canvas: '#F4F2EB',
      surface: '#FCFBF7',
      sidebar: '#FAF8F2',
      border: '#D7D2C3',
      ink: '#14261E',
      dim: '#51635A',
      accent: '#0E4F3A',
      accentSoft: '#E1F0E9',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #0B3326 0%, #0E4F3A 100%)',
      heroAccent: '#E5B84B',
      radiusPx: 12,
      dark: false,
    },
  },
  {
    id: 'nocturnal',
    index: 6,
    name: 'Nocturnal Sanctuary',
    subtitle: 'Midnight OLED Deep Study',
    category: 'minimal',
    layoutStyle: 'focused',
    preferredMode: 'dark',
    summary:
      'True ink-black OLED canvas, warm desk-lamp amber highlights, and centered reading measure for zero late-night glare.',
    bestFor: 'Late-night prep sessions (7 PM – 2 AM) on phones & laptops',
    displayFontName: 'Outfit',
    bodyFontName: 'Source Serif 4',
    displayFontStack: "'Outfit', ui-sans-serif, system-ui, sans-serif",
    bodyFontStack: "'Source Serif 4', Georgia, serif",
    radiusLabel: '14px calm',
    preview: {
      canvas: '#07090F',
      surface: '#111622',
      sidebar: '#0C1019',
      border: '#20283A',
      ink: '#F1F5F9',
      dim: '#94A3B8',
      accent: '#EAB308',
      accentSoft: '#2A2311',
      onAccent: '#0B0E14',
      heroBg: 'linear-gradient(135deg, #131926 0%, #1D2538 100%)',
      heroAccent: '#FACC15',
      radiusPx: 14,
      dark: true,
    },
  },
  {
    id: 'scholar-os',
    index: 7,
    name: 'Scholar OS',
    subtitle: 'Multi-Tool Academic Workspace',
    category: 'minimal',
    layoutStyle: 'compact-rail',
    preferredMode: 'light',
    summary:
      'Cool alabaster workspace, deep ocean teal controls, compact navigation rail, and crisp notebook-grade hierarchy.',
    bestFor: 'Laptop & tablet power-learners juggling notes, labs & CBT',
    displayFontName: 'DM Sans',
    bodyFontName: 'DM Sans',
    displayFontStack: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
    bodyFontStack: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '12px workspace',
    preview: {
      canvas: '#F6F8FA',
      surface: '#FFFFFF',
      sidebar: '#F1F5F8',
      border: '#DCE4EC',
      ink: '#0F1F29',
      dim: '#546978',
      accent: '#0F766E',
      accentSoft: '#E2F5F2',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #115E59 0%, #0F766E 100%)',
      heroAccent: '#5EEAD4',
      radiusPx: 10,
      dark: false,
    },
  },
  {
    id: 'broadsheet',
    index: 8,
    name: 'Editorial Broadsheet',
    subtitle: 'Top-Bar Faculty Masterclass',
    category: 'editorial',
    layoutStyle: 'topbar',
    preferredMode: 'light',
    summary:
      'Replaces the sidebar with a clean 3-zone top navigation bar, high-contrast charcoal & scholar crimson, and magazine headings.',
    bestFor: 'Bold, unforgettable MasterClass-level visual presence',
    displayFontName: 'Playfair Display',
    bodyFontName: 'Manrope',
    displayFontStack: "'Playfair Display', Georgia, serif",
    bodyFontStack: "'Manrope', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '8px editorial',
    preview: {
      canvas: '#FAF8F5',
      surface: '#FFFFFF',
      sidebar: '#FFFFFF',
      border: '#E5DFD7',
      ink: '#141414',
      dim: '#66605B',
      accent: '#9F1239',
      accentSoft: '#FDE8EE',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #1C1917 0%, #3B0E1D 100%)',
      heroAccent: '#FBBF24',
      radiusPx: 8,
      dark: false,
    },
  },
  {
    id: 'pocket',
    index: 9,
    name: 'Pocket Mastery',
    subtitle: 'Mobile-First Rapid Drill Studio',
    category: 'interactive',
    layoutStyle: 'focused',
    preferredMode: 'light',
    summary:
      'Crisp sky mist, bold cobalt actions, energetic coral streak badges, and streamlined thumb-friendly reading column.',
    bestFor: 'Winning smartphone-first students studying anywhere',
    displayFontName: 'Plus Jakarta Sans',
    bodyFontName: 'Plus Jakarta Sans',
    displayFontStack: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
    bodyFontStack: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '22px fluid',
    preview: {
      canvas: '#F2F6FC',
      surface: '#FFFFFF',
      sidebar: '#FFFFFF',
      border: '#D5E1F2',
      ink: '#0F1B33',
      dim: '#536582',
      accent: '#1D4ED8',
      accentSoft: '#E3ECFF',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      heroAccent: '#FB923C',
      radiusPx: 20,
      dark: false,
    },
  },
  {
    id: 'chalkboard',
    index: 10,
    name: 'Chalkboard & Brass',
    subtitle: 'Modernized Lecture Hall',
    category: 'exam',
    layoutStyle: 'sidebar',
    preferredMode: 'light',
    summary:
      'Warm chalk paper paired with deep slate-green blackboard focal panels and warm ochre chalk highlights.',
    bestFor: 'Maths, Physics & Chemistry derivations with classroom warmth',
    displayFontName: 'Fraunces',
    bodyFontName: 'DM Sans',
    displayFontStack: "'Fraunces', Georgia, serif",
    bodyFontStack: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
    radiusLabel: '14px classroom',
    preview: {
      canvas: '#F5F3EB',
      surface: '#FFFDF7',
      sidebar: '#FAF7EE',
      border: '#DBD5C3',
      ink: '#182620',
      dim: '#56645D',
      accent: '#164234',
      accentSoft: '#E3EFEA',
      onAccent: '#FFFFFF',
      heroBg: 'linear-gradient(135deg, #102B22 0%, #194537 100%)',
      heroAccent: '#F0B43A',
      radiusPx: 14,
      dark: false,
    },
  },
] as const;

export function getDesignTemplateById(
  id: string | null | undefined
): DesignTemplateSpec | null {
  if (!id) return null;
  return EYAK_DESIGN_TEMPLATES.find((t) => t.id === id) ?? null;
}

export function getAdjacentDesignTemplateId(
  currentId: DesignTemplateId | null,
  delta: 1 | -1
): DesignTemplateId {
  const n = EYAK_DESIGN_TEMPLATES.length;
  if (!currentId) {
    return delta === 1 ? EYAK_DESIGN_TEMPLATES[0].id : EYAK_DESIGN_TEMPLATES[n - 1].id;
  }
  const idx = EYAK_DESIGN_TEMPLATES.findIndex((t) => t.id === currentId);
  if (idx < 0) return EYAK_DESIGN_TEMPLATES[0].id;
  return EYAK_DESIGN_TEMPLATES[(idx + delta + n) % n].id;
}

export function readStoredDesignTemplate(): DesignTemplateId | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);
    return getDesignTemplateById(raw)?.id ?? null;
  } catch {
    return null;
  }
}

export function writeStoredDesignTemplate(id: DesignTemplateId | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!id) {
      window.localStorage.removeItem(TEMPLATE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(TEMPLATE_STORAGE_KEY, id);
    }
  } catch {
    // Ignore storage quota / privacy mode restrictions
  }
}
