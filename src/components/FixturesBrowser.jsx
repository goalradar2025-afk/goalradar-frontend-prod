// src/components/FixturesBrowser.jsx
// -----------------------------------------------------------
// GOALRADAR v3.4 — FIXTURES BROWSER (SINGLE ANALYSIS + INLINE STATS)
// -----------------------------------------------------------

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../constants/config";
import FixtureToolbar from "./FixtureToolbar.jsx";
import FixtureGrid from "./FixtureGrid.jsx";
import { normalizeFixtureList } from "../utils/normalizeFixture";
import AnalysisPanel from "./analysis/AnalysisPanel";
import { useSelectedFixture } from "../state/useSelectedFixture";

const DEFAULT_LEAGUES = ["197"];

export default function FixturesBrowser() {
  const today = new Date().toISOString().slice(0, 10);

  const [activeFixture, setActiveFixture] = useState(null);
  const [statsOpenFor, setStatsOpenFor] = useState(null);

  const { setSelected } = useSelectedFixture();

  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [leagues, setLeagues] = useState(DEFAULT_LEAGUES);

  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clampDate = (d) => {
    if (!d) return today;
    return d < today ? today : d;
  };

  const setSafeDateFrom = (d) => setDateFrom(clampDate(d));
  const setSafeDateTo = (d) => setDateTo(clampDate(d));

  const loadFixtures = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("from", clampDate(dateFrom));
      params.set("to", clampDate(dateTo));
      params.set("leagues", leagues.join(","));

      const url = `${API_BASE_URL}/api/fixtures?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.ok) {
        setFixtures([]);
        setError(data.error || "Σφάλμα φόρτωσης αγώνων");
        return;
      }

      setFixtures(normalizeFixtureList(data.fixtures || []));
    } catch {
      setError("Σφάλμα σύνδεσης με backend");
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFixtures();
    // eslint-disable-next-line
  }, []);

  const handleSelectFixture = (fixture) => {
    setSelected({ fixture_id: fixture.fixture_id });
    setActiveFixture(fixture);

    setStatsOpenFor((prev) =>
      prev === fixture.fixture_id ? null : fixture.fixture_id
    );
  };

  const analysisOpen = Boolean(activeFixture);

  return (
    <div className="w-full flex gap-4">
      {/* LEFT — FIXTURES */}
      <div
        className={`${
          analysisOpen ? "w-[420px]" : "w-full"
        } h-[calc(100vh-96px)] overflow-y-auto pr-2 shrink-0`}
      >
        <div className="px-1 sm:px-0 mb-3">
          <FixtureToolbar
            dateFrom={dateFrom}
            dateTo={dateTo}
            selectedLeagues={leagues}
            onChangeDateFrom={setSafeDateFrom}
            onChangeDateTo={setSafeDateTo}
            onChangeLeagues={setLeagues}
            onRefresh={loadFixtures}
          />
        </div>

        {error && (
          <div className="w-full text-center py-3 bg-red-900/60 border border-red-700 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading && !error && (
          <div className="w-full text-center py-8 text-sm text-slate-400">
            Φόρτωση αγώνων...
          </div>
        )}

        {!loading && !error && fixtures.length === 0 && (
          <div className="w-full text-center py-8 text-sm text-slate-500">
            Δεν βρέθηκαν αγώνες.
          </div>
        )}

        {!loading && fixtures.length > 0 && (
          <FixtureGrid
            fixtures={fixtures}
            onSelectFixture={handleSelectFixture}
            analysisOpen={analysisOpen}
            activeFixture={activeFixture}
            statsOpenFor={statsOpenFor}
          />
        )}
      </div>

      {/* RIGHT — ANALYSIS */}
      {analysisOpen && (
        <div className="flex-1 sticky top-4 h-[calc(100vh-96px)] flex flex-col gap-3">
          <AnalysisPanel
            stack={activeFixture ? [activeFixture] : []}
            onClose={() => setActiveFixture(null)}
         />
        </div>
      )}
    </div>
  );
}
