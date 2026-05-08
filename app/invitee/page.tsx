import Link from "next/link";

export default function InviteePage() {
  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Invitee Dashboard
      </h1>

      <p style={{ marginBottom: "30px", color: "#666" }}>
        Manage your invitees using the options below.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {/*  <Link href="/invitee/info">
          <div style={cardStyle}>📄 Info</div>
        </Link> */}

        <Link href="/invitee/list">
          <div style={cardStyle}>📋 List</div>
        </Link>

        <Link href="/invitee/new">
          <div style={cardStyle}>➕ New Invitee</div>
        </Link>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  textAlign: "center",
  fontSize: "18px",
  background: "#fff",
  cursor: "pointer",
  transition: "0.2s",
};
