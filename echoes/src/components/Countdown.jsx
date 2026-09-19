// ─── Countdown.jsx ────────────────────────────────────────────────────────────
// Live countdown clock rendered inside locked capsule cards.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

function getRemaining(unlockDate) {
  const diff = new Date(unlockDate) - Date.now();
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  const d  = Math.floor(totalSec / 86400);
  const h  = Math.floor((totalSec % 86400) / 3600);
  const m  = Math.floor((totalSec % 3600) / 60);
  const s  = totalSec % 60;
  return { d, h, m, s };
}

export default function Countdown({ unlockDate, onUnlock }) {
  const [remaining, setRemaining] = useState(() => getRemaining(unlockDate));

  useEffect(() => {
    const id = setInterval(() => {
      const r = getRemaining(unlockDate);
      setRemaining(r);
      if (!r) {
        clearInterval(id);
        onUnlock?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [unlockDate, onUnlock]);

  if (!remaining) return null;

  const { d, h, m, s } = remaining;

  return (
    <div className="flex gap-2 mt-3">
      {[
        { val: d, label: 'days' },
        { val: h, label: 'hrs' },
        { val: m, label: 'min' },
        { val: s, label: 'sec' },
      ].map(({ val, label }) => (
        <div
          key={label}
          style={{
            background: 'rgba(127,164,255,0.07)',
            border: '1px solid rgba(127,164,255,0.15)',
            borderRadius: '0.6rem',
            minWidth: '3.2rem',
            textAlign: 'center',
            padding: '0.35rem 0.5rem',
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', monospace",
              fontVariantNumeric: 'tabular-nums',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--indigo)',
              letterSpacing: '-0.02em',
            }}
          >
            {pad(val)}
          </div>
          <div
            style={{
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '-0.1rem',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
