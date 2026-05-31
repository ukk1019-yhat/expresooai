# BeyonAi Agent — Browser Extension

This Chrome/Edge extension enables the AI Coach to **actually execute actions** on your active browser tab — clicking buttons, filling forms, sending messages, drafting emails — all triggered by voice or text commands.

## How to Install

1. Open Chrome/Edge and go to `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select this `extension` folder
5. The extension will appear with the BeyonAi logo

## How to Connect

1. Click the extension icon in your browser toolbar
2. Copy the **Extension ID** shown in the popup
3. Open the AI Coach at `/ai-coach`
4. Share your screen
5. Paste the Extension ID in the sidebar panel
6. Click Connect — the status turns green

## What It Can Do

Once connected, the AI agent can autonomously:

| Command | What happens |
|---|---|
| "Send a reply to this email" | Opens reply, types the AI-drafted response, sends it |
| "Write and send this WhatsApp message" | Types into WhatsApp Web, hits send |
| "Post this to LinkedIn" | Opens post composer, types content, ready to publish |
| "Fill this form" | Fills all visible form fields with appropriate content |
| "Send this email to John" | Opens Gmail compose, fills recipient/subject/body, sends |
| "Reply to this Slack message" | Types reply in the correct Slack thread |

## Supported Platforms

- Gmail
- Outlook (web)
- WhatsApp Web
- LinkedIn
- Twitter / X
- Slack
- Facebook
- Instagram
- Notion
- Google Docs
- Any web form

## Security

- The extension only communicates with `localhost:3000` and `beyonai.vercel.app`
- No data is stored or sent to third parties
- All actions require an active screen share session
- You can disconnect at any time from the AI Coach sidebar
