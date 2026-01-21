// src/components/tickets/EmailModal.jsx
// ===================================================
// GOALRADAR — EMAIL SEND MODAL
// - Email ΔΕΝ αποθηκεύεται
// - Χρησιμοποιείται ΜΟΝΟ για αποστολή κουπονιού
// ===================================================

import React, { useState } from "react";

export default function EmailModal({ open, onClose, selections }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    // ⛔ MOCK — backend στο επόμενο βήμα
    console.log("SEND COUPON TO:", email, selections);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center">
      <div className="bg-slate-900 text-slate-200 w-full max-w-sm rounded-lg p-6">

        {!sent ? (
          <>
            <h3 className="text-lg font-bold mb-3">Αποστολή κουπονιού</h3>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
            />

            <p className="text-xs text-slate-400 mb-4">
              Το email θα χρησιμοποιηθεί αποκλειστικά για την αποστολή του κουπονιού.
              Στη συνέχεια θα διαγραφεί και σε επόμενη αποστολή θα χρειαστεί να το εισάγετε ξανά.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSend}
                disabled={!email}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-md font-semibold text-sm disabled:opacity-40"
              >
                ΑΠΟΣΤΟΛΗ
              </button>

              <button
                onClick={onClose}
                className="flex-1 bg-slate-800/60 hover:bg-slate-700 py-2 rounded-md text-sm"
              >
                ΑΚΥΡΩΣΗ
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-3">Ολοκληρώθηκε</h3>
            <p className="text-sm text-slate-300 mb-4">
              Το κουπόνι στάλθηκε στο email σας.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-md text-sm font-semibold"
            >
              ΚΛΕΙΣΙΜΟ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
