import React, { useState } from 'react';
import type { DiagramSpec } from '../types';
import { renderDiagram } from '../data/diagrams';
import { LIC, CLAB_IC, PLAB_IC, BLAB_IC, ALAB_IC } from '../data/labs';
import { sanitizeEducationalHtml } from '../utils/securityPolicy';
import { AnimatedNumber } from './AnimatedNumber';
import eyakCrestUrl from '../assets/images/eyak_crest_logo_1795316062898.jpg';

const IC_PATHS: Record<string, string> = {
  home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/>',
  rev: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  go: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  flame: '<path d="M12 2c.5 4-3 5.5-3 9a4 4 0 0 0 8 0c0-2-1-3.5-2-4.5-.2 1.5-1 2.2-1.8 2.2.3-2.5-.2-4.7-1.2-6.7z"/><path d="M12 22a6.5 6.5 0 0 1-6.5-6.5c0-3 2-5.5 3.5-7"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
  sigma: '<path d="M18 5H6l6 7-6 7h12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  books: '<path d="M4 19V5a1 1 0 0 1 1-1h4v16H5a1 1 0 0 1-1-1zM9 4h4v16H9zM14 5.5l3.6-1 3.4 13.5-3.6 1z"/>',
  vol: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/>',
  volume: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  mute: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/>',
  crown: '<path d="M3 18h18v2H3zM4 16L2 7l5 4 5-7 5 7 5-4-2 9z"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3"/>',
  play: '<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
  skipPrev: '<polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none"/><rect x="5" y="4" width="2.6" height="16" rx="1" fill="currentColor" stroke="none"/>',
  skipNext: '<polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none"/><rect x="16.4" y="4" width="2.6" height="16" rx="1" fill="currentColor" stroke="none"/>',
  replay: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  mic: '<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/>',
  micOff: '<line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 10M5 10a7 7 0 0 0 12 5M15 9.34V5a3 3 0 0 0-5.68-1.33M9 9v1a3 3 0 0 0 5.12 2.12M12 17v4M8 21h8"/>',
  radio: '<circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>',
  grip: '<circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.4-2"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".8" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".8" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".8" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".8" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.6-10-8.6z"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  atom: '<circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-30 12 12)"/>',
  dna: '<path d="M7 3c0 5 10 5 10 10s-10 5-10 10M17 3c0 5-10 5-10 10s10 5 10 10M8.5 6h7M8.5 18h7M7.5 12h9"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/><path d="M16 7h4v4"/>',
  medal: '<circle cx="12" cy="14" r="6"/><path d="M8.21 8.89L7 2h10l-1.21 6.89M12 11v6M9.5 14h5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
  scales: '<path d="M12 3v18M8 21h8M4 7h16"/><path d="M5 7l-3 7a3.5 3.5 0 0 0 7 0L6 7"/><path d="M18 7l-3 7a3.5 3.5 0 0 0 7 0l-3-7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19"/><line x1="2" y1="2" x2="22" y2="22"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="9.5" x2="21" y2="9.5"/>',
  integral: '<path d="M16.5 3.5c-2.2 0-3.2 1.4-3.7 4.2L11.2 16.3c-.5 2.8-1.5 4.2-3.7 4.2"/><circle cx="16.8" cy="4.2" r=".9" fill="currentColor"/><circle cx="7.2" cy="19.8" r=".9" fill="currentColor"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8"/><ellipse cx="12" cy="12" rx="4.2" ry="9"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  spark: '<path d="M12 2l2.1 6.2L20 10.5l-5.9 2.3L12 19l-2.1-6.2L4 10.5l5.9-2.3L12 2z"/><path d="M19 3l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  bars: '<rect x="3" y="12" width="4" height="8" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
  trendUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  phoneCall: '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
};

export function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const path = IC_PATHS[name] || IC_PATHS.check;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}

export function CrestSvg({ size = 40, className = '' }: { size?: number; className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const radius = Math.max(10, Math.round(size * 0.28));

  if (imgFailed) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className={`shrink-0 select-none ${className}`}
      >
        <rect width="64" height="64" rx="18" fill="#0D042E" />
        <path
          d="M16 42 C24 30, 32 34, 48 18 C44 34, 36 42, 30 48 C26 40, 20 38, 16 42 Z"
          fill="#EDE9FE"
        />
        <polygon points="30,14 42,20 30,25 18,20" fill="#7C3AED" />
        <circle cx="30" cy="29" r="5.5" fill="#DDD6FE" />
        <polygon
          points="49,10 50.8,14.2 55.2,14.6 51.8,17.5 52.8,21.8 49,19.5 45.2,21.8 46.2,17.5 42.8,14.6 47.2,14.2"
          fill="#FACC15"
        />
        <path
          d="M16 46 C26 55, 44 53, 52 38"
          stroke="#FACC15"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: radius }}
      className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 select-none bg-[#0B0326] ring-1 ring-white/20 shadow-[0_4px_12px_-2px_rgba(59,12,163,0.45)] ${className}`}
    >
      <img
        src={eyakCrestUrl}
        alt="Easy Learn crest"
        referrerPolicy="no-referrer"
        draggable={false}
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover scale-[1.08] pointer-events-none select-none"
      />
    </span>
  );
}

