
  document.addEventListener("DOMContentLoaded", function() {
    // 1. Fetch immediately when the app opens (slight delay to let core UI render)
    setTimeout(function() { 
      if (typeof dvFetchTicker === "function") dvFetchTicker(); 
    }, 1500);

    // 2. Poll silently in the background every 60 seconds
    setInterval(function() {
      // Only poll if the device actually has an internet connection to save battery
      if (navigator.onLine && typeof dvFetchTicker === "function") {
        dvFetchTicker();
      }
    }, 60000);
  });
