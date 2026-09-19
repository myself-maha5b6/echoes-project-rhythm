// ─── useCapsules.js ───────────────────────────────────────────────────────────
// React hook that manages the capsule list and bridges components to db.js.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { initDB, createCapsule, getCapsules, deleteCapsule } from '../lib/db';

export default function useCapsules() {
  const [capsules, setCapsules]   = useState([]);
  const [dbReady,  setDbReady]    = useState(false);
  const [error,    setError]      = useState(null);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        await initDB();
        setCapsules(getCapsules());
        setDbReady(true);
      } catch (e) {
        console.error('Echoes: DB init failed', e);
        setError(e.message ?? 'Failed to initialise database.');
      }
    })();
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const addCapsule = useCallback(async (fields) => {
    const row = await createCapsule(fields);
    setCapsules(prev => [row, ...prev]);
    return row;
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const removeCapsule = useCallback(async (id) => {
    await deleteCapsule(id);
    setCapsules(prev => prev.filter(c => c.id !== id));
  }, []);

  return { capsules, dbReady, error, addCapsule, removeCapsule };
}
