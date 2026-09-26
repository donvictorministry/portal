
document.addEventListener("DOMContentLoaded", function() {
  var navBtn = document.getElementById("dvNavInboxBtn");
  if (!navBtn) return;

  var iconWrap = navBtn.querySelector(".dv-nav-icon-wrap");
  if (iconWrap) iconWrap.style.position = "relative";

  // 1. Inject Animation Styles
  var style = document.createElement("style");
  style.innerHTML = "@keyframes dv-env-nav-pulse { 0% { transform: scale(1); } 100% { transform: scale(1.2); box-shadow: 0 4px 10px rgba(228,30,63,0.5); } }";
  document.head.appendChild(style);

  // 2. Create and append the pulsating envelope to the bottom nav icon
  var badge = document.createElement("div");
  badge.id = "dvNavDynamicEnvelope";
  badge.style.cssText = "position: absolute; top: -10px; right: -14px; display: none; z-index: 90; cursor: pointer; pointer-events: auto;";
  badge.innerHTML = '<div style="animation: dv-env-nav-pulse 0.9s infinite alternate ease-in-out; background: var(--dv-danger); color: white; height: 22px; padding: 0 6px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>+1</div>';
  (iconWrap || navBtn).appendChild(badge);

  // 3. Vanish logic: Kill visual AND strictly update local database state permanently
  function killBadge() { 
    badge.style.display = "none";
    if (window.dvKvSet) window.dvKvSet("replyRead", true);
    if (window.dvApplyInboxIndicator) window.dvApplyInboxIndicator({ hasReply: false });
    
    // Bridge the async gap: trick the background poll into agreeing the message is read
    if (window.dvStatusCache && window.dvStatusCache.threadUpdatedAt) {
        window.dvKvSet("cachedThreadUpdatedAt", window.dvStatusCache.threadUpdatedAt);
    }
  }
  
  // Opening the Inbox immediately destroys the notification from the database
  navBtn.addEventListener("click", killBadge);

  // 4. Hook into data flow to trigger global visibility
  var originalIndicator = window.dvApplyInboxIndicator;
  if (originalIndicator) {
    window.dvApplyInboxIndicator = function(row) {
      return originalIndicator(row).then(function() {
        if (navBtn.classList.contains("dv-nav-pulse")) {
          badge.style.display = "block";
        } else {
          badge.style.display = "none";
        }
      });
    };
  }
});
