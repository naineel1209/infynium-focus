// Background Service Worker for Chrome Extension
// This file runs as a service worker in the background

// Define message types for better type safety
interface MessageRequest {
  action: string;
  url?: string;
  timestamp?: number;
  currentUrl?: string;
  userAgent?: string;
  pageTitle?: string;
  timeSpent?: number;
  [key: string]: unknown;
}

interface MessageResponse {
  status?: string;
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

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

// Enhanced message handling from popup or content scripts
chrome.runtime.onMessage.addListener((message: MessageRequest, sender, sendResponse: (response: MessageResponse) => void) => {
  console.log('Received message:', message, 'from:', sender);
  
  // Handle different message types
  switch (message.action) {
    case 'checkStatus':
      // Handle status check
      console.log('Status check requested');
      sendResponse({ 
        status: 'active', 
        timestamp: Date.now(),
        extensionId: chrome.runtime.id
      });
      return true; // Required for async response

    case 'bypassSite':
      // Logic to bypass the blocked site
      console.log('Bypass requested for:', message.url);
      
      // Here you would implement your bypass logic
      // For example:
      // - Check if site is in blocklist
      // - Apply bypass method (proxy, cache, etc.)
      // - Log the attempt
      
      sendResponse({ 
        success: true, 
        message: 'Bypass attempt initiated',
        url: message.url,
        timestamp: message.timestamp
      });
      return true;

    case 'customAction':
      // Handle custom actions with detailed data
      console.log('Custom action received:', {
        url: message.currentUrl,
        title: message.pageTitle,
        userAgent: message.userAgent,
        timestamp: message.timestamp
      });
      
      sendResponse({ 
        success: true, 
        message: 'Custom action processed',
        receivedData: {
          url: message.currentUrl,
          title: message.pageTitle,
          timestamp: message.timestamp
        }
      });
      return true;

    case 'pageUnloading':
      // Handle page unload events
      console.log('Page unloading:', {
        url: message.url,
        timeSpent: message.timeSpent
      });
      
      // You could log analytics, save state, etc.
      sendResponse({ success: true, message: 'Unload event logged' });
      return true;

    default:
      console.warn('Unknown action:', message.action);
      sendResponse({ 
        success: false, 
        message: `Unknown action: ${message.action}` 
      });
      return true;
  }
});

// Helper function to check if a site is blocked
async function isSiteBlocked(url: string): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get(['blockedSites']);
    const blockedSites = result.blockedSites || [];
    
    return blockedSites.some((blockedUrl: string) => 
      url.includes(blockedUrl) || new URL(url).hostname.includes(blockedUrl)
    );
  } catch (error) {
    console.error('Error checking blocked sites:', error);
    return false;
  }
}

// Helper function to add a site to the block list
async function addBlockedSite(url: string): Promise<void> {
  try {
    const result = await chrome.storage.local.get(['blockedSites']);
    const blockedSites = result.blockedSites || [];
    
    if (!blockedSites.includes(url)) {
      blockedSites.push(url);
      await chrome.storage.local.set({ blockedSites });
      console.log('Added blocked site:', url);
    }
  } catch (error) {
    console.error('Error adding blocked site:', error);
  }
}

// Optional: Network request handling
chrome.webRequest?.onBeforeRequest?.addListener(
  (details) => {
    console.log('Request intercepted:', details.url);
    
    // Your interception logic here
    // You could check if the site is blocked and redirect or cancel
    
    return { cancel: false }; // Don't block the request
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Export helper functions for potential use by other parts of the extension
export { addBlockedSite, isSiteBlocked };

