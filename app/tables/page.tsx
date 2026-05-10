"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── Types ───────────────────────────────────────────────────────────────────
type TableShape = "round" | "rectangular";

interface WeddingTable {
  id: number;
  table_number: number;
  table_name: string | null;
  capacity: number;
  shape: TableShape;
  notes: string | null;
  created_at: string;
}

type InviteeStatus = "Mr." | "Mme" | "Couple";

interface Invitee {
  id: string;
  full_name: string;
  table_number: number;
  seat_number: number | null;
  phone_number: string | null;
  confirmed: boolean;
  status: InviteeStatus;
  table_mates: string[];
}

type ViewMode = "list" | "map";

// ─── Status colours ──────────────────────────────────────────────────────────
const STATUS_COLOUR: Record<InviteeStatus, string> = {
  "Mr.": "#6366f1",
  Mme: "#ec4899",
  Couple: "#f59e0b",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function groupByTable(invitees: Invitee[]): Record<number, Invitee[]> {
  return invitees.reduce(
    (acc, inv) => {
      if (!acc[inv.table_number]) acc[inv.table_number] = [];
      acc[inv.table_number].push(inv);
      return acc;
    },
    {} as Record<number, Invitee[]>,
  );
}

const defaultForm = {
  table_number: "",
  table_name: "",
  capacity: "10",
  shape: "round" as TableShape,
  notes: "",
};

// ─── Seat dot on a round table ───────────────────────────────────────────────
function SeatDot({
  index,
  total,
  invitee,
  r,
}: {
  index: number;
  total: number;
  invitee?: Invitee;
  r: number;
}) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const sr = r - 14;
  const x = 50 + sr * Math.cos(angle);
  const y = 50 + sr * Math.sin(angle);
  const colour = invitee
    ? (STATUS_COLOUR[invitee.status] ?? "#6366f1")
    : "#e2e8f0";

  return (
    <g>
      <circle
        cx={`${x}%`}
        cy={`${y}%`}
        r="6%"
        fill={colour}
        stroke={invitee?.confirmed ? "#22c55e" : "#94a3b8"}
        strokeWidth="2"
        style={{
          filter: invitee ? "drop-shadow(0 1px 3px rgba(0,0,0,.3))" : "none",
        }}
      />
      {invitee && (
        <text
          x={`${x}%`}
          y={`${y}%`}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="5"
          fill="#fff"
          fontWeight="700"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {invitee.full_name
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .slice(0, 2)}
        </text>
      )}
    </g>
  );
}

// ─── Round Table SVG ─────────────────────────────────────────────────────────
function RoundTableViz({
  table,
  invitees,
}: {
  table: WeddingTable;
  invitees: Invitee[];
}) {
  const seats = Array.from({ length: table.capacity }, (_, i) => invitees[i]);
  const isHead = table.table_number === 1;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* table surface */}
      <circle
        cx="50%"
        cy="50%"
        r="32%"
        fill={isHead ? "#fef3c7" : "#f8fafc"}
        stroke={isHead ? "#f59e0b" : "#cbd5e1"}
        strokeWidth={isHead ? "3" : "2"}
      />
      {/* table number */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="800"
        fill={isHead ? "#92400e" : "#475569"}
      >
        {table.table_number}
      </text>
      {/* seats */}
      {seats.map((inv, i) => (
        <SeatDot
          key={i}
          index={i}
          total={table.capacity}
          invitee={inv}
          r={42}
        />
      ))}
    </svg>
  );
}

