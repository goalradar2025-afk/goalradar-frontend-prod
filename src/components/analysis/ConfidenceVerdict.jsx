import React from "react";

export default function ConfidenceVerdict() {
  return (
    <div
      style={{
        borderRadius: 22,
        padding: 28,
        background:
          "linear-gradient(180deg, rgba(2,6,23,0.95), rgba(3,7,18,0.98))",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.85)",
        color: "white",
      }}
    >
      {/* ===== TITLE ===== */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 800,
          letterSpacing: "0.26em",
          fontSize: 13,
          marginBottom: 26,
          opacity: 0.9,
        }}
      >
        ΕΚΤΙΜΗΣΗ ΣΥΝΟΧΗΣ
      </div>

      {/* ===== MAIN EXPLANATION ===== */}
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          opacity: 0.9,
          marginBottom: 22,
        }}
      >
        Η «Εκτίμηση Συνοχής» δεν αποτελεί πρόβλεψη και δεν προτείνει επιλογή.
        Παρουσιάζει τον τρόπο με τον οποίο διαβάζονται και ερμηνεύονται τα
        ποσοστά που εμφανίζονται στην ανάλυση.
      </div>

      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          opacity: 0.8,
          marginBottom: 18,
        }}
      >
        Οι αγορές βασίζονται στις αποδόσεις της αγοράς, ενώ το GR Model
        λειτουργεί αποκλειστικά ως διορθωτικός μηχανισμός πάνω σε αυτές.
        Η σύγκριση αγοράς και μοντέλου βοηθά στην κατανόηση της εικόνας του
        αγώνα, χωρίς να υποκαθιστά την προσωπική κρίση.
      </div>

      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          opacity: 0.8,
          marginBottom: 18,
        }}
      >
        Όταν οι διαφορετικές αγορές κινούνται προς παρόμοιες κατευθύνσεις,
        η συνολική εικόνα θεωρείται πιο «καθαρή». Όταν αποκλίνουν, αυτό
        αποτελεί ένδειξη αυξημένης αβεβαιότητας και όχι λάθους.
      </div>

      {/* ===== DISCLAIMER ===== */}
      <div
        style={{
          marginTop: 10,
          padding: "14px 16px",
          borderRadius: 14,
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.35)",
          fontSize: 12,
          lineHeight: 1.55,
          color: "#93c5fd",
        }}
      >
        Το GoalRadar δεν υποδεικνύει τι πρέπει να παιχτεί. Παρέχει εργαλεία
        ανάλυσης ώστε ο χρήστης να λαμβάνει αποφάσεις με μεγαλύτερη επίγνωση
        και σαφήνεια.
      </div>
    </div>
  );
}
