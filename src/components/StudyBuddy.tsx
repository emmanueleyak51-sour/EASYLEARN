import React, { useState } from 'react';
import eyakMentorUrl from '../assets/images/eyak_campus_mentor_crest_1795326684733.jpg';
import { CrestSvg, Icon } from './Icons';

export type StudyBuddyMood = 'happy' | 'cheer' | 'think';

/**
 * Illustrated Nigerian Campus Mentor Avatar (replaces the legacy geometric robot).
 * Includes a resilient vector scholar fallback per Zero-Broken-Image Policy.
 */
export function StudyBuddy({
  size = 56,
  className = '',
}: {
  mood?: StudyBuddyMood;
  size?: number;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const radius = Math.max(14, Math.round(size * 0.32));

  if (imgFailed) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size, borderRadius: radius }}
        className={`inline-flex items-center justify-center shrink-0 select-none bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] text-white shadow-md ${className}`}
      >
        <Icon name="user" size={Math.round(size * 0.52)} />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: radius }}
      className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 select-none bg-[#DDD0FF] ring-2 ring-white/70 dark:ring-purple-300/30 shadow-[0_6px_16px_-4px_rgba(76,29,149,0.38)] ${className}`}
    >
      <img
        src={eyakMentorUrl}
        alt="Eyak campus mentor"
        referrerPolicy="no-referrer"
        draggable={false}
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover object-top scale-[1.12] pointer-events-none select-none"
      />
    </span>
  );
}

/**
 * Expressive Illustrated Nigerian Campus Mentor Hero Stage:
 * - Friendly waving young scholar in royal-purple Eyak hoodie
 * - Tilted "Hello!" callout + golden spark rays
 * - Crisp speech bubble with underlined scholar name & bold highlighted subject
 * - Streak encouragement strip + daily lightning thought strip
 */
