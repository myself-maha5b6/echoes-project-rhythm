// ─── CapsuleForm.jsx ──────────────────────────────────────────────────────────
// Modal / slide-in panel for creating a new time capsule.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';

// Returns today + 1 day as yyyy-mm-dd (minimum unlock date)
function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function CapsuleForm({ onSubmit, onClose, submitting }) {
  const [title,   setTitle]   = useState('');
  const [message, setMessage] = useState('');
  const [date,    setDate]    = useState('');
  const [errors,  setErrors]  = useState({});

  const titleRef = useRef(null);

  useEffect(() => {
    // Small delay so the animation has time to run before focusing
    const t = setTimeout(() => titleRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  function validate() {
    const e = {};
    if (!title.trim())   e.title   = 'A title helps you find this later.';
    if (!message.trim()) e.message = "Your letter can\u2019t be blank.";
    if (!date)           e.date    = 'Pick a date in the future.';
    else if (date <= new Date().toISOString().split('T')[0])
      e.date = 'The unlock date must be in the future.';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    onSubmit({ title: title.trim(), message: message.trim(), unlockDate: date });
  }

  // Close on Escape
  useEffect(() => {
    const h = (ev) => { if (ev.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    /* ── Backdrop ──────────────────────────────────────────── */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(2, 5, 20, 0.75)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* ── Modal panel ────────────────────────────────────── */}
      <div
        className="glass reveal-enter"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '2.25rem 2rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Create a new time capsule"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: '1.5rem',
                fontWeight: 600,
                margin: 0,
                color: 'var(--text-primary)',
              }}
            >
              Write to your future self
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Seal it. Set the date. Let time do the rest.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close form"
            style={{
              background: 'rgba(127,164,255,0.08)',
              border: '1px solid var(--border-glow)',
              borderRadius: '0.6rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1,
              padding: '0.4rem 0.65rem',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="cap-title"
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Title
            </label>
            <input
              id="cap-title"
              ref={titleRef}
              className="field"
              type="text"
              placeholder="e.g. To myself at 30…"
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(er => ({ ...er, title: '' })); }}
              maxLength={120}
              disabled={submitting}
            />
            {errors.title && <p style={errStyle}>{errors.title}</p>}
          </div>

          {/* Message */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="cap-message"
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Your letter
            </label>
            <textarea
              id="cap-message"
              className="field"
              placeholder="Dear future me, today I feel…"
              value={message}
              onChange={e => { setMessage(e.target.value); setErrors(er => ({ ...er, message: '' })); }}
              disabled={submitting}
            />
            {errors.message && <p style={errStyle}>{errors.message}</p>}
          </div>

          {/* Unlock date */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="cap-date"
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Unlock date
            </label>
            <input
              id="cap-date"
              className="field"
              type="date"
              min={minDate()}
              value={date}
              onChange={e => { setDate(e.target.value); setErrors(er => ({ ...er, date: '' })); }}
              disabled={submitting}
            />
            {errors.date && <p style={errStyle}>{errors.date}</p>}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: '0.75rem 1.4rem',
                borderRadius: '0.875rem',
                border: '1px solid var(--border-glow)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />Sealing…</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4l6 4 6-4M2 4v8.5a1 1 0 001 1h10a1 1 0 001-1V4M2 4a1 1 0 011-1h10a1 1 0 011 1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                  </svg>
                  Seal capsule
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

const errStyle = {
  color: '#ff7b7b',
  fontSize: '0.8rem',
  marginTop: '0.4rem',
  marginLeft: '0.1rem',
};
