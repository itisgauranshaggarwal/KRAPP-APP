export interface SupabaseConfig {
  url: string
  anonKey: string
}

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

export const supabaseConfig: SupabaseConfig | null = url && anonKey ? { url, anonKey } : null

export const isSupabaseConfigured = supabaseConfig !== null

export function getSupabaseConfig(): SupabaseConfig {
  if (!supabaseConfig) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
    )
  }

  return supabaseConfig
}
