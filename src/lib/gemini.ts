import "server-only";
import OpenAI from "openai";
import { BUYER_PERSONA } from "./persona";

export { BUYER_PERSONA };

// OpenRouter client — server-side only
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://beyonai.vercel.app",
    "X-Title": "BeyonAi",
  },
});

const MODEL = "google/gemma-3-27b-it";

const SYSTEM_PROMPT = `You are Marcus Chen, VP of Operations at Meridian Logistics, a mid-sized enterprise company.

Your personality:
- Skeptical and analytical - you don't believe claims without proof
- Direct and slightly impatient - you've been through many sales pitches
- Focused on ROI and total cost of ownership
- You've already spoken to two competitors who offered lower pricing

Your goals in this conversation:
- Push back hard on pricing - you want at least 20% off
- Challenge any ROI claims with "prove it" questions
- Bring up that a competitor offered a lower price
- Test whether the salesperson knows their product deeply
- Ask about implementation time and internal resources needed

Rules:
- NEVER break character
- Keep responses to 2-4 sentences - you're busy
- Escalate pressure if the salesperson gives weak or vague answers
- Show slight receptiveness only if they make a genuinely strong, specific point
- Do NOT be helpful or friendly - you are a difficult buyer
- Start the conversation by saying you only have 10 minutes and you've already seen two other vendors`;

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function getAIResponse(history: ChatMessage[]): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
  ];

  if (history.length === 0) {
    messages.push({ role: "user", content: "Hello, thanks for taking the time to meet with me today." });
  }

  const completion = await openrouter.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 200,
    temperature: 0.85,
  });

  return completion.choices[0]?.message?.content ?? "I need a moment.";
}

export async function scoreConversation(transcript: string): Promise<{
  confidence: number;
  persuasion: number;
  clarity: number;
  objection_handling: number;
  overall: number;
  feedback: string;
  weaknesses: string[];
  suggestions: string[];
}> {
  const prompt = `Analyze this sales conversation transcript and score the salesperson's performance.

TRANSCRIPT:
${transcript}

Return ONLY valid JSON in this exact format with no extra text:
{
  "confidence": <integer 1-10>,
  "persuasion": <integer 1-10>,
  "clarity": <integer 1-10>,
  "objection_handling": <integer 1-10>,
  "overall": <integer 1-10>,
  "feedback": "<2-3 sentence overall assessment>",
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}`;

  const completion = await openrouter.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "You are a sales performance analyst. Return only valid JSON, no markdown, no explanation." },
      { role: "user", content: prompt },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });

  const text = completion.choices[0]?.message?.content ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Failed to parse scoring response: ${text}`);
  return JSON.parse(jsonMatch[0]);
}
