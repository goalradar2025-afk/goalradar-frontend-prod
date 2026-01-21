// src/components/tickets/CouponModal.jsx
// ===================================================
// GOALRADAR — COUPON MODAL (FINAL)
// - ΜΟΝΟ κουπόνι (αγώνας | επιλογή | κωδ. ΟΠΑΠ)
// - Από εδώ γίνεται η αποστολή email
// ===================================================

import React, { useState } from "react";
import EmailModal from "./EmailModal";

export default function CouponModal({ open, onClose, selections }) {
  const [showEmail, setShowEmail] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-slate-900 text-slate-200 w-full max-w-md rounded-lg p-6 relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">ΚΟΥΠΟΝΙ</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 text-sm">
          {selections.map((s, idx) => (
            <div key={idx}>
              <div className="font-semibold">
                {s.match} | {s.pick}
              </div>
              <div className="text-slate-400">
                Κωδ. ΟΠΑΠ: {s.opapCode ?? "μη διαθέσιμος"}
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowEmail(true)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-md font-semibold text-sm"
          >
            ΑΠΟΣΤΟΛΗ ΣΤΟ EMAIL
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-slate-800/60 hover:bg-slate-700 py-2 rounded-md text-sm"
          >
            ΚΛΕΙΣΙΜΟ
          </button>
        </div>
      </div>

      <EmailModal
        open={showEmail}
        onClose={() => setShowEmail(false)}
        selections={selections}
      />
    </div>
  );
}
