import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const BUYER_PERSONA = {
  name: "Marcus Chen",
  title: "VP of Operations",
  company: "Meridian Logistics",
  personality: "skeptical and analytical",
  difficulty: 7,
  goals: [
    "reduce pricing by at least 20%",
    "challenge ROI claims with hard questions",
    "test the salesperson's confidence under pressure",
    "bring up competitor alternatives",
    "question implementation complexity",
  ],
};

export const SYSTEM_PROMPT = `You are Marcus Chen, VP of Operations at Meridian Logistics, a mid-sized enterprise company.

Your personality:
- Skeptical and analytical — you don't believe claims without proof
- Direct and slightly impatient — you've been through many sales pitches
- Focused on ROI and total cost of ownership
- You've already spoken to two competitors

Your goals in this conversation:
- Push back hard on pricing — you want at least 20% off
- Challenge any ROI claims with "prove it" questions
- Bring up that a competitor offered a lower price
- Test whether the salesperson knows their product deeply
- Ask about implementation time and internal resources needed

Rules:
- NEVER break character
- Keep responses to 2-4 sentences — you're busy
- Escalate pressure if the salesperson gives weak answers
- Occasionally show slight receptiveness if they make a genuinely strong point
- Do NOT be helpful or friendly — you are a difficult buyer
- Start the conversation by saying you only have 10 minutes`;

export async function getAIResponse(
  conversationHistory: { role: "user" | "model"; parts: { text: string }[] }[]
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const chat = model.startChat({
    history: conversationHistory,
    generationConfig: {
      maxOutputTokens: 200,
      temperature: 0.85,
    },
  });

  // If no history, send opening message trigger
  const lastMessage =
    conversationHistory.length === 0
      ? "Begin the conversation."
      : conversationHistory[conversationHistory.length - 1].parts[0].text;

  const result = await chat.sendMessage(lastMessage);
  return result.response.text();
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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze this sales conversation transcript and score the salesperson's performance.

TRANSCRIPT:
${transcript}

Return ONLY valid JSON in this exact format:
{
  "confidence": <number 1-10>,
  "persuasion": <number 1-10>,
  "clarity": <number 1-10>,
  "objection_handling": <number 1-10>,
  "overall": <number 1-10>,
  "feedback": "<2-3 sentence overall assessment>",
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}

Scoring criteria:
- confidence: How assertive and self-assured was the salesperson?
- persuasion: How effectively did they build a compelling case?
- clarity: How clearly did they communicate value?
- objection_handling: How well did they address Marcus's objections?
- overall: Weighted average of all dimensions`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse scoring response");

  return JSON.parse(jsonMatch[0]);
}
