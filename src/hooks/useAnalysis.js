// src/hooks/useAnalysis.js
// =====================================================
// GoalRadar — useAnalysis (FINAL, LOCKED)
// =====================================================
// FLOW (LOCKED — DO NOT CHANGE):
// 1. παίρνει fixtureId
// 2. POST /api/predict_single με fixture_id
// 3. επιστρέφει analysis payload (render-only)
// =====================================================

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/config";

export default function useAnalysis(fixtureId) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadAnalysis() {
      try {
        setLoading(true);
        setError(null);

        if (!fixtureId) {
          throw new Error("Missing fixtureId");
        }

        const res = await fetch(`${API_BASE_URL}/api/predict_single`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fixture_id: Number(fixtureId),
          }),
        });

        if (!res.ok) {
          throw new Error(`Predict request failed (${res.status})`);
        }

        const json = await res.json();

        if (!json || !json.fixture) {
          throw new Error("Invalid analysis payload");
        }

        // -------------------------------------------------
        // SCHEMA GUARANTEE (CRITICAL)
        // -------------------------------------------------
        const normalized = {
          ...json,
          ft: json.ft ?? null,
          ou25: json.ou25 ?? null,
          ou35: json.ou35 ?? null,
          btts: json.btts ?? null,
          tg: json.tg ?? null,
        };

        if (alive) {
          setAnalysis(normalized);
          setLoading(false);
        }
      } catch (err) {
        if (alive) {
          console.error("[useAnalysis]", err);
          setError(err?.message || "Analysis error");
          setLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      alive = false;
    };
  }, [fixtureId]);

  return {
    analysis,
    loading,
    error,
  };
}