export function StudyBuddyGreeting({
  greeting,
  timeGreeting,
  studentName,
  questionPrefix,
  subjectHighlight,
  subtext,
  thoughtLine,
  badge,
  onClickPrompt,
}: {
  mood?: StudyBuddyMood;
  greeting: string;
  timeGreeting?: string;
  studentName?: string;
  questionPrefix?: string;
  subjectHighlight?: string;
  subtext?: string;
  thoughtLine?: string;
  badge?: React.ReactNode;
  onClickPrompt?: () => void;
}) {
  const [mentorFailed, setMentorFailed] = useState(false);
  const hasStructuredBubble = Boolean(timeGreeting && studentName);

  return (
    <section
      aria-label="Campus mentor greeting"
      className="eyak-mentor-stage relative overflow-hidden rounded-[22px] p-3.5 sm:p-4.5 flex flex-col gap-2.5"
    >
      {/* Ambient diagonal brush sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-16 w-64 h-64 rounded-full bg-white/30 dark:bg-purple-400/12 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-12 w-64 h-64 rounded-full bg-purple-400/20 dark:bg-indigo-500/15 blur-2xl"
      />

      <div className="relative z-10 grid grid-cols-1 min-[680px]:grid-cols-12 gap-3.5 sm:gap-4 items-center">
        {/* Left: Waving Illustrated Nigerian Campus Mentor */}
        <div className="min-[680px]:col-span-5 relative flex items-end justify-center">
          {/* Golden wave rays near raised hand */}
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 36 36"
            fill="none"
            className="pointer-events-none absolute top-4 left-4 sm:left-6 z-20 eyak-wave-rays"
          >
            <path d="M16 24 L8 10" stroke="#FACC15" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M23 21 L22 5" stroke="#FACC15" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M11 29 L2 22" stroke="#F59E0B" strokeWidth="3.8" strokeLinecap="round" />
          </svg>

          <div className="relative w-[176px] sm:w-[208px] aspect-square rounded-[20px] overflow-hidden eyak-mentor-portrait-wrap shadow-[0_10px_22px_-10px_rgba(59,12,163,0.3)]">
            {/* Expressive tilted "Hello!" tucked cleanly inside portrait frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2 right-2.5 z-20 -rotate-12"
            >
              <span className="font-[var(--display)] font-extrabold text-[17px] sm:text-[20px] tracking-tight text-[#28135E] drop-shadow-xs">
                Hello!
              </span>
              <svg
                width="54"
                height="8"
                viewBox="0 0 72 10"
                fill="none"
                className="-mt-1 text-[#5B2BD6]"
              >
                <path
                  d="M3 7 C24 2, 48 2, 69 5"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {!mentorFailed ? (
              <img
                src={eyakMentorUrl}
                alt="Friendly Nigerian Eyak mentor waving hello"
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setMentorFailed(true)}
                className="w-full h-full object-cover object-top select-none pointer-events-none eyak-mentor-float"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#6D28D9] to-[#3B0CA3] text-white p-4">
                <CrestSvg size={48} />
                <span className="font-[var(--display)] font-bold text-[14px]">Eyak Mentor</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Speech Bubble + Streak Encouragement Card */}
        <div className="min-[680px]:col-span-7 flex flex-col gap-2.5 min-w-0">
          {/* Comic Speech Bubble */}
          <div className="relative rounded-[18px] bg-white/95 dark:bg-[#1F173D]/95 border border-white/90 dark:border-[#4A3889] shadow-[0_8px_20px_-10px_rgba(36,16,94,0.2)] px-4 py-3 sm:px-5 sm:py-3.5">
            {/* Pointer triangle toward mentor on desktop/tablet */}
            <span
              aria-hidden="true"
              className="hidden min-[680px]:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 bg-white/95 dark:bg-[#1F173D]/95 border-l border-b border-white/90 dark:border-[#4A3889]"
            />

            {hasStructuredBubble ? (
              <div className="relative flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 w-full">
                  <div className="font-[var(--display)] font-extrabold text-[19px] sm:text-[22px] leading-[1.15] text-[#1E1348] dark:text-[#F5F0FF]">
                    <div>{timeGreeting},</div>
                    <span className="relative inline-block mt-0.5">
                      <span className="relative z-10">{studentName}!</span>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 -bottom-0.5 h-[3.5px] rounded-full bg-[#FACC15]"
                      />
                    </span>
                  </div>
                  {badge}
                </div>

                {questionPrefix && (
                  <p className="font-[var(--display)] font-semibold text-[15px] sm:text-[16.5px] leading-snug text-[#271B54] dark:text-[#E7DFFF] pt-0.5">
                    {onClickPrompt ? (
                      <button
                        type="button"
                        onClick={onClickPrompt}
                        className="text-center sm:text-left hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <span>{questionPrefix} </span>
                        {subjectHighlight && (
                          <strong className="font-extrabold text-[var(--gold)]">
                            {subjectHighlight}?
                          </strong>
                        )}
                      </button>
                    ) : (
                      <>
                        <span>{questionPrefix} </span>
                        {subjectHighlight && (
                          <strong className="font-extrabold text-[var(--gold)]">
                            {subjectHighlight}?
                          </strong>
                        )}
                      </>
                    )}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative flex flex-wrap items-center justify-between gap-2">
                <p className="font-[var(--display)] font-bold text-[16px] sm:text-[17.5px] text-[#1E1348] dark:text-[#F5F0FF] leading-snug">
                  {greeting}
                </p>
                {badge}
              </div>
            )}
          </div>

          {/* Streak Encouragement Card with Calendar Icon */}
          {subtext && (
            <div className="rounded-xl bg-white/75 dark:bg-[#251B49]/85 backdrop-blur-md border border-white/80 dark:border-[#463682] px-3.5 py-2.5 flex items-center gap-2.5 shadow-[0_4px_12px_-6px_rgba(36,16,94,0.16)]">
              <span className="w-8 h-8 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                <Icon name="calendar" size={16} />
              </span>
              <p className="text-[12.5px] sm:text-[13px] font-semibold text-[#2B1E5A] dark:text-[#E5DCFF] leading-snug">
                {subtext}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Full-Width Luminous Daily Thought Strip */}
      {thoughtLine && (
        <div
          aria-label="Thought for today"
          className="relative z-10 rounded-full bg-white/85 dark:bg-[#221942]/90 backdrop-blur-md border border-white/85 dark:border-[#463682] px-3.5 py-2 flex items-center justify-center gap-1.5 text-center shadow-[0_4px_14px_-8px_rgba(36,16,94,0.18)]"
        >
          <span className="text-[#F59E0B] shrink-0" aria-hidden="true">
            <Icon name="bolt" size={15} />
          </span>
          <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#2D1B69] dark:text-[#EDE6FF] leading-snug">
            {thoughtLine}
          </p>
        </div>
      )}
    </section>
  );
}
