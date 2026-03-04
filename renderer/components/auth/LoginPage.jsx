import { useState } from "react";
import AuthLayout from "./AuthLayout";
import { loginSendOtp, loginVerifyOtp } from "../../services/api";

export const InputField = ({ label, type = "text", value, onChange, placeholder, maxLength, disabled }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: ".12em", color: "#9ca3af", display: "block", marginBottom: 4,
      }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} maxLength={maxLength} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className={`w-full px-3 py-2 rounded-lg border-2 bg-white outline-none text-gray-900 text-sm font-medium placeholder-gray-300 transition-all disabled:opacity-60 ${
          focused ? "border-yellow-400 ring-2 ring-yellow-400/20" : "border-gray-200"
        }`}
      />
    </div>
  );
};

const LoginPage = ({ onLogin, onGoToSignup }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await loginSendOtp(phone);
      setSuccess(`OTP sent to +91 ${phone}`);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) {
      setError("Please enter the OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // ========== STEP 1: Verify OTP =========
      const res = await loginVerifyOtp(phone, otpInput);
      const token = res.token || res.authToken;
      
      if (!token) throw new Error("Token not received from server");

      console.log("✅ OTP verified, token received");

      // ========== STEP 2: Save token to localStorage =========
      localStorage.setItem("auth_token", token);
      localStorage.setItem("userId", phone);

      // ========== STEP 3: Fetch user profile =========
      console.log("Fetching user profile...");
      
      const profileRes = await fetch(
        `https://www.bookurtest.com/_functions/members?id=${phone}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileRes.json();
      console.log("Profile response:", profileData);

      // ========== STEP 4: Extract profile from response =========
      let profile = null;

      // Try multiple extraction strategies
      if (Array.isArray(profileData) && profileData.length > 0) {
        profile = profileData.find(u => u.phone === phone || u.ph === phone) || profileData[0];
      } else if (profileData.data) {
        if (Array.isArray(profileData.data)) {
          profile = profileData.data.find(u => u.phone === phone || u.ph === phone) || profileData.data[0];
        } else {
          profile = profileData.data;
        }
      } else if (profileData.phone || profileData.firstName || profileData.email) {
        profile = profileData;
      } else if (Object.keys(profileData).length > 0) {
        profile = profileData;
      }

      if (!profile) {
        throw new Error("Unable to load user profile");
      }

      console.log("Extracted profile:", profile);

      // ========== STEP 5: Create user object for app state =========
      const userObj = {
        _id: profile._id || profile.id || phone,
        id: profile._id || profile.id || phone,
        phone: profile.phone || profile.ph || phone,
        firstName: profile.firstName || profile.first_name || "",
        lastName: profile.lastName || profile.last_name || "",
        email: profile.email || profile.email_id || "",
        labName: profile.labName || profile.lab_name || profile.laboratory_name || "",
        approvalStatus:
  profile.approved ??
  profile.isApproved ??
  profile.status ??
  profile.approvalStatus ??
  false,
        address: profile.address || "",
        city: profile.city || "",
        district: profile.district || "",
        taluka: profile.taluka || "",
        bankName: profile.bankName || "",
        ifscCode: profile.ifscCode || "",
        accountNumber: profile.accountNumber || "",
        branchName: profile.branchName || "",
        gstNumber: profile.gstNumber || "",
        applyGst: profile.applyGst || "No",
      };

      console.log("User object ready:", userObj);

      // ========== STEP 6: Save to localStorage =========
localStorage.setItem("user_data", JSON.stringify(userObj));

      // ========== STEP 7: Call onLogin with user data =========
      // This will update index.jsx setUser(userData) and show dashboard
      if (onLogin) {
        onLogin(userObj);
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setStep(1);
    setOtpInput("");
    setError("");
    setSuccess("");
  };

  const primaryBtn = `w-full py-2.5 rounded-lg font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
    bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
    hover:from-yellow-500 hover:to-yellow-700 text-gray-900
    hover:shadow-lg hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-95
    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`;

  return (
    <AuthLayout backgroundImage="/images/login-bg.jpg">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-20 items-center">

        {/* LEFT */}
        <div className="space-y-7">
          <div>
            <p className="text-black font-bold uppercase tracking-widest text-xs mb-3 drop-shadow-lg">
              Construction Testing Portal
            </p>
            <h1 className="text-5xl font-black leading-tight mb-3 text-black"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
              Material Testing<br />Excellence
            </h1>
            <p className="text-xl font-bold text-black"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}>
              Civil Construction Laboratory Dashboard
            </p>
          </div>
          <p className="text-sm text-black leading-relaxed max-w-xl font-semibold"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
            Professional material testing solutions for civil construction projects.
            Manage tests, reports, and operations with precision and security.
            <br /><br />
            <span className="font-black">Certified • Accurate • Professional</span>
          </p>
          <img src="/images/construction.png" alt="Construction site"
            className="w-48 rounded-2xl shadow-2xl border-4 border-black/20 hover:scale-105 transition-transform duration-300 object-cover" />
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl px-7 py-6 shadow-2xl border border-white/40">

            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-900">
                {step === 1 ? "Welcome Back" : "Verify OTP"}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                {step === 1
                  ? "Enter your mobile number to receive an OTP"
                  : `OTP sent to +91 ${phone}`}
              </p>
            </div>

            {error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}
            {success && !error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-600 text-xs font-semibold">
                {success}
              </div>
            )}

            <div className="space-y-2.5">
              {step === 1 && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-gray-900 text-sm font-medium placeholder-gray-300 transition-all"
                    />
                  </div>
                  <button onClick={handleSendOtp} disabled={loading} className={primaryBtn}>
                    {loading && <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />}
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter OTP received"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-gray-900 text-sm font-medium tracking-widest placeholder-gray-300 transition-all"
                    />
                  </div>
                  <button onClick={handleVerifyOtp} disabled={loading} className={primaryBtn}>
                    {loading && <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />}
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    Didn't receive?{" "}
                    <button onClick={handleResend}
                      className="font-black text-yellow-700 underline bg-transparent border-none cursor-pointer">
                      Resend OTP
                    </button>
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-semibold">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-xs text-gray-400">
              Don't have an account?{" "}
              <button onClick={onGoToSignup}
                className="font-black text-yellow-700 underline bg-transparent border-none cursor-pointer hover:text-yellow-800">
                Register Here
              </button>
            </p>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center font-semibold">
                Enterprise-Grade Security • SSL Encrypted
              </p>
            </div>

          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
