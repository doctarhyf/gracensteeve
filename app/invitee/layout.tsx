"use client";

import Link from "next/link";
import React, { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function InviteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: open ? "220px" : "0px",
          minWidth: open ? "220px" : "0px",
          overflow: "hidden",
          transition: "min-width 0.25s ease, width 0.25s ease",
          borderRight: open ? "1px solid #ddd" : "none",
          padding: open ? "20px" : "0",
          whiteSpace: "nowrap",
        }}
      >
        <h2 className="text-4xl font-serif italic text-[#c49a1d] mb-6">
          Invitee Menu
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/invitee" style={{ fontWeight: "bold" }}>
            Home
          </Link>
          <Link href="/invitee/list">List des Invites</Link>
          <Link href="/invitee/new">Ajounter Un invite</Link>
          <Link href="/invitee/tables">Gestion de Tables</Link>
        </nav>
      </aside>

      {/* Page Content */}
      <main style={{ flex: 1, padding: "20px", position: "relative" }}>
        {/* Toggle Button */}
        <button
          onClick={() => setOpen((o) => !o)}
          title={open ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#c49a1d",
            padding: "4px",
          }}
        >
          {open ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}
        </button>

        {/* Offset content so toggle doesn't overlap */}
        <div style={{ paddingTop: "48px" }}>{children}</div>
      </main>
    </div>
  );
}
