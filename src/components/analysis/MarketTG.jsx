// src/components/analysis/MarketTG.jsx
import React from "react";
import { addToHotlist } from "../../utils/hotlistHelper";

export default function MarketTG({ block, fixture }) {
  if (!block || !fixture) return null;
  if (block.available === false) return null;

  const baseDist = Array.isArray(block.dist) ? block.dist : [];
  const dist5p = typeof block.dist_5p === "number" ? block.dist_5p : null;

  // 🔒 ΕΝΩΜΕΝΗ ΚΑΤΑΝΟΜΗ (0–4 + 5+)
  const dist = [...baseDist];
  if (dist5p !== null) dist.push(dist5p);
  if (dist.length === 0) return null;

  const LABELS = ["0", "1", "2", "3", "4", "5+"];

  // final pick = max probability bucket
  const finalIndex = dist.reduce(
    (maxIdx, val, i, arr) => (val > arr[maxIdx] ? i : maxIdx),
    0
  );

  const finalLabel = `${LABELS[finalIndex]} ΓΚΟΛ`;
  const finalProb = dist[finalIndex] * 100;

  // =====================================================
  // EXPLANATION — BASED ONLY ON FINAL PICK (MODEL ONLY)
  // =====================================================
  const sorted = [...dist].sort((a, b) => b - a);
  const diff =
    sorted.length > 1 ? (sorted[0] - sorted[1]) * 100 : 0;

  let explanation = null;
  let explanationStyle = {};

  if (diff < 3) {
    explanation =
      "Η κατανομή συνολικών τερμάτων είναι σχετικά επίπεδη, χωρίς σαφή κυριαρχία κάποιου εύρους.";
    explanationStyle = {
      background: "rgba(148,163,184,0.12)",
      border: "1px solid rgba(148,163,184,0.35)",
      color: "#e5e7eb",
    };
  } else if (diff < 8) {
    explanation = `Το GoalRadar δείχνει ήπια συγκέντρωση στο εύρος ${LABELS[finalIndex]} γκολ, με πιθανότητα περίπου ${finalProb.toFixed(
      1
    )}%.`;
    explanationStyle = {
      background: "rgba(34,197,94,0.12)",
      border: "1px solid rgba(34,197,94,0.45)",
      color: "#bbf7d0",
    };
  } else {
    explanation = `Το GoalRadar συγκεντρώνει καθαρά τις υψηλότερες πιθανότητες στο εύρος ${LABELS[finalIndex]} γκολ (${finalProb.toFixed(
      1
    )}%), δείχνοντας ισχυρή κλίση της κατανομής.`;
    explanationStyle = {
      background: "rgba(14,165,233,0.18)",
      border: "1px solid rgba(14,165,233,0.55)",
      color: "#e0f2fe",
    };
  }

  // =====================================================
  // HOTLIST — MODEL ONLY
  // =====================================================
  const handleAddToHotlist = () => {
    addToHotlist({
      fixture_id: fixture.fixture_id ?? fixture.id,
      home: fixture.home_team ?? fixture.home,
      away: fixture.away_team ?? fixture.away,
      market: "TG",
      selection: LABELS[finalIndex],
      payload: {
        dist,
        final_index: finalIndex,
        final_label: finalLabel,
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
        TOTAL GOALS (MODEL ONLY)
      </div>

      {block.ui_banner && (
        <div
          style={{
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.4)",
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 13,
            color: "#93c5fd",
          }}
        >
          {block.ui_banner}
        </div>
      )}

      {/* DISTRIBUTION */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {LABELS.map((label, i) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              fontWeight: i === finalIndex ? 900 : 600,
              color: i === finalIndex ? "#38bdf8" : "#e5e7eb",
            }}
          >
            <div style={{ fontSize: 13, opacity: 0.7 }}>{label}</div>
            <div>
              {dist[i] != null
                ? `${(dist[i] * 100).toFixed(1)}%`
                : "-"}
            </div>
          </div>
        ))}
      </div>

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

      <div
        style={{
          marginTop: 12,
          padding: "12px 14px",
          borderRadius: 14,
          background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
          color: "#ffffff",
          fontWeight: 900,
          fontSize: 14,
          textAlign: "center",
        }}
      >
        ΕΚΤΙΜΗΣΗ – {finalLabel}
      </div>

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
