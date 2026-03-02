import { useState, useEffect } from "react";
import StatCards from "../shared/StatCards";
import TestTable from "../shared/TestTable";
import { fetchDashboardData, transformApiData } from "../../../services/api";

const DashboardPage = () => {
  const [tests, setTests]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const raw = await fetchDashboardData();
      console.log("📊 Dashboard API Response:", raw);
      
      const transformed = transformApiData(raw);
      console.log("✅ Transformed Data:", transformed);
      
      setTests(transformed);
      setError(null);
    } catch (err) {
      console.error("❌ Error loading dashboard:", err);
      setError(err.message);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "4px solid #fde68a", borderTopColor: "#f5c100", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#9ca3af", fontSize: 13, fontWeight: 600, margin: 0 }}>Loading dashboard...</p>
    </div>
  );

  if (error) return (
    <div style={{ borderRadius: 16, padding: 24, background: "#fef2f2", border: "1.5px solid #fecaca" }}>
      <p style={{ color: "#dc2626", fontWeight: 600, marginBottom: 12 }}>⚠ {error}</p>
      <button
        onClick={loadData}
        style={{ padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 800, background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <StatCards tests={tests} />
      <TestTable tests={tests} />
    </div>
  );
};

export default DashboardPage;