import fs from "fs/promises";
import path from "path";
import { commitContent } from "@/lib/cms/git";

const FINANCE_PATH = "content/finance.json";

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
  initialBalance: number; // Rp9.835.000 per 1 Nov 2026
  transactions: TransactionItem[];
};

export async function getFinanceStore(): Promise<FinanceStore> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), FINANCE_PATH), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      initialBalance: 9835000,
      transactions: [
        {
          id: "tx-1",
          date: "2026-11-02",
          type: "masuk",
          category: "DP Proyek",
          description: "DP Pembuatan Kolam Koi Pak Hendra",
          amount: 5000000,
          paymentMethod: "Transfer",
          customer: "Pak Hendra",
          project: "Kolam Koi",
        },
        {
          id: "tx-2",
          date: "2026-11-02",
          type: "keluar",
          category: "Pembelian Material",
          description: "Beli Batu Andesit Bakar 30x60 (10 m2)",
          amount: 1200000,
          paymentMethod: "Tunai",
          project: "Stok Pangkalan",
        },
      ],
    };
  }
}

export async function saveFinanceStore(store: FinanceStore): Promise<void> {
  store.updatedAt = new Date().toISOString();
  await fs.writeFile(path.join(process.cwd(), FINANCE_PATH), JSON.stringify(store, null, 2), "utf-8");
}

export async function addTransaction(tx: Omit<TransactionItem, "id">): Promise<void> {
  const store = await getFinanceStore();
  const newItem: TransactionItem = {
    id: `tx-${Date.now()}`,
    ...tx,
  };
  store.transactions.unshift(newItem);
  await saveFinanceStore(store);
  try {
    await commitContent([FINANCE_PATH], `Add financial transaction: ${tx.description}`);
  } catch {}
}

export async function deleteTransaction(id: string): Promise<void> {
  const store = await getFinanceStore();
  store.transactions = store.transactions.filter((t) => t.id !== id);
  await saveFinanceStore(store);
  try {
    await commitContent([FINANCE_PATH], `Delete financial transaction ${id}`);
  } catch {}
}