export function AdirePattern() {
  return (
    <svg className="adire-svg" width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id="adire-geo" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M22 2L42 22L22 42L2 22Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M22 10L34 22L22 34L10 22Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="22" cy="22" r="2.2" fill="currentColor" />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" />
          <circle cx="44" cy="0" r="1.5" fill="currentColor" />
          <circle cx="0" cy="44" r="1.5" fill="currentColor" />
          <circle cx="44" cy="44" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#adire-geo)" />
    </svg>
  );
}

export function RingGauge({
  value,
  target,
  size = 114,
  stroke = 9,
  onDark = true,
  label = 'Mastery score',
}: {
  value: number;
  target?: number;
  size?: number;
  stroke?: number;
  onDark?: boolean;
  label?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const off = mounted ? c * (1 - clamped / 100) : c;
  const targetA = target != null ? ((target / 100) * 360 - 90) * (Math.PI / 180) : null;
  const tx = targetA != null ? size / 2 + r * Math.cos(targetA) : 0;
  const ty = targetA != null ? size / 2 + r * Math.sin(targetA) : 0;
  const bgStroke = onDark ? 'rgba(255,255,255,0.22)' : 'var(--line)';
  const fgStroke = onDark ? 'var(--hero-badge)' : 'var(--gold)';

  return (
    <div className="relative inline-grid place-items-center shrink-0">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${clamped} percent`}
        className="col-start-1 row-start-1"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={bgStroke}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fgStroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c.toFixed(1)}
          strokeDashoffset={off.toFixed(1)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        {targetA != null && (
          <circle
            cx={tx}
            cy={ty}
            r={4.5}
            fill={onDark ? '#FFFFFF' : 'var(--green)'}
            stroke={onDark ? 'var(--crest-bg)' : 'var(--card)'}
            strokeWidth={2}
          />
        )}
      </svg>
      <div className="col-start-1 row-start-1 flex flex-col items-center justify-center leading-none">
        <span className={`font-extrabold tabular-nums tracking-tight ${onDark ? 'text-white' : 'text-[var(--ink)]'} text-[28px]`}>
          <AnimatedNumber value={clamped} suffix="%" />
        </span>
        {target != null && (
          <span className={`mt-1 text-[11px] font-bold ${onDark ? 'text-white/75' : 'text-[var(--dim)]'}`}>
            Goal {target}%
          </span>
        )}
      </div>
    </div>
  );
}

export function MiniRing({ value, size = 38 }: { value: number; size?: number }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const strokeW = size <= 40 ? 3 : 3.5;
  const r = (size - strokeW * 2) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const off = mounted ? c * (1 - clamped / 100) : c;
  const done = clamped >= 70;
  return (
    <div className="relative inline-grid place-items-center shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="col-start-1 row-start-1">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={strokeW} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={done ? 'var(--green)' : 'var(--gold)'}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={c.toFixed(1)}
          strokeDashoffset={off.toFixed(1)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span
        className={`col-start-1 row-start-1 ${
          size <= 40 ? 'text-[10px]' : 'text-[11px]'
        } font-extrabold tabular-nums text-[var(--ink)]`}
      >
        {clamped}%
      </span>
    </div>
  );
}

export function LabGlyph({ id, size = 24 }: { id: string; size?: number }) {
  const body =
    (LIC as Record<string, string>)[id] ||
    (CLAB_IC as Record<string, string>)[id] ||
    (PLAB_IC as Record<string, string>)[id] ||
    (BLAB_IC as Record<string, string>)[id] ||
    (ALAB_IC as Record<string, string>)[id] ||
    IC_PATHS.pen;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

export function RichHtml({ html, className = '' }: { html: string; className?: string }) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeEducationalHtml(html) }}
    />
  );
}

export function DiagramFigure({ g, cap }: { g?: DiagramSpec; cap?: string }) {
  if (!g) return null;
  const svgHtml = renderDiagram(g);
  if (!svgHtml) return null;
  const sig = `${g[0]}:${svgHtml.length}`;
  return (
    <figure key={sig} className="fig anim-rise">
      <div dangerouslySetInnerHTML={{ __html: svgHtml }} />
      {cap && <figcaption dangerouslySetInnerHTML={{ __html: sanitizeEducationalHtml(cap) }} />}
    </figure>
  );
}
