
document.addEventListener("DOMContentLoaded", function() {
  
  // 1. App-specific config (replacing the old script's config)
  var CONFIG = {
    whatsappNumber: "2340000000000", 
    whatsappMessage: "Hello, I am contacting you regarding the Appointment Portal terms and resources."
  };

  // 2. Overwrite the global "terms" page with the migrated, premium-formatted content
  if (window.DV_PAGES) {
    window.DV_PAGES["terms"] = {
      title: "Terms & Privacy",
      html: '<h3 style="color:var(--dv-accent-dark); font-size:1.5rem; font-weight:900; margin-bottom:8px;">Legal & Privacy</h3>' +
            '<p style="font-size:1rem; color:var(--dv-text-secondary); line-height:1.6; margin-bottom:24px;">Please read these terms carefully. By using this platform, you agree to the following guidelines.</p>' +
            
            '<h4 style="color:var(--dv-accent); font-size:1.15rem; font-weight:700; margin:0 0 10px 0;">Ownership & Fair Use</h4>' +
            '<p style="font-size:1rem; color:var(--dv-text-secondary); line-height:1.6; margin-bottom:16px;">This Appointment Portal is created, owned, and operated by Rev. Chris Johnson, PhD. All content, design, and functionality are proprietary. You agree to use the App responsibly and not to engage in any activity that may disrupt its performance or compromise security.</p>' +

            '<div style="background-color:rgba(24,119,242,0.08); padding:18px; border-left:4px solid var(--dv-accent); margin-bottom:24px; border-radius:0 8px 8px 0;">' +
              '<strong style="display:block; margin-bottom:8px; color:var(--dv-accent-dark); font-size:1.05rem;">Proper Conduct:</strong>' +
              '<ul style="margin:0; padding-left:20px; color:var(--dv-text); font-size:0.95rem; line-height:1.6;">' +
                '<li style="margin-bottom:6px;">Do not attempt unauthorized access to the system.</li>' +
                '<li style="margin-bottom:6px;">Do not clone, decompile, or misuse the source code.</li>' +
                '<li>Violations will result in an immediate and permanent ban.</li>' +
              '</ul>' +
            '</div>' +

            '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 10px 0;">Access & Liability</h4>' +
            '<p style="font-size:1rem; color:var(--dv-text-secondary); line-height:1.6; margin-bottom:20px;">We reserve the right to restrict or terminate access at our sole discretion. The App is provided "as is," and the Developer is not liable for any direct or indirect consequences resulting from its use.</p>' +
            
            '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 10px 0;">Contact Information</h4>' +
            '<p style="font-size:1rem; color:var(--dv-text-secondary); line-height:1.6; margin-bottom:12px;">For questions or inquiries regarding these Terms, contact us directly:</p>' +
            '<a href="https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(CONFIG.whatsappMessage) + '" target="_blank" style="display:inline-flex; align-items:center; gap:10px; background:#25D366; color:#fff; padding:14px 20px; border-radius:12px; text-decoration:none; font-weight:800; font-size:1.05rem; box-shadow:0 4px 12px rgba(37,211,102,0.25); margin-bottom:28px;">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>' +
              'Contact Ministry' +
            '</a>' +

            '<!-- NATIVE SHOW MORE TOGGLE -->' +
            '<button id="dvTermsShowMoreBtn" style="width:100%; min-height:54px; border-radius:27px; background:transparent; color:var(--dv-accent); border:2px solid var(--dv-accent); font-size:1.05rem; font-weight:800; cursor:pointer; margin-bottom:20px;">Read Privacy Policy & More</button>' +

            '<div id="dvTermsHiddenContent" style="display:none;">' +
              '<hr style="border:none; border-top:1px solid var(--dv-border); margin:20px 0 24px 0;">' +
              '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 10px 0;">Privacy Policy</h4>' +
              '<p style="font-size:1rem; color:var(--dv-text-secondary); line-height:1.6; margin-bottom:16px;">We do not store or transmit your log data to external servers. Your privacy is fully respected. To help the portal run smoothly, we may collect limited technical information (such as load times and device info) solely to analyze and improve the App experience.</p>' +
              
              '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 10px 0;">Divine Inspiration</h4>' +
              '<p style="font-size:1rem; color:var(--dv-text-secondary); line-height:1.6; margin-bottom:16px;">The platform operates under divine inspiration to serve the global community. We reserve the right to update these terms at any time to align with spiritual directives and global digital standards.</p>' +
              
              '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 10px 0;">Governing Law</h4>' +
              '<p style="font-size:1rem; color:var(--dv-text-secondary); line-height:1.6; margin-bottom:16px;">These Terms are governed by the laws of the Federal Republic of Nigeria. You confirm you are at least 18 years of age, or have guardian consent to use this application.</p>' +
            '</div>'
    };
  }

  // 3. Autonomously intercept the blue links in the Form tab
  var termsContainer = document.getElementById("dvTermsView");
  if (termsContainer) {
    var links = termsContainer.querySelectorAll("a");
    links.forEach(function(link) {
      link.addEventListener("click", function(e) {
        e.preventDefault(); 
        if (typeof window.dvOpenPage === "function") {
          window.dvOpenPage("terms"); 
        }
      });
    });
  }

  // 4. Global Event Delegation for the "Show More" button inside the dynamic modal
  document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "dvTermsShowMoreBtn") {
      var hiddenContent = document.getElementById("dvTermsHiddenContent");
      if (hiddenContent) {
        hiddenContent.style.display = "block";
        e.target.style.display = "none";
        
        // Smooth scroll to reveal new content safely
        var modalBody = document.getElementById("dvPageBody");
        if (modalBody) {
          modalBody.scrollBy({ top: 150, behavior: 'smooth' });
        }
      }
    }
  });

});
