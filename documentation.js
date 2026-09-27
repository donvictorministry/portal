document.addEventListener("DOMContentLoaded", function() {
  // 1. Inject the documentation content into the global DV_PAGES object safely
  if (window.DV_PAGES) {
    window.DV_PAGES["documentation"] = {
      title: "Product Documentation",
      html: '<h3>App Evolution & Release Notes</h3>' +
            '<p>Dr. Don Victor welcomes you to the official documentation of the Appointment Portal. This evolving digital platform provides a seamless, secure, and private way to schedule both online and offline appointments.</p>' +
            '<div class="dv-info-list">' +
              '<div class="dv-info-row" style="align-items:flex-start;">' +
                '<span class="dv-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>' +
                '<div class="dv-info-text">' +
                  '<strong style="color:var(--dv-accent-dark);font-size:1.05rem;">Version 1.2: Refined Experience (Current)</strong><br>' +
                  '<span style="display:block;margin-top:6px;color:var(--dv-text-secondary);font-size:1rem;line-height:1.5;">' +
                  '&bull; Introduced smart global indicators to instantly alert users of new private replies.<br>' +
                  '&bull; Upgraded the core engine for lightning-fast loading speeds, optimized for low-internet networks.<br>' +
                  '&bull; Enhanced the scrolling and readability across all global announcements.' +
                  '</span>' +
                '</div>' +
              '</div>' +
              '<div class="dv-info-row" style="align-items:flex-start;">' +
                '<span class="dv-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></span>' +
                '<div class="dv-info-text">' +
                  '<strong style="color:var(--dv-accent-dark);font-size:1.1rem;">Version 1.1: Live Engagement</strong><br>' +
                  '<span style="display:block;margin-top:6px;color:var(--dv-text-secondary);font-size:1rem;line-height:1.5;">' +
                  '&bull; Launched the real-time announcement ticker for immediate updates.<br>' +
                  '&bull; Added offline capabilities, allowing users to access previously loaded content without an active internet.<br>' +
                  '&bull; Deployed the interactive mission and portfolio features.' +
                  '</span>' +
                '</div>' +
              '</div>' +
              '<div class="dv-info-row" style="align-items:flex-start;">' +
                '<span class="dv-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>' +
                '<div class="dv-info-text">' +
                  '<strong style="color:var(--dv-accent-dark);font-size:1.1rem;">Version 1.0: Foundation</strong><br>' +
                  '<span style="display:block;margin-top:6px;color:var(--dv-text-secondary);font-size:1rem;line-height:1.5;">' +
                  '&bull; Established the secure, private digital portal for appointment requests.<br>' +
                  '&bull; Implemented the 24-hour smart quota system to ensure fair access for all users worldwide.<br>' +
                  '&bull; Created the foundational two-way communication inbox.' +
                  '</span>' +
                '</div>' +
              '</div>' +
            '</div>'
    };
  }

  // 2. Locate the left sidebar body and inject the new button at the very end
  var sidebarBody = document.querySelector("#dvLeftSidebar .dv-sidebar-body");
  if (sidebarBody) {
    var docBtn = document.createElement("button");
    docBtn.className = "dv-sidebar-item";
    
    // Using a clean 'book-open' SVG icon
    docBtn.innerHTML = '<span class="dv-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></span>Product Documentation';
    
    // Attach the exact same UI behavior as the rest of your app
    docBtn.addEventListener("click", function() {
      if (typeof window.dvCloseLeftSidebar === "function") window.dvCloseLeftSidebar();
      if (typeof window.dvOpenPage === "function") window.dvOpenPage("documentation");
    });
    
    sidebarBody.appendChild(docBtn);
  }
});