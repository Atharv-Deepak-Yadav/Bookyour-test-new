// src/services/api.js

const API_BASE_URL = "https://www.bookurtest.com/_functions";

const TOKEN_KEY = "auth_token";
const USER_KEY  = "user_data";

// ─────────────────────────────────────────────
// 🔐 TWO header strategies:
//
//  getPublicHeaders()    → Content-Type only, NO token
//                          Used by: login, email verify, signup OTP
//                          These endpoints don't need a token.
//
//  getAuthHeaders()      → Content-Type + Bearer token
//                          Used by: all protected dashboard/data endpoints
//                          THROWS "Not logged in" if token is missing
//                          so the caller always gets a clear error instead
//                          of a silent 401 from the server.
// ─────────────────────────────────────────────

const getPublicHeaders = () => ({
  "Content-Type": "application/json",
});

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    throw new Error("Cannot access auth token on the server.");
  }
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("You are not logged in. Please log in to continue.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ─────────────────────────────────────────────
// Token + user helpers
// ─────────────────────────────────────────────

export const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("🔐 Token stored");
  }
};

export const setUserData = (userData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    console.log("👤 User data stored");
  }
};

export const getUserData = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log("🚪 Logged out");
  }
};

// ─────────────────────────────────────────────
// 🔓 PUBLIC endpoints (no token required)
// ─────────────────────────────────────────────

// Check email uniqueness + send email OTP
export const emailVerification = async (email) => {
  const response = await fetch(`${API_BASE_URL}/EmailVerification`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  console.log("📧 EmailVerification:", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Email already exists or could not send OTP.");
  }
  return data;
};

// Verify the OTP sent to email
export const emailVerifyOtp = async (email, emailotp) => {
  const response = await fetch(`${API_BASE_URL}/EmailVerifyOtp`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ email, emailotp }),
  });
  const data = await response.json();
  console.log("✅ EmailVerifyOtp:", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Invalid email OTP. Please try again.");
  }
  return data;
};

// Send phone OTP  ─ used for both login AND signup phone step
export const loginSendOtp = async (phone) => {
  const response = await fetch(`${API_BASE_URL}/Login`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ ph: phone }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  return data;
};

// Send phone OTP  ─ used for both login AND signup phone step
export const SignupSendOtp = async (phone) => {
  const response = await fetch(`${API_BASE_URL}/RegistrationPhoneSendOtp`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ ph: phone }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  return data;
};

// Verify phone OTP + store token  ─ LOGIN flow only
export const loginVerifyOtp = async (phone, otp) => {
  const response = await fetch(`${API_BASE_URL}/VerifyOtp`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ ph: phone, otp: Number(otp) }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  console.log("✅ VerifyOtp:", data);

  if (data.token)            setAuthToken(data.token);
  else if (data.accessToken) setAuthToken(data.accessToken);
  else if (data.data?.token) setAuthToken(data.data.token);

  if (data.user)      setUserData(data.user);
  else if (data.data) setUserData({ phone, ...data.data });
  else                setUserData({ phone });

  return data;
};

// Verify phone OTP + register new user  ─ SIGNUP flow only
// Maps to: POST /RegistrationPhoneverify
// Body: { ph, otp, firstName, lastName, email, labName }
// Returns: { success, message, token }
export const registrationPhoneVerify = async ({ phone, otp, firstName, lastName, email, labName }) => {
  const response = await fetch(`${API_BASE_URL}/RegistrationPhoneverify`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({
      ph:        phone,
      otp:       Number(otp),
      firstName,
      lastName,
      email,
      labName,
    }),
  });
  const data = await response.json();
  console.log("🆕 RegistrationPhoneverify:", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Registration failed. Please try again.");
  }

  // Store the token returned by the endpoint so the user is immediately logged in
  if (data.token)            setAuthToken(data.token);
  else if (data.accessToken) setAuthToken(data.accessToken);
  else if (data.data?.token) setAuthToken(data.data.token);

  // Persist basic user info
  setUserData({ phone, firstName, lastName, email, labName });

  return data;
};

// ─────────────────────────────────────────────
// 🆕 PHONE NUMBER UPDATE WITH OTP VERIFICATION
// ─────────────────────────────────────────────

// Send OTP to new phone number
// Body: { userId, newPhoneNumber, action: "sendOTP" }
// Returns: { success, message }
export const sendPhoneUpdateOTP = async (userId, newPhoneNumber) => {
  const response = await fetch(`${API_BASE_URL}/verifyAndUpdateaccountPhone`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({
      userId,
      newPhoneNumber,
      action: "sendOTP"
    }),
  });
  const data = await response.json();
  console.log("📱 sendPhoneUpdateOTP:", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to send OTP to phone number.");
  }
  return data;
};

