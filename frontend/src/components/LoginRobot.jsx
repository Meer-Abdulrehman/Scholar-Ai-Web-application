import { useEffect, useState } from 'react'

export default function LoginRobot({ mood }) {
  // mood: 'idle' | 'peek' | 'happy' | 'sad'
  const [blink, setBlink] = useState(false)

  // Random blinking only in idle mode
  useEffect(() => {
    if (mood !== 'idle') return
    const schedule = () => {
      const t = setTimeout(() => {
        setBlink(true)
        setTimeout(() => { setBlink(false); schedule() }, 180)
      }, 2500 + Math.random() * 2000)
      return t
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [mood])

  const isIdle  = mood === 'idle'
  const isPeek  = mood === 'peek'
  const isHappy = mood === 'happy'
  const isSad   = mood === 'sad'

  return (
    <div className="flex justify-center">
      <div
        className={`transition-all duration-500 select-none
          ${isHappy ? 'animate-robot-happy' : ''}
          ${isSad   ? 'animate-robot-sad'   : ''}
          ${isIdle  ? 'animate-robot-idle'  : ''}
          ${isPeek  ? 'animate-robot-peek'  : ''}
        `}
        style={{ filter: isHappy ? 'drop-shadow(0 0 12px #06b6d4)' : isSad ? 'drop-shadow(0 0 8px #6b7280)' : 'drop-shadow(0 0 6px rgba(6,182,212,0.4))' }}
      >
        <svg viewBox="0 0 120 145" width="160" height="190" xmlns="http://www.w3.org/2000/svg">

          {/* ── Antenna ── */}
          <rect x="57" y="4" width="6" height="16" rx="3" fill="#0891b2" />
          <circle cx="60" cy="4" r="7" fill={isHappy ? '#34d399' : isSad ? '#6b7280' : '#06b6d4'}>
            {isHappy && <animate attributeName="r" values="7;9;7" dur="0.4s" repeatCount="indefinite" />}
          </circle>

          {/* ── Ears ── */}
          <rect x="4"   y="44" width="13" height="22" rx="6" fill="#0891b2" />
          <rect x="103" y="44" width="13" height="22" rx="6" fill="#0891b2" />
          {/* Ear inner */}
          <rect x="7"   y="49" width="6"  height="12" rx="3" fill="#06b6d4" opacity="0.5" />
          <rect x="107" y="49" width="6"  height="12" rx="3" fill="#06b6d4" opacity="0.5" />

          {/* ── Head ── */}
          <rect x="14" y="20" width="92" height="80" rx="22"
            fill={isSad ? '#1e3a5f' : '#0c4a6e'}
            stroke={isHappy ? '#34d399' : isSad ? '#6b7280' : '#06b6d4'}
            strokeWidth="2.5"
          />

          {/* ── Face screen ── */}
          <rect x="22" y="28" width="76" height="65" rx="16"
            fill={isSad ? '#0a2744' : '#082f49'}
          />

          {/* ═══ EYES ═══ */}

          {/* IDLE eyes */}
          {isIdle && !blink && (
            <>
              <circle cx="45" cy="55" r="11" fill="#06b6d4" />
              <circle cx="75" cy="55" r="11" fill="#06b6d4" />
              <circle cx="47" cy="53" r="5"  fill="#0c4a6e" />
              <circle cx="77" cy="53" r="5"  fill="#0c4a6e" />
              <circle cx="49" cy="51" r="2"  fill="white"   />
              <circle cx="79" cy="51" r="2"  fill="white"   />
            </>
          )}

          {/* IDLE blink */}
          {isIdle && blink && (
            <>
              <rect x="34" y="52" width="22" height="5" rx="2.5" fill="#06b6d4" />
              <rect x="64" y="52" width="22" height="5" rx="2.5" fill="#06b6d4" />
            </>
          )}

          {/* HAPPY eyes — arc ^ ^ */}
          {isHappy && (
            <>
              <path d="M34 58 Q45 44 56 58" fill="#34d399" />
              <path d="M64 58 Q75 44 86 58" fill="#34d399" />
              {/* Sparkles */}
              <text x="20" y="40" fontSize="10" fill="#fde68a">✦</text>
              <text x="90" y="36" fontSize="10" fill="#fde68a">✦</text>
              <text x="55" y="30" fontSize="8"  fill="#fde68a">✦</text>
            </>
          )}

          {/* SAD eyes — looking down */}
          {isSad && (
            <>
              <circle cx="45" cy="58" r="11" fill="#475569" />
              <circle cx="75" cy="58" r="11" fill="#475569" />
              <circle cx="43" cy="60" r="5"  fill="#1e293b" />
              <circle cx="73" cy="60" r="5"  fill="#1e293b" />
              {/* Sad eyebrows */}
              <path d="M34 40 Q45 46 56 40" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M64 40 Q75 46 86 40" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Tears */}
              <ellipse cx="42" cy="70" rx="3" ry="4" fill="#93c5fd" opacity="0.7">
                <animate attributeName="cy" values="70;76;70" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="1.2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="78" cy="70" rx="3" ry="4" fill="#93c5fd" opacity="0.7">
                <animate attributeName="cy" values="70;76;70" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="1.5s" repeatCount="indefinite" />
              </ellipse>
            </>
          )}

          {/* PEEK — hands over eyes */}
          {isPeek && (
            <>
              {/* Eyes (dimmed behind hands) */}
              <circle cx="45" cy="55" r="11" fill="#06b6d4" opacity="0.25" />
              <circle cx="75" cy="55" r="11" fill="#06b6d4" opacity="0.25" />
              {/* Left arm */}
              <rect x="14" y="70" width="10" height="30" rx="5" fill="#0891b2" />
              {/* Left hand over left eye */}
              <ellipse cx="46" cy="55" rx="16" ry="11" fill="#0e7490" stroke="#06b6d4" strokeWidth="1.5" />
              <line x1="32" y1="55" x2="22" y2="70" stroke="#0891b2" strokeWidth="9" strokeLinecap="round" />
              {/* Right arm */}
              <rect x="96" y="70" width="10" height="30" rx="5" fill="#0891b2" />
              {/* Right hand over right eye */}
              <ellipse cx="74" cy="55" rx="16" ry="11" fill="#0e7490" stroke="#06b6d4" strokeWidth="1.5" />
              <line x1="88" y1="55" x2="98" y2="70" stroke="#0891b2" strokeWidth="9" strokeLinecap="round" />
              {/* Peeking smile */}
              <path d="M48 78 Q60 84 72 78" stroke="#06b6d4" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* ═══ MOUTH ═══ */}
          {isIdle && (
            <rect x="47" y="76" width="26" height="5" rx="2.5" fill="#06b6d4" />
          )}
          {isHappy && (
            <path d="M36 74 Q60 92 84 74" stroke="#34d399" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
          {isSad && (
            <path d="M38 82 Q60 70 82 82" stroke="#64748b" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}

          {/* ── Neck ── */}
          <rect x="50" y="100" width="20" height="10" rx="5" fill="#0891b2" />

          {/* ── Body ── */}
          <rect x="30" y="110" width="60" height="32" rx="14"
            fill={isSad ? '#1e3a5f' : '#0c4a6e'}
            stroke={isHappy ? '#34d399' : isSad ? '#475569' : '#0891b2'}
            strokeWidth="2"
          />
          {/* Body lights */}
          <circle cx="48" cy="124" r="5"
            fill={isHappy ? '#34d399' : isSad ? '#475569' : '#06b6d4'}
            opacity="0.8"
          >
            {isHappy && <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" repeatCount="indefinite" />}
          </circle>
          <circle cx="60" cy="124" r="5"
            fill={isHappy ? '#fde68a' : isSad ? '#475569' : '#06b6d4'}
            opacity="0.8"
          >
            {isHappy && <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" begin="0.1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="72" cy="124" r="5"
            fill={isHappy ? '#f472b6' : isSad ? '#475569' : '#06b6d4'}
            opacity="0.8"
          >
            {isHappy && <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" begin="0.2s" repeatCount="indefinite" />}
          </circle>

        </svg>
      </div>
    </div>
  )
}
