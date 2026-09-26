
  (function() {
    window.addEventListener('DOMContentLoaded', function() {
      var mogNav = document.querySelector('#dvMogHome .dv-mog-bottom-nav');
      if (mogNav) {
        var syncBtn = document.createElement('button');
        syncBtn.className = 'dv-mog-nav-btn';
        syncBtn.dataset.mogTab = 'Sync';
        syncBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.44l5.66 5.66"/></svg>Sync';
        syncBtn.addEventListener('click', function() { dvMogSwitchTab('Sync'); });
        mogNav.appendChild(syncBtn);
      }
    });

    var originalDvMogSwitchTab = window.dvMogSwitchTab;
    window.dvMogSwitchTab = function(tab) {
      originalDvMogSwitchTab(tab); 
      
      if (tab === "Sync") {
        var body = document.getElementById("dvMogBody");
        body.innerHTML = 
          '<div style="padding: 30px 24px;">' +
            '<h3 style="margin-top:0; color:var(--dv-accent-dark); text-align:center; font-weight:800;">Master Sync Controls</h3>' +
            '<p style="text-align:center; color:var(--dv-text-secondary); font-size:0.95rem; margin-bottom:30px; line-height:1.5;">Tap to instantly pull the latest live data directly into the interface.</p>' +
            
            '<button id="dvMogSyncInbox" class="dv-appt-btn" style="margin-bottom:16px; background:#16A34A; box-shadow: 0 4px 12px rgba(22,163,74,0.3);">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Sync Inbox Now' +
            '</button>' +

            '<button id="dvMogSyncTicker" class="dv-appt-btn" style="margin-bottom:16px; background:var(--dv-accent); box-shadow: 0 4px 12px rgba(24,119,242,0.3);">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px;"><path d="M12 2l3 6 6 1-4.5 4.5L17 20l-5-3-5 3 1.5-6.5L4 9l6-1z"></path></svg> Sync Ticker Now' +
            '</button>' +

            '<button id="dvMogSyncGlobal" class="dv-appt-btn" style="background:var(--dv-danger); box-shadow: 0 4px 12px rgba(228,30,63,0.3);">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 12 12 14 14"></polyline></svg> App-Wide Refresh' +
            '</button>' +
          '</div>';

        document.getElementById("dvMogSyncInbox").addEventListener("click", function() { 
          dvRefreshInboxModal(true); 
          dvShowToast("Inbox synced successfully.");
        });
        
        document.getElementById("dvMogSyncTicker").addEventListener("click", function() { 
          dvFetchTicker(); 
          dvShowToast("Ticker synced successfully.");
        });
        
        document.getElementById("dvMogSyncGlobal").addEventListener("click", function() { 
          dvShowToast("Refreshing app...");
          setTimeout(function() { window.location.reload(); }, 600);
        });
      }
    };
  })();
  
