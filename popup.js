// popup.js — Popup logic for a11y-annotator

(function() {
  'use strict';

  const btnScan = document.getElementById('btn-scan');
  const btnExport = document.getElementById('btn-export');
  const btnScreenshot = document.getElementById('btn-screenshot');
  const btnSidepanel = document.getElementById('btn-sidepanel');
  const statusDiv = document.getElementById('status');
  const errorCount = document.getElementById('error-count');
  const warningCount = document.getElementById('warning-count');
  const infoCount = document.getElementById('info-count');
  const toast = document.getElementById('toast');

  // Pro UI elements
  const licenseInput = document.getElementById('license-key-input');
  const activateBtn = document.getElementById('activate-btn');
  const proStatus = document.getElementById('pro-status');
  const proStatusIcon = document.getElementById('pro-status-icon');
  const proStatusText = document.getElementById('pro-status-text');
  const proLinks = document.getElementById('pro-links');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnExportJson = document.getElementById('btn-export-json');
  const btnBatchScan = document.getElementById('btn-batch-scan');

  let isScanned = false;
  let isPro = false;

  // --- Pro Upgrade ---
  const CHECKOUT_URL = 'https://buy.stripe.com/7sY4gAcPm9J7fOe8qcbAs0e';

  async function checkProStatus() {
    // isProUnlocked re-verifies the stored key's signature and self-heals
    // a pro flag that has no valid key behind it.
    const pro = await window.A11YLicense.isProUnlocked();
    const stored = await new Promise((resolve) => {
      chrome.storage.local.get(['licenseKey'], resolve);
    });
    return { pro, key: stored.licenseKey || null };
  }

  async function updateProUI() {
    const { pro, key } = await checkProStatus();
    isPro = pro;
    const badge = document.getElementById('pro-badge');
    if (pro) {
      if (badge) badge.classList.remove('hidden');
      proStatus.className = 'pro-status unlocked';
      proStatusIcon.textContent = '🔓';
      proStatusText.textContent = `Pro active${key ? ' (' + key.slice(0, 10) + '...)' : ''}`;
      proLinks.classList.add('visible');
      if (licenseInput) licenseInput.value = key || '';
      if (activateBtn) activateBtn.textContent = 'Active';
      if (activateBtn) activateBtn.disabled = true;
      // Enable Pro feature buttons
      [btnExportCsv, btnExportJson, btnBatchScan].forEach(btn => {
        if (btn) btn.classList.remove('locked');
      });
    } else {
      if (badge) badge.classList.add('hidden');
      proStatus.className = 'pro-status locked';
      proStatusIcon.textContent = '�';
      proStatusText.textContent = 'Free tier — scan, pin, annotate, Markdown export';
      proLinks.classList.remove('visible');
      if (activateBtn) activateBtn.textContent = 'Unlock';
      if (activateBtn) activateBtn.disabled = false;
      [btnExportCsv, btnExportJson, btnBatchScan].forEach(btn => {
        if (btn) btn.classList.add('locked');
      });
    }
  }

  // Activate license key
  activateBtn.addEventListener('click', async () => {
    const key = licenseInput.value.trim();
    if (!key) {
      showToast('Please enter your license key');
      return;
    }
    activateBtn.disabled = true;
    const result = await window.A11YLicense.activateLicense(key);
    activateBtn.disabled = false;
    if (result.ok) {
      showToast('Pro unlocked successfully!');
      updateProUI();
    } else {
      showToast(result.reason || 'Invalid license key');
    }
  });

  // Pro: Export CSV
  btnExportCsv.addEventListener('click', async () => {
    if (isPro) {
      try {
        const response = await sendToContent({ type: 'export-csv' });
        if (response && response.csv) {
          downloadFile(response.csv, `a11y-report-${Date.now()}.csv`, 'text/csv');
          showToast('CSV exported!');
        } else if (response && response.error) {
          showToast('Export failed: ' + response.error);
        }
      } catch (err) {
        showToast('Export failed');
      }
    } else {
      showToast('Upgrade to Pro for CSV export');
    }
  });

  // Pro: Export JSON
  btnExportJson.addEventListener('click', async () => {
    if (isPro) {
      try {
        const response = await sendToContent({ type: 'export-json' });
        if (response && response.json) {
          downloadFile(response.json, `a11y-report-${Date.now()}.json`, 'application/json');
          showToast('JSON exported!');
        } else if (response && response.error) {
          showToast('Export failed: ' + response.error);
        }
      } catch (err) {
        showToast('Export failed');
      }
    } else {
      showToast('Upgrade to Pro for JSON export');
    }
  });

  // Pro: Batch Scan
  btnBatchScan.addEventListener('click', async () => {
    if (isPro) {
      try {
        showToast('Running batch scan (same-origin)...');
        const response = await sendToContent({ type: 'batch-scan', limit: 5 });
        if (response && response.pages) {
          let allIssues = [];
          response.pages.forEach(p => { allIssues = allIssues.concat(p.issues || []); });
          // Merge results
          const errCount = allIssues.filter(i => i.severity === 'error').length;
          const warnCount = allIssues.filter(i => i.severity === 'warning').length;
          const infoCountVal = allIssues.filter(i => i.severity === 'info').length;
          errorCount.textContent = errCount;
          warningCount.textContent = warnCount;
          infoCount.textContent = infoCountVal;
          statusDiv.classList.add('visible');
          btnScan.innerHTML = '<span class="btn-icon">�</span> Scan Page';
          showToast(`Batch done: ${response.totalVisited} pages, ${allIssues.length} issues found`);
        }
      } catch (err) {
        showToast('Batch scan failed');
      }
    } else {
      showToast('Upgrade to Pro for batch scanning');
    }
  });

  // --- Toast helper ---
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
  }

  // --- Download helper ---
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Helper: send message to content script in active tab
  function sendToContent(message) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) {
          reject(new Error('No active tab'));
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    });
  }

  // Helper: execute script in active tab (for when content script isn't loaded)
  function executeInTab(func, args) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) {
          reject(new Error('No active tab'));
          return;
        }
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: func,
          args: args || [],
        }, (results) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(results);
          }
        });
      });
    });
  }

  // Scan button
  btnScan.addEventListener('click', async () => {
    try {
      if (isScanned) {
        // Toggle off
        await sendToContent({ type: 'toggle-overlay' });
        btnScan.innerHTML = '<span class="btn-icon">🔍</span> Scan Page';
        btnScan.classList.remove('stop');
        isScanned = false;
        statusDiv.classList.remove('visible');
      } else {
        // Run scan
        btnScan.innerHTML = '<span class="btn-icon">⏳</span> Scanning...';
        const response = await sendToContent({ type: 'scan' });
        if (response && response.issues) {
          const issues = response.issues;
          const errors = issues.filter(i => i.severity === 'error').length;
          const warnings = issues.filter(i => i.severity === 'warning').length;
          const infos = issues.filter(i => i.severity === 'info').length;

          errorCount.textContent = errors;
          warningCount.textContent = warnings;
          infoCount.textContent = infos;
          statusDiv.classList.add('visible');

          btnScan.innerHTML = '<span class="btn-icon">�</span> Clear Overlay';
          btnScan.classList.add('stop');
          isScanned = true;
        }
      }
    } catch (err) {
      btnScan.innerHTML = '<span class="btn-icon">🔍</span> Scan Page';
      // If content script not loaded, inject it first
      if (err.message && err.message.includes('Could not establish connection')) {
        try {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['license.js', 'content.js'],
          });
          await chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            files: ['content.css'],
          });
          // Retry scan
          const response = await sendToContent({ type: 'scan' });
          if (response && response.issues) {
            const issues = response.issues;
            errorCount.textContent = issues.filter(i => i.severity === 'error').length;
            warningCount.textContent = issues.filter(i => i.severity === 'warning').length;
            infoCount.textContent = issues.filter(i => i.severity === 'info').length;
            statusDiv.classList.add('visible');
            btnScan.innerHTML = '<span class="btn-icon">�</span> Clear Overlay';
            btnScan.classList.add('stop');
            isScanned = true;
          }
        } catch (injectErr) {
          console.error('Failed to inject content script:', injectErr);
        }
      }
    }
  });

  // Export Markdown button (free)
  btnExport.addEventListener('click', async () => {
    try {
      const response = await sendToContent({ type: 'export-markdown' });
      if (response && response.markdown) {
        try {
          await navigator.clipboard.writeText(response.markdown);
          btnExport.innerHTML = '<span class="btn-icon">✅</span> Copied to Clipboard!';
        } catch {
          downloadFile(response.markdown, `a11y-report-${Date.now()}.md`, 'text/markdown');
          btnExport.innerHTML = '<span class="btn-icon">✅</span> Downloaded!';
        }
        setTimeout(() => {
          btnExport.innerHTML = '<span class="btn-icon">📄</span> Export Markdown Report';
        }, 2000);
      }
    } catch (err) {
      console.error('Export failed:', err);
      btnExport.innerHTML = '<span class="btn-icon">❌</span> Export Failed';
      setTimeout(() => {
        btnExport.innerHTML = '<span class="btn-icon">�</span> Export Markdown Report';
      }, 2000);
    }
  });

  // Screenshot button
  btnScreenshot.addEventListener('click', async () => {
    try {
      btnScreenshot.innerHTML = '<span class="btn-icon">⏳</span> Capturing...';

      // Use Chrome's captureVisibleTab API
      const dataUrl = await chrome.tabs.captureVisibleTab(null, {
        format: 'png',
        quality: 100,
      });

      // Download the screenshot
      const filename = `a11y-screenshot-${Date.now()}.png`;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.click();

      btnScreenshot.innerHTML = '<span class="btn-icon">✅</span> Screenshot Saved!';
      setTimeout(() => {
        btnScreenshot.innerHTML = '<span class="btn-icon">📸</span> Capture Screenshot';
      }, 2000);
    } catch (err) {
      console.error('Screenshot failed:', err);
      btnScreenshot.innerHTML = '<span class="btn-icon">❌</span> Screenshot Failed';
      setTimeout(() => {
        btnScreenshot.innerHTML = '<span class="btn-icon">📸</span> Capture Screenshot';
      }, 2000);
    }
  });

  // Side panel button
  btnSidepanel.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.sidePanel.open({ windowId: tab.windowId });
      }
    } catch (err) {
      console.error('Failed to open side panel:', err);
    }
  });

  // Check if overlay is already active on this page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'get-issues' }, (response) => {
        if (chrome.runtime.lastError) return;
        if (response && response.issues && response.issues.length > 0) {
          const issues = response.issues;
          errorCount.textContent = issues.filter(i => i.severity === 'error').length;
          warningCount.textContent = issues.filter(i => i.severity === 'warning').length;
          infoCount.textContent = issues.filter(i => i.severity === 'info').length;
          statusDiv.classList.add('visible');
          btnScan.innerHTML = '<span class="btn-icon">✕</span> Clear Overlay';
          btnScan.classList.add('stop');
          isScanned = true;
        }
        // Also check pro status
        if (response && typeof response.pro !== 'undefined') {
          // sync not needed, checkProStatus already handles it
        }
      });
    }
  });

  // Show/hide Pro UI based on current status
  updateProUI();

  // Listen for storage changes (in case Pro is unlocked via Stripe receipt)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.pro) {
      updateProUI();
    }
  });
})();
