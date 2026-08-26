import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function JuniorGuardiansListPage() {
  const session = await getCurrentUser();
  if (!session) return null;

  // Fetch all parents/guardians connected to this junior
  const connections = await prisma.childConnection.findMany({
    where: { childId: session.userId },
    include: { parent: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Your Guardians</h2>
        <p className="text-xs text-slate-500">Manage and view your linked family circles.</p>
      </div>

      {connections.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm mt-6">
          <div className="text-4xl mb-3">🛡️</div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Guardians Connected</h3>
          <p className="text-xs text-slate-400">Ask your parent to link your account using your username.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => (
            <Link key={conn.id} href={`/junior-hub/guardian/${conn.id}`} className="block">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-purple-300 hover:shadow-sm transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg">👨‍👩‍👧</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{conn.parent.name}</p>
                    <p className="text-xs text-slate-500">Daily Limit: ₹{conn.dailyLimit}</p>
                  </div>
                </div>
                <span className="text-slate-400 font-bold text-sm">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}