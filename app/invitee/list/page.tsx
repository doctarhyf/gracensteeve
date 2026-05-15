"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Heart, Search, Pencil, Copy, Check, X, FileDown, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { TInvitee } from "@/lib/types";
import { useRouter } from "next/navigation";
import { TABLE_NAMES } from "@/lib/consts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const ITEMS_PER_PAGE = 20;

export default function InviteesTable() {
  const [invitees, setInvitees] = useState<TInvitee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState("");
  const [confirmedFilter, setConfirmedFilter] = useState<
    "" | "confirmed" | "pending"
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingInvitee, setEditingInvitee] = useState<TInvitee | null>(null);
  const [editForm, setEditForm] = useState<Partial<TInvitee>>({});
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sngTables, setSngTables] = useState<Record<string, any>[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const router = useRouter();

  // FETCH
  const loadInvitees = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from(TABLE_NAMES.INVITEES)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const formatted: TInvitee[] = (data || []).map((item) => ({
      id: item.id,
      fullName: item.full_name,
      tableNumber: item.table_number,
      tableMates: item.table_mates || [],
      phoneNumber: item.phone_number,
      seatNumber: item.seat_number,
      qrCode: item.qr_code,
      confirmed: item.confirmed,
      createdAt: item.created_at,
      status: item.status,
      family: item.family,
    }));

    setInvitees(formatted);
    setLoading(false);
  };

  useEffect(() => {
    loadInvitees();
    loadSngTables();
  }, []);

  const loadSngTables = async () => {
    const { data, error } = await supabase
      .from("sng_tables")
      .select("*")
      .order("table_number", { ascending: true });

    if (error) {
      // try without ordering if column name differs
      const { data: data2, error: error2 } = await supabase
        .from("sng_tables")
        .select("*");

      if (error2) {
        console.error("sng_tables fetch error:", error2);
        return;
      }

      setSngTables(data2 || []);
      return;
    }

    setSngTables(data || []);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, familyFilter, confirmedFilter]);

  // UNIQUE FAMILIES
  const families = useMemo(() => {
    const set = new Set(invitees.map((i) => i.family).filter(Boolean));
    return Array.from(set).sort();
  }, [invitees]);

  // DELETE
  const deleteInvitee = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invitee?",
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from(TABLE_NAMES.INVITEES)
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete invitee.");
      return;
    }

    setInvitees((prev) => prev.filter((i) => i.id !== id));
  };

  // BULK DELETE
  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} invitee(s)?`,
    );
    if (!confirmDelete) return;

    setBulkDeleting(true);
    const ids = Array.from(selectedIds);

    const { error } = await supabase
      .from(TABLE_NAMES.INVITEES)
      .delete()
      .in("id", ids);

    if (error) {
      console.error(error);
      alert("Failed to delete selected invitees.");
      setBulkDeleting(false);
      return;
    }

    setInvitees((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
    setBulkDeleting(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // EDIT
  const openEdit = (invitee: TInvitee) => {
    setEditingInvitee(invitee);
    setEditForm({ ...invitee });
  };

  const saveEdit = async () => {
    if (!editingInvitee) return;
    setSaving(true);

    const { error } = await supabase
      .from(TABLE_NAMES.INVITEES)
      .update({
        full_name: editForm.fullName,
        table_number: editForm.tableNumber,
        seat_number: editForm.seatNumber,
        phone_number: editForm.phoneNumber,
        family: editForm.family,
        status: editForm.status,
        confirmed: editForm.confirmed,
      })
      .eq("id", editingInvitee.id);

    if (error) {
      console.error(error);
      alert("Failed to update invitee.");
      setSaving(false);
      return;
    }

    setInvitees((prev) =>
      prev.map((i) => (i.id === editingInvitee.id ? { ...i, ...editForm } : i)),
    );
    setEditingInvitee(null);
    setSaving(false);
  };

  // COPY LINK
  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`https://gracensteeve.vercel.app/?id=${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // FILTER
  const filteredInvitees = useMemo(() => {
    let result = invitees;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => {
        return (
          i.fullName?.toLowerCase().includes(q) ||
          i.phoneNumber?.toLowerCase().includes(q) ||
          String(i.tableNumber).includes(q)
        );
      });
    }

    if (familyFilter) {
      result = result.filter((i) => i.family === familyFilter);
    }

    if (confirmedFilter === "confirmed") {
      result = result.filter((i) => i.confirmed === true);
    } else if (confirmedFilter === "pending") {
      result = result.filter((i) => !i.confirmed);
    }

    return result;
  }, [search, familyFilter, confirmedFilter, invitees]);

  // STATS
  const stats = useMemo(() => {
    const byFamily: Record<string, number> = {};
    for (const i of filteredInvitees) {
      if (i.family) byFamily[i.family] = (byFamily[i.family] || 0) + 1;
    }
    return {
      total: filteredInvitees.length,
      confirmed: filteredInvitees.filter((i) => i.confirmed === true).length,
      mr: filteredInvitees.filter((i) => i.status === "Mr.").length,
      mme: filteredInvitees.filter((i) => i.status === "Mme.").length,
      couple: filteredInvitees.filter((i) => i.status === "Couple").length,
      byFamily,
    };
  }, [filteredInvitees]);

  // PAGINATION
  const totalPages = Math.ceil(filteredInvitees.length / ITEMS_PER_PAGE);

  const paginatedInvitees = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInvitees.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInvitees, currentPage]);

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const isAllPageSelected =
    paginatedInvitees.length > 0 &&
    paginatedInvitees.every((i) => selectedIds.has(i.id));

  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedInvitees.forEach((i) => next.delete(i.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedInvitees.forEach((i) => next.add(i.id));
        return next;
      });
    }
  };

  const exportToExcel = () => {
    const rows = filteredInvitees.map((i) => ({
      "Full Name": i.fullName,
      Status: i.status,
      Family: i.family,
      Table: i.tableNumber,
      Seat: i.seatNumber,
      Phone: i.phoneNumber,
      RSVP: i.confirmed ? "Confirmed" : "Pending",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invitees");

    // Column widths
    ws["!cols"] = [
      { wch: 28 },
      { wch: 12 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 18 },
      { wch: 12 },
    ];

    const label = [familyFilter || "All", confirmedFilter || "All"].join("_");
    XLSX.writeFile(wb, `invitees_${label}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#d9d2c3] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#f4efe7] border border-[#d6c8a8] rounded-3xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="px-8 py-8 border-b bg-[#f8f3ea] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Heart size={20} className="fill-[#c9ae6a] text-[#c9ae6a]" />
                <p className="uppercase tracking-[0.3em] text-xs text-[#b59a63]">
                  Wedding Dashboard
                </p>
              </div>

              <h1 className="text-4xl font-serif italic text-[#c49a1d]">
                Invitees List
              </h1>
            </div>

            {/* SEARCH + FAMILY FILTER */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-[320px]">
                <Search
                  className="absolute left-3 top-3 text-[#9d8453]"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, phone, table..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#c9ae6a]"
                />
              </div>

              <select
                value={familyFilter}
                onChange={(e) => setFamilyFilter(e.target.value)}
                className="w-full sm:w-45 px-4 py-3 rounded-xl border bg-white text-[#7a6340] outline-none focus:ring-2 focus:ring-[#c9ae6a] cursor-pointer"
              >
                <option value="">All families</option>
                {families.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>

              <select
                value={confirmedFilter}
                onChange={(e) =>
                  setConfirmedFilter(
                    e.target.value as "" | "confirmed" | "pending",
                  )
                }
                className="w-full sm:w-40 px-4 py-3 rounded-xl border bg-white text-[#7a6340] outline-none focus:ring-2 focus:ring-[#c9ae6a] cursor-pointer"
              >
                <option value="">All RSVP</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>

              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#c9ae6a] hover:bg-[#b59a55] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <FileDown size={16} />
                Export Excel
              </button>

              {selectedIds.size > 0 && (
                <button
                  onClick={deleteSelected}
                  disabled={bulkDeleting}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {bulkDeleting ? "Deleting..." : `Delete (${selectedIds.size})`}
                </button>
              )}
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="px-8 pt-6 pb-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white border border-[#e5d8bc] rounded-2xl p-4">
                <p className="text-xs text-[#7a6340] uppercase">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>

              <div className="bg-white border border-[#e5d8bc] rounded-2xl p-4">
                <p className="text-xs text-[#7a6340] uppercase">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>

              <div className="bg-white border border-[#e5d8bc] rounded-2xl p-4">
                <p className="text-xs text-[#7a6340] uppercase">Mr.</p>
                <p className="text-2xl font-bold">{stats.mr}</p>
              </div>

              <div className="bg-white border border-[#e5d8bc] rounded-2xl p-4">
                <p className="text-xs text-[#7a6340] uppercase">Mme</p>
                <p className="text-2xl font-bold">{stats.mme}</p>
              </div>

              <div className="bg-white border border-[#e5d8bc] rounded-2xl p-4">
                <p className="text-xs text-[#7a6340] uppercase">Couple</p>
                <p className="text-2xl font-bold">{stats.couple}</p>
              </div>
            </div>

            {/* FAMILY BREAKDOWN */}
            {Object.keys(stats.byFamily).length > 0 && (
              <div className="mt-4 bg-white border border-[#e5d8bc] rounded-2xl p-4">
                <p className="text-xs text-[#7a6340] uppercase mb-3">
                  By Family
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.byFamily)
                    .sort((a, b) => b[1] - a[1])
                    .map(([family, count]) => (
                      <button
                        key={family}
                        onClick={() =>
                          setFamilyFilter((prev) =>
                            prev === family ? "" : family,
                          )
                        }
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
                          familyFilter === family
                            ? "bg-[#c9ae6a] border-[#c9ae6a] text-white"
                            : "bg-[#fdf9f2] border-[#e5d8bc] text-[#7a6340] hover:border-[#c9ae6a]"
                        }`}
                      >
                        <span>{family}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-lg font-bold ${
                            familyFilter === family
                              ? "bg-white/30 text-white"
                              : "bg-[#efe7d3] text-[#7a6340]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-275">
              <thead>
                <tr className="bg-[#efe7d3] text-left">
                  <th className="px-4 py-5">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-[#c9ae6a] cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-5">No</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Guest</th>
                  <th className="px-6 py-5">Table</th>
                  <th className="px-6 py-5">Seat</th>
                  <th className="px-6 py-5">Phone</th>
                  <th className="px-6 py-5">Family</th>
                  <th className="px-6 py-5">RSVP</th>

                  <th className="px-6 py-5">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-16">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedInvitees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-16">
                      No invitees found.
                    </td>
                  </tr>
                ) : (
                  paginatedInvitees.map((invitee, index) => (
                    <tr
                      key={invitee.id}
                      className={`border-t cursor-pointer hover:border-l-amber-700 ${selectedIds.has(invitee.id) ? "bg-amber-50" : ""}`}
                      onClick={() =>
                        router.push(`/invitee/info?id=${invitee.id}`)
                      }
                    >
                      <td
                        className="px-4 py-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(invitee.id)}
                          onChange={() => toggleSelect(invitee.id)}
                          className="w-4 h-4 accent-[#c9ae6a] cursor-pointer"
                        />
                      </td>

                      <td className="px-6 py-5 text-[#9d8453] text-sm">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {invitee.status}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {invitee.fullName}
                      </td>

                      <td className="px-6 py-5">Table {invitee.tableNumber}</td>

                      <td className="px-6 py-5">{invitee.seatNumber || "—"}</td>

                      <td className="px-6 py-5">
                        {invitee.phoneNumber || "—"}
                      </td>

                      <td className="px-6 py-5">{invitee.family}</td>

                      <td className="px-6 py-5">
                        {invitee.confirmed ? "Confirmed" : "Pending"}
                      </td>

                      {/*  <td className="px-6 py-5">
                        {invitee.tableMates?.join(", ") || "—"}
                      </td>

                      <td className="px-6 py-5">
                        {invitee.qrCode ? (
                          <img
                            alt="Qr Code"
                            src={invitee.qrCode}
                            className="w-12 h-12 border rounded"
                          />
                        ) : (
                          "—"
                        )}
                      </td> */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(invitee);
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-semibold flex items-center gap-1"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyLink(invitee.id);
                            }}
                            className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold flex items-center gap-1"
                          >
                            {copiedId === invitee.id ? (
                              <>
                                <Check size={13} /> Copied
                              </>
                            ) : (
                              <>
                                <Copy size={13} /> Link
                              </>
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteInvitee(invitee.id);
                            }}
                            className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && filteredInvitees.length > 0 && (
            <div className="flex items-center justify-between px-8 py-6 border-t bg-[#f8f3ea]">
              <div className="text-sm text-[#7a6340]">
                Page <b>{currentPage}</b> of <b>{totalPages}</b>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg bg-white disabled:opacity-40"
                >
                  Prev
                </button>

                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg bg-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingInvitee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[#f8f3ea] border border-[#d6c8a8] rounded-3xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#e5d8bc]">
              <h2 className="text-2xl font-serif italic text-[#c49a1d]">
                Edit Invitee
              </h2>
              <button
                onClick={() => setEditingInvitee(null)}
                className="text-[#9d8453] hover:text-[#7a6340]"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="col-span-2">
                <label className="text-xs uppercase text-[#7a6340] mb-1 block">
                  Full Name
                </label>
                <input
                  value={editForm.fullName || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#c9ae6a]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs uppercase text-[#7a6340] mb-1 block">
                  Status
                </label>
                <select
                  value={editForm.status || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      status: e.target.value as TInvitee["status"],
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#c9ae6a]"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mme.">Mme.</option>
                  <option value="Couple">Couple</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Maman">Maman</option>
                  <option value="Honorable">Honorable</option>
                  <option value="Pasteur">Pasteur</option>
                </select>
              </div>

              {/* Family */}
              <div>
                <label className="text-xs uppercase text-[#7a6340] mb-1 block">
                  Family
                </label>
                <select
                  value={editForm.family || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      family: e.target.value as TInvitee["family"],
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#c9ae6a]"
                >
                  <option value="">Select family</option>
                  <option value="NDEMBA">NDEMBA</option>
                  <option value="MUTUNDA">MUTUNDA</option>
                </select>
              </div>

              {/* Table Number */}
              <div>
                <label className="text-xs uppercase text-[#7a6340] mb-1 block">
                  Table
                </label>
                <select
                  value={String(editForm.tableNumber ?? "")}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      tableNumber: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#c9ae6a]"
                >
                  <option value="">Select table</option>
                  {sngTables.map((t) => {
                    const num = t.table_number ?? t.number ?? t.id;
                    const label = t.name
                      ? `Table ${num} — ${t.name}`
                      : `Table ${num}`;
                    return (
                      <option key={t.id} value={String(num)}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Seat Number */}
              <div>
                <label className="text-xs uppercase text-[#7a6340] mb-1 block">
                  Seat Number
                </label>
                <input
                  value={editForm.seatNumber || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      seatNumber: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#c9ae6a]"
                />
              </div>

              {/* Phone */}
              <div className="col-span-2">
                <label className="text-xs uppercase text-[#7a6340] mb-1 block">
                  Phone Number
                </label>
                <input
                  value={editForm.phoneNumber || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#c9ae6a]"
                />
              </div>

              {/* RSVP */}
              <div className="col-span-2 flex items-center gap-3">
                <input
                  id="confirmed"
                  type="checkbox"
                  checked={editForm.confirmed || false}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, confirmed: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#c9ae6a]"
                />
                <label htmlFor="confirmed" className="text-sm text-[#7a6340]">
                  Confirmed (RSVP)
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-[#e5d8bc]">
              <button
                onClick={() => setEditingInvitee(null)}
                className="px-5 py-2.5 rounded-xl border border-[#d6c8a8] text-[#7a6340] hover:bg-[#efe7d3] text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#c9ae6a] text-white hover:bg-[#b59a55] text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
