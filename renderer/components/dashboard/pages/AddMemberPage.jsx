import { useState, useEffect } from "react";
import { Check, Mail } from "lucide-react";
import { emailVerification, emailVerifyOtp, SignupSendOtp } from "../../../services/api";
import { registrationPhoneVerify } from "../../../services/api";
import { checkLabMemberLimit } from "../../../services/api";
import { fetchInspectorByLabName } from "../../../services/api";
import { deleteMember } from "../../../services/api";

const AddMemberPage = () =>{
  const [memberData, setMemberData] = useState([]);

const handleMemberEdit = (e) => {
  setMemberData({
    ...memberData,
    [e.target.name]: e.target.value
  });
};
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
const [checkingMember, setCheckingMember] = useState(true)
;
const handleDeleteMember = async (id) => {
  try {

    const confirmDelete = window.confirm("Delete this member?");
    if (!confirmDelete) return;

    await deleteMember(id);

    alert("Member deleted successfully");

    // UI update
    setMemberExists(false);
    setMemberData([]);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
useEffect(() => {

 const checkMember = async ()=>{

   try {

     const res = await checkLabMemberLimit();
     console.log("API response:", res);

    if (res && res.allowed === false) {

       setMemberExists(true);

       const labData = JSON.parse(localStorage.getItem("user_data"));
const inspectors = await fetchInspectorByLabName();

if (inspectors) {
  setMemberData(inspectors);
}

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
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!form.name.trim() || !form.lastName.trim() || !form.email.trim()) {
  alert("Please fill all fields");
  return;
}

if (!emailRegex.test(form.email)) {
  alert("Enter valid email");
  return;
}
    

  try {
    await emailVerification(form.email);   // 🔥 CALL API
    setEmailOtpSent(true);
    alert("OTP sent to your email");
  } catch (err) {

    alert(err.message);

    // ⭐ IMPORTANT FIX
    setEmailOtpSent(false);
    setEmailOtpVerified(false);
  }
};
const handleVerifyEmailOtp = async (e) => {
  e.preventDefault();

  try {
    await emailVerifyOtp(form.email, form.emailOtp);  // 🔥 CALL API
    setEmailOtpVerified(true);
setForm({...form, emailOtp: ""}); // reset otp
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
    <div style={{ padding: 40 }}>

      {/* RED MESSAGE */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#dc2626",
          textAlign: "center",
          marginBottom: 40
        }}
      >
        ⚠ Already member exists under this lab. <br />
        If you want to edit info then go to <b>My Account</b>.
      </div>


      {/* MEMBER DETAILS TABLE */}
      <div
  style={{
    width: "900px",
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden"
  }}
>
        {/* TABLE HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 2fr 1fr 120px",
            padding: "14px 20px",
            fontWeight: 700,
            background: "#f9fafb",
           
          }}
        >
          <div>Name</div>
          <div>Last Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Action</div>
        </div>


        {/* MEMBER ROW */}
{memberData.map((m) => (
  <div
    key={m._id}
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 2fr 1fr 120px",
      padding: "16px 20px",
      alignItems: "center"
    }}
  >
    <div>{m.name}</div>

    <div>{m.lastName}</div>

    <input
      value={m.email}
      style={{
        padding: "6px 8px",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        width: "90%"
      }}
    />

    <input
      value={m.phoneNumber}
      style={{
        padding: "6px 8px",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        width: "90%"
      }}
    />

   <button
  onClick={() => handleDeleteMember(m._id)}
  style={{
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer"
  }}
>
  Delete
</button>
  </div>
))}
 </div>
      </div>
  
  );
}
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, padding: "20px" }}>
      {/* MAIN FORM */}
      <div>
        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
        
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

          {!emailOtpSent ? (
            /* PHASE 1: DETAILS INPUT */
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} disabled={emailOtpVerified} style={{ width: "100%", padding: "12px 16px", border: "2px solid #dbeafe", borderRadius: 12, fontSize: 14, fontWeight: 500, outline: "none", background: "#eff6ff", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Last Name</label>
                  <input name="lastName" type="text" value={form.lastName} onChange={handleChange} disabled={emailOtpVerified} style={{ width: "100%", padding: "12px 16px", border: "2px solid #dbeafe", borderRadius: 12, fontSize: 14, fontWeight: 500, outline: "none", background: "#eff6ff", boxSizing: "border-box" }} />
                </div>
              </div>
             <div style={{ marginBottom: 24 }}>
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <Mail size={16} color="#9ca3af" />
    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0 }}>
      Email Address
    </label>
  </div>

  <input
    name="email"
    type="email"
    value={form.email}
    onChange={handleChange}
    disabled={emailOtpVerified}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #dbeafe",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 500,
      outline: "none",
      background: "#eff6ff",
      boxSizing: "border-box"
    }}
  />
</div>
              {!emailOtpVerified && (
                <button onClick={handleSendEmailOtp} style={{ padding: "12px 24px", background: "#f5c100",
color: "#1a0f00", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
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
                     autoFocus={i === 0}
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
 cursor: "text"
}}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleVerifyEmailOtp} style={{ flex: 1, padding: "12px 24px", background: "#f5c100",
color: "#1a0f00", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Verify Email
                </button>
                <button onClick={() => setEmailOtpSent(false)} style={{ padding: "12px 24px", background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Edit Details
                </button>
                </div>
                {emailOtpVerified && (
  <>
    <div style={{ marginTop: 30 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>
        Phone Number
      </label>

      <input
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        disabled={phoneOtpSent}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "2px solid #fef3c7",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 500,
          background: "#fffbeb",
          boxSizing: "border-box"
        }}
      />
    </div>

    {!phoneOtpSent ? (
      <button
        onClick={handleSendPhoneOtp}
        style={{
          marginTop: 16,
          padding: "12px 24px",
         background: "#f5c100",
color: "#1a0f00",
          border: "none",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer"
        }}
      >
        Send Phone OTP
      </button>
    ) : (
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[0,1,2,3].map(i => (
            <input
              key={i}
              type="text"
              maxLength="1"
              value={form.phoneOtp[i] || ""}
              onChange={(e)=>{
                const val = e.target.value.replace(/[^0-9]/g,"");
                const newOtp = form.phoneOtp.substring(0,i) + val + form.phoneOtp.substring(i+1);
                setForm({...form, phoneOtp:newOtp});
                if(val && e.target.nextSibling) e.target.nextSibling.focus();
              }}
              style={{
                width:56,
                height:56,
                textAlign:"center",
                fontSize:20,
                fontWeight:700,
                borderRadius:12,
                border:"2px solid #fef3c7"
              }}
            />
          ))}
        </div>

        <button
          onClick={handleVerifyPhoneOtp}
          style={{
            width:"100%",
            padding:"12px 24px",
            background:"#111827",
            color:"#fff",
            border:"none",
            borderRadius:12,
            fontSize:13,
            fontWeight:700
          }}
        >
          Create Member
        </button>
      </div>
    )}
  </>
)}
              </div>
            
          )}
        </div>
        
      </div>

      {/* RIGHT SIDEBAR (Kept identical as per instructions) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "20px" }}>
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
  );
};

export default AddMemberPage;