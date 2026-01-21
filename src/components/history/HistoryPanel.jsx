// src/components/history/HistoryPanel.jsx
// =====================================================
// GOALRADAR — HistoryPanel
// - Wrapper του HistoryProfile
// - ΔΕΝ επηρεάζει ανάλυση
// - ΠΕΡΝΑΕΙ ΜΟΝΟ canonical IDs
// =====================================================

import React from "react";
import useHistoryProfile from "./useHistoryProfile";
import HistoryProfile from "./HistoryProfile";

export default function HistoryPanel({ fixture }) {
  if (!fixture) return null;

  const fixtureId = fixture.fixture_id || fixture.id || null;
  const leagueId = fixture.league_id || fixture.league?.id || null;
  const homeTeamId = fixture.home_team_id || fixture.home?.id || null;
  const awayTeamId = fixture.away_team_id || fixture.away?.id || null;

  const { data, loading, error } = useHistoryProfile({
    fixtureId,
    leagueId,          // 🔑 ΤΟ ΚΡΙΣΙΜΟ FIX
    homeTeamId,
    awayTeamId,
  });

  return (
    <HistoryProfile
      data={data}
      loading={loading}
      error={error}
    />
  );
}
