import { useState } from "react";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";

const mockPending = [
  { id: 1, workName: "Road Repair Phase II",     taluka: "Shirur", contractor: "Patil Constructions",  amount: 824000,  submitted: "18 Feb 2026" },
  { id: 2, workName: "Bridge Expansion – NH48",  taluka: "Khed",   contractor: "Rajan & Sons",         amount: 2150000, submitted: "19 Feb 2026" },
  { id: 3, workName: "Drainage Upgrade – Zone 4",taluka: "Haveli", contractor: "Deshpande & Co.",      amount: 915000,  submitted: "20 Feb 2026" },
];

const ApprovalPage = () => {
  const [records, setRecords] = useState(mockPending);

  const approve = (id) => setRecords((r) => r.filter((x) => x.id !== id));
  const reject  = (id) => setRecords((r) => r.filter((x) => x.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Pending Review", value: records.length, bg: "#fffbeb", color: "#b45309", border: "#fde68a", icon: Clock },
          { label: "Approved Today", value: 6,              bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", icon: CheckCircle },
          { label: "Rejected Today", value: 2,              bg: "#fef2f2", color: "#991b1b", border: "#fecaca", icon: XCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ borderRadius: 16, padding: "14px 18px", background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em", color: s.color, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#111", fontFamily: "'Georgia',serif", lineHeight: 1 }}>{s.value}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={s.color} strokeWidth={2.2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending table */}
      <div style={{ borderRadius: 16, background: "#fff", border: "1px solid #f0ede6", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0ede6", background: "linear-gradient(90deg,#fffdf5,#fff)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>Pending Approvals</h2>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>Reports waiting for your review</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" }}>
            {records.length} Pending
          </span>
        </div>

        {records.length === 0 ? (
          <div style={{ padding: "56px", textAlign: "center" }}>
            <CheckCircle size={40} color="#22c55e" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: "#166534", margin: "0 0 4px" }}>All caught up!</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>No pending approvals at this time.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafaf8", borderBottom: "2px solid #f0ede6" }}>
                {["Work Name", "Taluka", "Contractor", "Amount", "Submitted", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".15em", color: "#9ca3af" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f5f4f0", background: i % 2 === 1 ? "#fdfdf9" : "#fff" }}>
                  <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 800, color: "#111" }}>{r.workName}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#6b7280" }}>{r.taluka}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#6b7280" }}>{r.contractor}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 900, color: "#111" }}>₹{r.amount.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "13px 20px", fontSize: 11, color: "#9ca3af" }}>{r.submitted}</td>
                  <td style={{ padding: "13px 20px" }}><StatusBadge status="Pending" /></td>
                  <td style={{ padding: "13px 20px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, background: "#f0fdf4", color: "#166534", border: "1.5px solid #bbf7d0", cursor: "pointer" }} onClick={() => approve(r.id)}>
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, background: "#fef2f2", color: "#991b1b", border: "1.5px solid #fecaca", cursor: "pointer" }} onClick={() => reject(r.id)}>
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default ApprovalPage;