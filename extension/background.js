// EXPRESSO AI Agent — Background Service Worker

const ALLOWED_ORIGINS = [
  "http://localhost",
  "https://localhost",
  "https://expresooai.vercel.app",
  "https://expresso"
];

// Pages where content scripts cannot be injected
const RESTRICTED_PREFIXES = [
  "chrome://",
  "chrome-extension://",
  "edge://",
  "about:",
  "data:",
  "file://"
];

function isRestricted(url) {
  if (!url) return true;
  return RESTRICTED_PREFIXES.some(p => url.startsWith(p));
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(o => origin.startsWith(o));
}

// ── External messages (from web app via externally_connectable) ───────────────
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  const origin = sender.origin || "";
  console.log("[EXPRESSO] External message from:", origin, "action:", message?.action);

  if (!isAllowedOrigin(origin)) {
    console.warn("[EXPRESSO] Blocked origin:", origin);
    sendResponse({ success: false, error: "Unauthorized origin: " + origin });
    return true;
  }

  handleCommand(message, sendResponse);
  return true;
});

// ── Internal messages (from popup) ────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[EXPRESSO] Internal message:", message?.action);
  handleCommand(message, sendResponse);
  return true;
});

// ── Core command handler ──────────────────────────────────────────────────────
async function handleCommand(message, sendResponse) {
  const { action, payload } = message || {};

  if (!action) {
    sendResponse({ success: false, error: "No action specified" });
    return;
  }

  try {
    // Get active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (!tab?.id) {
      sendResponse({ success: false, error: "No active tab found" });
      return;
    }

    if (isRestricted(tab.url)) {
      sendResponse({
        success: false,
        error: `Cannot run on restricted page: ${tab.url}. Please switch to a regular website tab (Gmail, WhatsApp, etc.)`
      });
      return;
    }

    console.log("[EXPRESSO] Executing action:", action, "on tab:", tab.url);

    // Try to inject content script (safe — already-injected is handled)
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    } catch (injectErr) {
      // Script already injected or page doesn't allow injection
      console.log("[EXPRESSO] Script inject note:", injectErr.message);
    }

    // Small delay to ensure script is ready
    await new Promise(r => setTimeout(r, 150));

    // Send command to content script
    let result;
    try {
      result = await chrome.tabs.sendMessage(tab.id, { action, payload: payload || {} });
    } catch (msgErr) {
      sendResponse({ success: false, error: "Content script not responding: " + msgErr.message });
      return;
    }

    console.log("[EXPRESSO] Action result:", result);
    sendResponse({ success: true, result, tabUrl: tab.url, tabTitle: tab.title });

  } catch (err) {
    console.error("[EXPRESSO] Error:", err);
    sendResponse({ success: false, error: err.message });
  }
}

// ── Install handler ───────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ extensionId: chrome.runtime.id, installed: true });
  console.log("[EXPRESSO] Agent installed. ID:", chrome.runtime.id);
});
