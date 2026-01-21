// src/constants/config.js
// Κεντρικές ρυθμίσεις GoalRadar v2.7 (frontend)

// Βάση URL για το backend
// - Σε local:       http://localhost:5000
// - Σε server:      https://goalradar.gr/api  (π.χ. μέσω Nginx proxy)
// Μπορεί να αλλάξει με VITE_API_BASE_URL στο .env
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Σχετικά paths endpoints
export const ENDPOINTS = {
  FIXTURES: "/fixtures",
  // αργότερα: PREDICT_SINGLE: "/predict_single", CST: "/cst", κ.λπ.
};

// Λίγκες που υποστηρίζουμε στο UI (dropdown)
export const LEAGUES = [
  {
    id: "ALL",
    apiIds: ["39", "140", "135", "78", "197"], // όλες μαζί
    label: "Όλες οι λίγκες",
  },
  {
    id: "197",
    apiIds: ["197"],
    label: "Super League Greece",
  },
  {
    id: "39",
    apiIds: ["39"],
    label: "Premier League",
  },
  {
    id: "140",
    apiIds: ["140"],
    label: "La Liga",
  },
  {
    id: "135",
    apiIds: ["135"],
    label: "Serie A",
  },
  {
    id: "78",
    apiIds: ["78"],
    label: "Bundesliga",
  },
];

// Helper: επιστρέφει το αντικείμενο λίγκας με βάση το id
export function getLeagueById(id) {
  if (!id || id === "ALL") {
    return LEAGUES[0]; // "Όλες οι λίγκες"
  }
  return LEAGUES.find((lg) => lg.id === id) || LEAGUES[0];
}

// Helper: παίρνουμε τα API IDs (comma separated string) για query param
export function getApiLeagueIdsParam(selectedLeagueId) {
  const league = getLeagueById(selectedLeagueId);
  return league.apiIds.join(",");
}
