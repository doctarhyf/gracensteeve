import { Suspense } from "react";
import WeddingTableCard from "./_components/WeddingTableCard";
import { TInvitee } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Server fetch function
async function getInvitee(id: string): Promise<TInvitee | null> {
  const { data, error } = await supabase
    .from("invitees")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return {
    id: data.id,
    fullName: data.full_name,
    tableNumber: data.table_number,
    tableMates: data.table_mates || [],
    phoneNumber: data.phone_number,
    seatNumber: data.seat_number,
    qrCode: data.qr_code,
    confirmed: data.confirmed,
    createdAt: data.created_at,
    status: data.status,
  };
}

// PAGE
export default async function InviteInfo({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  console.log("Current Invitee ID => ", id);

  if (!id) {
    return <div className="p-10">No invitee ID provided</div>;
  }

  const invitee = await getInvitee(id);

  if (!invitee) {
    return <div className="p-10">Invitee not found</div>;
  }

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <WeddingTableCard invitee={invitee} />
    </Suspense>
  );
}
