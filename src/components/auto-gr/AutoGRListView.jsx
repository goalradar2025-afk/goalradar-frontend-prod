// src/components/auto-gr/AutoGRListView.jsx
// ===================================================
// AUTO GR LIST VIEW — READ ONLY
// - UI clone του ShortListDrawer (χωρίς actions)
// - ΧΩΡΙΣ reducer / storage / dispatch
// - ΡΗΤΗ ΕΞΑΙΡΕΣΗ: OU35
// ===================================================

import React from "react";

// ===================================================
// HELPERS (ίδια λογική με ShortListDrawer)
// ===================================================

function avg(arr) {
  const f = arr.filter((x) => x != null && Number.isFinite(Number(x)));
  if (f.length === 0) return 0;
  return f.reduce((a, b) => a + Number(b), 0) / f.length;
}

// ===================================================
// MAIN COMPONENT
// ===================================================

export default function AutoGRListView({
  title = "AUTO GR LIST",
  subtitle = "Αυτόματες επιλογές συστήματος (read-only)",
  items = [],
}) {
  // ===================================================
  // FILTER: EXCLUDE OU35 EXPLICITLY
  // ===================================================
  const filteredItems = Array.isArray(items)
    ? items.filter((it) => it.market !== "OU35")
    : [];

  // SUMMARY CALCULATIONS
  const avgCST = avg(filteredItems.map((i) => i.cst));
  const avgEdge = avg(filteredItems.map((i) => i.edge));
  const avgHealth = avg(filteredItems.map((i) => i.model_health));

  // ===================================================
  // RENDER
  // ===================================================
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">

      {/* ================= HEADER ================= */}
      <div>
        <div className="text-slate-100 font-semibold text-xl tracking-wide">
          {title}
        </div>
        <div className="text-slate-500 text-sm mt-1">
          {subtitle}
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filteredItems.length === 0 && (
        <div className="text-center text-slate-500 text-sm py-12">
          Δεν υπάρχουν διαθέσιμες αυτόματες επιλογές.
        </div>
      )}

      {/* ================= LIST ================= */}
      {filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, idx) => (
            <div
              key={`${item.fixture_id}-${item.market}-${idx}`}
              className="
                rounded-xl border border-slate-800 bg-slate-900/40
                p-4 flex flex-col gap-3 shadow-sm shadow-black/20
              "
            >
              {/* HEADER: Teams + League */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="text-slate-200 font-semibold text-sm">
                    {item.home} vs {item.away}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.league} · {item.kickoff}
                  </div>
                </div>
              </div>

              {/* MARKET TAGS */}
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                <div
                  className={`
                    px-2 py-1 rounded-md border
                    ${
                      item.market === "FT"
                        ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
                        : item.market.startsWith("OU")
                        ? "border-blue-400/40 text-blue-300 bg-blue-500/10"
                        : item.market === "BTTS"
                        ? "border-amber-400/40 text-amber-300 bg-amber-500/10"
                        : item.market === "TG"
                        ? "border-purple-400/40 text-purple-300 bg-purple-500/10"
                        : "border-slate-600/40 text-slate-400"
                    }
                  `}
                >
                  {item.market_label}
                </div>

                {item.opap_code && (
                  <div className="
                    px-2 py-1 rounded-md border border-slate-600/40
                    text-slate-300 bg-slate-800/40
                  ">
                    OPAP: {item.opap_code}
                  </div>
                )}
              </div>

              {/* PROBABILITIES */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="text-[11px] text-slate-400">
                  <div className="text-slate-500 mb-1">MODEL</div>
                  <div className="text-slate-200 font-semibold">
                    {item.model_prob != null
                      ? `${item.model_prob.toFixed(1)}%`
                      : "-"}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  <div className="text-slate-500 mb-1">FAIR</div>
                  <div className="text-slate-200 font-semibold">
                    {item.fair_prob != null
                      ? `${item.fair_prob.toFixed(1)}%`
                      : "-"}
                  </div>
                </div>
              </div>

              {/* EDGE */}
              <div className="text-[11px] mt-1">
                <div className="text-slate-500">EDGE</div>
                <div
                  className={`
                    font-semibold
                    ${
                      item.edge > 0
                        ? "text-emerald-400"
                        : item.edge < 0
                        ? "text-rose-400"
                        : "text-slate-300"
                    }
                  `}
                >
                  {item.edge != null ? `${item.edge.toFixed(1)}%` : "-"}
                </div>
              </div>

              {/* CST + HEALTH */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col border border-slate-700 rounded-lg px-2 py-1.5">
                  <div className="text-[10px] text-slate-500">CST</div>
                  <div
                    className={`
                      text-[12px] font-semibold
                      ${
                        item.cst >= 85
                          ? "text-emerald-300"
                          : item.cst >= 70
                          ? "text-blue-300"
                          : item.cst >= 55
                          ? "text-amber-300"
                          : "text-rose-300"
                      }
                    `}
                  >
                    {item.cst != null ? `${item.cst.toFixed(0)}` : "-"}
                  </div>
                </div>

                <div className="flex flex-col border border-slate-700 rounded-lg px-2 py-1.5">
                  <div className="text-[10px] text-slate-500">Health</div>
                  <div className="text-[12px] font-semibold text-slate-200">
                    {item.model_health != null
                      ? `${item.model_health.toFixed(0)}`
                      : "-"}
                  </div>
                </div>
              </div>

              {/* BAR */}
              <div className="mt-3">
                <div className="w-full h-2 rounded-lg bg-slate-800 overflow-hidden">
                  <div
                    className={`
                      h-full transition-all duration-300
                      ${
                        item.model_prob > 60
                          ? "bg-emerald-500/40"
                          : item.model_prob > 45
                          ? "bg-blue-500/40"
                          : item.model_prob > 30
                          ? "bg-amber-500/40"
                          : "bg-rose-500/40"
                      }
                    `}
                    style={{
                      width: `${item.model_prob || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      {filteredItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800">

          <div className="text-slate-400 text-sm mb-3 font-semibold">
            Σύνοψη Auto GR List
          </div>

          <div className="
            rounded-xl border border-slate-800 bg-slate-900/50
            p-4 flex flex-col gap-3 max-w-md
          ">
            <div className="flex justify-between text-[12px]">
              <div className="text-slate-500">Σύνολο picks</div>
              <div className="text-slate-200 font-semibold">
                {filteredItems.length}
              </div>
            </div>

            <div className="flex justify-between text-[12px]">
              <div className="text-slate-500">Μέσο CST</div>
              <div className="text-slate-200 font-semibold">
                {avgCST.toFixed(1)}
              </div>
            </div>

            <div className="flex justify-between text-[12px]">
              <div className="text-slate-500">Μέσο Edge</div>
              <div
                className={`
                  font-semibold
                  ${
                    avgEdge > 0
                      ? "text-emerald-400"
                      : avgEdge < 0
                      ? "text-rose-400"
                      : "text-slate-300"
                  }
                `}
              >
                {avgEdge.toFixed(1)}%
              </div>
            </div>

            <div className="flex justify-between text-[12px]">
              <div className="text-slate-500">Model Strength</div>
              <div className="text-slate-200 font-semibold">
                {avgHealth.toFixed(0)} / 100
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
