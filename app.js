/**
 * CGSRLM (Bihaan) Surguja Monitoring App & Web Portal
 * Client Security & State Controller
 */

const STORAGE_KEYS = {
  GAS_URL: "bihaan_surguja_gas_url",
  TOKEN: "bihaan_surguja_session_token",
  USER: "bihaan_surguja_user_profile",
  DEVICE_FP: "bihaan_surguja_device_fp",
  THEME: "bihaan_surguja_theme",
  PIN_HASH: "bihaan_surguja_pin_hash",
  WEBAUTHN_CRED: "bihaan_surguja_webauthn_id",
  OFFLINE_QUEUE: "bihaan_surguja_offline_queue"
};

let currentUser = null;
let realAuthenticatedUser = null;
let devPreviewState = { active: false, role: "DEVELOPER", cadreType: "RBK", block: "अंबिकापुर (Ambikapur)", targetUserId: "" };
let allReports = [];
let allUsers = [];
let gsheetMasterUrl = "";
let regCategory = "DEPARTMENT";
let pinBuffer = "";
let blockChartInstance = null;
let gradeChartInstance = null;

// Safe HTML escaping to neutralize XSS
function escHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Persistent Device Fingerprint (Unique per browser/device; copied tokens fail on other devices)
async function getDeviceFingerprint() {
  let stored = localStorage.getItem(STORAGE_KEYS.DEVICE_FP);
  if (!stored) {
    const rand = crypto.getRandomValues(new Uint8Array(16));
    stored = Array.from(rand).map(b => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem(STORAGE_KEYS.DEVICE_FP, stored);
  }
  const raw = [stored, navigator.platform || "", (navigator.userAgent || "").slice(0, 80)].join("|");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getDeviceLabel() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "Android Mobile";
  if (/iPhone|iPad/i.test(ua)) return "iOS Device";
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Mac/i.test(ua)) return "Mac";
  return "Web Browser";
}

// Theme Management: Default Phone Mode ("system"), "light", "dark", "high-contrast"
function applyTheme(mode) {
  localStorage.setItem(STORAGE_KEYS.THEME, mode);
  const root = document.documentElement;
  if (mode === "system") {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", mode);
  }
  const sel = document.getElementById("themeSelect");
  if (sel) sel.value = mode;
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if ((localStorage.getItem(STORAGE_KEYS.THEME) || "system") === "system") {
    applyTheme("system");
  }
});

// Initialization on Page Load
window.addEventListener("DOMContentLoaded", async () => {
  applyTheme(localStorage.getItem(STORAGE_KEYS.THEME) || "system");
  applyLanguageUI();
  registerServiceWorker();
  populateStaticDropdowns();

  // Precompute device fingerprint once at startup for fast login & PIN unlock
  await getDeviceFingerprint();

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const savedUserStr = localStorage.getItem(STORAGE_KEYS.USER);

  if (token && savedUserStr) {
    try {
      currentUser = JSON.parse(savedUserStr);
      // Same device stays logged in; show quick Biometric/PIN unlock if configured, else verify & enter
      const hasPin = !!localStorage.getItem(STORAGE_KEYS.PIN_HASH);
      const hasBio = !!localStorage.getItem(STORAGE_KEYS.WEBAUTHN_CRED);
      if (hasPin || hasBio) {
        showUnlockScreen();
      } else {
        await verifySessionAndEnter();
      }
    } catch (e) {
      showAuthScreen();
    }
  } else {
    showAuthScreen();
  }
});

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function populateStaticDropdowns() {
  // Blocks
  const blockSelects = ["regBlock", "filterBlock", "formBlock", "devPreviewBlock"];
  blockSelects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    SURGUJA_BLOCKS.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      el.appendChild(opt);
    });
  });

  // Cadres
  const cadreSelects = ["regCadreSelect", "filterCadre", "formCadreType", "dirCadre", "devPreviewCadre"];
  cadreSelects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    Object.values(CADRE_SCHEMAS).forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.code;
      opt.textContent = c.titleHi;
      el.appendChild(opt);
    });
  });

  selectRegCategory("DEPARTMENT");
}

// ==========================================================================
// AUTHENTICATION & TWO-CATEGORY SIGN UP
// ==========================================================================
function switchAuthTab(tab) {
  document.getElementById("tabLoginBtn").classList.toggle("active", tab === "login");
  document.getElementById("tabRegisterBtn").classList.toggle("active", tab === "register");
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");
  hideAlert("authAlert");
}

function selectRegCategory(cat) {
  regCategory = cat;
  document.getElementById("catDeptBox").classList.toggle("selected", cat === "DEPARTMENT");
  document.getElementById("catOtherBox").classList.toggle("selected", cat === "CADRE_OTHERS");

  const roleSel = document.getElementById("regRoleSelect");
  roleSel.innerHTML = "";

  if (cat === "DEPARTMENT") {
    const deptRoles = [
      { value: "BPM", label: "विकासखंड परियोजना प्रबंधक (BPM - Block Mission Manager)" },
      { value: "BLOCK_COORD", label: "ब्लॉक समन्वयक (BC - IBCB / FI / Livelihoods / BRC)" },
      { value: "DMMU_STAFF", label: "जिला कार्यक्रम प्रबंधक (DPM - DMMU सरगुजा)" }
    ];
    deptRoles.forEach(r => {
      const o = document.createElement("option");
      o.value = r.value;
      o.textContent = r.label;
      roleSel.appendChild(o);
    });
    document.getElementById("regCadreWrap").classList.add("hidden");
  } else {
    const otherRoles = [
      { value: "CADRE", label: "सामुदायिक कैडर (PRP / सखी / CRP)" },
      { value: "CLF_ADMIN", label: "संकुल स्तरीय संगठन पदाधिकारी (CLF OB / लेखापाल)" },
      { value: "VO_ADMIN", label: "ग्राम संगठन पदाधिकारी (VO अध्यक्ष / सचिव / कोषाध्यक्ष)" }
    ];
    otherRoles.forEach(r => {
      const o = document.createElement("option");
      o.value = r.value;
      o.textContent = r.label;
      roleSel.appendChild(o);
    });
    document.getElementById("regCadreWrap").classList.remove("hidden");
  }
}

function onRegRoleChange() {
  const role = document.getElementById("regRoleSelect").value;
  document.getElementById("regCadreWrap").classList.toggle("hidden", role !== "CADRE");
}

function toggleApiConfigBox() {
  document.getElementById("apiConfigBox").classList.toggle("hidden");
}

function saveGasUrl() {
  const url = document.getElementById("gasUrlInput").value.trim();
  if (url) {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, url);
    showAlert("authAlert", "Google Apps Script API URL सुरक्षित किया गया।", "success");
  }
}

