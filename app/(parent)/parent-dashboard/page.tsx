import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions"; // Allows us to use the logout action

export default async function ParentDashboardPage() {
  const session = await getCurrentUser();
  
  // 1. Guarantee the session exists
  if (!session) return null;
  
  let parent = null;
  let totalTransactions = 0;

  // 2. THE SAFETY NET: Try to connect to the database
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
    // 🚨 IF LINE 13 CRASHES (Database Timeout), THIS RUNS INSTEAD OF CRASHING THE APP
    console.error("Database connection failed:", error);
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-sm max-w-lg mt-10 mx-auto">
        <div className="text-4xl mb-4">🔌</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Database Connection Timeout</h2>
        <p className="text-slate-500 mb-6 text-sm">We couldn't connect to the Neon database. It might be waking up from sleep, or there's a network block.</p>
        <form action={logout}>
          <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition w-full shadow-lg">
            Log Out & Return Home
          </button>
        </form>
      </div>
    );
  }

  // 3. IF THE USER WAS DELETED FROM DB MANUALLY
  if (!parent) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-sm max-w-lg mt-10 mx-auto">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">Your browser has a session, but the database record is missing.</p>
        <form action={logout}>
          <button type="submit" className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition w-full shadow-lg">
            Clear Session & Restart
          </button>
        </form>
      </div>
    );
  }

  // Safely extract connections
  const connections = parent.connections || [];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back, {parent.name}</h1>
        <p className="text-slate-500">Here is an overview of your active family circle.</p>
      </div>
      
      {/* Real Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Active Connections</p>
            <p className="text-4xl font-extrabold text-slate-900">{connections.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👦</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Transactions</p>
            <p className="text-4xl font-extrabold text-slate-900">{totalTransactions}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">📜</div>
        </div>
      </div>

      {/* Connected Juniors List */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 mt-8">Your Linked Juniors</h3>
        
        {connections.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed text-center">
            <p className="text-slate-500 mb-4">You haven't connected any juniors yet.</p>
            <Link href="/parent-dashboard/connect">
              <button className="bg-[#5f259f] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-purple-800 transition">
                Connect a Junior Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((conn) => (
              <div key={conn.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-slate-900">{conn.child.name}</p>
                  <p className="text-sm text-slate-500">@{conn.child.username} • Daily Limit: ₹{conn.dailyLimit}</p>
                </div>
                <Link href={`/parent-dashboard/child/${conn.id}`}>
  <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition">
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