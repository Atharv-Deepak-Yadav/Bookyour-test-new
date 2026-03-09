import { useState, useEffect } from "react";
import Head from "next/head";
import LoginPage       from "../components/auth/LoginPage";
import SignupPage      from "../components/auth/SignupPage";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function App() {
  const [user, setUser]         = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [defaultPage, setDefaultPage] = useState("dashboard");
  const [loading, setLoading]   = useState(true);

  // ✅ Restore user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    const token      = localStorage.getItem("auth_token");

    if (storedUser && token) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // ✅ Restore correct defaultPage based on type
      const type = String(parsed.type || "").trim().toLowerCase();
      setDefaultPage(type === "inspector" ? "account" : "dashboard");

      console.log("🔁 User restored from localStorage, type:", type);
    }

    setLoading(false);
  }, []);

  const isAuthenticated = !!user;

  // ✅ Called by LoginPage on success — route by type
  const handleLogin = (userData) => {
    const type = String(userData.type || "").trim().toLowerCase();

    if (type === "inspector") {
      // Inspectors land on their account page (only 2 pages available)
      setDefaultPage("account");
    } else {
      // Lab users: check approval status
      const status     = userData.approvalStatus ?? userData.status ?? false;
      const isApproved =
        typeof status === "string"
          ? status.toLowerCase() === "approved"
          : !!status;

      // Approved labs → dashboard; unapproved → account (popup will show)
      setDefaultPage(isApproved ? "dashboard" : "account");
    }

    setUser(userData);
  };

  const handleSignup = (userData) => {
    setDefaultPage("account");
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setAuthPage("login");
  };

  if (loading) return null;

  return (
    <>
      <Head>
        <title>bookURtest</title>
      </Head>

      {!isAuthenticated ? (
        authPage === "login" ? (
          <LoginPage
            onLogin={handleLogin}
            onGoToSignup={() => setAuthPage("signup")}
          />
        ) : (
          <SignupPage
            onSignup={handleSignup}
            onGoToLogin={() => setAuthPage("login")}
          />
        )
      ) : (
        <DashboardLayout
          user={user}
          onLogout={handleLogout}
          defaultPage={defaultPage}
        />
      )}
    </>
  );
}