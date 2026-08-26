import Link from "next/link";
import { authenticateJunior } from "@/app/(auth)/actions";

export default function JuniorLoginPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-[#5f259f] selection:text-white">
      <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md border-8 border-slate-800">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            👦
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Junior Pass</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">Log in to check your allowance.</p>
        </div>
        
        {/* The Form connected directly to the Database Action */}
        <form action={authenticateJunior} className="space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="e.g. Rahul" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:border-[#5f259f] focus:ring-1 focus:ring-[#5f259f] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unique Username</label>
            <div className="flex gap-2">
              <span className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-500">
                @
              </span>
              <input 
                type="text" 
                name="username" 
                required 
                placeholder="rahul2026" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:border-[#5f259f] focus:ring-1 focus:ring-[#5f259f] transition-all lowercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">4-Digit App PIN</label>
            <input 
              type="password" 
              name="pin" 
              required 
              maxLength={4}
              pattern="\d{4}"
              placeholder="••••" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold tracking-[0.5em] text-center text-slate-900 focus:outline-none focus:border-[#5f259f] focus:ring-1 focus:ring-[#5f259f] transition-all"
            />
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 mt-4">
            Open Passbook
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition">
            ← Back to Role Selection
          </Link>
        </div>

      </div>
    </main>
  );
}