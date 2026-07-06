// background.js — Service worker for a11y-annotator

// Listen for messages from content scripts / popup / sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Open side panel
  if (message.type === 'open_sidepanel') {
    if (sender.tab && sender.tab.windowId) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
    sendResponse({ ok: true });
    return false;
  }

  // Get tab info
  if (message.type === 'get_tab_info' && sender.tab) {
    chrome.tabs.get(sender.tab.id, (tab) => {
      sendResponse({ url: tab.url, title: tab.title });
    });
    return true; // async response
  }

  // Forward scan-complete to side panel
  if (message.type === 'scan-complete' && sender.tab) {
    // The side panel listens for runtime messages directly — no forwarding needed
    sendResponse({ ok: true });
    return false;
  }

  // Pro unlock via explicit activation from the extension only.
  // NO auto-unlock by inspecting browser URLs — that path is removed.
  if (message.type === 'unlock-pro') {
    chrome.storage.local.set({ pro: true }, () => {
      sendResponse({ ok: true });
    });
    return true; // async response
  }

  // License key activation — delegates verification to license.js in popup. Use cached result.
  if (message.type === 'activate-license') {
    chrome.storage.local.set({ pro: true, licenseKey: message.key }, () => {
      sendResponse({ ok: true });
    });
    return true; // async
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
