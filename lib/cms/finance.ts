import { randomBytes } from "node:crypto";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SETTINGS_ID = "main";
const DEFAULT_INITIAL_BALANCE = 9835000; // Rp9.835.000 per 1 Nov 2026

export type TransactionItem = {
  id: string;
  date: string;
  type: "masuk" | "keluar";
  category: string;
  description: string;
  amount: number;
  paymentMethod: "Tunai" | "Transfer" | "QRIS" | "Lainnya";
  customer?: string;
  project?: string;
};

type FinanceStore = {
  version: number;
  updatedAt: string;
  initialBalance: number;
  transactions: TransactionItem[];
};

type FinanceSettingsRow = {
  id: string;
  initial_balance: number | string | null;
  updated_at: string | null;
};

type FinanceTransactionRow = {
  id: string;
  date: string | null;
  type: string | null;
  category: string | null;
  description: string | null;
  amount: number | string | null;
  payment_method: string | null;
  customer: string | null;
  created_at: string | null;
};

function mapTransaction(row: FinanceTransactionRow): TransactionItem {
  const paymentMethod =
    row.payment_method === "Transfer" ||
    row.payment_method === "QRIS" ||
    row.payment_method === "Lainnya"
      ? row.payment_method
      : "Tunai";

  return {
    id: row.id,
    date: row.date ?? "",
    type: row.type === "keluar" ? "keluar" : "masuk",
    category: row.category ?? "",
    description: row.description ?? "",
    amount: Number(row.amount ?? 0),
    paymentMethod,
    customer: row.customer ?? undefined,
  };
}

export async function getFinanceStore(): Promise<FinanceStore> {
  const admin = getSupabaseAdmin();

  const [settingsResult, transactionsResult] = await Promise.all([
    admin
      .from("finance_settings")
      .select("id, initial_balance, updated_at")
      .eq("id", SETTINGS_ID)
      .maybeSingle(),
    admin
      .from("finance_transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (settingsResult.error) {
    throw new Error(
      `Gagal membaca pengaturan keuangan dari Supabase: ${settingsResult.error.message}`,
    );
  }

  if (transactionsResult.error) {
    throw new Error(
      `Gagal membaca transaksi keuangan dari Supabase: ${transactionsResult.error.message}`,
    );
  }

  const settings = settingsResult.data as FinanceSettingsRow | null;
  const rows = (transactionsResult.data ?? []) as FinanceTransactionRow[];

  return {
    version: 1,
    updatedAt: settings?.updated_at ?? new Date().toISOString(),
    initialBalance: Number(settings?.initial_balance ?? DEFAULT_INITIAL_BALANCE),
    transactions: rows.map(mapTransaction),
  };
}

export async function addTransaction(
  tx: Omit<TransactionItem, "id">,
): Promise<void> {
  const id = `tx-${Date.now()}-${randomBytes(3).toString("hex")}`;

  const { error } = await getSupabaseAdmin()
    .from("finance_transactions")
    .insert({
      id,
      date: tx.date,
      type: tx.type,
      category: tx.category,
      description: tx.description,
      amount: tx.amount,
      payment_method: tx.paymentMethod,
      customer: tx.customer ?? null,
    });

  if (error) {
    throw new Error(
      `Gagal menyimpan transaksi ke Supabase: ${error.message}`,
    );
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("finance_transactions")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Gagal menghapus transaksi dari Supabase: ${error.message}`,
    );
  }
}
