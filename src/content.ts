/** @file content.ts 
 * @description Content script for the Chrome extension.
 * @author Naineel Soyantar
*/

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