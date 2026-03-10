import { useState, useEffect } from "react";
import { Check, Mail } from "lucide-react";
import { emailVerification, emailVerifyOtp, SignupSendOtp } from "../../../services/api";
import { registrationPhoneVerify } from "../../../services/api";
import { checkLabMemberLimit } from "../../../services/api";

const AddMemberPage = () =>{
  const [form, setForm] = useState({
    name: "",
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
  const [memberExists, setMemberExists] = useState(false);
const [checkingMember, setCheckingMember] = useState(true);
useEffect(() => {

  const checkMember = async ()=>{

    try {
      const res = await checkLabMemberLimit();
      console.log("API response:", res);
      // 🔴 backend logic
      if (res?.allowed === false) {
        setMemberExists(true);
      }
} catch (err) {
      console.error(err);
    } finally {
      setCheckingMember(false);
    }
  };
      checkMember();
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSendEmailOtp = async (e) => {
  e.preventDefault();
  if (!form.name.trim() || !form.lastName.trim() || !form.email.trim()) {
    alert("Please fill all fields");
    return;
  }

  try {
    await emailVerification(form.email);   // 🔥 CALL API
    setEmailOtpSent(true);
    alert("OTP sent to your email");
  } catch (err) {
    alert(err.message);
  }
};
const handleVerifyEmailOtp = async (e) => {
  e.preventDefault();

  try {
    await emailVerifyOtp(form.email, form.emailOtp);  // 🔥 CALL API
    setEmailOtpVerified(true);
    alert("Email verified successfully");
  } catch (err) {
    alert(err.message);
  }
};

const handleSendPhoneOtp = async (e) => {
  e.preventDefault();

  if (form.phone.length !== 10) {
    alert("Please enter valid 10-digit phone number");
    return;
  }

  try {

    console.log("Sending OTP to:", form.phone);

    const res = await SignupSendOtp(Number(form.phone));

    console.log("OTP API Response:", res);

    setPhoneOtpSent(true);
    alert("OTP sent to your phone");

  } catch (err) {
    console.error("OTP Error:", err);
    alert(err.message);
  }
}; // ✅ THIS WAS MISSING

const handleVerifyPhoneOtp = async (e) => {
  e.preventDefault();

  try {
  const labData = JSON.parse(localStorage.getItem("user_data"));

await registrationPhoneVerify({
   phone: Number(form.phone),
 otp: Number(form.phoneOtp),
  name: form.name,
  lastName: form.lastName,
  email: form.email,
  labName: labData.labName,
  type: "inspector"
});
    setPhoneOtpVerified(true);
    alert("Member Created Successfully!");
  } catch (err) {
    alert(err.message);
  }
};
if (checkingMember) {
  return (
    <div style={{ padding: 40 }}>
      Checking member status...
    </div>
  );
}

if (memberExists) {
  return (
    <div style={{
      padding: 40,
      fontSize: 18,
      fontWeight: 700,
      color: "#dc2626",
      textAlign: "center"
    }}>
    ⚠ Already member exists under this lab. <br/>
      If you want to edit info then go to <b>My Account</b>.
    </div>
  );
}
  return (
  
<div
  className="min-h-screen"
  style={{
    backgroundColor: "#ffffff",
    paddingTop: 0,
    paddingBottom: 24,
    paddingLeft: 0,
    paddingRight: 24
  }}
>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 32,
    padding: "20px"
  }}
>
  
      {/* MAIN FORM */}
      <div>
        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
         <h2 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Member Onboarding</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontWeight: 500 }}>Complete all verification steps to activate the account</p>
        </div>

        

        {/* INTEGRATED IDENTITY & EMAIL VERIFICATION CONTAINER */}
     <div className="card" style={{ padding:28, marginBottom:24 }}>

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
                 <label className="section-label">name</label>
                 <input
  name="name"
  type="text"
  value={form.name}
  onChange={handleChange}
  disabled={emailOtpVerified}
  className="premium-input"
/>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Last Name</label>
                  <input
  name="lastName"
  type="text"
  value={form.lastName}
  onChange={handleChange}
  disabled={emailOtpVerified}
  className="premium-input"
/>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Email Address</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Mail size={20} color="#9ca3af" />
                  <input
  name="email"
  type="email"
  value={form.email}
  onChange={handleChange}
  disabled={emailOtpVerified}
  className="premium-input"
  style={{ flex: 1 }}
/>
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
                {[0, 1, 2, 3].map((i) => (
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
                    style={{
 width: 56,
 height: 56,
 textAlign: "center",
 fontSize: 20,
 fontWeight: 700,
 borderRadius: 12,
 border: "2px solid #dbeafe",
 outline: "none",
 background: "#fff",
 pointerEvents: "auto",
 cursor: "text"
}}
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
       <div
className="bg-white rounded-xl shadow-lg border border-gray-200"
style={{ padding: "32px" }}
>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 900 }}>3</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#111827", margin: 0 }}>Phone Verification</h3>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Phone Number</label>
            <input
  name="phone"
  type="tel"
  placeholder="9876543210"
  value={form.phone}
  onChange={handleChange}
  disabled={phoneOtpSent}
  className="premium-input"
/>
            </div>
            {!phoneOtpSent ? (
              <button onClick={handleSendPhoneOtp} style={{ padding: "12px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Send OTP</button>
            ) : (
              <div style={{ marginTop: 16 }}>
                 <p style={{ fontSize: 14, color: "#b45309", margin: "0 0 16px", fontWeight: 700 }}>OTP sent to +91 {form.phone}</p>
                 <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                    {[0,1,2,3].map(i => (
                      <input key={i} type="text" maxLength="1" value={form.phoneOtp[i] || ""} onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        const newOtp = form.phoneOtp.substring(0, i) + val + form.phoneOtp.substring(i + 1);
                        setForm({...form, phoneOtp: newOtp});
                        if (val && e.target.nextSibling) e.target.nextSibling.focus();
                      }} style={{
 width: 56,
 height: 56,
 textAlign: "center",
 fontSize: 20,
 fontWeight: 700,
 borderRadius: 12,
 border: "2px solid #fef3c7",
 outline: "none",
 background: "#fff",
 pointerEvents: "auto",
 cursor: "text"
}} />
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
   <div className="bg-white rounded-xl shadow-lg border border-gray-200" style={{ padding: "20px" }}>
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200" style={{ padding: "20px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: "#111827", margin: "0 0 16px" }}>Onboarding Status</h3>
          {[{ label: "Details Submitted", done: form.name && form.lastName && form.email }, { label: "Email Verified", done: emailOtpVerified }, { label: "Phone Verified", done: phoneOtpVerified }, { label: "Account Activated", done: phoneOtpVerified }].map((item, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: idx < 3 ? 12 : 0 }}>
              <p style={{ fontSize: 13, color: item.done ? "#111827" : "#b0b9c3", fontWeight: item.done ? 700 : 500, margin: 0 }}>{item.label}</p>
              {item.done && <Check size={18} color="#16a34a" />}
            </div>
          ))}
        </div>
      </div>
               </div>

    </div>


  );
};

export default AddMemberPage;