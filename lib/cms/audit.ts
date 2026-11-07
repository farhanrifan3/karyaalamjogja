import { randomBytes } from "node:crypto";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Audit log disimpan di tabel `audit_logs` Supabase supaya persisten di
 * Vercel. Struktur tabel: id, timestamp, action, details, ip.
 */
export type AuditEntry = {
  at: string;
  action: string;
  product: string;
  detail?: string;
};

export type AuditLog = AuditEntry & {
  id: string;
};

type AuditRow = {
  id: string;
  timestamp: string | null;
  action: string | null;
  details: string | null;
};

type AuditDetails = {
  product?: string;
  detail?: string;
};

function parseDetails(raw: string | null): AuditDetails {
  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const value = parsed as Record<string, unknown>;
      return {
        product:
          typeof value.product === "string" ? value.product : undefined,
        detail: typeof value.detail === "string" ? value.detail : undefined,
      };
    }
  } catch {
    // Baris lama mungkin menyimpan teks biasa, bukan JSON.
  }

  return { detail: raw };
}

function mapAuditRow(row: AuditRow): AuditLog {
  const details = parseDetails(row.details);

  return {
    id: row.id,
    at: row.timestamp ?? "",
    action: row.action ?? "aktivitas",
    product: details.product ?? "",
    detail: details.detail,
  };
}

/**
 * Mencatat aktivitas admin. Kegagalan audit tidak boleh menggagalkan aksi
 * utama, jadi error hanya dicatat ke log server.
 */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    const { error } = await getSupabaseAdmin()
      .from("audit_logs")
      .insert({
        id: `audit-${Date.now()}-${randomBytes(3).toString("hex")}`,
        timestamp: entry.at,
        action: entry.action,
        details: JSON.stringify({
          product: entry.product,
          detail: entry.detail ?? null,
        }),
      });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("[cms] gagal menyimpan audit log:", error);
  }
}

export async function getAuditLogs(limit = 400): Promise<AuditLog[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("audit_logs")
    .select("id, timestamp, action, details")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Gagal membaca audit log dari Supabase: ${error.message}`);
  }

  return ((data ?? []) as AuditRow[]).map(mapAuditRow);
}
