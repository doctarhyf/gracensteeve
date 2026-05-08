import Link from "next/link";
import React from "react";

export default function InviteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Menu */}
      <aside
        style={{
          width: "220px",
          padding: "20px",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2 className="text-4xl font-serif italic text-[#c49a1d]">
          Invitee Menu
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/invitee" style={{ fontWeight: "bold" }}>
            Home
          </Link>
          {/* <Link href="/invitee/info">Info</Link> */}
          <Link href="/invitee/list">List</Link>
          <Link href="/invitee/new">New</Link>
        </nav>
      </aside>

      {/* Page Content */}
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
}
