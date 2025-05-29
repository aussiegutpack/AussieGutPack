// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
console.log('Supabase URL from import.meta.env:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key from import.meta.env:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('All env:', import.meta.env);
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined - please check your .env.local file');
}
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined - please check your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
