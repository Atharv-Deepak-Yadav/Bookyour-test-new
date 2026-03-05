// src/services/api.js

const API_BASE_URL = "https://www.bookurtest.com/_functions";

const TOKEN_KEY = "auth_token";
const USER_KEY  = "user_data";

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

export const fetchDistrictTaluka = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No auth token found");

  const response = await fetch(`${API_BASE_URL}/district`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Status:", response.status);
    console.error("Response:", data);
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return Array.isArray(data)
    ? data
    : Object.values(data).find((v) => Array.isArray(v)) || [];
};

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

export const registrationPhoneVerify = async ({
  phone,
  otp,
  name,
  lastName,
  email,
  labName
}) => {

  const response = await fetch(`${API_BASE_URL}/RegistrationPhoneverify`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({
      ph: phone,
      otp: Number(otp),
      name: name,
      lastName: lastName,
      email: email,
      labName: labName,
      type: "Lab"
    }),
  });

  const data = await response.json();
  console.log("🆕 RegistrationPhoneverify:", data);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Registration failed. Please try again.");
  }

  if (data.token) setAuthToken(data.token);
const userId =
  data._id ||
  data.user?._id ||
  data.data?._id;

setUserData({
  _id: userId,
  phone,
  name,
  lastName,
  email,
  labName
});

  return data;
};

// ─────────────────────────────────────────────
// 📱 ACCOUNT PHONE UPDATE
// ─────────────────────────────────────────────

export const updateAccountPhoneSendOtp = async (phone) => {
  const response = await fetch(`${API_BASE_URL}/RegistrationPhoneSendOtp`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ ph: phone }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to send OTP");
  }
  return data;
};

export const updateAccountPhoneVerifyOtp = async ({ userId, phoneNumber, otp }) => {
  const authToken = localStorage.getItem("auth_token");
  const payload = {
    _id: userId,
    phoneNumber: Number(phoneNumber),
    phoneNumberOTP: Number(otp),
  };
console.log("📤 VERIFY PHONE PAYLOAD:", payload);
  const response = await fetch(`${API_BASE_URL}/verifyAndUpdateaccountPhone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (response.ok && data.success) return data;
  throw new Error(data.message || data.error || `HTTP ${response.status}`);
};

// ─────────────────────────────────────────────
// 🔒 PROTECTED endpoints (token required)
// ─────────────────────────────────────────────

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

export const fetchMembers = async () => {
  const response = await fetch(`${API_BASE_URL}/members`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
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

export const fetchTestData = async () => {
  const response = await fetch(`${API_BASE_URL}/test_data`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }
  const data = await response.json();
  return data?.totaltest?.items ?? [];
};

export const addTest = async ({ title, test, unit, price, expiredDate }) => {
  const response = await fetch(`${API_BASE_URL}/add_test`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, test, unit, price, expiredDate }),
  });
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }
  return await response.json();
};

export const fetchDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard_data`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return await response.json();
};

export const fetchMaterials = async () => {
  const response = await fetch(`${API_BASE_URL}/material`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data?.items || []);
};

export const transformApiData = (apiResponse) => {
  let items = [];

  if (apiResponse?.totalTest?.items)       items = apiResponse.totalTest.items;
  else if (apiResponse?.totalRooms?.items) items = apiResponse.totalRooms.items;
  else if (apiResponse?.items)             items = apiResponse.items;
  else if (apiResponse?.bookingData)       items = apiResponse.bookingData;
  else if (Array.isArray(apiResponse))     items = apiResponse;
  else console.log("⚠️ Unknown dashboard response format:", apiResponse);

  if (!items || !items.length) return [];

  return items.map((item) => {
    let finalStatus = "Pending";
    if (item.status === "reject")              finalStatus = "Rejected";
    else if (item.insepectorStatus === "Done") finalStatus = "Approved";

    return {
      id: item._id,
      workName: item.nameOfWork || "N/A",
      taluka: item.selectDivision || "N/A",
      contractorName: item.userEmail?.split("@")[0] || "N/A",
      totalAmount: item.workOrderAmount || 0,
      status: finalStatus,
      rejectionReason: item.reason || "",
    };
  });
};

export const labNameVerification = async (labName) => {
  const response = await fetch(`${API_BASE_URL}/LabNameVerification`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({ labName }),
  });
  const data = await response.json();
  console.log("🏷️ LabNameVerification:", data);
  return data;
};

// ─────────────────────────────────────────────
// 📋 REPORT UPLOAD ENDPOINTS
// ─────────────────────────────────────────────

/**
 * STEP 1: Upload a PDF to Wix media storage.
 * Returns { fileUrl, publicUrl, qrCodeUrl }
 * - fileUrl:   wix:document://... (for storing in DB)
 * - publicUrl: https://static.wixstatic.com/ugd/... (for pdf-lib to fetch)
 * - qrCodeUrl: QR image URL pointing to publicUrl
 */
