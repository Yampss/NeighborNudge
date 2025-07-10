import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  throw new Error('VITE_SUPABASE_URL is not set. Please check your .env file.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error('VITE_SUPABASE_ANON_KEY is not set. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);