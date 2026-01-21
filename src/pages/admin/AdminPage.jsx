// src/pages/admin/AdminPage.jsx
// ===================================================
// ADMIN PAGE — AUTH + OPAP IMPORT UI
// ===================================================

import React, { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // OPAP UI state
  const [opapUrl, setOpapUrl] = useState("");
  const [opapFile, setOpapFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  // -------------------------------------------
  // CHECK SESSION
  // -------------------------------------------
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // -------------------------------------------
  // LOGIN
  // -------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }

      await checkAuth();
    } catch {
      setError("Network error");
    }
  };

  // -------------------------------------------
  // LOGOUT
  // -------------------------------------------
  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAuthenticated(false);
  };

  // -------------------------------------------
  // OPAP IMPORT — URL
  // -------------------------------------------
  const importViaUrl = async () => {
    setStatus("Importing via URL…");
    setSnapshot(null);

    try {
      const res = await fetch(`${API_BASE}/api/admin/opap/import_url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: opapUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.error || "Import failed");
        return;
      }

      setSnapshot(data.snapshot);
      setStatus("Import via URL OK");
    } catch {
      setStatus("Network error");
    }
  };

  // -------------------------------------------
  // OPAP IMPORT — FILE
  // -------------------------------------------
  const importViaFile = async () => {
    if (!opapFile) return;

    setStatus("Importing PDF…");
    setSnapshot(null);

    const formData = new FormData();
    formData.append("file", opapFile);

    try {
      const res = await fetch(`${API_BASE}/api/admin/opap/import_file`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.error || "Import failed");
        return;
      }

      setSnapshot(data.snapshot);
      setStatus("Import via PDF OK");
    } catch {
      setStatus("Network error");
    }
  };

  // -------------------------------------------
  // LOAD CURRENT SNAPSHOT
  // -------------------------------------------
  const loadSnapshot = async () => {
    setStatus("Loading snapshot…");

    try {
      const res = await fetch(`${API_BASE}/admin/opap/current`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("No snapshot found");
        return;
      }

      setSnapshot(data.snapshot);
      setStatus("Snapshot loaded");
    } catch {
      setStatus("Network error");
    }
  };

  // -------------------------------------------
  // RENDER
  // -------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4"
        >
          <div className="text-lg font-semibold text-center">
            Admin Login
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
          />

          {error && (
            <div className="text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded bg-slate-700 hover:bg-slate-600 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // -----------------------------
  // ADMIN PANEL — OPAP UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">
          Admin Panel — OPAP
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm rounded bg-slate-800 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>

      {/* IMPORT VIA URL */}
      <div className="border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="font-semibold">Import OPAP via URL</div>
        <input
          type="text"
          placeholder="https://…opap.pdf"
          value={opapUrl}
          onChange={(e) => setOpapUrl(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        <button
          onClick={importViaUrl}
          className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
        >
          Import URL
        </button>
      </div>

      {/* IMPORT VIA FILE */}
      <div className="border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="font-semibold">Import OPAP via PDF</div>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setOpapFile(e.target.files[0])}
        />
        <button
          onClick={importViaFile}
          className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
        >
          Import PDF
        </button>
      </div>

      {/* SNAPSHOT */}
      <div className="border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="font-semibold">Current Snapshot</div>
        <button
          onClick={loadSnapshot}
          className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700"
        >
          Load snapshot
        </button>

        {status && (
          <div className="text-sm text-slate-400">
            {status}
          </div>
        )}

        {snapshot && (
          <pre className="text-xs bg-slate-900 p-3 rounded overflow-auto max-h-[300px]">
            {JSON.stringify(snapshot, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
