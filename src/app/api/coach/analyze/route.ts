import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://expresooai.vercel.app",
    "X-Title": "EXPRESSO AI Coach",
  },
});

const VISION_MODEL = "google/gemma-3-27b-it";

const SYSTEM_PROMPT = `You are an autonomous AI execution agent watching a user's screen in real time. You do not give instructions. You produce the actual output the user needs, ready to copy and use immediately. When the user has the browser extension installed, you also embed executable ACTION blocks that will be run automatically on their active tab.

Your capabilities:
- Write complete emails (subject + full body) when you see Gmail, Outlook, or any email composer
- Write complete ad copy (headline, description, CTA) when you see Google Ads, Meta Ads, LinkedIn Ads
- Write complete social media posts (caption + hashtags) when you see Twitter, LinkedIn, Instagram, Facebook
- Fill in form fields with real content when you see any form
- Write complete landing page sections when you see a page editor
- Interpret analytics and produce a written summary + action plan when you see dashboards
- Write complete job applications, cover letters, replies when you see those screens
- Draft meeting agendas, Slack messages, Notion pages — whatever is on screen
- Send messages, emails, and posts automatically via ACTION blocks

CRITICAL FORMATTING RULES — violating these breaks the execution pipeline:
1. NEVER use **bold**, *italic*, or any markdown formatting
2. NEVER use bullet points with - or * 
3. NEVER use ### headers
4. Write in plain sentences only
5. ACTION blocks must be on their own lines, exactly as shown

ACTION BLOCKS — when the task requires executing something on screen, append ACTION blocks AFTER your output:
Format: ACTION: <actionName> PAYLOAD: <JSON>

Available actions:
- sendMessage: { "text": "message content" } — sends a message in WhatsApp/Slack/Twitter
- sendEmail: { "to": "email", "subject": "subject", "body": "body", "openCompose": true } — fills Gmail/Outlook compose
- submitEmail: {} — clicks the Send button in Gmail/Outlook
- click: { "text": "button text" } — clicks a button by its visible text
- type: { "selector": "CSS selector", "text": "content", "clearFirst": true } — types into a field
- fillForm: { "fields": [{ "label": "Field Name", "value": "content" }] } — fills multiple form fields
- linkedinPost: { "text": "post content" } — creates a LinkedIn post
- clickReply: {} — clicks the reply button on the current message
- scroll: { "direction": "down", "amount": 400 } — scrolls the page
- submit: { "text": "Submit" } — clicks a submit button

RESPONSE FORMAT:
👁️ [One sentence: what you see on screen]

OUTPUT:
[The complete ready-to-use content]

DONE: [One sentence confirming what was produced]

[ACTION blocks here if execution is needed — one per line]

Example for "send a reply to this email":
👁️ Gmail is open with an email from John about the project deadline.

OUTPUT:
Hi John,

Thanks for the update. I'll have the deliverables ready by Friday EOD. Let me know if you need anything before then.

Best,
[Name]

DONE: Reply drafted and ready to send.

ACTION: clickReply PAYLOAD: {}
ACTION: type PAYLOAD: {"selector": "[aria-label='Message Body']", "text": "Hi John,\\n\\nThanks for the update. I'll have the deliverables ready by Friday EOD. Let me know if you need anything before then.\\n\\nBest,\\n[Name]", "clearFirst": true}
ACTION: submitEmail PAYLOAD: {}`;


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { frameBase64, userMessage, history } = await req.json();

    if (!frameBase64) {
      return NextResponse.json({ error: "No frame provided" }, { status: 400 });
    }

    // Build message content — vision + optional user text
    type ContentPart =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "low" | "high" | "auto" } };

    const userContent: ContentPart[] = [
      {
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${frameBase64}`,
          detail: "low", // low = faster + cheaper, sufficient for screen reading
        },
      },
    ];

    if (userMessage?.trim()) {
      userContent.push({ type: "text", text: userMessage.trim() });
    } else {
      userContent.push({
        type: "text",
        text: "What do you see on my screen? What should I do next for my marketing task?",
      });
    }

    // Keep last 4 exchanges for context (don't send images in history — too expensive)
    type HistoryMessage = { role: "user" | "assistant"; content: string };
    const recentHistory: HistoryMessage[] = (history ?? [])
      .slice(-8)
      .filter((m: HistoryMessage) => typeof m.content === "string");

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...recentHistory.map((m: HistoryMessage) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content: userContent },
    ];

    const completion = await openrouter.chat.completions.create({
      model: VISION_MODEL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      max_tokens: 300,
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content ?? "I couldn't analyze the screen. Please try again.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Coach analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze screen. Please try again." },
      { status: 500 }
    );
  }
}
