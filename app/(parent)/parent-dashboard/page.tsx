import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions"; 

export default async function ParentDashboardPage() {
  const session = await getCurrentUser();
  
  if (!session) return null;
  
  let parent = null;
  let totalTransactions = 0;

  try {
    parent = await prisma.parentUser.findUnique({
      where: { id: session.userId },
      include: { 
        connections: { include: { child: true } }
      }
    });

    if (parent) {
      totalTransactions = await prisma.transaction.count({
        where: { parentId: session.userId }
      });
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    return (
      <div className="p-6 sm:p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-sm w-full max-w-lg mt-6 sm:mt-10 mx-auto">
        <div className="text-4xl mb-4">🔌</div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Database Connection Timeout</h2>
        <p className="text-slate-500 mb-6 text-xs sm:text-sm">We couldn't connect to the Neon database. It might be waking up from sleep, or there's a network block.</p>
        <form action={logout}>
          <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition w-full shadow-lg">
            Log Out & Return Home
          </button>
        </form>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="p-6 sm:p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-sm w-full max-w-lg mt-6 sm:mt-10 mx-auto">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Account Not Found</h2>
        <p className="text-slate-500 mb-6 text-xs sm:text-sm">Your browser has a session, but the database record is missing.</p>
        <form action={logout}>
          <button type="submit" className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition w-full shadow-lg">
            Clear Session & Restart
          </button>
        </form>
      </div>
    );
  }

  const connections = parent.connections || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Welcome Back, {parent.name}</h1>
        <p className="text-sm sm:text-base text-slate-500">Here is an overview of your active family circle.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Active Connections</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">{connections.length}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">👦</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Transactions</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">{totalTransactions}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">📜</div>
        </div>
      </div>

      <div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 sm:mb-4 mt-6 sm:mt-8">Your Linked Juniors</h3>
        
        {connections.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 border-dashed text-center">
            <p className="text-sm sm:text-base text-slate-500 mb-4">You haven't connected any juniors yet.</p>
            <Link href="/parent-dashboard/connect">
              <button className="w-full sm:w-auto bg-[#5f259f] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-purple-800 transition">
                Connect a Junior Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((conn) => (
              <div key={conn.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-base sm:text-lg text-slate-900">{conn.child.name}</p>
                  <p className="text-xs sm:text-sm text-slate-500">@{conn.child.username} • Daily Limit: ₹{conn.dailyLimit}</p>
                </div>
                <Link href={`/parent-dashboard/child/${conn.id}`} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition">
                    Manage Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}