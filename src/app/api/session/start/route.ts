import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { getAIResponse } from "@/lib/gemini";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Create conversation record
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        scenario_name: "SaaS Sales Objection Call",
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    // Get AI opening message (empty history = AI speaks first)
    const openingMessage = await getAIResponse([]);

    // Save AI opening message
    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      role: "assistant",
      content: openingMessage,
    });

    return NextResponse.json({
      conversationId: conversation.id,
      openingMessage,
    });
  } catch (error) {
    console.error("Session start error:", error);
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 });
  }
}
