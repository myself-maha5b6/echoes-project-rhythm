// ─── Dashboard.jsx ────────────────────────────────────────────────────────────
// Main view: capsule grid + stats strip.
// ─────────────────────────────────────────────────────────────────────────────

import CapsuleCard from './CapsuleCard';
import EmptyState  from './EmptyState';

export default function Dashboard({ capsules, onDelete, onWrite }) {
  if (capsules.length === 0) {
    return <EmptyState onWrite={onWrite} />;
  }

  const lockedCount   = capsules.filter(c => new Date(c.unlock_date) > new Date()).length;
  const unlockedCount = capsules.length - lockedCount;

  return (
    <div>
      {/* ── Stats strip ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Total capsules', value: capsules.length,  color: 'var(--indigo)' },
          { label: 'Still sealed',   value: lockedCount,      color: 'var(--indigo)' },
          { label: 'Ready to open',  value: unlockedCount,    color: 'var(--gold)'   },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="glass"
            style={{
              padding: '0.9rem 1.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              flex: '1 1 8rem',
            }}
          >
            <span
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Capsule grid ─────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: '1.25rem',
        }}
      >
        {capsules.map(capsule => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
