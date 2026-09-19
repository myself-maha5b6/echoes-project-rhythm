// ─── CapsuleCard.jsx ──────────────────────────────────────────────────────────
// Renders one time capsule as an envelope-style glass card.
// Locked   → shows live countdown.
// Unlocked → "Open" button reveals message with animation.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import Countdown from './Countdown';

function isUnlocked(unlockDate) {
  return new Date(unlockDate) <= new Date();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Lock icon
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25" fill="none"/>
    <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none"/>
  </svg>
);

// Unlock icon
const UnlockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25" fill="none"/>
    <path d="M4 5V3.5A2 2 0 0 1 8 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none"/>
  </svg>
);

// Trash icon
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 6v4M8 6v4M3 3.5l.5 7a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l.5-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CapsuleCard({ capsule, onDelete }) {
  const [unlocked, setUnlocked]     = useState(() => isUnlocked(capsule.unlock_date));
  const [opened,   setOpened]       = useState(false);
  const [confirm,  setConfirm]      = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [shaking,  setShaking]      = useState(false);

  const handleUnlock = useCallback(() => setUnlocked(true), []);

  const handleOpen = () => setOpened(o => !o);

  const handleDeleteClick = () => {
    if (confirm) {
      setDeleting(true);
      onDelete(capsule.id);
    } else {
      setConfirm(true);
      // Auto-cancel confirm after 4 s
      setTimeout(() => setConfirm(false), 4000);
      // Small shake to draw attention
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  return (
    <div
      className={`glass capsule-card ${unlocked ? 'unlocked' : ''} ${shaking ? 'shake' : ''}`}
      style={{ padding: '1.75rem 1.5rem' }}
    >
      {/* ── Header row ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3" style={{ marginBottom: '0.9rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "'Lora', serif",
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.35,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {capsule.title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
            Written {formatDate(capsule.created_at)}
          </p>
        </div>

        <span className={`badge ${unlocked ? 'badge-unlocked' : 'badge-locked'}`}>
          {unlocked ? <><UnlockIcon /> &nbsp;Open</> : <><LockIcon /> &nbsp;Sealed</>}
        </span>
      </div>

      {/* ── Divider ────────────────────────────────────────── */}
      <div style={{ height: '1px', background: 'var(--border-glow)', margin: '0.75rem 0' }} />

      {/* ── Unlock date ────────────────────────────────────── */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
        {unlocked ? '🎉 Unlocked on' : '⏳ Opens on'}&nbsp;
        <span style={{ color: unlocked ? 'var(--gold)' : 'var(--indigo)', fontWeight: 500 }}>
          {formatDate(capsule.unlock_date)}
        </span>
      </p>

      {/* ── Countdown (locked only) ─────────────────────────── */}
      {!unlocked && (
        <Countdown unlockDate={capsule.unlock_date} onUnlock={handleUnlock} />
      )}

      {/* ── Open / Close button (unlocked only) ─────────────── */}
      {unlocked && (
        <button
          className="btn-gold"
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={handleOpen}
        >
          {opened ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 7H3.5M3.5 7L6 4.5M3.5 7L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Close letter
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4l5 3.5L12 4M2 4v6.5a1 1 0 001 1h8a1 1 0 001-1V4M2 4a1 1 0 011-1h8a1 1 0 011 1" stroke="currentColor" strokeWidth="1.25" fill="none"/>
              </svg>
              Open letter
            </>
          )}
        </button>
      )}

      {/* ── Message reveal ─────────────────────────────────── */}
      {opened && unlocked && (
        <div
          className="reveal-enter message-reveal"
          style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            background: 'rgba(8, 16, 40, 0.5)',
            borderRadius: '0.85rem',
            border: '1px solid rgba(245, 201, 122, 0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem',
              color: 'var(--gold)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L8.5 5H12L9 7.5L10.5 11L7 8.5L3.5 11L5 7.5L2 5H5.5L7 1.5Z" fill="currentColor" opacity="0.8"/>
            </svg>
            Your letter
          </div>
          <div className="prose-message">{capsule.message}</div>
        </div>
      )}

      {/* ── Delete row ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-glow)',
        }}
      >
        {confirm ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#ff7b7b' }}>Are you sure?</span>
            <button
              disabled={deleting}
              onClick={handleDeleteClick}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '0.55rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid rgba(255,80,80,0.4)',
                background: 'rgba(255,60,60,0.15)',
                color: '#ff7b7b',
                transition: 'all 0.2s',
              }}
            >
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              onClick={() => setConfirm(false)}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: '0.55rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                border: '1px solid var(--border-glow)',
                background: 'transparent',
                color: 'var(--text-muted)',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn-ghost" onClick={handleDeleteClick}>
            <TrashIcon />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
