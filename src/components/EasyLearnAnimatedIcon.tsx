import React, { useId } from 'react';
import { motion } from 'motion/react';

export interface EasyLearnAnimatedIconProps {
  size?: number;
  reduced?: boolean;
  className?: string;
}

/**
 * True multi-layered, choreographed vector animation of the official Easy Learn icon:
 * 1. Deep Royal-Indigo medallion with subtle constellation grid
 * 2. Expanding concentric base energy ripples
 * 3. Calligraphic golden & royal-violet crescent cradle
 * 4. Unfolding 3D open-book wings (left page + soaring right wing)
 * 5. Three 3D isometric ascending purple mastery bars
 * 6. 3D pearl-lavender scholar sphere + graduation mortarboard + pendulum golden tassel
 * 7. Tilted golden elliptical orbit ring + 10-facet 3D bevelled golden star & orbiting spark
 */
export function EasyLearnAnimatedIcon({
  size = 188,
  reduced = false,
  className = '',
}: EasyLearnAnimatedIconProps) {
  const uid = useId().replace(/:/g, '');
  const badgeRadius = Math.max(12, Math.round(size * 0.24));
  const isCompact = size <= 64;

  const bgGradId = `el-bg-${uid}`;
  const goldArcId = `el-gold-arc-${uid}`;
  const violetArcId = `el-violet-arc-${uid}`;
  const pearlSphereId = `el-pearl-${uid}`;
  const bookWingId = `el-wing-${uid}`;
  const capTopId = `el-cap-top-${uid}`;
  const capBandId = `el-cap-band-${uid}`;
  const starHaloId = `el-star-halo-${uid}`;
  const orbitRingId = `el-orbit-ring-${uid}`;

  return (
    <div
      style={{ width: size, height: size, borderRadius: badgeRadius }}
      className={`relative inline-flex items-center justify-center select-none shrink-0 overflow-hidden bg-[#13073B] shadow-[0_20px_50px_-12px_rgba(29,78,216,0.52),0_0_0_1.5px_rgba(251,191,36,0.48)] ${className}`}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        className="w-full h-full block"
      >
        <defs>
          <radialGradient id={bgGradId} cx="52%" cy="38%" r="68%">
            <stop offset="0%" stopColor="#2A1470" />
            <stop offset="56%" stopColor="#170946" />
            <stop offset="100%" stopColor="#0B0426" />
          </radialGradient>

          <linearGradient id={goldArcId} x1="58" y1="194" x2="196" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="68%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id={violetArcId} x1="56" y1="202" x2="196" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4C1D95" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>

          <radialGradient id={pearlSphereId} cx="62%" cy="36%" r="58%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="38%" stopColor="#EDE9FE" />
            <stop offset="78%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#6D28D9" />
          </radialGradient>

          <linearGradient id={bookWingId} x1="52" y1="184" x2="180" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="48%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          <linearGradient id={capTopId} x1="60" y1="52" x2="152" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient id={capBandId} x1="84" y1="74" x2="132" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5B21B6" />
            <stop offset="52%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <radialGradient id={starHaloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.62" />
            <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={orbitRingId} x1="142" y1="78" x2="208" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#FDE047" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* 1. Deep Royal-Indigo Stage Backdrop + Subtle Constellation Grid */}
        <rect width="240" height="240" fill={`url(#${bgGradId})`} />
        {!isCompact && (
          <g fill="#C4B5FD" fillOpacity="0.22">
            <circle cx="32" cy="36" r="1.4" />
            <circle cx="48" cy="62" r="1.1" />
            <circle cx="28" cy="112" r="1.2" />
            <circle cx="204" cy="30" r="1.3" />
            <circle cx="214" cy="118" r="1.5" />
            <circle cx="198" cy="186" r="1.1" />
            <circle cx="42" cy="196" r="1.2" />
          </g>
        )}

        {/* 2. Concentric Base Energy Ripples */}
        <g transform="translate(122, 214)">
          {[26, 45, 64].map((rx, idx) => (
            <motion.ellipse
              key={rx}
              cx="0"
              cy="0"
              rx={rx}
              ry={Math.round(rx * 0.19)}
              stroke="#8B5CF6"
              strokeWidth={idx === 0 ? 1.8 : 1.2}
              initial={reduced ? { opacity: 0.45, scale: 1 } : { opacity: 0.18, scale: 0.86 }}
              animate={
                reduced
                  ? { opacity: 0.45 - idx * 0.1, scale: 1 }
                  : {
                      opacity: [0.2, 0.58 - idx * 0.12, 0.2],
                      scale: [0.92, 1.06, 0.92],
                    }
              }
              transition={
                reduced
                  ? { duration: 0.1 }
                  : {
                      duration: 2.6,
                      delay: idx * 0.32,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            />
          ))}
        </g>

        {/* 3. Sweeping Royal-Violet & Burnished-Gold Crescent Cradle */}
        <motion.g
          style={{ transformOrigin: '124px 166px' }}
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 0.95, rotate: -3 }}
          animate={
            reduced
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 1, scale: [1, 1.015, 1], rotate: [0, 0.8, 0] }
          }
          transition={
            reduced
              ? { duration: 0.15 }
              : {
                  scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          {/* Lower Royal-Violet Crescent */}
          <path
            d="M 62 184 C 98 224, 168 216, 194 156 C 202 138, 200 116, 190 100 C 195 124, 188 152, 168 172 C 140 199, 94 204, 62 184 Z"
            fill={`url(#${violetArcId})`}
          />
          {/* Upper 3D Metallic Gold Crescent */}
          <path
            d="M 65 181 C 102 214, 164 205, 188 150 C 196 132, 195 112, 186 96 C 190 118, 181 146, 161 165 C 135 190, 93 195, 65 181 Z"
            fill={`url(#${goldArcId})`}
          />
        </motion.g>

        {/* 4. Three 3D Isometric Ascending Mastery Bars */}
        {[
          { x: 120, topY: 162, baseY: 191, delay: 0.16 },
          { x: 138, topY: 146, baseY: 187, delay: 0.26 },
          { x: 156, topY: 128, baseY: 179, delay: 0.36 },
        ].map((bar, idx) => {
          const w = 13;
          return (
            <motion.g
              key={bar.x}
              style={{ transformOrigin: `${bar.x + 7}px ${bar.baseY}px` }}
              initial={reduced ? { scaleY: 1 } : { scaleY: 0.82 }}
              animate={
                reduced
                  ? { scaleY: 1 }
                  : {
                      scaleY: [0.92, 1.08, 0.92],
                    }
              }
              transition={
                reduced
                  ? { duration: 0.15 }
                  : {
                      duration: 2.1,
                      delay: bar.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            >
              {/* Front isometric face */}
              <polygon
                points={`${bar.x},${bar.topY + 4} ${bar.x + w * 0.62},${bar.topY + 7} ${bar.x + w * 0.62},${bar.baseY} ${bar.x},${bar.baseY - 3}`}
                fill={idx === 2 ? '#8B5CF6' : '#7C3AED'}
              />
              {/* Right shaded isometric face */}
              <polygon
                points={`${bar.x + w * 0.62},${bar.topY + 7} ${bar.x + w},${bar.topY + 3} ${bar.x + w},${bar.baseY - 4} ${bar.x + w * 0.62},${bar.baseY}`}
                fill="#4C1D95"
              />
              {/* Luminous top diamond facet */}
              <polygon
                points={`${bar.x},${bar.topY + 4} ${bar.x + w * 0.38},${bar.topY} ${bar.x + w},${bar.topY + 3} ${bar.x + w * 0.62},${bar.topY + 7}`}
                fill="#DDD6FE"
              />
            </motion.g>
          );
        })}

        {/* 5. Unfolding Open Book Soaring Wings */}
        {/* Left Outer Violet Cover & Pearl Inner Page */}
        <motion.g
          style={{ transformOrigin: '108px 188px' }}
          initial={reduced ? { scale: 1, rotate: 0 } : { scale: 0.96, rotate: -3 }}
          animate={
            reduced
              ? { scale: 1, rotate: 0 }
              : { scale: [1, 1.02, 1], rotate: [0, -2.4, 0] }
          }
          transition={
            reduced
              ? { duration: 0.15 }
              : {
                  duration: 2.9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          {/* Outer left violet cover */}
          <path
            d="M 104 190 C 88 172, 64 166, 42 170 L 58 118 C 76 118, 92 126, 104 148 Z"
            fill="#8B5CF6"
          />
          <path
            d="M 104 190 C 90 170, 68 162, 48 164 L 62 122 C 78 122, 92 130, 104 150 Z"
            fill="#4C1D95"
          />
          {/* Crisp white-pearl open left page */}
          <path
            d="M 108 190 C 95 166, 76 156, 56 156 L 69 110 C 88 112, 102 124, 109 148 Z"
            fill={`url(#${bookWingId})`}
          />
          {/* Inner left page lavender curve */}
          <path
            d="M 106 178 C 95 158, 81 148, 66 147 L 75 120 C 89 122, 99 132, 106 150 Z"
            fill="#7C3AED"
            fillOpacity="0.82"
          />
        </motion.g>

        {/* Right Soaring Wing Sweeping Upward to the Golden Star */}
        <motion.g
          style={{ transformOrigin: '108px 188px' }}
          initial={reduced ? { scale: 1, rotate: 0 } : { scale: 0.96, rotate: 3 }}
          animate={
            reduced
              ? { scale: 1, rotate: 0 }
              : { scale: [1, 1.025, 1], rotate: [0, 2.6, 0] }
          }
          transition={
            reduced
              ? { duration: 0.15 }
              : {
                  duration: 2.9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          {/* Secondary violet ribbon feather */}
          <path
            d="M 116 158 C 130 132, 152 122, 174 102 C 166 122, 148 134, 124 158 Z"
            fill="#A78BFA"
          />
          {/* Main soaring white-pearl book wing */}
          <path
            d="M 108 192 C 102 152, 114 124, 144 108 C 160 100, 172 90, 178 74 C 174 102, 156 118, 134 132 C 118 142, 112 164, 108 192 Z"
            fill={`url(#${bookWingId})`}
          />
          {/* Subtle spine highlight */}
          <path
            d="M 108 190 C 107 156, 119 131, 148 114"
            stroke="#C4B5FD"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* 6. 3D Pearl Scholar Sphere + Graduation Mortarboard + Swinging Golden Tassel */}
        <motion.g
          initial={reduced ? { y: 0 } : { y: -2 }}
          animate={
            reduced
              ? { y: 0 }
              : { y: [0, -3.5, 0] }
          }
          transition={
            reduced
              ? { duration: 0.15 }
              : {
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          {/* Pearl-Lavender 3D Scholar Head Sphere */}
          <circle cx="109" cy="98" r="20.5" fill={`url(#${pearlSphereId})`} />

          {/* Mortarboard Skullcap Band */}
          <path
            d="M 88 73 L 88 87 C 96 81, 120 81, 128 87 L 128 73 Z"
            fill={`url(#${capBandId})`}
          />
          <path
            d="M 88 87 C 96 81, 120 81, 128 87"
            stroke="#A78BFA"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Isometric Mortarboard Diamond Top */}
          <polygon
            points="105,49 148,64 108,78 62,67"
            fill={`url(#${capTopId})`}
          />
          {/* Mortarboard Rim Highlight */}
          <polyline
            points="62,67 105,49 148,64"
            stroke="#C4B5FD"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pendulum Golden Tassel */}
          <motion.g
            style={{ transformOrigin: '74px 66px' }}
            animate={
              reduced
                ? { rotate: 0 }
                : { rotate: [-9, 7, -5, 6, -9] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {/* Cord */}
            <path
              d="M 88 64 L 73 67 L 71 89"
              stroke="#FBBF24"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Golden Tassel Bead */}
            <circle cx="71" cy="91" r="3.4" fill="#FDE047" stroke="#B45309" strokeWidth="0.9" />
            {/* Flared Golden Fringe */}
            <path
              d="M 68.5 94 L 66 108 L 75.5 108 L 73 94 Z"
              fill="#F59E0B"
            />
            <line x1="70.8" y1="95" x2="70.5" y2="107.5" stroke="#FEF08A" strokeWidth="1.1" />
          </motion.g>
        </motion.g>

        {/* 7. Tilted Golden Elliptical Orbit Ring + 3D 10-Facet Golden Star */}
        <motion.g
          style={{ transformOrigin: '176px 60px' }}
          initial={reduced ? { scale: 1 } : { scale: 0.94 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Warm Radial Starlight Halo */}
          <motion.circle
            cx="176"
            cy="60"
            r="34"
            fill={`url(#${starHaloId})`}
            animate={
              reduced
                ? { opacity: 0.85, scale: 1 }
                : { opacity: [0.65, 1, 0.65], scale: [0.92, 1.1, 0.92] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
          />

          {/* Tilted Golden Elliptical Orbit Back Arc */}
          <g transform="rotate(-24 176 62)">
            <ellipse
              cx="176"
              cy="62"
              rx="28"
              ry="9.5"
              stroke={`url(#${orbitRingId})`}
              strokeWidth="2.2"
              strokeDasharray="128 18"
            />
            {/* Orbiting Golden Spark */}
            {!reduced && (
              <motion.circle
                cx="148"
                cy="62"
                r="2.6"
                fill="#FEF9C3"
                animate={{
                  x: [0, 28, 56, 28, 0],
                  y: [0, -9.5, 0, 9.5, 0],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </g>

          {/* 3D Bevel-Shaded 5-Point Golden Star */}
          <motion.g
            style={{ transformOrigin: '176px 59px' }}
            animate={
              reduced
                ? { scale: 1, rotate: 0 }
                : { scale: [1, 1.07, 1], rotate: [-2, 3, -2] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {/* Outer warm golden silhouette */}
            <polygon
              points="176,38 181.5,51.2 195.8,52.6 184.9,62.1 188.2,76.1 176,68.6 163.8,76.1 167.1,62.1 156.2,52.6 170.5,51.2"
              fill="#F59E0B"
            />
            {/* Sunlit upper-left 3D bevel facets */}
            <polygon points="176,59 176,38 170.5,51.2" fill="#FEF9C3" />
            <polygon points="176,59 181.5,51.2 195.8,52.6" fill="#FDE047" />
            <polygon points="176,59 156.2,52.6 170.5,51.2" fill="#FEF08A" />
            <polygon points="176,59 167.1,62.1 163.8,76.1" fill="#FBBF24" />
            <polygon points="176,59 184.9,62.1 188.2,76.1" fill="#D97706" />
          </motion.g>

          {/* Foreground Orbit Front Arc Overlap */}
          <g transform="rotate(-24 176 62)">
            <path
              d="M 148 62 A 28 9.5 0 0 0 204 62"
              stroke="#FDE047"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        </motion.g>
      </svg>

      {/* Subtle Diagonal Specular Light Sheen */}
      {!reduced && (
        <motion.div
          initial={{ x: '-145%' }}
          animate={{ x: '155%' }}
          transition={{
            duration: 1.75,
            repeat: Infinity,
            repeatDelay: 1.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            background:
              'linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.22) 50%, transparent 68%)',
          }}
          className="absolute inset-0 pointer-events-none will-change-transform"
        />
      )}
    </div>
  );
}
