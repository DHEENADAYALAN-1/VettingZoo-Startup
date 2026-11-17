import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// True only when both values are set (locally in .env.local, on Vercel in Environment Variables)
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Placeholders keep the app from crashing at startup when the values are missing;
// the login and signup pages show a clear message in that case.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key"
);
