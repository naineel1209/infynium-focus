// Background Service Worker for Chrome Extension
// This file runs as a service worker in the background

// Import required types and constants
import type { BlockedSite } from './types/ubs-wrapper';
import type { PomodoroState, CompletedPomodoro } from './types/pomodoro-types';
import { CHROME_STORAGE_KEY } from './utils/constants';
import {
  POMODORO_STATE_STORAGE_KEY,
  COMPLETED_POMODOROS_STORAGE_KEY,
} from './types/pomodoro-types';

// Constants for notification types
const NOTIFICATION_TYPES = {
  FOCUS_START: 'focus_start',
  BREAK_START: 'break_start',
  ALL_COMPLETE: 'all_complete',
};

// Files to redirect to when a site is blocked
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

/**
 * Function to determine if the user is currently in focus mode
 */
async function isInFocusMode(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get([POMODORO_STATE_STORAGE_KEY], (result) => {
      const timerState: PomodoroState = result[POMODORO_STATE_STORAGE_KEY];

      // No timer state, not started, or not locked
      if (!timerState || !timerState.startedAt || !timerState.isLocked) {
        resolve(false);
        return;
      }

      // If paused, not in focus mode
      if (timerState.isPaused) {
        resolve(false);
        return;
      }

      // No active config, can't determine
      if (!timerState.activeConfig) {
        resolve(false);
        return;
      }

      // Use the cached phase if available
      if (timerState.currentPhase === 'focus') {
        resolve(true);
        return;
      } else if (timerState.currentPhase === 'break') {
        resolve(false);
        return;
      }

      // Calculate elapsed time and determine phase
      const elapsedMs =
        Date.now() - timerState.startedAt - (timerState.pausedDuration || 0);
      const elapsedSeconds = Math.floor(elapsedMs / 1000);

      const { focusTime, breakTime } = timerState.activeConfig;
      const cycleDuration = (focusTime + breakTime) * 60;

      // Check if in focus period (not in break period)
      const secondsIntoCurrentCycle = elapsedSeconds % cycleDuration;
      const inBreakTime = secondsIntoCurrentCycle >= focusTime * 60;

      resolve(!inBreakTime); // In focus mode if not in break time
    });
  });
}

/**
 * Function to check if a site is blocked based on settings and current phase
 */
async function isSiteBlocked(url: string): Promise<boolean> {
  // Get focus mode status for pomodoro blocks
  const inFocusMode = await isInFocusMode();

  // Check against both block lists
  return new Promise((resolve) => {
    chrome.storage.local.get(
      [CHROME_STORAGE_KEY, POMODORO_STATE_STORAGE_KEY],
      (result) => {
        // Get blocked sites from the UBS list (always blocked)
        const blockList: BlockedSite[] = result[CHROME_STORAGE_KEY] || [];

        // Get blocked sites from active pomodoro config (only blocked in focus mode)
        const timerState: PomodoroState = result[POMODORO_STATE_STORAGE_KEY];
        const pomodoroBlockedSites: string[] =
          timerState?.activeConfig?.blockedSites || [];

        // Parse the URL
        try {
          const hostname = new URL(url).hostname;
          const currentDay = new Date().getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

          // Check UBS block list - these are ALWAYS blocked regardless of pomodoro state
          const isBlockedInUBS = blockList.some((site: BlockedSite) => {
            try {
              const siteHostname = new URL(site.url).hostname;
              return (
                (hostname === siteHostname ||
                  hostname.endsWith(`.${siteHostname}`)) && // Check if the hostname matches or is a subdomain
                (site.blockedDays.length === 7 ||
                  site.blockedDays.includes(currentDay))
              );
            } catch {
              return false;
            }
          });

          // If already blocked by UBS, no need to check pomodoro
          if (isBlockedInUBS) {
            resolve(true);
            return;
          }

          // Check pomodoro block list - only blocked during focus mode
          const isBlockedInPomodoro =
            inFocusMode &&
            pomodoroBlockedSites.some((site: string) => {
              try {
                const siteHostname = new URL(site).hostname;
                return (
                  hostname === siteHostname ||
                  hostname.endsWith(`.${siteHostname}`)
                );
              } catch {
                return false;
              }
            });

          // Site is blocked if it's in the pomodoro list and we're in focus mode
          resolve(isBlockedInPomodoro);
        } catch {
          // Invalid URL
          resolve(false);
        }
      }
    );
  });
}

/**
 * Function to show a notification
 */
function showNotification(type: string, title: string, message: string) {
  const notificationId = `pomodoro_${type}_${Date.now()}`;

  // Create notification with highest priority and additional options
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: 'images/icon128.png',
    title: title,
    message: message,
    priority: 2, // Maximum priority in Chrome notifications
    requireInteraction: true, // Don't auto-dismiss
    silent: false, // Make sound if possible
    eventTime: Date.now(), // Set the event time to now
  });

  // Log notification for debugging
  console.log(`Showing notification: ${title} - ${message}`);

  // Set up a listener for when the notification is clicked
  chrome.notifications.onClicked.addListener((clickedId) => {
    if (clickedId === notificationId) {
      // Focus the extension popup when notification is clicked
      chrome.action.openPopup();
    }
  });
}

