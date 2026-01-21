// src/components/GlobalHeader.jsx
// ===================================================
// GOALRADAR — GLOBAL HEADER (LOW PROFILE)
// ---------------------------------------------------
// - Fixed top
// - Logo left
// - Login / Register right
// - Appears on ALL pages except Analysis
// ===================================================

import React from "react";

export default function GlobalHeader() {
  const tooltip =
    "Το GoalRadar είναι ακόμα εντελώς δωρεάν. Μπορείς να κάνεις ελεύθερα χρήση ολόκληρης της πλατφόρμας.";

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-40
        h-[56px]
        bg-slate-950/90 backdrop-blur-xl
        border-b border-slate-800
        flex items-center
        px-6
      "
    >
      {/* LEFT — LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">
          GRD
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] font-bold text-slate-100">
            GoalRadar
          </span>
          <span className="text-[10px] text-slate-400">
            GRD ai
          </span>
        </div>
      </div>

      {/* RIGHT — AUTH */}
      <div className="ml-auto flex items-center gap-3">
        <button
          title={tooltip}
          className="
            px-4 py-1.5 rounded-md
            text-[13px] font-semibold
            text-slate-200
            hover:text-white
            hover:bg-slate-800
            transition
          "
        >
          Είσοδος
        </button>

        <button
          title={tooltip}
          className="
            px-4 py-1.5 rounded-md
            text-[13px] font-semibold
            bg-emerald-500 text-slate-900
            hover:bg-emerald-400
            transition
          "
        >
          Εγγραφή
        </button>
      </div>
    </header>
  );
}
