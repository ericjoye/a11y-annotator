// sidepanel.js — Side panel logic for a11y-annotator

(function() {
  'use strict';

  let currentIssues = [];
  let currentAnnotations = {};
  let currentFilter = 'all';
  let currentSearch = '';

  // DOM refs
  const pageTitle = document.getElementById('page-title');
  const summaryErrors = document.getElementById('summary-errors');
  const summaryWarnings = document.getElementById('summary-warnings');
  const summaryInfos = document.getElementById('summary-infos');
  const issuesContainer = document.getElementById('issues-container');
  const emptyState = document.getElementById('empty-state');
  const issueCount = document.getElementById('issue-count');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const btnScan = document.getElementById('btn-scan');
  const btnExport = document.getElementById('btn-export');
  const btnClear = document.getElementById('btn-clear');

  // Helper: send message to content script
  function sendToContent(tabId, message) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  // Helper: get active tab
  function getActiveTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]);
      });
    });
  }

  // Render issues grouped by severity
  function renderIssues() {
    issuesContainer.innerHTML = '';

    let filtered = currentIssues;
    if (currentFilter !== 'all') {
      filtered = filtered.filter(i => i.severity === currentFilter);
    }
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(i =>
        i.message.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        (i.element && i.element.tag && i.element.tag.toLowerCase().includes(q)) ||
        (i.wcag && i.wcag.sc && i.wcag.sc.toLowerCase().includes(q)) ||
        (i.wcag && i.wcag.name && i.wcag.name.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      if (currentIssues.length === 0) {
        issuesContainer.appendChild(emptyState);
        emptyState.style.display = 'block';
      } else {
        const noMatch = document.createElement('div');
        noMatch.className = 'empty-state';
        noMatch.innerHTML = '<div class="empty-icon">🔍</div><div class="empty-text">No issues match the current filter</div>';
        issuesContainer.appendChild(noMatch);
      }
      issueCount.textContent = '0 issues';
      return;
    }

    // Group by severity
    const groups = [
      { severity: 'error', label: '🔴 Errors', items: filtered.filter(i => i.severity === 'error') },
      { severity: 'warning', label: '🟡 Warnings', items: filtered.filter(i => i.severity === 'warning') },
      { severity: 'info', label: '🔵 Info', items: filtered.filter(i => i.severity === 'info') },
    ];

    groups.forEach(group => {
      if (group.items.length === 0) return;

      const groupEl = document.createElement('div');
      groupEl.className = 'issue-group';

      const header = document.createElement('div');
      header.className = `issue-group-header ${group.severity}`;
      header.innerHTML = `${group.label} <span class="issue-group-count">${group.items.length}</span>`;
      groupEl.appendChild(header);

      group.items.forEach((issue, idx) => {
        const card = createIssueCard(issue, group.severity);
        groupEl.appendChild(card);
      });

      issuesContainer.appendChild(groupEl);
    });

    issueCount.textContent = `${filtered.length} issue${filtered.length !== 1 ? 's' : ''}`;
  }

  function createIssueCard(issue, severity) {
    const card = document.createElement('div');
    card.className = 'issue-card';
    card.dataset.issueId = issue.id;

    const annotationText = currentAnnotations[issue.id] || issue.annotation || '';

    card.innerHTML = `
      <div class="issue-card-header">
        <div class="issue-number ${severity}">${getIssueIndex(issue)}</div>
        <div class="issue-content">
          <div class="issue-message">${escapeHtml(issue.message)}</div>
          <div class="issue-meta">
            <span class="issue-wcag">WCAG ${issue.wcag.sc} (${issue.wcag.level}) — ${escapeHtml(issue.wcag.name)}</span>
            <span>&lt;${escapeHtml(issue.element.tag)}&gt;</span>
          </div>
          ${issue.element.selector ? `<span class="issue-selector">${escapeHtml(issue.element.selector)}</span>` : ''}
        </div>
      </div>
      ${annotationText ? `
        <div class="issue-annotation">
          <div class="issue-annotation-label">📝 Note</div>
          ${escapeHtml(annotationText)}
        </div>
      ` : ''}
      <div class="annotation-input" id="annotation-${issue.id}">
        <textarea placeholder="Add a note about this issue...">${escapeHtml(annotationText)}</textarea>
        <div class="annotation-actions">
          <button class="btn-cancel-note" data-id="${issue.id}">Cancel</button>
          <button class="btn-save-note" data-id="${issue.id}">Save</button>
        </div>
      </div>
    `;

    // Click to toggle annotation input
    card.addEventListener('click', (e) => {
      if (e.target.closest('.annotation-input') || e.target.closest('.annotation-actions')) return;
      const input = card.querySelector('.annotation-input');
      input.classList.toggle('visible');
    });

    // Save note
    const saveBtn = card.querySelector('.btn-save-note');
    if (saveBtn) {
      saveBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const textarea = card.querySelector('textarea');
        const note = textarea.value.trim();
        const issueId = saveBtn.dataset.id;

        currentAnnotations[issueId] = note;
        const tab = await getActiveTab();
        if (tab) {
          try {
            await sendToContent(tab.id, { type: 'save-annotation', issueId, note });
          } catch (err) {
            console.warn('Could not save annotation to content script:', err);
          }
        }
        renderIssues();
      });
    }

    // Cancel note
    const cancelBtn = card.querySelector('.btn-cancel-note');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.querySelector('.annotation-input').classList.remove('visible');
      });
    }

    return card;
  }

  function getIssueIndex(issue) {
    return currentIssues.indexOf(issue) + 1;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function updateSummary() {
    const errors = currentIssues.filter(i => i.severity === 'error').length;
    const warnings = currentIssues.filter(i => i.severity === 'warning').length;
    const infos = currentIssues.filter(i => i.severity === 'info').length;
    summaryErrors.textContent = errors;
    summaryWarnings.textContent = warnings;
    summaryInfos.textContent = infos;
  }

  // Scan button
  btnScan.addEventListener('click', async () => {
    try {
      const tab = await getActiveTab();
      if (!tab) return;
      const response = await sendToContent(tab.id, { type: 'scan' });
      if (response && response.issues) {
        currentIssues = response.issues;
        updateSummary();
        renderIssues();
        pageTitle.textContent = tab.title || tab.url || 'Scanned page';
      }
    } catch (err) {
      console.error('Scan failed:', err);
    }
  });

  // Export button (Markdown — free tier)
  btnExport.addEventListener('click', async () => {
    try {
      const tab = await getActiveTab();
      if (!tab) return;
      const response = await sendToContent(tab.id, { type: 'export-markdown' });
      if (response && response.markdown) {
        try {
          await navigator.clipboard.writeText(response.markdown);
          btnExport.textContent = '✅ Copied!';
        } catch {
          const blob = new Blob([response.markdown], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `a11y-report-${Date.now()}.md`;
          a.click();
          URL.revokeObjectURL(url);
          btnExport.textContent = '✅ Downloaded!';
        }
        setTimeout(() => { btnExport.textContent = '📄 Export'; }, 2000);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  });

  // Clear button
  btnClear.addEventListener('click', async () => {
    try {
      const tab = await getActiveTab();
      if (!tab) return;
      await sendToContent(tab.id, { type: 'clear' });
      currentIssues = [];
      currentAnnotations = {};
      updateSummary();
      renderIssues();
      pageTitle.textContent = 'No page scanned yet';
    } catch (err) {
      console.error('Clear failed:', err);
    }
  });

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderIssues();
    });
  });

  // Search
  searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value;
    renderIssues();
  });

  // Summary bar click to filter
  document.querySelector('.summary-errors').addEventListener('click', () => {
    currentFilter = 'error';
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'error'));
    renderIssues();
  });
  document.querySelector('.summary-warnings').addEventListener('click', () => {
    currentFilter = 'warning';
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'warning'));
    renderIssues();
  });
  document.querySelector('.summary-infos').addEventListener('click', () => {
    currentFilter = 'info';
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'info'));
    renderIssues();
  });

  // Listen for scan-complete messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'scan-complete') {
      currentIssues = message.issues || [];
      pageTitle.textContent = message.title || message.url || 'Scanned page';
      updateSummary();
      renderIssues();
    }
    return false;
  });

  // Try to load existing issues on panel open
  (async () => {
    try {
      const tab = await getActiveTab();
      if (!tab) return;
      const response = await sendToContent(tab.id, { type: 'get-issues' });
      if (response && response.issues && response.issues.length > 0) {
        currentIssues = response.issues;
        currentAnnotations = response.annotations || {};
        updateSummary();
        renderIssues();
        pageTitle.textContent = tab.title || tab.url || 'Scanned page';
      }
    } catch (err) {
      // Content script not loaded yet — that's fine
    }
  })();
})();
