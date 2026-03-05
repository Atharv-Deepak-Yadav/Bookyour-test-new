import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import AddTestPage from "./pages/AddTestPage";
import ApprovalPage from "./pages/ApprovalPage";
import AddMemberPage from "./pages/AddMemberPage";

const PAGE_CONFIG = {
  home: { title: "Home", subtitle: "Welcome back", breadcrumb: "Home" },
  account: {
    title: "My Account",
    subtitle: "Manage your profile",
    breadcrumb: "User / Account",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Civil construction reports",
    breadcrumb: "Laboratory / Reports",
  },
  "add-test": {
    title: "Add New Test",
    subtitle: "Submit a test",
    breadcrumb: "Operations / Add Test",
  },
  approval: {
    title: "Report Approval",
    subtitle: "Review reports",
    breadcrumb: "Review / Approval",
  },
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
    breadcrumb: "Management / Add Member",
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

const DashboardLayout = ({ user, onLogout, defaultPage }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePageState] = useState(defaultPage || "dashboard");
  const [showPopup, setShowPopup] = useState(false);
  const [popupShownOnce, setPopupShownOnce] = useState(false);

  // Get user approval status from localStorage
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const status = userData?.status || userData?.approvalStatus;
  const isApproved = status === "Approved" || status === "approved";

  // Only show popup ONCE when unapproved user tries to access restricted page
  useEffect(() => {
    if (!isApproved && activePage !== "account" && !popupShownOnce) {
      setShowPopup(true);
      setPopupShownOnce(true);
    }
  }, [activePage, isApproved, popupShownOnce]);

  // Handle page navigation with approval check
  const setActivePage = (page) => {
    if (!isApproved && page !== "account") {
      // Don't navigate, show popup
      setShowPopup(true);
      return;
    }
    // If approved or trying to access account, navigate freely
    setActivePageState(page);
    setShowPopup(false);
  };

  const handlePopupOK = () => {
    // Close popup and navigate to account page
    setShowPopup(false);
    setActivePageState("account");
  };

  const config = PAGE_CONFIG[activePage];
  const PageContent = PAGE_COMPONENTS[activePage];

  // Check if user can view this page
  const canViewPage = isApproved || activePage === "account";

  // Calculate margin based on sidebar state
  const sidebarMargin = isCollapsed ? 72 : 240;

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Sora',sans-serif",
        background: "linear-gradient(150deg,#fffdf0 0%,#f9f7f0 60%,#faf5e4 100%)",
      }}
    >
      {/* SIDEBAR - ALWAYS VISIBLE AND FIXED */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT AREA - HAS LEFT MARGIN FOR SIDEBAR */}
      <main
        style={{
          marginLeft: `${sidebarMargin}px`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "transparent",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* POPUP OVERLAY - Only shows when needed */}
        {showPopup && !isApproved && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(4px)",
                zIndex: 9998,
              }}
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "420px",
                background: "#fff",
                padding: "35px",
                borderRadius: "14px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                zIndex: 9999,
              }}
            >
              <h2 style={{ color: "#dc2626", fontSize: "18px", fontWeight: "700" }}>
                Instruction
              </h2>

              <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>
                This page can't be accessed because your document has not been approved yet.
                After approval you will receive notification.
              </p>

              <button
                onClick={handlePopupOK}
                style={{
                  marginTop: "15px",
                  padding: "8px 20px",
                  background: "#f5c100",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#e6b300")}
                onMouseLeave={(e) => (e.target.style.background = "#f5c100")}
              >
                OK
              </button>
            </div>
          </>
        )}

        {/* HEADER + CONTENT - Only render if page is accessible */}
        {canViewPage ? (
          <>
            {/* HEADER SECTION */}
            <header
              style={{
                padding: "28px 32px 22px",
                borderBottom: "1px solid rgba(245,193,0,0.2)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                background: "transparent",
              }}
            >
              <div>
                {/* Breadcrumb */}
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

                {/* Page Title */}
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

                {/* Page Subtitle */}
                <p
                  style={{
                    fontSize: 12,
                    color: "#000000",
                    fontWeight: 500,
                    marginTop: 4,
                    marginBottom: 0,
                  }}
                >
                  {config.subtitle}
                </p>
              </div>

              {/* User Info & Date */}
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

            {/* PAGE CONTENT SECTION */}
            <div style={{ padding: "24px 32px", flex: 1 }}>
              {activePage === "add-member" && (
                <div style={{ marginBottom: "32px", maxWidth: "800px" }}></div>
              )}

              <PageContent user={user} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default DashboardLayout;
