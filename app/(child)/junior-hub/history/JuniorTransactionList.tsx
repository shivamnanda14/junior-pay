"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JuniorTransactionList({ transactions }: { transactions: any[] }) {
  const router = useRouter();
  const [now, setNow] = useState(new Date().getTime());

  // Auto-refresh ticker: updates timers every second and polls the server every 4 seconds for payment updates
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);

    const pollInterval = setInterval(() => {
      router.refresh();
    }, 4000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(pollInterval);
    };
  }, [router]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm mt-10">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Transactions Yet</h3>
        <p className="text-xs text-slate-500">Scan a QR code to make your first payment request.</p>
      </div>
    );
  }

  const FIVE_MINUTES = 5 * 60 * 1000;

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const txTime = new Date(tx.createdAt).getTime();
        const age = now - txTime;
        const isExpired = tx.status === 'PENDING' && age > FIVE_MINUTES;
        
        const timeLeft = Math.max(0, FIVE_MINUTES - age);
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const timerDisplay = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        let displayStatus = tx.status;
        if (isExpired) displayStatus = 'EXPIRED';

        return (
          <div 
            key={tx.id} 
            className={`bg-white p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-opacity duration-300 ${
              isExpired ? 'border-slate-200 opacity-60' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">🏪</div>
              <div>
                <p className="font-bold text-slate-900 text-sm truncate max-w-[160px]">
                  {tx.merchantName || "Unknown Merchant"}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                  To: {tx.parent?.name || "Parent"}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-slate-900">₹{tx.amount.toFixed(2)}</p>
              
              {displayStatus === 'PENDING' && (
                <div className="flex flex-col items-end">
                  <p className="text-xs font-bold text-orange-500">Pending</p>
                  <p className="text-[10px] font-bold text-orange-400 mt-0.5" suppressHydrationWarning>
                    ⏳ {timerDisplay}
                  </p>
                </div>
              )}
              
              {(displayStatus === 'APPROVED' || displayStatus === 'APPROVED_AND_PAID') && (
                <p className="text-xs font-bold text-green-600">Paid</p>
              )}
              {(displayStatus === 'DECLINED' || displayStatus === 'DECLINED_BY_PARENT') && (
                <p className="text-xs font-bold text-rose-600">Declined</p>
              )}
              {displayStatus === 'EXPIRED' && (
                <p className="text-xs font-bold text-slate-400">Expired</p>
              )}
              {displayStatus === 'TIMEOUT_MERCHANT' && (
                <p className="text-xs font-bold text-slate-400">Timeout</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}