/**
 * Function to store a completed pomodoro session
 */
function storeCompletedPomodoro(state: PomodoroState) {
  if (!state.startedAt || !state.completedAt || !state.activeConfig) return;

  const completedSession: CompletedPomodoro = {
    id: `pomodoro_${Date.now()}`,
    startTime: state.startedAt,
    endTime: state.completedAt,
    focusTime: state.activeConfig.focusTime,
    breakTime: state.activeConfig.breakTime,
    numSessions: state.activeConfig.numSessions,
    totalDuration: state.completedAt - state.startedAt,
    totalPausedTime: state.pausedDuration || 0,
  };

  // Get existing sessions
  chrome.storage.local.get([COMPLETED_POMODOROS_STORAGE_KEY], (result) => {
    const existingSessions: CompletedPomodoro[] =
      result[COMPLETED_POMODOROS_STORAGE_KEY] || [];

    // Add new session
    const updatedSessions = [...existingSessions, completedSession];

    // Store updated list
    chrome.storage.local.set({
      [COMPLETED_POMODOROS_STORAGE_KEY]: updatedSessions,
    });
  });
}

/**
 * Function to calculate the current phase of a pomodoro session
 */
function calculateCurrentPhase(state: PomodoroState): 'focus' | 'break' | null {
  if (!state.startedAt || !state.activeConfig) return null;

  const elapsedMs = Date.now() - state.startedAt - (state.pausedDuration || 0);
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  const { focusTime, breakTime } = state.activeConfig;
  const cycleDuration = (focusTime + breakTime) * 60;

  const secondsIntoCurrentCycle = elapsedSeconds % cycleDuration;
  const inBreakTime = secondsIntoCurrentCycle >= focusTime * 60;

  return inBreakTime ? 'break' : 'focus';
}

/**
 * Sets up a listener for changes in Chrome's local storage.
 *
 * This function listens for changes to the `POMODORO_STATE_STORAGE_KEY` in Chrome's local storage.
 * When a change is detected, it logs the event and can trigger additional actions based on the updated state.
 *
 * Storage changes listened for:
 * - `POMODORO_STATE_STORAGE_KEY`: Detects changes to the current pomodoro state.
 *
 * Notifications or actions triggered:
 * - Logs a message when the pomodoro state changes.
 * - Ignores changes from non-local storage namespaces.
 *
 * Additionally, this function keeps the service worker alive by sending a ping every 25 seconds.
 */
function setupStorageListener() {
  console.log('Setting up storage change listener');

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') {
      console.log('Ignoring non-local storage changes');
      return;
    }

    // Check if pomodoro state changed
    if (changes[POMODORO_STATE_STORAGE_KEY]) {
      console.log('Pomodoro state changed detected');

      const newState: PomodoroState =
        changes[POMODORO_STATE_STORAGE_KEY].newValue;
      const oldState: PomodoroState =
        changes[POMODORO_STATE_STORAGE_KEY].oldValue;

      // If no previous state, this is first initialization
      if (!oldState) {
        console.log('No previous state, skipping notification');
        return;
      }

      // Check for completed sessions
      if (oldState.startedAt && newState.completedAt && !oldState.completedAt) {
        console.log('Session completion detected');
        showNotification(
          NOTIFICATION_TYPES.ALL_COMPLETE,
          'Pomodoro Complete!',
          'Great job! You have completed all your sessions.'
        );
        storeCompletedPomodoro(newState);
        return;
      }

      // Check for phase transitions
      if (oldState.startedAt && newState.startedAt) {
        const oldPhase =
          oldState.currentPhase || calculateCurrentPhase(oldState);
        const newPhase =
          newState.currentPhase || calculateCurrentPhase(newState);

        console.log(`Phase transition check: ${oldPhase} -> ${newPhase}`);

        if (oldPhase !== newPhase) {
          console.log(`Phase changed from ${oldPhase} to ${newPhase}`);

          if (newPhase === 'break') {
            showNotification(
              NOTIFICATION_TYPES.BREAK_START,
              'Break Time!',
              'Time for a short break. Relax and recharge.'
            );
          } else if (newPhase === 'focus') {
            showNotification(
              NOTIFICATION_TYPES.FOCUS_START,
              'Focus Time!',
              'Time to focus on your task.'
            );
          }
        }
      }
    }
  });

  // Schedule a periodic alarm to keep the service worker alive
  chrome.alarms.create('keepAlive', { periodInMinutes: 0.4167 }); // 25 seconds

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
      console.log('Service worker ping - keeping alive');
    }
  });
}

// Initialize the storage listener
setupStorageListener();

//Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);

  console.log('Notifications permission status:', Notification.permission);

  // Request notification permissions
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
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
