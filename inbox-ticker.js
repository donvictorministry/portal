
  (function() {
    // 1. Inject the pure CSS animation for the ticker
    var style = document.createElement('style');
    style.innerHTML = 
      ".dv-inbox-ticker-wrap { width: 100%; overflow: hidden; background: rgba(24,119,242,0.06); padding: 10px 0; white-space: nowrap; border-top: 1px solid var(--dv-border); border-bottom: 1px solid var(--dv-border); }" +
      ".dv-inbox-ticker-track { display: inline-block; padding-left: 100%; animation: dvInboxScroll 60s linear infinite; font-size: 0.95rem; font-weight: 700; color: var(--dv-accent-dark); }" +
      "@keyframes dvInboxScroll { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }";
    document.head.appendChild(style);

    // 2. Wait for the DOM to be ready, then surgically swap the UI
    window.addEventListener('DOMContentLoaded', function() {
      // Find and completely destroy the old bulky instructions block
      var oldInstText = document.getElementById("dvInboxInstText");
      if (oldInstText && oldInstText.parentNode) {
        oldInstText.parentNode.remove(); 
      }

      // Inject the premium scrolling ticker directly below the modal topbar (header)
      var topbar = document.querySelector("#tab-Inbox .dv-modal-topbar");
      if (topbar) {
        var tickerHtml = 
          '<div class="dv-inbox-ticker-wrap">' +
            '<div class="dv-inbox-ticker-track">' +
              '<span>Welcome to your private line with the Servant of God &nbsp;&nbsp;&bull;&nbsp;&nbsp; “And by a prophet the LORD brought Israel out of Egypt, and by a prophet was he preserved.” — Hosea 12:13 (KJV). &nbsp;&nbsp;&bull;&nbsp;&nbsp; Please keep this tab open. The Man of God may open the chat in real time to connect with you. &nbsp;&nbsp;&bull;&nbsp;&nbsp; We pray that the Lord, in His mercy and unfailing love, will meet you at your point of need.</span>' +
            '</div>' +
          '</div>';
        topbar.insertAdjacentHTML('afterend', tickerHtml);
      }
    });
  })();
