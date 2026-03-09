import { useState } from "react";
import AuthLayout from "./AuthLayout";
import { loginSendOtp, loginVerifyOtp, getMemberProfile } from "../../services/api";


export const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
  disabled,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".12em",
          color: "#9ca3af",
          display: "block",
          marginBottom: 4,
        }}
      >
      {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-3 py-2 rounded-lg border-2 bg-white outline-none text-gray-900 text-sm font-medium placeholder-gray-300 transition-all disabled:opacity-60 ${
          focused
            ? "border-yellow-400 ring-2 ring-yellow-400/20"
            : "border-gray-200"
        }`}
      />
    </div>
  );
};

const LoginPage = ({ onLogin, onGoToSignup }) => {
  // ──── State ────
  const [step, setStep] = useState(1); // 1 = Enter Phone | 2 = Enter OTP
  const [phone, setPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ────────────────────────────────────────────
     STEP 1: Send OTP to phone number
  ──────────────────────────────────────────── */
  const handleSendOtp = async () => {
    // Validate phone
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("📱 Sending OTP to:", phone);
      
      // Call backend API to send OTP
      await loginSendOtp(phone);
      
      setSuccess(`✓ OTP sent to +91 ${phone}`);
      setStep(2);
    } catch (err) {
      console.error("❌ Send OTP error:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────────
     STEP 2: Verify OTP and Login
  ──────────────────────────────────────────── */
  const handleVerifyOtp = async () => {
    // Validate OTP input
    if (!otpInput) {
      setError("Please enter the OTP.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("🔐 Verifying OTP...");

      // ========== STEP 1: Verify OTP with backend =========
      const res = await loginVerifyOtp(phone, otpInput);
      const token = res.token || res.authToken;

      if (!token) {
        throw new Error("Token not received from server");
      }

      console.log("✅ OTP verified, token received");

      // ========== STEP 2: Save token to localStorage =========
      localStorage.setItem("auth_token", token);
      localStorage.setItem("userId", phone);
      console.log("💾 Token saved to localStorage");

      // ========== STEP 3: Fetch user profile =========
// ========== STEP 3: Fetch user profile =========
console.log("📥 Fetching user profile...");

const profileData = await getMemberProfile(phone);

console.log("📊 Profile response:", profileData);

 let profile = null;

const normalize = (num) =>
  String(num || "")
    .replace(/\D/g, "")
    .slice(-10);

// array response
if (Array.isArray(profileData)) {

  profile = profileData.find((u) => {

    const userPhone =
      normalize(u.phone) ||
      normalize(u.phoneNumber) ||
      normalize(u.mobile) ||
      normalize(u.ph);

    return userPhone === normalize(phone);
  });

}

// {data: []}
else if (profileData?.data && Array.isArray(profileData.data)) {

  profile = profileData.data.find((u) => {

    const userPhone =
      normalize(u.phone) ||
      normalize(u.phoneNumber) ||
      normalize(u.mobile) ||
      normalize(u.ph);

    return userPhone === normalize(phone);
  });

}

// single object
else {
  profile = profileData;
}

if (!profile) {
  console.error("User not found for phone:", phone);
  return;
}

      console.log("✓ Extracted profile:", profile);
      

const finalType = (
  profile.type ||
  profile.role ||
  profile.userType ||
  "inspector"
).toString().trim().toLowerCase();
const userObj = {
  _id: profile._id || profile.id || phone,
  id: profile._id || profile.id || phone,
phone: profile.phone || profile.phoneNumber || profile.ph || phone,
  name: profile.name || "",
  lastName: profile.lastName || "",
  email: profile.email || "",
  labName: profile.labName || "",

  type: finalType,

  approvalStatus:
    profile.approved ??
    profile.isApproved ??
    profile.status ??
    profile.approvalStatus ??
    false,
        
        // Address details
        address: profile.address || "",
        city: profile.city || "",
        district: profile.district || "",
        taluka: profile.taluka || "",
        
        // Bank details
        bankName: profile.bankName || "",
        ifscCode: profile.ifscCode || "",
        accountNumber: profile.accountNumber || "",
        branchName: profile.branchName || "",
        
        // GST details
        gstNumber: profile.gstNumber || "",
        applyGst: profile.applyGst || "No",
      };

      console.log("👤 User object created:", userObj);

      // ========== STEP 6: Save to localStorage =========
      localStorage.setItem("user_data", JSON.stringify(userObj));
      console.log("💾 User data saved to localStorage");

      // ========== STEP 7: Call onLogin callback =========
      // This will:
      // - Update index.jsx setUser(userData)
      // - Show DashboardLayout instead of LoginPage
      // - Dashboard will check approvalStatus and show/hide popup
      if (onLogin) {
        onLogin(userObj);
        console.log("✅ Login successful! Redirecting to dashboard...");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────────
     Reset and allow resend OTP
  ──────────────────────────────────────────── */
  const handleResend = () => {
    setStep(1);
    setOtpInput("");
    setError("");
    setSuccess("");
  };

  /* ────────────────────────────────────────────
     Button styling
  ──────────────────────────────────────────── */
  const primaryBtn = `w-full py-2.5 rounded-lg font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
    bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
    hover:from-yellow-500 hover:to-yellow-700 text-gray-900
    hover:shadow-lg hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-95
    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`;

  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
  );

  const ErrorBanner = ({ msg }) =>
    msg ? (
      <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
        {msg}
      </div>
    ) : null;

  const SuccessBanner = ({ msg }) =>
    msg ? (
      <div className="mb-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-600 text-xs font-semibold">
        {msg}
      </div>
    ) : null;

  return (
    <AuthLayout backgroundImage="/images/login-bg.jpg">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-20 items-center">
        {/* ── LEFT PANEL ── */}
        <div className="space-y-7">
          <div>
            <p className="text-black font-bold uppercase tracking-widest text-xs mb-3 drop-shadow-lg">
              🏗️ Construction Testing Portal
            </p>
            <h1
              className="text-5xl font-black leading-tight mb-3 text-black"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
            >
              Material Testing
              <br />
              Excellence
            </h1>
            <p
              className="text-xl font-bold text-black"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}
            >
              Civil Construction Laboratory Dashboard
            </p>
          </div>

          <p
            className="text-sm text-black leading-relaxed max-w-xl font-semibold"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
          >
            Professional material testing solutions for civil construction
            projects. Manage tests, reports, and operations with precision and
            security.
            <br />
            <br />
            <span className="font-black">
              ✓ Certified • ✓ Accurate • ✓ Professional
            </span>
          </p>

          <img
            src="/images/construction.png"
            alt="Construction site"
            className="w-48 rounded-2xl shadow-2xl border-4 border-black/20 hover:scale-105 transition-transform duration-300 object-cover"
          />
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl px-7 py-6 shadow-2xl border border-white/40">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-900">
                {step === 1 ? "🔓 Welcome Back" : "✓ Verify OTP"}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                {step === 1
                  ? "Enter your mobile number to receive an OTP"
                  : `OTP sent to +91 ${phone}`}
              </p>
            </div>

            {/* Error & Success Messages */}
            <ErrorBanner msg={error} />
            <SuccessBanner msg={!error ? success : ""} />

            {/* Form Content */}
            <div className="space-y-2.5">
              {/* ══════════════════════════════
                  STEP 1 — Enter Phone Number
              ══════════════════════════════ */}
              {step === 1 && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      disabled={loading}
                      className={`w-full px-3 py-2 rounded-lg border-2 bg-white outline-none text-gray-900 text-sm font-medium placeholder-gray-300 transition-all disabled:opacity-60 border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20`}
                    />
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={loading || phone.length !== 10}
                    className={primaryBtn}
                  >
                    {loading && <Spinner />}
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}

              {/* ══════════════════════════════
                  STEP 2 — Verify OTP
              ══════════════════════════════ */}
              {step === 2 && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Enter OTP *
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter 6-digit OTP"
                      value={otpInput}
                      onChange={(e) =>
                        setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                      disabled={loading}
                      className={`w-full px-3 py-2 rounded-lg border-2 bg-white outline-none text-gray-900 text-sm font-medium tracking-widest placeholder-gray-300 transition-all disabled:opacity-60 border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20`}
                    />
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || !otpInput}
                    className={primaryBtn}
                  >
                    {loading && <Spinner />}
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    Didn't receive?{" "}
                    <button
                      onClick={handleResend}
                      className="font-black text-yellow-700 underline bg-transparent border-none cursor-pointer hover:text-yellow-800"
                    >
                      Resend OTP
                    </button>
                  </p>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-semibold">
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Signup Link */}
            <p className="text-center text-xs text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={onGoToSignup}
                className="font-black text-yellow-700 underline bg-transparent border-none cursor-pointer hover:text-yellow-800"
              >
                Register Here
              </button>
            </p>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center font-semibold">
                🔒 Enterprise-Grade Security • SSL Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;