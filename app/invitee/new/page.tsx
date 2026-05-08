"use client";

import { useState } from "react";
import { Plus, Trash2, Heart } from "lucide-react";
import { TInvitee, TInviteeStatus } from "@/lib/types";
import { TABLE_NAMES } from "@/lib/consts";

export default function InviteeForm() {
  const [tableMateInput, setTableMateInput] = useState("");

  const [invitee, setInvitee] = useState<TInvitee>({
    id: crypto.randomUUID(),
    fullName: "",
    tableNumber: 1,
    tableMates: [],
    phoneNumber: "",
    seatNumber: 1,
    confirmed: true,
    createdAt: new Date(),
    status: "Couple",
  });

  const addTableMate = () => {
    if (!tableMateInput.trim()) return;

    setInvitee((prev) => ({
      ...prev,
      tableMates: [...prev.tableMates, tableMateInput],
    }));

    setTableMateInput("");
  };

  const removeTableMate = (name: string) => {
    setInvitee((prev) => ({
      ...prev,
      tableMates: prev.tableMates.filter((mate) => mate !== name),
    }));
  };

  const handleSubmit = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js");

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const { error } = await supabase.from(TABLE_NAMES.INVITEES).insert({
        id: invitee.id,
        full_name: invitee.fullName,
        table_number: invitee.tableNumber,
        table_mates: invitee.tableMates,
        phone_number: invitee.phoneNumber,
        seat_number: invitee.seatNumber,
        qr_code: invitee.qrCode,
        confirmed: invitee.confirmed,
        created_at: invitee.createdAt,
        status: invitee.status,
      });

      if (error) {
        console.error(error);
        alert("Failed to save invitee.");
        return;
      }

      alert("Invitee successfully created!");

      setInvitee({
        id: crypto.randomUUID(),
        fullName: "",
        tableNumber: 1,
        tableMates: [],
        phoneNumber: "",
        seatNumber: 1,
        confirmed: true,
        createdAt: new Date(),
        status: "Couple",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#d9d2c3] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#f4efe7] border border-[#d6c8a8] shadow-2xl rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-8 py-8 text-center border-b border-[#e7d9bb] bg-[#f8f3ea]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-[#c9ae6a]" />
            <Heart size={18} className="fill-[#c9ae6a] text-[#c9ae6a]" />
            <div className="h-px w-16 bg-[#c9ae6a]" />
          </div>

          <h1 className="text-4xl font-serif italic text-[#c49a1d]">
            Wedding Invitee
          </h1>

          <p className="mt-3 text-sm tracking-[0.25em] uppercase text-[#b59a63]">
            Guest Management Form
          </p>
        </div>

        {/* FORM */}
        <div className="p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#7a6340]">
              Full Name
            </label>

            <input
              type="text"
              value={invitee.fullName}
              onChange={(e) =>
                setInvitee({ ...invitee, fullName: e.target.value })
              }
              placeholder="Franvale Mutunda"
              className="w-full rounded-xl border border-[#d9c9a3] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9ae6a]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#7a6340]">
              Status
            </label>

            <select
              value={invitee.status}
              onChange={(e) =>
                setInvitee({
                  ...invitee,
                  status: e.target.value as TInviteeStatus,
                })
              }
              className="w-full rounded-xl border border-[#d9c9a3] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9ae6a]"
            >
              <option value="Mr.">Mr.</option>
              <option value="Mme.">Mme.</option>
              <option value="Couple">Couple</option>
            </select>
          </div>

          {/* Table + Seat */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#7a6340]">
                Table Number
              </label>

              <input
                type="number"
                value={invitee.tableNumber}
                onChange={(e) =>
                  setInvitee({
                    ...invitee,
                    tableNumber: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-[#d9c9a3] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9ae6a]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#7a6340]">
                Seat Number
              </label>

              <input
                type="number"
                value={invitee.seatNumber}
                onChange={(e) =>
                  setInvitee({
                    ...invitee,
                    seatNumber: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-[#d9c9a3] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9ae6a]"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#7a6340]">
              Phone Number
            </label>

            <input
              type="text"
              value={invitee.phoneNumber}
              onChange={(e) =>
                setInvitee({ ...invitee, phoneNumber: e.target.value })
              }
              placeholder="+243..."
              className="w-full rounded-xl border border-[#d9c9a3] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9ae6a]"
            />
          </div>

          {/* RSVP */}
          <div>
            <label className="block mb-3 text-sm font-semibold text-[#7a6340]">
              RSVP Status
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setInvitee({ ...invitee, confirmed: true })}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${
                  invitee.confirmed
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-white border border-[#d9c9a3] text-[#7a6340]"
                }`}
              >
                Confirmed
              </button>

              <button
                type="button"
                onClick={() => setInvitee({ ...invitee, confirmed: false })}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${
                  !invitee.confirmed
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-white border border-[#d9c9a3] text-[#7a6340]"
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Table Mates */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#7a6340]">
              Table Mates
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                value={tableMateInput}
                onChange={(e) => setTableMateInput(e.target.value)}
                placeholder="Add a table mate"
                className="flex-1 rounded-xl border border-[#d9c9a3] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9ae6a]"
              />

              <button
                type="button"
                onClick={addTableMate}
                className="px-5 rounded-xl bg-[#c9ae6a] text-white"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {invitee.tableMates.map((mate) => (
                <div
                  key={mate}
                  className="flex items-center gap-2 bg-[#f8f4ec] border border-[#d9c9a3] rounded-full px-4 py-2 text-sm"
                >
                  {mate}
                  <button
                    type="button"
                    onClick={() => removeTableMate(mate)}
                    className="text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-4 rounded-xl bg-[#c49a1d] py-4 text-white font-semibold shadow-lg"
          >
            Create Invitee
          </button>
        </div>
      </div>
    </div>
  );
}
