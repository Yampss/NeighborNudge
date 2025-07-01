import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// More lenient validation for development
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  console.warn('VITE_SUPABASE_URL is not set. Database features will not work.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.warn('VITE_SUPABASE_ANON_KEY is not set. Database features will not work.');
}

// Create client even with empty values to prevent errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);