import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Added flex-col for mobile stacking, flex-row for desktop sidebar
    <div className="min-h-[100dvh] bg-slate-50 md:bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Header (Hidden on Desktop) */}
      <header className="md:hidden bg-slate-900 text-slate-300 p-4 flex justify-between items-center shadow-md z-20">
        <div className="flex items-center gap-2 text-white">
          <span className="text-xl">👨‍👩‍👧</span>
          <span className="text-lg font-extrabold tracking-tight">Parent Suite</span>
        </div>
        <form action={logout}>
          <button type="submit" className="text-xs bg-slate-800 text-rose-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-700 transition">
            Log Out
          </button>
        </form>
      </header>
      
      {/* The Parent Sidebar (Hidden on Mobile, Visible on Desktop) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl">👨‍👩‍👧</span>
            <span className="text-xl font-extrabold tracking-tight">Parent Suite</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/parent-dashboard" className="block px-4 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition">
            Dashboard
          </Link>
          <Link href="/parent-dashboard/connect" className="block px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 hover:text-white transition">
            Connect Junior
          </Link>
          <Link href="/parent-dashboard/history" className="block px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 hover:text-white transition">
            Transaction History
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={logout}>
            <button type="submit" className="w-full text-left px-4 py-3 text-rose-400 font-semibold hover:bg-slate-800 rounded-lg transition">
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* The Main Content Area: Padding adjusted for mobile, added bottom padding to prevent nav overlap */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex justify-around items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href="/parent-dashboard" className="flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-600">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/parent-dashboard/connect" className="flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-600">
          <span className="text-xl">🔗</span>
          <span className="text-[10px] font-bold">Connect</span>
        </Link>
        <Link href="/parent-dashboard/history" className="flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-600">
          <span className="text-xl">📜</span>
          <span className="text-[10px] font-bold">History</span>
        </Link>
      </nav>

    </div>
  );
}