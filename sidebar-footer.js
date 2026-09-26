
document.addEventListener("DOMContentLoaded", function() {
  // 1. Inject the content into the global DV_PAGES overlay architecture with premium rich-text formatting
  if (window.DV_PAGES) {
    window.DV_PAGES["vision"] = {
      title: "Our Vision",
      html: '<h3 style="color:var(--dv-accent-dark); font-size:1.5rem; font-weight:900; margin-bottom:8px;">The Vision</h3>' +
            '<h4 style="color:var(--dv-accent); font-size:1.15rem; font-weight:700; margin:0 0 20px 0;">Our Global Mandate</h4>' +
            '<p style="font-size:1.05rem; color:var(--dv-text-secondary); line-height:1.65; margin-bottom:16px;">To reach the unreached, build a global community of faith, and transform lives through genuine spiritual connection and dedicated mentorship.</p>' +
            '<div style="background-color:rgba(24,119,242,0.08); padding:18px; border-left:4px solid var(--dv-accent); margin-bottom:24px; border-radius:0 8px 8px 0;">' +
              '<strong style="display:block; margin-bottom:8px; color:var(--dv-accent-dark); font-size:1.05rem;">Core Focus:</strong>' +
              '<span style="color:var(--dv-text); font-size:1rem; line-height:1.6;">We are committed to serving the community and sharing a powerful message of hope.</span>' +
            '</div>'
    };

    window.DV_PAGES["goals"] = {
      title: "Our Goals",
      html: '<h3 style="color:var(--dv-accent-dark); font-size:1.5rem; font-weight:900; margin-bottom:8px;">Ministry Goals</h3>' +
            '<h4 style="color:var(--dv-accent); font-size:1.15rem; font-weight:700; margin:0 0 20px 0;">Strategic Objectives</h4>' +
            '<ol style="font-size:1.05rem; color:var(--dv-text-secondary); line-height:1.7; padding-left:24px; margin-bottom:24px;">' +
              '<li style="margin-bottom:12px;">Expand our digital and physical outreach globally.</li>' +
              '<li style="margin-bottom:12px;">Provide accessible, 24/7 spiritual counseling.</li>' +
              '<li style="margin-bottom:12px;">Equip local leaders with resources and training.</li>' +
            '</ol>'
    };

    window.DV_PAGES["support"] = {
      title: "Support",
      html: '<h3 style="color:var(--dv-accent-dark); font-size:1.5rem; font-weight:900; margin-bottom:8px;">Support Us</h3>' +
            '<h4 style="color:var(--dv-accent); font-size:1.15rem; font-weight:700; margin:0 0 20px 0;">Partner With The Ministry</h4>' +
            '<p style="font-size:1.05rem; color:var(--dv-text-secondary); line-height:1.65; margin-bottom:24px;">Your engagement and prayers sustain this mission.</p>' +
            '<div style="background-color:rgba(24,119,242,0.08); padding:18px; border-left:4px solid var(--dv-accent); margin-bottom:24px; border-radius:0 8px 8px 0;">' +
              '<strong style="display:block; margin-bottom:8px; color:var(--dv-accent-dark); font-size:1.05rem;">How to Partner:</strong>' +
              '<span style="color:var(--dv-text); font-size:1rem; line-height:1.6;">To actively partner with us, please reach out via the official channels listed in the Mission tab.</span>' +
            '</div>'
    };

    window.DV_PAGES["faq"] = {
      title: "FAQ",
      html: '<h3 style="color:var(--dv-accent-dark); font-size:1.5rem; font-weight:900; margin-bottom:8px;">Frequently Asked Questions</h3>' +
            '<h4 style="color:var(--dv-accent); font-size:1.15rem; font-weight:700; margin:0 0 20px 0;">Everything You Need to Know</h4>' +
            '<div style="background-color:rgba(24,119,242,0.08); padding:18px; border-left:4px solid var(--dv-accent); margin-bottom:24px; border-radius:0 8px 8px 0;">' +
              '<strong style="display:block; margin-bottom:8px; color:var(--dv-accent-dark); font-size:1.05rem;">Important Note:</strong>' +
              '<span style="color:var(--dv-text); font-size:1rem; line-height:1.6;">All prayer requests and counseling messages submitted through this portal are strictly confidential and reviewed directly by the Man of God.</span>' +
            '</div>' +
            '<ol style="font-size:1.05rem; color:var(--dv-text-secondary); line-height:1.7; padding-left:24px; margin-bottom:24px;">' +
              '<li style="margin-bottom:18px;">' +
                '<strong style="color:var(--dv-text); display:block; margin-bottom:4px;">When will I get a reply?</strong>' +
                'The Man of God reviews messages daily. Please check your Inbox regularly for a response.' +
              '</li>' +
              '<li style="margin-bottom:18px;">' +
                '<strong style="color:var(--dv-text); display:block; margin-bottom:4px;">Can I request a live chat?</strong>' +
                'Live chats are initiated directly by the Man of God based on spiritual leading. To ensure you don\'t miss out:' +
                '<ul style="padding-left:24px; margin-top:8px; list-style-type:disc;">' +
                  '<li style="margin-bottom:6px;">Keep your app installed.</li>' +
                  '<li style="margin-bottom:6px;">Watch out for the global red envelope alert.</li>' +
                '</ul>' +
              '</li>' +
            '</ol>'
    };
  }

  // 2. Locate the modular footer and auto-build the 4 buttons horizontally
  var footer = document.getElementById("dvSidebarModularFooter");
  if (footer) {
    var buttonsData = [
      { id: 'vision', label: 'Vision', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { id: 'goals', label: 'Goals', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>' },
      { id: 'support', label: 'Support', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' },
      { id: 'faq', label: 'FAQ', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' }
    ];

    buttonsData.forEach(function(btn) {
      var el = document.createElement("button");
      el.className = "dv-mog-nav-btn";
      el.innerHTML = btn.icon + btn.label;
      
      // Bind to the exact app-wide routing logic
      el.addEventListener("click", function() {
        if (typeof window.dvCloseLeftSidebar === "function") window.dvCloseLeftSidebar();
        if (typeof window.dvOpenPage === "function") window.dvOpenPage(btn.id);
      });
      
      footer.appendChild(el);
    });
  }
});
