// =====================================================
// GoalRadar — Hotlist Helper (UNIFIED / SAFE)
// -----------------------------------------------------
// ΚΑΝΟΝΕΣ (ΚΛΕΙΔΩΜΕΝΟ):
// - ΕΝΙΑΙΑ λογική για ΟΛΕΣ τις αγορές
// - FT / OU / BTTS / TG → ΙΔΙΟ API contract
// - ΚΑΝΕΝΑ UI logic εδώ
// - ΚΑΝΕΝΑ CST
// - ΚΑΝΕΝΑΣ optimizer
// - ΜΟΝΟ passthrough προς backend
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * ΕΝΙΑΙΑ συνάρτηση προσθήκης στη HotList
 *
 * @param {Object} params
 * @param {Object} params.fixture   { fixture_id, home, away }
 * @param {string} params.market    "FT" | "OU25" | "OU35" | "BTTS" | "TG"
 * @param {string} params.selection επιλογή (π.χ. "1", "OVER", "YES", κ.λπ.)
 * @param {Object} params.payload   εσωτερικά δεδομένα αγοράς
 */
export async function addToHotlist({
  fixture,
  market,
  selection,
  payload = {},
}) {
  if (!fixture || !market || !selection) {
    console.error("HotlistHelper: missing required data", {
      fixture,
      market,
      selection,
    });
    return { ok: false };
  }

  try {
    const res = await fetch(`${API_BASE}/hotlist/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fixture_id: fixture.fixture_id,
        home: fixture.home,
        away: fixture.away,
        market,
        selection,
        payload,
      }),
    });

    const data = await res.json();

    if (!data?.ok) {
      console.error("HotlistHelper: backend rejected", data);
    }

    return data;
  } catch (err) {
    console.error("HotlistHelper: request failed", err);
    return { ok: false };
  }
}
