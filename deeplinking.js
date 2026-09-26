
  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      var hash = window.location.hash.substring(1).toLowerCase();
      if (!hash) return;
      
      var targetSelector = "";
      if (hash === "announcement" || hash === "info") {
        targetSelector = '[data-tab="Info"]';
      } else if (hash === "inbox") {
        targetSelector = '[data-tab="Inbox"]';
      } else if (hash === "form") {
        targetSelector = '[data-tab="Form"]';
      } else if (hash === "mission") {
        targetSelector = '[data-tab="Mission"]';
      } else if (hash === "home") {
        targetSelector = '[data-tab="Home"]';
      }

      if (!targetSelector) return;
      var triggerBtn = document.querySelector(targetSelector);
      if (triggerBtn) triggerBtn.click();
    }, 150);
  });
