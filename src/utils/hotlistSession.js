// src/utils/hotlistSession.js
// =====================================================
// GoalRadar — Hotlist Session Store (SESSION ONLY)
// =====================================================
// - sessionStorage (σβήνει με κλείσιμο browser)
// - unique: fixture_id + market + selection
// - max 5 entries per fixture
// =====================================================

const KEY = "grd_hotlist_session_v1";

function safeParse(json) {
  try {
    const x = JSON.parse(json);
    return Array.isArray(x) ? x : [];
  } catch {
    return [];
  }
}

export function readHotlist() {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(KEY);
  return raw ? safeParse(raw) : [];
}

export function writeHotlist(items) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(Array.isArray(items) ? items : []));
  window.dispatchEvent(new Event("grd_hotlist_updated"));
}

function makeKey(item) {
  const fixtureId = String(item?.fixture_id ?? "");
  const market = String(item?.market ?? "");
  const selection = String(item?.selection ?? "");
  return `${fixtureId}__${market}__${selection}`;
}

export function addHotlistEntry(entry) {
  const nowIso = new Date().toISOString();

  const normalized = {
    id: entry?.id ?? crypto?.randomUUID?.() ?? String(Date.now()),
    fixture_id: Number(entry?.fixture_id ?? 0),
    home: String(entry?.home ?? ""),
    away: String(entry?.away ?? ""),
    market: String(entry?.market ?? ""),
    selection: String(entry?.selection ?? ""),
    created_at: entry?.created_at ?? nowIso,
    payload: entry?.payload ?? entry ?? {},
  };

  if (!normalized.fixture_id || !normalized.market || !normalized.selection) {
    return { ok: false, reason: "missing_required_fields" };
  }

  const items = readHotlist();

  // unique per fixture_id+market+selection
  const k = makeKey(normalized);
  const withoutDup = items.filter((it) => makeKey(it) !== k);

  // max 5 per fixture
  const sameFixture = withoutDup.filter((it) => Number(it.fixture_id) === normalized.fixture_id);
  const otherFixtures = withoutDup.filter((it) => Number(it.fixture_id) !== normalized.fixture_id);

  // newest first for same fixture
  sameFixture.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

  const cappedSameFixture = [normalized, ...sameFixture].slice(0, 5);

  const next = [...otherFixtures, ...cappedSameFixture];

  writeHotlist(next);
  return { ok: true, items: next };
}

export function deleteHotlistEntry(id) {
  const items = readHotlist();
  const next = items.filter((it) => String(it.id) !== String(id));
  writeHotlist(next);
  return { ok: true, items: next };
}

export function clearHotlist() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event("grd_hotlist_updated"));
}
