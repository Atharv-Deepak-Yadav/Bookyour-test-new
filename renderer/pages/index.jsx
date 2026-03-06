import { useState, useEffect } from "react";
import Head from "next/head";
import LoginPage       from "../components/auth/LoginPage";
import SignupPage      from "../components/auth/SignupPage";
import DashboardLayout from "../components/dashboard/DashboardLayout";
export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [defaultPage, setDefaultPage] = useState("dashboard");
  const [loading, setLoading] = useState(true); // prevent flicker

  // ✅ Restore user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    const token = localStorage.getItem("auth_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      console.log("🔁 User restored from localStorage");
    }

    setLoading(false);
  }, []);

  const isAuthenticated = !!user;

  // Called by LoginPage / SignupPage on success
  const handleLogin = (userData) => setUser(userData);

  const handleSignup = (userData) => {
    setDefaultPage("account");
    setUser(userData);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setAuthPage("login");
  };

  // 🔥 Prevent UI flash before restore
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