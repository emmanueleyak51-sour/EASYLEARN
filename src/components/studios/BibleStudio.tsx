import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '../Icons';
import {
  BIBLE_BOOKS_CATALOG,
  type BibleVersionId,
} from '../../utils/studioCalculators';
import {
  BIBLE_VERSIONS,
  CRS_QUICK_PASSAGES,
  getOfflineBibleChapter,
  type BibleVerseItem,
} from '../../data/reference/crsBibleData';

const BOOKMARK_KEY = 'eyak_crs_bible_bookmarks_v1';

interface SavedVerse {
  key: string;
  ref: string;
  version: BibleVersionId;
  text: string;
}

function loadBookmarks(): SavedVerse[] {
  try {
    const raw = window.localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
  } catch {
    return [];
  }
}

export function BibleStudio() {
  const [book, setBook] = useState<string>('Psalms');
  const [chapter, setChapter] = useState<number>(23);
  const [version, setVersion] = useState<BibleVersionId>('rsv');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareVersion, setCompareVersion] = useState<BibleVersionId>('nlt');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<SavedVerse[]>(() => loadBookmarks());

  const [verses, setVerses] = useState<BibleVerseItem[]>(() =>
    getOfflineBibleChapter('Psalms', 23, 'rsv') || []
  );
  const [compareVerses, setCompareVerses] = useState<BibleVerseItem[]>(() =>
    getOfflineBibleChapter('Psalms', 23, 'nlt') || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceNote, setSourceNote] = useState<string>('');

  const bookMeta = useMemo(
    () => BIBLE_BOOKS_CATALOG.find((b) => b.name === book) || BIBLE_BOOKS_CATALOG[0],
    [book]
  );

  const otBooks = useMemo(() => BIBLE_BOOKS_CATALOG.filter((b) => b.testament === 'OT'), []);
  const ntBooks = useMemo(() => BIBLE_BOOKS_CATALOG.filter((b) => b.testament === 'NT'), []);

  const fetchChapter = useCallback(
    async (b: string, ch: number, ver: BibleVersionId, signal: AbortSignal): Promise<{ items: BibleVerseItem[]; note: string }> => {
      try {
        const res = await fetch(
          `/api/reference/bible?book=${encodeURIComponent(b)}&chapter=${ch}&version=${encodeURIComponent(ver)}`,
          { signal }
        );
        if (res.ok) {
          const data = (await res.json()) as { verses?: BibleVerseItem[] };
          if (Array.isArray(data.verses) && data.verses.length > 0) {
            return { items: data.verses, note: '' };
          }
        }
      } catch {
        // Fall back to built-in study chapters seamlessly
      }
      const offline = getOfflineBibleChapter(b, ch, ver);
      if (offline) {
        return { items: offline, note: 'Showing built-in study excerpt for this passage.' };
      }
      return {
        items: [],
        note: 'This chapter needs an internet connection right now. Try one of the CRS quick passages above to read offline.',
      };
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    // Show built-in offline chapter immediately if available so UI never flashes empty
    const instantPrimary = getOfflineBibleChapter(book, chapter, version);
    if (instantPrimary) setVerses(instantPrimary);
    if (compareMode) {
      const instantCompare = getOfflineBibleChapter(book, chapter, compareVersion);
      if (instantCompare) setCompareVerses(instantCompare);
    }

    setLoading(true);
    setSourceNote('');

    const run = async () => {
      const primary = await fetchChapter(book, chapter, version, controller.signal);
      if (controller.signal.aborted) return;
      setVerses(primary.items);
      setSourceNote(primary.note);

      if (compareMode) {
        const secondary = await fetchChapter(book, chapter, compareVersion, controller.signal);
        if (!controller.signal.aborted) {
          setCompareVerses(secondary.items);
        }
      }
      if (!controller.signal.aborted) setLoading(false);
    };
    void run();

    return () => controller.abort();
  }, [book, chapter, version, compareMode, compareVersion, fetchChapter]);

  const handleBookChange = (nextBook: string) => {
    const found = BIBLE_BOOKS_CATALOG.find((b) => b.name === nextBook);
    setBook(nextBook);
    setChapter((prev) => (found && prev > found.chapters ? 1 : prev));
    setSearchQuery('');
  };

  const toggleBookmark = (v: BibleVerseItem) => {
    const ref = `${book} ${chapter}:${v.verse}`;
    const key = `${ref}|${version}`;
    setBookmarks((prev) => {
      const exists = prev.some((item) => item.key === key);
      const next = exists
        ? prev.filter((item) => item.key !== key)
        : [{ key, ref, version, text: v.text }, ...prev].slice(0, 40);
      try {
        window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      } catch {
        /* ignore storage quota errors */
      }
      return next;
    });
  };

  const bookmarkedKeys = useMemo(() => new Set(bookmarks.map((b) => b.key)), [bookmarks]);

  const compareByVerse = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of compareVerses) map.set(item.verse, item.text);
    return map;
  }, [compareVerses]);

  const filteredVerses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return verses;
    return verses.filter(
      (v) => v.text.toLowerCase().includes(q) || String(v.verse) === q
    );
  }, [verses, searchQuery]);

  const versionMeta = BIBLE_VERSIONS.find((v) => v.id === version) || BIBLE_VERSIONS[0];
  const compareMeta = BIBLE_VERSIONS.find((v) => v.id === compareVersion) || BIBLE_VERSIONS[1];

  const textSizeClass =
    fontSize === 'sm'
      ? 'text-[14.5px] leading-[1.7]'
      : fontSize === 'lg'
        ? 'text-[18.5px] leading-[1.85]'
        : 'text-[16.5px] leading-[1.8]';

  return (
    <div className="flex flex-col gap-5">
      {/* CRS Syllabus Quick Passages */}
      <section aria-label="CRS syllabus passages" className="rtc-card rounded-[24px] p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="h18 text-[var(--ink)]">CRS exam passages</h2>
            <p className="text-[13px] text-[var(--dim)]">
              Jump straight to key Old and New Testament passages in 12 popular Nigerian Bible versions
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBookmarks((v) => !v)}
            className="min-h-[38px] px-3.5 rounded-[16px] bg-[var(--acc-soft)] border-2 border-[var(--acc-line)] text-[13px] font-bold text-[var(--gold)] cursor-pointer whitespace-nowrap"
          >
            Saved verses ({bookmarks.length})
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CRS_QUICK_PASSAGES.map((p) => {
            const active = book === p.book && chapter === p.chapter;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setBook(p.book);
                  setChapter(p.chapter);
                  setSearchQuery('');
                }}
                className={`shrink-0 px-3.5 py-2 rounded-[16px] border-2 text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)] shadow-[0_3px_0_var(--acc-d)]'
                    : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--acc-line)]'
                }`}
              >
                <div className="text-[12.5px] font-extrabold leading-tight">{p.refLabel}</div>
                <div className={`text-[11.5px] ${active ? 'opacity-90' : 'text-[var(--dim)]'}`}>
                  {p.title}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Saved Bookmarks Drawer */}
      {showBookmarks && (
        <section aria-label="Saved verses" className="rtc-card rounded-[24px] p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="h18 text-[var(--ink)]">Your saved verses</h3>
            <button
              type="button"
              onClick={() => setShowBookmarks(false)}
              className="text-[13px] font-bold text-[var(--gold)] cursor-pointer"
            >
              Close
            </button>
          </div>
          {bookmarks.length === 0 ? (
            <p className="text-[13.5px] text-[var(--dim)]">
              Tap any verse while reading to save it here for quick revision before exams.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookmarks.map((b) => (
                <div
                  key={b.key}
                  className="rounded-[18px] bg-[var(--bg)] border-2 border-[var(--line)] p-3.5 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-extrabold text-[var(--gold)]">
                      {b.ref} ({b.version.toUpperCase()})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setBookmarks((prev) => {
                          const next = prev.filter((item) => item.key !== b.key);
                          try {
                            window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
                          } catch {
                            /* ignore */
                          }
                          return next;
                        });
                      }}
                      className="text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-[14px] text-[var(--ink)] font-[var(--serif)] leading-relaxed">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Main Bible Reader Controls */}
      <section aria-label="Bible controls" className="rtc-card rounded-[28px] p-4 sm:p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5 flex flex-col gap-1">
            <label htmlFor="crs-bible-book" className="text-[12.5px] font-bold text-[var(--dim)]">
              Book (66 books)
            </label>
            <select
              id="crs-bible-book"
              value={book}
              onChange={(e) => handleBookChange(e.target.value)}
              className="min-h-[44px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14.5px] font-bold text-[var(--ink)]"
            >
              <optgroup label="Old Testament">
                {otBooks.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="New Testament">
                {ntBooks.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="sm:col-span-4 flex flex-col gap-1">
            <label htmlFor="crs-bible-chapter" className="text-[12.5px] font-bold text-[var(--dim)]">
              Chapter
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous chapter"
                disabled={chapter <= 1}
                onClick={() => setChapter((c) => Math.max(1, c - 1))}
                className="min-h-[44px] px-3 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[var(--ink)] font-bold disabled:opacity-40 cursor-pointer"
              >
                <Icon name="back" size={16} />
              </button>
              <select
                id="crs-bible-chapter"
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="flex-1 min-h-[44px] px-3 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14.5px] font-bold text-[var(--ink)]"
              >
                {Array.from({ length: bookMeta.chapters }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    Chapter {n}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Next chapter"
                disabled={chapter >= bookMeta.chapters}
                onClick={() => setChapter((c) => Math.min(bookMeta.chapters, c + 1))}
                className="min-h-[44px] px-3 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[var(--ink)] font-bold disabled:opacity-40 cursor-pointer"
              >
                <Icon name="go" size={16} />
              </button>
            </div>
          </div>

          <div className="sm:col-span-3 flex flex-col gap-1">
            <span className="text-[12.5px] font-bold text-[var(--dim)]">Text size</span>
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Text size">
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  aria-pressed={fontSize === sz}
                  className={`min-h-[44px] rounded-[16px] border-2 font-bold text-[13px] cursor-pointer ${
                    fontSize === sz
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                      : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                  }`}
                >
                  {sz === 'sm' ? 'A-' : sz === 'md' ? 'A' : 'A+'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 12 Popular Nigerian Bible Versions + Compare Toggle */}
        <div className="flex flex-col gap-2.5 pt-1 border-t border-[var(--line)]">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[13px] font-bold text-[var(--ink)]">
              Choose Bible version (12 popular versions)
            </span>
            <button
              type="button"
              onClick={() => {
                setCompareMode((prev) => {
                  const next = !prev;
                  if (next && compareVersion === version) {
                    setCompareVersion(version === 'rsv' ? 'nlt' : 'rsv');
                  }
                  return next;
                });
              }}
              aria-pressed={compareMode}
              className={`min-h-[36px] px-3.5 rounded-[16px] border-2 text-[12.5px] font-bold cursor-pointer ${
                compareMode
                  ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                  : 'bg-[var(--acc-soft)] text-[var(--gold)] border-[var(--acc-line)]'
              }`}
            >
              {compareMode ? 'Comparing 2 versions' : 'Compare side by side'}
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2" role="group" aria-label="Bible versions">
            {BIBLE_VERSIONS.map((v) => {
              const active = version === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setVersion(v.id);
                    if (v.id === compareVersion) {
                      setCompareVersion(v.id === 'rsv' ? 'nlt' : 'rsv');
                    }
                  }}
                  className={`px-1.5 sm:px-2.5 py-2 rounded-[14px] sm:rounded-[16px] border-2 text-center sm:text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)] shadow-[0_3px_0_var(--acc-d)]'
                      : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--acc-line)]'
                  }`}
                >
                  <div className="text-[12.5px] sm:text-[13.5px] font-extrabold">{v.short}</div>
                  <div className={`hidden sm:block text-[10.5px] truncate ${active ? 'opacity-90' : 'text-[var(--dim)]'}`}>
                    {v.name}
                  </div>
                </button>
              );
            })}
          </div>

          {compareMode && (
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <label htmlFor="crs-compare-version" className="text-[13px] font-bold text-[var(--dim)]">
                Second version to compare:
              </label>
              <select
                id="crs-compare-version"
                value={compareVersion}
                onChange={(e) => setCompareVersion(e.target.value as BibleVersionId)}
                className="min-h-[38px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--acc-line)] text-[13.5px] font-bold text-[var(--ink)]"
              >
                {BIBLE_VERSIONS.filter((v) => v.id !== version).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.short} — {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search inside chapter */}
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a word or verse number in this chapter..."
            aria-label="Filter verses in chapter"
            className="flex-1 min-h-[42px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[42px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[13px] font-bold text-[var(--dim)] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Scripture Reading Canvas */}
      <article
        aria-label={`${book} chapter ${chapter}`}
        className="rtc-card rounded-[28px] p-5 sm:p-7 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-[var(--line)] pb-3">
          <div>
            <h2 className="h24 text-[var(--ink)]">
              {book} {chapter}
            </h2>
            <p className="text-[13px] text-[var(--dim)]">
              {versionMeta.name} ({versionMeta.short})
              {compareMode ? ` compared with ${compareMeta.name} (${compareMeta.short})` : ` · ${versionMeta.style}`}
            </p>
          </div>
          {loading && (
            <span className="tile-sky px-3 py-1 rounded-full text-[12px] font-bold">
              Loading full chapter…
            </span>
          )}
        </div>

        {sourceNote && (
          <div className="rounded-[16px] tile-peach px-4 py-2.5 text-[13px] font-semibold">
            {sourceNote}
          </div>
        )}

        {filteredVerses.length === 0 ? (
          <p className="text-[14.5px] text-[var(--dim)] py-4">
            {searchQuery
              ? 'No verses in this chapter match your search word.'
              : 'Pick one of the CRS exam passages above or choose another chapter to read.'}
          </p>
        ) : compareMode ? (
          <div className="flex flex-col gap-3">
            <div className="hidden md:grid md:grid-cols-2 gap-4 text-[12.5px] font-bold text-[var(--gold)] px-2">
              <span>{versionMeta.name} ({versionMeta.short})</span>
              <span>{compareMeta.name} ({compareMeta.short})</span>
            </div>
            {filteredVerses.map((v) => {
              const saved = bookmarkedKeys.has(`${book} ${chapter}:${v.verse}|${version}`);
              const secondText = compareByVerse.get(v.verse);
              return (
                <div
                  key={v.verse}
                  className={`rounded-[18px] p-3.5 border-2 transition-colors ${
                    saved
                      ? 'bg-[var(--acc-soft)] border-[var(--acc-line)]'
                      : 'bg-[var(--bg)] border-[var(--line)]'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="inline-block mr-2 px-2 py-0.5 rounded-full bg-[var(--gold)] text-[var(--on-acc)] text-[11.5px] font-extrabold align-middle">
                        {v.verse}
                      </span>
                      <span className={`font-[var(--serif)] text-[var(--ink)] ${textSizeClass}`}>
                        {v.text}
                      </span>
                    </div>
                    <div className="md:border-l md:border-[var(--line)] md:pl-4">
                      <span className="md:hidden inline-block mr-2 text-[11.5px] font-extrabold text-[var(--gold)]">
                        {compareMeta.short}:
                      </span>
                      <span className={`font-[var(--serif)] text-[var(--ink)] ${textSizeClass}`}>
                        {secondText || 'Verse not available in the second version for this excerpt.'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(v)}
                      className="text-[12px] font-bold text-[var(--gold)] cursor-pointer"
                    >
                      {saved ? 'Saved ✓' : 'Save verse'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredVerses.map((v) => {
              const saved = bookmarkedKeys.has(`${book} ${chapter}:${v.verse}|${version}`);
              return (
                <button
                  key={v.verse}
                  type="button"
                  onClick={() => toggleBookmark(v)}
                  className={`w-full text-left rounded-[16px] px-3.5 py-2.5 border-2 transition-colors cursor-pointer ${
                    saved
                      ? 'bg-[var(--acc-soft)] border-[var(--acc-line)]'
                      : 'bg-transparent border-transparent hover:bg-[var(--bg)] hover:border-[var(--line)]'
                  }`}
                >
                  <span className="inline-block mr-2.5 px-2 py-0.5 rounded-full bg-[var(--acc-soft)] text-[var(--gold)] text-[12px] font-extrabold align-middle">
                    {v.verse}
                  </span>
                  <span className={`font-[var(--serif)] text-[var(--ink)] ${textSizeClass}`}>
                    {v.text}
                  </span>
                  {saved && (
                    <span className="ml-2 inline-block text-[11.5px] font-bold text-[var(--gold)]">
                      Saved
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
}
