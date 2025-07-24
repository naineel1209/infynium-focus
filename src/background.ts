// Background Service Worker for Chrome Extension
// This file runs as a service worker in the background

// Define message types for better type safety
// import type { MessageRequest, MessageResponse } from './types/background';
import type { BlockedSite } from './types/ubs-wrapper';
import { CHROME_STORAGE_KEY } from './utils/constants';

const blocked_sites_redirect_files = [
  'blocked/escape.html',
  'blocked/intervention.html',
  'blocked/persistence.html',
  'blocked/spa.html',
  'blocked/timetravel.html',
];

console.log(
  "Background service worker initialized. Oh hey there! Didn't see you come in. Welcome to the backend, where the magic happens!"
);

async function isSiteBlocked(url: string): Promise<boolean> {
  //A site is blocked if the URL's hostname is in the block list
  return new Promise((resolve) => {
    chrome.storage.local.get([CHROME_STORAGE_KEY], (result) => {
      const blockList: BlockedSite[] =
        result[CHROME_STORAGE_KEY] || ([] as BlockedSite[]);
      const hostname = new URL(url).hostname;
      const currentDay = new Date().getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

      // Check if the hostname is in the block list
      // x.com [BlockedSite] -> x.com [Tab URL] -> true
      // x.com [BlockedSite] -> business.x.com [Tab URL] -> true
      // x.com [BlockedSite] -> business.facebook.com [Tab URL] -> false - as the hostname does not match
      // business.x.com [BlockedSite] -> x.com [Tab URL] -> false - as the hostname does not match
      // This will check if any of the blocked sites' hostnames match the current tab's hostname
      // Using URL constructor to ensure we are comparing hostnames correctly
      const isBlocked = blockList.some((site: BlockedSite) => {
        const siteHostname = new URL(site.url).hostname;

        return (
          (hostname === siteHostname ||
            hostname.endsWith(`.${siteHostname}`)) && // Check if the hostname matches or is a subdomain
          // e.g., x.com matches x.com and business.x.com, but not business.facebook.com
          (site.blockedDays.length === 7 ||
            site.blockedDays.includes(currentDay))
        ); // Check if the current day is in the block list or the list has 7 elements (blocked every day)
      });
      resolve(isBlocked);
    });
  });
}

//Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

//Listen for update events on tabs
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // We will check for completed status event
  if (changeInfo.status === 'complete' && tab.url) {
    // check if the URL is in the block list and take action
    if (await isSiteBlocked(tab.url)) {
      console.log('Blocked site detected:', tab.url);

      try {
        // Redirect to a public page present in the extension
        await chrome.tabs.update(tabId, {
          url: chrome.runtime.getURL(
            blocked_sites_redirect_files[
              Math.floor(Math.random() * blocked_sites_redirect_files.length)
            ]
          ),
          active: true,
        });
      } catch (error) {
        console.error('Error redirecting tab:', error);
      }
    }
  }
});
