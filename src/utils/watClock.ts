import type { ClockFormat } from '../types';

/**
 * West Africa Time (Africa/Lagos) is permanently UTC+1 year-round (no DST).
 * Computing via exact UTC+1 offset guarantees identical, deterministic formatting
 * across every browser and OS timezone.
 */
export const WAT_UTC_OFFSET_MS = 60 * 60 * 1000;

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const WEEKDAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export interface WatClockSnapshot {
  format: ClockFormat;
  /** HH:MM in 12-hour (01–12) or 24-hour (00–23) format */
  hoursMinutes: string;
  /** Padded SS (00–59) */
  seconds: string;
  /** 'AM' | 'PM' in 12h mode, null in 24h mode */
  period: 'AM' | 'PM' | null;
  /** Full readable time e.g. '09:30:45 PM' or '21:30:45' */
  formattedTime: string;
  weekdayShort: string;
  weekdayFull: string;
  /** Padded day of month '01'..'31' */
  day: string;
  /** Padded month '01'..'12' */
  monthNum: string;
  monthShort: string;
  monthFull: string;
  year: string;
  /** 'Tue, 17 Nov 2026' */
  dateLong: string;
  /** '17 / 11 / 2026' (DD / MM / YYYY) */
  dateNumeric: string;
  zoneShort: 'WAT';
  zoneFull: 'WAT · UTC+1';
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatWatClock(
  epochMs: number,
  format: ClockFormat = '12h'
): WatClockSnapshot {
  const safeFormat: ClockFormat = format === '24h' ? '24h' : '12h';
  const watDate = new Date(epochMs + WAT_UTC_OFFSET_MS);

  const rawHours24 = watDate.getUTCHours();
  const mins = watDate.getUTCMinutes();
  const secs = watDate.getUTCSeconds();

  const dayIndex = watDate.getUTCDay();
  const dateNum = watDate.getUTCDate();
  const monthIndex = watDate.getUTCMonth();
  const fullYear = watDate.getUTCFullYear();

  let displayHours: number;
  let period: 'AM' | 'PM' | null = null;

  if (safeFormat === '12h') {
    period = rawHours24 >= 12 ? 'PM' : 'AM';
    displayHours = rawHours24 % 12 || 12;
  } else {
    displayHours = rawHours24;
  }

  const hoursMinutes = `${pad2(displayHours)}:${pad2(mins)}`;
  const seconds = pad2(secs);
  const formattedTime = period
    ? `${hoursMinutes}:${seconds} ${period}`
    : `${hoursMinutes}:${seconds}`;

  const weekdayShort = WEEKDAYS_SHORT[dayIndex];
  const weekdayFull = WEEKDAYS_FULL[dayIndex];
  const day = pad2(dateNum);
  const monthNum = pad2(monthIndex + 1);
  const monthShort = MONTHS_SHORT[monthIndex];
  const monthFull = MONTHS_FULL[monthIndex];
  const year = `${fullYear}`;

  return {
    format: safeFormat,
    hoursMinutes,
    seconds,
    period,
    formattedTime,
    weekdayShort,
    weekdayFull,
    day,
    monthNum,
    monthShort,
    monthFull,
    year,
    dateLong: `${weekdayShort}, ${day} ${monthShort} ${year}`,
    dateNumeric: `${day} / ${monthNum} / ${year}`,
    zoneShort: 'WAT',
    zoneFull: 'WAT · UTC+1',
  };
}
