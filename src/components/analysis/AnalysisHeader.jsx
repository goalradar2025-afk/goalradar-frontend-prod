import React from "react";

const LEAGUE_GRADIENTS = {
  "Premier League": "linear-gradient(90deg, #7c3aed, #9333ea)",
  "La Liga": "linear-gradient(90deg, #f97316, #ef4444)",
  "Bundesliga": "linear-gradient(90deg, #dc2626, #ef4444)",
  "Serie A": "linear-gradient(90deg, #0ea5e9, #38bdf8)",
  "Ligue 1": "linear-gradient(90deg, #10b981, #34d399)",
  "Super League Greece": "linear-gradient(90deg, #0f766e, #14b8a6)",
  "Champions League": "linear-gradient(90deg, #312e81, #1d4ed8)",
  "Europa League": "linear-gradient(90deg, #92400e, #f59e0b)",
  "Europa Conference League": "linear-gradient(90deg, #065f46, #22c55e)",
  Default: "linear-gradient(90deg, #475569, #64748b)",
};

function formatKickoff(dateStr) {
  try {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("el-GR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export default function AnalysisHeader({
  leagueName,
  kickoff,
  venue,
  homeTeam,
  awayTeam,
  fixtureId,
  onBack,
  onTrust,
  attentionSignal,
}) {
  const gradient =
    LEAGUE_GRADIENTS[leagueName] || LEAGUE_GRADIENTS.Default;

  return (
    <div
      style={{
        position: "relative",
        background: gradient,
        borderRadius: 18,
        padding: "10px 16px 12px",
        color: "#fff",
        boxShadow: "0 12px 26px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      {/* CLOSE */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          fontSize: 22,
          fontWeight: 700,
          color: "#fff",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          opacity: 0.85,
        }}
        aria-label="Κλείσιμο ανάλυσης"
      >
        ×
      </button>

      {/* TEAMS — ΠΡΩΤΑ, ΤΕΡΜΑ ΠΑΝΩ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          textAlign: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            ΓΗΠΕΔΟΥΧΟΣ
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            {homeTeam || "-"}
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            opacity: 0.85,
            marginTop: 6,
          }}
        >
          VS
        </div>

        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            ΦΙΛΟΞΕΝΟΥΜΕΝΟΣ
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            {awayTeam || "-"}
          </div>
        </div>
      </div>

      {/* MATCH INFO — ΑΠΟ ΚΑΤΩ, COMPACT */}
      <div
        style={{
          marginTop: 6,
          fontSize: 11,
          opacity: 0.9,
          lineHeight: 1.4,
          textAlign: "center",
        }}
      >
        <div
          style={{
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {leagueName || "-"}
        </div>
        <div>{formatKickoff(kickoff)}</div>
        <div>{venue || "-"}</div>
        <div
          style={{
            marginTop: 2,
            fontSize: 10,
            opacity: 0.75,
            letterSpacing: "0.14em",
          }}
        >
          ID FIXTURE: {fixtureId || "-"}
        </div>
      </div>

      {/* ATTENTION */}
      {attentionSignal && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onTrust}
            style={{
              padding: "8px 18px",
              borderRadius: 14,
              border: "2px solid #fde047",
              background:
                "linear-gradient(135deg, #fde047, #f59e0b)",
              color: "#0f172a",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(0,0,0,0.45)",
            }}
          >
            ΣΗΜΑ ΠΡΟΣΟΧΗΣ
          </button>
        </div>
      )}
    </div>
  );
}
