// src/services/api.js

const API_BASE_URL = "https://www.bookurtest.com/_functions";

const TOKEN_KEY = "auth_token";
const USER_KEY  = "user_data";

const getPublicHeaders = () => ({
  "Content-Type": "application/json",
});

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return {};   // do NOT throw error during SSR
  }

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return {};   // do NOT crash app
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

// 📍 DISTRICT & TALUKA API
// ─────────────────────────────────────────────

export const fetchDistrictTaluka = async () => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(
    "https://www.bookurtest.com/_functions/district",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,   // 🔥 THIS IS IMPORTANT
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Status:", response.status);
    console.error("Response:", data);
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return Array.isArray(data)
    ? data
    : Object.values(data).find(v => Array.isArray(v)) || [];
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

export const emailVerifyOtp = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/EmailVerifyOtp`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({
      email: email,
      otp: Number(otp)
    }),
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

  if (data.user) {
  setUserData({
    ...data.user,
    status: data.user.status
  });
}
else if (data.data) {
  setUserData({
    phone,
    ...data.data,
    status: data.data.status
  });
}
else {
  setUserData({ phone });
}

  return data;
};

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

  if (data.token)            setAuthToken(data.token);
  else if (data.accessToken) setAuthToken(data.accessToken);
  else if (data.data?.token) setAuthToken(data.data.token);

  setUserData({ phone, firstName, lastName, email, labName });

  return data;
};

// ─────────────────────────────────────────────
// 📱 ACCOUNT PHONE UPDATE - USING verifyAndUpdateaccountPhone
// ─────────────────────────────────────────────

// STEP 1: Send OTP to new phone number
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

// STEP 2: Verify OTP and update phone number
export const updateAccountPhoneVerifyOtp = async ({ userId, phoneNumber, otp }) => {
  console.log("════════════════════════════════════════");
  console.log("✅ [VERIFY OTP] STARTING");
  console.log("✅ [VERIFY OTP] userId:", userId);
  console.log("✅ [VERIFY OTP] phoneNumber:", phoneNumber);
  console.log("✅ [VERIFY OTP] otp:", otp);
  console.log("════════════════════════════════════════");
  
  // Get auth token from localStorage
  const authToken = localStorage.getItem("auth_token");
  console.log("✅ [VERIFY OTP] Auth Token:", authToken ? "EXISTS ✅" : "MISSING ❌");
  
  // CORRECT PAYLOAD - Exact format that works in Postman
  // Backend expects: _id, phoneNumber (number), otp (number)
  const payload = {
    _id: userId,
    phoneNumber: Number(phoneNumber),
    phoneNumberOTP: Number(otp)
  };
  
  console.log("📱 [REQUEST] POST /verifyAndUpdateaccountPhone");
  console.log("📱 Endpoint:", `${API_BASE_URL}/verifyAndUpdateaccountPhone`);
  console.log("📱 Payload:", JSON.stringify(payload, null, 2));
  console.log("📱 Method: POST");
  console.log("📱 Auth Token:", authToken ? "Included ✅" : "Missing ❌");
  
  try {
    // Make the API call with auth token
    const response = await fetch(`${API_BASE_URL}/verifyAndUpdateaccountPhone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload),
    });
    
    console.log("📱 Response Status:", response.status);
    console.log("📱 Response OK:", response.ok);
    
    const data = await response.json();
    console.log("📱 Response Data:", JSON.stringify(data, null, 2));
    
    // Check if response is successful
    if (response.ok && data.success) {
      console.log("✅ [SUCCESS] Phone number updated successfully!");
      console.log("════════════════════════════════════════");
      return data;
    }
    
    // If response is not successful, throw error with backend message
    const errorMsg = data.message || data.error || `HTTP ${response.status}`;
    console.log("❌ [FAILED] Backend Error:", errorMsg);
    throw new Error(errorMsg);
    
  } catch (error) {
    console.error("❌ [ERROR] OTP verification failed:", error.message);
    console.log("════════════════════════════════════════");
    throw error;
  }
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
  const list = Array.isArray(data) ? data : (data?.items || []);

  return list; // return full list, do NOT dedupe here
};

