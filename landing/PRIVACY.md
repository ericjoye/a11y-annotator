# Privacy Policy — a11y-annotator

**Last updated:** July 7, 2026

## Overview

a11y-annotator ("we", "our", "the extension") is a Chrome extension that scans web pages for accessibility issues, lets you annotate them visually, and exports shareable reports. We are committed to protecting your privacy.

## Data Collection

**a11y-annotator does NOT collect, store, or transmit any personal data.**

All scanning, analysis, and annotation happens locally in your browser. When you use a11y-annotator:

- **No data is sent to external servers.** Accessibility scans are performed entirely within your browser using built-in JavaScript. Nothing is uploaded anywhere.
- **No tracking or analytics.** We do not use Google Analytics, Mixpanel, or any other tracking service.
- **No cookies.** a11y-annotator does not set or read any cookies.
- **No account required.** There is no signup, login, or user account system.

## Local Storage

The only data stored by a11y-annotator is kept locally in your browser using Chrome's `chrome.storage.session` API:

- **Annotation notes** — Text notes you attach to accessibility issues on a page. These persist only for the current browser session and are automatically cleared when the session ends.
- **Overlay visibility state** — Whether the annotation overlay is shown or hidden.
- **License key** — If you purchase Pro, your license key is stored locally via `chrome.storage.local` to verify your Pro status offline across sessions.

This data never leaves your device.

## Permissions

a11y-annotator requests the following Chrome permissions:

- **activeTab** — To access the currently active tab when you click the extension icon. Used only to scan the page you're viewing for accessibility issues.
- **scripting** — To inject content scripts that perform accessibility analysis on web pages.
- **storage** — To store annotation notes and UI state locally in your browser via `chrome.storage.session`.
- **sidePanel** — To display the issue dashboard in Chrome's side panel.
- **tabs** — To read the active tab's URL for display in scan results and reports.

## Host Permissions

a11y-annotator requests `<all_urls>` access because it needs to scan any webpage you choose for accessibility issues. This permission is used solely for local analysis — no data is transmitted externally.

## Single Purpose

a11y-annotator's single purpose is to scan web pages for WCAG accessibility issues, allow users to annotate them with visual markers, and export reports of the findings. All processing is performed locally in the browser.

## Third-Party Services

a11y-annotator integrates with **Stripe** for Pro tier payments. When you click an upgrade button, you are redirected to Stripe's hosted checkout page. Stripe's own privacy policy applies to that transaction. a11y-annotator does not process or store payment information.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the extension's listing on the Chrome Web Store and at the privacy policy URL.

## Contact

If you have questions about this privacy policy, contact us at: support@ericjoye.com
