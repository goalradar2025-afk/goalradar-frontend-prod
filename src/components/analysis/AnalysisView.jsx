// src/components/analysis/AnalysisView.jsx
// =====================================================
// GoalRadar — AnalysisView (PROP FIRST, URL FALLBACK)
// =====================================================

import React, { useState } from "react";
import { useParams } from "react-router-dom";

import useAnalysis from "../../hooks/useAnalysis";

import AnalysisHeader from "./AnalysisHeader";
import FinalResultBlock from "./FinalResultBlock";
import MarketOU25Block from "./MarketOU25Block";
import MarketOU35Block from "./MarketOU35Block";
import MarketBTTS from "./MarketBTTS";
import MarketTG from "./MarketTG";
import ConfidenceVerdict from "./ConfidenceVerdict";

export default function AnalysisView({
  fixtureId: fixtureIdProp,
  onClose,               // ✅ ΠΡΟΣΤΕΘΗΚΕ
}) {
  const { fixtureId: fixtureIdFromUrl } = useParams();

  // 👉 ΠΡΩΤΑ prop, ΜΕΤΑ URL
  const fixtureId = fixtureIdProp || fixtureIdFromUrl || null;

  const { analysis, loading, error } = useAnalysis(fixtureId);
  const [verdictOpen, setVerdictOpen] = useState(false);

  if (!fixtureId) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        Επίλεξε έναν αγώνα για να δεις ανάλυση
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        Φόρτωση ανάλυσης…
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="h-full flex items-center justify-center text-red-400">
        Σφάλμα φόρτωσης ανάλυσης
      </div>
    );
  }

  const fixture = analysis.fixture;
  if (!fixture) {
    return (
      <div className="h-full flex items-center justify-center text-red-400">
        Σφάλμα δεδομένων ανάλυσης
      </div>
    );
  }

  return (
    <div style={{ height: "100%", color: "white", overflowY: "auto" }}>
      {/* HEADER */}
      <div style={{ padding: "20px 28px" }}>
        <AnalysisHeader
          leagueName={fixture.league_name}
          kickoff={fixture.date}
          venue={fixture.venue}
          homeTeam={fixture.home}
          awayTeam={fixture.away}
          fixtureId={fixture.fixture_id}
          onBack={onClose}                 // ✅ ΤΟ ΚΡΙΣΙΜΟ
          onTrust={() => setVerdictOpen(true)}
          attentionSignal={analysis.attention_signal === true}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 28px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {analysis.ft && (
          <FinalResultBlock block={analysis.ft} fixture={fixture} />
        )}

        {(analysis.ou25 || analysis.ou35) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {analysis.ou25 && (
              <MarketOU25Block block={analysis.ou25} fixture={fixture} />
            )}
            {analysis.ou35 && (
              <MarketOU35Block block={analysis.ou35} fixture={fixture} />
            )}
          </div>
        )}

        {(analysis.btts || analysis.tg) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {analysis.btts && (
              <MarketBTTS block={analysis.btts} fixture={fixture} />
            )}
            {analysis.tg && (
              <MarketTG block={analysis.tg} fixture={fixture} />
            )}
          </div>
        )}
      </div>

      {verdictOpen && (
        <div
          onClick={() => setVerdictOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(1100px,92vw)",
              background: "#020617",
              borderRadius: 24,
              padding: 28,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ConfidenceVerdict data={analysis} />
          </div>
        </div>
      )}
    </div>
  );
}
