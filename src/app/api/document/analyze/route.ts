import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import type { DocumentReport } from "@/lib/integrations";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://expresooai.vercel.app",
    "X-Title": "EXPRESSO AI",
  },
});

const MODEL = "google/gemma-3-27b-it";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Supported MIME types
const SUPPORTED_TYPES = [
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

/**
 * Extracts readable text from a file buffer.
 * For PDF/DOCX we do a best-effort UTF-8 extraction of visible text.
 * A production app would use a dedicated parser (pdf-parse, mammoth, etc.).
 */
function extractText(buffer: Buffer, mimeType: string): string {
  if (
    mimeType === "text/plain" ||
    mimeType === "text/markdown" ||
    mimeType === "text/csv" ||
    mimeType === "application/json"
  ) {
    return buffer.toString("utf-8");
  }

  // For PDF/DOCX: extract printable ASCII/UTF-8 runs as a best-effort approach
  // This works surprisingly well for text-heavy documents without adding heavy deps
  const raw = buffer.toString("latin1");
  const chunks: string[] = [];
  let current = "";

  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    // Keep printable ASCII + common whitespace
    if ((code >= 32 && code <= 126) || code === 9 || code === 10 || code === 13) {
      current += raw[i];
    } else {
      if (current.trim().length > 4) {
        chunks.push(current.trim());
      }
      current = "";
    }
  }
  if (current.trim().length > 4) chunks.push(current.trim());

  return chunks.join(" ").replace(/\s{3,}/g, "  ").slice(0, 12000);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const mimeType = file.type || "text/plain";
    if (!SUPPORTED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${mimeType}. Supported: TXT, MD, CSV, JSON, PDF, DOCX`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = extractText(buffer, mimeType);

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the document. Try a plain text or markdown file." },
        { status: 422 }
      );
    }

    const prompt = `You are an expert document analyst and consultant. Analyze the following document and identify all issues, problems, risks, and areas for improvement. Then provide concrete solutions for each issue.

DOCUMENT CONTENT:
---
${text.slice(0, 10000)}
---

Return ONLY valid JSON in this exact format with no extra text or markdown:
{
  "title": "<short descriptive title for this document>",
  "summary": "<2-3 sentence executive summary of what this document is about and its overall quality>",
  "score": <integer 1-10 representing overall document health/quality>,
  "issues": [
    {
      "title": "<concise issue name>",
      "description": "<1-2 sentence description of the issue>",
      "severity": "<high|medium|low>"
    }
  ],
  "solutions": [
    {
      "issue": "<issue title this solves>",
      "solution": "<concrete actionable solution in 1-2 sentences>"
    }
  ],
  "recommendations": [
    "<actionable recommendation 1>",
    "<actionable recommendation 2>",
    "<actionable recommendation 3>"
  ]
}

Rules:
- Find at least 3 issues, up to 10
- Every issue must have a corresponding solution
- Be specific and actionable, not generic
- Score 1-3 = major problems, 4-6 = needs work, 7-8 = good, 9-10 = excellent`;

    const completion = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a document analysis expert. Return only valid JSON, no markdown fences, no explanation.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json(
        { error: "AI failed to generate a structured report. Please try again." },
        { status: 500 }
      );
    }

    const report: DocumentReport = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      report,
      fileName: file.name,
      fileSize: file.size,
      extractedLength: text.length,
    });
  } catch (error) {
    console.error("Document analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze document. Please try again." },
      { status: 500 }
    );
  }
}
