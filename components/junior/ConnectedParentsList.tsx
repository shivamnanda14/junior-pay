"use client";

import { useState } from "react";

interface ParentInfo {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
}

export default function ConnectedParentsList({ parents }: { parents: ParentInfo[] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [parentCode, setParentCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In Next.js 15, this API call manages the internal mutation to connect a parent.
      const res = await fetch("/api/junior/connect-parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentCode }),
      });
      if (res.ok) {
        setShowAddModal(false);
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to connect parent");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Connected Guardians</h2>
          <p className="text-xs text-slate-500">Only approved parents can authorize your payment requests.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>+</span> Add Parent
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {parents.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  {p.name}
                  {p.isPrimary && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Primary</span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500">{p.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Connect a New Parent</h3>
            <p className="text-xs text-slate-500 mb-4">Enter your parent's unique phone number.</p>
            <form onSubmit={handleConnect} className="space-y-4">
              <input
                type="text"
                placeholder="Parent Phone"
                value={parentCode}
                onChange={(e) => setParentCode(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50"
                >
                  {loading ? "Connecting..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}