"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Heart, Search } from "lucide-react";
import { TInvitee } from "@/lib/types";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const ITEMS_PER_PAGE = 10;

export default function InviteesTable() {
  const [invitees, setInvitees] = useState<TInvitee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // FETCH
  const loadInvitees = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("invitees")
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
    }));

    setInvitees(formatted);
    setLoading(false);
  };

  useEffect(() => {
    loadInvitees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // DELETE
  const deleteInvitee = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invitee?",
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("invitees").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete invitee.");
      return;
    }

    setInvitees((prev) => prev.filter((i) => i.id !== id));
  };

  // FILTER
  const filteredInvitees = useMemo(() => {
    if (!search.trim()) return invitees;

    const q = search.toLowerCase();

    return invitees.filter((i) => {
      return (
        i.fullName?.toLowerCase().includes(q) ||
        i.phoneNumber?.toLowerCase().includes(q) ||
        String(i.tableNumber).includes(q)
      );
    });
  }, [search, invitees]);

  // STATS
  const stats = useMemo(() => {
    return {
      total: filteredInvitees.length,
      mr: filteredInvitees.filter((i) => i.status === "Mr.").length,
      mme: filteredInvitees.filter((i) => i.status === "Mme").length,
      couple: filteredInvitees.filter((i) => i.status === "Couple").length,
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

            {/* SEARCH */}
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
          </div>

          {/* STATS CARDS */}
          <div className="px-8 pt-6 pb-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e5d8bc] rounded-2xl p-4">
                <p className="text-xs text-[#7a6340] uppercase">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-[#efe7d3] text-left">
                  <th className="px-6 py-5">Guest</th>
                  <th className="px-6 py-5">Table</th>
                  <th className="px-6 py-5">Seat</th>
                  <th className="px-6 py-5">Phone</th>
                  <th className="px-6 py-5">RSVP</th>
                  <th className="px-6 py-5">Table Mates</th>
                  <th className="px-6 py-5">QR Code</th>
                  <th className="px-6 py-5">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedInvitees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      No invitees found.
                    </td>
                  </tr>
                ) : (
                  paginatedInvitees.map((invitee) => (
                    <tr
                      key={invitee.id}
                      className="border-t cursor-pointer hover:border-l-amber-700"
                      onClick={() =>
                        router.push(`/invitee/info?id=${invitee.id}`)
                      }
                    >
                      <td className="px-6 py-5 font-semibold">
                        {invitee.fullName}
                      </td>

                      <td className="px-6 py-5">Table {invitee.tableNumber}</td>

                      <td className="px-6 py-5">{invitee.seatNumber || "—"}</td>

                      <td className="px-6 py-5">
                        {invitee.phoneNumber || "—"}
                      </td>

                      <td className="px-6 py-5">
                        {invitee.confirmed ? "Confirmed" : "Pending"}
                      </td>

                      <td className="px-6 py-5">
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
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => deleteInvitee(invitee.id)}
                          className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-semibold"
                        >
                          Delete
                        </button>
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
    </div>
  );
}
