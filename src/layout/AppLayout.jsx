// src/layout/AppLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import GlobalHeader from "../components/GlobalHeader";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AppLayout() {
  const location = useLocation();

  // 👉 Analysis route = full width
  const isAnalysis = location.pathname.startsWith("/analysis");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* TOP HEADER */}
      <GlobalHeader />

      {/* MAIN AREA */}
      <div className="flex flex-1 pt-[56px]">
        {/* LEFT SIDEBAR */}
        <aside className="w-[220px] shrink-0">
          <Sidebar />
        </aside>

        {/* CONTENT + FOOTER */}
        <div className="flex flex-col flex-1">
          <main
            className={`flex-1 ${
              isAnalysis ? "px-0 py-0" : "px-6 py-6"
            }`}
          >
            <Outlet />
          </main>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
