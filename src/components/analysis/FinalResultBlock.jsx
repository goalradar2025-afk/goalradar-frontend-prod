import React from "react";
import { addToHotlist } from "../../utils/hotlistHelper";

function Row({ label, mkt, gr, edge }) {
  const up = edge > 0;
  const down = edge < 0;

  const safe = (v) =>
    typeof v === "number" && !Number.isNaN(v) ? v.toFixed(1) : "—";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 1fr 1fr",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        fontSize: 14,
      }}
    >
      <div style={{ fontWeight: 700 }}>{label}</div>

      <div style={{ opacity: 0.75 }}>
        Αγορά <b>{safe(mkt)}%</b>
      </div>

      <div style={{ opacity: 0.95 }}>
        GR <b>{safe(gr)}%</b>
      </div>

      <div
        style={{
          fontWeight: 800,
          color: up ? "#22c55e" : down ? "#ef4444" : "#e5e7eb",
        }}
      >
        {up && "▲ "}
        {down && "▼ "}
        {edge > 0 && "+"}
        {safe(edge)}%
      </div>
    </div>
  );
}

export default function FinalResultBlock({ block, fixture }) {
  if (!block || !fixture) return null;

  const market = {
    "1": block.market_1,
    X: block.market_x,
    "2": block.market_2,
  };

  const gr = {
    "1": block.fair_1,
    X: block.fair_x,
    "2": block.fair_2,
  };

  const edge = {
    "1": block.edge_1,
    X: block.edge_x,
    "2": block.edge_2,
  };

  const finalPick = block.final_pick;

  const LABELS = {
    "1": "ΓΗΠΕΔΟΥΧΟΣ ΝΙΚΗ",
    X: "ΙΣΟΠΑΛΙΑ",
    "2": "ΦΙΛΟΞΕΝΟΥΜΕΝΟΣ ΝΙΚΗ",
  };

  // Pick probability (GR)
  const pickProb = finalPick ? gr[finalPick] : null;
  const pickMarket = finalPick ? market[finalPick] : null;
  const pickEdge = finalPick ? edge[finalPick] : null;

  let explanation = null;
  let explanationStyle = {};

  if (typeof pickEdge !== "number") {
    explanation = null;
  } else if (Math.abs(pickEdge) < 1.5) {
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

  const handleAddToHotlist = () => {
    if (!finalPick) return;

    addToHotlist({
      fixture_id: fixture.fixture_id ?? fixture.id,
      home: fixture.home_team ?? fixture.home,
      away: fixture.away_team ?? fixture.away,
      market: "FT",
      selection: finalPick,
      payload: {
        market,
        gr,
        edge,
        final_pick: finalPick,
      },
    });
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: 20,
        padding: 20,
        background: "rgba(15,23,42,0.75)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          marginBottom: 14,
          fontSize: 13,
          letterSpacing: "0.28em",
          fontWeight: 900,
        }}
      >
        ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ <span style={{ opacity: 0.6 }}>1X2</span>
      </div>

      <Row label="1" mkt={market["1"]} gr={gr["1"]} edge={edge["1"]} />
      <Row label="X" mkt={market["X"]} gr={gr["X"]} edge={edge["X"]} />
      <Row label="2" mkt={market["2"]} gr={gr["2"]} edge={edge["2"]} />

      {finalPick && (
        <div
          style={{
            marginTop: 18,
            padding: "14px 16px",
            borderRadius: 14,
            background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 15,
            boxShadow: "0 10px 30px rgba(14,165,233,0.35)",
          }}
        >
          ΕΚΤΙΜΗΣΗ GOALRADAR — {LABELS[finalPick]}{" "}
          {pickProb !== null && `(${pickProb.toFixed(1)}%)`}
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
            Αγορά: {pickMarket?.toFixed(1)}% → GoalRadar:{" "}
            {pickProb?.toFixed(1)}%
          </div>
        </div>
      )}

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

      <button
        onClick={handleAddToHotlist}
        style={{
          marginTop: 18,
          width: "100%",
          padding: "12px 0",
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
