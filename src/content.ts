/** @file content.ts
 * @description Content script for the Chrome extension.
 * @author Naineel Soyantar
 */

// Define message types for better type safety
interface MessageData {
  [key: string]: unknown;
}

interface MessageResponse {
  status?: string;
  success?: boolean;
  [key: string]: unknown;
}

interface MessageRequest {
  action: string;
  [key: string]: unknown;
}

const body = chrome.dom.openOrClosedShadowRoot(document.body) || document.body;

const shadow = body.querySelector('div#shadow-root');

console.log('Hello from content script!');

if (shadow) {
  const shadowRoot = shadow.shadowRoot;
  if (shadowRoot) {
    const div = document.createElement('div');
    div.textContent = 'Hello from content script!';
    shadowRoot.appendChild(div);
  }
}

// Function to send messages to background script
function sendMessageToBackground(
  action: string,
  data?: MessageData
): Promise<MessageResponse> {
  return new Promise((resolve, reject) => {
    const message: MessageRequest = { action, ...data };
    chrome.runtime.sendMessage(message, (response: MessageResponse) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Example 1: Send checkStatus message
async function checkBackgroundStatus(): Promise<MessageResponse | undefined> {
  try {
    const response = await sendMessageToBackground('checkStatus');
    console.log('Background status:', response.status);
    return response;
  } catch (error) {
    console.error('Error checking status:', error);
    return undefined;
  }
}

// Example 2: Send bypassSite message
async function requestSiteBypass(
  siteUrl?: string
): Promise<MessageResponse | undefined> {
  try {
    const response = await sendMessageToBackground('bypassSite', {
      url: siteUrl || window.location.href,
      timestamp: Date.now(),
    });
    console.log('Bypass response:', response);
    return response;
  } catch (error) {
    console.error('Error requesting bypass:', error);
    return undefined;
  }
}

// Example 3: Send custom message with more data
async function sendCustomMessage(): Promise<MessageResponse | undefined> {
  try {
    const response = await sendMessageToBackground('customAction', {
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      pageTitle: document.title,
    });
    console.log('Custom message response:', response);
    return response;
  } catch (error) {
    console.error('Error sending custom message:', error);
    return undefined;
  }
}

// Example of sending message when user tries to access blocked content
function handleBlockedContentAccess(): void {
  console.log('Blocked content access detected, requesting bypass...');
  void requestSiteBypass();
}

// Automatically check status when content script loads
void checkBackgroundStatus();

// You can also send messages based on user interactions or page events
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, sending status check...');
  void checkBackgroundStatus();
});

// Listen for specific events and send messages accordingly
window.addEventListener('beforeunload', () => {
  // Send message before page unloads
  void sendMessageToBackground('pageUnloading', {
    url: window.location.href,
    timeSpent: Date.now() - performance.timeOrigin,
  });
});

// Export functions that might be used by other parts of the extension
declare global {
  interface Window {
    extensionAPI: {
      checkStatus: typeof checkBackgroundStatus;
      requestBypass: typeof requestSiteBypass;
      sendCustomMessage: typeof sendCustomMessage;
      handleBlockedAccess: typeof handleBlockedContentAccess;
    };
  }
}

// Make functions available globally for debugging or external use
window.extensionAPI = {
  checkStatus: checkBackgroundStatus,
  requestBypass: requestSiteBypass,
  sendCustomMessage: sendCustomMessage,
  handleBlockedAccess: handleBlockedContentAccess,
};
