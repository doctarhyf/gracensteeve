"use client";

import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";
import { TInvitee } from "@/lib/types";

type Props = {
  invitee: TInvitee;
};

export default function WeddingTableCard({ invitee }: Props) {
  return (
    <div className="min-h-screen bg-[#d9d2c3] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-[#f4efe7] rounded-sm shadow-2xl overflow-hidden border border-[#d6c8a8]">
        <div className="grid md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative px-10 py-12 md:px-14 flex flex-col justify-between">
            {/* Decorative center line */}
            <div className="absolute right-0 top-0 h-full border-r border-dashed border-[#d4c4a1]" />

            <div>
              {/* Header */}
              <div className="text-center">
                <p className="tracking-[0.35em] text-[11px] uppercase text-[#b59a63]">
                  Wedding Reception • Special Edition
                </p>

                <div className="flex items-center gap-4 my-5">
                  <div className="h-px flex-1 bg-[#c9ae6a]" />
                  <Heart size={14} className="fill-[#c9ae6a] text-[#c9ae6a]" />
                  <div className="h-px flex-1 bg-[#c9ae6a]" />
                </div>

                <h1 className="font-serif text-5xl leading-tight text-[#c49a1d] italic">
                  Grace Mutunda
                </h1>

                <div className="text-[#c49a1d] text-4xl my-3 font-serif">&</div>

                <h1 className="font-serif text-5xl leading-tight text-[#c49a1d] italic">
                  Steve Ndemba
                </h1>

                <div className="flex items-center gap-4 mt-5">
                  <div className="h-px flex-1 bg-[#c9ae6a]" />
                  <Heart size={14} className="fill-[#c9ae6a] text-[#c9ae6a]" />
                  <div className="h-px flex-1 bg-[#c9ae6a]" />
                </div>
              </div>

              {/* Table Info */}
              <div className="mt-12">
                <div className="bg-[#f8f4ec] border border-[#d9c9a3] rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <tbody>
                      {/* Guest */}
                      <tr className="border-b border-[#e5d8bc]">
                        <td className="px-5 py-4 font-semibold text-[#7a6340] w-1/3">
                          Guest
                        </td>

                        <td className="px-5 py-4 text-[#4b3d29]">
                          {invitee.status} {invitee.fullName}
                        </td>
                      </tr>

                      <tr className="border-b border-[#e5d8bc]">
                        <td className="px-5 py-4 font-semibold text-[#7a6340] w-1/3">
                          Phone
                        </td>

                        <td className="px-5 py-4 text-[#4b3d29]">
                          {invitee.phoneNumber}
                        </td>
                      </tr>

                      {/* Table */}
                      <tr className="border-b border-[#e5d8bc]">
                        <td className="px-5 py-4 font-semibold text-[#7a6340]">
                          Table
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#c9ae6a] text-white font-semibold">
                            Table{" "}
                            {invitee.tableNumber.toString().padStart(2, "0")}
                          </span>
                        </td>
                      </tr>

                      {/* Seat Number */}
                      {invitee.seatNumber && (
                        <tr className="border-b border-[#e5d8bc]">
                          <td className="px-5 py-4 font-semibold text-[#7a6340]">
                            Seat
                          </td>

                          <td className="px-5 py-4 text-[#4b3d29]">
                            Seat {invitee.seatNumber}
                          </td>
                        </tr>
                      )}

                      {/* RSVP */}
                      <tr className="border-b border-[#e5d8bc]">
                        <td className="px-5 py-4 font-semibold text-[#7a6340]">
                          RSVP
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              invitee.confirmed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {invitee.confirmed ? "Confirmed" : "Pending"}
                          </span>
                        </td>
                      </tr>

                      {/* Table Mates */}
                      <tr>
                        <td className="px-5 py-4 font-semibold text-[#7a6340] align-top">
                          Table Mates
                        </td>

                        <td className="px-5 py-4 text-[#4b3d29] leading-8">
                          {invitee.tableMates.map((mate) => (
                            <div key={mate}>• {mate}</div>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-12 text-center">
                <p className="italic text-[#9d8453] text-lg font-serif">
                  “Ce que Dieu a uni,
                  <br />
                  que l’homme ne sépare pas.”
                </p>

                <p className="mt-3 text-[#b59a63] text-sm">— Marc 10 : 9</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
              <div className="flex items-center justify-center gap-3 text-[#c9ae6a]">
                <Sparkles size={16} />

                <Heart size={14} className="fill-[#c9ae6a] text-[#c9ae6a]" />

                <Sparkles size={16} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE  OK */}
          <div className="bg-[#efe7d3] flex items-center justify-center p-8 md:p-12">
            <div className="relative w-full max-w-sm aspect-3/4 border-4 border-[#b98a1c] shadow-xl overflow-hidden">
              <Image
                src="/right.jpeg"
                alt="Wedding couple"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
