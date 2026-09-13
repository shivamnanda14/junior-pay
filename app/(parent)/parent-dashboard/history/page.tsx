import TransactionCard from "./TransactionCard";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Ensures fresh database pull on every request

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "PARENT") {
    redirect("/login");
  }

  // SECURITY FIX: Only fetch transactions linked to THIS specific parent
  // INCLUDE FIX: Fetch the child data so the TransactionCard can display their name
  const allTransactions = await prisma.transaction.findMany({
    where: {
      parentId: user.userId,
    },
    include: {
      child: true,
    },
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
    <div className="w-full max-w-4xl p-4 sm:p-6 mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e1b4b] mb-2">
        Transactions & Approvals
      </h1>
      <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
        Review pending requests and your past payment history.
      </p>

      <h2 className="text-xs sm:text-sm font-bold text-orange-500 mb-3 sm:mb-4 tracking-wider uppercase">
        Pending Requests (Action Required)
      </h2>
      <div className="flex flex-col mb-8 sm:mb-10">
        {pendingTransactions.length > 0 ? (
          pendingTransactions.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} />
          ))
        ) : (
          <p className="text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            No active requests at the moment.
          </p>
        )}
      </div>

      <h2 className="text-xs sm:text-sm font-bold text-slate-500 mb-3 sm:mb-4 tracking-wider uppercase">
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
              <div key={tx.id} className="border border-slate-200 bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 shadow-sm">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1" suppressHydrationWarning>
                    From: <span className="font-bold">{tx.child?.name || "Junior"}</span> &nbsp;
                    {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    ₹{tx.amount} <span className="font-normal text-xs sm:text-sm">at {tx.merchantName || "Unknown Merchant"}</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate max-w-[200px] sm:max-w-none">UPI ID: {tx.merchantVpa}</p>
                  
                  {/* DISPLAYING THE REASON HERE */}
                  {tx.childNote && (
                    <p className="text-xs text-indigo-700 font-semibold mt-2 bg-indigo-50 inline-block px-2 py-1 rounded-md border border-indigo-100">
                      Reason: {tx.childNote}
                    </p>
                  )}
                </div>
                
                <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold tracking-wide w-full sm:w-auto text-center ${statusColors[displayStatus] || "text-slate-600 bg-slate-100"}`}>
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