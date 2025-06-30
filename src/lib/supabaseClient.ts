import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL
    ? process.env.VITE_SUPABASE_URL
    : import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey =
  typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY
    ? process.env.VITE_SUPABASE_ANON_KEY
    : import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key not found in environment variables.')
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
