// src/components/Sidebar.jsx
// ==========================================================
// GOALRADAR v3.4 — SIDEBAR WITH HOTLIST COUNT + INLINE FEEDBACK
// ==========================================================

import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  CalendarSearch,
  Stars,
  Layers,
  Sliders,
  LineChart,
  Shield,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

const STORAGE_KEY = "grd_hotlist_session_v1";

function readHotlistCount() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

export default function Sidebar() {
  const current = window.location.hash || "#/";

  const [hotlistCount, setHotlistCount] = useState(0);
  const [hotlistMsg, setHotlistMsg] = useState(null);

  // κρατάμε το προηγούμενο count για σύγκριση
  const prevCountRef = useRef(0);

  const go = (path) => {
    window.location.hash = `#${path}`;
  };

  const comingSoon = () => {
    alert("Η ενότητα είναι υπό κατασκευή.");
  };

  const isActive = (path) =>
    current === `#${path}` || current.startsWith(`#${path}/`);

  // --------------------------------------------------
  // HOTLIST SYNC (ADD + REMOVE)
  // --------------------------------------------------
  useEffect(() => {
    // initial load
    const initialCount = readHotlistCount();
    setHotlistCount(initialCount);
    prevCountRef.current = initialCount;

    const handler = () => {
      const nextCount = readHotlistCount();
      const prevCount = prevCountRef.current;

      setHotlistCount(nextCount);

      if (nextCount > prevCount) {
        setHotlistMsg("Η επιλογή καταχωρήθηκε");
      } else if (nextCount < prevCount) {
        setHotlistMsg("Η καταχώρηση διαγράφηκε");
      }

      prevCountRef.current = nextCount;

      if (nextCount !== prevCount) {
        setTimeout(() => setHotlistMsg(null), 2200);
      }
    };

    window.addEventListener("hotlist:update", handler);
    return () =>
      window.removeEventListener("hotlist:update", handler);
  }, []);

  return (
    <aside
      className="
        fixed top-0 left-0
        w-[220px] h-screen
        flex flex-col
        bg-slate-900/90
        border-r border-slate-800
        text-slate-300
        py-6 px-4
        z-50
      "
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">
          GRD
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold text-slate-100">
            GoalRadar
          </span>
          <span className="text-[11px] text-slate-400">
            GRD ai
          </span>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1">

        <MenuItem
          icon={<Home size={18} />}
          label="Αρχική"
          active={current === "#/"}
          onClick={() => go("/")}
        />

        <MenuItem
          icon={<HelpCircle size={18} />}
          label="Οδηγίες Χρήσης"
          onClick={() => go("/app/how-to-use")}
        />

        <MenuItem
          icon={<CalendarSearch size={18} />}
          label="Πρόγραμμα Αγώνων"
          active={current === "#/app" || current === "#/app/"}
          onClick={() => go("/app")}
        />

        <MenuItem
          icon={<Stars size={18} />}
          label="Auto GR List"
          active={isActive("/app/auto-gr-list")}
          onClick={() => go("/app/auto-gr-list")}
        />

        <Divider />

        {/* HOTLIST */}
        <div className="relative">
          {hotlistMsg && (
            <div
              className="
                absolute -top-3 left-1/2 -translate-x-1/2
                z-50
                text-[13px] font-bold
                bg-slate-800 text-emerald-300
                border border-emerald-400/50
                px-3 py-1.5 rounded-lg
                shadow-lg
                whitespace-nowrap
              "
            >
              {hotlistMsg}
            </div>
          )}

          <MenuItem
            icon={<Layers size={18} />}
            label={`HotList (${hotlistCount})`}
            active={isActive("/app/hotlist")}
            onClick={() => go("/app/hotlist")}
          />
        </div>

        <MenuItem
          icon={<Sliders size={18} />}
          label="Δελτία"
          active={isActive("/app/tickets")}
          onClick={() => go("/app/tickets")}
        />

        <MenuItem
          icon={<LineChart size={18} />}
          label="Στατιστικά"
          placeholder
          onClick={comingSoon}
        />

        <Divider />

        <MenuItem
          icon={<User size={18} />}
          label="Λογαριασμός"
          placeholder
          onClick={comingSoon}
        />

        <MenuItem
          icon={<Settings size={18} />}
          label="Ρυθμίσεις"
          placeholder
          onClick={comingSoon}
        />

        <MenuItem
          icon={<HelpCircle size={18} />}
          label="Οδηγίες Χρήσης"
          placeholder
          onClick={comingSoon}
        />

        <Divider />

        <MenuItem
          icon={<Shield size={18} />}
          label="Admin / Internal"
          active={isActive("/admin")}
          onClick={() => go("/admin")}
          badge="DEV"
        />

      </nav>
    </aside>
  );
}

/* ------------------------------------------------------- */

function MenuItem({
  icon,
  label,
  onClick,
  active,
  placeholder,
  badge,
}) {
  return (
    <button
      onClick={onClick}
      disabled={placeholder}
      className={`
        w-full flex items-center gap-3
        px-3 py-2 rounded-lg
        text-[14px] font-semibold
        transition-all
        ${
          active
            ? "bg-slate-800 text-white border border-emerald-400/50"
            : placeholder
              ? "opacity-60 cursor-not-allowed hover:bg-slate-800/40"
              : "hover:bg-slate-800 hover:text-white"
        }
      `}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500 text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function Divider() {
  return <div className="my-3 border-t border-slate-800" />;
}