// Verify OTP and update phone number
// Body: { userId, newPhoneNumber, otp, action: "verifyOTP" }
// Returns: { success, message, updated: { phoneNumber, ... } }
export const verifyPhoneUpdateOTP = async (userId, newPhoneNumber, otp) => {
  const response = await fetch(`${API_BASE_URL}/verifyAndUpdateaccountPhone`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({
      userId,
      newPhoneNumber,
      otp,
      action: "verifyOTP"
    }),
  });
  const data = await response.json();
  console.log("✅ verifyPhoneUpdateOTP:", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message || "OTP verification failed. Please try again.");
  }
  return data;
};

// ─────────────────────────────────────────────
// 🔒 PROTECTED endpoints (token required)
// ─────────────────────────────────────────────

// Register new member (admin / protected use — NOT used in public signup)
export const registerMember = async ({ name, lastName, email, phoneNumber, type, labName }) => {
  const response = await fetch(`${API_BASE_URL}/members`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, lastName, email, phoneNumber, type, labName }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${response.status}`);
  }
  return await response.json();
};

// Fetch members list (for dropdowns etc.)
export const fetchMembers = async () => {
  const response = await fetch(`${API_BASE_URL}/members`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  console.log("[fetchMembers] Status:", response.status);
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }
  const data = await response.json();

  let list = [];
  if (Array.isArray(data))               list = data;
  else if (Array.isArray(data?.items))   list = data.items;
  else if (Array.isArray(data?.members)) list = data.members;
  else if (Array.isArray(data?.data))    list = data.data;
  else {
    const firstArray = Object.values(data).find((v) => Array.isArray(v));
    if (firstArray) list = firstArray;
  }

  const seen = new Set();
  return list.filter((item) => {
    const key = item?.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Fetch tests for the table
export const fetchTestData = async () => {
  const response = await fetch(`${API_BASE_URL}/test_data`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  console.log("[fetchTestData] Status:", response.status);
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }
  const data = await response.json();
  return data?.totaltest?.items ?? [];
};

// Add a new test
export const addTest = async ({ title, test, unit, price, expiredDate }) => {
  const response = await fetch(`${API_BASE_URL}/add_test`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, test, unit, price, expiredDate }),
  });
  console.log("[addTest] Status:", response.status);
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }
  return await response.json();
};

// Fetch dashboard data
export const fetchDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard_data`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return await response.json();
};

// Fetch materials
export const fetchMaterials = async () => {
  const response = await fetch(`${API_BASE_URL}/material`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  console.log("[fetchMaterials] Status:", response.status);
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data?.items || data?.materials || data || []);
};

// ─────────────────────────────────────────────
// Transform API → Dashboard table shape
// ─────────────────────────────────────────────
export const transformApiData = (apiResponse) => {
  if (!apiResponse?.totalRooms?.items) return [];
  return apiResponse.totalRooms.items.map((item) => ({
    id: item._id,
    workName: item.nameOfWork || "N/A",
    taluka: item.selectDivision || "N/A",
    contractorName: item.userEmail?.split("@")[0] || "N/A",
    totalAmount: item.workOrderAmount || 0,
    panNumber: item.serialNumber || "N/A",
    aadhaarNumber: "XXXX-XXXX-XXXX",
    registrationNumber: item.workOrderNumber || "N/A",
    documents: [
      item.workOrderDocument && { name: "Work Order Document", url: item.workOrderDocument },
      item.report            && { name: "Report Document",     url: item.report },
    ].filter(Boolean),
    materials: item.repeater2Data?.map((r) => ({
      category: r.material,
      tests: r.testName.split(","),
    })) || [],
    reportStatus:   item.status === "Done" ? "Sent"     : "Pending",
    approvalStatus: item.status === "Done" ? "Approved" : "Pending",
  }));
};

// Check if lab name already exists
export const labNameVerification = async (labName) => {
  const response = await fetch(`${API_BASE_URL}/LabNameVerification`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ labName }),
  });
  const data = await response.json();
  console.log("🏷️ LabNameVerification:", data);
  // Returns { exists: true/false } or { success: false } if already taken
  return data;
};

export default {
  // helpers
  setAuthToken, setUserData, getUserData, isAuthenticated, logout,
  // public
  emailVerification, emailVerifyOtp, loginSendOtp, loginVerifyOtp,
  registrationPhoneVerify,
  // phone update with OTP
  sendPhoneUpdateOTP, verifyPhoneUpdateOTP,
  // protected
  registerMember, fetchMembers, addTest, fetchDashboardData, fetchMaterials,
  // utils
  transformApiData, fetchTestData
};
