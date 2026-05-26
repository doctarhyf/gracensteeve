import { useState, useEffect } from "react";

const Divider = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      margin: "10px 0",
      color: "#b8974a",
    }}
  >
    <div
      style={{
        flex: 1,
        height: "1px",
        background: "linear-gradient(to right, transparent, #b8974a)",
      }}
    />
    <span style={{ fontSize: "10px" }}>✦</span>
    <div
      style={{
        flex: 1,
        height: "1px",
        background: "linear-gradient(to left, transparent, #b8974a)",
      }}
    />
  </div>
);

export default function WeddingInvitation() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        background: "#f5f0e8",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: "11px",
      }}
    >
      <div
        style={{
          background: "#f9f5ed",
          maxWidth: "360px",
          width: "100%",
          border: "1px solid #d4b87a",
          boxShadow: "0 4px 20px rgba(120,90,30,0.13)",
          padding: "18px 16px 14px",
          position: "relative",
          borderRadius: "2px",
        }}
      >
        {/* Corner decorations */}
        {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((pos) => (
          <div
            key={pos}
            style={{
              position: "absolute",
              top: pos.includes("top") ? 5 : "auto",
              bottom: pos.includes("bottom") ? 5 : "auto",
              left: pos.includes("Left") ? 5 : "auto",
              right: pos.includes("Right") ? 5 : "auto",
              width: 12,
              height: 12,
              borderTop: pos.includes("top") ? "1.5px solid #b8974a" : "none",
              borderBottom: pos.includes("bottom")
                ? "1.5px solid #b8974a"
                : "none",
              borderLeft: pos.includes("Left") ? "1.5px solid #b8974a" : "none",
              borderRight: pos.includes("Right")
                ? "1.5px solid #b8974a"
                : "none",
            }}
          />
        ))}

        {/* Mr/Mme line */}
        <div
          style={{
            ...fade(0.1),
            fontStyle: "italic",
            color: "#7a6840",
            marginBottom: "12px",
            letterSpacing: "0.04em",
            fontSize: "9px",
          }}
        >
          MR / MME / COUPLE &nbsp;.................................
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <div style={{ ...fade(0.2) }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "900",
                color: "#b8974a",
                fontFamily: "'Georgia', serif",
                marginBottom: "8px",
                letterSpacing: "0.03em",
              }}
            >
              LES FAMILLES
            </div>
            <p
              style={{
                color: "#3a2e1e",
                lineHeight: 1.6,
                textAlign: "center",
                margin: 0,
              }}
            >
              C'est avec beaucoup de joie, d'amour et d'estime que les familles
            </p>
            <p
              style={{
                fontWeight: "bold",
                color: "#1a1208",
                textAlign: "center",
                margin: "6px 0 2px",
              }}
            >
              Emile Mutunda
            </p>
            <p
              style={{
                color: "#3a2e1e",
                textAlign: "center",
                margin: "0 0 2px",
              }}
            >
              et
            </p>
            <p
              style={{
                fontWeight: "bold",
                color: "#1a1208",
                textAlign: "center",
                margin: "0 0 6px",
              }}
            >
              Jean-Robert Ndemba
            </p>
            <p
              style={{
                color: "#3a2e1e",
                lineHeight: 1.6,
                textAlign: "center",
                margin: 0,
              }}
            >
              vous convient au mariage de leurs enfants
            </p>

            {/* Names in script */}
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <div
                style={{
                  fontFamily:
                    "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                  fontSize: "13px",
                  color: "#b8974a",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                Grace Mutunda
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#b8974a",
                  fontStyle: "italic",
                }}
              >
                &amp;
              </div>
              <div
                style={{
                  fontFamily:
                    "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                  fontSize: "13px",
                  color: "#b8974a",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                Steeve Ndemba
              </div>
              <div
                style={{
                  fontFamily:
                    "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                  fontSize: "10px",
                  color: "#7a6840",
                  fontStyle: "italic",
                  marginTop: "6px",
                  lineHeight: 1.6,
                }}
              >
                ce samedi 06 juin
                <br />
                2026, à Kolwezi
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ ...fade(0.3) }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "#1a1208",
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: "8px",
                fontWeight: "400",
              }}
            >
              Le Programme
            </div>

            {/* Civil */}
            <div style={{ textAlign: "center", marginBottom: "4px" }}>
              <div style={{ fontSize: "14px" }}>💍</div>
              <div
                style={{
                  fontSize: "8px",
                  fontWeight: "bold",
                  color: "#b8974a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "3px",
                }}
              >
                Cérémonie Civile
              </div>
              <p
                style={{
                  fontSize: "9px",
                  color: "#3a2e1e",
                  lineHeight: 1.5,
                  margin: "4px 0 0",
                }}
              >
                <strong>10h00</strong> à la salle La Perle Route Kazembe 109473,
                Q/ Joli Site
              </p>
            </div>

            <Divider />

            {/* Religious */}
            <div style={{ textAlign: "center", marginBottom: "4px" }}>
              <div style={{ fontSize: "14px" }}>⛪</div>
              <div
                style={{
                  fontSize: "8px",
                  fontWeight: "bold",
                  color: "#b8974a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "3px",
                }}
              >
                Cérémonie Réligieuse
              </div>
              <p
                style={{
                  fontSize: "9px",
                  color: "#3a2e1e",
                  lineHeight: 1.5,
                  margin: "4px 0 0",
                }}
              >
                <strong>13h30</strong> à l'église La Parole Éternelle, extension
                de la Borne à Kolwezi sise avenue des Pins no 117.
              </p>
            </div>

            <Divider />

            {/* Reception */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px" }}>🥂</div>
              <div
                style={{
                  fontSize: "8px",
                  fontWeight: "bold",
                  color: "#b8974a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "3px",
                }}
              >
                Réception
              </div>
              <p
                style={{
                  fontSize: "9px",
                  color: "#3a2e1e",
                  lineHeight: 1.5,
                  margin: "4px 0 0",
                }}
              >
                19h00 à la salle La Perle, Route Kazzembe 109473, Q/. Joli Site.
              </p>
            </div>

            <Divider />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            ...fade(0.5),
            borderTop: "1px solid #d4b87a",
            marginTop: "10px",
            paddingTop: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#b8974a",
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >
            <span>●─</span>
            <span>♥</span>
            <span>─●</span>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "13px" }}>🎁</span>
            <p
              style={{
                fontSize: "9px",
                color: "#3a2e1e",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              <strong>P.S</strong> : Le Couple souhaiterait recevoir les cadeaux
              en espèce
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
