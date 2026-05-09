import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for API routes)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  scenario_name: string;
  status: "active" | "completed";
  created_at: string;
};

export type Score = {
  id: string;
  conversation_id: string;
  confidence_score: number;
  persuasion_score: number;
  clarity_score: number;
  objection_score: number;
  overall_score: number;
  feedback: string;
  weaknesses: string[];
  suggestions: string[];
  created_at: string;
};
