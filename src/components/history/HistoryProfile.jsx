// src/components/history/HistoryProfile.jsx
// =====================================================
// GOALRADAR — HistoryProfile (PRESENTATIONAL / LOCKED)
// - ΔΕΝ γνωρίζει ομάδα, όνομα, logo
// - ΔΕΝ υπολογίζει
// - ΔΕΝ μετατρέπει
// - Απλώς εμφανίζει τα counters που έρχονται από backend
// =====================================================

import React from "react";

export default function HistoryProfile({ title, profile }) {
  if (!profile) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
        <div className="text-xs text-slate-500">{title}</div>
        <div className="text-xs text-slate-600 mt-2">
          Ιστορικά στοιχεία μη διαθέσιμα
        </div>
      </div>
    );
  }

  const {
    wins_6,
    avg_goals_6,
    scored_in_6,
    unbeaten_6,
    goals_0,
    goals_1p,
    goals_2p,
    matches_used,
  } = profile;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 flex flex-col gap-2">
      <div className="text-xs text-slate-400 font-medium">
        {title}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-300">
        <div>Νίκες (6)</div>
        <div className="text-right">{wins_6}</div>

        <div>Μ.Ο. γκολ</div>
        <div className="text-right">{avg_goals_6}</div>

        <div>Σκόραρε</div>
        <div className="text-right">
          {scored_in_6}/{matches_used}
        </div>

        <div>Αήττητος</div>
        <div className="text-right">
          {unbeaten_6 ? "Ναι" : "Όχι"}
        </div>
      </div>

      <div className="mt-2 border-t border-slate-800 pt-2">
        <div className="text-[11px] text-slate-400 mb-1">
          Κατανομή γκολ
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
          <div className="text-center">
            <div className="text-slate-500">0</div>
            <div>{goals_0}</div>
          </div>

          <div className="text-center">
            <div className="text-slate-500">1+</div>
            <div>{goals_1p}</div>
          </div>

          <div className="text-center">
            <div className="text-slate-500">2+</div>
            <div>{goals_2p}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
