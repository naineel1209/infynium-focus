// Background Service Worker for Chrome Extension
// This file runs as a service worker in the background

// Define message types for better type safety
// import type { MessageRequest, MessageResponse } from './types/background'; 
import type { BlockedSite } from './types/ubs-wrapper';
import {CHROME_STORAGE_KEY} from './utils/constants';

console.log('Background service worker initialized');

async function isSiteBlocked(url: string): Promise<boolean> {
  //A site is blocked if the URL's hostname is in the block list
  return new Promise((resolve) => {
    chrome.storage.local.get([CHROME_STORAGE_KEY], (result) => {
      const blockList: BlockedSite[] = result[CHROME_STORAGE_KEY] || [] as BlockedSite[];
      const hostname = new URL(url).hostname;
      const currentDay = new Date().getDay(); // Get the current day of the week (0-6, where 0 is Sunday)
      console.log('Checking if site is blocked:', hostname, 'Block list:', blockList);

      // Check if the hostname is in the block list
      // x.com [BlockedSite] -> x.com [Tab URL] -> true
      // x.com [BlockedSite] -> business.x.com [Tab URL] -> true
      // x.com [BlockedSite] -> business.facebook.com [Tab URL] -> false - as the hostname does not match
      // business.x.com [BlockedSite] -> x.com [Tab URL] -> false - as the hostname does not match
      // This will check if any of the blocked sites' hostnames match the current tab's hostname
      // Using URL constructor to ensure we are comparing hostnames correctly
      const isBlocked = blockList.some(
        (
          site: BlockedSite) => hostname.includes(new URL(site.url).hostname) 
            && 
          (site.blockedDays.length === 7 || site.blockedDays.includes(currentDay)) // Check if the current day is in the block list or the list has 7 elements (blocked every day)
      );
      resolve(isBlocked);
    })
  })
}

// Example: Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason, chrome.storage.local.getKeys());
  
  // You could initialize storage, set default values, etc.
  chrome.storage.local.set({ 
    [CHROME_STORAGE_KEY]: []
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // We will check for completed status event
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tabId, 'URL:', tab.url);
    
    // check if the URL is in the block list and take action
    if (await isSiteBlocked(tab.url)){
      console.log('Blocked site detected:', tab.url);

      // Redirect to a public page present in the extension
      await chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL('blocked/spa.html'),
        active: true
      })
      
      // Optionally, you could log this event or notify the user
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: 'Site Blocked',
        message: `The site ${tab.url} is blocked by your settings.`
      });
    }
  }
})

// Enhanced message handling from popup or content scripts
// chrome.runtime.onMessage.addListener((message: MessageRequest, sender, sendResponse: (response: MessageResponse) => void) => {
//   console.log('Received message:', message, 'from:', sender);
  
//   // Handle different message types
//   switch (message.action) {
//     case 'checkStatus':
//       // Handle status check
//       console.log('Status check requested');
//       sendResponse({ 
//         status: 'active', 
//         timestamp: Date.now(),
//         extensionId: chrome.runtime.id
//       });
//       return true; // Required for async response

//     case 'bypassSite':
//       // Logic to bypass the blocked site
//       console.log('Bypass requested for:', message.url);
      
//       // Here you would implement your bypass logic
//       // For example:
//       // - Check if site is in blocklist
//       // - Apply bypass method (proxy, cache, etc.)
//       // - Log the attempt
      
//       sendResponse({ 
//         success: true, 
//         message: 'Bypass attempt initiated',
//         url: message.url,
//         timestamp: message.timestamp
//       });
//       return true;

//     case 'customAction':
//       // Handle custom actions with detailed data
//       console.log('Custom action received:', {
//         url: message.currentUrl,
//         title: message.pageTitle,
//         userAgent: message.userAgent,
//         timestamp: message.timestamp
//       });
      
//       sendResponse({ 
//         success: true, 
//         message: 'Custom action processed',
//         receivedData: {
//           url: message.currentUrl,
//           title: message.pageTitle,
//           timestamp: message.timestamp
//         }
//       });
//       return true;

//     case 'pageUnloading':
//       // Handle page unload events
//       console.log('Page unloading:', {
//         url: message.url,
//         timeSpent: message.timeSpent
//       });
      
//       // You could log analytics, save state, etc.
//       sendResponse({ success: true, message: 'Unload event logged' });
//       return true;

//     default:
//       console.warn('Unknown action:', message.action);
//       sendResponse({ 
//         success: false, 
//         message: `Unknown action: ${message.action}` 
//       });
//       return true;
//   }
// });

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
