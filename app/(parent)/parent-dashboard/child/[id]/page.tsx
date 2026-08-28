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

  // Fetch all guardians connected to this child (Co-Guardians Feature)
  const allGuardians = await prisma.childConnection.findMany({
    where: { childId: connection.childId },
    include: { parent: true }
  });
  const otherGuardians = allGuardians.filter(g => g.parentId !== session.userId);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0 pb-10">
      {/* Back Link */}
      <Link href="/parent-dashboard" className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 transition inline-block">
        ← Back to Dashboard
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">👦</div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{connection.child.name}</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">@{connection.child.username}</p>
          </div>
        </div>

        {/* Disconnect Action */}
        <form action={disconnectChild} className="w-full sm:w-auto mt-2 sm:mt-0">
          <input type="hidden" name="connectionId" value={connection.id} />
          <button type="submit" className="w-full sm:w-auto bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-100 transition">
            Disconnect Junior
          </button>
        </form>
      </div>

      {/* Limit Configuration Card (Parent Exclusive Control) */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Allowance Control</h3>
        <form action={updateDailyLimit} className="space-y-4">
          <input type="hidden" name="connectionId" value={connection.id} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-2">Limit Type</label>
              <select 
                name="limitType" 
                defaultValue={connection.limitType || "DAILY"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#5f259f]"
              >
                <option value="DAILY">Day-wise (Resets Daily)</option>
                <option value="MONTHLY">Month-wise (Resets Monthly)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-2">Limit Amount (₹)</label>
              <input 
                type="number" 
                name="limitAmount" 
                defaultValue={connection.limitAmount} 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#5f259f]" 
              />
            </div>
          </div>

          <button type="submit" className="w-full sm:w-auto bg-[#5f259f] text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-800 transition text-sm sm:text-base shadow-sm">
            Save Limit Settings
          </button>
        </form>
      </div>

      {/* Co-Guardians UI Card */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Connected Co-Guardians</h2>
        <p className="text-[10px] sm:text-xs text-slate-500 mb-4 uppercase tracking-wider">
          Other parents linked to this account
        </p>

        {otherGuardians.length > 0 ? (
          <div className="space-y-3">
            {otherGuardians.map((guardian) => (
              <div key={guardian.id} className="flex flex-row items-center justify-between p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold uppercase">
                    {guardian.parent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">{guardian.parent.name}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium bg-slate-200/50 inline-block px-2 py-0.5 rounded mt-1">
                      {guardian.limitType || "DAILY"} Limit: ₹{guardian.limitAmount}
                    </p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-white border border-slate-200 rounded text-[8px] sm:text-[10px] font-bold text-slate-400">
                  {guardian.isPrimary ? "PRIMARY" : "CO-GUARDIAN"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-100 border-dashed rounded-xl text-center">
            <p className="text-xs sm:text-sm font-medium text-slate-500">You are the only guardian connected to this junior.</p>
          </div>
        )}
      </div>

      {/* Specific Transaction History */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Transaction History with {connection.child.name}</h3>
        
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-xs sm:text-sm py-4 text-center">No transactions recorded with this junior yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <p className="font-bold text-slate-900 text-sm">₹{tx.amount.toFixed(2)} <span className="font-normal text-xs sm:text-sm">at {tx.merchantName}</span></p>
                  <p className="text-[10px] sm:text-xs text-slate-400">{tx.createdAt.toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg border w-full sm:w-auto text-center tracking-wide ${
                  tx.status === 'APPROVED_AND_PAID' ? 'bg-green-50 border-green-200 text-green-700' :
                  tx.status === 'DECLINED_BY_PARENT' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  {tx.status === 'APPROVED_AND_PAID' ? 'PAID' : tx.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}