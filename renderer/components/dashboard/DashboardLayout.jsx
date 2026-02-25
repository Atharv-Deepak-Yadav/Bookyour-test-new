import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import AddTestPage from "./pages/AddTestPage";
import ApprovalPage from "./pages/ApprovalPage";
import AddMemberPage from "./pages/AddMemberPage"; 

const PAGE_CONFIG = {
  home: { title: "Home", subtitle: "Welcome back", breadcrumb: "Home" },
  account: { title: "My Account", subtitle: "Manage your profile", breadcrumb: "User / Account" },
  dashboard: { title: "Dashboard", subtitle: "Civil construction reports", breadcrumb: "Laboratory / Reports" },
  "add-test": { title: "Add New Test", subtitle: "Submit a test", breadcrumb: "Operations / Add Test" },
  approval: { title: "Report Approval", subtitle: "Review reports", breadcrumb: "Review / Approval" },
  "add-member": { 
    title: "Add New Member", 
    subtitle: (
      <p>
        Establish new authorized personnel records within the laboratory management system.
        Verification via OTP ensures <br />
        secure access and maintains high standards of data integrity
        for all laboratory testing operations and reporting.
      </p>
    ),
    breadcrumb: "Management / Add Member" 
  },
};

const PAGE_COMPONENTS = {
  home: HomePage,
  account: AccountPage,
  dashboard: DashboardPage,
  "add-test": AddTestPage,
  approval: ApprovalPage,
  "add-member": AddMemberPage, 
};

const DashboardLayout = ({ user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const config = PAGE_CONFIG[activePage];
  const PageContent = PAGE_COMPONENTS[activePage];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(150deg,#fffdf0 0%,#f9f7f0 60%,#faf5e4 100%)",
        fontFamily: "'Sora',sans-serif",
      }}
    >
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={onLogout}
      />

      <main
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 72 : 240,
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            padding: "28px 32px 22px",
            borderBottom: "1px solid rgba(245,193,0,0.2)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: ".2em",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#fffbeb",
                  color: "#b45309",
                  border: "1px solid #fde68a",
                }}
              >
                Laboratory
              </span>
              <span style={{ color: "#d1d5db", fontSize: 14 }}>›</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: ".12em",
                }}
              >
                {config.breadcrumb}
              </span>
            </div>

            <h1
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-.3px",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {config.title}
            </h1>

            {/* ✅ UPDATED SUBTITLE COLOR TO BLACK */}
            <p
              style={{
                fontSize: 12,
                color: "#000000",   // ← Changed to Black
                fontWeight: 500,
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              {config.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            {user?.name && (
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                👋 {user.name}
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 16px",
                borderRadius: 12,
                background: "#fff",
                border: "1.5px solid #f0ede6",
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#f5c100",
                  display: "inline-block",
                }}
              />
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </header>

        <div style={{ padding: "24px 32px", flex: 1 }}>
          {activePage === "add-member" && (
            <div style={{ marginBottom: "32px", maxWidth: "800px" }}></div>
          )}

          <PageContent user={user} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;