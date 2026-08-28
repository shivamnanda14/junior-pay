"use client";

import { useState, useTransition } from "react";
import { linkGuardian } from "./actions";

export default function ConnectGuardianModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("code", code);

    startTransition(async () => {
      // Capture the returned object from the server action
      const result = await linkGuardian(formData);
      
      if (result?.error) {
        // Display the specific error message from the backend
        setError(result.error);
      } else {
        setIsOpen(false);
        setCode("");
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 bg-slate-100 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-200 transition border-dashed"
      >
        + Link Another Guardian
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Enter 6-Digit Code</h3>
            <p className="text-xs text-slate-500 mb-4">Ask your parent to generate a secure code from their Parent Suite.</p>
            
            <form onSubmit={handleConnect} className="space-y-4">
              {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-lg font-medium">{error}</p>}
              
              <input 
                type="text" 
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-extrabold text-center tracking-[0.3em] text-slate-900 focus:outline-none focus:border-[#5f259f]"
                required
              />
              
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsOpen(false);
                    setError("");
                  }}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPending || code.length < 6}
                  className="flex-1 py-3 bg-[#5f259f] text-white font-bold rounded-xl text-sm disabled:opacity-50"
                >
                  {isPending ? "Linking..." : "Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}