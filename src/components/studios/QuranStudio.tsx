import React, { useEffect, useMemo, useState } from 'react';
import {
  AN_NAWAWI_HADITHS,
  OFFLINE_QURAN_SURAHS,
  QURAN_EDITIONS,
  QURAN_SURAHS,
  type QuranAyahItem,
  type QuranEditionId,
} from '../../data/reference/irsQuranData';

import { LiquidCapsuleBar } from '../ULessonMotion';

const QUICK_SURAH_NUMS = [1, 103, 108, 112, 113, 114];

export function QuranStudio() {
  const [tab, setTab] = useState<'quran' | 'hadith'>('quran');
  const [surah, setSurah] = useState<number>(1);
  const [enabledEditions, setEnabledEditions] = useState<QuranEditionId[]>([
    'arabic',
    'transliteration',
    'sahih',
  ]);
  const [ayahs, setAyahs] = useState<QuranAyahItem[]>(() => OFFLINE_QURAN_SURAHS[1] || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>('');

  const surahMeta = useMemo(
    () => QURAN_SURAHS.find((s) => s.number === surah) || QURAN_SURAHS[0],
    [surah]
  );

  useEffect(() => {
    const controller = new AbortController();
    const offline = OFFLINE_QURAN_SURAHS[surah];
    if (offline) setAyahs(offline);
    setLoading(true);
    setNotice('');

    const load = async () => {
      try {
        const res = await fetch(`/api/reference/quran?surah=${surah}`, { signal: controller.signal });
        if (res.ok) {
          const data = (await res.json()) as { ayahs?: QuranAyahItem[] };
          if (!controller.signal.aborted && Array.isArray(data.ayahs) && data.ayahs.length) {
            setAyahs(data.ayahs);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Use offline fallback
      }
      if (!controller.signal.aborted) {
        if (offline) {
          setAyahs(offline);
          setNotice('Reading from built-in study copy.');
        } else {
          setAyahs([]);
          setNotice('This Surah needs an internet connection right now. Try Al-Fatihah, Al-Asr, Al-Kawthar, Al-Ikhlas, Al-Falaq, or An-Nas offline.');
        }
        setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [surah]);

  const toggleEdition = (id: QuranEditionId) => {
    setEnabledEditions((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((item) => item !== id) : prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Mode Switcher */}
      <LiquidCapsuleBar
        roleType="tablist"
        layoutMode="grid"
        gridClassName="grid-cols-2 gap-2"
        size="lg"
        ariaLabel="IRS study studio mode"
        items={[
          { id: 'quran' as const, label: 'Study Qur’an (5 editions)', icon: 'book' },
          { id: 'hadith' as const, label: 'An-Nawawi Hadith cards', icon: 'award' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'quran' ? (
        <>
          <section className="rtc-card rounded-[26px] p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h2 className="h18 text-[var(--ink)]">Choose a Surah</h2>
                <p className="text-[13px] text-[var(--dim)]">
                  Compare Arabic script, pronunciation, and three trusted English translations
                </p>
              </div>
              <select
                aria-label="Select Surah"
                value={surah}
                onChange={(e) => setSurah(Number(e.target.value))}
                className="min-h-[44px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] font-bold text-[var(--ink)]"
              >
                {QURAN_SURAHS.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name} ({s.meaning})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick IRS Syllabus Surahs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {QUICK_SURAH_NUMS.map((num) => {
                const meta = QURAN_SURAHS.find((s) => s.number === num)!;
                const active = surah === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSurah(num)}
                    className={`shrink-0 px-3.5 py-2 rounded-[16px] border-2 text-left cursor-pointer ${
                      active
                        ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                        : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                  >
                    <div className="text-[12.5px] font-extrabold">{meta.number}. {meta.name}</div>
                    <div className={`text-[11px] ${active ? 'opacity-90' : 'text-[var(--dim)]'}`}>
                      {meta.meaning}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 5 Edition Toggles */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--line)]">
              <span className="text-[13px] font-bold text-[var(--ink)]">
                Show editions (pick 1 to 5 together)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {QURAN_EDITIONS.map((ed) => {
                  const active = enabledEditions.includes(ed.id);
                  return (
                    <button
                      key={ed.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleEdition(ed.id)}
                      className={`px-3 py-2 rounded-[16px] border-2 text-left cursor-pointer ${
                        active
                          ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)]'
                      }`}
                    >
                      <div className="text-[12.5px] font-extrabold">{ed.label}</div>
                      <div className="text-[11px] opacity-80 truncate">{ed.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <article className="rtc-card rounded-[28px] p-5 sm:p-7 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 flex-wrap border-b border-[var(--line)] pb-3">
              <div>
                <h2 className="h24 text-[var(--ink)]">
                  Surah {surahMeta.number}: {surahMeta.name}
                </h2>
                <p className="text-[13px] text-[var(--dim)]">
                  {surahMeta.meaning} · {surahMeta.revelation} · {surahMeta.ayahs} verses
                </p>
              </div>
              {loading && (
                <span className="tile-sky px-3 py-1 rounded-full text-[12px] font-bold">
                  Loading Surah…
                </span>
              )}
            </div>

            {notice && (
              <div className="rounded-[16px] tile-mint px-4 py-2.5 text-[13px] font-semibold">
                {notice}
              </div>
            )}

            <div className="flex flex-col gap-3.5">
              {ayahs.map((a) => (
                <div
                  key={a.numberInSurah}
                  className="rounded-[20px] bg-[var(--bg)] border-2 border-[var(--line)] p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold)] text-[var(--on-acc)] text-[12px] font-extrabold">
                      Ayah {a.numberInSurah}
                    </span>
                  </div>
                  {enabledEditions.includes('arabic') && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="text-[24px] sm:text-[28px] leading-[1.9] text-[var(--ink)] text-right font-semibold"
                    >
                      {a.arabic}
                    </p>
                  )}
                  {enabledEditions.includes('transliteration') && (
                    <p className="text-[14px] italic text-[var(--gold)] font-semibold">
                      {a.transliteration}
                    </p>
                  )}
                  {enabledEditions.includes('sahih') && (
                    <p className="text-[15px] text-[var(--ink)] leading-relaxed">
                      <span className="font-bold text-[var(--dim)]">Sahih International: </span>
                      {a.sahih}
                    </p>
                  )}
                  {enabledEditions.includes('yusufali') && (
                    <p className="text-[15px] text-[var(--ink)] leading-relaxed">
                      <span className="font-bold text-[var(--dim)]">Yusuf Ali: </span>
                      {a.yusufali}
                    </p>
                  )}
                  {enabledEditions.includes('pickthall') && (
                    <p className="text-[15px] text-[var(--ink)] leading-relaxed">
                      <span className="font-bold text-[var(--dim)]">Pickthall: </span>
                      {a.pickthall}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>
        </>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AN_NAWAWI_HADITHS.map((h) => (
            <article
              key={h.num}
              className="rtc-card rounded-[24px] p-5 flex flex-col justify-between gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="tile-peach px-3 py-1 rounded-full text-[12px] font-bold">
                    Hadith #{h.num}
                  </span>
                  <span className="text-[12px] font-bold text-[var(--dim)]">{h.narrator}</span>
                </div>
                <h3 className="h18 text-[var(--ink)]">{h.title}</h3>
                <p className="text-[15px] font-[var(--serif)] text-[var(--ink)] leading-relaxed">
                  “{h.text}”
                </p>
              </div>
              <div className="rounded-[16px] tile-mint px-3.5 py-2.5 text-[13px] font-semibold">
                Key exam lesson: {h.lesson}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
