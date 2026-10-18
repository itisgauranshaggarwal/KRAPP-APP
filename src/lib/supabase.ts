import { createClient } from '@supabase/supabase-js'

import { supabaseConfig } from '@/lib/supabase-config'

export const supabase = supabaseConfig
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const isSupabaseMode =
  import.meta.env.VITE_KRAPP_DATA_MODE === 'supabase' ||
  (import.meta.env.VITE_KRAPP_DATA_MODE !== 'mock' && supabaseConfig !== null)
