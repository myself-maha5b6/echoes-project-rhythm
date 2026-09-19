// ─── db.js ────────────────────────────────────────────────────────────────────
// Wraps sql.js (client-side SQLite) with IndexedDB persistence.
// All state lives in a single `capsules` table.
// ─────────────────────────────────────────────────────────────────────────────

import initSqlJs from 'sql.js';

const IDB_DB_NAME   = 'echoes-idb';
const IDB_STORE     = 'echoes-store';
const IDB_KEY       = 'capsules.db';
const SCHEMA_SQL    = `
  CREATE TABLE IF NOT EXISTS capsules (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    message      TEXT    NOT NULL,
    unlock_date  TEXT    NOT NULL,
    created_at   TEXT    NOT NULL
  );
`;

// ── IDB helpers ───────────────────────────────────────────────────────────────
function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function loadFromIDB() {
  const idb  = await openIDB();
  return new Promise((resolve, reject) => {
    const tx    = idb.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req   = store.get(IDB_KEY);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror   = () => reject(req.error);
  });
}

async function saveToIDB(uint8Array) {
  const idb  = await openIDB();
  return new Promise((resolve, reject) => {
    const tx    = idb.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req   = store.put(uint8Array, IDB_KEY);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ── Module-level singleton ────────────────────────────────────────────────────
let _db = null;

async function persist() {
  if (!_db) return;
  const data = _db.export();
  await saveToIDB(data);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialise sql.js, hydrate from IndexedDB if available, otherwise create
 * a fresh schema.  Must be called once before any other function.
 */
export async function initDB() {
  if (_db) return _db;

  const SQL = await initSqlJs({
    locateFile: () => '/sql-wasm.wasm',
  });

  const saved = await loadFromIDB();

  if (saved) {
    _db = new SQL.Database(saved);
    // Ensure schema exists on old dbs that predate any migration
    _db.run(SCHEMA_SQL);
  } else {
    _db = new SQL.Database();
    _db.run(SCHEMA_SQL);
  }

  return _db;
}

/**
 * Insert a new capsule and persist.
 * @param {{ title: string, message: string, unlockDate: string }} capsule
 * @returns {object} The newly created capsule row.
 */
export async function createCapsule({ title, message, unlockDate }) {
  if (!_db) throw new Error('DB not initialised');
  const createdAt = new Date().toISOString();
  _db.run(
    'INSERT INTO capsules (title, message, unlock_date, created_at) VALUES (?, ?, ?, ?)',
    [title, message, unlockDate, createdAt]
  );
  await persist();

  // Return the just-inserted row
  const stmt = _db.prepare('SELECT * FROM capsules WHERE id = last_insert_rowid()');
  const row  = stmt.getAsObject();
  stmt.free();
  return row;
}

/**
 * Return all capsules ordered newest-first.
 * @returns {object[]}
 */
export function getCapsules() {
  if (!_db) throw new Error('DB not initialised');
  const stmt     = _db.prepare('SELECT * FROM capsules ORDER BY created_at DESC');
  const results  = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

/**
 * Delete a capsule by ID and persist.
 * @param {number} id
 */
export async function deleteCapsule(id) {
  if (!_db) throw new Error('DB not initialised');
  _db.run('DELETE FROM capsules WHERE id = ?', [id]);
  await persist();
}