async function apiRequest(payload) {
  const gasUrl = localStorage.getItem(STORAGE_KEYS.GAS_URL);
  if (!gasUrl) {
    throw new Error("Google Apps Script URL is not set in this browser yet.");
  }
  const fp = await getDeviceFingerprint();
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || "";
  const fullPayload = {
    ...payload,
    token,
    deviceFingerprint: fp,
    deviceLabel: getDeviceLabel(),
    previewContext: (realAuthenticatedUser && realAuthenticatedUser.role === "DEVELOPER" && devPreviewState.active)
      ? devPreviewState
      : null
  };

  const res = await fetch(gasUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(fullPayload)
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (parseErr) {
    throw new Error("Apps Script ने वैध JSON नहीं भेजा। सुनिश्चित करें कि 'Who has access: Anyone' पर Deploy किया गया है।");
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById("loginSubmitBtn");
  btn.disabled = true;
  btn.textContent = "...";

  try {
    const loginId = document.getElementById("loginIdInput").value.trim();
    const password = document.getElementById("loginPassInput").value;
    const data = await apiRequest({ action: "login", loginId, password });

    if (!data || !data.ok) {
      showAlert("authAlert", (data && data.error) || "Invalid Login ID or Password.", "danger");
    } else {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      realAuthenticatedUser = data.user;
      currentUser = data.user;
      devPreviewState = { active: false, role: "DEVELOPER", cadreType: "RBK", block: "अंबिकापुर (Ambikapur)", targetUserId: "" };
      document.getElementById("authScreen").classList.add("hidden");
      document.getElementById("unlockScreen").classList.add("hidden");
      document.getElementById("appShell").classList.remove("hidden");
      await enterPortal(false, true);
    }
  } catch (err) {
    if (String(err && err.message || "").includes("URL is not set")) {
      const entered = window.prompt("Enter your Google Apps Script Web App URL (/exec):");
      if (entered && entered.trim()) {
        localStorage.setItem(STORAGE_KEYS.GAS_URL, entered.trim());
        try {
          const loginId = document.getElementById("loginIdInput").value.trim();
          const password = document.getElementById("loginPassInput").value;
          const retryData = await apiRequest({ action: "login", loginId, password });
          if (retryData && retryData.ok) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, retryData.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(retryData.user));
            realAuthenticatedUser = retryData.user;
            currentUser = retryData.user;
            devPreviewState = { active: false, role: "DEVELOPER", cadreType: "RBK", block: "अंबिकापुर (Ambikapur)", targetUserId: "" };
            document.getElementById("authScreen").classList.add("hidden");
            document.getElementById("unlockScreen").classList.add("hidden");
            document.getElementById("appShell").classList.remove("hidden");
            await enterPortal(false, true);
            return;
          } else {
            showAlert("authAlert", (retryData && retryData.error) || "Invalid Login ID or Password.", "danger");
            return;
          }
        } catch (retryErr) {
          showAlert("authAlert", retryErr.message || "Login failed.", "danger");
          return;
        }
      }
    }
    showAlert("authAlert", err.message || "Connection error during login.", "danger");
  } finally {
    btn.disabled = false;
    applyLanguageUI();
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  try {
    const role = document.getElementById("regRoleSelect").value;
    const payload = {
      action: "register",
      category: regCategory,
      role: role,
      cadreType: role === "CADRE" ? document.getElementById("regCadreSelect").value : "NONE",
      fullName: document.getElementById("regName").value.trim(),
      mobile: document.getElementById("regMobile").value.trim(),
      block: document.getElementById("regBlock").value,
      clf: document.getElementById("regClf").value.trim(),
      vo: document.getElementById("regVo").value.trim(),
      loginId: document.getElementById("regLoginId").value.trim(),
      password: document.getElementById("regPass").value
    };
    const data = await apiRequest(payload);
    if (!data.ok) {
      showAlert("authAlert", data.error, "danger");
    } else {
      showAlert("authAlert", data.message, "success");
      document.getElementById("registerForm").reset();
      switchAuthTab("login");
    }
  } catch (err) {
    showAlert("authAlert", err.message, "danger");
  }
}

async function verifySessionAndEnter() {
  try {
    if (!navigator.onLine && currentUser) {
      enterPortal();
      return;
    }
    const data = await apiRequest({ action: "verifySession" });
    if (data.ok && data.user) {
      realAuthenticatedUser = data.user;
      if (!devPreviewState.active) {
        currentUser = data.user;
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      enterPortal();
    } else {
      // Cleanly clear stale token and show login screen without glitch banners
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      currentUser = null;
      showAuthScreen();
    }
  } catch (err) {
    if (currentUser) enterPortal();
    else showAuthScreen();
  }
}

// ==========================================================================
// FINGERPRINT (WEBAUTHN) & 4-DIGIT PIN DEVICE UNLOCK
// ==========================================================================
function showUnlockScreen() {
  document.getElementById("authScreen").classList.add("hidden");
  document.getElementById("appShell").classList.add("hidden");
  document.getElementById("unlockScreen").classList.remove("hidden");

  document.getElementById("unlockUserName").textContent = currentUser.fullName;
  document.getElementById("unlockUserRole").textContent = `${currentUser.role} • ${currentUser.block}`;
  pinBuffer = "";
  updatePinDots();

  const hasBio = !!localStorage.getItem(STORAGE_KEYS.WEBAUTHN_CRED);
  document.getElementById("biometricUnlockBtn").classList.toggle("hidden", !hasBio);
}

function enterPinDigit(d) {
  if (pinBuffer.length >= 4) return;
  pinBuffer += d;
  updatePinDots();
  if (pinBuffer.length === 4) {
    verifyPinAndUnlock();
  }
}

function backspacePin() {
  pinBuffer = pinBuffer.slice(0, -1);
  updatePinDots();
}

function clearPin() {
  pinBuffer = "";
  updatePinDots();
}

function updatePinDots() {
  const dots = document.querySelectorAll("#pinDots .pin-dot");
  dots.forEach((dot, idx) => dot.classList.toggle("filled", idx < pinBuffer.length));
}

async function verifyPinAndUnlock() {
  const savedHash = localStorage.getItem(STORAGE_KEYS.PIN_HASH);
  if (!savedHash) {
    await verifySessionAndEnter();
    return;
  }
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("PIN::" + pinBuffer));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  if (hex === savedHash) {
    hideAlert("unlockAlert");
    if (currentUser) {
      enterPortal();
      verifySessionAndEnter();
    } else {
      await verifySessionAndEnter();
    }
  } else {
    pinBuffer = "";
    updatePinDots();
    showAlert("unlockAlert", "गलत PIN! पुनः प्रयास करें।", "danger");
  }
}

function bypassLockIfNoPin() {
  if (!localStorage.getItem(STORAGE_KEYS.PIN_HASH) && !localStorage.getItem(STORAGE_KEYS.WEBAUTHN_CRED)) {
    verifySessionAndEnter();
  } else {
    showAlert("unlockAlert", "इस डिवाइस पर सुरक्षा लॉक सक्रिय है। कृपया PIN या फिंगरप्रिंट का उपयोग करें।", "danger");
  }
}

async function saveDevicePin() {
  const pin = document.getElementById("newPinInput").value.trim();
  if (!/^\d{4}$/.test(pin)) {
    showAlert("globalAlert", "कृपया ठीक 4 अंकों का संख्यात्मक PIN दर्ज करें।", "danger");
    return;
  }
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("PIN::" + pin));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  localStorage.setItem(STORAGE_KEYS.PIN_HASH, hex);
  document.getElementById("newPinInput").value = "";
  showAlert("globalAlert", "4-अंकों का डिवाइस PIN सफलतापूर्वक सेट हो गया।", "success");
}

async function registerDeviceBiometric() {
  if (!window.PublicKeyCredential) {
    showAlert("globalAlert", "यह ब्राउज़र/डिवाइस बायोमेट्रिक WebAuthn का समर्थन नहीं करता।", "danger");
    return;
  }
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userIdBytes = new TextEncoder().encode(currentUser.userId);
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "CGSRLM बिहान सरगुजा" },
        user: { id: userIdBytes, name: currentUser.userId, displayName: currentUser.fullName },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000
      }
    });
    const rawId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
    localStorage.setItem(STORAGE_KEYS.WEBAUTHN_CRED, rawId);
    document.getElementById("biometricStatusText").textContent = "✅ इस डिवाइस पर फिंगरप्रिंट / बायोमेट्रिक लॉक सक्रिय है।";
    showAlert("globalAlert", "फिंगरप्रिंट / बायोमेट्रिक सुरक्षा सफलतापूर्वक जुड़ गई।", "success");
  } catch (err) {
    showAlert("globalAlert", "बायोमेट्रिक पंजीकरण रद्द या असफल: " + err.message, "danger");
  }
}

async function unlockWithBiometric() {
  try {
    const rawIdB64 = localStorage.getItem(STORAGE_KEYS.WEBAUTHN_CRED);
    if (!rawIdB64) return;
    const rawId = Uint8Array.from(atob(rawIdB64), c => c.charCodeAt(0));
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ type: "public-key", id: rawId }],
        userVerification: "required",
        timeout: 60000
      }
    });
    await verifySessionAndEnter();
  } catch (err) {
    showAlert("unlockAlert", "फिंगरप्रिंट सत्यापन विफल। कृपया PIN का उपयोग करें।", "danger");
  }
}

function lockAppNow() {
  showUnlockScreen();
}

async function logoutUser() {
  try { await apiRequest({ action: "logout" }); } catch (e) {}
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  currentUser = null;
  showAuthScreen();
}

function showAuthScreen() {
  document.getElementById("authScreen").classList.remove("hidden");
  document.getElementById("unlockScreen").classList.add("hidden");
  document.getElementById("appShell").classList.add("hidden");
}

