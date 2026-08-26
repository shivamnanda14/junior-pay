import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function JuniorGuardianDetailPage({ params }: PageProps) {
  const session = await getCurrentUser();
  if (!session) return null;

  const resolvedParams = await params;
  const connectionId = resolvedParams.id;

  // Fetch connection and parent profile
  const connection = await prisma.childConnection.findUnique({
    where: { id: connectionId },
    include: { parent: true },
  });

  if (!connection || connection.childId !== session.userId) {
    return <div className="p-8 text-center text-sm font-bold text-slate-500">Guardian record not found.</div>;
  }

  // Fetch transactions tied to this guardian
  const transactions = await prisma.transaction.findMany({
    where: {
      childId: session.userId,
      parentId: connection.parentId,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/junior-hub/guardians" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition">
        ← Back to Circle
      </Link>

      {/* Guardian Profile Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">👨‍👩‍👧</div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{connection.parent.name}</h2>
            <p className="text-xs text-slate-500">Mobile: +91 {connection.parent.phoneNumber}</p>
          </div>
        </div>

        {/* UPI ID display */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered VPA / UPI ID</p>
          <p className="font-mono font-bold text-slate-800 text-sm">
            {connection.parent.upiId || `${connection.parent.phoneNumber}@ybl`}
          </p>
        </div>

        {/* Read-Only Limit Status */}
        <div className="flex justify-between items-center bg-purple-50 p-4 rounded-2xl border border-purple-100 text-purple-900">
          <span className="text-xs font-bold uppercase tracking-wider">Assigned Daily Limit</span>
          <span className="text-lg font-extrabold">₹{connection.dailyLimit}</span>
        </div>
      </div>

      {/* Transaction History with this Guardian */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Transaction History</h3>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No requests made to this guardian yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">₹{tx.amount.toFixed(2)} at {tx.merchantName}</p>
                  <p className="text-[10px] text-slate-400">{tx.createdAt.toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
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