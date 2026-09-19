// ─── EmptyState.jsx ───────────────────────────────────────────────────────────

export default function EmptyState({ onWrite }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: '5rem 2rem', maxWidth: '32rem', margin: '0 auto' }}
    >
      {/* Envelope SVG illustration */}
      <svg
        width="96"
        height="80"
        viewBox="0 0 96 80"
        fill="none"
        style={{ marginBottom: '2rem', opacity: 0.6 }}
      >
        {/* envelope body */}
        <rect
          x="4" y="20" width="88" height="56"
          rx="6"
          fill="none"
          stroke="rgba(127,164,255,0.4)"
          strokeWidth="2"
        />
        {/* flap */}
        <path
          d="M4 20 L48 50 L92 20"
          stroke="rgba(127,164,255,0.4)"
          strokeWidth="2"
          fill="none"
        />
        {/* bottom fold lines */}
        <line x1="4"  y1="76" x2="40" y2="48" stroke="rgba(127,164,255,0.2)" strokeWidth="1.5" />
        <line x1="92" y1="76" x2="56" y2="48" stroke="rgba(127,164,255,0.2)" strokeWidth="1.5" />
        {/* star above */}
        <path
          d="M48 4 L50.5 10.5 L57.5 10.5 L52 14.5 L54.5 21 L48 17 L41.5 21 L44 14.5 L38.5 10.5 L45.5 10.5 Z"
          fill="rgba(245,201,122,0.5)"
        />
      </svg>

      <h2
        style={{
          fontFamily: "'Lora', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
        }}
      >
        No capsules yet
      </h2>

      <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        Your first letter to the future is waiting to be written.
        Seal a thought, a dream, or a memory — and let time do the rest.
      </p>

      <button className="btn-primary" onClick={onWrite}>
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Write your first capsule
      </button>
    </div>
  );
}
