// src/App.jsx
// ===================================================
// GOALRADAR — APP ROOT (FINAL ROUTING — SAFE ANALYSIS)
// ===================================================

import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

// PAGES
import Home from "./pages/Home";
import FixturesBrowser from "./components/FixturesBrowser";
import AutoGRListView from "./components/auto-gr/AutoGRListView";
import AnalysisView from "./components/analysis/AnalysisView";
import Tickets from "./pages/Tickets";
import HotlistView from "./pages/HotlistView";
import HowToUse from "./pages/HowToUse";

// ✅ ADMIN
import AdminPage from "./pages/admin/AdminPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* ✅ ADMIN (INTERNAL / DEV) */}
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<FixturesBrowser />} />
          <Route path="auto-gr-list" element={<AutoGRListView />} />

          {/* ✅ Analysis με fallback param */}
          <Route path="analysis" element={<AnalysisView />} />
          <Route path="how-to-use" element={<HowToUse />} />
          <Route path="analysis/:fixtureId" element={<AnalysisView />} />
          

          <Route path="hotlist" element={<HotlistView />} />
          <Route path="tickets" element={<Tickets />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
