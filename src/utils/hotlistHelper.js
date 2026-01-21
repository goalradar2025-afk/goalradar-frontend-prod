// src/utils/hotlistHelper.js
// =====================================================
// GoalRadar — Hotlist Helper (SESSION BASED, FULL)
// =====================================================
// - sessionStorage only
// - dedupe per fixture + market + selection
// - max 5 entries per fixture
// - EMITS unified hotlist:update events
// =====================================================

const STORAGE_KEY = "grd_hotlist_session_v1";
const EVENT_NAME = "hotlist:update";

function read() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function emit(type, items) {
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: {
        type, // "add" | "remove" | "clear"
        count: items.length,
      },
    })
  );
}

function write(items, type) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emit(type, items);
}

function makeKey(x) {
  return `${x.fixture_id}__${x.market}__${x.selection}`;
}

// ----------------------------------------------------
// ADD TO HOTLIST
// ----------------------------------------------------
export function addToHotlist(payload) {
  if (!payload) {
    return { ok: false, error: "NO_PAYLOAD" };
  }

  const { fixture_id, home, away, market, selection } = payload;

  if (!fixture_id || !market || !selection) {
    return { ok: false, error: "MISSING_FIELDS" };
  }

  const items = read();

  const entry = {
    id: crypto.randomUUID(),
    fixture_id,
    home: home || "-",
    away: away || "-",
    market,
    selection,
    created_at: new Date().toISOString(),
    payload,
  };

  const key = makeKey(entry);

  // remove duplicate (same fixture+market+selection)
  let filtered = items.filter((x) => makeKey(x) !== key);

  // max 5 per fixture
  const sameFixture = filtered.filter(
    (x) => Number(x.fixture_id) === Number(fixture_id)
  );
  const other = filtered.filter(
    (x) => Number(x.fixture_id) !== Number(fixture_id)
  );

  sameFixture.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const nextSameFixture = [entry, ...sameFixture].slice(0, 5);
  const next = [...other, ...nextSameFixture];

  write(next, "add");

  return { ok: true, items: next };
}

// ----------------------------------------------------
// DELETE
// ----------------------------------------------------
export function removeFromHotlist(id) {
  const items = read();
  const next = items.filter((x) => x.id !== id);
  write(next, "remove");
  return { ok: true, items: next };
}

// ----------------------------------------------------
// READ
// ----------------------------------------------------
export function getHotlist() {
  return read();
}

// ----------------------------------------------------
// CLEAR
// ----------------------------------------------------
export function clearHotlist() {
  sessionStorage.removeItem(STORAGE_KEY);
  emit("clear", []);
}
