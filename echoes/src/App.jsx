// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root component: starfield, header, loading/error states, form modal.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import useCapsules  from './hooks/useCapsules';
import Dashboard    from './components/Dashboard';
import CapsuleForm  from './components/CapsuleForm';

// ── Deterministic pseudo-random starfield ─────────────────────────────────────
function generateStars(count = 130) {
  // Simple LCG so stars are stable across renders
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  return Array.from({ length: count }, (_, i) => ({
    id:    i,
    left:  `${rand() * 100}%`,
    top:   `${rand() * 100}%`,
    size:  rand() * 2.2 + 0.6,
    dur:   `${rand() * 4 + 2}s`,
    delay: `${rand() * 6}s`,
    op:    rand() * 0.55 + 0.15,
  }));
}

const STARS = generateStars(130);

export default function App() {
  const { capsules, dbReady, error, addCapsule, removeCapsule } = useCapsules();
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(fields) {
    setSubmitting(true);
    try {
      await addCapsule(fields);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ── Starfield ──────────────────────────────────────────── */}
      <div className="stars-layer" aria-hidden="true">
        {STARS.map(s => (
          <span
            key={s.id}
            className="star"
            style={{
              left:  s.left,
              top:   s.top,
              width:  `${s.size}px`,
              height: `${s.size}px`,
              '--dur':    s.dur,
              '--delay':  s.delay,
              '--max-op': s.op,
            }}
          />
        ))}
      </div>

      {/* ── Aurora glow ─────────────────────────────────────────── */}
      <div className="aurora" aria-hidden="true" />

      {/* ── Page shell ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <header
          style={{
            padding: '2.5rem 1.5rem 0',
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Logo + tagline */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                {/* Envelope logo mark */}
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                  <rect x="1" y="1" width="26" height="20" rx="3" fill="none" stroke="url(#eg)" strokeWidth="1.5"/>
                  <path d="M1 3l13 9 13-9" stroke="url(#eg)" strokeWidth="1.5" fill="none"/>
                  <defs>
                    <linearGradient id="eg" x1="0" y1="0" x2="28" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7fa4ff"/>
                      <stop offset="1" stopColor="#f5c97a"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                  className="gradient-text"
                >
                  Echoes
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
                A message to the person you'll become.
              </p>
            </div>

            {/* Write button */}
            {dbReady && (
              <button
                id="write-capsule-btn"
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New capsule
              </button>
            )}
          </div>

          {/* Hero headline */}
          <div style={{ marginTop: '3.5rem', marginBottom: '3rem', textAlign: 'center' }}>
            <h1
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                margin: '0 auto 1rem',
                maxWidth: '700px',
              }}
            >
              <span className="gradient-text">A message to the person</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>you'll become.</span>
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: 'clamp(0.95rem, 2vw, 1.075rem)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Write letters to your future self. Seal them with a date.
              Rediscover them when the moment arrives.
            </p>
          </div>
        </header>

        {/* ── Main content ────────────────────────────────────── */}
        <main
          style={{
            flex: 1,
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
            padding: '0 1.5rem 4rem',
          }}
        >
          {/* Loading */}
          {!dbReady && !error && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                paddingTop: '6rem',
              }}
            >
              <div className="spinner" />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Loading your capsules…
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="glass"
              style={{
                padding: '2rem',
                textAlign: 'center',
                maxWidth: '480px',
                margin: '4rem auto 0',
                borderColor: 'rgba(255,100,100,0.25)',
              }}
            >
              <p style={{ color: '#ff7b7b', fontSize: '1rem' }}>⚠️ {error}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Try refreshing the page. If it persists, your browser may not support WebAssembly.
              </p>
            </div>
          )}

          {/* Dashboard */}
          {dbReady && (
            <Dashboard
              capsules={capsules}
              onDelete={removeCapsule}
              onWrite={() => setShowForm(true)}
            />
          )}
        </main>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            opacity: 0.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Echoes · Your letters, sealed in time.
        </footer>
      </div>

      {/* ── Create form modal ────────────────────────────────── */}
      {showForm && (
        <CapsuleForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          submitting={submitting}
        />
      )}
    </>
  );
}
