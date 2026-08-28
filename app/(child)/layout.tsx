import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

export default function JuniorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Changed min-h-screen to min-h-[100dvh] to fix mobile browser address bar clipping
    <div className="min-h-[100dvh] bg-slate-900 flex justify-center items-center p-0 md:p-6 font-sans">
      
      {/* Mobile Device Frame: Forces full width/height on mobile, frames it on desktop */}
      <div className="w-full h-[100dvh] md:max-w-[420px] md:h-[840px] bg-slate-50 md:rounded-[44px] shadow-2xl flex flex-col overflow-hidden border-0 md:border-8 md:border-slate-800 relative">
        
        {/* Top App Header */}
       <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">👦</span>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl">Junior Pass</span>
          </div>
          <form action={logout}>
            <button type="submit" className="text-xs bg-slate-100 text-slate-600 font-semibold px-3 py-1.5 rounded-full hover:bg-slate-200 transition">
              Switch
            </button>
          </form>
        </header>

        {/* Scrollable Dynamic Content: Adjusted padding for mobile screens */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 pb-24">
          {children}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6 py-3 flex justify-around items-center z-20">
          <Link href="/junior-hub" className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#5f259f] transition">
            <span className="text-xl sm:text-2xl">💳</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">Pay</span>
          </Link>

          <Link href="/junior-hub/guardians" className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#5f259f] transition">
            <span className="text-xl sm:text-2xl">👨‍👩‍👧</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">Circle</span>
          </Link>

          <Link href="/junior-hub/history" className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#5f259f] transition">
            <span className="text-xl sm:text-2xl">📜</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">History</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}