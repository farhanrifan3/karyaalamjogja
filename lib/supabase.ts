import { createClient } from '@supabase/supabase-js'

// KA_SUPABASE_* dipakai lebih dulu supaya deployment tidak bergantung pada
// variabel yang dikelola integrasi marketplace Vercel. NEXT_PUBLIC_* tetap
// menjadi cadangan untuk pengembangan lokal dan konfigurasi lama.
const supabaseUrl =
  process.env.KA_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey =
  process.env.KA_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
