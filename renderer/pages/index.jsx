import { useState } from "react";
import Head from "next/head";
import LoginPage       from "../components/auth/LoginPage";
import SignupPage      from "../components/auth/SignupPage";
import DashboardLayout from "../components/dashboard/DashboardLayout";

/**
 * index.jsx — the ONLY page file in your entire app.
 *
 * Flow:
 *  Not logged in → show Login or Signup
 *  Logged in     → show Dashboard (sidebar + all pages)
 *  Logout        → back to Login
 */
export default function App() {
  // Auth state
  const [user,            setUser]            = useState(null);    // null = not logged in
  const [authPage,        setAuthPage]        = useState("login"); // "login" | "signup"

  const isAuthenticated = !!user;

  // Called by LoginPage / SignupPage on success
  const handleLogin  = (userData) => setUser(userData);
  const handleSignup = (userData) => setUser(userData);

  // Called by DashboardSidebar logout button
  const handleLogout = () => {
    setUser(null);
    setAuthPage("login");
  };

  return (
    <>
      <Head>
        <title>bookURtest</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {!isAuthenticated ? (
        // ── Auth flow ──────────────────────────────────────────────
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
        // ── Dashboard (all pages via sidebar) ──────────────────────
        <DashboardLayout
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}