// ==========================================================================
// MAIN PORTAL INITIALIZATION & ROLE-BASED ACCESS ENFORCEMENT
// ==========================================================================
async function enterPortal(skipSync = false, freshLogin = false) {
  if (!realAuthenticatedUser) realAuthenticatedUser = currentUser;
  document.getElementById("authScreen").classList.add("hidden");
  document.getElementById("unlockScreen").classList.add("hidden");
  document.getElementById("appShell").classList.remove("hidden");

  const isRealDev = realAuthenticatedUser && realAuthenticatedUser.role === "DEVELOPER";
  document.getElementById("devPerspectiveBar").classList.toggle("hidden", !isRealDev);

  const isAbsAdmin = !!currentUser.isAbsoluteAdmin; // DMMU, ZILLA_CEO, DEVELOPER
  document.getElementById("headerUserSubtitle").textContent =
    `${currentUser.fullName} | ${currentUser.block}${currentUser.clf && currentUser.clf !== "ALL" ? " • " + currentUser.clf : ""}`;
  document.getElementById("headerRoleBadge").textContent =
    isAbsAdmin ? `${currentUser.role} (पूर्ण अधिकार)` : `${currentUser.role}${currentUser.cadreType !== "NONE" ? " • " + currentUser.cadreType : ""}`;

  // Configure Role-Based UI Visibility
  document.getElementById("navAdminBtn").classList.toggle("hidden", !(isAbsAdmin || currentUser.role === "BPM" || currentUser.role === "CLF_ADMIN"));
  document.getElementById("districtDirectiveCard").classList.toggle("hidden", !isAbsAdmin);
  document.getElementById("adminSystemSettingsCard").classList.toggle("hidden", !isAbsAdmin);
  document.getElementById("auditLogCard").classList.toggle("hidden", !isAbsAdmin);
  document.getElementById("navDeletedBtn").classList.toggle("hidden", !isAbsAdmin);

  const t = I18N[currentLang] || I18N.en;
  const isCadreUser = currentUser.role === "CADRE";

  // Cadres see Dashboard & Grade only (no marks, no honorarium, no approval dropdown, no reviewer remarks)
  document.getElementById("totalScoreFieldWrap").classList.toggle("hidden", isCadreUser);
  document.getElementById("honorariumFieldWrap").classList.toggle("hidden", isCadreUser);
  document.getElementById("approvalActionWrap").classList.toggle("hidden", isCadreUser);
  document.getElementById("reviewerRemarksWrap").classList.toggle("hidden", isCadreUser);
  document.getElementById("gradeFieldWrap").classList.remove("hidden");

  // Honorarium KPI card is only for District & above / reviewers, not Cadres
  const honStatBox = document.getElementById("statHonorarium") ? document.getElementById("statHonorarium").closest(".stat-box") : null;
  const avgStatBox = document.getElementById("statAvgScore") ? document.getElementById("statAvgScore").closest(".stat-box") : null;
  if (honStatBox) honStatBox.classList.toggle("hidden", isCadreUser);
  if (avgStatBox) avgStatBox.classList.toggle("hidden", isCadreUser);

  if (isCadreUser) {
    document.getElementById("filterBlockWrap").classList.add("hidden");
    document.getElementById("filterCadreWrap").classList.add("hidden");
    document.getElementById("analyticsChartsSection").classList.add("hidden");
    document.getElementById("accessScopeNote").textContent = t.cadreScopeNote;
  } else if (!isAbsAdmin) {
    document.getElementById("filterBlockWrap").classList.toggle("hidden", currentUser.role === "BPM" || currentUser.role === "CLF_ADMIN" || currentUser.role === "VO_ADMIN");
    document.getElementById("filterCadreWrap").classList.remove("hidden");
    document.getElementById("analyticsChartsSection").classList.remove("hidden");
    document.getElementById("accessScopeNote").textContent = `${t.otherScopeNote} (${currentUser.block} / ${currentUser.clf})`;
  } else {
    document.getElementById("filterBlockWrap").classList.remove("hidden");
    document.getElementById("filterCadreWrap").classList.remove("hidden");
    document.getElementById("analyticsChartsSection").classList.remove("hidden");
    document.getElementById("accessScopeNote").textContent = t.adminScopeNote;
  }

  // Populate Settings Account Info
  document.getElementById("setUserId").value = currentUser.userId;
  document.getElementById("setRoleInfo").value = `${currentUser.category} — ${currentUser.role} (${currentUser.cadreType})`;
  document.getElementById("setJurisdiction").value = `Block: ${currentUser.block} | CLF: ${currentUser.clf} | VO: ${currentUser.vo}`;
  document.getElementById("setFullName").value = currentUser.fullName;
  document.getElementById("setMobile").value = currentUser.mobile || "";
  document.getElementById("adminGasUrl").value = localStorage.getItem(STORAGE_KEYS.GAS_URL) || "";

  if (localStorage.getItem(STORAGE_KEYS.WEBAUTHN_CRED)) {
    document.getElementById("biometricStatusText").textContent = "✅ इस डिवाइस पर फिंगरप्रिंट / बायोमेट्रिक लॉक सक्रिय है।";
  }

  resetReportForm();
  if (!skipSync) await syncData();
  else renderDashboard();
}

function switchMainTab(tabId, btnEl) {
  ["tabDashboard", "tabEntry", "tabAdmin", "tabDeleted", "tabSettings"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(tabId).classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  if (tabId === "tabDeleted") loadDeletedRecords();
}

async function syncData() {
  try {
    await flushOfflineQueue();
    const data = await apiRequest({ action: "getDashboardData", filters: {} });
    if (!data.ok) {
      if (String(data.error || "").includes("RELOGIN_REQUIRED") || String(data.error || "").includes("NEW_DEVICE_DETECTED") || String(data.error || "").includes("SESSION")) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return;
      }
      showAlert("globalAlert", data.error, "danger");
      return;
    }
    allReports = data.reports || [];
    allUsers = data.users || [];
    gsheetMasterUrl = data.gsheetUrl || "";

    // Only DMMU, Zilla CEO, and Developer get direct Google Sheet URL
    const gsLink = document.getElementById("gsheetDirectLink");
    const adminGsBtn = document.getElementById("adminGsheetBtn");
    if (currentUser.isAbsoluteAdmin && gsheetMasterUrl) {
      gsLink.href = gsheetMasterUrl;
      gsLink.classList.remove("hidden");
      adminGsBtn.href = gsheetMasterUrl;
    } else {
      gsLink.classList.add("hidden");
    }

    populateMonthFilter();
    renderDashboard();
    renderUsersTable();
    if (currentUser.isAbsoluteAdmin) {
      loadAuditLogs();
    }
  } catch (err) {
    showAlert("globalAlert", "Sync notice: " + err.message, "danger");
  }
}

function populateMonthFilter() {
  const sel = document.getElementById("filterMonth");
  const current = sel.value;
  const months = [...new Set(allReports.map(r => r.monthYear))].sort().reverse();
  sel.innerHTML = '<option value="ALL">सभी माह (All Months)</option>';
  months.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    sel.appendChild(opt);
  });
  if (months.includes(current)) sel.value = current;
}

// ==========================================================================
// DASHBOARD ANALYTICS, CHARTS & REPORTS TABLE
// ==========================================================================
function renderDashboard() {
  const mFilter = document.getElementById("filterMonth").value;
  const bFilter = document.getElementById("filterBlock").value;
  const cFilter = document.getElementById("filterCadre").value;

  const filtered = allReports.filter(r => {
    if (mFilter !== "ALL" && r.monthYear !== mFilter) return false;
    if (bFilter !== "ALL" && r.block !== bFilter) return false;
    if (cFilter !== "ALL" && r.cadreType !== cFilter) return false;
    return true;
  });

  // Update KPI Cards
  const total = filtered.length;
  const scored = filtered.filter(r => r.cadreType !== "PRP");
  const avgScore = scored.length ? (scored.reduce((s, r) => s + Number(r.totalScore || 0), 0) / scored.length).toFixed(1) : "0";
  const gradeA = filtered.filter(r => r.grade === "A").length;
  const gradeCD = filtered.filter(r => r.grade === "C" || r.grade === "D").length;
  const totalHon = filtered.reduce((s, r) => s + Number(r.honorarium || 0), 0);

  document.getElementById("statTotalReports").textContent = total;
  document.getElementById("statAvgScore").textContent = avgScore;
  document.getElementById("statGradeA").textContent = gradeA;
  document.getElementById("statGradeCD").textContent = gradeCD;
  document.getElementById("statHonorarium").textContent = "₹" + totalHon.toLocaleString("en-IN");

  renderReportsTable(filtered);
  if (currentUser.role !== "CADRE") {
    renderCharts(filtered);
  }
}

