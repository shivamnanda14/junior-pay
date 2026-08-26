import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* The Parent Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
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

        {/* The Working Logout Form */}
        <div className="p-4 border-t border-slate-800">
          <form action={logout}>
            <button type="submit" className="w-full text-left px-4 py-3 text-rose-400 font-semibold hover:bg-slate-800 rounded-lg transition">
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* The Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}