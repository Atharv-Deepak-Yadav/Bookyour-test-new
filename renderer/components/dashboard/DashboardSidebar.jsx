import React from "react";
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

  // allow only My Account if not approved
  if (status !== "Approved" && pageKey !== "account") {
    setShowPopup(true);
    return;
  }

  setActivePage(pageKey);
};

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
      style={{
        background: "linear-gradient(170deg, #f5c100 0%, #e6a800 100%)",
      }}
    >
      {/* TOP SECTION */}
      <div className="flex flex-col items-center pt-5">

        {/* TOGGLE (FIXED POSITION ALWAYS SAME) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-black shadow-md hover:bg-gray-800 transition"
        >
          {isCollapsed ? (
            <Menu size={16} className="text-white" />
          ) : (
            <ChevronLeft size={16} className="text-white" />
          )}
        </button>

        {/* SPACING */}
        <div className="h-6" />

        {/* LOGO */}
        <div
          className={`flex items-center justify-center rounded-2xl bg-white shadow-md transition-all ${
            isCollapsed ? "w-10 h-10" : "w-16 h-16"
          }`}
        >
          <HardHat
            size={isCollapsed ? 20 : 32}
            style={{ color: "#e6a800" }}
          />
        </div>

        {!isCollapsed && (
          <div className="mt-4 text-center">
            <h1 className="text-lg font-black text-gray-900 leading-none">
              bookURtest
            </h1>
            <p className="text-[10px] text-yellow-900/60 mt-1 tracking-[0.2em] uppercase font-bold">
              Material Testing
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 mt-8 px-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = activePage === item.pageKey;

          return (
            <button
              key={item.pageKey}
              onClick={() => handleNavigation(item.pageKey)}
              title={isCollapsed ? item.label : ""}
              className={`w-full flex items-center rounded-xl transition-all ${
                isCollapsed ? "justify-center h-12" : "gap-3 px-4 py-3"
              } ${
                isActive
                  ? "bg-white text-yellow-700 shadow-md"
                  : "text-yellow-950/80 hover:bg-white/30"
              }`}
            >
              <item.icon
                size={20}
                className={`${
                  isActive ? "text-yellow-600" : "text-yellow-900/70"
                }`}
              />

              {!isCollapsed && (
                <span className="flex-1 text-left font-bold text-sm">
                  {item.label}
                </span>
              )}

              {!isCollapsed && isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="pb-6 pt-4 px-2 border-t border-white/20 space-y-3">

        {!isCollapsed && user?.name && (
          <div className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm">
            <p className="text-xs font-black text-yellow-950 truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-yellow-900/60 truncate font-medium">
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={onLogout}
          title={isCollapsed ? "Logout" : ""}
          className={`w-full flex items-center rounded-xl font-bold text-red-900/80 hover:bg-red-500 hover:text-white transition ${
            isCollapsed ? "justify-center h-12" : "gap-3 px-4 py-3 text-sm"
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {!isCollapsed && (
          <p className="text-[10px] text-yellow-900/40 text-center font-bold">
            © 2026 BOOKURTEST
          </p>
        )}
      </div>
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

      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
        This page can't be accessed because your document has not been approved yet.
        After approval, you will receive a notification on your registered mobile number.
      </p>

      <button
        onClick={() => setShowPopup(false)}
        style={{
          marginTop: "20px",
          padding: "8px 20px",
          borderRadius: "8px",
          background: "#f5c100",
          fontWeight: "bold",
        }}
      >
        OK
      </button>
    </div>
  </div>
)}

    </aside>
  );
};

export default DashboardSidebar;