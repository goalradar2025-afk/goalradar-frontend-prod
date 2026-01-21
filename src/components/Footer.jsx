// src/components/Footer.jsx
// ==========================================================
// GOALRADAR — FOOTER (NON-STICKY)
// - Εμφανίζεται στο τέλος του scroll
// - Δεν είναι fixed
// - Ασφαλές για layout με sidebar
// ==========================================================

import React, { useState } from "react";

export default function Footer() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <footer
        className="
          w-full
          border-t border-slate-800
          bg-slate-950
          text-slate-400
          text-sm
        "
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
          {/* LEFT — ABOUT / CONTACT */}
          <div className="text-xs leading-relaxed text-center md:text-left">
            <div className="text-slate-200 font-semibold">
              GoalRadar · GRD ai
            </div>

            <div className="mt-1">
              Πλατφόρμα ανάλυσης ποδοσφαιρικών δεδομένων
            </div>

            <div className="mt-1">
              Επικοινωνία:{" "}
              <a
                href="mailto:info@goalradar.gr"
                className="text-slate-300 hover:text-white transition"
              >
                info@goalradar.gr
              </a>
              {" · "}
              <span className="text-slate-300">+30 69X XXX XXXX</span>
            </div>
          </div>

          {/* CENTER — 18+ NOTICE */}
          <div className="text-center font-bold text-red-500 text-base md:text-lg lg:text-xl">
            18+ ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ Η ΧΡΗΣΗ ΤΗΣ ΠΛΑΤΦΟΡΜΑΣ ΑΠΟ ΑΝΗΛΙΚΟΥΣ
          </div>

          {/* RIGHT — LINKS */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setOpen("info")}
              className="hover:text-slate-200 transition"
            >
              Πληροφορίες
            </button>
            <button
              onClick={() => setOpen("terms")}
              className="hover:text-slate-200 transition"
            >
              Όροι Χρήσης
            </button>
            <button
              onClick={() => setOpen("disclaimer")}
              className="hover:text-slate-200 transition"
            >
              Αποποίηση Ευθύνης
            </button>
            <button
              onClick={() => setOpen("gdpr")}
              className="hover:text-slate-200 transition"
            >
              GDPR
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-lg p-6 text-slate-300 relative">
            <button
              onClick={() => setOpen(null)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-200"
            >
              ✕
            </button>

            {open === "info" && (
              <>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Πληροφορίες
                </h3>
                <p className="text-sm leading-relaxed">
                  Το GoalRadar είναι πλατφόρμα ανάλυσης ποδοσφαιρικών δεδομένων και
                  στατιστικών τάσεων. Παρέχει πληροφορίες και εκτιμήσεις βασισμένες
                  σε ιστορικά δεδομένα και μαθηματικά μοντέλα, με σκοπό την
                  ενημέρωση και την καλύτερη κατανόηση των αγώνων.
                </p>
              </>
            )}

            {open === "terms" && (
              <>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Όροι Χρήσης
                </h3>
                <p className="text-sm leading-relaxed">
                  Η χρήση της πλατφόρμας GoalRadar συνεπάγεται την αποδοχή των
                  παρόντων όρων. Το περιεχόμενο παρέχεται αποκλειστικά για
                  ενημερωτικούς σκοπούς και δεν αποτελεί προτροπή, συμβουλή ή
                  σύσταση για στοιχηματισμό ή οποιαδήποτε οικονομική ενέργεια.
                  Ο χρήστης φέρει την αποκλειστική ευθύνη για κάθε απόφαση που
                  λαμβάνει βάσει των πληροφοριών της πλατφόρμας.
                </p>
              </>
            )}

            {open === "disclaimer" && (
              <>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Αποποίηση Ευθύνης
                </h3>
                <p className="text-sm leading-relaxed">
                  Το GoalRadar δεν εγγυάται την ακρίβεια, πληρότητα ή επιτυχία
                  οποιασδήποτε πληροφορίας ή εκτίμησης. Τα αποτελέσματα αθλητικών
                  γεγονότων είναι απρόβλεπτα και καμία ανάλυση δεν διασφαλίζει
                  συγκεκριμένο αποτέλεσμα. Η πλατφόρμα και οι δημιουργοί της δεν
                  φέρουν καμία ευθύνη για τυχόν απώλειες ή ζημίες που προκύπτουν
                  από τη χρήση της.
                </p>
              </>
            )}

            {open === "gdpr" && (
              <>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Προστασία Προσωπικών Δεδομένων (GDPR)
                </h3>
                <p className="text-sm leading-relaxed">
                  Η πλατφόρμα GoalRadar δεν συλλέγει, αποθηκεύει ή επεξεργάζεται
                  προσωπικά δεδομένα χρηστών. Δεν απαιτείται εγγραφή, σύνδεση ή
                  παροχή προσωπικών στοιχείων για τη χρήση της.
                  <br /><br />
                  Τυχόν τεχνικά δεδομένα (όπως ανώνυμα logs ή στατιστικά χρήσης)
                  χρησιμοποιούνται αποκλειστικά για τη βελτίωση της λειτουργίας
                  της πλατφόρμας και δεν επιτρέπουν την ταυτοποίηση χρηστών.
                  <br /><br />
                  Το GoalRadar συμμορφώνεται με τον Γενικό Κανονισμό Προστασίας
                  Δεδομένων (GDPR – Κανονισμός (ΕΕ) 2016/679).
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
