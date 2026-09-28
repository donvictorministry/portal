document.addEventListener("DOMContentLoaded", function() {
  
  var CONFIG = {
    whatsappNumber: "2348086590253", 
    whatsappMessage: "Hello, I am contacting you regarding the Appointment Portal terms and resources."
  };

  // 1. Overwrite the global "terms" page with the fully merged, premium-formatted content
  if (window.DV_PAGES) {
    window.DV_PAGES["terms"] = {
      title: "Terms of Use & Privacy",
      html: '<h3 style="color:var(--dv-accent-dark); font-size:1.4rem; font-weight:900; margin-bottom:8px;">Terms of Use & Privacy Policy</h3>' +
            
            '<p style="font-size:1.1rem; color:var(--dv-text-secondary); line-height:1.65; margin-bottom:24px;">' +
              '<strong style="color:var(--dv-text);">1. Acceptance of Terms —</strong>By accessing or using this Appointment Portal, you acknowledge that you have read, understood, and agreed to these Terms of Use and Privacy Policy.' +
            '</p>' +

            '<h4 style="color:var(--dv-accent); font-size:1.15rem; font-weight:700; margin:0 0 12px 0;"></h4>' +
            '<ul style="font-size:1.1rem; color:var(--dv-text-secondary); line-height:1.7; padding-left:24px; margin-bottom:24px;">' +
             '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">2. Ownership —</strong>The portal is developed, created, owned, and operated by its developer, Rev. Don Victor, PhD. All content, design, and functionality are proprietary and protected by applicable intellectual property laws. You may not copy, modify, reproduce, decompile, or attempt to derive the portal’s underlying source code.</li>' +
              '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">3. Online & Offline Appointments —</strong> The portal facilitates requests for both online and in-person appointments. Confirmed appointment details may vary according to the nature and circumstances of the appointment.</li>' +
              '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">4. Participation in an appointment, prayer, counseling, mentorship, prophetic consultation, academic advising, or any other engagement is offered in good faith and does not imply any financial benefit.</li>' +
              '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">5. Age Restriction —</strong> By using this portal, you confirm that you are at least 18 years of age. If you are under 18, you confirm that you have obtained parental or guardian consent to use the App in accordance with the laws of your jurisdiction.</li>' +
            '</ul>' +

            '<div style="background-color:rgba(24,119,242,0.08); padding:18px; border-left:4px solid var(--dv-accent); margin-bottom:24px; border-radius:0 8px 8px 0;">' +
              '<strong style="display:block; margin-bottom:10px; color:var(--dv-accent-dark); font-size:1.1rem;">Conduct & Prohibited Use:</strong>' +
              '<ul style="margin:0; padding-left:20px; color:var(--dv-text); font-size:1rem; line-height:1.6;">' +
                '<li style="margin-bottom:8px;"><strong>6. Accurate Information —</strong>Users must provide accurate, complete, and truthful information. Providing false, misleading, or fraudulent information is prohibited.</li>' +
                '<li style="margin-bottom:8px;"><strong>7. Respectful Conduct —</strong>Users must communicate respectfully and must not engage in harassment, threats, intimidation, abusive language, hate-based conduct, sexual misconduct, or any other inappropriate behavior.</li>' +
                '<li style="margin-bottom:8px;"><strong>8. No Harmful Activities  —</strong>The portal must not be used for impersonation, fraud, malicious or any unlawful activities that may harm other users, the developer, or the ministry.</li>' +
              '</ul>' +
            '</div>' +

            '<a href="https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(CONFIG.whatsappMessage) + '" target="_blank" style="display:inline-flex; align-items:center; gap:10px; background:#25D366; color:#fff; padding:14px 20px; border-radius:12px; text-decoration:none; font-weight:800; font-size:1.05rem; box-shadow:0 4px 12px rgba(37,211,102,0.25); margin-bottom:28px;">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>' +
              'Contact Ministry' +
            '</a>' +

            '<!-- NATIVE SHOW MORE TOGGLE -->' +
            '<button id="dvTermsShowMoreBtn" style="width:100%; min-height:54px; border-radius:27px; background:transparent; color:var(--dv-accent); border:2px solid var(--dv-accent); font-size:1.1rem; font-weight:800; cursor:pointer; margin-bottom:20px;">Read More</button>' +

            '<div id="dvTermsHiddenContent" style="display:none;">' +
              '<hr style="border:none; border-top:1px solid var(--dv-border); margin:20px 0 24px 0;">' +
              
              '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 12px 0;">Privacy & Records</h4>' +
              '<ul style="font-size:1.05rem; color:var(--dv-text-secondary); line-height:1.7; padding-left:24px; margin-bottom:24px;">' +
                '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">9. Privacy & Confidentiality —</strong>Information submitted through the portal may include personal information and will be handled with utmost confidentiality. Such information may be deleted from our database after processing. We do not store or transmit your data to external servers. Limited technical information may be collected solely for analytics and to maintain and improve the portal experience.</li>' +
                '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">10. Communication & Records —</strong>Communications and information submitted through the portal may be retained as reasonably necessary for appointment administration and record-keeping and will be protected through reasonable administrative, technical, and organizational measures.</li>' +
                '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">11. Third-Party Communication —</strong> Where an appointment involves external communication tools or services, their use may also be subject to the terms and privacy policies of those respective services.</li>' +
              '</ul>' +

              '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 12px 0;">Security, Access</h4>' +
              '<ul style="font-size:1.1rem; color:var(--dv-text-secondary); line-height:1.7; padding-left:24px; margin-bottom:24px;">' +
                '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">12. No Unauthorized Access —</strong>Users must not attempt to gain unauthorized access to the portal, its systems, administrative console, appointment records, or another user’s information.</li>' +
                '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">13. Security & Misuse Reporting —</strong>Suspected security breaches, impersonation, abuse, or misuse of the portal may be investigated and, where appropriate, reported to the relevant authorities.</li>' +
                '<li style="margin-bottom:12px;"><strong style="color:var(--dv-text);">14. Right to Restrict Access —</strong>We reserve the right, where reasonably necessary and subject to operational requirements, to decline, cancel, suspend, restrict, or terminate appointment requests or access to the portal where there is evidence of impersonation, abuse, misconduct, misuse, security concerns, or violation of these terms, without notice.</li>' +
              '</ul>' +

              '<div style="background-color:rgba(24,119,242,0.08); padding:18px; border-left:4px solid var(--dv-accent); margin-bottom:24px; border-radius:0 8px 8px 0;">' +
                '<strong style="display:block; margin-bottom:8px; color:var(--dv-accent-dark); font-size:1.1rem;">15. Warranties & Liability:</strong>' +
                '<span style="color:var(--dv-text); font-size:1rem; line-height:1.6;">The portal is provided “as is” and “as available,” without warranties of any kind, express or implied. To the fullest extent permitted by law, Rev. Don Victor, PhD is not liable for any direct or indirect consequences arising from the use of the portal.</span>' +
              '</div>' +

              '<h4 style="color:var(--dv-accent-dark); font-size:1.15rem; font-weight:800; margin:0 0 12px 0;">Governing Law & Updates</h4>' +
              '<p style="font-size:1.05rem; color:var(--dv-text-secondary); line-height:1.65; margin-bottom:12px;"><strong style="color:var(--dv-text);">16. Changes to These Terms —</strong>These Terms of Use and Privacy Policy may be updated periodically to reflect changes in the portal, ministry operations, technology, or applicable requirements. Updates will be communicated through the portal and our official social media channels. Don Victor Ministries operates under divine inspiration and aims to serve globally.</p>' +
              '<p style="font-size:1.05rem; color:var(--dv-text-secondary); line-height:1.65; margin-bottom:24px;"><strong style="color:var(--dv-text);">17. Governing Law —</strong>These Terms are subject to applicable laws and our internal regulations governing the operation and use of the Appointment Portal. Any disputes arising from these Terms or your use of the portal shall be resolved by the courts of Nigeria, specifically the courts of Akwa Ibom State. The developer reserves the right to pursue appropriate legal remedies against any individual or entity involved in unauthorized access, reverse engineering, cloning, theft, security breaches, or other unlawful interference with the portal, in accordance with applicable laws.</p>' +
            '</div>'
    };
  }

  // 2. Autonomously intercept the blue links in the Form tab
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

  // 3. Global Event Delegation for the "Show More" button inside the dynamic modal
  document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "dvTermsShowMoreBtn") {
      var hiddenContent = document.getElementById("dvTermsHiddenContent");
      if (hiddenContent) {
        hiddenContent.style.display = "block";
        e.target.style.display = "none";
        
        var modalBody = document.getElementById("dvPageBody");
        if (modalBody) {
          modalBody.scrollBy({ top: 150, behavior: 'smooth' });
        }
      }
    }
  });
});