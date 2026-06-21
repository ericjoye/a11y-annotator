// background.js — Service worker for a11y-annotator

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Toggle overlay
        if (window.__a11y_annotator_active) {
          window.__a11y_annotator_active = false;
          document.querySelectorAll('.a11y-pin, .a11y-overlay').forEach(el => el.remove());
        } else {
          // Trigger scan via content script
          window.dispatchEvent(new CustomEvent('a11y-scan-request'));
        }
      }
    });
  } catch (err) {
    console.error('a11y-annotator: Failed to toggle', err);
  }
});

// Listen for messages from content scripts / popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'open_sidepanel') {
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
    sendResponse({ ok: true });
  }
  if (message.type === 'get_tab_info') {
    chrome.tabs.get(sender.tab.id, (tab) => {
      sendResponse({ url: tab.url, title: tab.title });
    });
    return true; // async response
  }
  return false;
});

// Keyboard shortcut handler
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-overlay') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'toggle-overlay' });
    }
  }
});
