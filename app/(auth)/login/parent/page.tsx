"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { authenticateParent } from "@/app/(auth)/actions";

export default function ParentLoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      // Capture the returned object from the server action
      const result = await authenticateParent(formData);
      
      if (result?.error) {
        // Display the specific error message on the screen
        setError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-[#5f259f] selection:text-white">
      <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md border-8 border-slate-800">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            👨‍👩‍👧
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Parent Portal</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">Enter your details to manage your family.</p>
        </div>
        
        {/* Switched to onSubmit to handle client-side errors */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ERROR DISPLAY */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="e.g. Ramesh Kumar" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:border-[#5f259f] focus:ring-1 focus:ring-[#5f259f] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
            <div className="flex gap-2">
              <span className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-500">
                +91
              </span>
              <input 
                type="tel" 
                name="phone" 
                required 
                maxLength={10}
                placeholder="9876543210" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:border-[#5f259f] focus:ring-1 focus:ring-[#5f259f] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">6-Digit Secure PIN</label>
            <input 
              type="password" 
              name="pin" 
              required 
              maxLength={6}
              placeholder="••••••" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-extrabold text-center tracking-[0.3em] text-slate-900 focus:outline-none focus:border-[#5f259f] focus:ring-1 focus:ring-[#5f259f] transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-2 text-center">First time logging in? This will become your permanent PIN.</p>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#5f259f] text-white font-bold py-4 rounded-xl shadow-[0_8px_20px_-6px_rgba(95,37,159,0.5)] hover:bg-purple-800 hover:-translate-y-0.5 transition-all duration-200 mt-4 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending ? "Authenticating..." : "Continue to Dashboard"}
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