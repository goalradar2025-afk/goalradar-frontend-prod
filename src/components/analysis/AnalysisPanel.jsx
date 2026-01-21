// src/components/analysis/AnalysisPanel.jsx
// =====================================================
// GOALRADAR — AnalysisPanel (FIXED — ONE PANEL = ONE FIXTURE)
// =====================================================
// RULES (LOCKED):
// - ΚΑΘΕ panel παίρνει ΔΙΚΟ ΤΟΥ fixtureId
// - ΟΧΙ URL fallback εδώ
// - ΟΧΙ state
// - ΟΧΙ CST
// =====================================================

import React from "react";
import AnalysisView from "./AnalysisView";

export default function AnalysisPanel({ stack, onClose }) {
  if (!Array.isArray(stack) || stack.length === 0) return null;

  // κρατάμε ΠΑΝΤΑ τους τελευταίους 2
  const panels = stack.length <= 2 ? stack : stack.slice(-2);

  const heightClass =
    panels.length === 1 ? "h-full" : "h-1/2";

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {panels.map((fx) => (
        <div
          key={fx.fixture_id}
          className={`${heightClass} overflow-hidden rounded-xl border border-slate-800 bg-slate-950`}
        >
          {/* 🔒 ΚΛΕΙΔΩΜΕΝΟ: onClose περνάει προς τα κάτω */}
          <AnalysisView
            fixtureId={fx.fixture_id}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
}
