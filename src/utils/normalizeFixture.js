// src/utils/normalizeFixture.js
// GoalRadar v3.0 — FULL BACKEND COMPATIBLE
// FIX: σωστό fixture_id + teams mapping + markets pass-through

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
    // =========================
    // CRITICAL: FIXTURE ID
    // =========================
    fixture_id: raw.fixture?.id ?? raw.fixture_id ?? raw.id ?? null,

    // =========================
    // TIME
    // =========================
    utc: raw.fixture?.date ?? raw.utc ?? raw.date ?? null,
    kickoff_local:
      raw.kickoff_local ??
      formatKickoffLocal(raw.fixture?.date ?? raw.date),

    // =========================
    // LEAGUE
    // =========================
    league_id: raw.league?.id ?? raw.league_id ?? null,
    league_name: raw.league?.name ?? raw.league_name ?? "",
    league_logo: raw.league?.logo ?? raw.league_logo ?? "",

    // =========================
    // TEAMS (API-Football shape)
    // =========================
    home_team:
      raw.teams?.home?.name ??
      raw.home_team ??
      raw.home ??
      "",

    away_team:
      raw.teams?.away?.name ??
      raw.away_team ??
      raw.away ??
      "",

    home_logo:
      raw.teams?.home?.logo ??
      raw.home_logo ??
      raw.home_team_logo ??
      "",

    away_logo:
      raw.teams?.away?.logo ??
      raw.away_logo ??
      raw.away_team_logo ??
      "",

    // =========================
    // VENUE
    // =========================
    venue:
      raw.fixture?.venue?.name ??
      raw.venue_name ??
      raw.venue ??
      "",

    // =========================
    // MARKETS (για τελίτσες 1X2)
    // =========================
    markets: raw.markets ?? null,

    // keep raw for analysis/debug
    raw,
  };
}

export function normalizeFixtureList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeFixture);
}
