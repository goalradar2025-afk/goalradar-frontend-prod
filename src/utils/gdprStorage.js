// src/utils/gdprStorage.js
// =========================================
// GDPR acceptance storage (simple & stable)
// =========================================

const GDPR_KEY = "gdpr_accepted";

export function hasAcceptedGDPR() {
  return localStorage.getItem(GDPR_KEY) === "true";
}

export function acceptGDPR() {
  localStorage.setItem(GDPR_KEY, "true");
}

export function clearGDPR() {
  localStorage.removeItem(GDPR_KEY);
}
