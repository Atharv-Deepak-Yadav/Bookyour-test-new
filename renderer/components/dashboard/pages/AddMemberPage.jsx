import { useState } from "react";
import { Check, Mail } from "lucide-react";

const AddMemberPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailOtp: "",
    phone: "",
    phoneOtp: "",
  });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendEmailOtp = (e) => {
    e.preventDefault();
    if (form.firstName.trim() && form.lastName.trim() && form.email.trim()) {
      setEmailOtpSent(true);
    } else {
      alert("Please fill all fields");
    }
  };

  const handleVerifyEmailOtp = (e) => {
    e.preventDefault();
    if (form.emailOtp === "123456") {
      setEmailOtpVerified(true);
    } else {
      alert("Invalid OTP. Try: 123456");
    }
  };

  const handleSendPhoneOtp = (e) => {
    e.preventDefault();
    if (form.phone.length === 10) {
      setPhoneOtpSent(true);
    } else {
      alert("Please enter valid 10-digit phone number");
    }
  };

  const handleVerifyPhoneOtp = (e) => {
    e.preventDefault();
    if (form.phoneOtp === "123456") {
      setPhoneOtpVerified(true);
      alert("Member Created Successfully!");
    } else {
      alert("Invalid OTP. Try: 123456");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, padding: "20px" }}>
      {/* MAIN FORM */}
      <div>
        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Member Onboarding</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontWeight: 500 }}>Complete all verification steps to activate the account</p>
        </div>

        {/* PROGRESS TRACKER */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, background: "#f59e0b", color: "#fff", marginBottom: 8 }}>1</div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0, textAlign: "center" }}>Identity</p>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", marginTop: 24 }}>
            <div style={{ flex: 1, height: 2, background: emailOtpSent ? "#f59e0b" : "#e5e7eb" }}></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, background: emailOtpSent ? "#f59e0b" : "#e5e7eb", color: emailOtpSent ? "#fff" : "#9ca3af", marginBottom: 8 }}>2</div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0, textAlign: "center" }}>Email Verification</p>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", marginTop: 24 }}>
            <div style={{ flex: 1, height: 2, background: emailOtpVerified ? "#f59e0b" : "#e5e7eb" }}></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, background: emailOtpVerified ? "#f59e0b" : "#e5e7eb", color: emailOtpVerified ? "#fff" : "#9ca3af", marginBottom: 8 }}>3</div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0, textAlign: "center" }}>Phone Verification</p>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", marginTop: 24 }}>
            <div style={{ flex: 1, height: 2, background: phoneOtpVerified ? "#f59e0b" : "#e5e7eb" }}></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, background: phoneOtpVerified ? "#16a34a" : "#e5e7eb", color: phoneOtpVerified ? "#fff" : "#9ca3af", marginBottom: 8 }}>
              {phoneOtpVerified ? <Check size={20} /> : "4"}
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0, textAlign: "center" }}>Activation</p>
          </div>
        </div>

        {/* INTEGRATED IDENTITY & EMAIL VERIFICATION CONTAINER */}
        <div style={{
          background: emailOtpSent && !emailOtpVerified ? "#eff6ff" : "#fff",
          borderRadius: 20,
          border: emailOtpSent && !emailOtpVerified ? "2px solid #dbeafe" : "1.5px solid #e5e7eb",
          padding: "32px",
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          transition: "all 0.3s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 900 }}>
              {emailOtpSent && !emailOtpVerified ? "2" : "1"}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#111827", margin: 0 }}>
              {emailOtpSent && !emailOtpVerified ? "Verify Your Email" : "Identity Information"}
            </h3>
          </div>

          {!emailOtpSent || emailOtpVerified ? (
            /* PHASE 1: DETAILS INPUT */
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>First Name</label>
                  <input name="firstName" type="text" value={form.firstName} onChange={handleChange} disabled={emailOtpVerified} style={{ width: "100%", padding: "12px 16px", border: "2px solid #dbeafe", borderRadius: 12, fontSize: 14, fontWeight: 500, outline: "none", background: "#eff6ff", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Last Name</label>
                  <input name="lastName" type="text" value={form.lastName} onChange={handleChange} disabled={emailOtpVerified} style={{ width: "100%", padding: "12px 16px", border: "2px solid #dbeafe", borderRadius: 12, fontSize: 14, fontWeight: 500, outline: "none", background: "#eff6ff", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Email Address</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Mail size={20} color="#9ca3af" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} disabled={emailOtpVerified} style={{ flex: 1, padding: "12px 16px", border: "2px solid #dbeafe", borderRadius: 12, fontSize: 14, fontWeight: 500, outline: "none", background: "#eff6ff", boxSizing: "border-box" }} />
                </div>
              </div>
              {!emailOtpVerified && (
                <button onClick={handleSendEmailOtp} style={{ padding: "12px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Send Verification Code
                </button>
              )}
            </>
          ) : (
            /* PHASE 2: OTP INPUT (Replaces Details in the same container) */
            <div>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 24px", fontWeight: 500 }}>
                We've sent a secure code to <strong>{form.email}</strong>
              </p>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    value={form.emailOtp[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      const newOtp = form.emailOtp.substring(0, i) + value + form.emailOtp.substring(i + 1);
                      setForm({ ...form, emailOtp: newOtp });
                      if (value && e.target.nextSibling) e.target.nextSibling.focus();
                    }}
                    style={{ width: 56, height: 56, textAlign: "center", fontSize: 20, fontWeight: 700, borderRadius: 12, border: "2px solid #dbeafe", outline: "none", background: "#fff" }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleVerifyEmailOtp} style={{ flex: 1, padding: "12px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Verify Email
                </button>
                <button onClick={() => setEmailOtpSent(false)} style={{ padding: "12px 24px", background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Edit Details
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STEP 3: PHONE VERIFICATION (Only shows after email is verified) */}
        {emailOtpVerified && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 900 }}>3</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#111827", margin: 0 }}>Phone Verification</h3>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Phone Number</label>
              <input name="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange} disabled={phoneOtpSent} style={{ width: "100%", padding: "12px 16px", border: "2px solid #fef3c7", borderRadius: 12, fontSize: 14, fontWeight: 500, background: "#fffbeb", boxSizing: "border-box" }} />
            </div>
            {!phoneOtpSent ? (
              <button onClick={handleSendPhoneOtp} style={{ padding: "12px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Send OTP</button>
            ) : (
              <div style={{ marginTop: 16 }}>
                 <p style={{ fontSize: 14, color: "#b45309", margin: "0 0 16px", fontWeight: 700 }}>OTP sent to +91 {form.phone}</p>
                 <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                    {[0,1,2,3,4,5].map(i => (
                      <input key={i} type="text" maxLength="1" value={form.phoneOtp[i] || ""} onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        const newOtp = form.phoneOtp.substring(0, i) + val + form.phoneOtp.substring(i + 1);
                        setForm({...form, phoneOtp: newOtp});
                        if (val && e.target.nextSibling) e.target.nextSibling.focus();
                      }} style={{ width: 56, height: 56, textAlign: "center", fontSize: 20, fontWeight: 700, borderRadius: 12, border: "2px solid #fef3c7", outline: "none", background: "#fff" }} />
                    ))}
                 </div>
                 <button onClick={handleVerifyPhoneOtp} style={{ width: "100%", padding: "12px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Create Member</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR (Kept identical as per instructions) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "20px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: "#111827", margin: "0 0 16px" }}>Security Overview</h3>
          {[{ icon: "🔐", title: "Encrypted Verification", desc: "End-to-end security" }, { icon: "📧", title: "Email Authentication", desc: "Code-based verification" }, { icon: "📱", title: "Mobile OTP Confirmation", desc: "SMS authentication" }, { icon: "📋", title: "Compliance Protected", desc: "HIPAA compliant" }].map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, marginBottom: idx < 3 ? 14 : 0 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>{item.title}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "20px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: "#111827", margin: "0 0 16px" }}>Onboarding Status</h3>
          {[{ label: "Details Submitted", done: form.firstName && form.lastName && form.email }, { label: "Email Verified", done: emailOtpVerified }, { label: "Phone Verified", done: phoneOtpVerified }, { label: "Account Activated", done: phoneOtpVerified }].map((item, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: idx < 3 ? 12 : 0 }}>
              <p style={{ fontSize: 13, color: item.done ? "#111827" : "#b0b9c3", fontWeight: item.done ? 700 : 500, margin: 0 }}>{item.label}</p>
              {item.done && <Check size={18} color="#16a34a" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMemberPage;