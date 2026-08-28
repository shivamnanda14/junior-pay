import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import JuniorTransactionList from "./JuniorTransactionList";

export const dynamic = "force-dynamic";

export default async function JuniorHistoryPage() {
  const session = await getCurrentUser();

  if (!session) return null;

  const transactions = await prisma.transaction.findMany({
    where: { childId: session.userId },
    include: { parent: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    // Added horizontal padding for mobile screens
    <div className="space-y-4 pb-12 px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Transactions</h2>
      
      {/* Handing off the rendering and timer logic to a Client Component */}
      <JuniorTransactionList transactions={transactions} />
    </div>
  );
}