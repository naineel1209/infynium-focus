// Background Service Worker for Chrome Extension
// This file runs as a service worker in the background

console.log('Background service worker initialized');

// Example: Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // You could initialize storage, set default values, etc.
  chrome.storage.local.set({ 
    enabled: true,
    blockedSites: [],
    bypassMethods: ['proxy', 'cache']
  });
});

// Example: Listen for tab updates
chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  // Only run when the page is fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
    
    // Check if this is a blocked site that needs bypassing
    // Your logic here...
  }
});

// Example: Message handling from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message, 'from:', sender);
  
  if (message.action === 'checkStatus') {
    // Handle status check
    sendResponse({ status: 'active' });
    return true; // Required for async response
  }
  
  if (message.action === 'bypassSite') {
    // Logic to bypass the blocked site
    // ...
    
    sendResponse({ success: true });
    return true;
  }
});

// Optional: Network request handling
chrome.webRequest?.onBeforeRequest?.addListener(
  () => {
    // Your interception logic here
    return { cancel: false }; // Don't block the request
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
