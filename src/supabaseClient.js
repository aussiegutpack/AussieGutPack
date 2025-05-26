// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log("Supabase URL:", supabaseUrl); // Debug log
console.log("Supabase Anon Key:", supabaseAnonKey); // Debug log
console.log('All env:', import.meta.env);
if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not defined in environment variables");
}
if (!supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_ANON_KEY is not defined in environment variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
