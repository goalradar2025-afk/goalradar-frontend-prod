// src/components/FixtureToolbar.jsx
// ==========================================================
// GOALRADAR — FIXTURE TOOLBAR (CONTROLLED, REAL CONTRACT)
// - Date range (Από / Έως) -> controlled from parent
// - Διοργανώσεις (multi-select) -> controlled from parent
// - ΧΩΡΙΣ "Όλες"
// - Default selection handled by parent
// ==========================================================

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * API-Football league IDs (season 2025)
 */
const COMPETITIONS = [
  { id: "197", label: "Super League Greece" },

  { id: "39", label: "Premier League" },
  { id: "40", label: "Championship (England)" },

  { id: "140", label: "La Liga" },
  { id: "135", label: "Serie A" },
  { id: "78", label: "Bundesliga (Germany)" },
  { id: "61", label: "Ligue 1" },

  { id: "94", label: "Primeira Liga (Portugal)" },
  { id: "88", label: "Eredivisie (Netherlands)" },
  { id: "179", label: "Premiership (Scotland)" },
  { id: "207", label: "Super League (Switzerland)" },
  { id: "218", label: "Bundesliga (Austria)" },
  { id: "144", label: "Pro League (Belgium)" },
  { id: "203", label: "Super Lig (Turkey)" },

  { id: "2", label: "Champions League" },
  { id: "3", label: "Europa League" },
  { id: "848", label: "Conference League" },
];

export default function FixtureToolbar({
  dateFrom,
  dateTo,
  selectedLeagues,
  onChangeDateFrom,
  onChangeDateTo,
  onChangeLeagues,
  onRefresh,
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // ----------------------------------------------------------
  // Close dropdown on outside click
  // ----------------------------------------------------------
  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------
  const selectedSet = useMemo(
    () => new Set((selectedLeagues || []).map(String)),
    [selectedLeagues]
  );

  const selectedLabel = useMemo(() => {
    const arr = Array.from(selectedSet);
    if (arr.length === 0) return "Καμία επιλεγμένη";
    if (arr.length === 1) {
      const found = COMPETITIONS.find((c) => c.id === arr[0]);
      return found ? found.label : "1 επιλεγμένη";
    }
    return `${arr.length} επιλεγμένες`;
  }, [selectedSet]);

  const toggleLeague = (id) => {
    const strId = String(id);
    const current = Array.from(selectedSet);

    let next;
    if (selectedSet.has(strId)) {
      next = current.filter((x) => x !== strId);
    } else {
      next = [...current, strId];
    }

    if (onChangeLeagues) onChangeLeagues(next);
  };

  const clearAll = () => {
    if (onChangeLeagues) onChangeLeagues([]);
  };

  const selectOnly = (id) => {
    if (onChangeLeagues) onChangeLeagues([String(id)]);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 flex flex-col md:flex-row items-center gap-3">
      {/* ΑΠΟ */}
      <div className="flex items-center gap-2">
        <label className="text-slate-400 text-sm">Από:</label>
        <input
          type="date"
          min={today}
          value={dateFrom || ""}
          onChange={(e) => onChangeDateFrom && onChangeDateFrom(e.target.value)}
          className="
            bg-slate-800 text-slate-200 border border-slate-700
            rounded-lg px-2 py-1 text-sm
          "
        />
      </div>

      {/* ΕΩΣ */}
      <div className="flex items-center gap-2">
        <label className="text-slate-400 text-sm">Έως:</label>
        <input
          type="date"
          min={today}
          value={dateTo || ""}
          onChange={(e) => onChangeDateTo && onChangeDateTo(e.target.value)}
          className="
            bg-slate-800 text-slate-200 border border-slate-700
            rounded-lg px-2 py-1 text-sm
          "
        />
      </div>

      {/* ΔΙΟΡΓΑΝΩΣΕΙΣ */}
      <div className="relative" ref={boxRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="
            bg-slate-800 text-slate-200 border border-slate-700
            rounded-lg px-3 py-1.5 text-sm
            min-w-[280px] text-left
          "
        >
          Διοργανώσεις:{" "}
          <span className="text-slate-400">{selectedLabel}</span>
        </button>

        {open && (
          <div
            className="
              absolute z-50 mt-2 w-full
              bg-slate-900 border border-slate-700
              rounded-lg p-2
              max-h-72 overflow-y-auto
            "
          >
            <div className="flex items-center gap-2 px-2 pb-2 border-b border-slate-800">
              <button
                type="button"
                onClick={clearAll}
                className="text-[12px] px-2 py-1 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                Καθαρισμός
              </button>
              <div className="text-[12px] text-slate-500">
                (tip: click σε όνομα για “μόνο αυτό”)
              </div>
            </div>

            {COMPETITIONS.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-800 rounded"
              >
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedSet.has(c.id)}
                    onChange={() => toggleLeague(c.id)}
                  />
                  {c.label}
                </label>

                <button
                  type="button"
                  onClick={() => selectOnly(c.id)}
                  className="text-[11px] px-2 py-1 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"
                  title="Επίλεξε μόνο αυτή τη διοργάνωση"
                >
                  μόνο
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REFRESH */}
      <button
        onClick={onRefresh}
        className="
          ml-auto bg-blue-600 hover:bg-blue-500 px-4 py-2
          rounded-lg text-sm font-semibold text-white transition
        "
      >
        Ανανέωση
      </button>
    </div>
  );
}