function renderReportsTable(list) {
  const tbody = document.getElementById("reportsTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-muted); padding:1.5rem;">कोई प्रतिवेदन उपलब्ध नहीं है।</td></tr>`;
    return;
  }

  const isAbsAdmin = !!currentUser.isAbsoluteAdmin;
  const canReview = ["VO_ADMIN", "CLF_ADMIN", "BPM", "DMMU", "ZILLA_CEO", "DEVELOPER"].includes(currentUser.role);

  list.forEach(r => {
    const tr = document.createElement("tr");
    const statusText = r.dmmuStatus === "APPROVED" ? "DMMU अनुमोदित"
      : r.bmmuStatus === "VERIFIED" ? "BMMU सत्यापित"
      : r.clfStatus === "APPROVED" ? "CLF अनुमोदित"
      : r.voStatus === "VERIFIED" ? "VO सत्यापित"
      : "समीक्षा लंबित";

    let actionBtns = `<button type="button" class="btn btn-outline btn-sm" onclick="openReportForEditOrReview('${escHtml(r.reportId)}')">${canReview ? "समीक्षा / देखें" : "देखें / एडिट"}</button>`;
    if (isAbsAdmin) {
      actionBtns += ` <button type="button" class="btn btn-danger btn-sm" onclick="deleteReport('${escHtml(r.reportId)}')">डिलीट</button>`;
    }

    const isCadreView = currentUser.role === "CADRE";
    tr.innerHTML = `
      <td><strong>${escHtml(r.monthYear)}</strong></td>
      <td>${escHtml(r.cadreType)}</td>
      <td>${escHtml(r.cadreName)}<br><small style="color:var(--text-muted)">${escHtml(r.mobile)}</small></td>
      <td>${escHtml(r.block)}<br><small style="color:var(--text-muted)">CLF: ${escHtml(r.clf)}${r.vo ? " | VO: " + escHtml(r.vo) : ""}</small></td>
      <td><strong>${isCadreView ? "—" : (r.cadreType === "PRP" ? "SOP" : escHtml(r.totalScore) + "/100")}</strong></td>
      <td><span class="badge badge-${escHtml(r.grade || 'B')}">${escHtml(r.grade || "-")}</span></td>
      <td>${isCadreView ? "—" : "₹" + Number(r.honorarium || 0).toLocaleString("en-IN")}</td>
      <td>${escHtml(statusText)}</td>
      <td class="no-print" style="white-space:nowrap;">${actionBtns}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCharts(list) {
  if (typeof Chart === "undefined") return;

  const styles = getComputedStyle(document.documentElement);
  const textColor = (styles.getPropertyValue("--text") || "#eef5f1").trim();
  const mutedColor = (styles.getPropertyValue("--text-muted") || "#9eb5a8").trim();
  const borderColor = (styles.getPropertyValue("--border") || "#283e33").trim();

  const blockLabels = SURGUJA_BLOCKS.map(b => b.split(" ")[0]);
  const blockCounts = SURGUJA_BLOCKS.map(b => list.filter(r => r.block === b).length);
  const blockAvgScores = SURGUJA_BLOCKS.map(b => {
    const sub = list.filter(r => r.block === b && r.cadreType !== "PRP");
    return sub.length ? Math.round(sub.reduce((s, r) => s + Number(r.totalScore || 0), 0) / sub.length) : 0;
  });

  const hasAnyBlockData = blockCounts.some(v => v > 0) || blockAvgScores.some(v => v > 0);

  if (blockChartInstance) blockChartInstance.destroy();
  blockChartInstance = new Chart(document.getElementById("blockChart"), {
    type: "bar",
    data: {
      labels: blockLabels,
      datasets: [
        { label: currentLang === "en" ? "Reports Submitted" : "जमा प्रतिवेदन संख्या", data: hasAnyBlockData ? blockCounts : [0,0,0,0,0,0,0,0], backgroundColor: "#22c55e" },
        { label: currentLang === "en" ? "Avg Score (/100)" : "औसत अंक (/100)", data: hasAnyBlockData ? blockAvgScores : [0,0,0,0,0,0,0,0], backgroundColor: "#f59e0b" }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: borderColor } },
        y: { beginAtZero: true, suggestedMax: 10, ticks: { color: mutedColor }, grid: { color: borderColor } }
      }
    }
  });

  const gA = list.filter(r => r.grade === "A").length;
  const gB = list.filter(r => r.grade === "B").length;
  const gC = list.filter(r => r.grade === "C").length;
  const gD = list.filter(r => r.grade === "D").length;
  const totalGrades = gA + gB + gC + gD;

  if (gradeChartInstance) gradeChartInstance.destroy();
  gradeChartInstance = new Chart(document.getElementById("gradeChart"), {
    type: "doughnut",
    data: {
      labels: totalGrades > 0
        ? (currentLang === "en" ? ["Grade A (80-100)", "Grade B (60-79)", "Grade C (40-59)", "Grade D (<40)"] : ["ग्रेड ए (80-100)", "ग्रेड बी (60-79)", "ग्रेड सी (40-59)", "ग्रेड डी (<40)"])
        : (currentLang === "en" ? ["No Grade Data Yet"] : ["कोई ग्रेड डेटा नहीं"]),
      datasets: [{
        data: totalGrades > 0 ? [gA, gB, gC, gD] : [1],
        backgroundColor: totalGrades > 0 ? ["#16a34a", "#2563eb", "#f59e0b", "#dc2626"] : ["#334155"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      radius: "82%",
      plugins: {
        legend: { position: "top", labels: { color: textColor, boxWidth: 14, font: { size: 11 } } }
      }
    }
  });
}

// ==========================================================================
// DYNAMIC 10-CADRE FORM BUILDER & AUTO-SCORING
// ==========================================================================
function resetReportForm() {
  document.getElementById("editingReportId").value = "";
  const cadreSel = document.getElementById("formCadreType");

  if (currentUser && currentUser.role === "CADRE" && CADRE_SCHEMAS[currentUser.cadreType]) {
    cadreSel.value = currentUser.cadreType;
    cadreSel.disabled = true; // Cadre can only fill their assigned format
  } else {
    cadreSel.disabled = false;
  }

  const now = new Date();
  document.getElementById("formMonthYear").value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (currentUser) {
    if (currentUser.block && currentUser.block !== "ALL") document.getElementById("formBlock").value = currentUser.block;
    if (currentUser.clf && currentUser.clf !== "ALL") document.getElementById("formClf").value = currentUser.clf;
    if (currentUser.vo && currentUser.vo !== "ALL") document.getElementById("formVo").value = currentUser.vo;
    if (currentUser.role === "CADRE") {
      document.getElementById("formCadreName").value = currentUser.fullName;
      document.getElementById("formMobile").value = currentUser.mobile || currentUser.userId;
    } else {
      document.getElementById("formCadreName").value = "";
      document.getElementById("formMobile").value = "";
    }
  }

  document.getElementById("formCadreRemarks").value = "";
  document.getElementById("formReviewerRemarks").value = "";
  document.getElementById("formHonorarium").value = "0";
  buildDynamicKpiForm();
}

function buildDynamicKpiForm(existingData = null) {
  const code = document.getElementById("formCadreType").value;
  const schema = CADRE_SCHEMAS[code];
  if (!schema) return;

  document.getElementById("formHeaderTitle").textContent = schema.titleHi;
  document.getElementById("formHierarchyNote").textContent = `समीक्षा प्रवाह: ${schema.hierarchy} (${schema.titleEn})`;
  const isCadreFormView = currentUser && currentUser.role === "CADRE";
  const marksTh = document.getElementById("kpiMarksColHeader");
  marksTh.classList.toggle("hidden", isCadreFormView);
  marksTh.textContent = schema.hasScoring ? "Marks (/Max)" : "Status";

  const tbody = document.getElementById("dynamicKpiBody");
  tbody.innerHTML = "";

  const canScore = currentUser && ["VO_ADMIN", "CLF_ADMIN", "BPM", "DMMU", "ZILLA_CEO", "DEVELOPER"].includes(currentUser.role);

  schema.sections.forEach(sec => {
    const secRow = document.createElement("tr");
    secRow.innerHTML = `<td colspan="${isCadreFormView ? 6 : 7}" style="background:var(--primary-soft); color:var(--primary); font-weight:700;">${escHtml(sec.name)}${sec.maxMarks ? ` — [कुल ${sec.maxMarks} अंक]` : ""}</td>`;
    tbody.appendChild(secRow);

    sec.kpis.forEach(kpi => {
      const savedKpi = existingData && existingData.kpis ? existingData.kpis.find(x => x.id === kpi.id) : null;
      const targetVal = savedKpi ? savedKpi.target : (kpi.defaultTarget || "");
      const achievedVal = savedKpi ? savedKpi.achieved : "";
      const pctVal = savedKpi ? savedKpi.pct : "";
      const marksVal = savedKpi ? savedKpi.marks : "";

      let savedPhotos = [];
      if (savedKpi && Array.isArray(savedKpi.evidencePhotos) && savedKpi.evidencePhotos.length) {
        savedPhotos = savedKpi.evidencePhotos;
      } else if (savedKpi && Array.isArray(savedKpi.evidencePhotoUrls) && savedKpi.evidencePhotoUrls.length) {
        savedPhotos = savedKpi.evidencePhotoUrls.map((u, idx) => ({
          name: (savedKpi.evidencePhotoNames && savedKpi.evidencePhotoNames[idx]) || ("Photo_" + (idx + 1) + ".jpg"),
          type: "image/jpeg",
          url: u,
          dataUrl: u
        }));
      } else if (savedKpi && savedKpi.evidencePhoto) {
        savedPhotos = [{
          name: savedKpi.evidenceFileName || "Photo_1.jpg",
          type: "image/jpeg",
          url: savedKpi.evidencePhoto.startsWith("http") ? savedKpi.evidencePhoto : "",
          dataUrl: savedKpi.evidencePhoto
        }];
      }
      const savedPhoto = savedPhotos.length ? (savedPhotos[0].dataUrl || savedPhotos[0].url || "") : "";
      const savedPhotoName = savedPhotos.map(x => x.name).join(", ");

      const tr = document.createElement("tr");
      tr.dataset.kpiId = kpi.id;
      tr.dataset.maxMarks = kpi.maxMarks || 0;
      tr.dataset.evidencePhoto = savedPhoto;
      tr.dataset.evidenceFileName = savedPhotoName;
      tr.dataset.evidencePhotosJson = JSON.stringify(savedPhotos);

      const statusPlaceholder = currentLang === "en" ? "Completed / In Progress" : "पूर्ण / प्रगतिशील";
      const marksCell = schema.hasScoring
        ? `<div style="display:flex; align-items:center; gap:4px;">
             <span>${kpi.maxMarks} /</span>
             <input type="number" class="kpi-marks" min="0" max="${kpi.maxMarks}" step="0.5"
               value="${escHtml(marksVal)}" ${canScore ? "" : "readonly title='Scores are entered at VO/CLF/DMMU review'"}
               oninput="recalculateTotals()" style="width:65px; padding:4px;" />
           </div>`
        : `<input type="text" class="kpi-marks" value="${escHtml(marksVal)}" placeholder="${escHtml(statusPlaceholder)}" style="padding:4px;" />`;

      const photoPreviewHtml = savedPhoto
        ? `<div class="kpi-photo-preview" style="margin-top:4px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
             <img src="${savedPhoto}" alt="Evidence" style="width:42px; height:42px; object-fit:cover; border-radius:6px; border:1px solid var(--border);" />
             <span style="font-size:0.72rem; color:var(--primary); word-break:break-all;">${escHtml(savedPhotoName || "Photo attached")}</span>
             <button type="button" class="btn btn-danger btn-sm" style="padding:2px 6px; font-size:0.7rem;" onclick="clearKpiEvidence(this)">✕</button>
           </div>`
        : `<div class="kpi-photo-preview" style="margin-top:4px;"></div>`;

      tr.innerHTML = `
        <td>${kpi.id}</td>
        <td>${escHtml(kpi.text)}</td>
        <td><input type="text" class="kpi-target" value="${escHtml(targetVal)}" oninput="calcRowPct(this)" style="padding:4px;" /></td>
        <td><input type="text" class="kpi-achieved" value="${escHtml(achievedVal)}" oninput="calcRowPct(this)" style="padding:4px;" /></td>
        <td><input type="text" class="kpi-pct" readonly tabindex="-1" value="${escHtml(pctVal)}" style="padding:4px; background:var(--surface-2); pointer-events:none; cursor:default;" /></td>
        <td class="${isCadreFormView ? 'hidden' : ''}">${marksCell}</td>
        <td>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">${escHtml(kpi.evidence)}</div>
          <label class="btn btn-outline btn-sm" style="padding:3px 8px; font-size:0.72rem; margin:0; cursor:pointer; display:inline-flex; white-space:nowrap;">
            <span data-i18n="uploadPhotosBtn">${currentLang === "en" ? "📷 Upload Photos" : "📷 फ़ोटो अपलोड करें"}</span>
            <input type="file" accept="image/*,.jpg,.jpeg,.png,.webp,.pdf" multiple style="display:none;" onchange="handleKpiEvidenceUpload(this)" />
          </label>
          <div class="kpi-photo-preview" style="margin-top:4px;"></div>
        </td>
      `;
      tbody.appendChild(tr);
      renderKpiPhotosPreview_(tr);
    });
  });

  // Render Section E fields
  const secEDiv = document.getElementById("dynamicSectionE");
  secEDiv.innerHTML = "";
  schema.sectionEFields.forEach(f => {
    const val = existingData && existingData.sectionE ? (existingData.sectionE[f.key] ?? "") : "";
    const wrap = document.createElement("div");
    wrap.className = "field";
    wrap.innerHTML = `
      <label>${escHtml(f.label)}</label>
      <input type="${f.type === 'number' ? 'number' : 'text'}" data-sec-e-key="${escHtml(f.key)}" value="${escHtml(val)}" />
    `;
    secEDiv.appendChild(wrap);
  });

  recalculateTotals();
}


function compressImageToDataUrl_(file, maxWidth = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = e => resolve(String(e.target.result || ""));
      r.onerror = reject;
      r.readAsDataURL(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = err => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

function renderKpiPhotosPreview_(tr) {
  const prevDiv = tr.querySelector(".kpi-photo-preview");
  if (!prevDiv) return;
  let photos = [];
  try { photos = JSON.parse(tr.dataset.evidencePhotosJson || "[]"); } catch (e) { photos = []; }
  if (!photos.length) {
    prevDiv.innerHTML = "";
    return;
  }
  prevDiv.innerHTML = photos.map((p, idx) => {
    const src = p.dataUrl || p.url || "";
    const isImg = String(p.type || "").startsWith("image/") || src.startsWith("data:image/") || !!p.url;
    const thumb = isImg && src
      ? `<img src="${src}" alt="${escHtml(p.name)}" style="width:38px; height:38px; object-fit:cover; border-radius:6px; border:1px solid var(--border);" />`
      : `<span style="font-size:0.72rem; padding:2px 6px; border-radius:4px; background:var(--surface-2);">📄</span>`;
    const linkOpen = p.url ? `<a href="${escHtml(p.url)}" target="_blank" rel="noopener noreferrer" style="font-size:0.7rem; color:var(--primary);">Drive Link</a>` : "";
    return `
      <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap; margin-top:4px; background:var(--surface-2); padding:3px 6px; border-radius:6px;">
        ${thumb}
        <span style="font-size:0.7rem; color:var(--text); word-break:break-all;">${escHtml(p.name || ("Photo " + (idx + 1)))}</span>
        ${linkOpen}
        <button type="button" class="btn btn-danger btn-sm" style="padding:1px 5px; font-size:0.68rem;" onclick="removeKpiPhotoAt(this, ${idx})">✕</button>
      </div>
    `;
  }).join("");
}

async function handleKpiEvidenceUpload(fileInput) {
  const files = Array.from(fileInput.files || []);
  if (!files.length) return;
  const tr = fileInput.closest("tr");
  if (!tr) return;

  let existing = [];
  try { existing = JSON.parse(tr.dataset.evidencePhotosJson || "[]"); } catch (e) { existing = []; }

  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      showAlert("globalAlert", "File too large (>10 MB): " + file.name, "danger");
      continue;
    }
    try {
      const dataUrl = await compressImageToDataUrl_(file, 900, 0.72);
      existing.push({
        name: file.name,
        type: file.type || "image/jpeg",
        dataUrl: dataUrl,
        url: ""
      });
    } catch (err) {
      showAlert("globalAlert", "Could not read photo: " + file.name, "danger");
    }
  }

  tr.dataset.evidencePhotosJson = JSON.stringify(existing);
  tr.dataset.evidencePhoto = existing.length ? (existing[0].dataUrl || existing[0].url || "") : "";
  tr.dataset.evidenceFileName = existing.map(x => x.name).join(", ");
  fileInput.value = "";
  renderKpiPhotosPreview_(tr);
}

function removeKpiPhotoAt(btnEl, idx) {
  const tr = btnEl.closest("tr");
  if (!tr) return;
  let existing = [];
  try { existing = JSON.parse(tr.dataset.evidencePhotosJson || "[]"); } catch (e) { existing = []; }
  existing.splice(idx, 1);
  tr.dataset.evidencePhotosJson = JSON.stringify(existing);
  tr.dataset.evidencePhoto = existing.length ? (existing[0].dataUrl || existing[0].url || "") : "";
  tr.dataset.evidenceFileName = existing.map(x => x.name).join(", ");
  renderKpiPhotosPreview_(tr);
}

function clearKpiEvidence(btnEl) {
  const tr = btnEl.closest("tr");
  if (!tr) return;
  tr.dataset.evidencePhotosJson = "[]";
  tr.dataset.evidencePhoto = "";
  tr.dataset.evidenceFileName = "";
  const fileInp = tr.querySelector('input[type="file"]');
  if (fileInp) fileInp.value = "";
  renderKpiPhotosPreview_(tr);
}

function extractNum_(val) {
  const m = String(val || "").match(/[-+]?\d*\.?\d+/);
  return m ? parseFloat(m[0]) : NaN;
}

function calcRowPct(inputEl) {
  const tr = inputEl.closest("tr");
  const tRaw = tr.querySelector(".kpi-target").value.trim();
  const aRaw = tr.querySelector(".kpi-achieved").value.trim();
  const t = extractNum_(tRaw);
  const a = extractNum_(aRaw);
  const pctInput = tr.querySelector(".kpi-pct");
  const marksInput = tr.querySelector(".kpi-marks");
  const maxMarks = parseFloat(tr.dataset.maxMarks || 0);

  if (!isNaN(t) && t > 0 && !isNaN(a)) {
    const rawPct = Math.round((a / t) * 100);
    pctInput.value = rawPct + "%";
    const ratio = Math.min(1, Math.max(0, a / t));
    if (marksInput && marksInput.type === "number" && maxMarks > 0) {
      marksInput.value = Number((ratio * maxMarks).toFixed(1));
      recalculateTotals();
    }
  } else if (aRaw && ["completed", "complete", "done", "yes", "पूर्ण", "हाँ", "मासिक", "वार्षिक"].includes(aRaw.toLowerCase()) || (tRaw && aRaw && tRaw.toLowerCase() === aRaw.toLowerCase())) {
    pctInput.value = "100%";
  } else {
    pctInput.value = "";
    if (marksInput && marksInput.type === "number" && maxMarks > 0) {
      marksInput.value = "";
      recalculateTotals();
    }
  }
}

function recalculateTotals() {
  const code = document.getElementById("formCadreType").value;
  const schema = CADRE_SCHEMAS[code];
  if (!schema || !schema.hasScoring) {
    document.getElementById("formTotalScore").value = 0;
    document.getElementById("formGrade").value = "SOP";
    return;
  }
  let sum = 0;
  document.querySelectorAll("#dynamicKpiBody .kpi-marks").forEach(inp => {
    const v = parseFloat(inp.value);
    if (!isNaN(v)) sum += v;
  });
  document.getElementById("formTotalScore").value = sum;
  let grade = "D";
  if (sum >= 80) grade = "A";
  else if (sum >= 60) grade = "B";
  else if (sum >= 40) grade = "C";
  document.getElementById("formGrade").value = grade;
}

function openReportForEditOrReview(reportId) {
  const rep = allReports.find(r => r.reportId === reportId);
  if (!rep) return;

  switchMainTab("tabEntry", document.getElementById("navEntryBtn"));
  document.getElementById("editingReportId").value = rep.reportId;
  document.getElementById("formCadreType").value = rep.cadreType;
  document.getElementById("formCadreType").disabled = true;
  document.getElementById("formMonthYear").value = rep.monthYear;
  document.getElementById("formBlock").value = rep.block;
  document.getElementById("formClf").value = rep.clf;
  document.getElementById("formVo").value = rep.vo || "";
  document.getElementById("formGp").value = rep.gp || "";
  document.getElementById("formCadreName").value = rep.cadreName;
  document.getElementById("formMobile").value = rep.mobile;
  document.getElementById("formAllocVo").value = rep.allocatedVO || "";
  document.getElementById("formAllocShg").value = rep.allocatedSHG || "";
  document.getElementById("formCadreRemarks").value = rep.cadreRemarks || "";
  document.getElementById("formReviewerRemarks").value = rep.clfRemarks || rep.voRemarks || "";
  document.getElementById("formHonorarium").value = rep.honorarium || 0;

  buildDynamicKpiForm(rep);
}

async function submitMonthlyReport(e) {
  e.preventDefault();
  const kpis = [];
  document.querySelectorAll("#dynamicKpiBody tr[data-kpi-id]").forEach(tr => {
    kpis.push({
id: Number(tr.dataset.kpiId),
      target: tr.querySelector(".kpi-target").value.trim(),
      achieved: tr.querySelector(".kpi-achieved").value.trim(),
      pct: tr.querySelector(".kpi-pct").value.trim(),
      marks: tr.querySelector(".kpi-marks").value.trim(),
      evidencePhoto: tr.dataset.evidencePhoto || "",
      evidenceFileName: tr.dataset.evidenceFileName || "",
      evidencePhotos: (() => { try { return JSON.parse(tr.dataset.evidencePhotosJson || "[]"); } catch (e) { return []; } })()
    });
  });

  const sectionE = {};
  document.querySelectorAll("#dynamicSectionE [data-sec-e-key]").forEach(inp => {
    sectionE[inp.dataset.secEKey] = inp.value.trim();
  });

  const editingId = document.getElementById("editingReportId").value;
  const reviewAction = document.getElementById("formReviewAction").value;

  const reportPayload = {
    reportId: editingId || ("REP-" + Date.now()),
    cadreType: document.getElementById("formCadreType").value,
    monthYear: document.getElementById("formMonthYear").value,
    block: document.getElementById("formBlock").value,
    clf: document.getElementById("formClf").value.trim(),
    vo: document.getElementById("formVo").value.trim(),
    gp: document.getElementById("formGp").value.trim(),
    cadreName: document.getElementById("formCadreName").value.trim(),
    mobile: document.getElementById("formMobile").value.trim(),
    allocatedVO: document.getElementById("formAllocVo").value.trim(),
    allocatedSHG: document.getElementById("formAllocShg").value.trim(),
    kpis,
    sectionE,
    totalScore: Number(document.getElementById("formTotalScore").value || 0),
    grade: document.getElementById("formGrade").value,
    honorarium: Number(document.getElementById("formHonorarium").value || 0),
    cadreRemarks: document.getElementById("formCadreRemarks").value.trim(),
    voStatus: reviewAction === "VO_VERIFIED" ? "VERIFIED" : undefined,
    voRemarks: document.getElementById("formReviewerRemarks").value.trim(),
    clfStatus: reviewAction === "CLF_APPROVED" ? "APPROVED" : undefined,
    clfRemarks: document.getElementById("formReviewerRemarks").value.trim(),
    bmmuStatus: reviewAction === "BMMU_VERIFIED" ? "VERIFIED" : undefined,
    dmmuStatus: reviewAction === "DMMU_APPROVED" ? "APPROVED" : undefined
  };

  try {
    if (!navigator.onLine) {
      queueOfflineReport(reportPayload);
      showAlert("globalAlert", "इंटरनेट उपलब्ध नहीं है — प्रतिवेदन ऑफ़लाइन सुरक्षित किया गया है और ऑनलाइन होते ही सिंक हो जाएगा।", "success");
      switchMainTab("tabDashboard", document.querySelector("[data-tab=tabDashboard]"));
      return;
    }

    const isReviewerEdit = editingId && ["VO_ADMIN", "CLF_ADMIN", "BPM", "DMMU", "ZILLA_CEO", "DEVELOPER"].includes(currentUser.role);
    const res = isReviewerEdit
      ? await apiRequest({ action: "reviewReport", ...reportPayload })
      : await apiRequest({ action: "submitReport", report: reportPayload });

    if (!res.ok) {
      showAlert("globalAlert", res.error, "danger");
    } else {
      showAlert("globalAlert", res.message, "success");
      await syncData();
      switchMainTab("tabDashboard", document.querySelector("[data-tab=tabDashboard]"));
    }
  } catch (err) {
    showAlert("globalAlert", err.message, "danger");
  }
}

function queueOfflineReport(rep) {
  const q = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || "[]");
  q.push(rep);
  localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(q));
}

async function flushOfflineQueue() {
  if (!navigator.onLine) return;
  const q = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || "[]");
  if (q.length === 0) return;
  for (const rep of q) {
    await apiRequest({ action: "submitReport", report: rep });
  }
  localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
}

