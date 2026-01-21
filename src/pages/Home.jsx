// src/pages/Home.jsx
// ===================================================
// HOME — FINAL STRUCTURE
// - GDPR gate
// - Intro landing
// - CTA ενεργό ΜΟΝΟ μετά την αποδοχή
// ===================================================

import React, { useEffect, useState } from "react";
import GDPRModal from "../components/GDPRModal";
import { hasAcceptedGDPR } from "../utils/gdprStorage";

export default function Home() {
  const [gdprAccepted, setGdprAccepted] = useState(false);

  useEffect(() => {
    setGdprAccepted(hasAcceptedGDPR());
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center px-6">

      {!gdprAccepted && (
        <GDPRModal onAccepted={() => setGdprAccepted(true)} />
      )}

      {/* CONTENT */}
      <div className="max-w-3xl w-full text-center space-y-12">

        {/* HERO */}
        <div className="space-y-4">
          <div className="text-4xl font-bold">GoalRadar</div>
          <div className="text-slate-400">
            Ανάλυση αγώνων βασισμένη στην αγορά,
            διορθωμένη με επεξεργασία δεδομένων και στατιστική ανάλυση.
          </div>
        </div>

        {/* IS / IS NOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="font-semibold mb-2">Τι είναι</div>
            <ul className="space-y-1 text-slate-300">
              <li>Σύστημα ανάλυσης αγώνων</li>
              <li>Εκτίμηση πιθανοτήτων</li>
              <li>Υποστήριξη απόφασης</li>
            </ul>
          </div>

          <div className="rounded-lg border border-slate-800 p-4">
            <div className="font-semibold mb-2">Τι δεν είναι</div>
            <ul className="space-y-1 text-slate-300">
              <li>Tipster</li>
              <li>Υπόσχεση κέρδους</li>
              <li>Αυτόματο στοίχημα</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div>
          <button
            disabled={!gdprAccepted}
            onClick={() => (window.location.hash = "#/app")}
            className={`px-8 py-3 rounded-md font-semibold transition
              ${
                gdprAccepted
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                  : "bg-slate-800/40 text-slate-500 cursor-not-allowed"
              }
            `}
          >
            ΠΡΟΧΩΡΗΣΕ
          </button>
        </div>
      </div>
    </div>
  );
}
