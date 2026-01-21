// src/components/analysis/MarketOU35Block.jsx
import React from "react";
import { addToHotlist } from "../../utils/hotlistHelper";

export default function MarketOU35Block({ block, fixture }) {
  if (!block || !fixture) return null;

  const {
    market_over,
    market_under,
    model_over,
    model_under,
    edge_over,
    edge_under,
    final_pick,
    ui_banner,
    available,
  } = block;

  if (available === false) return null;

  const pickLabel =
    final_pick === "UNDER"
      ? "UNDER 3.5"
      : final_pick === "OVER"
      ? "OVER 3.5"
      : null;

  // =====================================================
  // EXPLANATION — BASED ONLY ON FINAL_PICK (LOCKED)
  // =====================================================
  const pickEdge =
    final_pick === "UNDER"
      ? edge_under
      : final_pick === "OVER"
      ? edge_over
      : null;

  let explanation = null;
  let explanationStyle = {};

  if (pickEdge === null || typeof pickEdge !== "number") {
    explanation = null;
  } else if (Math.abs(pickEdge) < 1.5) {
    explanation =
      "Οι εκτιμήσεις δείχνουν ισορροπημένη εικόνα στο σύνολο τερμάτων, με την αγορά και το GoalRadar να συγκλίνουν σε παρόμοια ποσοστά.";
    explanationStyle = {
      background: "rgba(148,163,184,0.12)",
      border: "1px solid rgba(148,163,184,0.35)",
      color: "#e5e7eb",
    };
  } else if (pickEdge > 0 && pickEdge < 5) {
    explanation = `Το GoalRadar δείχνει ελαφρύ προβάδισμα υπέρ του ${pickLabel}, με θετική διόρθωση ~${pickEdge.toFixed(
      1
    )}% σε σχέση με την αγορά.`;
    explanationStyle = {
      background: "rgba(34,197,94,0.12)",
      border: "1px solid rgba(34,197,94,0.45)",
      color: "#bbf7d0",
    };
  } else if (pickEdge >= 5) {
    explanation = `Το GoalRadar ενισχύει καθαρά το ${pickLabel}, εφαρμόζοντας σημαντική θετική διόρθωση σε σχέση με τις εκτιμήσεις της αγοράς.`;
    explanationStyle = {
      background: "rgba(14,165,233,0.18)",
      border: "1px solid rgba(14,165,233,0.55)",
      color: "#e0f2fe",
    };
  } else if (pickEdge < -2) {
    explanation = `Η αγορά φαίνεται να υπερτιμά το προτεινόμενο σημείο (${pickLabel}) κατά ${Math.abs(
      pickEdge
    ).toFixed(1)}%.`;
    explanationStyle = {
      background: "rgba(239,68,68,0.15)",
      border: "1px solid rgba(239,68,68,0.55)",
      color: "#fecaca",
    };
  }

  // =====================================================
  // HOTLIST — FT / OU25 IDENTICAL (LOCKED)
  // =====================================================
  const handleAddToHotlist = () => {
    if (!final_pick) return;

    addToHotlist({
      fixture_id: fixture.fixture_id ?? fixture.id,
      home: fixture.home_team ?? fixture.home,
      away: fixture.away_team ?? fixture.away,
      market: "OU35",
      selection: final_pick,
      payload: {
        market_over,
        market_under,
        model_over,
        model_under,
        edge_over,
        edge_under,
        final_pick,
      },
    });
  };

  return (
    <div
      style={{
        borderRadius: 20,
        padding: 20,
        background: "rgba(15,23,42,0.65)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.28em",
          fontWeight: 800,
          opacity: 0.75,
          marginBottom: 14,
        }}
      >
        OVER / UNDER 3.5
      </div>

      {ui_banner && (
        <div
          style={{
            marginBottom: 14,
            padding: "8px 12px",
            borderRadius: 12,
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.35)",
            color: "#93c5fd",
            fontSize: 12,
          }}
        >
          {ui_banner}
        </div>
      )}

      {/* UNDER */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>UNDER 3.5</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          MKT {market_under?.toFixed(1)}% → GR {model_under?.toFixed(1)}%
          <span
            style={{
              color:
                edge_under > 0
                  ? "#22c55e"
                  : edge_under < 0
                  ? "#ef4444"
                  : "#e5e7eb",
              marginLeft: 8,
            }}
          >
            {edge_under > 0 && " ▲ +"}
            {edge_under < 0 && " ▼ "}
            {edge_under?.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* OVER */}
      <div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>OVER 3.5</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          MKT {market_over?.toFixed(1)}% → GR {model_over?.toFixed(1)}%
          <span
            style={{
              color:
                edge_over > 0
                  ? "#22c55e"
                  : edge_over < 0
                  ? "#ef4444"
                  : "#e5e7eb",
              marginLeft: 8,
            }}
          >
            {edge_over > 0 && " ▲ +"}
            {edge_over < 0 && " ▼ "}
            {edge_over?.toFixed(1)}%
          </span>
        </div>
      </div>

      {explanation && (
        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.45,
            ...explanationStyle,
          }}
        >
          {explanation}
        </div>
      )}

      {pickLabel && (
        <div
          style={{
            marginTop: 18,
            padding: "12px 14px",
            borderRadius: 14,
            background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 14,
            boxShadow: "0 10px 30px rgba(14,165,233,0.35)",
          }}
        >
          ΕΚΤΙΜΗΣΗ – {pickLabel}
        </div>
      )}

      <button
        onClick={handleAddToHotlist}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "10px 0",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(239,68,68,0.15)",
          color: "#fecaca",
          fontWeight: 900,
          letterSpacing: "0.22em",
          cursor: "pointer",
        }}
      >
        ΠΡΟΣΘΗΚΗ ΣΤΗ HOTLIST
      </button>
    </div>
  );
}
