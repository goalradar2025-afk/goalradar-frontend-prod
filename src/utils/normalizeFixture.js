// src/utils/normalizeFixture.js
// GoalRadar v3.0 — FULL BACKEND COMPATIBLE
// FIX: περνάμε markets για να ζωντανέψουν οι τελίτσες (1X2)

function formatKickoffLocal(utc) {
  if (!utc) return null;
  try {
    const d = new Date(utc);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

export function normalizeFixture(raw) {
  if (!raw) return null;

  return {
    fixture_id: raw.fixture_id ?? raw.id ?? null,

    // Time
    utc: raw.utc ?? raw.date ?? null,
    kickoff_local: raw.kickoff_local ?? formatKickoffLocal(raw.date),

    // League
    league_id: raw.league_id ?? null,
    league_name: raw.league_name ?? "",
    league_logo: raw.league_logo ?? "",

    // Teams (BACKEND-COMPATIBLE)
    home_team: raw.home_team ?? raw.home ?? "",
    away_team: raw.away_team ?? raw.away ?? "",

    home_logo: raw.home_logo ?? raw.home_team_logo ?? "",
    away_logo: raw.away_logo ?? raw.away_team_logo ?? "",

    // Venue
    venue: raw.venue_name ?? raw.venue ?? "",

    // ===== CRITICAL FIX =====
    // Pass through markets from backend
    markets: raw.markets ?? null,
  };
}

export function normalizeFixtureList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeFixture);
}
