import { useState, useEffect } from "react";

const divider = (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      margin: ".2em 0",
      gap: 8,
    }}
  >
    <div
      style={{
        flex: 1,
        height: 1,
        background: "linear-gradient(to right, transparent, #b8972a)",
      }}
    />
    <div style={{ color: "#b8972a", fontSize: 16, lineHeight: 1 }}>✦</div>
    <div
      style={{
        flex: 1,
        height: 1,
        background: "linear-gradient(to left, transparent, #b8972a)",
      }}
    />
  </div>
);

const RingsIcon = () => (
  <svg
    width="56"
    height="40"
    viewBox="0 0 56 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="18"
      cy="20"
      r="14"
      stroke="#b8972a"
      strokeWidth="3"
      fill="none"
    />
    <circle
      cx="38"
      cy="20"
      r="14"
      stroke="#b8972a"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M24 20 Q28 14 32 20"
      stroke="#b8972a"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const ChurchIcon = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="10"
      y="22"
      width="32"
      height="24"
      rx="1"
      stroke="#b8972a"
      strokeWidth="2"
      fill="none"
    />
    <polygon
      points="10,22 26,8 42,22"
      stroke="#b8972a"
      strokeWidth="2"
      fill="none"
      strokeLinejoin="round"
    />
    <rect x="22" y="10" width="8" height="1" fill="#b8972a" />
    <rect x="25" y="7" width="2" height="7" fill="#b8972a" />
    <circle
      cx="26"
      cy="19"
      r="3"
      stroke="#b8972a"
      strokeWidth="1.5"
      fill="none"
    />
    <line x1="23" y1="19" x2="29" y2="19" stroke="#b8972a" strokeWidth="1" />
    <line x1="26" y1="16" x2="26" y2="22" stroke="#b8972a" strokeWidth="1" />
    <rect
      x="20"
      y="33"
      width="12"
      height="13"
      fill="none"
      stroke="#b8972a"
      strokeWidth="1.5"
    />
  </svg>
);

const ChampagneIcon = () => (
  <svg
    width="48"
    height="52"
    viewBox="0 0 48 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 6 L13 22 Q13 30 20 33 L20 46 L14 46"
      stroke="#b8972a"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M30 6 L33 22 Q33 30 26 33 L26 46 L32 46"
      stroke="#b8972a"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <line x1="14" y1="46" x2="32" y2="46" stroke="#b8972a" strokeWidth="2" />
    <path
      d="M14 16 Q23 18 32 16"
      stroke="#b8972a"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="36" cy="18" r="2" fill="#b8972a" opacity="0.7" />
    <circle cx="38" cy="12" r="1.5" fill="#b8972a" opacity="0.5" />
    <circle cx="34" cy="10" r="1" fill="#b8972a" opacity="0.4" />
    <path
      d="M38 20 Q42 15 40 10"
      stroke="#b8972a"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const GiftIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="20"
      width="36"
      height="22"
      rx="2"
      stroke="#b8972a"
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="6"
      y="14"
      width="36"
      height="8"
      rx="1"
      stroke="#b8972a"
      strokeWidth="2"
      fill="none"
    />
    <line x1="24" y1="14" x2="24" y2="42" stroke="#b8972a" strokeWidth="1.5" />
    <path
      d="M24 14 Q18 8 14 10 Q10 12 14 16 Q18 18 24 14Z"
      stroke="#b8972a"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M24 14 Q30 8 34 10 Q38 12 34 16 Q30 18 24 14Z"
      stroke="#b8972a"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

const sections = [
  {
    icon: <RingsIcon />,
    title: "Cérémonie Civile",
    titleStyle: { fontVariant: "small-caps" },
    detail: "10h00 à la salle La Perle Route Kazembe 109473, Q/ Joli Site.",
    hasDivider: true,
  },
  {
    icon: <ChurchIcon />,
    title: "Cérémonie Réligieuse",
    titleStyle: {},
    detail:
      "13h30 à l'église La Parole Éternelle, extension de la Borne à Kolwezi sise avenue des Pins no 117.",
    hasDivider: true,
  },
  {
    icon: <ChampagneIcon />,
    title: "Réception",
    titleStyle: {},
    detail: "19h00 à la salle La Perle, Route Kazzembe 109473, Q/. Joli Site.",
    hasDivider: true,
  },
  {
    icon: <GiftIcon />,
    title: null,
    note: true,
    detail:
      "P.S. : Les mariés se tiendront à l'accueil pour vous recevoir chaleureusement et souhaiteraient recevoir les cadeaux en espèces.",
    hasDivider: false,
  },
];

export default function WeddingProgram() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5ede0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // padding: "32px 16px",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@700&display=swap');
        .prog-section { opacity: 0; transform: translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .prog-visible .prog-section { opacity: 1; transform: translateY(0); }
        .prog-section:nth-child(1) { transition-delay: 0.05s; }
        .prog-section:nth-child(2) { transition-delay: 0.18s; }
        .prog-section:nth-child(3) { transition-delay: 0.31s; }
        .prog-section:nth-child(4) { transition-delay: 0.44s; }
        .prog-section:nth-child(5) { transition-delay: 0.57s; }
      `}</style>
      <div
        className={visible ? "prog-visible" : ""}
        style={{
          background: "",
          maxWidth: 440,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 4px 40px 0 rgba(120,80,20,0.10)",
          padding: "44px 36px 36px",
          boxSizing: "border-box",
        }}
      >
        {/* Title */}
        <div
          className="prog-section sm:mt-[10em]  "
          style={{ textAlign: "center", marginBottom: 12 }}
        >
          <h1
            style={{
              fontFamily: "'Cinzel', 'Georgia', serif",
              //fontSize: ".6em",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#1a1008",
              margin: 0,
              textTransform: "uppercase",
            }}
            className="  sm:text-[.6em]   "
          >
            Le Programme
          </h1>
        </div>

        {sections.map((sec, i) => (
          <div key={i}>
            <div
              className="prog-section"
              style={{
                display: "flex",
                alignItems: sec.note ? "flex-start" : "center",
                gap: 18,
                marginBottom: sec.hasDivider ? 0 : 0,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  flexShrink: 0,
                  //width: 58,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="  sm:w-4  "
              >
                {sec.icon}
              </div>
              <div style={{ flex: 1 }}>
                {sec.title && (
                  <div
                    style={{
                      fontFamily: "'Cinzel', 'Georgia', serif",
                      // fontSize: 18, //".2em",
                      fontWeight: 700,
                      color: "#b8972a",
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                      ...sec.titleStyle,
                    }}
                    className="  sm:text-[6pt]   "
                  >
                    {sec.title}
                  </div>
                )}
                <p
                  style={{
                    //sec.note ? 14.5 : 15.5,
                    color: "#2c1a06",
                    margin: 0,
                    lineHeight: 1.65,
                    textAlign: "center",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400,
                  }}
                  className="  sm:text-[6pt]  "
                >
                  {sec.detail}
                </p>
              </div>
            </div>
            {sec.hasDivider && <div className="prog-section">{divider}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
