import React, { useState } from "react";
import {
  Home,
  User,
  LayoutDashboard,
  Plus,
  FileCheck,
  LogOut,
  HardHat,
  Menu,
  ChevronLeft,
  UserPlus,
} from "lucide-react";

const menuItems = [
  { label: "Home", icon: Home, pageKey: "home" },
  { label: "My Account", icon: User, pageKey: "account" },
  { label: "Dashboard", icon: LayoutDashboard, pageKey: "dashboard" },
  { label: "Add Member", icon: UserPlus, pageKey: "add-member" },
  { label: "Add Test", icon: Plus, pageKey: "add-test" },
  { label: "Report Approval", icon: FileCheck, pageKey: "approval" },
];

const DashboardSidebar = ({
  isCollapsed,
  setIsCollapsed,
  activePage,
  setActivePage,
  user,
  onLogout,
}) => {
  const [showPopup, setShowPopup] = React.useState(false);

  const handleNavigation = (pageKey) => {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const status = userData?.status || userData?.approvalStatus;

    if (status !== "Approved" && pageKey !== "account") {
      setShowPopup(true);
      return;
    }

    setActivePage(pageKey);
  };

  const sidebarWidth = isCollapsed ? 72 : 240;

  const userData = JSON.parse(localStorage.getItem("user_data"));
  const isApproved = userData?.status === "Approved" || userData?.approvalStatus === "Approved";

  return (
    <>
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: `${sidebarWidth}px`,
          background: "linear-gradient(170deg, #f5c100 0%, #e6a800 100%)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
          zIndex: 1000,
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          userSelect: "none",
        }}
      >
        {/* TOP SECTION */}
  <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "50px",
    paddingBottom: "10px",
    position: "relative",
    width: "100%"
  }}
>{/* TOGGLE BUTTON */}
  <button
  onClick={() => setIsCollapsed(!isCollapsed)}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    background: "#000",
    border: "none",
    cursor: "pointer",
    zIndex: 5
  }}
>
            {isCollapsed ? (
              <Menu size={16} color="white" />
            ) : (
              <ChevronLeft size={16} color="white" />
            )}
          </button>

         <div style={{ height: isCollapsed ? "8px" : "24px" }} />

          {/* LOGO */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              width: isCollapsed ? "40px" : "64px",
              height: isCollapsed ? "40px" : "64px",
              transition: "all 0.3s ease",
            }}
          >
            <HardHat size={isCollapsed ? 20 : 32} color="#e6a800" />
          </div>

          {!isCollapsed && (
            <div
              style={{
                marginTop: "16px",
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#111",
                  margin: "0",
                  lineHeight: 1.2,
                }}
              >
                bookURtest
              </h1>
              <p
                style={{
                  fontSize: "10px",
                  color: "rgba(0,0,0,0.5)",
                  marginTop: "4px",
                  letterSpacing: "0.2em",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Material Testing
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
  <nav
  style={{
    flex: 1,
    marginTop: isCollapsed ? "10px" : "32px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: isCollapsed ? "18px" : "4px",
    overflowY: "auto",
  }}
>
          {menuItems.map((item) => {
            const isActive = activePage === item.pageKey;
            const isRestricted = !isApproved && item.pageKey !== "account";

            return (
              <button
                key={item.pageKey}
                onClick={() => {
                  window.getSelection()?.removeAllRanges();
                  handleNavigation(item.pageKey);
                }}
                onMouseDown={(e) => e.preventDefault()}
                disabled={isRestricted}
                title={isCollapsed ? item.label : ""}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: isCollapsed ? 0 : "12px",
                  borderRadius: "12px",
                  padding: isCollapsed ? "12px" : "12px 16px",
                  border: "none",
                  cursor: isRestricted ? "not-allowed" : "pointer",
                  backgroundColor: isActive ? "#ffffff" : "transparent",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  height: "48px",
                  transition: "all 0.2s",
                  userSelect: "none",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                  opacity: isRestricted ? 0.6 : 1,
                  boxShadow: "none",
                  // ✅ Force transparent background on disabled buttons
                  background: isRestricted ? "transparent !important" : isActive ? "#ffffff" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !isRestricted) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)";
                  } else if (isRestricted) {
                    // ✅ Keep restricted buttons transparent on hover
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.background = isRestricted ? "transparent !important" : "transparent";
                  }
                }}
              >
                <item.icon
                  size={20}
                  color={isActive ? "#d97706" : "rgba(0,0,0,0.6)"}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {!isCollapsed && (
                  <>
                    <span
                      style={{
                        flex: 1,
                        textAlign: "left",
                        fontWeight: "700",
                        fontSize: "14px",
                        color: isActive ? "#d97706" : "rgba(0,0,0,0.7)",
                        userSelect: "none",
                      }}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#f59e0b",
                        }}
                      />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div
          style={{
         padding: "16px",
marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {!isCollapsed && user?.name && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#111",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: "rgba(0,0,0,0.5)",
                  margin: "2px 0 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: "500",
                }}
              >
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={onLogout}
            title={isCollapsed ? "Logout" : ""}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: isCollapsed ? 0 : "12px",
              borderRadius: "12px",
              padding: isCollapsed ? "12px" : "12px 16px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              height: "48px",
              justifyContent: isCollapsed ? "center" : "flex-start",
              transition: "all 0.2s",
              color: "#991b1b",
              fontSize: "14px",
              fontWeight: "700",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#ef5350";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#991b1b";
            }}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>

          {!isCollapsed && (
            <p
              style={{
                fontSize: "10px",
                color: "rgba(0,0,0,0.3)",
                textAlign: "center",
                fontWeight: "700",
                margin: 0,
              }}
            >
              © 2026 BOOKURTEST
            </p>
          )}
        </div>
      </aside>

      {/* POPUP */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "45px",
              borderRadius: "14px",
              width: "600px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                color: "#dc2626",
                fontSize: "26px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              Instruction
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#374151",
              }}
            >
              This page can't be accessed because your document has not been
              approved yet. After approval, you will receive a notification on
              your registered mobile number.
            </p>

            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: "20px",
                padding: "8px 20px",
                borderRadius: "8px",
                background: "#f5c100",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
