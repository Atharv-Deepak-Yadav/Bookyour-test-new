const TestTable = ({ tests }) => {
  if (!tests || tests.length === 0) {
    return (
      <div style={{
        borderRadius: 16,
        padding: 40,
        background: "#fff",
        border: "1.5px solid #f0ede6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        textAlign: "center",
      }}>
        <p style={{ color: "#d1d5db", fontSize: 14, fontWeight: 500, margin: 0, marginBottom: 16 }}>
          Laboratory Reports
        </p>
        <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 500, margin: 0, marginBottom: 24 }}>
          Material testing reports and approval status
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 24, borderBottom: "1.5px solid #f0ede6" }}>
          <span style={{ color: "#6b7280", fontSize: 11, fontWeight: 600 }}>0 Records</span>
        </div>

        {/* TABLE HEADER */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Work Name
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Taluka
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Contractor
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Total Amount
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Status
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" style={{
                padding: "60px 16px",
                textAlign: "center",
                color: "#d1d5db",
                fontSize: 14,
                fontWeight: 500,
              }}>
                No records found.
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 500, margin: 0 }}>
          Showing 0–0 of 0
        </p>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 16,
      padding: 24,
      background: "#fff",
      border: "1.5px solid #f0ede6",
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 20, borderBottom: "1.5px solid #f0ede6" }}>
        <div>
          <p style={{ color: "#374151", fontSize: 14, fontWeight: 700, margin: 0, marginBottom: 4 }}>
            Laboratory Reports
          </p>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 500, margin: 0 }}>
            Material testing reports and approval status
          </p>
        </div>
        <div style={{
          padding: "6px 12px",
          borderRadius: 8,
          background: "#fffbeb",
          border: "1.5px solid #fde68a",
          fontSize: 11,
          fontWeight: 700,
          color: "#b45309",
        }}>
          {tests.length} Records
        </div>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Work Name
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Taluka
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Contractor
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Total Amount
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Status
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
                background: "transparent",
                borderBottom: "1.5px solid #f0ede6",
              }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, idx) => (
              <tr key={idx} style={{
                borderBottom: "1px solid #f0ede6",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fffbeb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "14px 16px", color: "#374151", fontSize: 12, fontWeight: 600 }}>
                  {test.workName || "—"}
                </td>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12, fontWeight: 500 }}>
                  {test.taluka || "—"}
                </td>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12, fontWeight: 500 }}>
                  {test.contractor || "—"}
                </td>
                <td style={{ padding: "14px 16px", color: "#374151", fontSize: 12, fontWeight: 600 }}>
                  {test.totalAmount ? `₹${test.totalAmount.toLocaleString()}` : "—"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "capitalize",
                    background: test.status === "approved" ? "#dcfce7" : test.status === "pending" ? "#fef3c7" : "#fee2e2",
                    color: test.status === "approved" ? "#166534" : test.status === "pending" ? "#b45309" : "#991b1b",
                  }}>
                    {test.status || "—"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    background: "linear-gradient(135deg,#f5c100,#e6a800)",
                    color: "#1a0f00",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginTop: 20, marginBottom: 0 }}>
        Showing 1–{Math.min(10, tests.length)} of {tests.length}
      </p>
    </div>
  );
};

export default TestTable;
