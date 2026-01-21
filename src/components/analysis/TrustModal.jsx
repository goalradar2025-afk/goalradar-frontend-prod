import React, { useEffect, useState } from "react";

/* ============================================================
   HELPERS
============================================================ */
function percent(v) {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return `${(Number(v) * 100).toFixed(1)}%`;
}

function delta(mkt, ml) {
  if (mkt == null || ml == null) return null;
  return ml - mkt;
}

function deltaLabel(d) {
  if (d == null) return "0.0%";
  const v = d * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

function deltaDir(d) {
  if (d == null || Math.abs(d) < 0.0005) return "neutral";
  return d > 0 ? "up" : "down";
}

function normalise(block, labels = []) {
  if (!block || !block.market) return [];

  const mkt = block.market || {};
  const ml = block.model || {};

  return Object.keys(mkt).map((k, i) => ({
    label: labels[i] || k,
    mkt: mkt[k],
    ml: ml[k] ?? null,
  }));
}

/* ============================================================
   ROW
============================================================ */
function TrustRow({ label, mkt, ml }) {
  const d = delta(mkt, ml);
  const dir = deltaDir(d);

  const arrow =
    dir === "up" ? "↑" : dir === "down" ? "↓" : "→";

  const color =
    dir === "up"
      ? "text-emerald-400"
      : dir === "down"
      ? "text-red-400"
      : "text-slate-400";

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-700/80 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-100">
          {label}
        </span>
        <span className={`text-xs font-semibold ${color}`}>
          ΔΙΟΡΘΩΣΗ {deltaLabel(d)} {arrow}
        </span>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="uppercase text-[0.6rem] tracking-[0.16em] text-slate-500">
            MKT
          </div>
          <div className="font-semibold text-slate-100">
            {percent(mkt)}
          </div>
        </div>
        <div>
          <div className="uppercase text-[0.6rem] tracking-[0.16em] text-slate-500">
            MODEL
          </div>
          <div className="font-semibold text-slate-100">
            {percent(ml)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN MODAL
============================================================ */
export default function TrustModal({
  open,
  onClose,
  blocks,
  homeTeam,
  awayTeam,
}) {
  const [tab, setTab] = useState("ft");

  useEffect(() => {
    if (open) setTab("ft");
  }, [open]);

  if (!open) return null;

  const {
    blockFT,
    blockOU25,
    blockOU35,
    blockBTTS,
    blockTG,
  } = blocks || {};

  const tabs = [
    {
      key: "ft",
      label: "1X2",
      rows: normalise(blockFT, ["1", "Χ", "2"]),
    },
    {
      key: "ou25",
      label: "OU 2.5",
      rows: normalise(blockOU25, ["UNDER 2.5", "OVER 2.5"]),
    },
    {
      key: "ou35",
      label: "OU 3.5",
      rows: normalise(blockOU35, ["UNDER 3.5", "OVER 3.5"]),
    },
    {
      key: "btts",
      label: "GG",
      rows: normalise(blockBTTS, ["NO GOAL", "GOAL-GOAL"]),
    },
    {
      key: "tg",
      label: "TG",
      rows: normalise(blockTG, ["LOW", "MEDIUM", "HIGH"]),
    },
  ];

  const active = tabs.find(t => t.key === tab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl px-5 py-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="uppercase tracking-[0.22em] text-[0.6rem] text-emerald-400">
              ΕΜΠΙΣΤΟΣΥΝΗ
            </div>
            <div className="text-xs text-slate-400">
              MKT vs MODEL — ΔΙΟΡΘΩΣΗ ΠΙΘΑΝΟΤΗΤΩΝ
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-600 px-4 py-1 text-xs uppercase tracking-[0.16em] text-slate-200 hover:bg-slate-800"
          >
            ΚΛΕΙΣΙΜΟ
          </button>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1 rounded-full text-xs uppercase tracking-[0.18em] border
                ${
                  tab === t.key
                    ? "bg-emerald-400 text-emerald-950 border-emerald-300"
                    : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {active?.rows?.length ? (
            active.rows.map((r, i) => (
              <TrustRow
                key={i}
                label={r.label}
                mkt={r.mkt}
                ml={r.ml}
              />
            ))
          ) : (
            <div className="text-sm text-slate-500">
              Δεν υπάρχουν επαρκή δεδομένα.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
