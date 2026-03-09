import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";

import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import AddTestPage from "./pages/AddTestPage";
import ApprovalPage from "./pages/ApprovalPage";
import AddMemberPage from "./pages/AddMemberPage";

/* -----------------------------------------
   PAGE CONFIGURATION
----------------------------------------- */

const PAGE_CONFIG = {
  home: {
    title: "Home",
    subtitle: "Welcome back",
    breadcrumb: "Home",
  },

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
        Establish new authorized personnel records within the laboratory
        management system. Verification via OTP ensures
        <br />
        secure access and maintains high standards of data integrity.
      </p>
    ),
    breadcrumb: "Management / Add Member",
  },
};

/* -----------------------------------------
   PAGE COMPONENT MAP
----------------------------------------- */

const PAGE_COMPONENTS = {
  home: HomePage,
  account: AccountPage,
  dashboard: DashboardPage,
  "add-test": AddTestPage,
  approval: ApprovalPage,
  "add-member": AddMemberPage,
};

/* -----------------------------------------
   DASHBOARD LAYOUT
----------------------------------------- */

const DashboardLayout = ({ user, onLogout, defaultPage }) => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePageState] = useState(
    defaultPage || "dashboard"
  );

  const [showPopup, setShowPopup] = useState(false);
  const [popupShownOnce, setPopupShownOnce] = useState(false);

  /* -----------------------------------------
     USER APPROVAL STATUS
  ----------------------------------------- */

  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

  const status = userData?.status || userData?.approvalStatus;

  const isApproved =
    typeof status === "string"
      ? status.toLowerCase() === "approved"
      : !!status;

  /* -----------------------------------------
     SHOW POPUP IF UNAPPROVED
  ----------------------------------------- */

  useEffect(() => {
    if (!isApproved && activePage !== "account" && !popupShownOnce) {
      setShowPopup(true);
      setPopupShownOnce(true);
    }
  }, [activePage, isApproved, popupShownOnce]);

  /* -----------------------------------------
     NAVIGATION WITH APPROVAL CHECK
  ----------------------------------------- */

  const setActivePage = (page) => {

    if (!isApproved && page !== "account") {
      setShowPopup(true);
      return;
    }

    setActivePageState(page);
    setShowPopup(false);
  };

  const handlePopupOK = () => {
    setShowPopup(false);
    setActivePageState("account");
  };

  /* -----------------------------------------
     PAGE CONFIG
  ----------------------------------------- */

  const config = PAGE_CONFIG[activePage];
  const PageContent = PAGE_COMPONENTS[activePage];

  const canViewPage = isApproved || activePage === "account";

  const sidebarMargin = isCollapsed ? 72 : 240;

  /* -----------------------------------------
     UI
  ----------------------------------------- */

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Sora', sans-serif",
        background:
          "linear-gradient(150deg,#fffdf0 0%,#f9f7f0 60%,#faf5e4 100%)",
      }}
    >

      {/* SIDEBAR */}

      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT */}

      <main
        style={{
          marginLeft: `${sidebarMargin}px`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s ease",
        }}
      >

        {/* POPUP */}

        {showPopup && !isApproved && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
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
                width: 420,
                background: "#fff",
                padding: 35,
                borderRadius: 14,
                textAlign: "center",
                zIndex: 9999,
              }}
            >
              <h2
                style={{
                  color: "#dc2626",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Instruction
              </h2>

              <p
                style={{
                  fontSize: 14,
                  marginTop: 10,
                  color: "#666",
                }}
              >
                This page can't be accessed because your document
                has not been approved yet.
              </p>

              <button
                onClick={handlePopupOK}
                style={{
                  marginTop: 15,
                  padding: "8px 20px",
                  background: "#f5c100",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </>
        )}

        {/* CONTENT */}

        {canViewPage && (
          <>
            {/* HEADER */}

            <header
              style={{
                padding: "28px 32px 22px",
                borderBottom: "1px solid rgba(245,193,0,0.2)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >

              <div>

                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    margin: 0,
                  }}
                >
                  {config.title}
                </h1>

                <p
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {config.subtitle}
                </p>

              </div>

              <div>

                {user?.name && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    👋 {user.name}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

              </div>
            </header>

            {/* PAGE */}

            <div
              style={{
                padding: "24px 32px",
                flex: 1,
              }}
            >
              <PageContent user={user} />
            </div>
          </>
        )}

      </main>

    </div>
  );
};

export default DashboardLayout;