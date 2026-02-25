import { FileText, CheckCircle, Clock, ArrowRight } from "lucide-react";

const quickLinks = [
  { label: "View Reports",     sub: "Check all lab submissions",      icon: FileText,    color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  { label: "Pending Approvals",sub: "Reports waiting for review",     icon: Clock,       color: "#9a3412", bg: "#fff7ed", border: "#fed7aa" },
  { label: "Approved Reports", sub: "All cleared test reports",       icon: CheckCircle, color: "#166534", bg: "#f0fdf4", border: "#bbf7d0" },
];

const HomePage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Welcome banner */}
      <div
        style={{
          borderRadius: 20,
          padding: "32px 36px",
          background: "linear-gradient(135deg, #f5c100 0%, #e6a800 100%)",
          boxShadow: "0 8px 32px rgba(245,193,0,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orb */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 60, bottom: -60, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />

        <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".2em", color: "rgba(0,0,0,0.45)", marginBottom: 8 }}>
          Welcome back 👋
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1a0f00", letterSpacing: "-.4px", margin: "0 0 8px" }}>
          bookURtest Portal
        </h2>
        <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", fontWeight: 500, margin: 0, maxWidth: 420 }}>
          Manage civil construction material testing, submit reports, and track approvals — all in one place.
        </p>
      </div>

      {/* Quick links */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".18em", color: "#9ca3af", marginBottom: 12 }}>
          Quick Access
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{
                  borderRadius: 16,
                  padding: "18px 20px",
                  background: item.bg,
                  border: `1.5px solid ${item.border}`,
                  cursor: "pointer",
                  transition: "transform .15s, box-shadow .15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={item.color} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{item.sub}</div>
                  </div>
                </div>
                <ArrowRight size={16} color={item.color} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ borderRadius: 16, padding: "20px 22px", background: "#fff", border: "1px solid #f0ede6", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".15em", color: "#9ca3af", marginBottom: 10 }}>About bookURtest</p>
          <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
            A dedicated platform for civil contractors to submit material test samples, track lab reports, and get approvals from senior engineers — streamlining the entire QC workflow.
          </p>
        </div>
        <div style={{ borderRadius: 16, padding: "20px 22px", background: "#fff", border: "1px solid #f0ede6", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".15em", color: "#9ca3af", marginBottom: 10 }}>How it works</p>
          {["Submit test samples via Add Test", "Lab processes and uploads results", "Senior engineer reviews and approves", "Download final certified report"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 3 ? 8 : 0 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fffbeb", border: "1.5px solid #fde68a", fontSize: 9, fontWeight: 900, color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;