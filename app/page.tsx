"use client";

import { TABLE_NAMES } from "@/lib/consts";
import { TInvitee } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import QRCode from "react-qr-code";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9002"
    : "https://gracensteeve.vercel.app";

// ── Inner component that uses useSearchParams ──
function WeddingInvitationInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const idIsNull = id === null;

  const [isOpen, setIsOpen] = useState(false);
  const [invitee, setInvitee] = useState<TInvitee | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRsvpDialog, setShowRsvpDialog] = useState(false);
  const [rsvpChoice, setRsvpChoice] = useState<boolean | null>(null);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);

  useEffect(() => {
    const fetchInvitee = async () => {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from(TABLE_NAMES.INVITEES)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setInvitee({
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
        family: data.family,
      });

      setLoading(false);
    };

    fetchInvitee();
  }, [id]);

  if (loading && !idIsNull) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e0ce] text-[#5a4a2a]">
        Loading invitation...
      </div>
    );
  }

  if (!invitee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8e0ce] text-center px-6">
        {/* Sad Icon */}
        <div className="mb-6">
          <svg
            width="90"
            height="90"
            viewBox="0 0 24 24"
            fill="none"
            className="text-red-500"
          >
            <path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 15s1.5-2 4-2 4 2 4 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M9 9h.01M15 9h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops… invitation not found
        </h1>

        <p className="text-gray-700 max-w-md">
          It looks like this link might be broken or incomplete. Please
          double-check the invitation URL or ask the host to resend it.
        </p>

        <p className="mt-4 text-sm text-gray-600">
          If you believe this is a mistake, kindly reach out to the event
          organizer.
        </p>
      </div>
    );
  }

  function onConfirm() {
    setRsvpChoice(null);
    setShowRsvpDialog(true);
  }

  async function submitRsvp() {
    if (rsvpChoice === null || !id) return;
    setRsvpSubmitting(true);

    const { error } = await supabase
      .from(TABLE_NAMES.INVITEES)
      .update({ confirmed: rsvpChoice })
      .eq("id", id);

    if (!error) {
      setInvitee((prev) => (prev ? { ...prev, confirmed: rsvpChoice } : prev));
      setShowRsvpDialog(false);
    }
    setRsvpSubmitting(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        .wi-scene {
          min-height: 100dvh;
          background: #e8e0ce;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Cormorant Garamond', serif;
        }

        /* ── Controls ── */
        .wi-controls {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .wi-btn {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          padding: 0.5rem 1.4rem;
          border: 1px solid rgba(140,110,50,0.5);
          background: transparent;
          color: #5a4a2a;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .wi-btn:hover { background: rgba(184,150,12,0.1); }
        .wi-btn.active { background: #b8960c; color: #fff; border-color: #b8960c; }

        /* ── Perspective wrapper ── */
        .wi-perspective {
          perspective: 1800px;
          width: min(560px, 100%);
        }

        /* ── Card base ── */
        .wi-card {
          position: relative;
          width: 100%;
          aspect-ratio: 560 / 380;
          background: #f5f0e8;
          border-radius: 4px;
          box-shadow:
            0 2px 8px rgba(0,0,0,0.10),
            0 12px 40px rgba(0,0,0,0.16);
          display: flex;
          overflow: hidden;
        }
        .wi-card::after {
         /*  content: '';
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          width: 1px;
          background: rgba(140,110,50,0.22);
          z-index: 5;
          pointer-events: none; */
        }

        /* ── Inside panels ── */
        .wi-panel {
          width: 50%;
          height: 100%;
          padding: clamp(12px, 3%, 24px) clamp(10px, 3%, 22px);
          display: flex;
          flex-direction: column;
        }
        .wi-panel-left {
          border-right: 1px dashed rgba(140,110,50,0.18);
          gap: clamp(4px, 1.2%, 8px);
        }
        .wi-panel-right {
          background: #ece5d0;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2%, 14px);
        }

        /* Inside left copy */
        .wi-inside-hdr {
          font-size: clamp(6px, 1.1vw, 8px);
          letter-spacing: 0.18em;
          color: #8a7040;
          text-transform: uppercase;
          text-align: center;
        }
        .wi-names {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(12px, 2.8vw, 19px);
          color: #b8960c;
          text-align: center;
          line-height: 1.25;
        }
        .wi-amp {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 3.2vw, 23px);
          color: #b8960c;
          display: block;
          text-align: center;
          margin: -1px 0;
        }
        .wi-gold-rule {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wi-gold-line { flex: 1; height: 0.5px; background: #b8960c; opacity: 0.5; }
        .wi-heart { color: #b8960c; font-size: 9px; }
        .wi-invite-label {
          font-size: clamp(6px, 1vw, 8px);
          letter-spacing: 0.1em;
          color: #8a7040;
          text-align: center;
        }
        .wi-invite-body {
          font-size: clamp(8px, 1.6vw, 11px);
          color: #3a2e18;
          text-align: center;
          line-height: 1.7;
        }
        .wi-date-block { text-align: center; margin-top: 2px; }
        .wi-date-label { font-size: clamp(7px, 1.2vw, 9px); color: #6a5530; }
        .wi-date-main {
          font-family: 'Playfair Display', serif;
          font-size: clamp(11px, 2.2vw, 16px);
          font-weight: 600;
          color: #b8960c;
          display: block;
        }
        .wi-date-venue {
          font-size: clamp(9px, 1.8vw, 12px);
          font-weight: 600;
          color: #3a2e18;
          letter-spacing: 0.04em;
        }

        /* Inside right RSVP */
        .wi-rsvp-box {
          width: 100%;
          border: 0.5px solid rgba(184,150,12,0.4);
          padding: clamp(8px, 2%, 14px) clamp(6px, 2%, 12px);
          text-align: center;
          background: rgba(255,255,255,0.35);
        }
        .wi-rsvp-title {
          font-size: clamp(7px, 1.2vw, 10px);
          letter-spacing: 0.14em;
          color: #8a7040;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }
        .wi-rsvp-line {
          width: 100%;
          border-bottom: 0.5px solid rgba(140,110,50,0.4);
          font-size: clamp(8px, 1.4vw, 11px);
          color: #3a2e18;
          margin-bottom: 7px;
          display: block;
          padding: 1px 0;
        }
        .wi-attend-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 4px;
        }
        .wi-attend-opt {
          font-size: clamp(7px, 1.2vw, 10px);
          color: #6a5530;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .wi-attend-opt::before {
          content: '';
          width: 9px; height: 9px;
          border: 0.5px solid #b8960c;
          display: inline-block;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .wi-verse {
          font-style: italic;
          font-size: clamp(7px, 1.2vw, 10px);
          color: #6a5530;
          text-align: center;
          line-height: 1.7;
          padding: 0 4px;
        }
        .wi-ornament {
          color: #b8960c;
          font-size: clamp(10px, 1.6vw, 14px);
          opacity: 0.6;
        }

        /* ── Front cover flap ── */
        .wi-flap {
          position: absolute;
          top: 0; left: 0;
          width: 50%;
          height: 100%;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 0.95s cubic-bezier(0.645, 0.045, 0.355, 1.0);
          z-index: 20;
        }
        .wi-flap.open { transform: rotateY(-170deg); }

        .wi-cover-front,
        .wi-cover-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          border-radius: 4px 0 0 4px;
        }
        .wi-cover-front {
          background: #f0eadb;
          padding: clamp(10px, 3%, 22px) clamp(8px, 2.5%, 18px);
          display: flex;
          flex-direction: column;
        }
        .wi-cover-back {
          background: #f5f0e8;
          transform: rotateY(180deg);
          border-radius: 0 4px 4px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Decorative borders on front cover */
        .wi-cborder {
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(184,150,12,0.42);
          border-radius: 2px;
          pointer-events: none;
        }
        .wi-cborder-inner {
          position: absolute;
          inset: 12px;
          border: 0.5px solid rgba(184,150,12,0.22);
          border-radius: 2px;
          pointer-events: none;
        }

        /* Cover typography */
        .wi-cover-edition {
          font-size: clamp(5px, 0.9vw, 7px);
          letter-spacing: 0.2em;
          color: #5a4a2a;
          text-transform: uppercase;
          text-align: center;
          display: block;
        }
        .wi-cover-masthead {
          font-family: 'UnifrakturMaguntia', cursive;
          font-size: clamp(14px, 3.5vw, 22px);
          color: #2a1f0a;
          text-align: center;
          line-height: 1;
          margin: 3px 0;
        }
        .wi-cover-date {
          font-size: clamp(6px, 1vw, 8.5px);
          letter-spacing: 0.12em;
          color: #5a4a2a;
          text-align: center;
        }
        .wi-cover-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #b8960c 40%, #b8960c 60%, transparent);
          margin: 3px 0;
          opacity: 0.55;
        }
        .wi-cover-headline {
          font-family: 'UnifrakturMaguntia', cursive;
          font-size: clamp(20px, 5.5vw, 34px);
          color: #1a1208;
          line-height: 1.05;
          margin: 4px 0 6px;
        }
        .wi-photo-frame {
          flex: 1;
          min-height: 0;
          background: linear-gradient(160deg, #c4905a, #8b5e3c);
          border: 2px solid rgba(184,150,12,0.5);
          margin: 0 auto;
          width: 72%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .wi-cover-byline {
          font-size: clamp(5.5px, 0.9vw, 7.5px);
          letter-spacing: 0.14em;
          color: #6a5030;
          text-transform: uppercase;
          text-align: center;
          margin-top: 5px;
        }

        /* Cover back watermark */
        .wi-back-wm {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.4;
        }
        .wi-back-wm-logo {
          font-family: 'UnifrakturMaguntia', cursive;
          font-size: clamp(20px, 4vw, 30px);
          color: #b8960c;
        }
        .wi-back-wm-line { width: 50px; height: 0.5px; background: #b8960c; }
        .wi-back-wm-text {
          font-style: italic;
          font-size: clamp(8px, 1.2vw, 10px);
          color: #8a7040;
          text-align: center;
          line-height: 1.6;
        }

        /* ── Hint caption ── */
        .wi-hint {
          margin-top: 1.5rem;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          color: #7a6540;
          text-align: center;
        }

        /* ── MOBILE: portrait stacked layout ── */
        @media (max-width: 600px) {
          .wi-scene {
            padding: 1.5rem 0.75rem;
            justify-content: flex-start;
            padding-top: 2rem;
          }
          .wi-perspective {
            width: 100%;
            perspective: 1200px;
          }
          .wi-card {
            flex-direction: column;
            aspect-ratio: unset;
            min-height: 85dvh;
            border-radius: 6px;
          }
          .wi-card::after {
            left: 0; right: 0; top: 50%; bottom: auto;
            width: 100%; height: 1px;
          }
          .wi-panel {
            width: 100%;
            height: auto;
            flex: 1;
            padding: 20px 22px;
            gap: 10px;
          }
          .wi-panel-left {
            border-right: none;
            border-bottom: 1px dashed rgba(140,110,50,0.18);
          }
          .wi-panel-right { justify-content: center; }
          .wi-inside-hdr { font-size: 11px; letter-spacing: 0.15em; text:center }
          .wi-names { font-size: 26px; line-height: 1.3; }
          .wi-amp { font-size: 30px; margin: 2px 0; }
          .wi-heart { font-size: 13px; }
          .wi-invite-label { font-size: 13px; letter-spacing: 0.08em; }
          .wi-invite-body { font-size: 15px; line-height: 1.85; }
          .wi-date-label { font-size: 13px; display: block; margin-bottom: 2px; }
          .wi-date-main { font-size: 22px; }
          .wi-date-venue { font-size: 16px; }
          .wi-rsvp-box { padding: 14px 16px; }
          .wi-rsvp-title { font-size: 13px; letter-spacing: 0.16em; margin-bottom: 12px; }
          .wi-rsvp-line { font-size: 14px; margin-bottom: 10px; padding: 3px 0; }
          .wi-attend-opt { font-size: 14px; gap: 6px; }
          .wi-attend-opt::before { width: 13px; height: 13px; }
          .wi-verse { font-size: 14px; line-height: 1.85; }
          .wi-ornament { font-size: 18px; }
          .wi-flap {
            width: 100%;
            height: 100%;
            top: 0; left: 0;
            transform-origin: top center;
            z-index: 20;
          }
          .wi-flap.open { transform: rotateX(170deg); }
          .wi-cover-front,
          .wi-cover-back { border-radius: 6px 6px 0 0; }
          .wi-cover-back {
            transform: rotateX(-180deg);
            border-radius: 0 0 6px 6px;
          }
          .wi-cover-front { padding: 18px 20px; gap: 0; }
          .wi-cover-edition { font-size: 9px; }
          .wi-cover-masthead { font-size: 20px; margin: 4px 0; }
          .wi-cover-date { font-size: 10px; }
          .wi-cover-rule { margin: 5px 0; }
          .wi-cover-headline { font-size: 36px; margin: 4px 0 8px; }
          .wi-photo-frame { flex: 1; width: 94%; min-height: 0; aspect-ratio: unset; }
          .wi-cover-byline { font-size: 9px; margin-top: 8px; }
          .wi-back-wm-logo { font-size: 32px; }
          .wi-back-wm-text { font-size: 13px; }
          .wi-controls { margin-bottom: 1.25rem; }
          .wi-btn { font-size: 1rem; padding: 0.6rem 1.6rem; }
          .wi-hint { font-size: 0.9rem; margin-top: 1rem; }
        }
        /* ── RSVP Dialog ── */
        .rsvp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(30, 22, 8, 0.55);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
          animation: rsvp-fade-in 0.3s ease;
        }
        @keyframes rsvp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .rsvp-card {
          background: #f5f0e6;
          width: min(480px, 100%);
          border-radius: 4px;
          padding: 2.5rem 2.25rem 2rem;
          position: relative;
          box-shadow: 0 8px 40px rgba(0,0,0,0.22);
          animation: rsvp-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1);
          font-family: 'Cormorant Garamond', serif;
        }
        @keyframes rsvp-slide-up {
          from { transform: translateY(28px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        /* botanical corner SVG decoration */
        .rsvp-leaf {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 130px;
          pointer-events: none;
          opacity: 0.85;
        }
        .rsvp-border {
          position: absolute;
          inset: 10px;
          border: 0.75px solid rgba(184,150,12,0.35);
          border-radius: 2px;
          pointer-events: none;
        }
        .rsvp-script {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: #8a7040;
          margin-bottom: 0.15rem;
          display: block;
        }
        .rsvp-heading {
          font-family: 'Playfair Display', serif;
          font-size: 3.2rem;
          font-weight: 400;
          letter-spacing: 0.14em;
          color: #2a1f0a;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .rsvp-subtitle {
          font-style: italic;
          font-size: 1rem;
          color: #6a5530;
          letter-spacing: 0.02em;
          margin-bottom: 1.6rem;
        }
        .rsvp-rule {
          width: 100%;
          height: 0.5px;
          background: linear-gradient(90deg, transparent, #b8960c 30%, #b8960c 70%, transparent);
          opacity: 0.5;
          margin-bottom: 1.6rem;
        }
        .rsvp-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.8rem;
        }
        .rsvp-option {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          padding: 0.55rem 0.75rem;
          border: 0.75px solid rgba(184,150,12,0.25);
          border-radius: 2px;
          transition: background 0.2s, border-color 0.2s;
          background: transparent;
          font-family: 'Cormorant Garamond', serif;
          text-align: left;
        }
        .rsvp-option:hover {
          background: rgba(184,150,12,0.07);
        }
        .rsvp-option.selected {
          background: rgba(184,150,12,0.12);
          border-color: #b8960c;
        }
        .rsvp-checkbox {
          width: 16px;
          height: 16px;
          border: 1px solid #b8960c;
          border-radius: 1px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .rsvp-option.selected .rsvp-checkbox {
          background: #b8960c;
        }
        .rsvp-option-text {
          font-size: 0.85rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #3a2e18;
        }
        .rsvp-divider-line {
          width: 100%;
          height: 0.5px;
          background: rgba(140,110,50,0.25);
          margin-bottom: 1.4rem;
          border: none;
        }
        .rsvp-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
        .rsvp-btn-cancel {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.55rem 1.3rem;
          border: 0.75px solid rgba(140,110,50,0.4);
          background: transparent;
          color: #6a5530;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .rsvp-btn-cancel:hover { background: rgba(140,110,50,0.07); }
        .rsvp-btn-confirm {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.55rem 1.5rem;
          background: #2a1f0a;
          color: #e8dfc8;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }
        .rsvp-btn-confirm:disabled { opacity: 0.45; cursor: default; }
        .rsvp-btn-confirm:not(:disabled):hover { background: #3d2e10; }

        /* Done state */
        .rsvp-done {
          text-align: center;
          padding: 0.5rem 0 1rem;
        }
        .rsvp-done-icon {
          font-size: 2.4rem;
          color: #b8960c;
          margin-bottom: 0.6rem;
          display: block;
        }
        .rsvp-done-title {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.6rem;
          color: #2a1f0a;
          margin-bottom: 0.4rem;
        }
        .rsvp-done-sub {
          font-style: italic;
          font-size: 0.95rem;
          color: #6a5530;
        }
      `}</style>

      <div className="wi-scene">
        <div className="wi-controls">
          {/* <button
            className={`wi-btn${!isOpen ? " active" : ""}`}
            onClick={() => setIsOpen(false)}
          > removed
            Closed
          </button> */}
          <button
            className={`wi-btn${isOpen ? " active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Fermer " : "Ouvrir "} l'invitation
          </button>
        </div>

        <div className="wi-perspective">
          <div className="wi-card">
            {/* ── Inside LEFT panel ── */}
            <div className="wi-panel wi-panel-left">
              <div className="wi-inside-hdr ">
                Wedding Daily · Special Edition
              </div>

              <div className="wi-gold-rule">
                <div className="wi-gold-line" />
                <span className="wi-heart">♥</span>
                <div className="wi-gold-line" />
              </div>

              <div className="wi-names">
                Grace Mutunda
                <span className="wi-amp">&amp;</span>
                Steeve Ndemba
              </div>

              <div className="wi-gold-rule">
                <div className="wi-gold-line" />
                <span className="wi-heart">♥</span>
                <div className="wi-gold-line" />
              </div>

              <div className="wi-invite-label">
                Mr / Mme / Couple :{" "}
                <span className="underline">{invitee.fullName}</span>
              </div>

              <div className="wi-invite-body">
                C&apos;est avec beaucoup de joie,
                <br />
                d&apos;amour et d&apos;estime
                <br />
                que les familles
                <br />
                <strong>Émile Mutunda</strong> et
                <br />
                <strong>Jean-Robert Ndemba</strong>
                <br />
                vous convient au mariage de
                <br />
                leurs enfants
              </div>

              <div className="wi-date-block">
                <span className="wi-date-label">Le Samedi</span>
                <span className="wi-date-main">06 Juin 2026</span>
                <span className="wi-date-venue">à Kolwezi.</span>
              </div>

              <div className="wi-gold-rule" style={{ marginTop: "4px" }}>
                <div className="wi-gold-line" />
                <span className="wi-heart" style={{ fontSize: "8px" }}>
                  ✦
                </span>
                <div className="wi-gold-line" />
              </div>
            </div>

            {/* ── Inside RIGHT panel ── */}
            <div className="wi-panel wi-panel-right">
              {/*  <div className=" flex justify-center items-center fixed bottom-2 right-2 ">
                <Image
                  alt="Qr"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${invitee.id}`}
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                 
                  width={45}
                  height={45}
                />
              </div> */}

              {/*  <div className="absolute bottom-3 right-3 bg-white p-2 rounded-lg shadow-md">
                <QRCode
                  size={60}
                  value={`${baseUrl}/invitee/info?id=${invitee.id}`}
                />
                <p className="text-[8px] text-center mt-1 text-gray-500">
                  Scan RSVP
                </p>
              </div> */}

              <div className="wi-photo-frame">
                <Image
                  src="/right.jpeg"
                  alt="Wedding photo"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  sizes="(max-width: 600px) 58vw, 200px"
                />
              </div>

              <div className="wi-verse">
                &ldquo;Ce que Dieu a uni,
                <br />
                que l&apos;homme ne le sépare pas.&rdquo;
                <br />— Marc 10 : 9
              </div>

              <div className="wi-ornament">✦ ❧ ✦</div>
            </div>

            {/* ── Front cover flap ── */}
            <div className={`wi-flap${isOpen ? " open" : ""}`}>
              <div className="wi-cover-front">
                <div className="wi-cborder" />
                <div className="wi-cborder-inner" />

                <span className="wi-cover-edition">
                  Our Special Edition · A Love Story Worth Celebrating
                </span>
                <div className="wi-cover-rule" />
                <div className="wi-cover-masthead">The Big News</div>
                <div className="wi-cover-rule" />
                <span className="wi-cover-date">06.06.2026</span>

                <div className="wi-cover-headline flex justify-center">
                  Wedding Daily
                </div>

                <div className="wi-photo-frame">
                  <Image
                    src="/front.jpeg"
                    alt="Wedding photo"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    sizes="(max-width: 600px) 58vw, 200px"
                  />
                </div>

                {invitee?.confirmed ? (
                  <p
                    className="text-center mx-auto my-2 text-xs uppercase"
                    style={{
                      color: "#16a34a",
                      fontFamily: "'Cormorant Garamond', serif",
                      letterSpacing: "0.12em",
                      fontWeight: 600,
                    }}
                  >
                    ❖ See you there!
                  </p>
                ) : (
                  <button
                    className={
                      " bg-emerald-600 mx-auto my-2 text-sm max-w-fit text-emerald-300 rounded-md p-2 cursor-pointer animate-bounce  "
                    }
                    onClick={() => onConfirm()}
                  >
                    Confirmer RSVP
                  </button>
                )}

                <div className="wi-cover-byline">
                  Grace Mutunda &amp; Steeve Ndemba
                </div>
              </div>

              <div className="wi-cover-back">
                <div className="wi-back-wm">
                  <div className="wi-back-wm-logo">WD</div>
                  <div className="wi-back-wm-line" />
                  <div className="wi-back-wm-text">
                    Wedding Daily
                    <br />
                    06.06.2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="wi-hint">
          {isOpen
            ? "The invitation is open — all details inside"
            : 'Click "Open" to unfold the invitation'}
        </p>
        <p className=" flex space-x-2 mt-2 ring-0  ">
          <span>Copyright &copy; 2026 DayOne </span>
          <Image
            alt="DayOne"
            src={"/dayone.jpg"}
            width={102 * 0.75}
            height={40 * 0.75}
          />{" "}
        </p>

        <div className=" mt-4 bg-white p-2 rounded-lg shadow-md">
          <QRCode
            size={80}
            value={`${baseUrl}/invitee/info?id=${invitee.id}`}
          />
          <p className="text-[8px] text-center mt-1 text-gray-500">Scan RSVP</p>
        </div>
      </div>
      {/* ── RSVP Confirmation Dialog ── */}
      {showRsvpDialog && (
        <div
          className="rsvp-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !rsvpSubmitting)
              setShowRsvpDialog(false);
          }}
        >
          <div className="rsvp-card">
            <div className="rsvp-border" />

            {/* Botanical corner decoration */}
            <svg
              className="rsvp-leaf"
              viewBox="0 0 160 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M155 5 C130 10, 100 20, 80 45 C65 63, 60 85, 70 105"
                stroke="#2a1f0a"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M80 45 C95 35, 118 28, 138 18"
                stroke="#2a1f0a"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M138 18 C128 24, 120 32, 118 42 C116 50, 120 56, 128 52 C136 48, 140 38, 138 18Z"
                stroke="#2a1f0a"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M100 32 C92 40, 88 52, 90 62 C92 70, 98 72, 104 66 C110 60, 110 46, 100 32Z"
                stroke="#2a1f0a"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M80 45 C72 55, 68 68, 72 80"
                stroke="#2a1f0a"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M72 80 C62 72, 54 62, 56 50 C58 40, 66 38, 72 44 C78 50, 78 64, 72 80Z"
                stroke="#2a1f0a"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M72 80 C80 74, 90 72, 98 76 C104 80, 104 88, 96 90 C88 92, 78 88, 72 80Z"
                stroke="#2a1f0a"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M70 105 C65 95, 64 82, 70 72"
                stroke="#2a1f0a"
                strokeWidth="1"
                fill="none"
              />
            </svg>

            {!invitee?.confirmed ? (
              <>
                <span className="rsvp-script">Veuillez</span>
                <div className="rsvp-heading">RSVP</div>
                <p className="rsvp-subtitle">
                  Veuillez répondre avant le 31 mai — {invitee?.fullName}
                </p>

                <div className="rsvp-rule" />

                <div className="rsvp-options">
                  <button
                    className={`rsvp-option${rsvpChoice === true ? " selected" : ""}`}
                    onClick={() => setRsvpChoice(true)}
                  >
                    <div className="rsvp-checkbox">
                      {rsvpChoice === true && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4l2.5 2.5L9 1"
                            stroke="#f5f0e6"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="rsvp-option-text">
                      OUI ! JE NE MANQUERAIS ÇA POUR RIEN AU MONDE !
                    </span>
                  </button>

                  <button
                    className={`rsvp-option${rsvpChoice === false ? " selected" : ""}`}
                    onClick={() => setRsvpChoice(false)}
                  >
                    <div className="rsvp-checkbox">
                      {rsvpChoice === false && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4l2.5 2.5L9 1"
                            stroke="#f5f0e6"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="rsvp-option-text">
                      NON. DÉSOLÉ(E) DE MANQUER ÇA !
                    </span>
                  </button>
                </div>

                <hr className="rsvp-divider-line" />

                <div className="rsvp-actions">
                  <button
                    className="rsvp-btn-cancel"
                    onClick={() => setShowRsvpDialog(false)}
                    disabled={rsvpSubmitting}
                  >
                    Annuler
                  </button>
                  <button
                    className="rsvp-btn-confirm"
                    onClick={submitRsvp}
                    disabled={rsvpChoice === null || rsvpSubmitting}
                  >
                    {rsvpSubmitting ? "Envoie..." : "Confirmer"}
                  </button>
                </div>
              </>
            ) : (
              <div className="rsvp-done">
                <span className="rsvp-done-icon">
                  {invitee?.confirmed ? "❖" : "❧"}
                </span>
                <div className="rsvp-done-title">
                  {invitee?.confirmed ? "See you there!" : "We'll miss you!"}
                </div>
                <p className="rsvp-done-sub">
                  {invitee?.confirmed
                    ? "Your attendance has been confirmed. We can’t wait to celebrate with you."
                    : "Thank you for letting us know. You’ll be in our hearts on the day."}
                </p>
                <div className="rsvp-rule" style={{ marginTop: "1.2rem" }} />
                <button
                  className="rsvp-btn-confirm"
                  style={{ marginTop: "0.5rem" }}
                  onClick={() => setShowRsvpDialog(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Default export wraps inner component in Suspense ──
export default function WeddingInvitation() {
  return (
    <Suspense fallback={null}>
      <WeddingInvitationInner />
    </Suspense>
  );
}