// ─── Rectangular Table SVG ───────────────────────────────────────────────────
function RectTableViz({
  table,
  invitees,
}: {
  table: WeddingTable;
  invitees: Invitee[];
}) {
  const half = Math.ceil(table.capacity / 2);
  const top = invitees.slice(0, half);
  const bottom = invitees.slice(half, table.capacity);

  const seatRow = (row: (Invitee | undefined)[], y: number) =>
    Array.from({ length: half }, (_, i) => {
      const inv = row[i];
      const x = 10 + (i / (half - 1 || 1)) * 80;
      const colour = inv ? (STATUS_COLOUR[inv.status] ?? "#6366f1") : "#e2e8f0";
      return (
        <g key={i}>
          <circle
            cx={`${x}%`}
            cy={`${y}%`}
            r="6%"
            fill={colour}
            stroke={inv?.confirmed ? "#22c55e" : "#94a3b8"}
            strokeWidth="2"
            style={{
              filter: inv ? "drop-shadow(0 1px 3px rgba(0,0,0,.3))" : "none",
            }}
          />
          {inv && (
            <text
              x={`${x}%`}
              y={`${y}%`}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="5"
              fill="#fff"
              fontWeight="700"
            >
              {inv.full_name
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .slice(0, 2)}
            </text>
          )}
        </g>
      );
    });

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect
        x="15%"
        y="35%"
        width="70%"
        height="30%"
        rx="4"
        ry="4"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="51%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="800"
        fill="#475569"
      >
        {table.table_number}
      </text>
      {seatRow(top, 22)}
      {seatRow(bottom, 78)}
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TablesPage() {
  const [tables, setTables] = useState<WeddingTable[]>([]);
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [view, setView] = useState<ViewMode>("map");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState<WeddingTable | null>(null);
  const [showForm, setShowForm] = useState(false);

  // selected table detail
  const [selected, setSelected] = useState<WeddingTable | null>(null);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [{ data: t, error: te }, { data: i, error: ie }] = await Promise.all([
      supabase.from("sng_tables").select("*").order("table_number"),
      supabase.from("sng_invitees").select("*").order("table_number"),
    ]);
    if (te || ie) setError((te || ie)?.message ?? "Unknown error");
    else {
      setTables(t ?? []);
      setInvitees(i ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const byTable = groupByTable(invitees);

  // ── submit form ────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      table_number: Number(form.table_number),
      table_name: form.table_name || null,
      capacity: Number(form.capacity),
      shape: form.shape,
      notes: form.notes || null,
    };

    let err;
    if (editing) {
      ({ error: err } = await supabase
        .from("sng_tables")
        .update(payload)
        .eq("id", editing.id));
    } else {
      ({ error: err } = await supabase.from("sng_tables").insert(payload));
    }

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setForm(defaultForm);
    setEditing(null);
    setShowForm(false);
    fetchData();
  }

  function openEdit(t: WeddingTable) {
    setEditing(t);
    setForm({
      table_number: String(t.table_number),
      table_name: t.table_name ?? "",
      capacity: String(t.capacity),
      shape: t.shape,
      notes: t.notes ?? "",
    });
    setShowForm(true);
    setSelected(null);
  }

  async function deleteTable(id: number) {
    if (
      !confirm(
        "Delete this table? Invitees assigned to it will need reassignment.",
      )
    )
      return;
    const { error: err } = await supabase
      .from("sng_tables")
      .delete()
      .eq("id", id);
    if (err) setError(err.message);
    else {
      setSelected(null);
      fetchData();
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-2xl font-black tracking-tight text-rose-700"
              style={{ fontFamily: "Georgia, serif" }}
            >
              💐 Wedding Tables
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {tables.length} tables · {invitees.length} invitees assigned
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* view toggle */}
            <div className="flex rounded-lg overflow-hidden border border-rose-200 text-sm font-semibold">
              {(["map", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 transition-colors ${
                    view === v
                      ? "bg-rose-600 text-white"
                      : "bg-white text-slate-600 hover:bg-rose-50"
                  }`}
                >
                  {v === "map" ? "🗺 Venue" : "📋 List"}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setEditing(null);
                setForm(defaultForm);
                setShowForm((s) => !s);
              }}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow transition-colors"
            >
              + Add Table
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Add / Edit Form ── */}
        {showForm && (
          <div className="mb-6 bg-white rounded-2xl shadow-md border border-rose-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {editing ? "✏️ Edit Table" : "➕ New Table"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Table #
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  value={form.table_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, table_number: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  value={form.table_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, table_name: e.target.value }))
                  }
                  placeholder="e.g. Table des Mariés"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min={2}
                  max={30}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacity: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Shape
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  value={form.shape}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      shape: e.target.value as TableShape,
                    }))
                  }
                >
                  <option value="round">⭕ Round</option>
                  <option value="rectangular">🔲 Rectangular</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Optional notes…"
                />
              </div>
              <div className="col-span-2 md:col-span-3 flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            <span className="animate-pulse">✨ Loading tables…</span>
          </div>
        ) : (
          <>
            {/* ── MAP VIEW ── */}
            {view === "map" && (
              <div className="flex gap-6 flex-col lg:flex-row">
                {/* Venue floor plan */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl shadow-md border border-rose-100 p-4">
                    {/* Legend */}
                    <div className="flex items-center gap-4 mb-4 text-xs">
                      <span className="font-bold text-slate-600">
                        Seat colours:
                      </span>
                      {(
                        Object.entries(STATUS_COLOUR) as [
                          InviteeStatus,
                          string,
                        ][]
                      ).map(([s, c]) => (
                        <span key={s} className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ background: c }}
                          />
                          {s}
                        </span>
                      ))}
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full inline-block bg-slate-200" />
                        Empty
                      </span>
                      <span className="flex items-center gap-1.5 ml-auto">
                        <span className="w-3 h-3 rounded-full inline-block border-2 border-green-500 bg-transparent" />
                        Confirmed
                      </span>
                    </div>

                    {/* Venue area */}
                    <div className="relative bg-linear-to-b from-emerald-50 to-teal-50 rounded-xl border-2 border-dashed border-teal-200 p-4 min-h-130">
                      {/* Dance floor indicator */}
                      <div className="absolute inset-x-1/3 top-4 bottom-4 rounded-full border-2 border-dashed border-teal-300/60 flex items-center justify-center pointer-events-none">
                        <span className="text-teal-400/70 text-xs font-semibold rotate-0 select-none">
                          💃 Dance Floor
                        </span>
                      </div>

                      {/* Entrance */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 bg-amber-100 border border-amber-300 rounded-t-lg px-4 py-0.5 text-xs font-semibold text-amber-700 z-10">
                        🚪 Entrance
                      </div>

                      {/* Tables grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 relative z-10">
                        {tables.map((t) => {
                          const seated = byTable[t.table_number] ?? [];
                          const isSel = selected?.id === t.id;
                          return (
                            <div
                              key={t.id}
                              onClick={() => setSelected(isSel ? null : t)}
                              className={`cursor-pointer rounded-xl p-2 transition-all ${
                                isSel
                                  ? "ring-2 ring-rose-500 bg-rose-50 shadow-lg scale-105"
                                  : "hover:bg-white/60 hover:shadow"
                              }`}
                            >
                              <div className="w-full aspect-square">
                                {t.shape === "round" ? (
                                  <RoundTableViz table={t} invitees={seated} />
                                ) : (
                                  <RectTableViz table={t} invitees={seated} />
                                )}
                              </div>
                              <div className="mt-1 text-center">
                                <p className="text-xs font-bold text-slate-700 truncate leading-tight">
                                  {t.table_name ?? `Table ${t.table_number}`}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {seated.length}/{t.capacity}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table detail sidebar */}
                <div className="lg:w-72 shrink-0">
                  {selected ? (
                    <div className="bg-white rounded-2xl shadow-md border border-rose-100 p-5 sticky top-24">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-black text-lg text-slate-800">
                            {selected.table_name ??
                              `Table ${selected.table_number}`}
                          </h3>
                          <p className="text-xs text-slate-400">
                            #{selected.table_number} · {selected.shape} ·{" "}
                            {selected.capacity} seats
                          </p>
                        </div>
                        <button
                          onClick={() => setSelected(null)}
                          className="text-slate-300 hover:text-slate-500 text-lg"
                        >
                          ✕
                        </button>
                      </div>

                      {selected.notes && (
                        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-3 italic">
                          {selected.notes}
                        </p>
                      )}

                      {/* Occupancy bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Occupancy</span>
                          <span>
                            {(byTable[selected.table_number] ?? []).length} /{" "}
                            {selected.capacity}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-rose-400 to-pink-500 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, ((byTable[selected.table_number] ?? []).length / selected.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Invitees list */}
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Guests
                      </h4>
                      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                        {(byTable[selected.table_number] ?? []).length === 0 ? (
                          <p className="text-xs text-slate-400 italic">
                            No guests assigned yet.
                          </p>
                        ) : (
                          (byTable[selected.table_number] ?? []).map((inv) => (
                            <div
                              key={inv.id}
                              className="flex items-center gap-2 text-xs bg-slate-50 rounded-lg px-2.5 py-1.5"
                            >
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                  background: STATUS_COLOUR[inv.status],
                                }}
                              />
                              <span className="font-semibold text-slate-700 flex-1 truncate">
                                {inv.full_name}
                              </span>
                              <span className="text-slate-400">
                                {inv.status}
                              </span>
                              {inv.confirmed && (
                                <span
                                  className="text-green-500"
                                  title="Confirmed"
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => openEdit(selected)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteTable(selected.id)}
                          className="flex-1 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/60 rounded-2xl border border-dashed border-rose-200 p-6 text-center sticky top-24">
                      <p className="text-4xl mb-2">🌹</p>
                      <p className="text-sm text-slate-500">
                        Click a table in the venue
                        <br />
                        to see its details
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: "Tables", value: tables.length, icon: "🪑" },
                      {
                        label: "Total Seats",
                        value: tables.reduce((s, t) => s + t.capacity, 0),
                        icon: "💺",
                      },
                      { label: "Seated", value: invitees.length, icon: "👥" },
                      {
                        label: "Confirmed",
                        value: invitees.filter((i) => i.confirmed).length,
                        icon: "✅",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-white rounded-xl shadow-sm border border-rose-50 p-3 text-center"
                      >
                        <div className="text-lg">{s.icon}</div>
                        <div className="text-xl font-black text-slate-800">
                          {s.value}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── LIST VIEW ── */}
            {view === "list" && (
              <div className="space-y-4">
                {tables.length === 0 && (
                  <div className="text-center py-20 text-slate-400">
                    <p className="text-5xl mb-3">🌸</p>
                    <p>No tables yet. Add one above!</p>
                  </div>
                )}
                {tables.map((t) => {
                  const seated = byTable[t.table_number] ?? [];
                  return (
                    <div
                      key={t.id}
                      className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center font-black text-rose-600 text-lg">
                            {t.table_number}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">
                              {t.table_name ?? `Table ${t.table_number}`}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {t.shape === "round" ? "⭕" : "🔲"} {t.shape} ·{" "}
                              {seated.length}/{t.capacity} guests
                              {t.notes && ` · ${t.notes}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(t)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTable(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Occupancy bar */}
                      <div className="px-5 pt-3 pb-1">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-rose-400 to-pink-500 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (seated.length / t.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Invitee chips */}
                      {seated.length > 0 && (
                        <div className="px-5 pb-4 pt-3 flex flex-wrap gap-1.5">
                          {seated.map((inv) => (
                            <span
                              key={inv.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                              style={{ background: STATUS_COLOUR[inv.status] }}
                            >
                              {inv.full_name}
                              {inv.confirmed && (
                                <span className="opacity-80">✓</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}

                      {seated.length === 0 && (
                        <p className="px-5 py-3 text-xs text-slate-400 italic">
                          No guests assigned.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
