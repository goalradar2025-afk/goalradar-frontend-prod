// src/components/FixtureCard.jsx
// -----------------------------------------------------------
// GOALRADAR v3.4 — FIXTURE CARD (CARD-LEVEL HARD BLOCK)
// -----------------------------------------------------------

import React, { useMemo, useState } from "react";

// ===========================
// Helpers
// ===========================
function formatKickoff(utc) {
  if (!utc) return "—";
  try {
    const d = new Date(utc);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  } catch {
    return "—";
  }
}

function impliedFromOdds(outcomes) {
  if (!outcomes) return null;

  const inv = {};
  let sum = 0;

  ["1", "X", "2"].forEach((k) => {
    const odd = Number(outcomes[k]);
    if (odd && odd > 0) {
      inv[k] = 1 / odd;
      sum += inv[k];
    }
  });

  if (!sum) return null;

  return {
    p1: inv["1"] ? inv["1"] / sum : null,
    px: inv["X"] ? inv["X"] / sum : null,
    p2: inv["2"] ? inv["2"] / sum : null,
  };
}

function toDots(p) {
  if (p == null || isNaN(p)) return 0;
  if (p >= 0.7) return 5;
  if (p >= 0.55) return 4;
  if (p >= 0.4) return 3;
  if (p >= 0.25) return 2;
  return 1;
}

function dotColorClass(v) {
  if (v >= 4) return "text-emerald-400";
  if (v === 3) return "text-amber-400";
  if (v > 0) return "text-rose-400";
  return "text-slate-500";
}

function Dots({ value }) {
  const color = dotColorClass(value);
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`text-[14px] leading-none ${
            i < value ? color : "text-slate-600"
          }`}
        >
          ●
        </span>
      ))}
    </div>
  );
}

// ===========================
// MAIN
// ===========================
export default function FixtureCard({
  fixture,
  onSelectFixture,
  hideIndicators = false,
}) {
  if (!fixture) return null;

  const [hovered, setHovered] = useState(false);

  const {
    fixture_id,
    kickoff_local,
    utc,
    home_team,
    away_team,
    home_logo,
    away_logo,
    stadium,
    venue,
    venue_name,
    markets,
  } = fixture;

  const time = kickoff_local || formatKickoff(utc);
  const venueText = venue_name || stadium || venue || "";

  // 🔒 kickoff check
  const hasStarted = useMemo(() => {
    if (!utc) return false;
    return Date.now() >= new Date(utc).getTime();
  }, [utc]);

  const { dH, dD, dA } = useMemo(() => {
    const ft = markets?.ft_1x2?.outcomes;
    const probs = impliedFromOdds(ft);
    return {
      dH: probs?.p1 ? toDots(probs.p1) : 0,
      dD: probs?.px ? toDots(probs.px) : 0,
      dA: probs?.p2 ? toDots(probs.p2) : 0,
    };
  }, [markets]);

  const handleSelect = (e) => {
    if (e) e.preventDefault();
    if (hasStarted) return; // HARD BLOCK
    if (onSelectFixture) onSelectFixture(fixture);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* CARD-LEVEL OVERLAY */}
      {hasStarted && hovered && (
        <div
          className="
            absolute inset-0 z-50
            flex items-center justify-center
            rounded-xl
            bg-red-900/60
            backdrop-blur-sm
          "
        >
          <div className="text-center px-4">
            <div className="text-xl font-extrabold text-red-100 mb-2">
              Ο ΑΓΩΝΑΣ ΕΧΕΙ ΗΔΗ ΞΕΚΙΝΗΣΕΙ
            </div>
            <div className="text-sm font-semibold text-red-200">
              Δεν είναι πλέον διαθέσιμος για ανάλυση.
            </div>
          </div>
        </div>
      )}

      <div
        onClick={handleSelect}
        className="
          w-full rounded-xl bg-slate-800
          border border-slate-600/40
          hover:border-slate-300/50
          shadow-lg shadow-black/30
          transition-colors cursor-pointer
          px-6 py-5 flex items-center gap-5
        "
      >
        {/* HOME LOGO */}
        <div className="shrink-0">
          {home_logo ? (
            <img src={home_logo} alt="" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700" />
          )}
        </div>

        {/* TEAMS */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-4">
            <span className="font-semibold text-slate-100 truncate">
              {home_team}
            </span>

            <div className="text-center shrink-0">
              <div className="text-sm text-slate-100">{time}</div>
              {venueText && (
                <div className="text-xs text-slate-400">{venueText}</div>
              )}
            </div>

            <span className="font-semibold text-slate-100 truncate text-right">
              {away_team}
            </span>
          </div>

          {fixture_id && (
            <div className="text-[11px] text-slate-500 text-right mt-1">
              #{fixture_id}
            </div>
          )}

          {!hideIndicators && hovered && !hasStarted && (
            <div className="mt-3 text-xs text-slate-300 leading-snug">
              <span className="font-semibold">Εδώ βλέπεις ένδειξη.</span>{" "}
              Κάνε κλικ στην κάρτα για να ανοίξεις την{" "}
              <span className="font-semibold">ΠΛΗΡΗ ανάλυση</span>.
            </div>
          )}
        </div>

        {/* AWAY LOGO */}
        <div className="hidden md:block shrink-0">
          {away_logo ? (
            <img src={away_logo} alt="" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700" />
          )}
        </div>

        {!hideIndicators && (
          <div className="min-w-[200px] shrink-0">
            <div className="flex justify-between text-xs text-slate-400 px-2 mb-1">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </div>
            <div className="flex justify-between px-2">
              <Dots value={dH} />
              <Dots value={dD} />
              <Dots value={dA} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
