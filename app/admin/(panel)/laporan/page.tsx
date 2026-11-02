import { getFinanceStore } from "@/lib/cms/finance";
import AdminReportsClient from "./AdminReportsClient";

export default async function AdminReportsPage() {
  const store = await getFinanceStore();

  return (
    <AdminReportsClient
      transactions={store.transactions}
      initialBalance={store.initialBalance}
    />
  );
}
