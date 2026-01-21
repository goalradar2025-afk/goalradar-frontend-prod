// src/components/FixtureGrid.jsx

import React from "react";
import FixtureCard from "./FixtureCard.jsx";
import HistoryPanel from "./history/HistoryPanel";

export default function FixtureGrid({
  fixtures = [],
  onSelectFixture,
  analysisOpen,
  activeFixture,
  statsOpenFor,
}) {
  if (!fixtures.length) {
    return (
      <div className="w-full text-center text-slate-500 py-10">
        Δεν βρέθηκαν αγώνες για τα επιλεγμένα φίλτρα.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {fixtures.map((fx, idx) => {
        const key = fx.fixture_id || `fixture-${idx}`;
        const isStatsOpen = statsOpenFor === fx.fixture_id;

        return (
          <React.Fragment key={key}>
            <FixtureCard
              fixture={fx}
              onSelectFixture={onSelectFixture}
              hideIndicators={analysisOpen}
            />

            {isStatsOpen && (
              <div className="pl-2">
                {false && <HistoryPanel fixture={fx} />}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
