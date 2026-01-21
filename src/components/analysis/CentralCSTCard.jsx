// src/components/CentralCSTCard.jsx
// ========================================================
// CENTRAL CST CARD — ΣΤΑΘΕΡΟΤΗΤΑ ΕΚΤΙΜΗΣΗΣ
// --------------------------------------------------------
// - ΜΟΝΟ CST (πουθενά αλλού στο UI)
// - Μεγάλη, ευδιάκριτη κάρτα
// - Χρωματίζεται ΟΛΟΚΛΗΡΗ με βάση το ποσοστό
// - Τίτλοι:
//    * ≥ 70%  → ΑΣΦΑΛΗΣ ΕΝΔΕΙΞΗ (πράσινο)
//    * 55–69% → ΑΒΕΒΑΙΗ ΕΝΔΕΙΞΗ (κίτρινο)
//    * < 55%  → ΑΠΟΡΡΙΠΤΕΑ ΕΝΔΕΙΞΗ (κόκκινο)
// ========================================================

import React from "react";

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function getCstConfig(cst) {
  if (typeof cst !== "number") {
    return {
      title: "—",
      bg: "bg-slate-800",
      fg: "text-slate-200",
      border: "border-slate-600",
    };
  }

  const pct = Math.round(cst * 100);

  if (pct >= 70) {
    return {
      title: "ΑΣΦΑΛΗΣ ΕΝΔΕΙΞΗ",
      bg: "bg-emerald-600/90",
      fg: "text-emerald-950",
      border: "border-emerald-300",
    };
  }

  if (pct >= 55) {
    return {
      title: "ΑΒΕΒΑΙΗ ΕΝΔΕΙΞΗ",
      bg: "bg-amber-400/95",
      fg: "text-amber-950",
      border: "border-amber-300",
    };
  }

  return {
    title: "ΑΠΟΡΡΙΠΤΕΑ ΕΝΔΕΙΞΗ",
    bg: "bg-red-600/90",
    fg: "text-red-950",
    border: "border-red-300",
  };
}

export default function CentralCSTCard({ cst }) {
  const pct =
    typeof cst === "number" ? Math.round(cst * 100) : null;

  const cfg = getCstConfig(cst);

  return (
    <div
      className={classNames(
        "rounded-3xl border shadow-[0_0_45px_rgba(0,0,0,0.85)]",
        "px-6 py-6 flex flex-col items-center justify-center text-center",
        cfg.bg,
        cfg.border
      )}
    >
      {/* Title */}
      <div
        className={classNames(
          "uppercase tracking-[0.28em] text-[0.75rem] font-semibold mb-2",
          cfg.fg
        )}
      >
        ΣΤΑΘΕΡΟΤΗΤΑ ΕΚΤΙΜΗΣΗΣ
      </div>

      {/* Percentage */}
      <div
        className={classNames(
          "text-[3.2rem] sm:text-[3.8rem] font-extrabold leading-none",
          cfg.fg
        )}
      >
        {pct !== null ? `${pct}%` : "—"}
      </div>

      {/* Status */}
      <div
        className={classNames(
          "mt-2 uppercase tracking-[0.24em] text-[0.8rem] font-bold",
          cfg.fg
        )}
      >
        {cfg.title}
      </div>

      {/* CST label */}
      <div
        className={classNames(
          "mt-1 text-[0.7rem] uppercase tracking-[0.2em] opacity-80",
          cfg.fg
        )}
      >
        CST
      </div>
    </div>
  );
}
