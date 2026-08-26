import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function JuniorHubPage() {
  const session = await getCurrentUser();
  if (!session) return null;

  // 1. Fetch real Junior details and their connections
  const junior = await prisma.child.findUnique({
    where: { id: session.userId },
    include: {
      connections: true,
    },
  });

  if (!junior) return null;

  // 2. Count active guardians
  const activeGuardiansCount = junior.connections.length;

  // 3. Calculate real spending for today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayTransactions = await prisma.transaction.findMany({
    where: {
      childId: session.userId,
      status: "APPROVED_AND_PAID",
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  const spentToday = todayTransactions.reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Junior Profile Header Info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Hi, {junior.name} 👋</h1>
          <p className="text-xs text-slate-500 font-medium">@{junior.username}</p>
        </div>
        <div className="bg-purple-100 text-[#5f259f] px-3 py-1 rounded-full text-xs font-bold">
          Junior Account
        </div>
      </div>

      {/* Balance / Allowance Card */}
      <div className="bg-gradient-to-br from-[#5f259f] to-purple-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs uppercase font-bold tracking-widest text-purple-200">Account Status</p>
          <h2 className="text-3xl font-extrabold mt-2 tracking-tight">Active & Linked</h2>
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-purple-400/30 text-xs text-purple-200">
            <span>Linked Guardians: <strong>{activeGuardiansCount} Active</strong></span>
            <span>Spent Today: ₹{spentToday.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Center */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Actions</h3>
        
        <Link href="/junior-hub/scan" className="block">
          <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg hover:bg-slate-800 transition">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📷</span>
              <div className="text-left">
                <p className="font-bold text-sm leading-tight">Scan Merchant QR</p>
                <p className="text-xs text-slate-400 font-normal">Pay at stores & shops</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        </Link>

        <Link href="/junior-hub/scan?manual=true" className="block">
          <button className="w-full bg-white text-slate-800 border border-slate-200 p-4 rounded-2xl font-bold flex items-center justify-between hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⌨️</span>
              <div className="text-left">
                <p className="font-bold text-sm leading-tight text-slate-900">Enter UPI ID Manually</p>
                <p className="text-xs text-slate-500 font-normal">Type merchant VPA directly</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        </Link>
      </div>

      {/* Recent Activity Mini-List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Requests</h3>
          <Link href="/junior-hub/history" className="text-xs text-[#5f259f] font-bold hover:underline">View All</Link>
        </div>
        <p className="text-xs text-slate-500 text-center py-4">No recent activity today.</p>
      </div>

    </div>
  );
}