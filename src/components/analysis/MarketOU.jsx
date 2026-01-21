// src/components/MarketOU.jsx
// ========================================================
// MARKET OU BLOCK — OVER / UNDER (2.5 / 3.5)
// --------------------------------------------------------
// - Ενιαίο component για OU 2.5 και OU 3.5
// - Δείχνει MKT / GR Model / Τελική Πιθανότητα
// - ΜΟΝΟ τίτλος: "OVER / UNDER X.X" (χωρίς "ΣΥΝΟΛΟ ΤΕΡΜΑΤΩΝ")
// - Κουμπί "ΠΡΟΣΘΗΚΗ ΣΤΗ HOTLIST" (υποχρεωτικό)
// ========================================================

import React from "react";

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function percent(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "-";
  return `${(Number(v) * 100).toFixed(1)}%`;
}

function odds(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "-";
  return Number(v).toFixed(2);
}

function edge(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "-";
  const p = Number(v) * 100;
  const s = p > 0 ? "+" : "";
  return `${s}${p.toFixed(1)}%`;
}

function normalizeOU(block, line) {
  if (!block) return [];

  // Προσπαθούμε να διαβάσουμε ό,τι schema κι αν έρθει
  const under =
    block.under ??
    block.mkt_under ??
    block.market_under ??
    block.under_prob ??
    null;

  const over =
    block.over ??
    block.mkt_over ??
    block.market_over ??
    block.over_prob ??
    null;

  const mlUnder =
    block.ml_under ?? block.model_under ?? block.under_ml ?? null;

  const mlOver =
    block.ml_over ?? block.model_over ?? block.over_ml ?? null;

  const finUnder =
    block.final_under ?? block.under_final ?? null;

  const finOver =
    block.final_over ?? block.over_final ?? null;

  return [
    {
      key: "UNDER",
      label: `UNDER ${line}`,
      mkt: under,
      ml: mlUnder,
      fin: finUnder,
    },
    {
      key: "OVER",
      label: `OVER ${line}`,
      mkt: over,
      ml: mlOver,
      fin: finOver,
    },
  ];
}

function ProbabilityRow({ label, mkt, ml, fin }) {
  const max = Math.max(mkt ?? 0, ml ?? 0, fin ?? 0, 0.00001);
  const w = (v) => (v != null ? `${(v / max) * 100}%` : "0%");

  return (
    <div className="flex flex-col gap-1.5 text-[0.72rem]">
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-[0.16em] text-[0.62rem] text-slate-400">
          {label}
        </span>
        <div className="flex gap-2">
          {mkt != null && (
            <span className="text-slate-400">
              MKT <b>{percent(mkt)}</b>
            </span>
          )}
          {ml != null && (
            <span className="text-slate-400">
              ML <b>{percent(ml)}</b>
            </span>
          )}
          {fin != null && (
            <span className="text-emerald-300">
              ΤΕΛΙΚΟ <b>{percent(fin)}</b>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-slate-500/80" style={{ width: w(mkt) }} />
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-sky-400/80" style={{ width: w(ml) }} />
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400/90" style={{ width: w(fin) }} />
        </div>
      </div>
    </div>
  );
}

export default function MarketOU({
  line = "2.5",        // "2.5" ή "3.5"
  block,               // δεδομένα από backend
  onAddToHotlist,      // handler
}) {
  if (!block) return null;

  const rows = normalizeOU(block, line);

  const rec =
    block.recommendation ||
    block.final_pick ||
    block.best_pick ||
    "—";

  const e = block.final_edge ?? block.edge ?? null;

  let tone = "neutral";
  if (typeof e === "number") {
    if (e >= 0.02) tone = "good";
    else if (e <= -0.02) tone = "bad";
  }

  const edgePalette =
    tone === "good"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/60"
      : tone === "bad"
      ? "bg-red-500/10 text-red-300 border-red-500/60"
      : "bg-slate-800/80 text-slate-300 border-slate-700";

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-700/70 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-amber-400/90 to-amber-500/90 text-amber-950">
        <div className="uppercase tracking-[0.22em] text-[0.75rem] font-semibold">
          OVER / UNDER {line}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex flex-col gap-3 text-xs">
        {/* Recommendation */}
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-[0.18em] text-[0.62rem] text-slate-400">
            ΤΕΛΙΚΗ ΠΙΘΑΝΟΤΗΤΑ
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-600/80 text-slate-50 font-semibold">
            {rec}
          </span>
        </div>

        {/* Edge / Odds */}
        <div className="flex flex-wrap gap-2">
          <span
            className={classNames(
              "px-3 py-1 rounded-xl border text-[0.7rem] font-semibold",
              edgePalette
            )}
          >
            EDGE {edge(e)}
          </span>
          {block.best_odds && (
            <span className="px-3 py-1 rounded-xl border border-slate-700 bg-slate-800/80 text-[0.7rem]">
              ΚΟΡΥΦΑΙΑ ΑΠΟΔΟΣΗ <b>{odds(block.best_odds)}</b>
            </span>
          )}
          {block.fair_odds && (
            <span className="px-3 py-1 rounded-xl border border-slate-700 bg-slate-800/80 text-[0.7rem]">
              FAIR ODDS <b>{odds(block.fair_odds)}</b>
            </span>
          )}
        </div>

        {/* Probabilities */}
        <div className="mt-1 flex flex-col gap-3">
          {rows.map((r) => (
            <ProbabilityRow
              key={r.key}
              label={r.label}
              mkt={r.mkt}
              ml={r.ml}
              fin={r.fin}
            />
          ))}
        </div>

        {/* HOTLIST */}
        {onAddToHotlist && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onAddToHotlist}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/80 bg-red-500/15 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-red-300 hover:bg-red-500/25 transition"
            >
              ΠΡΟΣΘΗΚΗ ΣΤΗ HOTLIST
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
