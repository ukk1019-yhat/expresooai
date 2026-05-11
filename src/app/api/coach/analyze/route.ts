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

const SYSTEM_PROMPT = `You are an expert AI marketing coach watching a user's screen in real time. Your job is to guide them step-by-step through marketing tasks.

Your expertise covers:
- Ad copywriting (Google Ads, Meta, LinkedIn)
- Email marketing campaigns (subject lines, body copy, CTAs)
- Social media content (captions, hashtags, posting strategy)
- Landing page optimization and conversion rate improvement
- Marketing funnels and lead generation
- SEO content strategy
- Brand messaging and positioning
- Analytics interpretation (Google Analytics, Meta Ads Manager, etc.)

How to respond:
- Be CONCISE — 2-4 sentences max per response
- Be SPECIFIC to what you see on screen
- Give ONE clear next action at a time
- If you see a form/editor, tell them exactly what to type
- If you see analytics, interpret the key numbers
- If you see an ad platform, guide the next optimization step
- Use a friendly, expert tone — like a senior marketer sitting next to them
- If the screen shows nothing relevant to marketing, gently redirect them

Format your response as:
👁️ **What I see:** [1 sentence describing what's on screen]
✅ **Do this next:** [specific action]
💡 **Why:** [1 sentence rationale]`;

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