export const uploadReport = async (file) => {
  console.log("📤 [UPLOAD REPORT] Uploading:", file.name, `(${(file.size / 1024).toFixed(1)} KB)`);

  const formData = new FormData();
  formData.append("file", file);

  // NOTE: Do NOT set Content-Type header — browser sets it automatically
  // with the correct multipart boundary.
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/uploadReport`, {
    method: "POST",
    headers,
    body: formData,
  });

  console.log("[uploadReport] Status:", response.status);

  if (!response.ok) {
    const errText = await response.text();
    console.error("[uploadReport] Error:", errText);
    throw new Error(`Upload failed (${response.status})`);
  }

  const data = await response.json();
  console.log("✅ [UPLOAD REPORT] Success:", data);

  // Validate required fields
  if (!data.fileUrl || !data.publicUrl) {
    throw new Error("Upload succeeded but response is missing fileUrl or publicUrl");
  }

  return data; // { fileUrl, publicUrl, qrCodeUrl }
};

/**
 * STEP 2: Upload a blob (QR-stamped PDF) to Wix media storage.
 * Same endpoint as uploadReport, accepts a Blob instead of File.
 * Returns { fileUrl, publicUrl, qrCodeUrl }
 */
export const uploadReportBlob = async (blob, fileName) => {
  console.log("📤 [UPLOAD BLOB] Uploading QR-stamped PDF:", fileName);

  const formData = new FormData();
  formData.append("file", blob, fileName);

  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/uploadReport`, {
    method: "POST",
    headers,
    body: formData,
  });

  console.log("[uploadReportBlob] Status:", response.status);

  if (!response.ok) {
    const errText = await response.text();
    console.error("[uploadReportBlob] Error:", errText);
    throw new Error(`Blob upload failed (${response.status})`);
  }

  const data = await response.json();
  console.log("✅ [UPLOAD BLOB] Success:", data);
  return data;
};

/**
 * STEP 3: Save the QR-stamped PDF url to the booking record.
 * Endpoint: POST /uploadFilewithQR
 * Body: { bookingId, fileUrl, editUrl }
 */
export const submitReportWithQR = async ({ bookingId, fileUrl, editUrl, qrCodeUrl }) => {
  console.log("📝 [SUBMIT REPORT] bookingId:", bookingId);
  console.log("📝 [SUBMIT REPORT] fileUrl:", fileUrl);
  console.log("📝 [SUBMIT REPORT] editUrl:", editUrl);
  console.log("📝 [SUBMIT REPORT] qrCodeUrl:", qrCodeUrl);

  const response = await fetch(`${API_BASE_URL}/uploadFilewithQR`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookingId, fileUrl, editUrl, qrCodeUrl }),
  });

  console.log("[submitReportWithQR] Status:", response.status);

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const errorMsg = errJson.error || errJson.message || `HTTP ${response.status}`;
    console.error("[submitReportWithQR] Error:", errorMsg);
    throw new Error(errorMsg);
  }

  const data = await response.json();
  console.log("✅ [SUBMIT REPORT] Success:", data);
  return data;
};

// ─────────────────────────────────────────────
// 📋 REPORT APPROVAL ENDPOINTS
// ─────────────────────────────────────────────

export const fetchInspectorDashboard = async () => {
  console.log("📊 [INSPECTOR DASHBOARD] Fetching pending reports...");

  const response = await fetch(`${API_BASE_URL}/inspector_dashboard`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
  }

  const data = await response.json();
  console.log("✅ Raw API Response:", JSON.stringify(data, null, 2));

  let items = [];
  if (data?.totalTest?.items && Array.isArray(data.totalTest.items))   items = data.totalTest.items;
  else if (data?.items && Array.isArray(data.items))                   items = data.items;
  else if (data?.data && Array.isArray(data.data))                     items = data.data;
  else if (Array.isArray(data))                                        items = data;
  else if (data?.reports && Array.isArray(data.reports))               items = data.reports;
  else if (data?.bookingData && Array.isArray(data.bookingData))       items = data.bookingData;
  else {
    const arrayProps = Object.keys(data).filter((key) => Array.isArray(data[key]));
    if (arrayProps.length > 0) items = data[arrayProps[0]];
  }

  return items.map((item) => ({
    id: item._id,
    workName: item.nameOfWork,
    taluka: item.selectDivision,
    contractorName: item.userEmail?.split("@")[0] || "N/A",
    totalAmount: item.workOrderAmount || 0,
    status: item.status,
    insepectorStatus: item.insepectorStatus,
    reason: item.reason || "",
    documents: [
      item.workOrderDocument && { name: "Work Order", url: item.workOrderDocument },
      item.report           && { name: "Report",      url: item.report },
    ].filter(Boolean),
  }));
};

export const acceptReport = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/acceptReport`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookingId }),
  });
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || errJson.message || `HTTP ${response.status}`);
  }
  return await response.json();
};

export const rejectReport = async (bookingId, reason) => {
  const response = await fetch(`${API_BASE_URL}/rejectReport`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookingId, reason }),
  });
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || errJson.message || `HTTP ${response.status}`);
  }
  return await response.json();
};

export default {
  setAuthToken,
  setUserData,
  getUserData,
  isAuthenticated,
  logout,
  emailVerification,
  emailVerifyOtp,
  loginSendOtp,
  loginVerifyOtp,
  registrationPhoneVerify,
  updateAccountPhoneSendOtp,
  updateAccountPhoneVerifyOtp,
  registerMember,
  fetchMembers,
  addTest,
  fetchDashboardData,
  fetchMaterials,
  transformApiData,
  fetchTestData,
  fetchDistrictTaluka,
  labNameVerification,
  // Report upload
  uploadReport,
  uploadReportBlob,
  submitReportWithQR,
  // Inspector
  fetchInspectorDashboard,
  acceptReport,
  rejectReport,
};