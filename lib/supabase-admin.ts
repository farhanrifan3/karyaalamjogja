import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Jangan impor dari Client Component: kunci ini melewati aturan RLS Supabase.
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("Klien admin Supabase hanya boleh dipakai di server.");
  }

  if (client) {
    return client;
  }

  const url = process.env.KA_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.KA_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "CMS membutuhkan KA_SUPABASE_URL dan KA_SUPABASE_SERVICE_ROLE_KEY (atau NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY) di environment server.",
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return client;
}
