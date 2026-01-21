// src/auto-gr/AutoGRModal.jsx
// ===================================================
// AUTO GR LIST — CENTER MODAL
// ---------------------------------------------------
// - Overlay + centered dialog
// - Close on X / ESC / backdrop
// - Scroll inside modal
// - READ ONLY
// ===================================================

import React, { useEffect } from "react";
import AutoGRListView from "../components/auto-gr/AutoGRListView";

export default function AutoGRModal({ onClose }) {
  // ESC key close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // TEMP system payload (ίδιο με page, μέχρι backend)
  const payload = {
    items: [
      {
        fixture_id: 101,
        home: "Olympiacos",
        away: "PAOK",
        league: "Super League Greece",
        kickoff: "20:30",
        market: "FT",
        market_label: "FT 1X2",
        model_prob: 56.0,
        fair_prob: 52.0,
        edge: 4.0,
        cst: 72,
        model_health: 78,
        opap_code: "1234",
      },
      {
        fixture_id: 102,
        home: "Aris",
        away: "AEK",
        league: "Super League Greece",
        kickoff: "18:00",
        market: "OU25",
        market_label: "O/U 2.5",
        model_prob: 61.0,
        fair_prob: 57.0,
        edge: 4.0,
        cst: 69,
        model_health: 74,
        opap_code: "1235",
      },
      {
        fixture_id: 103,
        home: "Atromitos",
        away: "Panathinaikos",
        league: "Super League Greece",
        kickoff: "19:30",
        market: "BTTS",
        market_label: "BTTS",
        model_prob: 58.0,
        fair_prob: 54.0,
        edge: 4.0,
        cst: 66,
        model_health: 71,
        opap_code: "1236",
      },
      {
        fixture_id: 104,
        home: "OFI",
        away: "Volos",
        league: "Super League Greece",
        kickoff: "17:00",
        market: "TG",
        market_label: "Total Goals",
        model_prob: 60.0,
        fair_prob: 50.0,
        edge: 0.0,
        cst: 62,
        model_health: 68,
        opap_code: "1237",
      },
      // ⚠️ OU35 σκόπιμα ΑΠΟΥΣΙΑ
    ],
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="
            relative w-full max-w-5xl max-h-[85vh]
            bg-slate-950 border border-slate-800
            rounded-2xl shadow-2xl
            flex flex-col
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div>
              <div className="text-slate-100 font-semibold text-lg tracking-wide">
                AUTO GR LIST
              </div>
              <div className="text-slate-500 text-sm">
                Αυτόματες επιλογές συστήματος (ενημερωτικά)
              </div>
            </div>

            <button
              onClick={onClose}
              className="
                text-slate-400 hover:text-white
                text-2xl leading-none
              "
            >
              ×
            </button>
          </div>

          {/* CONTENT */}
          <div className="overflow-y-auto px-6 py-6">
            <AutoGRListView items={payload.items} />
          </div>
        </div>
      </div>
    </>
  );
}