// ==========================================================================
// DMMU / ZILLA CEO / DEVELOPER EXCLUSIVE CONTROLS
// ==========================================================================
async function deleteReport(reportId) {
  if (!currentUser.isAbsoluteAdmin) return;
  if (!confirm("क्या आप वाकई इस प्रतिवेदन को स्थायी रूप से हटाना (Delete) चाहते हैं?")) return;
  try {
    const res = await apiRequest({ action: "deleteReport", reportId });
    if (!res.ok) showAlert("globalAlert", res.error, "danger");
    else {
      showAlert("globalAlert", res.message, "success");
      await syncData();
    }
  } catch (err) {
    showAlert("globalAlert", err.message, "danger");
  }
}

function renderUsersTable() {
  if (realAuthenticatedUser && realAuthenticatedUser.role === "DEVELOPER") {
    const specSel = document.getElementById("devPreviewSpecificUser");
    if (specSel) {
      const prevVal = specSel.value;
      specSel.innerHTML = '<option value="">-- पंजीकृत यूज़र चुनें --</option>';
      allUsers.forEach(u => {
        if (u.role === "DEVELOPER") return;
        const opt = document.createElement("option");
        opt.value = u.userId;
        opt.textContent = `${u.fullName} (${u.role}${u.cadreType !== "NONE" ? " - " + u.cadreType : ""} | ${u.block})`;
        specSel.appendChild(opt);
      });
      if (prevVal) specSel.value = prevVal;
    }
  }

  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const isAbsAdmin = !!currentUser.isAbsoluteAdmin;

  allUsers.forEach(u => {
    const tr = document.createElement("tr");
    let actions = "";
    if (u.status === "PENDING") {
      actions += `<button type="button" class="btn btn-primary btn-sm" onclick="manageUser('${escHtml(u.userId)}', 'APPROVE')">स्वीकृत करें</button> `;
    } else if (u.status === "ACTIVE" && !["DMMU", "ZILLA_CEO", "DEVELOPER"].includes(u.role)) {
      actions += `<button type="button" class="btn btn-outline btn-sm" onclick="manageUser('${escHtml(u.userId)}', 'SUSPEND')">निलंबित</button> `;
    }
    if (isAbsAdmin && !["DMMU", "ZILLA_CEO", "DEVELOPER"].includes(u.role)) {
      actions += `<button type="button" class="btn btn-danger btn-sm" onclick="manageUser('${escHtml(u.userId)}', 'DELETE')">हटाएं</button>`;
    }

    tr.innerHTML = `
      <td><strong>${escHtml(u.userId)}</strong></td>
      <td>${escHtml(u.fullName)}<br><small>${escHtml(u.mobile)}</small></td>
      <td>${escHtml(u.category)}</td>
      <td>${escHtml(u.role)}</td>
      <td>${escHtml(u.cadreType)}</td>
      <td>${escHtml(u.block)} / ${escHtml(u.clf)}</td>
      <td><span class="badge ${u.status === 'ACTIVE' ? 'badge-A' : 'badge-C'}">${escHtml(u.status)}</span></td>
      <td><small>${escHtml(u.lastLoginDevice || "-")}</small></td>
      <td>${actions || "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function manageUser(targetUserId, operation) {
  if (operation === "DELETE" && !confirm("क्या आप इस यूज़र खाते को स्थायी रूप से हटाना चाहते हैं?")) return;
  try {
    const res = await apiRequest({ action: "manageUser", targetUserId, operation });
    if (!res.ok) showAlert("globalAlert", res.error, "danger");
    else {
      showAlert("globalAlert", res.message, "success");
      await syncData();
    }
  } catch (err) {
    showAlert("globalAlert", err.message, "danger");
  }
}

async function saveDistrictDirective(e) {
  e.preventDefault();
  try {
    const directive = {
      monthYear: document.getElementById("dirMonth").value,
      cadreType: document.getElementById("dirCadre").value,
      top1: document.getElementById("dirTop1").value.trim(),
      top2: document.getElementById("dirTop2").value.trim(),
      top3: document.getElementById("dirTop3").value.trim(),
      trainingBlock: document.getElementById("dirTraining").value.trim(),
      trainingDate: "",
      remarks: document.getElementById("dirRemarks").value.trim()
    };
    const res = await apiRequest({ action: "saveDirective", directive });
    if (!res.ok) showAlert("globalAlert", res.error, "danger");
    else showAlert("globalAlert", res.message, "success");
  } catch (err) {
    showAlert("globalAlert", err.message, "danger");
  }
}

async function loadAuditLogs() {

let allDeletedRecords = [];

async function loadDeletedRecords() {
  if (!currentUser || !currentUser.isAbsoluteAdmin) return;
  try {
    const res = await apiRequest({ action: "getDeletedRecords" });
    if (!res.ok) return;
    allDeletedRecords = res.deleted || [];
    renderDeletedRecords();
  } catch (e) {}
}

function renderDeletedRecords() {
  const tbody = document.getElementById("deletedRecordsBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!allDeletedRecords.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-muted); padding:1.25rem;">${currentLang === "en" ? "No deleted records found." : "कोई हटाया गया रिकॉर्ड नहीं मिला।"}</td></tr>`;
    return;
  }
  allDeletedRecords.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><small>${escHtml(d.deletedAt)}</small></td>
      <td><strong>${escHtml(d.deletedBy)}</strong></td>
      <td>${escHtml(d.deletedByRole)}</td>
      <td><small>${escHtml(d.reportId)}</small></td>
      <td>${escHtml(d.monthYear)}</td>
      <td>${escHtml(d.cadreType)}</td>
      <td>${escHtml(d.cadreName)}</td>
      <td>${escHtml(d.block)} / ${escHtml(d.clf)}</td>
      <td><strong>${escHtml(d.totalScore)}</strong> (${escHtml(d.grade || "-")})</td>
    `;
    tbody.appendChild(tr);
  });
}

  try {
    const res = await apiRequest({ action: "getAuditLogs" });
    if (!res.ok) return;
    const tbody = document.getElementById("auditLogsBody");
    tbody.innerHTML = "";
    (res.logs || []).forEach(l => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><small>${escHtml(l.timestamp)}</small></td>
        <td><strong>${escHtml(l.actorId)}</strong></td>
        <td>${escHtml(l.actorRole)}</td>
        <td>${escHtml(l.action)}</td>
        <td>${escHtml(l.targetId)}</td>
        <td><small>${escHtml(l.details)}</small></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {}
}

async function updateAccountSettings(e) {
  e.preventDefault();
  try {
    const fullName = document.getElementById("setFullName").value.trim();
    const mobile = document.getElementById("setMobile").value.trim();
    const newPassword = document.getElementById("setNewPassword").value;
    const res = await apiRequest({ action: "updateProfileAndPassword", fullName, mobile, newPassword });
    if (!res.ok) showAlert("globalAlert", res.error, "danger");
    else {
      currentUser.fullName = fullName;
      currentUser.mobile = mobile;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      document.getElementById("setNewPassword").value = "";
      showAlert("globalAlert", res.message, "success");
    }
  } catch (err) {
    showAlert("globalAlert", err.message, "danger");
  }
}

function saveAdminGasUrl() {
  const url = document.getElementById("adminGasUrl").value.trim();
  if (url) {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, url);
    showAlert("globalAlert", "API Endpoint URL अपडेट किया गया।", "success");
  }
}

function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert ${type === "danger" ? "alert-danger" : "alert-success"}`;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 6000);
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

// ==========================================================================
// DEVELOPER IN-APP MULTI-ROLE PERSPECTIVE SWITCHER ("VIEW AS")
// ==========================================================================
function onDevPreviewRoleChange() {
  const role = document.getElementById("devPreviewRole").value;
  document.getElementById("devPreviewCadre").classList.toggle("hidden", role !== "CADRE");
  document.getElementById("devPreviewBlock").classList.toggle("hidden", !["BPM", "CLF_ADMIN", "VO_ADMIN", "CADRE"].includes(role));
  document.getElementById("devPreviewSpecificUser").classList.toggle("hidden", role !== "SPECIFIC_USER");
  applyDevPerspective();
}

async function applyDevPerspective() {
  if (!realAuthenticatedUser || realAuthenticatedUser.role !== "DEVELOPER") return;
  const roleChoice = document.getElementById("devPreviewRole").value;

  if (roleChoice === "DEVELOPER") {
    await resetDevPerspective();
    return;
  }

  if (roleChoice === "SPECIFIC_USER") {
    const targetUserId = document.getElementById("devPreviewSpecificUser").value;
    if (!targetUserId) return;
    const found = allUsers.find(u => u.userId === targetUserId);
    if (!found) return;
    devPreviewState = {
      active: true,
      role: found.role,
      cadreType: found.cadreType,
      block: found.block,
      targetUserId: found.userId
    };
    currentUser = { ...found, isPreviewMode: true };
    document.getElementById("devPreviewStatusBadge").textContent = `Viewing As: ${found.fullName} (${found.role})`;
  } else {
    const cadreType = document.getElementById("devPreviewCadre").value || "RBK";
    const block = document.getElementById("devPreviewBlock").value || "अंबिकापुर (Ambikapur)";
    const isAbs = ["DMMU", "ZILLA_CEO"].includes(roleChoice);

    devPreviewState = {
      active: true,
      role: roleChoice,
      cadreType,
      block,
      targetUserId: ""
    };

    currentUser = {
      userId: "PREVIEW_" + roleChoice,
      fullName: `[Preview] ${roleChoice}${roleChoice === "CADRE" ? " - " + cadreType : ""}`,
      category: ["DMMU", "ZILLA_CEO", "BPM"].includes(roleChoice) ? "DEPARTMENT" : "CADRE_OTHERS",
      role: roleChoice,
      cadreType: roleChoice === "CADRE" ? cadreType : "NONE",
      block: isAbs ? "ALL" : block,
      clf: isAbs || roleChoice === "BPM" ? "ALL" : "Demo CLF (" + block.split(" ")[0] + ")",
      vo: ["VO_ADMIN", "CADRE"].includes(roleChoice) ? "Demo VO" : "ALL",
      mobile: "9999999999",
      status: "ACTIVE",
      isAbsoluteAdmin: isAbs,
      isPreviewMode: true
    };
    document.getElementById("devPreviewStatusBadge").textContent =
      `Viewing As: ${roleChoice}${roleChoice === "CADRE" ? " (" + cadreType + ")" : ""} • ${isAbs ? "Full District" : block}`;
  }

  switchMainTab("tabDashboard", document.querySelector("[data-tab=tabDashboard]"));
  await enterPortal();
}

async function resetDevPerspective() {
  if (!realAuthenticatedUser) return;
  devPreviewState = { active: false, role: "DEVELOPER", cadreType: "RBK", block: "अंबिकापुर (Ambikapur)", targetUserId: "" };
  document.getElementById("devPreviewRole").value = "DEVELOPER";
  document.getElementById("devPreviewCadre").classList.add("hidden");
  document.getElementById("devPreviewBlock").classList.add("hidden");
  document.getElementById("devPreviewSpecificUser").classList.add("hidden");
  document.getElementById("devPreviewStatusBadge").textContent = "Active: Developer Root";
  currentUser = realAuthenticatedUser;
  switchMainTab("tabDashboard", document.querySelector("[data-tab=tabDashboard]"));
  await enterPortal();
}

let currentLang = localStorage.getItem("bihaan_surguja_lang") || "en";

const FULL_I18N = {
  en: {
    brandTitle: "CGSRLM Bihan — District Surguja",
    brandSub: "Monthly Cadre Review & Monitoring Portal",
    loginTab: "Login",
    registerTab: "Register",
    loginIdLabel: "Login ID or Mobile Number",
    passwordLabel: "Password",
    signInBtn: "Sign In",
    loginHint: "Password required on new devices • Quick unlock with PIN or fingerprint after first sign-in",
    sync: "🔄 Sync",
    lock: "🔒 Lock",
    navDashboard: "📊 Dashboard",
    navEntry: "📝 Monthly Report",
    navAdmin: "🛡️ Admin & Users",
    navSettings: "⚙️ Settings",
    clearFilter: "✕ Remove Filter",
    printPdf: "🖨️ Print / PDF",
    saveBtn: "💾 Save",
    statTotal: "Total Reports",
    statAvg: "Avg Score (/100)",
    statGradeA: "Grade-A Cadres",
    statGradeCD: "Grade-C/D Cadres",
    statHon: "Recommended Honorarium (₹)",
    cadreScopeNote: "Cadre View: Grade only (marks & honorarium hidden). Dashboard & your report entries shown.",
    otherScopeNote: "Jurisdiction View: Scoped data & review access.",
    adminScopeNote: "District & Above Full Access: Marks, Grades, Analytics, Edit/Delete & Google Sheet.",
    filterMonthLbl: "Month & Year",
    filterBlockLbl: "Block",
    filterCadreLbl: "Cadre Type",
    allMonthsOpt: "All Months",
    allBlocksOpt: "All Blocks (Surguja)",
    allCadresOpt: "All Cadres",
    blockChartTitle: "Block-wise Reports & Average Score",
    gradeChartTitle: "Cadre Performance & Grade Distribution",
    reportListTitle: "Monthly Cadre Reports",
    thMonth: "Month/Year",
    thCadre: "Cadre",
    thNameMobile: "Name / Mobile",
    thJurisdiction: "Block / CLF / VO",
    thScore: "Score",
    thGrade: "Grade",
    thHonorarium: "Honorarium (₹)",
    thStatus: "Review Status",
    thAction: "Action",
    thSno: "No.",
    thKpi: "Review Points / Action Indicators (KPIs)",
    thTarget: "Monthly Target",
    thAchieved: "Complete Achievement",
    thPct: "Progress %",
    thMarks: "Marks (/Max)",
    thEvidence: "Verification Evidence",
    uploadPhotosBtn: "📷 Upload Photos",
    deletedTabTitle: "Deleted Records & Who Deleted Them",
    refreshBtn: "Refresh",
    thDeletedAt: "Deleted At",
    thDeletedBy: "Deleted By",
    thRole: "Role",
    thReportId: "Report ID"
  },
  hi: {
    brandTitle: "सीजीएसआरएलएम बिहान — जिला सरगुजा",
    brandSub: "मासिक कैडर समीक्षा एवं अनुश्रवण पोर्टल",
    loginTab: "लॉगिन",
    registerTab: "पंजीकरण",
    loginIdLabel: "लॉगिन आईडी या मोबाइल नंबर",
    passwordLabel: "पासवर्ड",
    signInBtn: "लॉगिन करें",
    loginHint: "नए डिवाइस पर पासवर्ड अनिवार्य • पहली बार लॉगिन के बाद पिन या फिंगरप्रिंट से अनलॉक करें",
    sync: "🔄 सिंक",
    lock: "🔒 लॉक",
    navDashboard: "📊 डैशबोर्ड",
    navEntry: "📝 मासिक प्रतिवेदन",
    navAdmin: "🛡️ एडमिन व यूज़र",
    navSettings: "⚙️ सेटिंग्स",
    clearFilter: "✕ फ़िल्टर हटाएं",
    printPdf: "🖨️ प्रिंट / पीडीएफ",
    saveBtn: "💾 सहेजें",
    statTotal: "कुल प्रतिवेदन",
    statAvg: "औसत अंक (/100)",
    statGradeA: "ग्रेड-ए कैडर",
    statGradeCD: "ग्रेड-सी/डी कैडर",
    statHon: "अनुशंसित मानदेय (₹)",
    cadreScopeNote: "कैडर दृश्य: केवल ग्रेड दिखता है (अंक व मानदेय छिपे हैं)। डैशबोर्ड व आपके भरने योग्य विवरण उपलब्ध हैं।",
    otherScopeNote: "कार्यक्षेत्र दृश्य: सीमित डेटा एवं समीक्षा पहुँच।",
    adminScopeNote: "जिला एवं उच्च स्तर: अंक, ग्रेड, डैशबोर्ड, संशोधन/हटाने व गूगल शीट पहुँच।",
    filterMonthLbl: "माह व वर्ष",
    filterBlockLbl: "विकासखंड",
    filterCadreLbl: "कैडर प्रकार",
    allMonthsOpt: "सभी माह",
    allBlocksOpt: "सभी विकासखंड (सरगुजा)",
    allCadresOpt: "सभी कैडर",
    blockChartTitle: "विकासखंडवार प्रतिवेदन एवं औसत अंक",
    gradeChartTitle: "कैडर प्रदर्शन एवं ग्रेड वितरण",
    reportListTitle: "मासिक कार्य प्रतिवेदन सूची",
    thMonth: "माह/वर्ष",
    thCadre: "कैडर",
    thNameMobile: "नाम / मोबाइल",
    thJurisdiction: "विकासखंड / CLF / VO",
    thScore: "प्राप्तांक",
    thGrade: "ग्रेड",
    thHonorarium: "मानदेय (₹)",
    thStatus: "समीक्षा स्थिति",
    thAction: "कार्यवाही",
    thSno: "क्र.",
    thKpi: "समीक्षा बिंदु / कार्य संकेतक (KPI)",
    thTarget: "मासिक लक्ष्य",
    thAchieved: "पूर्ण उपलब्धि",
    thPct: "प्रगति %",
    thMarks: "अधिकतम / प्राप्त अंक",
    thEvidence: "सत्यापन साक्ष्य",
    uploadPhotosBtn: "📷 फ़ोटो अपलोड करें",
    deletedTabTitle: "हटाए गए प्रतिवेदन एवं हटाने वाले का विवरण",
    refreshBtn: "रिफ्रेश करें",
    thDeletedAt: "हटाने का समय",
    thDeletedBy: "किसने हटाया",
    thRole: "भूमिका",
    thReportId: "रिपोर्ट आईडी"
  }
};

function translateDomElements() {
  const dict = FULL_I18N[currentLang] || FULL_I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

const I18N = {
  en: {
    brandTitle: "CGSRLM Bihan — District Surguja",
    brandSub: "Monthly Cadre Review & Monitoring Portal",
    sync: "🔄 Sync",
    lock: "🔒 Lock",
    navDashboard: "📊 Dashboard",
    navEntry: "📝 Monthly Report",
    navAdmin: "🛡️ Admin & Users",
    navSettings: "⚙️ Settings",
    clearFilter: "✕ Remove Filter",
    printPdf: "🖨️ Print / PDF",
    saveBtn: "💾 Save",
    statTotal: "Total Reports",
    statAvg: "Avg Score (/100)",
    statGradeA: "Grade-A Cadres",
    statGradeCD: "Grade-C/D Cadres",
    statHon: "Recommended Honorarium (₹)",
    cadreScopeNote: "Cadre View: Grade only (marks & honorarium hidden). Dashboard & your report entries shown.",
    otherScopeNote: "Jurisdiction View: Scoped data & review access.",
    adminScopeNote: "District & Above Full Access: Marks, Grades, Analytics, Edit/Delete & Google Sheet."
  },
  hi: {
    brandTitle: "CGSRLM बिहान — जिला सरगुजा",
    brandSub: "मासिक कैडर समीक्षा एवं अनुश्रवण पोर्टल",
    sync: "🔄 सिंक",
    lock: "🔒 लॉक",
    navDashboard: "📊 डैशबोर्ड",
    navEntry: "📝 मासिक प्रतिवेदन",
    navAdmin: "🛡️ एडमिन व यूज़र",
    navSettings: "⚙️ सेटिंग्स",
    clearFilter: "✕ फ़िल्टर हटाएं",
    printPdf: "🖨️ प्रिंट / PDF",
    saveBtn: "💾 Save",
    statTotal: "कुल प्रतिवेदन",
    statAvg: "औसत प्राप्तांक (/100)",
    statGradeA: "ग्रेड-A कैडर",
    statGradeCD: "ग्रेड-C/D कैडर",
    statHon: "अनुशंसित मानदेय (₹)",
    cadreScopeNote: "कैडर दृश्य: केवल ग्रेड दिखता है (अंक व मानदेय छिपे हैं)। डैशबोर्ड व आपके भरने योग्य डेटा उपलब्ध हैं।",
    otherScopeNote: "कार्यक्षेत्र दृश्य: सीमित डेटा एवं समीक्षा पहुँच।",
    adminScopeNote: "जिला एवं उच्च स्तर: अंक, ग्रेड, डैशबोर्ड, संशोधन/डिलीट व Google Sheet पहुँच।"
  }
};

function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  localStorage.setItem("bihaan_surguja_lang", currentLang);
  applyLanguageUI();
}

function applyLanguageUI() {
  const t = I18N[currentLang] || I18N.en;
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  translateDomElements();
  setTxt("authBrandTitle", t.brandTitle);
  setTxt("authBrandSub", t.brandSub);
  setTxt("syncBtn", t.sync);
  setTxt("lockBtn", t.lock);
  setTxt("clearFilterBtn", t.clearFilter);
  setTxt("printPdfBtn", t.printPdf);

  const navBtns = document.querySelectorAll("#mainNavTabs .nav-btn");
  if (navBtns[0]) navBtns[0].textContent = t.navDashboard;
  if (navBtns[1]) navBtns[1].textContent = t.navEntry;
  if (navBtns[2]) navBtns[2].textContent = t.navAdmin;
  if (navBtns[3]) navBtns[3].textContent = currentLang === "en" ? "🗑️ Deleted Data" : "🗑️ हटाया गया डेटा";
  if (navBtns[4]) navBtns[4].textContent = t.navSettings;

  const statLabels = document.querySelectorAll("#tabDashboard .stat-label");
  if (statLabels[0]) statLabels[0].textContent = t.statTotal;
  if (statLabels[1]) statLabels[1].textContent = t.statAvg;
  if (statLabels[2]) statLabels[2].textContent = t.statGradeA;
  if (statLabels[3]) statLabels[3].textContent = t.statGradeCD;
  if (statLabels[4]) statLabels[4].textContent = t.statHon;

  const saveSubmit = document.querySelector("#monthlyReportForm button[type='submit']");
  if (saveSubmit) saveSubmit.textContent = t.saveBtn;

  if (currentUser) {
    enterPortal(true);
  }
}

function clearAllFilters() {
  document.getElementById("filterMonth").value = "ALL";
  document.getElementById("filterBlock").value = "ALL";
  document.getElementById("filterCadre").value = "ALL";
  renderDashboard();
}

function toggleLoginGasBox() {
  const box = document.getElementById("loginGasSetupBox");
  if (!box) return;
  box.classList.toggle("hidden");
  const inp = document.getElementById("loginGasUrlInput");
  if (inp && !inp.value) {
    inp.value = localStorage.getItem(STORAGE_KEYS.GAS_URL) || "";
  }
}

function saveGasUrlFromLogin() {
  const inp = document.getElementById("loginGasUrlInput");
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) {
    showAlert("authAlert", "Please enter a valid Google Apps Script /exec URL.", "danger");
    return;
  }
  localStorage.setItem(STORAGE_KEYS.GAS_URL, val);
  showAlert("authAlert", "Backend URL saved. Click Sign In now.", "success");
}
