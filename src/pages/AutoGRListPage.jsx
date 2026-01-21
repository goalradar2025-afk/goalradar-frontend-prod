// src/pages/AutoGRListPage.jsx
// ===================================================
// AUTO GR LIST PAGE — SYSTEM READ ONLY
// ---------------------------------------------------
// - Page wrapper για AutoGRListView
// - ΚΑΜΙΑ αλληλεπίδραση χρήστη
// - ΚΑΜΙΑ σύνδεση με ShortList / HotList
// - Τα δεδομένα είναι system-generated
// ===================================================

import React from "react";
import AutoGRListView from "../components/auto-gr/AutoGRListView";

// ===================================================
// TEMP SYSTEM PAYLOAD (θα αντικατασταθεί από backend)
// ===================================================

const SYSTEM_AUTO_GR_PAYLOAD = {
  generated_at: "2025-01-01 12:00",
  season: "2025",
  source: "SYSTEM",
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
    // ⚠️ OU35 ΔΕΝ ΥΠΑΡΧΕΙ ΕΠΙΤΗΔΕΣ
  ],
};

// ===================================================
// PAGE COMPONENT
// ===================================================

export default function AutoGRListPage() {
  const payload = SYSTEM_AUTO_GR_PAYLOAD;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <AutoGRListView
        title="AUTO GR LIST"
        subtitle="Αυτόματες επιλογές συστήματος (ενημερωτικά)"
        items={payload.items}
      />
    </div>
  );
}
