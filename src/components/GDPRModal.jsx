// src/components/GDPRModal.jsx
// ===================================================
// GDPR MODAL — FINAL COPY
// - Υποχρεωτικό gate
// - ΑΠΟΔΟΧΗ ή ΕΞΟΔΟΣ
// ===================================================

import React, { useState } from "react";
import { acceptGDPR } from "../utils/gdprStorage";

export default function GDPRModal({ onAccepted }) {
  const [exited, setExited] = useState(false);

  if (exited) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center text-slate-200 text-xl tracking-[0.35em]">
          <div>Ε Υ Χ Α Ρ Ι Σ Τ Ο Υ Μ Ε</div>
          <div className="mt-4">
            Γ Ι Α&nbsp;&nbsp;Τ Ο Ν&nbsp;&nbsp;Χ Ρ Ο Ν Ο&nbsp;&nbsp;Σ Α Σ
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-2xl rounded-xl bg-slate-900 border border-slate-700 p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-white">GDPR</div>
          <div className="text-sm text-slate-400">
            Προστασία Δεδομένων & Όροι Χρήσης
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-4 text-sm text-slate-300">
          <div className="rounded-lg bg-slate-800/60 p-4">
            <strong>Χρήση πλατφόρμας</strong>
            <p className="mt-2">
              Η πλατφόρμα GoalRadar παρέχει στατιστικές πληροφορίες και αναλύσεις
              αγώνων αποκλειστικά για ενημερωτικούς σκοπούς.
              Δεν αποτελεί στοιχηματική συμβουλή, προτροπή ή εγγύηση αποτελέσματος.
            </p>
          </div>

          <div className="rounded-lg bg-slate-800/60 p-4">
            <strong>Ευθύνη χρήστη</strong>
            <p className="mt-2">
              Ο χρήστης φέρει την πλήρη ευθύνη για οποιαδήποτε απόφαση λάβει
              με βάση τις πληροφορίες που παρουσιάζονται στην πλατφόρμα.
            </p>
          </div>

          <div className="rounded-lg bg-slate-800/60 p-4">
            <strong>Δεδομένα</strong>
            <p className="mt-2">
              Η χρήση της πλατφόρμας προϋποθέτει την αποδοχή της αποθήκευσης
              απαραίτητων τεχνικών δεδομένων (π.χ. cookies λειτουργικότητας)
              σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR).
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setExited(true)}
            className="px-4 py-2 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            ΕΞΟΔΟΣ
          </button>

          <button
            onClick={() => {
              acceptGDPR();
              onAccepted();
            }}
            className="px-6 py-2 rounded-md bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
          >
            ΑΠΟΔΟΧΗ
          </button>
        </div>
      </div>
    </div>
  );
}
