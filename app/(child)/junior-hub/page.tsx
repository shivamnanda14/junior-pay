import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function JuniorHubPage() {
  const session = await getCurrentUser();
  if (!session) return null;

  const junior = await prisma.child.findUnique({
    where: { id: session.userId },
    include: {
      connections: true,
    },
  });

  if (!junior) return null;

  const activeGuardiansCount = junior.connections.length;

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
    <div className="w-full max-w-lg mx-auto space-y-5 sm:space-y-6 px-1 sm:px-0">
      
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">Hi, {junior.name} 👋</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">@{junior.username}</p>
        </div>
        <div className="bg-purple-100 text-[#5f259f] px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
          Junior Account
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#5f259f] to-purple-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-purple-200">Account Status</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 sm:mt-2 tracking-tight">Active & Linked</h2>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-purple-400/30 text-xs text-purple-200 gap-1.5 sm:gap-0">
            <span>Linked Guardians: <strong className="text-white">{activeGuardiansCount} Active</strong></span>
            <span>Spent Today: <strong className="text-white">₹{spentToday.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Actions</h3>
        
        <Link href="/junior-hub/scan" className="block">
          <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg hover:bg-slate-800 transition">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl">📷</span>
              <div className="text-left">
                <p className="font-bold text-sm sm:text-base leading-tight">Scan Merchant QR</p>
                <p className="text-xs text-slate-400 font-normal">Pay at stores & shops</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        </Link>

        <Link href="/junior-hub/scan?manual=true" className="block">
          <button className="w-full bg-white text-slate-800 border border-slate-200 p-4 rounded-2xl font-bold flex items-center justify-between hover:bg-slate-50 transition shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl">⌨️</span>
              <div className="text-left">
                <p className="font-bold text-sm sm:text-base leading-tight text-slate-900">Enter UPI ID Manually</p>
                <p className="text-xs text-slate-500 font-normal">Type merchant VPA directly</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Recent Requests</h3>
          <Link href="/junior-hub/history" className="text-[10px] sm:text-xs text-[#5f259f] font-bold hover:underline">View All</Link>
        </div>
        <p className="text-xs text-slate-500 text-center py-4">No recent activity today.</p>
      </div>

    </div>
  );
}