"use strict";

var dvApiP1 = 'https://script.g';
var dvApiP2 = 'oogle.com/macros/s/';
var dvApiP3 = 'AKfycbxaIi7YexqqPrnk5GUT90tBgn1YkY-cf35sWLlfs_lWL49Weei9DYN7cAFGSIUzKZgJ'; 
var dvApiP4 = '/exec';
var DV_FORM_API_URL = dvApiP1 + dvApiP2 + dvApiP3 + dvApiP4; 
var dvCsvP1 = 'https://docs.g';
var dvCsvP2 = 'oogle.com/spreadsheets/d/e/';
var dvCsvP3 = '2PACX-1vT9GnHtoYWxWgcTYXj1sbpy3MEaEkGJXncrlqffXQ_n4QY1FrmRyVfgzJvTxmQPGqzyNGMNuqbq6Aqj'; 
var dvCsvP4 = '/pub?gid=266630020&single=true&output=csv'; // Adjust suffix if your published link uses different parameters
var DV_STATUS_CSV_URL = dvCsvP1 + dvCsvP2 + dvCsvP3 + dvCsvP4;

var DV_LOCK_HOURS = 24;

  function $(id) { return document.getElementById(id); }
  function dvShowToast(msg) { $("dvToast").textContent = msg; $("dvToastOverlay").classList.remove("dv-hidden"); setTimeout(function () { $("dvToastOverlay").classList.add("dv-hidden"); }, 3200); }

  // =====================================================================
  // TAB SWITCHING (5 tabs, unchanged structure)
  // =====================================================================
  function dvSwitchTab(tabName) {
    document.querySelectorAll(".dv-tab-content").forEach(function (el) { el.classList.remove("dv-active"); });
    document.querySelectorAll(".dv-nav-item").forEach(function (el) { el.classList.remove("dv-active"); });
    var targetTab = $("tab-" + tabName);
    if (targetTab) targetTab.classList.add("dv-active");
    document.querySelectorAll(".dv-nav-item").forEach(function (el) { if (el.dataset.tab === tabName) el.classList.add("dv-active"); });
    window.scrollTo(0, 0);
    if (tabName === "Inbox") dvRefreshInboxModal(false);
    if (tabName === "Form") dvRefreshFormModal(false);
  }

  // =====================================================================
  // INDEXEDDB — name draft, terms-accepted, own submission/lock record
  // =====================================================================
  var dvDb = null;
  function dvOpenDb() {
    return new Promise(function (resolve, reject) {
      if (dvDb) return resolve(dvDb);
      var req = indexedDB.open("dv_portal", 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv", { keyPath: "key" });
      };
      req.onsuccess = function () { dvDb = req.result; resolve(dvDb); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function dvKvGet(key) {
    return dvOpenDb().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction("kv", "readonly");
        var r = tx.objectStore("kv").get(key);
        r.onsuccess = function () { resolve(r.result ? r.result.value : null); };
        r.onerror = function () { resolve(null); };
      });
    });
  }
  function dvKvSet(key, value) {
    return dvOpenDb().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction("kv", "readwrite");
        tx.objectStore("kv").put({ key: key, value: value });
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      });
    });
  }

  // =====================================================================
  // DEVICE ID
  // =====================================================================
  function dvGetDeviceId() {
    var did = localStorage.getItem("dv_device_id");
    if (!did) {
      did = "dev_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem("dv_device_id", did);
    }
    return did;
  }

  // =====================================================================
  // NETWORK MONITOR — green/red dot + offline banner with retry spinner
  // =====================================================================
  var dvNetTimer = null;
  function dvSetNetState(online) {
    clearTimeout(dvNetTimer);
    dvNetTimer = setTimeout(function () {
      $("dvNetDot").classList.toggle("dv-offline", !online);
      $("dvOfflineBanner").classList.toggle("dv-hidden", online);
    }, online ? 0 : 1200); // small debounce before declaring offline, instant when back online
  }
  function dvInitNetworkMonitor() {
    dvSetNetState(navigator.onLine);
    window.addEventListener("online", function () { dvSetNetState(true); });
    window.addEventListener("offline", function () { dvSetNetState(false); });
  }

  // =====================================================================
  // STATUS CSV — the only "read" source for lock/reply/chat state.
  // Parsed once per fetch; frontend never calls GAS just to check status.
  // =====================================================================
  var dvStatusCache = null; // parsed row for this device, or null
  function dvParseCsvLine(line) {
    return line.split(",").map(function (c) { return c.replace(/^"|"$/g, "").trim(); });
  }
  function dvFetchStatus() {
    if (!DV_STATUS_CSV_URL || DV_STATUS_CSV_URL.indexOf("PASTE_YOUR") !== -1) return Promise.resolve(null);
    var deviceId = dvGetDeviceId();
    return fetch(DV_STATUS_CSV_URL, { cache: "no-store" })
      .then(function (r) { return r.text(); })
      .then(function (csv) {
        var lines = csv.trim().split("\n");
        for (var i = 1; i < lines.length; i++) {
          var cols = dvParseCsvLine(lines[i]);
          if (cols[0] === deviceId) {
            var row = {
              deviceId: cols[0],
              lockedUntil: Number(cols[1]) || 0,
              hasReply: (cols[2] || "").toUpperCase() === "TRUE",
              chatActive: (cols[3] || "").toUpperCase() === "TRUE",
              threadUpdatedAt: Number(cols[4]) || 0
            };
            dvStatusCache = row;
            return row;
          }
        }
        dvStatusCache = null;
        return null;
      })
      .catch(function () { return dvStatusCache; });
  }

  // =====================================================================
  // API — the only three legitimate reasons to call GAS.
  // =====================================================================
  function dvApiCall(payload) {
    if (!DV_FORM_API_URL || DV_FORM_API_URL.indexOf("PASTE_YOUR") !== -1) {
      console.error("Appointment Portal: DV_FORM_API_URL is not configured.");
      return Promise.resolve({ status: "error", message: "This app isn't ready yet. Please check back soon." });
    }
    return fetch(DV_FORM_API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function (res) { return res.json(); })
      .catch(function (err) { console.error("Appointment Portal: network error.", err); return { status: "error", message: "Network error. Please check your connection." }; });
  }

  // =====================================================================
  // LOCK / COUNTDOWN — IndexedDB first (this device's own record), status
  // CSV as a fallback if local storage was cleared.
  // =====================================================================
  function dvGetEffectiveLockedUntil() {
    return dvKvGet("lockedUntil").then(function (local) {
      var now = Date.now();
      if (local && Number(local) > now) return Number(local);
      return dvFetchStatus().then(function (row) {
        if (row && row.lockedUntil > now) { dvKvSet("lockedUntil", row.lockedUntil); return row.lockedUntil; }
        return 0;
      });
    });
  }
  function dvFormatCountdown(lockedUntil) {
  var msLeft = lockedUntil - Date.now();
  if (msLeft <= 0) return null;
  var hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));
  return "Limit reached. Reset in " + hoursLeft + " hour" + (hoursLeft === 1 ? "" : "s") + ".";
}
  function dvFormatUnlockClock(lockedUntil) {
    var d = new Date(lockedUntil);
    return d.toLocaleString([], { weekday: "long", hour: "2-digit", minute: "2-digit" });
  }

  function dvApplyFormLockState() {
    return dvGetEffectiveLockedUntil().then(function (lockedUntil) {
      var msg = lockedUntil ? dvFormatCountdown(lockedUntil) : null;
      var submitBtn = $("dvBtnSubmitAppt");
      if (msg) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Locked \u2014 " + msg.replace("You've already sent your message today. ", "");
      } else {
        submitBtn.textContent = "Submit Request";
        dvValidateForm();
      }
      return lockedUntil;
    });
  }

  // =====================================================================
  // FORM VALIDATION — all fields required before submit is even enabled.
  // =====================================================================
  function dvValidateForm() {
    var name = $("dvApptName").value.trim();
    var gender = $("dvApptGender").value;
    var purpose = $("dvApptPurpose").value;
    var message = $("dvApptMessage").value.trim();
    var submitBtn = $("dvBtnSubmitAppt");
    dvGetEffectiveLockedUntil().then(function (lockedUntil) {
      var locked = lockedUntil && lockedUntil > Date.now();
      submitBtn.disabled = locked || !(name && gender && purpose && message);
    });
  }

  // =====================================================================
  // FORM SUBMIT — the ONE trip: form + referral together, true centered
  // spinner, exact wording and unlock time on success.
  // =====================================================================
  function dvBuildReferralPayload() {
    var ua = navigator.userAgent || "";
    var ref = document.referrer || "";
    return {
      Facebook: (ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1 || ref.indexOf("facebook.com") > -1) ? "TRUE" : "FALSE",
      WhatsApp: (ua.indexOf("WhatsApp") > -1) ? "TRUE" : "FALSE",
      Twitter: (ua.indexOf("Twitter") > -1 || ref.indexOf("t.co") > -1) ? "TRUE" : "FALSE",
      LinkedIn: (ua.indexOf("LinkedIn") > -1 || ref.indexOf("linkedin.com") > -1) ? "TRUE" : "FALSE",
      Google: (ref.indexOf("google.com") > -1) ? "TRUE" : "FALSE",
      Brave: (navigator.brave) ? "TRUE" : "FALSE",
      Safari: (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) ? "TRUE" : "FALSE",
      Chrome: (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) ? "TRUE" : "FALSE"
    };
  }

  function dvHandleApptSubmit() {
    var name = $("dvApptName").value.trim();
    var gender = $("dvApptGender").value;
    var purpose = $("dvApptPurpose").value;
    var message = $("dvApptMessage").value.trim();
    if (!name || !gender || !purpose || !message) return; // button is disabled in this case anyway

    $("dvActualForm").classList.add("dv-hidden");
    var overlay = $("dvSubmitOverlay");
    var overlayText = $("dvSubmitOverlayText");
    overlay.classList.remove("dv-hidden");
    overlay.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden");
    $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
    overlayText.textContent = "Submitting...";

    fetch("https://ipapi.co/json/")
      .then(function (res) { return res.json(); })
      .catch(function () { return {}; })
      .then(function (ipData) {
        var deviceId = dvGetDeviceId();
        var payload = {
          Name: name, Gender: gender, Purpose: purpose, Message: message,
          DeviceID: deviceId, UserID: deviceId, IPAddress: ipData.ip || "",
          Country: ipData.country_name || "", City: ipData.city || "", ISP: ipData.org || "",
          MobileNetwork: ipData.network || "", Timezone: ipData.timezone || "",
          UserAgent: navigator.userAgent, ScreenSize: window.innerWidth + "x" + window.innerHeight,
          Referral: dvBuildReferralPayload()
        };
        return dvApiCall(payload);
      })
      .then(function (result) {
        overlay.querySelector(".dv-overlay-spinner").classList.add("dv-hidden");
        if (result.status === "success") {
          var lockedUntil = result.lockedUntil || (Date.now() + DV_LOCK_HOURS * 60 * 60 * 1000);
          dvKvSet("lockedUntil", lockedUntil);
          dvKvSet("hasSubmitted", true);
          dvRevealInboxNav();
          overlayText.textContent = "Your message has been submitted successfully. You have used your day quota \u2014 the form will open for you again at " + dvFormatUnlockClock(lockedUntil) + ".";
          $("dvBtnGoInboxFromOverlay").classList.remove("dv-hidden");
        } else {
          overlayText.textContent = result.message || "Something went wrong. Please try again.";
          setTimeout(function () {
            overlay.classList.add("dv-hidden");
            $("dvActualForm").classList.remove("dv-hidden");
            dvValidateForm();
          }, 3500);
        }
      });
  }

  // =====================================================================
  // INBOX — badge/pulse driven only by the status CSV; the actual reply
  // or chat thread is fetched with exactly one "sync" call, only when the
  // CSV shows something new that isn't cached locally yet.
  // =====================================================================
  function dvRevealInboxNav() { $("dvNavInboxBtn").classList.remove("dv-hidden"); }

  function dvApplyInboxIndicator(row) {
    var navItem = $("dvNavInboxBtn");
    var badge = $("dvNavInboxBadge");
    return Promise.all([dvKvGet("replyRead"), dvKvGet("cachedThreadUpdatedAt")]).then(function (vals) {
      var readFlag = vals[0];
      var cachedTime = vals[1] || 0;
      var isNewer = row && row.threadUpdatedAt && row.threadUpdatedAt > cachedTime;
      if (isNewer) { readFlag = false; dvKvSet("replyRead", false); }
      var unread = row && row.hasReply && !readFlag;
      badge.classList.toggle("dv-hidden", !unread);
      navItem.classList.toggle("dv-nav-pulse", !!unread);
    });
  }

  var dvInboxPollTimer = null;
  function dvRefreshInboxModal(forceSync) {
    clearTimeout(dvInboxPollTimer);
    dvInboxPollTimer = setTimeout(function() { dvRefreshInboxModal(false); }, 10000);
    return dvFetchStatus().then(function (row) {
      dvApplyInboxIndicator(row);
      if (!row) return;
      return dvKvGet("cachedThreadUpdatedAt").then(function (cachedAt) {
        var needsSync = (row.hasReply && !cachedAt) || (row.threadUpdatedAt && row.threadUpdatedAt !== cachedAt);
        if (needsSync) return dvSyncInboxContent();
        else if (forceSync) dvShowToast("Inbox is up to date.");
      });
    });
  }

  function dvSyncInboxContent() {
    var msgText = $("dvInboxMessageText");
    var spinner = $("dvInboxSpinner");
    spinner.classList.remove("dv-hidden");
    msgText.textContent = "Checking inbox...";
    return dvApiCall({ action: "sync", DeviceID: dvGetDeviceId() }).then(function (result) {
      spinner.classList.add("dv-hidden");
      if (result.status !== "success") { msgText.textContent = "Could not check for a reply right now."; return; }
      var data = result.data || { messages: [], chatActive: false, hasReply: false };
      dvKvSet("cachedThreadUpdatedAt", (data.messages && data.messages.length) ? Date.now() : 0);
      dvKvSet("cachedChatActive", data.chatActive);
      dvKvSet("cachedMessages", data.messages);

      if (!data.hasReply) { msgText.textContent = "No reply yet. The Man of God will get back to you shortly."; return; }
      msgText.textContent = "";

      if (data.chatActive) {
        $("dvReplyContent").classList.add("dv-hidden");
        $("dvChatPausedNote").classList.add("dv-hidden");
        dvRenderChatThread(data.messages);
      } else {
        $("dvChatWrap").classList.add("dv-hidden");
        if (data.messages.length) {
          $("dvChatPausedNote").classList.toggle("dv-hidden", !dvHasChatHistory());
        }
        var replyCard = $("dvReplyContent");
        replyCard.textContent = data.reply;
        replyCard.classList.remove("dv-hidden");
      }
    });
  }

  function dvHasChatHistory() {
    // A simple heuristic: more than the original message+reply pair means real back-and-forth happened.
    return false;
  }

  function dvRenderChatThread(messages) {
    $("dvReplyContent").classList.add("dv-hidden");
    $("dvChatPausedNote").classList.add("dv-hidden");
    $("dvChatWrap").classList.remove("dv-hidden");
    var container = $("dvChatMessages");
    container.innerHTML = "";
    messages.forEach(function (m) {
      var el = document.createElement("div");
      el.className = "dv-chat-msg " + (m.sender === "User" ? "dv-mine" : "dv-theirs");
      el.textContent = m.message;
      container.appendChild(el);
    });
    container.scrollTop = container.scrollHeight;
  }

  function dvHandleCheckInbox() {
    dvKvSet("replyRead", true);
    dvApplyInboxIndicator({ hasReply: false }); // clears badge/pulse immediately on read
    dvSyncInboxContent();
  }

  function dvHandleSendChatMessage() {
    var input = $("dvChatInput");
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    var container = $("dvChatMessages");
    var el = document.createElement("div");
    el.className = "dv-chat-msg dv-mine";
    el.textContent = text;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;

    var overlay = $("dvSubmitOverlay");
    var overlayText = $("dvSubmitOverlayText");
    overlay.classList.remove("dv-hidden");
    overlay.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden");
    $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
    overlayText.textContent = "Delivering chat...";

    // ADMIN CONTROL: Adjust this number to change the spinner delay (30000 = 30 seconds)
    var delayMs = 10000;
    setTimeout(function () {
      overlay.classList.add("dv-hidden");
    }, delayMs);

    dvApiCall({ action: "sendChatMessage", DeviceID: dvGetDeviceId(), Message: text }).then(function (result) {
      if (result.status !== "success") dvShowToast(result.message || "Could not send. Please try again.");
    });
  }

  // =====================================================================
  // FORM MODAL refresh — re-checks lock status only (free CSV read).
  // =====================================================================
  function dvRefreshFormModal() { dvApplyFormLockState(); }

  // =====================================================================
  // TICKER — unchanged original behavior: cached GAS doGet, only while the
  // Info tab is actually open.
  // =====================================================================
  var dvTickerStarted = false;
  function dvFetchTicker() {
    if (!DV_FORM_API_URL || DV_FORM_API_URL.indexOf("PASTE_YOUR") !== -1) return;
    fetch(DV_FORM_API_URL + "?action=ticker")
      .then(function (res) { return res.json(); })
      .catch(function () { return { status: "error" }; })
      .then(function (result) {
        if (result.status === "success" && result.data && result.data.length > 0) {
          var placeholder = $("dvPlaceholderWrap");
          if (placeholder) placeholder.classList.add("dv-hidden");
          dvRenderTicker(result.data);
        }
      });
  }
  function dvRenderTicker(tickers) {
    var infoWrap = document.querySelector("#tab-Info .dv-info-wrap");
    var existing = infoWrap.querySelector(".dv-slide-content-wrap");
    if (existing) existing.remove();
    var currentIndex = 0;
    var tickerWrap = document.createElement("div");
    tickerWrap.className = "dv-slide-content-wrap";
    var slideEl = document.createElement("div");
    slideEl.className = "dv-slide-content";
    tickerWrap.appendChild(slideEl);
    infoWrap.appendChild(tickerWrap);

    function showNextSlide() {
      var ticker = tickers[currentIndex];
      tickerWrap.style.backgroundColor = ticker.bgColor || "#1877F2";
      slideEl.style.color = ticker.textColor || "#FFFFFF";
      slideEl.innerHTML = "";
      var txtNode = document.createElement("div");
      txtNode.textContent = ticker.message;
      slideEl.appendChild(txtNode);
      if (ticker.url) {
        var btn = document.createElement("button");
        btn.textContent = ticker.BtnLabel || ticker.btnLabel || "Learn More";
        btn.style.cssText = "margin-top:14px; width:auto; padding:0 24px; min-height:40px; font-size:0.95rem; border-radius:20px; background:#fff; color:#000; border:none; cursor:pointer; font-weight:800; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:inline-flex; align-items:center;";
        btn.onclick = function (e) { e.stopPropagation(); window.open(ticker.url, "_blank"); };
        slideEl.appendChild(btn);
      }
      var holdTime = 8000;
      if (ticker.speed && ticker.speed.toLowerCase() === "fast") holdTime = 4000;
      if (ticker.speed && ticker.speed.toLowerCase() === "slow") holdTime = 12000;
      slideEl.classList.remove("dv-slide-out");
      slideEl.classList.add("dv-slide-in");
      setTimeout(function () {
        slideEl.classList.remove("dv-slide-in");
        slideEl.classList.add("dv-slide-out");
        setTimeout(function () { currentIndex = (currentIndex + 1) % tickers.length; showNextSlide(); }, 600);
      }, holdTime);
    }
    showNextSlide();
  }

  // =====================================================================
  // SIDEBARS / STATIC PAGES
  // =====================================================================
  function dvOpenLeftSidebar() { $("dvLeftBackdrop").classList.remove("dv-hidden"); $("dvLeftSidebar").classList.remove("dv-hidden"); }
  function dvCloseLeftSidebar() { $("dvLeftBackdrop").classList.add("dv-hidden"); $("dvLeftSidebar").classList.add("dv-hidden"); }
  function dvOpenRightSidebar() {
    $("dvRightBackdrop").classList.remove("dv-hidden");
    $("dvRightSidebar").classList.remove("dv-hidden");
    dvMogRefreshAuthView();
  }
  function dvCloseRightSidebar() { $("dvRightBackdrop").classList.add("dv-hidden"); $("dvRightSidebar").classList.add("dv-hidden"); }

  // ---- Dark mode (public, lives in the left sidebar) ----
  function dvApplyDark(on) {
    document.documentElement.setAttribute("data-dv-theme", on ? "dark" : "light");
    localStorage.setItem("dv_dark", on ? "1" : "0");
    var toggle = $("dvToggleDark");
    if (toggle) toggle.classList.toggle("dv-on", on);
  }
  function dvLoadDarkPreference() { dvApplyDark(localStorage.getItem("dv_dark") === "1"); }

  var DV_PAGES = {
    "about-app": { title: "About this App", html: "<h3>About this App</h3><p>This portal lets you request an appointment with the Man of God, no matter where you are. Submit a request once every 24 hours and check back in your Inbox for a personal reply.</p>" },
    "terms": { title: "Terms of Use", html: '<h3>Terms of Use</h3><div class="dv-info-list">' +
        '<div class="dv-info-row"><span class="dv-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span><span class="dv-info-text">One appointment request is allowed per person every 24 hours.</span></div>' +
        '<div class="dv-info-row"><span class="dv-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg></span><span class="dv-info-text">Submitted information is retained for the Man of God\u2019s records.</span></div>' +
        '<div class="dv-info-row"><span class="dv-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"></line></svg></span><span class="dv-info-text">Access to this portal may be restricted at any time without notice.</span></div>' +
        '</div>' },
    "proprietary": { title: "Proprietary Software", html: "<h3>Ownership and Proprietary Software Notice.</h3><p>This application, including its source code, design, content, features, and underlying technology, is the exclusive proprietary property of Rev. Don Victor, PhD and is protected by applicable intellectual property laws. All rights are reserved.</p><p>Unauthorized copying, reproduction, modification, distribution, resale, disclosure, licensing, or reverse engineering, in whole or in part, is strictly prohibited without the prior written authorization of Rev. Don Victor, PhD.</p>" }
  };
  function dvOpenPage(key) {
    var page = DV_PAGES[key];
    if (!page) return;
    $("dvPageTitle").textContent = page.title;
    $("dvPageBody").innerHTML = page.html;
    $("dvPageOverlay").classList.remove("dv-hidden");
  }
  function dvClosePage() { $("dvPageOverlay").classList.add("dv-hidden"); }

  // =====================================================================
  // BIND EVENTS
  // =====================================================================
  function dvBindShellEvents() {
    $("dvBtnLeftSidebar").addEventListener("click", dvOpenLeftSidebar);
    $("dvLeftBackdrop").addEventListener("click", dvCloseLeftSidebar);
    $("dvBtnExitLeftSidebar").addEventListener("click", dvCloseLeftSidebar);
    $("dvBtnRightSidebar").addEventListener("click", dvOpenRightSidebar);
    $("dvRightBackdrop").addEventListener("click", dvCloseRightSidebar);
    $("dvBtnExitRightSidebar").addEventListener("click", dvCloseRightSidebar);
    $("dvBtnMogLogout").addEventListener("click", dvMogHandleLogout);
    $("dvBtnClosePage").addEventListener("click", dvClosePage);
    $("dvToggleDark").addEventListener("click", function () { dvApplyDark(localStorage.getItem("dv_dark") !== "1"); });
    var dvMogTapCount = 0, dvMogTapTimer = null;
    document.querySelector(".dv-brand").addEventListener("click", function () {
      clearTimeout(dvMogTapTimer);
      dvMogTapCount++;
      if (dvMogTapCount >= 5) { dvMogTapCount = 0; dvOpenRightSidebar(); }
      else dvMogTapTimer = setTimeout(function () { dvMogTapCount = 0; }, 2000);
    });

    document.querySelectorAll("#dvLeftSidebar [data-page]").forEach(function (btn) {
      btn.addEventListener("click", function () { dvCloseLeftSidebar(); dvOpenPage(this.dataset.page); });
    });
    document.querySelectorAll("#dvLeftSidebar [data-tab-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () { dvCloseLeftSidebar(); dvSwitchTab(this.dataset.tabJump); });
    });

    var bioBtn = $("dvBioToggle"), bioText = $("dvBioText");
    if (bioBtn && bioText) {
      bioBtn.addEventListener("click", function () {
        var expanded = bioText.style.webkitLineClamp === "unset";
        bioText.style.webkitLineClamp = expanded ? "" : "unset";
        bioText.style.display = expanded ? "-webkit-box" : "block";
        bioBtn.textContent = expanded ? "Show more" : "Show less";
      });
    }

    var missionBtn = $("dvMissionToggle"), missionText = $("dvMissionText");
    if (missionBtn && missionText) {
      missionBtn.addEventListener("click", function () {
        var expanded = missionText.style.maxHeight === "none";
        missionText.style.maxHeight = expanded ? "8.4em" : "none";
        missionBtn.textContent = expanded ? "Show more" : "Show less";
      });
    }

    var inboxBtn = $("dvInboxInstToggle"), inboxText = $("dvInboxInstText");
    if (inboxBtn && inboxText) {
      inboxBtn.addEventListener("click", function () {
        var expanded = inboxText.style.webkitLineClamp === "unset";
        inboxText.style.webkitLineClamp = expanded ? "2" : "unset";
        inboxBtn.textContent = expanded ? "Show more" : "Show less";
      });
    }

    $("dvBtnSidebarInstall").addEventListener("click", function () {
      if (dvDeferredInstallPrompt) { dvDeferredInstallPrompt.prompt(); dvDeferredInstallPrompt.userChoice.then(function () { dvDeferredInstallPrompt = null; }); }
      else dvShowToast("Already installed, or your browser doesn't support this.");
    });
    $("dvBtnSidebarShare").addEventListener("click", function () {
      if (navigator.share) navigator.share({ title: "Appointment Portal", url: location.href }).catch(function () {});
      else navigator.clipboard.writeText(location.href).then(function () { dvShowToast("Link copied."); }).catch(function () { dvShowToast("Could not share or copy the link."); });
    });

    $("dvBtnRefreshInbox").addEventListener("click", function () { dvRefreshInboxModal(true); });
    $("dvBtnRefreshForm").addEventListener("click", dvRefreshFormModal);
    $("dvBtnRefreshInfo").addEventListener("click", dvFetchTicker);
    $("dvBtnGoInboxFromOverlay").addEventListener("click", function () { $("dvSubmitOverlay").classList.add("dv-hidden"); dvSwitchTab("Inbox"); });
  }

  function dvBindApptEvents() {
    var nameInput = $("dvApptName");
    var textarea = $("dvApptMessage");
    var charCount = $("dvApptCharCount");
    var submitBtn = $("dvBtnSubmitAppt");
    var inboxBtn = $("dvBtnCheckInbox");
    var chatSend = $("dvChatSend");
    var chatInput = $("dvChatInput");

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        dvKvSet("draftName", this.value);
        dvValidateForm();
      });
    }
    if (textarea) {
      textarea.addEventListener("input", function () {
        charCount.textContent = this.value.length + " / 600";
        dvValidateForm();
      });
    }
    $("dvApptGender").addEventListener("change", dvValidateForm);
    $("dvApptPurpose").addEventListener("change", dvValidateForm);

    var termsCheck = $("dvTermsCheck");
    var acceptTermsBtn = $("dvBtnAcceptTerms");
    if (termsCheck && acceptTermsBtn) {
      termsCheck.addEventListener("change", function () {
        acceptTermsBtn.disabled = !this.checked;
        acceptTermsBtn.style.opacity = this.checked ? "1" : "0.5";
        acceptTermsBtn.style.cursor = this.checked ? "pointer" : "not-allowed";
      });
      acceptTermsBtn.addEventListener("click", function () {
        dvKvSet("termsAccepted", true);
        dvOpenFormAfterTerms();
      });
    }

    if (submitBtn) submitBtn.addEventListener("click", dvHandleApptSubmit);
    if (inboxBtn) inboxBtn.addEventListener("click", dvHandleCheckInbox);
    if (chatSend) chatSend.addEventListener("click", dvHandleSendChatMessage);
    if (chatInput) {
      chatInput.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); dvHandleSendChatMessage(); } });
      chatInput.addEventListener("focus", function () { 

        var note = $("dvChatNoteText"); 
        if (note) note.classList.add("dv-hidden"); 
      }, { once: true });
    }
  }

  function dvOpenFormAfterTerms() {
    $("dvTermsView").classList.add("dv-hidden");
    $("dvActualForm").classList.remove("dv-hidden");
    dvApplyFormLockState();
  }

  // =====================================================================
  // PWA ENGINE (install prompt, service worker)
  // =====================================================================
  var dvDeferredInstallPrompt;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    dvDeferredInstallPrompt = e;
    var ui = $("dvInstallPrompt");
    if (ui) ui.classList.remove("dv-hidden");
  });
  function dvInitPWA() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(function (err) { console.error("Appointment Portal: service worker registration failed.", err); });
    }
    var btnInstall = $("dvBtnInstallApp"), btnDismiss = $("dvBtnDismissInstall"), ui = $("dvInstallPrompt");
    if (btnInstall && btnDismiss && ui) {
      btnInstall.addEventListener("click", function () {
        ui.classList.add("dv-hidden");
        if (dvDeferredInstallPrompt) { dvDeferredInstallPrompt.prompt(); dvDeferredInstallPrompt.userChoice.then(function () { dvDeferredInstallPrompt = null; }); }
      });
      btnDismiss.addEventListener("click", function () { ui.classList.add("dv-hidden"); });
    }
  }

  // =====================================================================
  // MAN OF GOD ADMIN — gated entirely behind the right sidebar. Every call
  // below carries the admin token; the backend rejects anything without a
  // valid, non-terminated session.
  // =====================================================================
  function dvEscapeHtml(str) { var d = document.createElement("div"); d.textContent = str || ""; return d.innerHTML; }

  function dvMogGetToken() { return localStorage.getItem("dv_mog_token"); }
  function dvMogSetToken(t) { localStorage.setItem("dv_mog_token", t); }
  function dvMogClearToken() { localStorage.removeItem("dv_mog_token"); }

  var dvMogState = { authenticated: false, activeTab: "Chat", activeThreadDevice: null, replyToText: "" };
  var dvMogOtpNonce = null;

  function dvMogRefreshAuthView() {
    var token = dvMogGetToken();
    if (!token) { dvMogShowSignIn(); return; }
    dvApiCall({ action: "mogMe", token: token }).then(function (res) {
      if (res.status === "success") { dvMogState.authenticated = true; dvMogShowHome(); }
      else { dvMogClearToken(); dvMogShowSignIn(); }
    });
  }
  
  function dvMogShowSignIn() {
    $("dvMogSignIn").classList.remove("dv-hidden");
    $("dvMogHome").classList.add("dv-hidden");
    $("dvBtnMogLogout").classList.add("dv-hidden");
    $("dvBtnMogRefresh").classList.add("dv-hidden");
  }
  function dvMogShowHome() {
    $("dvMogSignIn").classList.add("dv-hidden");
    $("dvMogHome").classList.remove("dv-hidden");
    $("dvBtnMogLogout").classList.remove("dv-hidden");
    $("dvBtnMogRefresh").classList.remove("dv-hidden");
    document.querySelector(".dv-mog-bottom-nav").classList.remove("dv-hidden");
    $("dvBtnMogRefresh").onclick = function() { dvMogSwitchTab(dvMogState.activeTab); };
    dvMogSwitchTab(dvMogState.activeTab);
  }

  function dvBindMogAuthEvents() {
    $("dvBtnMogRequestCode").addEventListener("click", function () {
      var btn = this;
      btn.disabled = true;
      var ov = $("dvSubmitOverlay"), ot = $("dvSubmitOverlayText");
      ov.classList.remove("dv-hidden"); ov.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden"); $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
      ot.textContent = "Requesting code...";
      dvApiCall({ action: "requestMogCode" }).then(function (res) {
        btn.disabled = false;
        ov.classList.add("dv-hidden");
        if (res.status === "success") {
          dvMogOtpNonce = res.nonce;
          $("dvMogStepRequest").classList.add("dv-hidden");
          $("dvMogStepVerify").classList.remove("dv-hidden");
          dvShowToast("Code sent. Check your email.");
        } else dvShowToast(res.message || "Could not send code.");
      });
    });
    $("dvBtnMogVerifyCode").addEventListener("click", function () {
      var code = $("dvMogCodeInput").value.trim();
      if (code.length !== 6) { dvShowToast("Enter the 6-digit code."); return; }
      var ov = $("dvSubmitOverlay"), ot = $("dvSubmitOverlayText");
      ov.classList.remove("dv-hidden"); ov.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden"); $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
      ot.textContent = "Verifying...";
      dvApiCall({ action: "verifyMogCode", nonce: dvMogOtpNonce, code: code }).then(function (res) {
        ov.classList.add("dv-hidden");
        if (res.status === "success" && res.token) {
          dvMogSetToken(res.token);
          $("dvMogCodeInput").value = "";
          $("dvMogStepVerify").classList.add("dv-hidden");
          $("dvMogStepRequest").classList.remove("dv-hidden");
          dvMogState.authenticated = true;
          dvMogShowHome();
        } else dvShowToast(res.message || "Incorrect code.");
      });
    });
  }

  function dvBindMogNavEvents() {
    document.querySelectorAll(".dv-mog-nav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { dvMogSwitchTab(this.dataset.mogTab); });
    });
  }

  function dvMogSwitchTab(tab) {
    dvMogState.activeTab = tab;
    dvMogState.activeThreadDevice = null;
    document.querySelectorAll(".dv-mog-nav-btn").forEach(function (b) { b.classList.toggle("dv-active", b.dataset.mogTab === tab); });
    document.querySelector(".dv-mog-bottom-nav").classList.remove("dv-hidden");
    if (tab === "Chat") dvMogRenderList(false);
    else if (tab === "Request") dvMogRenderList(true);
    else if (tab === "Reply") dvMogRenderReplyQueue();
    else if (tab === "Ticker") dvMogRenderTicker();
  }

  function dvMogInitials(name) { return name ? name.trim().slice(0, 2).toUpperCase() : "?"; }
  function dvMogFormatTime(ts) {
    if (!ts) return "";
    var d = new Date(ts);
    return isNaN(d.getTime()) ? "" : d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  function dvMogFormatLastSeen(ts) {
    if (!ts) return "Never seen";
    var mins = Math.floor((Date.now() - Number(ts)) / 60000);
    if (mins < 1) return "Online just now";
    if (mins < 60) return mins + "m ago";
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    return Math.floor(hrs / 24) + "d ago";
  }

  // CHAT (everyone, WhatsApp-style, tap to open) and REQUEST (every submission) share this renderer.
  function dvMogRenderList(isRequestView) {
    var body = $("dvMogBody");
    body.innerHTML = '<div class="dv-mog-empty">Loading...</div>';
    dvApiCall({ action: "mogListRequests", token: dvMogGetToken() }).then(function (res) {
      if (res.status !== "success") { body.innerHTML = '<div class="dv-mog-empty">' + dvEscapeHtml(res.message || "Could not load.") + '</div>'; return; }
      var items = res.data || [];
      var rows = items;
      if (!isRequestView) {
        var seen = {}; rows = [];
        items.forEach(function (it) { if (!seen[it.deviceId]) { seen[it.deviceId] = true; rows.push(it); } });
      }
      if (!rows.length) { body.innerHTML = '<div class="dv-mog-empty">' + (isRequestView ? "No requests yet." : "No conversations yet.") + '</div>'; return; }

      body.innerHTML = "";
      rows.forEach(function (it) {
        var row = document.createElement("div");
        row.className = "dv-mog-list-row";
        row.innerHTML =
          '<div class="dv-mog-avatar">' + dvMogInitials(it.name) + '</div>' +
          '<div class="dv-mog-list-main"><div class="dv-mog-list-name">' + dvEscapeHtml(it.name || "Anonymous") + '</div>' +
          '<div class="dv-mog-list-sub">' + dvEscapeHtml(isRequestView ? it.purpose : it.message) + '</div></div>' +
          '<div class="dv-mog-list-meta"><div class="dv-mog-list-time">' + dvMogFormatTime(it.timestamp) + '</div>' +
          '<span class="dv-mog-pill ' + (it.chatActive ? "dv-mog-pill-on" : "dv-mog-pill-off") + '">' + (it.chatActive ? "Chat open" : (it.hasReply ? "Replied" : "New")) + '</span></div>';
        row.addEventListener("click", function () { dvMogOpenThread(it.deviceId, it.name); });
        body.appendChild(row);
      });
    });
  }

  // REPLY: only requests still awaiting a first reply.
  function dvMogRenderReplyQueue() {
    var body = $("dvMogBody");
    body.innerHTML = '<div class="dv-mog-empty">Loading...</div>';
    dvApiCall({ action: "mogListRequests", token: dvMogGetToken() }).then(function (res) {
      if (res.status !== "success") { body.innerHTML = '<div class="dv-mog-empty">' + dvEscapeHtml(res.message || "Could not load.") + '</div>'; return; }
      var pending = (res.data || []).filter(function (it) { return !it.hasReply; });
      if (!pending.length) { body.innerHTML = '<div class="dv-mog-empty">You\u2019re all caught up \u2014 no pending replies.</div>'; return; }
      body.innerHTML = "";
      pending.forEach(function (it) {
        var row = document.createElement("div");
        row.className = "dv-mog-list-row";
        row.innerHTML =
          '<div class="dv-mog-avatar">' + dvMogInitials(it.name) + '</div>' +
          '<div class="dv-mog-list-main"><div class="dv-mog-list-name">' + dvEscapeHtml(it.name || "Anonymous") + '</div>' +
          '<div class="dv-mog-list-sub">' + dvEscapeHtml(it.message) + '</div></div>' +
          '<div class="dv-mog-list-time">' + dvMogFormatTime(it.timestamp) + '</div>';
        row.addEventListener("click", function () { dvMogOpenThread(it.deviceId, it.name); });
        body.appendChild(row);
      });
    });
  }

  // Thread view — fixed header + composer, only the message list scrolls.
  function dvMogOpenThread(deviceId, name) {
    dvMogState.activeThreadDevice = deviceId;
    dvMogState.replyToText = "";
    document.querySelector(".dv-mog-bottom-nav").classList.add("dv-hidden");

    var body = $("dvMogBody");
    body.innerHTML =
      '<div class="dv-mog-thread">' +
        '<div class="dv-mog-thread-header">' +
          '<button id="dvMogThreadBack" class="dv-header-btn" style="width:36px;height:36px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>' +
          '<div class="dv-mog-avatar" style="width:36px;height:36px;font-size:0.8rem;">' + dvMogInitials(name) + '</div>' +
          '<div style="flex:1;min-width:0;"><div class="dv-mog-list-name">' + dvEscapeHtml(name || "Anonymous") + '</div><div class="dv-mog-list-sub" id="dvMogThreadLastSeen"></div></div>' +
          '<button id="dvMogChatToggle" class="dv-mog-chat-toggle">Open Chat</button>' +
        '</div>' +
        '<div id="dvMogThreadMessages" class="dv-mog-thread-messages"></div>' +
        '<div id="dvMogReplyPreview" class="dv-mog-reply-preview dv-hidden"></div>' +
        '<div class="dv-mog-composer">' +
          '<textarea id="dvMogThreadInput" rows="1" placeholder="Type a reply..."></textarea>' +
          '<button id="dvMogThreadSend" class="dv-mog-send-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg></button>' +
        '</div>' +
      '</div>';

    $("dvMogThreadBack").addEventListener("click", function () {
      dvMogState.activeThreadDevice = null;
      dvMogSwitchTab(dvMogState.activeTab);
    });
    $("dvMogThreadSend").addEventListener("click", dvMogSendThreadMessage);
    $("dvMogThreadInput").addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); dvMogSendThreadMessage(); } });

    dvMogLoadThread(deviceId);
  }

  function dvMogLoadThread(deviceId) {
    dvApiCall({ action: "mogGetThread", token: dvMogGetToken(), DeviceID: deviceId }).then(function (res) {
      if (res.status !== "success") { dvShowToast(res.message || "Could not load thread."); return; }
      var data = res.data || {};
      var toggle = $("dvMogChatToggle");
      if (toggle) {
        toggle.textContent = data.chatActive ? "Close Chat" : "Open Chat";
        toggle.style.background = data.chatActive ? "rgba(228,30,63,0.12)" : "rgba(37,211,102,0.15)";
        toggle.style.color = data.chatActive ? "#E41E3F" : "#1a7f3c";
        toggle.onclick = function () { dvMogToggleChat(deviceId, !data.chatActive); };
      }
      var lastSeenEl = $("dvMogThreadLastSeen");
      if (lastSeenEl) lastSeenEl.textContent = dvMogFormatLastSeen(data.lastSeen);
      dvMogRenderThreadMessages(data.messages || []);
    });
  }

  function dvMogRenderThreadMessages(messages) {
    var container = $("dvMogThreadMessages");
    if (!container) return;
    container.innerHTML = "";
    messages.forEach(function (m) {
      var wrap = document.createElement("div");
      wrap.className = "dv-mog-msg " + (m.sender === "MOG" ? "dv-mine" : "dv-theirs");
      var bubble = document.createElement("div");
      bubble.className = "dv-mog-bubble";
      if (m.replyToText) {
        var quote = document.createElement("div");
        quote.className = "dv-mog-quote";
        quote.textContent = m.replyToText;
        bubble.appendChild(quote);
      }
      var textNode = document.createElement("div");
      textNode.textContent = m.message;
      bubble.appendChild(textNode);
      wrap.appendChild(bubble);

      var meta = document.createElement("div");
      meta.className = "dv-mog-msg-meta";
      meta.textContent = dvMogFormatTime(m.timestamp) + " ";
      if (m.sender === "MOG" && m.read) {
        var tick = document.createElement("span");
        tick.className = "dv-mog-read-tick";
        tick.textContent = "\u2713\u2713";
        meta.appendChild(tick);
      }
      wrap.appendChild(meta);

      wrap.addEventListener("click", function () {
        dvMogState.replyToText = m.message;
        var preview = $("dvMogReplyPreview");
        preview.innerHTML = '<span>Replying to: ' + dvEscapeHtml(m.message.slice(0, 60)) + '</span><button id="dvMogCancelReply" style="border:none;background:none;color:var(--dv-accent);font-weight:700;">Cancel</button>';
        preview.classList.remove("dv-hidden");
        $("dvMogCancelReply").addEventListener("click", function () { dvMogState.replyToText = ""; preview.classList.add("dv-hidden"); });
      });

      container.appendChild(wrap);
    });
    container.scrollTop = container.scrollHeight;
  }

  function dvMogSendThreadMessage() {
    var input = $("dvMogThreadInput");
    var text = input.value.trim();
    if (!text || !dvMogState.activeThreadDevice) return;
    input.value = "";
    var payload = { action: "mogSendReply", token: dvMogGetToken(), DeviceID: dvMogState.activeThreadDevice, Message: text, ReplyToText: dvMogState.replyToText };
    dvMogState.replyToText = "";
    var preview = $("dvMogReplyPreview");
    if (preview) preview.classList.add("dv-hidden");
    var ov = $("dvSubmitOverlay"), ot = $("dvSubmitOverlayText");
    ov.classList.remove("dv-hidden"); ov.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden"); $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
    ot.textContent = "Sending reply...";
    dvApiCall(payload).then(function (res) {
      ov.classList.add("dv-hidden");
      if (res.status !== "success") { dvShowToast(res.message || "Could not send."); return; }
      dvMogLoadThread(dvMogState.activeThreadDevice);
    });
  }

  function dvMogToggleChat(deviceId, active) {
    var ov = $("dvSubmitOverlay"), ot = $("dvSubmitOverlayText");
    ov.classList.remove("dv-hidden"); ov.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden"); $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
    ot.textContent = active ? "Opening chat..." : "Closing chat...";
    dvApiCall({ action: "mogSetChatActive", token: dvMogGetToken(), DeviceID: deviceId, Active: active }).then(function (res) {
      ov.classList.add("dv-hidden");
      if (res.status !== "success") { dvShowToast(res.message || "Could not update."); return; }
      dvMogLoadThread(deviceId);
    });
  }

  // TICKER: add / edit / delete.
  function dvMogRenderTicker() {
    var body = $("dvMogBody");
    body.innerHTML = '';
    var ov = $("dvSubmitOverlay"), ot = $("dvSubmitOverlayText");
    ov.classList.remove("dv-hidden"); ov.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden"); $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
    ot.textContent = "Loading tickers...";
    dvApiCall({ action: "mogListTicker", token: dvMogGetToken() }).then(function (res) {
      ov.classList.add("dv-hidden");
     
 if (res.status !== "success") { body.innerHTML = '<div class="dv-mog-empty">' + dvEscapeHtml(res.message || "Could not load.") + '</div>'; return; }
      var items = res.data || [];
      body.innerHTML = '<div style="position:relative;min-height:100%;"><div id="dvMogTickerList"></div><button id="dvMogAddTicker" class="dv-mog-fab" aria-label="Add ticker message">+</button></div>';
      var list = $("dvMogTickerList");
      if (!items.length) list.innerHTML = '<div class="dv-mog-empty">No ticker messages yet. Tap + to add one.</div>';
      items.forEach(function (it) {
        var row = document.createElement("div");
        row.className = "dv-mog-ticker-row";
        row.innerHTML =
          '<div class="dv-mog-ticker-preview" style="background:' + (it.bgColor || "#1877F2") + ';color:' + (it.textColor || "#fff") + ';">' + dvEscapeHtml(it.message) + '</div>' +
          '<div class="dv-mog-ticker-actions"><button data-edit>Edit</button><button data-delete style="color:var(--dv-danger);">Delete</button><span style="margin-left:auto;font-size:0.75rem;color:var(--dv-text-secondary);">' + (it.active ? "Active" : "Inactive") + '</span></div>';
        row.querySelector("[data-edit]").addEventListener("click", function () { dvMogOpenTickerEditor(it); });
        row.querySelector("[data-delete]").addEventListener("click", function () { dvMogDeleteTickerRow(it.row); });
        list.appendChild(row);
      });
      $("dvMogAddTicker").addEventListener("click", function () { dvMogOpenTickerEditor(null); });
    });
  }

  function dvMogOpenTickerEditor(item) {
    var body = $("dvMogBody");
    var currentSpeed = item && item.speed ? item.speed.toLowerCase() : "normal";
    body.innerHTML =
      '<div style="padding:18px;">' +
        '<div class="dv-appt-field"><label class="dv-appt-label" style="font-size:0.9rem;">Message</label><textarea id="dvMogTickerMsg" class="dv-appt-textarea" style="min-height:80px;">' + (item ? dvEscapeHtml(item.message) : "") + '</textarea></div>' +
        '<div class="dv-appt-field" style="margin-top:14px;"><label class="dv-appt-label" style="font-size:0.9rem;">Background Color</label><input id="dvMogTickerBg" type="text" class="dv-appt-input" placeholder="e.g. black, white, or #000000" value="' + (item ? item.bgColor : "#1877F2") + '"></div>' +
        '<div class="dv-appt-field" style="margin-top:14px;"><label class="dv-appt-label" style="font-size:0.9rem;">Text Color</label><input id="dvMogTickerText" type="text" class="dv-appt-input" placeholder="e.g. white or #ffffff" value="' + (item ? item.textColor : "#FFFFFF") + '"></div>' +
        '<div class="dv-appt-field" style="margin-top:14px;"><label class="dv-appt-label" style="font-size:0.9rem;">Link (optional)</label><input id="dvMogTickerUrl" class="dv-appt-input" value="' + (item ? dvEscapeHtml(item.url || "") : "") + '"></div>' +
        '<div class="dv-appt-field" style="margin-top:14px;"><label class="dv-appt-label" style="font-size:0.9rem;">Button Label</label><input id="dvMogTickerBtnLabel" class="dv-appt-input" value="' + (item && (item.btnLabel || item.BtnLabel) ? dvEscapeHtml(item.btnLabel || item.BtnLabel) : "Learn More") + '"></div>' +
        '<div class="dv-appt-field" style="margin-top:14px;"><label class="dv-appt-label" style="font-size:0.9rem;">Ticker Speed</label><select id="dvMogTickerSpeed" class="dv-appt-select"><option value="normal" ' + (currentSpeed === "normal" ? "selected" : "") + '>Normal</option><option value="fast" ' + (currentSpeed === "fast" ? "selected" : "") + '>Fast</option><option value="slow" ' + (currentSpeed === "slow" ? "selected" : "") + '>Slow</option></select></div>' +
        '<button id="dvMogSaveTicker" class="dv-appt-btn" style="margin-top:18px;">Save</button>' +
        '<button id="dvMogCancelTicker" class="dv-bio-toggle" style="margin-top:10px;">Cancel</button>' +
      '</div>';
    $("dvMogSaveTicker").addEventListener("click", function () {
      var payload = {
        action: "mogSaveTicker", token: dvMogGetToken(),
        Message: $("dvMogTickerMsg").value.trim(), BGcolor: $("dvMogTickerBg").value.trim(), TextColor: $("dvMogTickerText").value.trim(), URLlink: $("dvMogTickerUrl").value.trim(), BtnLabel: $("dvMogTickerBtnLabel").value.trim(), Speed: $("dvMogTickerSpeed").value
      };
      if (item) payload.Row = item.row;
      var ov = $("dvSubmitOverlay"), ot = $("dvSubmitOverlayText");
      ov.classList.remove("dv-hidden"); ov.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden"); $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
      ot.textContent = "Saving ticker...";
      dvApiCall(payload).then(function (res) {
        ov.classList.add("dv-hidden");
        if (res.status !== "success") { dvShowToast(res.message || "Could not save."); return; }
        dvMogRenderTicker();
      });
    });
    $("dvMogCancelTicker").addEventListener("click", dvMogRenderTicker);
  }

  function dvMogDeleteTickerRow(row) {
    var ov = $("dvSubmitOverlay"), ot = $("dvSubmitOverlayText");
    ov.classList.remove("dv-hidden"); ov.querySelector(".dv-overlay-spinner").classList.remove("dv-hidden"); $("dvBtnGoInboxFromOverlay").classList.add("dv-hidden");
    ot.textContent = "Deleting ticker...";
    dvApiCall({ action: "mogDeleteTicker", token: dvMogGetToken(), Row: row }).then(function (res) {
      ov.classList.add("dv-hidden");
      if (res.status !== "success") { dvShowToast(res.message || "Could not delete."); return; }
      dvMogRenderTicker();
    });
  }

  function dvMogHandleLogout() {
    dvApiCall({ action: "mogLogout", token: dvMogGetToken() }).then(function () {
      dvMogClearToken();
      dvMogState.authenticated = false;
      dvMogState.activeThreadDevice = null;
      dvMogShowSignIn();
    });
  }

  // =====================================================================
  // INIT — app-wide refresh happens here, and only here.
  // =====================================================================
  document.addEventListener("DOMContentLoaded", function () {
    dvGetDeviceId();
    dvInitNetworkMonitor();
    dvLoadDarkPreference();
    dvBindShellEvents();
    dvBindMogAuthEvents();
    dvBindMogNavEvents();
    dvBindApptEvents();
    dvInitPWA();

    Promise.all([dvKvGet("hasSubmitted"), dvKvGet("draftName"), dvKvGet("termsAccepted")]).then(function (vals) {
      if (vals[0]) dvRevealInboxNav();
      if (vals[1]) $("dvApptName").value = vals[1];
      if (vals[2]) dvOpenFormAfterTerms();
      dvValidateForm();
    });

    dvRefreshInboxModal(false);
  });
