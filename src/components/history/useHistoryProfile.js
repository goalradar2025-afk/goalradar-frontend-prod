// src/components/history/useHistoryProfile.js
// =====================================================
// GOALRADAR — useHistoryProfile (AUTONOMOUS HOOK)
// - ΚΑΝΕΙ ΜΟΝΟ fetch
// - ΜΙΛΑΕΙ ΜΟΝΟ με /api/history_profile
// - ΔΕΝ υπολογίζει
// - ΔΕΝ μετατρέπει
// - ΔΕΝ έχει γνώση UI
// - ΣΤΕΛΝΕΙ ΜΟΝΟ canonical IDs (LOCKED)
// =====================================================

import { useEffect, useState } from "react";

export default function useHistoryProfile({
  fixtureId,
  leagueId,
  homeTeamId,
  awayTeamId,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔒 history ΔΕΝ εξαρτάται από fixtureId
    if (!homeTeamId || !awayTeamId || !leagueId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let aborted = false;

    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/history_profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fixture_id: fixtureId || null, // optional
            league_id: leagueId,           // REQUIRED
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
          }),
        });

        const json = await res.json();

        if (aborted) return;

        if (json && json.ok === true) {
          setData(json);
          setError(null);
        } else {
          setData(null);
          setError(json?.error || "history_error");
        }
      } catch (err) {
        if (!aborted) {
          setData(null);
          setError("network_error");
        }
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      aborted = true;
    };
  }, [fixtureId, leagueId, homeTeamId, awayTeamId]);

  return {
    data,
    loading,
    error,
  };
}
