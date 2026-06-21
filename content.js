// content.js — Accessibility scanner and annotation engine for a11y-annotator

(function() {
  'use strict';

  // State
  let issues = [];
  let annotations = {};
  let overlayActive = false;
  let scanId = 0;

  // WCAG reference map
  const WCAG_REFS = {
    'missing-alt': { sc: '1.1.1', level: 'A', name: 'Non-text Content' },
    'low-contrast': { sc: '1.4.3', level: 'AA', name: 'Contrast (Minimum)' },
    'missing-label': { sc: '1.3.1', level: 'A', name: 'Info and Relationships' },
    'empty-link': { sc: '2.4.4', level: 'A', name: 'Link Purpose (In Context)' },
    'heading-hierarchy': { sc: '1.3.1', level: 'A', name: 'Info and Relationships' },
    'missing-lang': { sc: '3.1.1', level: 'A', name: 'Language of Page' },
    'missing-title': { sc: '2.4.2', level: 'A', name: 'Page Titled' },
    'small-touch-target': { sc: '2.5.8', level: 'AA', name: 'Target Size' },
    'missing-form-role': { sc: '4.1.2', level: 'A', name: 'Name, Role, Value' },
    'duplicate-id': { sc: '4.1.1', level: 'A', name: 'Parsing' },
    'autoplay-media': { sc: '1.4.2', level: 'A', name: 'Audio Control' },
    'missing-skip-link': { sc: '2.4.1', level: 'A', name: 'Bypass Blocks' },
    'table-missing-headers': { sc: '1.3.1', level: 'A', name: 'Info and Relationships' },
    'iframe-missing-title': { sc: '4.1.2', level: 'A', name: 'Name, Role, Value' },
    'image-button-missing-alt': { sc: '1.1.1', level: 'A', name: 'Non-text Content' },
    'input-missing-placeholder': { sc: '3.3.2', level: 'A', name: 'Labels or Instructions' },
    'empty-heading': { sc: '1.3.1', level: 'A', name: 'Info and Relationships' },
    'link-opens-new-window': { sc: '3.2.5', level: 'AAA', name: 'Change on Request' },
    'missing-focus-indicator': { sc: '2.4.7', level: 'AA', name: 'Focus Visible' },
    'video-missing-captions': { sc: '1.2.2', level: 'A', name: 'Captions (Prerecorded)' },
  };

  // ─── Scanner ───────────────────────────────────────────────

  function runScan() {
    issues = [];
    scanId = Date.now();

    checkMissingAlt();
    checkLowContrast();
    checkMissingLabels();
    checkEmptyLinks();
    checkHeadingHierarchy();
    checkMissingLang();
    checkMissingTitle();
    checkSmallTouchTargets();
    checkDuplicateIds();
    checkMissingSkipLink();
    checkTableHeaders();
    checkIframeTitles();
    checkImageButtons();
    checkEmptyHeadings();
    checkVideoCaptions();
    checkMissingFocusIndicators();

    // Sort by severity
    const severityOrder = { error: 0, warning: 1, info: 2 };
    issues.sort((a, b) => (severityOrder[a.severity] || 1) - (severityOrder[b.severity] || 1));

    return issues;
  }

  function addIssue(type, severity, element, message, wcagKey) {
    const rect = element.getBoundingClientRect();
    const wcag = WCAG_REFS[wcagKey] || { sc: '—', level: '—', name: '—' };
    issues.push({
      id: `${type}-${issues.length}`,
      type,
      severity,
      message,
      element: {
        tag: element.tagName.toLowerCase(),
        id: element.id || '',
        className: element.className || '',
        selector: getSelector(element),
        text: (element.textContent || '').trim().substring(0, 100),
      },
      position: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      },
      wcag,
      annotation: annotations[`${type}-${issues.length}`] || '',
    });
  }

  function getSelector(el) {
    if (el.id) return `#${el.id}`;
    const parts = [];
    let current = el;
    while (current && current !== document.body) {
      let sel = current.tagName.toLowerCase();
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).slice(0, 2);
        sel += classes.map(c => `.${c}`).join('');
      }
      parts.unshift(sel);
      current = current.parentElement;
      if (parts.length >= 3) break;
    }
    return parts.join(' > ');
  }

  // ─── Individual Checks ─────────────────────────────────────

  function checkMissingAlt() {
    document.querySelectorAll('img:not([alt])').forEach(el => {
      // Skip decorative / tracking images
      if (el.width <= 1 && el.height <= 1) return;
      if (el.getAttribute('role') === 'presentation') return;
      addIssue('missing-alt', 'error', el, 'Image missing alt text', 'missing-alt');
    });
  }

  function checkLowContrast() {
    document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li, td, th, label, input, select, textarea').forEach(el => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = style.fontWeight;

      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && color) {
        const ratio = getContrastRatio(color, bgColor);
        const isLarge = fontSize >= 18 || (fontSize >= 14.5 && (parseInt(fontWeight) >= 700 || fontWeight === 'bold'));
        const threshold = isLarge ? 3.0 : 4.5;

        if (ratio < threshold) {
          addIssue('low-contrast', 'warning', el,
            `Low contrast ratio: ${ratio.toFixed(1)}:1 (needs ${threshold}:1)`,
            'low-contrast');
        }
      }
    });
  }

  function getContrastRatio(fg, bg) {
    const lum1 = relativeLuminance(parseColor(fg));
    const lum2 = relativeLuminance(parseColor(bg));
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function parseColor(colorStr) {
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return [0, 0, 0];
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }

  function relativeLuminance(rgb) {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function checkMissingLabels() {
    document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), select, textarea').forEach(el => {
      const id = el.id;
      const ariaLabel = el.getAttribute('aria-label');
      const ariaLabelledBy = el.getAttribute('aria-labelledby');
      const placeholder = el.getAttribute('placeholder');
      const title = el.getAttribute('title');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const wrappedInLabel = el.closest('label');

      if (!hasLabel && !wrappedInLabel && !ariaLabel && !ariaLabelledBy && !placeholder && !title) {
        addIssue('missing-label', 'error', el, 'Form field missing label', 'missing-label');
      }
    });
  }

  function checkEmptyLinks() {
    document.querySelectorAll('a').forEach(el => {
      const text = el.textContent.trim();
      const ariaLabel = el.getAttribute('aria-label');
      const imgAlt = el.querySelector('img[alt]')?.getAttribute('alt');
      if (!text && !ariaLabel && !imgAlt) {
        addIssue('empty-link', 'error', el, 'Link has no accessible text', 'empty-link');
      }
    });
  }

  function checkHeadingHierarchy() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach(el => {
      const level = parseInt(el.tagName[1]);
      if (lastLevel === 0 && level > 1) {
        addIssue('heading-hierarchy', 'warning', el,
          `Page starts with <h${level}> instead of <h1>`, 'heading-hierarchy');
      } else if (lastLevel > 0 && level > lastLevel + 1) {
        addIssue('heading-hierarchy', 'warning', el,
          `Skipped heading level: <h${lastLevel}> → <h${level}>`, 'heading-hierarchy');
      }
      lastLevel = level;
    });
  }

  function checkMissingLang() {
    const html = document.documentElement;
    if (!html.getAttribute('lang')) {
      addIssue('missing-lang', 'error', html, 'Page missing lang attribute', 'missing-lang');
    }
  }

  function checkMissingTitle() {
    if (!document.title || !document.title.trim()) {
      addIssue('missing-title', 'error', document.documentElement, 'Page missing <title>', 'missing-title');
    }
  }

  function checkSmallTouchTargets() {
    document.querySelectorAll('a, button, input, select, [role="button"], [tabindex]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.width < 24 && rect.height < 24) {
        addIssue('small-touch-target', 'warning', el,
          `Small touch target: ${Math.round(rect.width)}×${Math.round(rect.height)}px (min 24×24)`,
          'small-touch-target');
      }
    });
  }

  function checkDuplicateIds() {
    const idMap = {};
    document.querySelectorAll('[id]').forEach(el => {
      const id = el.id;
      if (idMap[id]) {
        addIssue('duplicate-id', 'error', el, `Duplicate ID: "${id}"`, 'duplicate-id');
      } else {
        idMap[id] = true;
      }
    });
  }

  function checkMissingSkipLink() {
    const firstLink = document.querySelector('a[href]');
    const hasSkipLink = firstLink && /skip|jump|main|content/i.test(firstLink.textContent + firstLink.href);
    if (!hasSkipLink && document.querySelectorAll('a, button, input').length > 10) {
      addIssue('missing-skip-link', 'info', document.body,
        'No skip navigation link found', 'missing-skip-link');
    }
  }

  function checkTableHeaders() {
    document.querySelectorAll('table').forEach(table => {
      const hasTh = table.querySelector('th');
      if (!hasTh && table.querySelectorAll('td').length > 4) {
        addIssue('table-missing-headers', 'warning', table,
          'Data table missing <th> headers', 'table-missing-headers');
      }
    });
  }

  function checkIframeTitles() {
    document.querySelectorAll('iframe:not([title])').forEach(el => {
      addIssue('iframe-missing-title', 'warning', el, 'iframe missing title attribute', 'iframe-missing-title');
    });
  }

  function checkImageButtons() {
    document.querySelectorAll('input[type="image"]:not([alt])').forEach(el => {
      addIssue('image-button-missing-alt', 'error', el, 'Image button missing alt text', 'image-button-missing-alt');
    });
  }

  function checkEmptyHeadings() {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
      if (!el.textContent.trim()) {
        addIssue('empty-heading', 'warning', el, 'Empty heading element', 'empty-heading');
      }
    });
  }

  function checkVideoCaptions() {
    document.querySelectorAll('video').forEach(el => {
      if (!el.querySelector('track[kind="captions"]') && !el.querySelector('track[kind="subtitles"]')) {
        addIssue('video-missing-captions', 'warning', el, 'Video missing captions track', 'video-missing-captions');
      }
    });
  }

  function checkMissingFocusIndicators() {
    // Check if CSS removes focus outlines globally
    const styles = document.querySelectorAll('style');
    let removesFocus = false;
    styles.forEach(style => {
      if (style.textContent.includes('outline: none') || style.textContent.includes('outline:none')) {
        removesFocus = true;
      }
    });
    if (removesFocus) {
      addIssue('missing-focus-indicator', 'info', document.body,
        'CSS may remove focus indicators', 'missing-focus-indicator');
    }
  }

  // ─── Overlay Rendering ─────────────────────────────────────

  function renderOverlay() {
    clearOverlay();
    if (!issues.length) {
      showToast('✅ No accessibility issues found!');
      return;
    }

    overlayActive = true;
    window.__a11y_annotator_active = true;

    issues.forEach((issue, index) => {
      const pin = document.createElement('div');
      pin.className = `a11y-pin a11y-pin-${issue.severity}`;
      pin.textContent = index + 1;
      pin.title = `${issue.severity.toUpperCase()}: ${issue.message}`;
      pin.dataset.issueId = issue.id;
      pin.dataset.index = index;

      // Position pin
      const pos = issue.position;
      pin.style.left = `${pos.x + window.scrollX}px`;
      pin.style.top = `${pos.y + window.scrollY - 32}px`;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        showAnnotationPopup(issue, pin);
      });

      document.body.appendChild(pin);
    });

    showToast(`🔍 Found ${issues.length} issue(s): ${issues.filter(i => i.severity === 'error').length} errors, ${issues.filter(i => i.severity === 'warning').length} warnings, ${issues.filter(i => i.severity === 'info').length} info`);

    // Send to side panel
    chrome.runtime.sendMessage({
      type: 'scan-complete',
      issues: issues,
      url: window.location.href,
      title: document.title,
    });
  }

  function clearOverlay() {
    document.querySelectorAll('.a11y-pin, .a11y-annotation-popup, .a11y-summary-toast').forEach(el => el.remove());
    overlayActive = false;
    window.__a11y_annotator_active = false;
  }

  function showAnnotationPopup(issue, pin) {
    // Close existing popups
    document.querySelectorAll('.a11y-annotation-popup').forEach(el => el.remove());

    const popup = document.createElement('div');
    popup.className = 'a11y-annotation-popup';
    popup.innerHTML = `
      <div class="severity ${issue.severity}">${issue.severity}</div>
      <h4>${issue.message}</h4>
      <p><strong>WCAG:</strong> ${issue.wcag.sc} (${issue.wcag.level}) — ${issue.wcag.name}</p>
      <p><strong>Element:</strong> <code>&lt;${issue.element.tag}&gt;</code></p>
      ${issue.element.selector ? `<p><strong>Selector:</strong> <code>${issue.element.selector}</code></p>` : ''}
      <textarea placeholder="Add a note about this issue...">${annotations[issue.id] || ''}</textarea>
      <div class="actions">
        <button class="btn-delete">Delete</button>
        <button class="btn-close">Close</button>
        <button class="btn-save">Save Note</button>
      </div>
    `;

    // Position near pin
    const pinRect = pin.getBoundingClientRect();
    popup.style.left = `${pinRect.left + window.scrollX}px`;
    popup.style.top = `${pinRect.bottom + window.scrollY + 4}px`;

    // Save note
    popup.querySelector('.btn-save').addEventListener('click', () => {
      const note = popup.querySelector('textarea').value;
      if (note) {
        annotations[issue.id] = note;
        issue.annotation = note;
      } else {
        delete annotations[issue.id];
        issue.annotation = '';
      }
      popup.remove();
    });

    // Close
    popup.querySelector('.btn-close').addEventListener('click', () => {
      popup.remove();
    });

    // Delete annotation
    popup.querySelector('.btn-delete').addEventListener('click', () => {
      delete annotations[issue.id];
      issue.annotation = '';
      popup.remove();
    });

    document.body.appendChild(popup);
  }

  function showToast(message) {
    const existing = document.querySelector('.a11y-summary-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'a11y-summary-toast visible';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ─── Export ────────────────────────────────────────────────

  function exportMarkdown() {
    const now = new Date().toISOString();
    let md = `# Accessibility Report\n\n`;
    md += `**URL:** ${window.location.href}\n`;
    md += `**Title:** ${document.title}\n`;
    md += `**Scanned:** ${now}\n`;
    md += `**Issues found:** ${issues.length}\n\n`;

    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');
    const infos = issues.filter(i => i.severity === 'info');

    md += `## Summary\n\n`;
    md += `- 🔴 Errors: ${errors.length}\n`;
    md += `- 🟡 Warnings: ${warnings.length}\n`;
    md += `- 🔵 Info: ${infos.length}\n\n`;

    if (errors.length) {
      md += `## Errors\n\n`;
      errors.forEach((issue, i) => {
        md += `### ${i + 1}. ${issue.message}\n`;
        md += `- **WCAG:** ${issue.wcag.sc} (${issue.wcag.level}) — ${issue.wcag.name}\n`;
        md += `- **Element:** \`<${issue.element.tag}>\`\n`;
        if (issue.element.selector) md += `- **Selector:** \`${issue.element.selector}\`\n`;
        if (issue.annotation) md += `- **Note:** ${issue.annotation}\n`;
        md += `\n`;
      });
    }

    if (warnings.length) {
      md += `## Warnings\n\n`;
      warnings.forEach((issue, i) => {
        md += `### ${i + 1}. ${issue.message}\n`;
        md += `- **WCAG:** ${issue.wcag.sc} (${issue.wcag.level}) — ${issue.wcag.name}\n`;
        md += `- **Element:** \`<${issue.element.tag}>\`\n`;
        if (issue.element.selector) md += `- **Selector:** \`${issue.element.selector}\`\n`;
        if (issue.annotation) md += `- **Note:** ${issue.annotation}\n`;
        md += `\n`;
      });
    }

    if (infos.length) {
      md += `## Info\n\n`;
      infos.forEach((issue, i) => {
        md += `### ${i + 1}. ${issue.message}\n`;
        md += `- **WCAG:** ${issue.wcag.sc} (${issue.wcag.level}) — ${issue.wcag.name}\n`;
        if (issue.annotation) md += `- **Note:** ${issue.annotation}\n`;
        md += `\n`;
      });
    }

    return md;
  }

  // ─── Message Handling ──────────────────────────────────────

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'scan':
        const result = runScan();
        renderOverlay();
        sendResponse({ issues: result, count: result.length });
        break;

      case 'toggle-overlay':
        if (overlayActive) {
          clearOverlay();
        } else if (issues.length) {
          renderOverlay();
        } else {
          const result = runScan();
          renderOverlay();
        }
        sendResponse({ active: overlayActive });
        break;

      case 'clear':
        clearOverlay();
        issues = [];
        sendResponse({ ok: true });
        break;

      case 'get-issues':
        sendResponse({ issues, annotations });
        break;

      case 'export-markdown':
        const md = exportMarkdown();
        sendResponse({ markdown: md });
        break;

      case 'save-annotation':
        annotations[message.issueId] = message.note;
        const issue = issues.find(i => i.id === message.issueId);
        if (issue) issue.annotation = message.note;
        sendResponse({ ok: true });
        break;

      default:
        break;
    }
    return true;
  });

  // Listen for custom event from background
  window.addEventListener('a11y-scan-request', () => {
    const result = runScan();
    renderOverlay();
  });

  console.log('a11y-annotator: Content script loaded');
})();
