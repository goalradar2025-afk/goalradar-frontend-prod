// frontend/src/pages/AnalysisPage.jsx
// GoalRadar — Analysis Page (SINGLE ACTIVE MATCH)

import React from "react";
import { useParams } from "react-router-dom";
import AnalysisView from "../components/analysis/AnalysisView";

export default function AnalysisPage() {
  const { fixtureId } = useParams();

  return (
    <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
      <AnalysisView fixtureId={fixtureId} />
    </div>
  );
}
