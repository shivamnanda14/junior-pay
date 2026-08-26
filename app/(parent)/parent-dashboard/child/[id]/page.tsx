import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { updateDailyLimit, disconnectChild } from "./actions";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ParentChildDetailPage({ params }: PageProps) {
  const session = await getCurrentUser();
  if (!session) return null;

  const resolvedParams = await params;
  const connectionId = resolvedParams.id;

  // Fetch the connection details, child profile, and specific transactions between them
  const connection = await prisma.childConnection.findUnique({
    where: { id: connectionId },
    include: { child: true },
  });

  if (!connection || connection.parentId !== session.userId) {
    return <div className="p-8 text-center font-bold text-slate-500">Connection not found or unauthorized.</div>;
  }

  // Fetch transactions specific to this parent-child pair
  const transactions = await prisma.transaction.findMany({
    where: {
      parentId: session.userId,
      childId: connection.childId,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl space-y-8">
      {/* Back Link */}
      <Link href="/parent-dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition">
        ← Back to Dashboard
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">👦</div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{connection.child.name}</h1>
            <p className="text-sm font-medium text-slate-500">@{connection.child.username}</p>
          </div>
        </div>

        {/* Disconnect Action */}
        <form action={disconnectChild}>
          <input type="hidden" name="connectionId" value={connection.id} />
          <button type="submit" className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-100 transition">
            Disconnect Junior
          </button>
        </form>
      </div>

      {/* Limit Configuration Card (Parent Exclusive Control) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Allowance Control</h3>
        <form action={updateDailyLimit} className="flex gap-4 items-end">
          <input type="hidden" name="connectionId" value={connection.id} />
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Update Daily Limit (₹)</label>
            <input 
              type="number" 
              name="dailyLimit" 
              defaultValue={connection.dailyLimit} 
              required 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-[#5f259f]" 
            />
          </div>
          <button type="submit" className="bg-[#5f259f] text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-800 transition">
            Save Limit
          </button>
        </form>
      </div>

      {/* Specific Transaction History */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Transaction History with {connection.child.name}</h3>
        
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No transactions recorded with this junior yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">₹{tx.amount.toFixed(2)} at {tx.merchantName}</p>
                  <p className="text-xs text-slate-400">{tx.createdAt.toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  tx.status === 'APPROVED_AND_PAID' ? 'bg-green-100 text-green-700' :
                  tx.status === 'DECLINED_BY_PARENT' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}