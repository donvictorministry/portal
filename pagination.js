
  (function() {
    var CHAT_LIMIT = 4;
    var limitUser = CHAT_LIMIT, limitMog = CHAT_LIMIT;
    var allUser = [], allMog = [];
    var activeMogThread = "";

    function formatMogTime(ts) {
      if (!ts) return "";
      var d = new Date(ts);
      return isNaN(d.getTime()) ? "" : d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    // -----------------------------------------------------------
    // OVERRIDE 1: User Inbox Thread Engine (Top-Down)
    // -----------------------------------------------------------
    window.dvRenderChatThread = function(messages, isLoadOlder) {
      var container = document.getElementById("dvChatMessages");
      if (!container) return;

      if (!isLoadOlder) allUser = (messages || []).filter(function(m, i, a) { return i === 0 || m.message !== a[i-1].message; });
      
      // Reverse array so newest is at the absolute top
      var reversedAll = allUser.slice().reverse();
      var visible = reversedAll.slice(0, limitUser);
      var oldScroll = container.scrollTop;

      document.getElementById("dvReplyContent").classList.add("dv-hidden");
      document.getElementById("dvChatPausedNote").classList.add("dv-hidden");
      document.getElementById("dvChatWrap").classList.remove("dv-hidden");

      container.innerHTML = ""; 

      // Draw the visible messages (newest first)
      visible.forEach(function(m) {
        var el = document.createElement("div");
        el.className = "dv-chat-msg " + (m.sender === "User" ? "dv-mine" : "dv-theirs");
        el.textContent = m.message;
        container.appendChild(el);
      });

      // Inject "Load Older" button at the BOTTOM
      if (limitUser < reversedAll.length) {
        var btnWrap = document.createElement("div");
        btnWrap.style.cssText = "text-align:center; padding: 12px 0 4px;";
        var btn = document.createElement("button");
        btn.textContent = "Load older messages...";
        btn.style.cssText = "background: rgba(24,119,242,0.1); color: var(--dv-accent); border: none; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer;";
        btn.onclick = function() { 
          limitUser += CHAT_LIMIT; 
          dvRenderChatThread(allUser, true); 
        };
        btnWrap.appendChild(btn);
        container.appendChild(btnWrap);
      }

      // Snap to top for new threads, lock scroll position if paginating
      if (!isLoadOlder) {
        container.scrollTop = 0;
      } else {
        container.scrollTop = oldScroll;
      }
    };

    // -----------------------------------------------------------
    // OVERRIDE 2: Man of God Admin Thread Engine (Top-Down)
    // -----------------------------------------------------------
    window.dvMogRenderThreadMessages = function(messages, isLoadOlder) {
      var container = document.getElementById("dvMogThreadMessages");
      if (!container) return;

      if (!isLoadOlder) {
         var currentThread = window.dvMogState ? window.dvMogState.activeThreadDevice : "";
         if (activeMogThread !== currentThread) { 
           limitMog = CHAT_LIMIT; 
           activeMogThread = currentThread; 
         }
         allMog = (messages || []).filter(function(m, i, a) { return i === 0 || m.message !== a[i-1].message; });
      }

      var reversedAll = allMog.slice().reverse();
      var visible = reversedAll.slice(0, limitMog);
      var oldScroll = container.scrollTop;

      container.innerHTML = "";

      visible.forEach(function(m) {
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
        
        var txt = document.createElement("div");
        txt.textContent = m.message;
        bubble.appendChild(txt);
        wrap.appendChild(bubble);

        var meta = document.createElement("div");
        meta.className = "dv-mog-msg-meta";
        meta.textContent = formatMogTime(m.timestamp) + " ";
        
        if (m.sender === "MOG" && m.read) {
          var tick = document.createElement("span");
          tick.className = "dv-mog-read-tick";
          tick.textContent = "\u2713\u2713";
          meta.appendChild(tick);
        }
        wrap.appendChild(meta);

        wrap.addEventListener("click", function () {
          if (!window.dvMogState) return;
          window.dvMogState.replyToText = m.message;
          var preview = document.getElementById("dvMogReplyPreview");
          var safeDiv = document.createElement("div"); 
          safeDiv.textContent = m.message.slice(0, 60);
          preview.innerHTML = '<span>Replying to: ' + safeDiv.innerHTML + '</span><button id="dvMogCancelReply" style="border:none;background:none;color:var(--dv-accent);font-weight:700;">Cancel</button>';
          preview.classList.remove("dv-hidden");
          document.getElementById("dvMogCancelReply").addEventListener("click", function () { 
            window.dvMogState.replyToText = ""; 
            preview.classList.add("dv-hidden"); 
          });
        });

        container.appendChild(wrap);
      });

      if (limitMog < reversedAll.length) {
        var btnWrap = document.createElement("div");
        btnWrap.style.cssText = "text-align:center; padding: 12px 0 4px;";
        var btn = document.createElement("button");
        btn.textContent = "Load older messages...";
        btn.style.cssText = "background: rgba(24,119,242,0.1); color: var(--dv-accent); border: none; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer;";
        btn.onclick = function() { 
          limitMog += CHAT_LIMIT; 
          dvMogRenderThreadMessages(allMog, true); 
        };
        btnWrap.appendChild(btn);
        container.appendChild(btnWrap);
      }

      if (!isLoadOlder) {
        container.scrollTop = 0;
      } else {
        container.scrollTop = oldScroll;
      }
    };
  })();
