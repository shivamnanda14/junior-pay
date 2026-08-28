import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import ConnectGuardianModal from "./ConnectGuardianModal";

export default async function GuardiansPage() {
  const session = await getCurrentUser();
  if (!session) return null;

  const connections = await prisma.childConnection.findMany({
    where: { childId: session.userId },
    include: { parent: true },
  });

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  const connectionsWithStats = await Promise.all(
    connections.map(async (conn) => {
      const startDate = conn.limitType === "DAILY" ? startOfDay : startOfMonth;
      
      const txs = await prisma.transaction.findMany({
        where: {
          childId: session.userId,
          parentId: conn.parentId,
          createdAt: { gte: startDate },
          status: { in: ["PENDING", "APPROVED_AND_PAID"] },
        },
      });

      const spent = txs.reduce((sum, t) => sum + t.amount, 0);
      const remaining = Math.max(0, conn.limitAmount - spent);

      return {
        ...conn,
        spent,
        remaining,
      };
    })
  );

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-0 space-y-4 pb-12">
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Your Guardians</h1>
        <p className="text-xs sm:text-sm text-slate-500">Live allowance limits and real-time remaining balances.</p>
      </div>

      <div className="space-y-3">
        {connectionsWithStats.map((conn: any) => (
          <div key={conn.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg">👨‍👩‍👧</div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">{conn.parent.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium">
                    {conn.limitType.toLowerCase()} Limit
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                  ₹{conn.remaining.toFixed(2)} Left
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#5f259f] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (conn.spent / conn.limitAmount) * 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Spent: ₹{conn.spent.toFixed(2)}</span>
              <span>Total Cap: ₹{conn.limitAmount}</span>
            </div>
          </div>
        ))}
      </div>

      <ConnectGuardianModal />
    </div>
  );
}