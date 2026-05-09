import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { scoreConversation } from "@/lib/gemini";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await req.json();
    const supabase = createServiceClient();

    // Mark conversation as completed
    await supabase
      .from("conversations")
      .update({ status: "completed" })
      .eq("id", conversationId);

    // Fetch all messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages found" }, { status: 400 });
    }

    // Build transcript
    const transcript = messages
      .map((m) => `${m.role === "user" ? "Salesperson" : "Marcus (Buyer)"}: ${m.content}`)
      .join("\n\n");

    // Score the conversation
    const scores = await scoreConversation(transcript);

    // Save scores
    const { data: scoreRecord } = await supabase
      .from("scores")
      .insert({
        conversation_id: conversationId,
        confidence_score: scores.confidence,
        persuasion_score: scores.persuasion,
        clarity_score: scores.clarity,
        objection_score: scores.objection_handling,
        overall_score: scores.overall,
        feedback: scores.feedback,
        weaknesses: scores.weaknesses,
        suggestions: scores.suggestions,
      })
      .select()
      .single();

    return NextResponse.json({ scores, scoreId: scoreRecord?.id });
  } catch (error) {
    console.error("Session end error:", error);
    return NextResponse.json({ error: "Failed to analyze session" }, { status: 500 });
  }
}
