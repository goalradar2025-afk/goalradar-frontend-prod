// src/pages/Tickets.jsx
// ===================================================
// GOALRADAR — TICKETS PAGE (HOTLIST → 3 BEST TICKETS)
// ===================================================

import React, { useEffect, useMemo, useState } from "react";
import { getHotlist } from "../utils/hotlistHelper";
import { API_BASE_URL } from "../constants/config";

// ----------------------------
// Utils
// ----------------------------
function clamp01(x) {
  if (typeof x !== "number" || Number.isNaN(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function asPct(p) {
  return (clamp01(p) * 100).toFixed(2);
}

function safeNum(x) {
  return typeof x === "number" && !Number.isNaN(x) ? x : null;
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const k = keyFn(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function formatMarketLabel(market) {
  switch (market) {
    case "FT":
      return "FT 1X2";
    case "OU25":
      return "OU 2.5";
    case "OU35":
      return "OU 3.5";
    case "BTTS":
      return "GG (BTTS)";
    case "TG":
      return "TOTAL GOALS";
    default:
      return market || "—";
  }
}

function formatSelectionLabel(market, selection, payload) {
  if (!market) return selection || "—";

  if (market === "FT") {
    if (selection === "1") return "1 (Γηπεδούχος)";
    if (selection === "X") return "X (Ισοπαλία)";
    if (selection === "2") return "2 (Φιλοξενούμενος)";
    return selection || "—";
  }

  if (market === "OU25") {
    if (selection === "UNDER") return "UNDER 2.5";
    if (selection === "OVER") return "OVER 2.5";
    return selection || "—";
  }

  if (market === "OU35") {
    if (selection === "UNDER") return "UNDER 3.5";
    if (selection === "OVER") return "OVER 3.5";
    return selection || "—";
  }

  if (market === "BTTS") {
    if (selection === "YES") return "GOAL–GOAL";
    if (selection === "NO") return "NO GOAL";
    return selection || "—";
  }

  if (market === "TG") {
    const dist = Array.isArray(payload?.dist) ? payload.dist : [];
    const dist5p = typeof payload?.dist_5p === "number" ? payload.dist_5p : null;
    const merged = [...dist];
    if (dist5p != null) merged.push(dist5p);
    if (!merged.length) return selection || "—";
    const labels = ["0", "1", "2", "3", "4", "5+"];
    const idx = merged.reduce((m, v, i, a) => (v > a[m] ? i : m), 0);
    return `${labels[idx]} ΓΚΟΛ`;
  }

  return selection || "—";
}

// ---------------------------------------------
// Πιθανότητα επιλογής από το payload της hotlist
// ---------------------------------------------
function getSelectionProbability(item) {
  const market = item?.market;
  const selection = item?.selection;
  const payload = item?.payload || {};

  if (market === "FT") {
    const model = payload?.payload?.model || payload?.model || {};
    const v = safeNum(model?.[selection]);
    return v != null ? clamp01(v / 100) : 0;
  }

  if (market === "OU25" || market === "OU35") {
    const p = payload?.payload || payload;

    if (selection === "UNDER") {
      const v = safeNum(p?.model_under);
      return v != null ? clamp01(v / 100) : 0;
    }
    if (selection === "OVER") {
      const v = safeNum(p?.model_over);
      return v != null ? clamp01(v / 100) : 0;
    }
    return 0;
  }

  if (market === "BTTS") {
    const p = payload?.payload || payload;

    if (selection === "YES") {
      const v = safeNum(p?.model_yes);
      return v != null ? clamp01(v / 100) : 0;
    }
    if (selection === "NO") {
      const v = safeNum(p?.model_no);
      return v != null ? clamp01(v / 100) : 0;
    }
    return 0;
  }

  if (market === "TG") {
    const p = payload?.payload || payload;
    const baseDist = Array.isArray(p?.dist) ? p.dist : [];
    const dist5p = typeof p?.dist_5p === "number" ? p.dist_5p : null;
    const dist = [...baseDist];
    if (dist5p != null) dist.push(dist5p);
    if (!dist.length) return 0;

    const idx = dist.reduce((m, v, i, a) => (v > a[m] ? i : m), 0);
    const v = safeNum(dist[idx]);
    return v != null ? clamp01(v) : 0;
  }

  return 0;
}

// ---------------------------------------------
// Ticket engine (simple + stable)
// ---------------------------------------------
function buildTicketsForType(items, type) {
  const K_BY_TYPE = {
    SAFE: 3,
    STANDARD: 4,
    RISK: 5,
    BOMB: 6,
  };

  const k = K_BY_TYPE[type] || 3;

  const enriched = items
    .map((it) => {
      const p = getSelectionProbability(it);
      return { ...it, __p: p };
    })
    .filter((x) => x.__p > 0);

  const deduped = uniqBy(enriched, (x) => `${x.fixture_id}__${x.market}__${x.selection}`);
  const top = [...deduped].sort((a, b) => b.__p - a.__p).slice(0, 15);

  if (top.length < 3) return { tickets: [], k, used: top };

  const kk = Math.max(3, Math.min(k, top.length));
  const candidates = [];
  candidates.push(top.slice(0, kk));

  for (let shift = 1; shift <= 6; shift++) {
    if (candidates.length >= 8) break;
    const base = top.slice(0, kk);
    const idxToReplace = (shift - 1) % kk;
    const replacement = top[kk - 1 + shift];
    if (!replacement) continue;

    const next = [...base];
    next[idxToReplace] = replacement;

    const sig = next
      .map((x) => `${x.fixture_id}-${x.market}-${x.selection}`)
      .sort()
      .join("|");

    const exists = candidates.some((c) => {
      const s = c
        .map((x) => `${x.fixture_id}-${x.market}-${x.selection}`)
        .sort()
        .join("|");
      return s === sig;
    });

    if (!exists) candidates.push(next);
  }

  const scored = candidates
    .map((sel) => {
      const pTicket = sel.reduce((acc, x) => acc * clamp01(x.__p), 1);
      const totalOdds = pTicket > 0 ? 1 / pTicket : null;

      return { selections: sel, pTicket, totalOdds };
    })
    .sort((a, b) => b.pTicket - a.pTicket)
    .slice(0, 3);

  return { tickets: scored, k: kk, used: top };
}

// ----------------------------
// UI
// ----------------------------
const TICKET_TYPES = [
  { key: "SAFE", label: "SAFE" },
  { key: "STANDARD", label: "STANDARD" },
  { key: "RISK", label: "RISK" },
  { key: "BOMB", label: "BOMB" },
];

export default function Tickets() {
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState("SAFE");
  const [showTickets, setShowTickets] = useState(false);

  // multi-pick: Set of ids like "SAFE_0"
  const [picked, setPicked] = useState(() => new Set());

  // modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState(null);

  useEffect(() => {
    const refresh = () => setItems(getHotlist() || []);
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("grd_hotlist_updated", onUpdate);
    return () => window.removeEventListener("grd_hotlist_updated", onUpdate);
  }, []);

  const engine = useMemo(() => {
    const res = {};
    for (const t of TICKET_TYPES) {
      res[t.key] = buildTicketsForType(items, t.key);
    }
    return res;
  }, [items]);

  const current = engine[selectedType] || { tickets: [], k: 3, used: [] };
  const tickets = current.tickets || [];
  const best = tickets[0] || null;

  useEffect(() => {
    setShowTickets(false);
  }, [selectedType]);

  const hotlistCount = Array.isArray(items) ? items.length : 0;
  const canShow = hotlistCount >= 3;

  const bestStats = best
    ? {
        selectionsCount: best.selections.length,
        totalOdds: best.totalOdds != null ? best.totalOdds.toFixed(2) : "—",
        probability: asPct(best.pTicket),
      }
    : null;

  const microcopy = {
    SAFE: "Ελάχιστο ρίσκο — δίνει προτεραιότητα στη μέγιστη πιθανότητα επιβεβαίωσης.",
    STANDARD: "Ισορροπημένος συνδυασμός — λίγο περισσότερες επιλογές με καλή πιθανότητα.",
    RISK: "Πιο επιθετικό — περισσότερες επιλογές, χαμηλότερη πιθανότητα επιβεβαίωσης.",
    BOMB: "Ακραίο — μόνο όταν υπάρχουν πολλές επιλογές και θες «βόμβα».",
  };

  function togglePicked(id) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function buildSlipPayload(type, ticket) {
    const pTicketPct = Number(asPct(ticket.pTicket));
    const totalOdds = ticket.totalOdds != null ? Number(ticket.totalOdds) : null;

    const selections = ticket.selections.map((it) => {
      const marketLabel = formatMarketLabel(it.market);
      const selectionLabel = formatSelectionLabel(
        it.market,
        it.selection,
        it.payload?.payload || it.payload
      );
      const match = `${it.home || "—"} - ${it.away || "—"}`;

      return {
        fixture_id: it.fixture_id || null,
        match,
        home: it.home || null,
        away: it.away || null,
        market: it.market || null,
        marketLabel,
        selection: it.selection || null,
        selectionLabel,
        probabilityPct: Number(asPct(it.__p)),
      };
    });

    return {
      type,
      pTicket: pTicketPct,
      totalOdds,
      selections,
    };
  }

  function collectSelectedSlips() {
    const slips = [];
    for (const typeObj of TICKET_TYPES) {
      const type = typeObj.key;
      const arr = engine[type]?.tickets || [];
      arr.slice(0, 3).forEach((t, idx) => {
        const id = `${type}_${idx}`;
        if (picked.has(id)) {
          slips.push(buildSlipPayload(type, t));
        }
      });
    }
    return slips;
  }

  async function sendSelected() {
    setSendMsg(null);

    const slips = collectSelectedSlips();
    if (!slips.length) {
      setSendMsg("Δεν έχεις επιλέξει δελτία για αποστολή.");
      return;
    }

    const e = (email || "").trim();
    if (!e || !e.includes("@")) {
      setSendMsg("Γράψε ένα έγκυρο email.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/account/send_slips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: e, slips }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const err = data?.error || "Αποτυχία αποστολής.";
        setSendMsg(err);
        setSending(false);
        return;
      }

      setSendMsg(`Στάλθηκαν ${data.count} δελτία σε 1 email.`);
      setSending(false);
      setShowEmailModal(false);
    } catch (err) {
      setSendMsg("Σφάλμα δικτύου / server.");
      setSending(false);
    }
  }

  const selectedCount = picked.size;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">ΔΕΛΤΙΑ</h1>
          <p className="text-slate-400 mt-1">
            Σύνθεση επιλογών από τη Hotlist (έως 3 δελτία ανά κατηγορία)
          </p>
        </div>

        {/* TYPE SELECTOR */}
        <div className="flex flex-wrap gap-3">
          {TICKET_TYPES.map((t) => {
            const hasAny = (engine[t.key]?.tickets || []).length > 0;
            const enabled = canShow && hasAny;

            return (
              <button
                key={t.key}
                disabled={!enabled}
                onClick={() => enabled && setSelectedType(t.key)}
                className={`
                  px-4 py-2 rounded-md text-sm font-semibold transition
                  ${
                    selectedType === t.key
                      ? "bg-slate-700 text-white"
                      : enabled
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      : "bg-slate-800/40 text-slate-500 cursor-not-allowed"
                  }
                `}
                title={
                  !canShow
                    ? "Χρειάζεσαι τουλάχιστον 3 επιλογές στη Hotlist."
                    : !hasAny
                    ? "Δεν υπάρχουν επαρκή δεδομένα για αυτή την κατηγορία."
                    : ""
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* MAIN CARD */}
        <div className="border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold">{selectedType} ΔΕΛΤΙΟ</h2>
            <p className="text-slate-400 text-sm mt-1">
              {microcopy[selectedType] || ""}
            </p>
          </div>

          {!canShow && (
            <div className="text-sm text-slate-300 bg-slate-900/60 border border-slate-800 rounded-lg p-4">
              Χρειάζεσαι <b>τουλάχιστον 3</b> επιλογές στη Hotlist για να εμφανιστούν δελτία.
            </div>
          )}

          {canShow && !best && (
            <div className="text-sm text-slate-300 bg-slate-900/60 border border-slate-800 rounded-lg p-4">
              Δεν υπάρχουν αρκετά «έγκυρα» δεδομένα (πιθανότητες) για να δημιουργηθεί δελτίο σε αυτή την κατηγορία.
            </div>
          )}

          {canShow && best && bestStats && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-slate-400 text-sm">Αριθμός επιλογών</div>
                  <div className="text-2xl font-bold mt-1">{bestStats.selectionsCount}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-sm">Συνολική απόδοση (GR)</div>
                  <div className="text-2xl font-bold mt-1">{bestStats.totalOdds}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-sm">Εκτιμώμενη πιθανότητα επιβεβαίωσης</div>
                  <div className="text-2xl font-bold mt-1">{bestStats.probability}%</div>
                </div>
              </div>

              {/* NOTE */}
              <div className="text-xs text-slate-400">
                Τα δελτία εδώ είναι <b>στατιστική σύνθεση</b> από τη Hotlist.
                <br />
                Δεν χρησιμοποιούνται αποδόσεις — αργότερα θα μπαίνει μόνο ο <b>κωδικός</b>.
              </div>

              {/* ACTION */}
              <div>
                <button
                  onClick={() => setShowTickets((v) => !v)}
                  className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm font-semibold"
                  title="Εμφάνιση έως 3 δελτίων"
                >
                  ΠΡΟΒΟΛΗ ΕΠΙΛΟΓΩΝ {showTickets ? "▲" : "▼"}
                  <span className="ml-2 opacity-80 text-xs">(ENTER)</span>
                </button>
              </div>

              {/* TICKETS LIST (max 3) */}
              {showTickets && (
                <div className="space-y-4 pt-2">
                  {tickets.slice(0, 3).map((t, idx) => {
                    const id = `${selectedType}_${idx}`;
                    const isPicked = picked.has(id);

                    return (
                      <div
                        key={id}
                        className="border border-slate-800 rounded-xl p-4 bg-slate-900/40"
                      >
                        {/* header row */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-bold text-slate-100">
                              Δελτίο #{idx + 1}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Πιθανότητα:{" "}
                              <b className="text-slate-200">{asPct(t.pTicket)}%</b>{" "}
                              · Συνολική απόδοση (GR):{" "}
                              <b className="text-slate-200">
                                {t.totalOdds != null ? t.totalOdds.toFixed(2) : "—"}
                              </b>
                            </div>
                          </div>

                          {/* checkbox only */}
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-xs text-slate-300 select-none">
                              <input
                                type="checkbox"
                                checked={isPicked}
                                onChange={() => togglePicked(id)}
                              />
                              Επιλογή για αποστολή
                            </label>
                          </div>
                        </div>

                        {/* selections */}
                        <div className="mt-4 space-y-2">
                          {t.selections.map((it) => {
                            const marketLabel = formatMarketLabel(it.market);
                            const selLabel = formatSelectionLabel(
                              it.market,
                              it.selection,
                              it.payload?.payload || it.payload
                            );

                            return (
                              <div
                                key={`${it.id}`}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2
                                           border border-slate-800/70 rounded-lg px-3 py-2"
                              >
                                <div className="text-sm text-slate-100 truncate">
                                  {it.home || "—"} - {it.away || "—"}
                                  {it.fixture_id ? (
                                    <span className="text-xs text-slate-500 ml-2">
                                      #{it.fixture_id}
                                    </span>
                                  ) : null}
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">
                                    {marketLabel}
                                  </span>
                                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 font-semibold">
                                    {selLabel}
                                  </span>
                                  <span className="px-2 py-1 rounded bg-slate-900/30 border border-slate-800 text-slate-300">
                                    P {asPct(it.__p)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 text-[11px] text-slate-500">
                          Εδώ αργότερα θα μπαίνει μόνο ο <b>κωδικός</b> ανά επιλογή (όχι αποδόσεις).
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* SEND ACTION — AT THE END (after all tickets) */}
        <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-slate-300">
              Επιλεγμένα δελτία: <b className="text-slate-100">{selectedCount}</b>
            </div>

            <button
              disabled={selectedCount === 0}
              onClick={() => {
                setSendMsg(null);
                setShowEmailModal(true);
              }}
              className={`
                px-4 py-2 rounded-md text-sm font-semibold transition
                ${
                  selectedCount === 0
                    ? "bg-slate-800/40 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-100"
                }
              `}
              title={selectedCount === 0 ? "Επίλεξε πρώτα δελτία για αποστολή." : "Αποστολή 1 email με όλα τα επιλεγμένα δελτία"}
            >
              ΣΤΕΙΛ’ ΤΑ ΕΠΙΛΕΓΜΕΝΑ ΣΤΟ EMAIL ΜΟΥ
            </button>
          </div>

          {sendMsg ? (
            <div className="mt-3 text-xs text-slate-300 bg-slate-900/60 border border-slate-800 rounded-lg p-3">
              {sendMsg}
            </div>
          ) : null}
        </div>

        {/* EMAIL MODAL */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => !sending && setShowEmailModal(false)}
            />
            <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-5">
              <div className="text-lg font-bold text-slate-100">Αποστολή δελτίων</div>
              <div className="text-xs text-slate-400 mt-1">
                Ένα email — όλα τα δελτία που επέλεξες.
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs text-slate-300">
                  ✉ Δώσε email για να σου στείλουμε το ιστορικό σου (δελτία κλπ)
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sending}
                  placeholder="π.χ. name@gmail.com"
                  className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-800 text-slate-100 outline-none"
                />
              </div>

              {sendMsg ? (
                <div className="mt-3 text-xs text-slate-300 bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                  {sendMsg}
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  disabled={sending}
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 rounded-md text-sm bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
                >
                  ΑΚΥΡΟ
                </button>
                <button
                  disabled={sending}
                  onClick={sendSelected}
                  className={`
                    px-4 py-2 rounded-md text-sm font-semibold
                    ${sending ? "bg-slate-800/50 text-slate-400" : "bg-slate-800 hover:bg-slate-700 text-slate-100"}
                  `}
                >
                  {sending ? "ΑΠΟΣΤΟΛΗ..." : "ΑΠΟΣΤΟΛΗ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="pt-10 text-xs text-slate-500">
          Τα δελτία αποτελούν στατιστική σύνθεση επιλογών
          <br />
          με βάση την Hotlist και δεν αποτελούν στοιχηματική συμβουλή.
        </div>
      </div>
    </div>
  );
}