export const transformApiData = (apiResponse) => {
  let items = [];

if (apiResponse?.totalTest?.items) {
  items = apiResponse.totalTest.items;
}
else if (apiResponse?.totalRooms?.items) {
  items = apiResponse.totalRooms.items;
}
else if (apiResponse?.items) {
  items = apiResponse.items;
}
else if (apiResponse?.bookingData) {
  items = apiResponse.bookingData;
}
else if (Array.isArray(apiResponse)) {
  items = apiResponse;
}
else {
  console.log("⚠️ Unknown dashboard response format:", apiResponse);
}

if (!items || !items.length) return [];
return items.map((item) => {
   console.log(
    "DASHBOARD DEBUG:",
    item.nameOfWork,
    item.status,
    item.insepectorStatus
  );
let finalStatus = "Pending";

if (item.status === "reject") {
  finalStatus = "Rejected";
}
else if (item.insepectorStatus === "Done") {
  finalStatus = "Approved";
}
else {
  finalStatus = "Pending";
}return {
  id: item._id,
  workName: item.nameOfWork || "N/A",
  taluka: item.selectDivision || "N/A",
  contractorName: item.contractorName || item.userEmail?.split("@")[0] || "N/A",
  totalAmount: item.workOrderAmount || 0,

  panNumber: item.panNumber,
  aadhaarNumber: item.aadhaarNumber,
  registrationNumber: item.registrationNumber,

  documents: [
    item.workOrderDocument && { name: "Work Order", url: item.workOrderDocument },
    item.report && { name: "Report", url: item.report },
  ].filter(Boolean),

  materials: item.materials || [],

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
// 📋 REPORT APPROVAL ENDPOINTS
// ─────────────────────────────────────────────

/**
/**
 * Fetch pending reports for inspector dashboard
 * Handles multiple API response formats
 */
export const fetchInspectorDashboard = async () => {
  console.log("📊 [INSPECTOR DASHBOARD] Fetching pending reports...");
  
  try {
    const response = await fetch(`${API_BASE_URL}/inspector_dashboard`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    console.log("[fetchInspectorDashboard] Status:", response.status);
    console.log("[fetchInspectorDashboard] OK:", response.ok);

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(`API failed: ${response.status} - ${errJson.message || ""}`);
    }

    const data = await response.json();
    console.log("✅ Raw API Response:", JSON.stringify(data, null, 2));

    // Try multiple ways to extract items from response
    let items = [];

    // Format 1: { totalTest: { items: [...] } }
    if (data?.totalTest?.items && Array.isArray(data.totalTest.items)) {
      items = data.totalTest.items;
      console.log("✅ Using Format 1: totalTest.items");
    }
    // Format 2: { items: [...] }
    else if (data?.items && Array.isArray(data.items)) {
      items = data.items;
      console.log("✅ Using Format 2: items");
    }
    // Format 3: { data: [...] }
    else if (data?.data && Array.isArray(data.data)) {
      items = data.data;
      console.log("✅ Using Format 3: data");
    }
    // Format 4: Direct array
    else if (Array.isArray(data)) {
      items = data;
      console.log("✅ Using Format 4: Direct array");
    }
    // Format 5: { reports: [...] }
    else if (data?.reports && Array.isArray(data.reports)) {
      items = data.reports;
      console.log("✅ Using Format 5: reports");
    }
    // Format 6: { bookingData: [...] }
    else if (data?.bookingData && Array.isArray(data.bookingData)) {
      items = data.bookingData;
      console.log("✅ Using Format 6: bookingData");
    }
    // Format 7: Check all properties for arrays
    else {
      const arrayProps = Object.keys(data).filter(key => Array.isArray(data[key]));
      if (arrayProps.length > 0) {
        items = data[arrayProps[0]];
        console.log(`✅ Using Format 7: Found array in property "${arrayProps[0]}"`);
      }
    }

    console.log("📊 Extracted items count:", items.length);
    console.log("📊 Items data:", items);

    // Transform the items to match the table format
    const transformed = items.map((item) => {
      const report = {
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
    item.report && { name: "Report", url: item.report },
  ].filter(Boolean),
};
      console.log("📄 Transformed report:", report);
      return report;
    });

    console.log("✅ Total transformed reports:", transformed.length);
    return transformed;

  } catch (error) {
    console.error("❌ [INSPECTOR DASHBOARD] Error:", error.message);
    throw error;
  }
};

/**
 * Approve a report
 * Endpoint: POST /acceptReport
 * Body: { bookingId }
 */
export const acceptReport = async (bookingId) => {
  console.log("✅ [ACCEPT REPORT] Approving report:", bookingId);

  const response = await fetch(`${API_BASE_URL}/acceptReport`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookingId }),
  });

  console.log("[acceptReport] Status:", response.status);

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const errorMsg = errJson.error || errJson.message || `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  console.log("✅ [ACCEPT REPORT] Success:", data);
  return data;
};

/**
 * Reject a report with reason
 * Endpoint: POST /rejectReport
 * Body: { bookingId, reason }
 */
export const rejectReport = async (bookingId, reason) => {
  console.log("❌ [REJECT REPORT] Rejecting report:", bookingId);
  console.log("❌ [REJECT REPORT] Reason:", reason);

  const response = await fetch(`${API_BASE_URL}/rejectReport`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookingId, reason }),
  });

  console.log("[rejectReport] Status:", response.status);

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const errorMsg = errJson.error || errJson.message || `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  console.log("✅ [REJECT REPORT] Success:", data);
  return data;
};
export const uploadReport = async (file) => {
  console.log("📤 [UPLOAD REPORT] Uploading:", file.name);

  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/uploadReport`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Upload failed (${response.status})`);
  }

  const data = await response.json();

  if (!data.fileUrl || !data.publicUrl) {
    throw new Error("Upload succeeded but response missing fileUrl/publicUrl");
  }

  return data;
};export const uploadReportBlob = async (blob, fileName) => {
  console.log("📤 [UPLOAD BLOB] Uploading QR stamped PDF:", fileName);

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

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Blob upload failed (${response.status})`);
  }

  return await response.json();
};
export const submitReportWithQR = async ({ bookingId, fileUrl, editUrl, qrCodeUrl }) => {
  console.log("📝 [SUBMIT REPORT] bookingId:", bookingId);

  const response = await fetch(`${API_BASE_URL}/uploadFilewithQR`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      bookingId,
      fileUrl,
      editUrl,
      qrCodeUrl,
    }),
  });

  console.log("[submitReportWithQR] Status:", response.status);

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const errorMsg = errJson.error || errJson.message || `HTTP ${response.status}`;
    throw new Error(errorMsg);
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
  fetchInspectorDashboard,
  acceptReport,
  rejectReport,
  uploadReport,
  uploadReportBlob,
  submitReportWithQR,
};