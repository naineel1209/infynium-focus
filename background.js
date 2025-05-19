// Listen for navigation events and handle them
chrome.webNavigation.onCompleted.addListener(
  function(details) {
    console.log("Navigation completed:", details);
    
    // Example: Check if navigation is to a specific domain
    const url = new URL(details.url);
    if (url.hostname.includes('example.com')) {
      console.log("Detected navigation to example.com");
      
      // Example action: Create a notification or modify the tab
      chrome.tabs.get(details.tabId, function(tab) {
        // You can perform actions on the tab here
      });
    }
  }
);

// Listen for tab updates (e.g., when a page loads)
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
      console.log("Tab updated:", tab.url);
      
      // Store the navigation in history
      chrome.storage.local.get(['navigationHistory'], function(result) {
        let history = result.navigationHistory || [];
        history.push({
          url: tab.url,
          title: tab.title,
          timestamp: new Date().toISOString()
        });
        
        // Limit history to last 100 entries
        if (history.length > 100) {
          history = history.slice(-100);
        }
        
        chrome.storage.local.set({ navigationHistory: history });
      });
    }
  }
);

// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  console.log("Extension installed/updated");
  
  // Initialize storage
  chrome.storage.local.set({ 
    navigationHistory: [],
    settings: {
      trackNavigation: true,
      blockSites: []
    }
  });
});
