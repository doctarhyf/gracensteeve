"use client";

import Link from "next/link";
import React, { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/invitee", label: "Home", exact: true },
  { href: "/invitee/list", label: "List des Invites" },
  { href: "/invitee/new", label: "Ajounter Un invite" },
  { href: "/invitee/tables", label: "Gestion de Tables" },
];

export default function InviteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

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

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navLinks.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontWeight: active ? "700" : "400",
                  color: active ? "#c49a1d" : "inherit",
                  backgroundColor: active ? "#fdf6e3" : "transparent",
                  borderLeft: active ? "3px solid #c49a1d" : "3px solid transparent",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                {label}
              </Link>
            );
          })}
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
