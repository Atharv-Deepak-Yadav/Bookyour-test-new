import { TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";

const StatCards = ({ tests = [] }) => {
  const total    = tests.length;
const approved = tests.filter(t => t.status?.toLowerCase() === "approved").length;

const rejected = tests.filter(t => t.status?.toLowerCase() === "rejected").length;

const pending = tests.filter(t => t.status?.toLowerCase() === "pending").length;

  const cards = [
    { label: "Total Tests",    value: total,    icon: TrendingUp,  iconColor: "#92400e", iconBg: "#fef3c7", cardBg: "#fffbeb", shadow: "rgba(245,193,0,0.22)",   sub: "All submissions" },
    { label: "Approved",       value: approved, icon: CheckCircle, iconColor: "#166534", iconBg: "#dcfce7", cardBg: "#f0fdf4", shadow: "rgba(34,197,94,0.18)",    sub: "Reports cleared" },
    { label: "Pending Review", value: pending,  icon: Clock,       iconColor: "#9a3412", iconBg: "#ffedd5", cardBg: "#fff7ed", shadow: "rgba(249,115,22,0.18)",   sub: "Awaiting approval" },
    { label: "Rejected",       value: rejected, icon: AlertCircle, iconColor: "#991b1b", iconBg: "#fee2e2", cardBg: "#fef2f2", shadow: "rgba(239,68,68,0.18)",    sub: "Flagged reports" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            style={{
              background: card.cardBg, borderRadius: 16,
              padding: "14px 16px", display: "flex", alignItems: "center",
              justifyContent: "space-between", position: "relative", overflow: "hidden",
              boxShadow: `0 4px 20px ${card.shadow}, 0 1px 4px rgba(0,0,0,.04)`,
              cursor: "default", transition: "transform .18s, box-shadow .18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 28px ${card.shadow}, 0 2px 6px rgba(0,0,0,.06)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${card.shadow}, 0 1px 4px rgba(0,0,0,.04)`; }}
          >
            {/* Glow orb */}
            <div style={{ position: "absolute", bottom: -18, right: -18, width: 80, height: 80, borderRadius: "50%", background: card.iconBg, filter: "blur(20px)", opacity: 0.9, pointerEvents: "none" }} />

            {/* Left: icon + labels */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} color={card.iconColor} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em", color: card.iconColor, lineHeight: 1.2 }}>{card.label}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af", marginTop: 2 }}>{card.sub}</div>
              </div>
            </div>

            {/* Right: number */}
            <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: -1, color: "#111827", fontFamily: "'Georgia',serif", position: "relative", zIndex: 1, flexShrink: 0, marginLeft: 8 }}>
              {card.value.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;