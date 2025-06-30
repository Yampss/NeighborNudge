import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that we have proper Supabase configuration
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseUrl.startsWith('https://')) {
  throw new Error(
    'Missing or invalid VITE_SUPABASE_URL. Please set a valid Supabase URL in your .env file. ' +
    'You can find your project URL in your Supabase project settings under API.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error(
    'Missing or invalid VITE_SUPABASE_ANON_KEY. Please set a valid Supabase anonymous key in your .env file. ' +
    'You can find your anon key in your Supabase project settings under API.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);