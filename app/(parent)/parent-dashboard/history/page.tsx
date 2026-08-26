import TransactionCard from "./TransactionCard";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Ensures fresh database pull on every request

export default async function HistoryPage() {
  const allTransactions = await prisma.transaction.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const now = new Date().getTime();
  const FIVE_MINUTES = 5 * 60 * 1000;

  const pendingTransactions = allTransactions.filter(
    (tx) => tx.status === "PENDING" && (now - new Date(tx.createdAt).getTime() <= FIVE_MINUTES)
  );

  const pastTransactions = allTransactions.filter(
    (tx) => tx.status !== "PENDING" || (now - new Date(tx.createdAt).getTime() > FIVE_MINUTES)
  );

  return (
    <div className="max-w-4xl p-6">
      <h1 className="text-3xl font-extrabold text-[#1e1b4b] mb-2">
        Transactions & Approvals
      </h1>
      <p className="text-slate-500 mb-8">
        Review pending requests and your past payment history.
      </p>

      <h2 className="text-sm font-bold text-orange-500 mb-4 tracking-wider uppercase">
        Pending Requests (Action Required)
      </h2>
      <div className="flex flex-col mb-10">
        {pendingTransactions.length > 0 ? (
          pendingTransactions.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} />
          ))
        ) : (
          <p className="text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
            No active requests at the moment.
          </p>
        )}
      </div>

      <h2 className="text-sm font-bold text-slate-500 mb-4 tracking-wider uppercase">
        Past & Expired Requests
      </h2>
      <div className="flex flex-col space-y-3 opacity-75">
        {pastTransactions.length > 0 ? (
          pastTransactions.map((tx) => {
            const isExpired = tx.status === "PENDING" && (now - new Date(tx.createdAt).getTime() > FIVE_MINUTES);
            let displayStatus = isExpired ? "EXPIRED" : tx.status;
            
            const statusColors: Record<string, string> = {
              APPROVED: "text-green-600 bg-green-50 border-green-200",
              APPROVED_AND_PAID: "text-green-600 bg-green-50 border-green-200",
              DECLINED: "text-red-600 bg-red-50 border-red-200",
              DECLINED_BY_PARENT: "text-red-600 bg-red-50 border-red-200",
              EXPIRED: "text-slate-600 bg-slate-100 border-slate-200",
            };

            return (
              <div key={tx.id} className="border border-slate-200 bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1" suppressHydrationWarning>
                    {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="font-bold text-gray-900 text-base">
                    ₹{tx.amount} <span className="font-normal text-sm">at {tx.merchantName || "Unknown Merchant"}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">UPI ID: {tx.merchantVpa}</p>
                </div>
                
                <div className={`px-4 py-1.5 rounded-lg border text-xs font-bold tracking-wide ${statusColors[displayStatus] || "text-slate-600 bg-slate-100"}`}>
                  {displayStatus === "APPROVED_AND_PAID" ? "PAID" : displayStatus}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-slate-500 text-sm">No transaction history yet.</p>
        )}
      </div>
    </div>
  );
}