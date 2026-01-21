import React from "react";
import { addToHotlist } from "../../utils/hotlistHelper";

export default function MarketBTTS({ block, fixture }) {
  if (!block || !fixture) return null;
  if (block.available === false) return null;

  const {
    market_yes,
    market_no,
    model_yes,
    model_no,
    edge_yes,
    edge_no,
    final_pick,
    ui_banner,
  } = block;

  const pickLabel =
    final_pick === "YES"
      ? "GOAL – GOAL"
      : final_pick === "NO"
      ? "NO GOAL"
      : null;

  const pickMarket = final_pick === "YES" ? market_yes : market_no;
  const pickGR = final_pick === "YES" ? model_yes : model_no;
  const pickEdge = final_pick === "YES" ? edge_yes : edge_no;

  // ---------------------------------------------------
  // EXPLANATION (ONLY FOR PICK)
  // ---------------------------------------------------
  let explanation = null;
  let explanationStyle = {};

  if (typeof pickEdge === "number") {
    if (Math.abs(pickEdge) < 1.5) {
      explanation =
        "Η αγορά και το GoalRadar βρίσκονται σε συμφωνία για το προτεινόμενο σημείο.";
      explanationStyle = {
        background: "rgba(148,163,184,0.12)",
        border: "1px solid rgba(148,163,184,0.35)",
        color: "#e5e7eb",
      };
    } else if (pickEdge > 0) {
      explanation = `Το προτεινόμενο σημείο εμφανίζει θετική αξία. Το GoalRadar το εκτιμά +${pickEdge.toFixed(
        1
      )}% υψηλότερα από την αγορά.`;
      explanationStyle = {
        background: "rgba(34,197,94,0.18)",
        border: "1px solid rgba(34,197,94,0.55)",
        color: "#bbf7d0",
      };
    } else {
      explanation = `Η αγορά φαίνεται να υπερτιμά το προτεινόμενο σημείο κατά ${Math.abs(
        pickEdge
      ).toFixed(1)}%.`;
      explanationStyle = {
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.45)",
        color: "#fecaca",
      };
    }
  }

  // ---------------------------------------------------
  // HOTLIST
  // ---------------------------------------------------
  const handleAddToHotlist = () => {
    if (!final_pick) return;

    addToHotlist({
      fixture_id: fixture.fixture_id ?? fixture.id,
      home: fixture.home_team ?? fixture.home,
      away: fixture.away_team ?? fixture.away,
      market: "BTTS",
      selection: final_pick,
      payload: {
        market_yes,
        market_no,
        model_yes,
        model_no,
        edge_yes,
        edge_no,
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
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.28em",
          fontWeight: 800,
          opacity: 0.75,
        }}
      >
        BOTH TEAMS TO SCORE
      </div>

      {ui_banner && (
        <div
          style={{
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

      {/* YES */}
      <div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>GOAL–GOAL</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          MKT {market_yes?.toFixed(1)}% → GR {model_yes?.toFixed(1)}%
          <span
            style={{
              marginLeft: 8,
              color:
                edge_yes > 0
                  ? "#22c55e"
                  : edge_yes < 0
                  ? "#ef4444"
                  : "#e5e7eb",
            }}
          >
            {edge_yes > 0 && " ▲ +" }
            {edge_yes < 0 && " ▼ "}
            {edge_yes?.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* NO */}
      <div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>NO GOAL</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          MKT {market_no?.toFixed(1)}% → GR {model_no?.toFixed(1)}%
          <span
            style={{
              marginLeft: 8,
              color:
                edge_no > 0
                  ? "#22c55e"
                  : edge_no < 0
                  ? "#ef4444"
                  : "#e5e7eb",
            }}
          >
            {edge_no > 0 && " ▲ +" }
            {edge_no < 0 && " ▼ "}
            {edge_no?.toFixed(1)}%
          </span>
        </div>
      </div>

      {pickLabel && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 14px",
            borderRadius: 14,
            background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 14,
          }}
        >
          ΕΚΤΙΜΗΣΗ GOALRADAR — {pickLabel}{" "}
          {pickGR != null && `(${pickGR.toFixed(1)}%)`}
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
            Αγορά: {pickMarket?.toFixed(1)}% → GoalRadar:{" "}
            {pickGR?.toFixed(1)}%
          </div>
        </div>
      )}

      {explanation && (
        <div
          style={{
            marginTop: 4,
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

      <button
        onClick={handleAddToHotlist}
        style={{
          alignSelf: "flex-end",
          padding: "6px 14px",
          borderRadius: 999,
          border: "1px solid #ef4444",
          background: "rgba(239,68,68,0.15)",
          color: "#fecaca",
          fontSize: 11,
          letterSpacing: "0.2em",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        ΠΡΟΣΘΗΚΗ ΣΤΗ HOTLIST
      </button>
    </div>
  );
}
