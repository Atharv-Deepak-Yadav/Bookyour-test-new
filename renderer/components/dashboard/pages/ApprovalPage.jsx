import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Clock, X, AlertCircle } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import { 
  fetchInspectorDashboard,
  acceptReport, 
  rejectReport 
} from "../../../services/api";

// Mock data for testing
const MOCK_DATA = [
  { 
    id: "1", 
    workName: "Road Repair Phase II", 
    taluka: "Shirur", 
    contractor: "Patil Constructions", 
    amount: 824000, 
    submitted: "18 Feb 2026",
    documents: [
      { name: "Work Order", url: "#" },
      { name: "Report", url: "#" }
    ]
  },
  { 
    id: "2", 
    workName: "Bridge Expansion – NH48", 
    taluka: "Khed", 
    contractor: "Rajan & Sons", 
    amount: 2150000, 
    submitted: "19 Feb 2026",
    documents: [
      { name: "Work Order", url: "#" },
      { name: "Report", url: "#" }
    ]
  },
  { 
    id: "3", 
    workName: "Drainage Upgrade – Zone 4", 
    taluka: "Haveli", 
    contractor: "Deshpande & Co.", 
    amount: 915000, 
    submitted: "20 Feb 2026",
    documents: [
      { name: "Work Order", url: "#" },
      { name: "Report", url: "#" }
    ]
  },
];

const ApprovalPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Modal states
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [viewModal, setViewModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadReports();
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) { 
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        console.log("📊 Using MOCK DATA for testing...");
        setRecords(MOCK_DATA);
      } else {
        console.log("📊 Fetching from Dashboard API...");
        
        try {
          // ✅ USE fetchDashboardData (same as Dashboard page - IT WORKS!)
         const data = await fetchInspectorDashboard();
console.log("✅ Inspector Dashboard Data:", data);

if (!data || data.length === 0) {
  console.warn("⚠️ No pending reports");
  setRecords([]);
} else {
  setRecords(data);
}
        } catch (apiErr) {
          console.error("❌ API Error:", apiErr.message);
          console.log("📊 Falling back to mock data...");
          setUseMockData(true);
          setRecords(MOCK_DATA);
        }
      }
    } catch (err) {
      console.error("❌ Error loading reports:", err);
      setError(err.message);
      console.log("📊 Falling back to MOCK DATA due to error...");
      setRecords(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };
const handleApprove = async (id, workName) => {
  if (submitting) return;
  setSubmitting(true);

  try {
    if (!useMockData) {
      await acceptReport(id);

      // 🔥 IMPORTANT
      await loadReports();
    }

    setSuccessMessage({
      type: "success",
      title: "Report Approved! ✅",
      message: `${workName} has been approved successfully`,
    });

  } catch (err) {
    setSuccessMessage({
      type: "error",
      title: "Approval Failed ❌",
      message: err.message,
    });
  } finally {
    setSubmitting(false);
  }
};
const handleRejectSubmit = async () => {
  if (!rejectReason.trim()) {
    alert("⚠️ Please enter a reason for rejection");
    return;
  }

  if (submitting) return;
  setSubmitting(true);

  try {
    if (!useMockData) {
      await rejectReport(rejectModal.id, rejectReason);

      // 🔥 IMPORTANT
      await loadReports();
    }

    setSuccessMessage({
      type: "warning",
      title: "Report Rejected ❌",
      message: `${rejectModal.workName} has been rejected`,
    });

    setRejectModal(null);
    setRejectReason("");

  } catch (err) {
    setSuccessMessage({
      type: "error",
      title: "Rejection Failed ❌",
      message: err.message,
    });
  } finally {
    setSubmitting(false);
  }
};

  // Calculate stats
  const totalPending = records.filter(
  r =>
    r.status === "Done" &&
    r.insepectorStatus === "In-Progress"
).length;

const approvedToday = records.filter(
  r =>
    r.insepectorStatus === "Done" &&
    r.status !== "reject"
).length;

const rejectedToday = records.filter(
  r =>
    r.status === "reject"
).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* SUCCESS/ERROR MESSAGE POPUP */}
      {successMessage && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          padding: "16px 24px",
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          background: successMessage.type === "success" ? "#f0fdf4" : successMessage.type === "warning" ? "#fef2f2" : "#fef2f2",
          border: `2px solid ${successMessage.type === "success" ? "#22c55e" : "#dc2626"}`,
          zIndex: 2000,
        
          maxWidth: 400,
        }}>
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(400px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ fontSize: 24, marginTop: 2 }}>
              {successMessage.type === "success" ? "✅" : "❌"}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: successMessage.type === "success" ? "#166534" : "#991b1b", margin: "0 0 4px" }}>
                {successMessage.title}
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                {successMessage.message}
              </p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", padding: 0 }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Debug Banner */}
      {useMockData && (
        <div style={{ 
          padding: 12, 
          borderRadius: 8, 
          background: "#fef3c7", 
          border: "1.5px solid #fcd34d", 
          display: "flex", 
          gap: 10,
          alignItems: "center"
        }}>
          <AlertCircle size={18} color="#d97706" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e", margin: 0 }}>
              ⚠️ Using Mock Data (Dashboard API not returning data)
            </p>
            <p style={{ fontSize: 11, color: "#b45309", margin: "2px 0 0" }}>
              Check browser console for API errors. Once backend is fixed, data will load automatically.
            </p>
          </div>
          <button
            onClick={() => { setUseMockData(false); loadReports(); }}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              background: "#fff",
              color: "#d97706",
              border: "1.5px solid #fcd34d",
              cursor: "pointer"
            }}
          >
            Retry API
          </button>
        </div>
      )}

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Pending Review", value: totalPending, bg: "#fffbeb", color: "#b45309", border: "#fde68a", icon: Clock },
          { label: "Approved Today", value: approvedToday, bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", icon: CheckCircle },
          { label: "Rejected Today", value: rejectedToday, bg: "#fef2f2", color: "#991b1b", border: "#fecaca", icon: XCircle },
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

      {/* Loading state */}
      {loading && (
        <div style={{ borderRadius: 16, padding: "56px", textAlign: "center", background: "#fff", border: "1px solid #f0ede6" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "4px solid #fde68a", borderTopColor: "#f5c100", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#9ca3af", fontSize: 13, fontWeight: 600, margin: 0 }}>Loading reports...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ borderRadius: 16, padding: 24, background: "#fef2f2", border: "1.5px solid #fecaca" }}>
          <p style={{ color: "#dc2626", fontWeight: 600, marginBottom: 12 }}>⚠️ Error: {error}</p>
          <button
            onClick={loadReports}
            style={{ padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 800, background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Pending table */}
      {!loading && !error && (
        <div style={{ borderRadius: 16, background: "#fff", border: "1px solid #f0ede6", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0ede6", background: "linear-gradient(90deg,#fffdf5,#fff)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>Pending Approvals</h2>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>Reports waiting for your review</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" }}>
              {totalPending} Pending
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
                  {["Work Name", "Taluka", "Contractor", "Amount", "Submitted", "View Report", "Actions", "Status"].map((h) => (
                    <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".15em", color: "#9ca3af" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                 const isPending =
  r.status === "Done" &&
  r.insepectorStatus === "In-Progress";

const isApproved =
  r.insepectorStatus === "Done" &&
  r.status !== "reject";

const isRejected =
  r.status === "reject";
                  
                  return (
                    <tr 
                      key={r.id} 
                      style={{ 
                        borderBottom: "1px solid #f5f4f0", 
                        background: isApproved ? "#f0fdf4" : isRejected ? "#fef2f2" : i % 2 === 1 ? "#fdfdf9" : "#fff"
                      }}
                    >
                      <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 800, color: "#111" }}>{r.workName}</td>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "#6b7280" }}>{r.taluka}</td>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "#6b7280" }}>{r.contractorName}</td>
                      <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 900, color: "#111" }}>₹{r.totalAmount?.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "13px 20px", fontSize: 11, color: "#9ca3af" }}>20 Feb 2026</td>
                      
                      {/* VIEW REPORT COLUMN */}
                      <td style={{ padding: "13px 20px" }}>
                        <button
                          onClick={() =>
                            setViewModal({
                              ...r,
                              pdfUrl: "https://s3-civil-pdf-co.s3.ap-south-1.amazonaws.com/documents/92ffd59f-f04c-432a-b148-8f4105ba46d8.pdf"
                            })
                          }
                          style={{
                            padding: "6px 14px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            border: "1px solid #dbeafe",
                            background: "#eff6ff",
                            color: "#2563eb",
                            cursor: "pointer"
                          }}
                        >
                          📄 View Report
                        </button>
                      </td>

                      {/* ACTIONS COLUMN */}
                      <td style={{ padding: "13px 20px" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(r.id, r.workName)}
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: 999,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  border: "none",
                                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                                  color: "#fff",
                                  cursor: "pointer"
                                }}
                              >
                                ✓ Approve
                              </button>

                              <button
                                onClick={() =>
                                  setRejectModal({ id: r.id, workName: r.workName })
                                }
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: 999,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  border: "1px solid #fecaca",
                                  background: "#fff",
                                  color: "#dc2626",
                                  cursor: "pointer"
                                }}
                              >
                                ✕ Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 14px",
                              borderRadius: 8,
                              background: "#dcfce7",
                              border: "1.5px solid #86efac"
                            }}>
                              <CheckCircle size={14} color="#16a34a" />
                              <span style={{ fontSize: 11, fontWeight: 800, color: "#16a34a" }}>
                                APPROVED
                              </span>
                            </div>
                          )}

                          {isRejected && (
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 14px",
                              borderRadius: 8,
                              background: "#fee2e2",
                              border: "1.5px solid #fca5a5"
                            }}>
                              <XCircle size={14} color="#dc2626" />
                              <span style={{ fontSize: 11, fontWeight: 800, color: "#dc2626" }}>
                                REJECTED
                              </span>
                            </div>
                          )}

                        </div>
                      </td>

                      {/* STATUS COLUMN */}
                      <td style={{ padding: "13px 20px", maxWidth: 280 }}>
                        
                        {isPending && (
                          <StatusBadge status="Pending" />
                        )}

                        {isApproved && (
                          <span style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#166534"
                          }}>
                            Report Accepted
                          </span>
                        )}

                        {isRejected && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            
                            <span style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#991b1b"
                            }}>
                              Report Rejected
                            </span>

                            {r.rejectionReason && (
                              <div style={{
                                padding: "8px 10px",
                                background: "#fff1f2",
                                border: "1px solid #fecaca",
                                borderRadius: 6,
                                fontSize: 13,
                                color: "#7f1d1d",
                                lineHeight: 1.4,
                                wordBreak: "break-word"
                              }}>
                                {r.rejectionReason}
                              </div>
                            )}
                          </div>
                        )}

                      </td>
                           
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ============= VIEW REPORT MODAL ============= */}
      {viewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
          background: "#f3f4f6",
backdropFilter: "none",
         
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000
          }}
        >
          <div
            style={{
           width: "100vw",
    height: "100vh",
    background: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 24px",
             background: "linear-gradient(135deg,#facc15,#eab308)",
color: "#1f2937",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                📄 {viewModal.workName}
              </div>

              <button
                onClick={() => setViewModal(null)}
                style={{
                 background: "rgba(255,255,255,0.1)",
color: "#ffffff",
                  border: "none",
                  
                  fontSize: 18,
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>

            {/* PDF Area */}
         {/* PDF Area */}
<div
  style={{
    flex: 1,
    background: "#f3f4f6"
  }}
>
  <iframe
    src={`${viewModal.pdfUrl}#toolbar=0`}
    title="PDF Viewer"
    style={{
      width: "100%",
      height: "100%",
      border: "none"
    }}
  />
</div> </div>
        </div>
      )}

      {/* ============= REJECT REASON MODAL ============= */}
      {rejectModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 450, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: "#991b1b", margin: 0 }}>❌ Reject Report</h3>
              <button 
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <X size={20} color="#6b7280" />
              </button>
            </div>

            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>
              Work: <strong>{rejectModal.workName}</strong>
            </p>

            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 8px" }}>Why are you rejecting this report?</p>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter the reason for rejection (e.g., Missing documents, Incorrect data, etc.)"
              style={{ 
                width: "100%", 
                minHeight: 100, 
                padding: 10, 
                borderRadius: 8, 
                border: "1.5px solid #e5e7eb", 
                fontSize: 12, 
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button 
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                style={{ flex: 1, padding: 10, borderRadius: 8, fontSize: 12, fontWeight: 800, background: "#f3f4f6", color: "#374151", border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSubmit}
                disabled={submitting || !rejectReason.trim()}
                style={{ 
                  flex: 1, 
                  padding: 10, 
                  borderRadius: 8, 
                  fontSize: 12, 
                  fontWeight: 800, 
                  background: "#fef2f2", 
                  color: "#991b1b", 
                  border: "1.5px solid #fecaca", 
                  cursor: submitting || !rejectReason.trim() ? "not-allowed" : "pointer",
                  opacity: submitting || !rejectReason.trim() ? 0.6 : 1
                }}
              >
                {submitting ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPage;