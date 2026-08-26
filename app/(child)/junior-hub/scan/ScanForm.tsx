"use client";

import { useState, useActionState } from "react";
import { createPaymentRequest } from "./actions";

type ActionState = {
  error: string | null;
};

export default function ScanForm({
  connections,
  defaultName,
  defaultVpa,
  isManual,
}: {
  connections: any[];
  defaultName: string;
  defaultVpa: string;
  isManual: boolean;
}) {
  const [selectedReason, setSelectedReason] = useState("📚 Stationery & Books");

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prevState: ActionState, formData: FormData) => {
      const res = await createPaymentRequest(formData);
      return res || { error: null };
    },
    { error: null }
  );

  const commonReasons = [
    "📚 Stationery & Books",
    "🍔 Food & Snacks",
    "🚌 Transport / Travel",
    "💻 Project Expenses",
    "⚡ Emergency Utility",
    "🔄 Other (Specify)",
  ];

  return (
    <form action={formAction} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      
      {/* Friendly Error Banner on Screen */}
      {state?.error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* Merchant Name */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Merchant / Store Name</label>
        <input 
          type="text" 
          name="merchantName" 
          defaultValue={defaultName}
          placeholder="e.g., Sharma General Store" 
          required 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 text-sm focus:outline-none focus:border-[#5f259f]"
        />
      </div>

      {/* Merchant UPI ID / VPA */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Merchant UPI ID (VPA)</label>
        <input 
          type="text" 
          name="merchantVpa" 
          defaultValue={defaultVpa}
          placeholder="e.g., merchant@oksbi" 
          required 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 text-sm focus:outline-none focus:border-[#5f259f]"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount (₹)</label>
        <input 
          type="number" 
          step="0.01"
          name="amount" 
          placeholder="0.00" 
          required 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-extrabold text-slate-900 text-lg focus:outline-none focus:border-[#5f259f]"
        />
      </div>

      {/* Payment Reason Selection */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Purpose of Payment</label>
        <select 
          name="reason" 
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 text-sm focus:outline-none focus:border-[#5f259f] mb-2"
        >
          {commonReasons.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>

        {selectedReason === "🔄 Other (Specify)" && (
          <div className="mt-2">
            <input 
              type="text" 
              name="customNote" 
              placeholder="Please specify why you need this payment (Required)..." 
              className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {/* Select Guardian Dropdown */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Request Approval From</label>
        <select 
          name="parentId" 
          required 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 text-sm focus:outline-none focus:border-[#5f259f]"
        >
          <option value="">Select a Guardian...</option>
          {connections.map((conn) => (
            <option key={conn.id} value={conn.parentId}>
              {conn.parent.name} (Limit: ₹{conn.dailyLimit})
            </option>
          ))}
        </select>
      </div>

      {/* Security PIN Field */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Enter Your 4-Digit Login PIN to Confirm</label>
        <input 
          type="password" 
          maxLength={4}
          name="pin" 
          placeholder="••••" 
          required 
          autoComplete="new-password"
          autoCorrect="off"
          spellCheck="false"
          data-lpignore="true"
          className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 font-mono font-extrabold text-center tracking-widest text-slate-900 text-lg focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-[#5f259f] text-white py-4 rounded-xl font-bold hover:bg-purple-800 transition shadow-lg mt-2 disabled:opacity-50"
      >
        {isPending ? "Validating..." : "Authorize & Send Request"}
      </button>
    </form>
  );
}