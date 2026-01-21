// src/pages/HotlistView.jsx
// =====================================================
// GoalRadar — Hotlist View (SESSION ONLY, FINAL)
// + CTA: Δημιουργία Δελτίων (>= 3 επιλογές)
// =====================================================

import React, { useEffect, useMemo, useState } from "react";
import {
  readHotlist,
  deleteHotlistEntry,
  clearHotlist,
} from "../utils/hotlistSession";

export default function HotlistView() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];
    arr.sort((a, b) =>
      String(b.created_at || "").localeCompare(
        String(a.created_at || "")
      )
    );
    return arr;
  }, [items]);

  function refresh() {
    try {
      setError(null);
      setItems(readHotlist());
    } catch (e) {
      setError(e?.message || "Failed to load hotlist");
    }
  }

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("grd_hotlist_updated", onUpdate);
    return () =>
      window.removeEventListener("grd_hotlist_updated", onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDelete(id) {
    try {
      deleteHotlistEntry(id);
      setItems((prev) =>
        prev.filter((x) => String(x.id) !== String(id))
      );
    } catch (e) {
      console.error(e);
    }
  }

  function handleClearAll() {
    try {
      clearHotlist();
      setItems([]);
    } catch (e) {
      console.error(e);
    }
  }

  function goToTickets() {
    window.location.hash = "#/app/tickets";
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "#f87171" }}>
        Σφάλμα: {error}
      </div>
    );
  }

  if (!sorted.length) {
    return (
      <div style={{ padding: 24, color: "#9ca3af" }}>
        Η Hotlist είναι άδεια
      </div>
    );
  }

  const canCreateTickets = sorted.length >= 3;

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            color: "#e5e7eb",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Hotlist ({sorted.length})
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {canCreateTickets && (
            <button
              onClick={goToTickets}
              style={{
                background: "rgba(14,165,233,0.15)",
                border:
                  "1px solid rgba(14,165,233,0.45)",
                color: "#bae6fd",
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
              }}
              title="Μετάβαση στη σελίδα Δελτίων"
            >
              🧾 ΔΗΜΙΟΥΡΓΙΑ ΔΕΛΤΙΩΝ
            </button>
          )}

          <button
            onClick={handleClearAll}
            style={{
              background: "rgba(248,113,113,0.10)",
              border:
                "1px solid rgba(248,113,113,0.25)",
              color: "#fca5a5",
              padding: "8px 10px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
            }}
            title="Καθαρισμός Hotlist (μόνο για το session)"
          >
            Καθαρισμός
          </button>
        </div>
      </div>

      {/* LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {sorted.map((it) => (
          <div
            key={it.id}
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 90px 120px 44px",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderBottom:
                "1px solid rgba(255,255,255,0.08)",
              fontSize: 14,
              color: "#e5e7eb",
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity: 0.95,
              }}
            >
              {it.home || "—"} - {it.away || "—"}
            </div>

            <div
              style={{
                textAlign: "center",
                color: "#93c5fd",
                fontWeight: 600,
              }}
            >
              {it.market || "—"}
            </div>

            <div
              style={{
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {it.selection || "—"}
            </div>

            <button
              onClick={() => handleDelete(it.id)}
              title="Διαγραφή"
              style={{
                width: 36,
                height: 32,
                borderRadius: 10,
                background: "transparent",
                border:
                  "1px solid rgba(248,113,113,0.25)",
                color: "#f87171",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
