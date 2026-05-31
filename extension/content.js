// BEYON AI Agent — Content Script v2
// Uses modern InputEvent API instead of deprecated execCommand

(function () {
  "use strict";

  if (window.__beyonaiAgentReady) return; // prevent double-injection
  window.__beyonaiAgentReady = true;

  // ── Utilities ──────────────────────────────────────────────────────────────

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Set native value on React/Vue controlled inputs (bypasses synthetic event system)
  function setNativeValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      element.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
      "value"
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(element, value);
    } else {
      element.value = value;
    }
  }

  // Type into a regular input/textarea (works with React, Vue, plain HTML)
  async function typeIntoInput(element, text, clearFirst = true) {
    element.focus();
    await sleep(100);

    if (clearFirst) {
      // Select all and delete
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "a", ctrlKey: true, bubbles: true }));
      await sleep(50);
      setNativeValue(element, "");
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(50);
    }

    // Type character by character
    for (const char of text) {
      const current = element.value;
      setNativeValue(element, current + char);
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
      await sleep(15 + Math.random() * 20);
    }

    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Type into contenteditable (Gmail, WhatsApp, Notion, ChatGPT, etc.)
  async function typeIntoContentEditable(element, text, clearFirst = true) {
    element.focus();
    await sleep(100);

    if (clearFirst) {
      // Select all
      const range = document.createRange();
      range.selectNodeContents(element);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      await sleep(50);
      // Delete selection
      element.dispatchEvent(new InputEvent("beforeinput", { inputType: "deleteContentBackward", bubbles: true }));
      element.innerHTML = "";
      element.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(50);
    }

    // Insert text using insertText InputEvent (works in Chrome)
    element.dispatchEvent(new InputEvent("beforeinput", {
      inputType: "insertText",
      data: text,
      bubbles: true,
      cancelable: true,
    }));

    // Fallback: insert directly if event didn't work
    if (!element.textContent?.includes(text.slice(0, 10))) {
      const textNode = document.createTextNode(text);
      element.appendChild(textNode);
      // Move cursor to end
      const range = document.createRange();
      range.setStartAfter(textNode);
      range.collapse(true);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(50);
  }

  // Smart type — detects element type and uses correct method
  async function smartType(element, text, clearFirst = true) {
    if (!element) return false;
    try {
      if (element.isContentEditable || element.getAttribute("contenteditable") === "true") {
        await typeIntoContentEditable(element, text, clearFirst);
      } else if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        await typeIntoInput(element, text, clearFirst);
      } else {
        // Try contenteditable child
        const ce = element.querySelector("[contenteditable]");
        if (ce) await typeIntoContentEditable(ce, text, clearFirst);
        else return false;
      }
      return true;
    } catch (e) {
      console.error("[BEYONAI] Type error:", e);
      return false;
    }
  }

  // Human-like click
  async function humanClick(element) {
    if (!element) return false;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    await sleep(100);
    element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(50);
    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    await sleep(40);
    element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
    element.click();
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await sleep(100);
    return true;
  }

  // Find element by multiple strategies
  function findElement({ selector, placeholder, label, role, text } = {}) {
    if (selector) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    if (placeholder) {
      const el = document.querySelector(`[placeholder*="${placeholder}" i]`);
      if (el) return el;
    }
    if (label) {
      const labels = Array.from(document.querySelectorAll("label"));
      const lbl = labels.find(l => l.textContent?.toLowerCase().includes(label.toLowerCase()));
      if (lbl?.htmlFor) return document.getElementById(lbl.htmlFor);
    }
    if (role) {
      const el = document.querySelector(`[role="${role}"]`);
      if (el) return el;
    }
    if (text) {
      return Array.from(document.querySelectorAll("button, a, [role=button], span, div, p"))
        .find(e => e.textContent?.trim().toLowerCase() === text.toLowerCase()) || null;
    }
    return null;
  }

  // Detect platform
  function detectPlatform() {
    const url = window.location.href;
    if (url.includes("mail.google.com")) return "gmail";
    if (url.includes("outlook")) return "outlook";
    if (url.includes("web.whatsapp.com")) return "whatsapp";
    if (url.includes("linkedin.com")) return "linkedin";
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
    if (url.includes("facebook.com")) return "facebook";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("slack.com")) return "slack";
    if (url.includes("notion.so")) return "notion";
    if (url.includes("chat.openai.com") || url.includes("chatgpt.com")) return "chatgpt";
    return "generic";
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  const actions = {

    async readPage() {
      return {
        done: true,
        title: document.title,
        url: window.location.href,
        platform: detectPlatform(),
        text: document.body.innerText?.slice(0, 2000) || "",
      };
    },

    async click({ selector, text, role, placeholder }) {
      const el = findElement({ selector, text, role, placeholder });
      if (!el) return { done: false, error: `Element not found: ${JSON.stringify({ selector, text, role })}` };
      await humanClick(el);
      return { done: true, clicked: el.tagName + " " + (el.textContent?.trim().slice(0, 40) || "") };
    },

    async type({ selector, placeholder, label, text, clearFirst = true }) {
      const el = findElement({ selector, placeholder, label });
      if (!el) return { done: false, error: `Input not found: ${JSON.stringify({ selector, placeholder, label })}` };
      const ok = await smartType(el, text, clearFirst);
      return ok ? { done: true, typed: text.slice(0, 60) } : { done: false, error: "Type failed" };
    },

    async sendMessage({ text }) {
      const platform = detectPlatform();
      let inputEl = null;
      let sendBtn = null;

      if (platform === "whatsapp") {
        inputEl = document.querySelector('[contenteditable="true"][data-tab="10"]')
          || document.querySelector('[contenteditable="true"][title*="message" i]')
          || document.querySelector('[contenteditable="true"]');
        sendBtn = document.querySelector('[data-testid="send"]')
          || document.querySelector('button[aria-label*="Send" i]');
      } else if (platform === "slack") {
        inputEl = document.querySelector('[data-qa="message_input"] [contenteditable="true"]')
          || document.querySelector('.ql-editor');
        sendBtn = document.querySelector('[data-qa="texty_send_button"]');
      } else if (platform === "twitter") {
        inputEl = document.querySelector('[data-testid="tweetTextarea_0"]')
          || document.querySelector('[role="textbox"]');
        sendBtn = document.querySelector('[data-testid="tweetButtonInline"]')
          || document.querySelector('[data-testid="tweetButton"]');
      } else if (platform === "chatgpt") {
        inputEl = document.querySelector('#prompt-textarea')
          || document.querySelector('[contenteditable="true"]');
        sendBtn = document.querySelector('[data-testid="send-button"]')
          || document.querySelector('button[aria-label*="Send" i]');
      } else {
        inputEl = document.querySelector('[contenteditable="true"]')
          || document.querySelector('textarea[placeholder*="message" i]')
          || document.querySelector('textarea');
      }

      if (!inputEl) return { done: false, error: "Message input not found on: " + platform };

      await smartType(inputEl, text, true);
      await sleep(400);

      if (sendBtn) {
        await humanClick(sendBtn);
      } else {
        inputEl.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
        inputEl.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
      }

      return { done: true, platform, sent: text.slice(0, 80) };
    },

    async sendEmail({ to, subject, body, openCompose = true }) {
      const platform = detectPlatform();

      if (platform === "gmail") {
        if (openCompose) {
          const composeBtn = document.querySelector('[gh="cm"]')
            || document.querySelector('[data-tooltip*="Compose" i]')
            || Array.from(document.querySelectorAll("div[role=button]"))
                .find(el => el.textContent?.trim() === "Compose");
          if (composeBtn) { await humanClick(composeBtn); await sleep(1000); }
        }

        if (to) {
          const toField = document.querySelector('[name="to"]')
            || document.querySelector('[aria-label*="To" i]');
          if (toField) { await smartType(toField, to, true); await sleep(200); toField.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true })); await sleep(300); }
        }

        if (subject) {
          const subjectField = document.querySelector('[name="subjectbox"]')
            || document.querySelector('[aria-label*="Subject" i]');
          if (subjectField) { await smartType(subjectField, subject, true); await sleep(200); }
        }

        if (body) {
          const bodyField = document.querySelector('[aria-label*="Message Body" i]')
            || document.querySelector('[role="textbox"][aria-multiline="true"]')
            || document.querySelector('.Am.Al.editable');
          if (bodyField) { bodyField.focus(); await sleep(200); await smartType(bodyField, body, true); }
        }

        return { done: true, platform: "gmail", to, subject };
      }

      return { done: false, error: "Not on Gmail. Current platform: " + platform };
    },

    async submitEmail() {
      const platform = detectPlatform();
      let sendBtn = null;

      if (platform === "gmail") {
        sendBtn = document.querySelector('[data-tooltip*="Send" i]')
          || document.querySelector('[aria-label*="Send" i]')
          || Array.from(document.querySelectorAll("div[role=button]"))
              .find(el => el.textContent?.trim() === "Send");
      } else if (platform === "outlook") {
        sendBtn = document.querySelector('[aria-label*="Send" i]')
          || document.querySelector('button[title*="Send" i]');
      }

      if (!sendBtn) return { done: false, error: "Send button not found" };
      await humanClick(sendBtn);
      return { done: true, action: "email_sent" };
    },

    async fillForm({ fields = [] }) {
      const results = [];
      for (const field of fields) {
        const el = findElement({ selector: field.selector, placeholder: field.placeholder, label: field.label });
        if (!el) { results.push({ field: field.label || field.placeholder, done: false, error: "Not found" }); continue; }

        if (el.tagName === "SELECT") {
          el.value = field.value;
          el.dispatchEvent(new Event("change", { bubbles: true }));
          results.push({ field: field.label, done: true });
        } else {
          const ok = await smartType(el, field.value, true);
          results.push({ field: field.label || field.placeholder, done: ok });
        }
        await sleep(150);
      }
      return { done: true, results };
    },

    async clickReply() {
      const platform = detectPlatform();
      let replyBtn = null;

      if (platform === "gmail") {
        replyBtn = document.querySelector('[data-tooltip*="Reply" i]')
          || Array.from(document.querySelectorAll("span[role=link], div[role=button]"))
              .find(el => el.textContent?.trim() === "Reply");
      } else if (platform === "whatsapp") {
        const msgs = document.querySelectorAll('[data-testid="msg-container"]');
        const last = msgs[msgs.length - 1];
        if (last) {
          last.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
          await sleep(400);
          replyBtn = last.querySelector('[data-testid="reply-message"]')
            || last.querySelector('[aria-label*="Reply" i]');
        }
      }

      if (!replyBtn) return { done: false, error: "Reply button not found on: " + platform };
      await humanClick(replyBtn);
      return { done: true, action: "reply_opened" };
    },

    async linkedinPost({ text }) {
      const startPostBtn = document.querySelector('[aria-label*="Start a post" i]')
        || Array.from(document.querySelectorAll("button"))
            .find(el => el.textContent?.includes("Start a post"));
      if (startPostBtn) { await humanClick(startPostBtn); await sleep(1000); }

      const editor = document.querySelector('[role="textbox"][aria-multiline="true"]')
        || document.querySelector('.ql-editor')
        || document.querySelector('[contenteditable="true"]');
      if (!editor) return { done: false, error: "LinkedIn post editor not found" };

      await smartType(editor, text, true);
      return { done: true, posted: text.slice(0, 80) };
    },

    async scroll({ direction = "down", amount = 400 }) {
      window.scrollBy({ top: direction === "down" ? amount : -amount, behavior: "smooth" });
      return { done: true };
    },

    async submit({ selector, text }) {
      const btn = selector
        ? document.querySelector(selector)
        : Array.from(document.querySelectorAll("button[type=submit], input[type=submit], button"))
            .find(el => el.textContent?.toLowerCase().includes((text || "submit").toLowerCase()));
      if (!btn) return { done: false, error: "Submit button not found" };
      await humanClick(btn);
      return { done: true };
    },
  };

  // ── Message listener ───────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const { action, payload } = message || {};
    const handler = actions[action];

    if (!handler) {
      sendResponse({ done: false, error: `Unknown action: ${action}` });
      return true;
    }

    handler(payload || {})
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ done: false, error: err.message }));

    return true;
  });

  console.log("[BEYONAI] Content script ready on:", window.location.href);
})();
