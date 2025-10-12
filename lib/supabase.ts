import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY;

if (!isSupabaseConfigured) {
  console.warn(
    "Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."
  );
}

export const supabase = createClient(
  SUPABASE_URL as string,
  SUPABASE_PUBLISHABLE_KEY as string,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
