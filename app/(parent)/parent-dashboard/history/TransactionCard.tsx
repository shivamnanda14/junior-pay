"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function TransactionCard({ transaction }: { transaction: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!transaction?.createdAt) return;

    const expiryTime = new Date(transaction.createdAt).getTime() + 5 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setIsExpired(true);
      } else {
        setTimeLeft(distance);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction]);

  if (!transaction) return null;

  const minutes = timeLeft !== null ? Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)) : 5;
  const seconds = timeLeft !== null ? Math.floor((timeLeft % (1000 * 60)) / 1000) : 0;
  const timerDisplay = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await fetch(`/api/transactions/${transaction.id}/decline`, { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Failed to decline:", error);
      setIsDeclining(false);
    }
  };

  const handleApproveAndPay = async () => {
    setIsProcessing(true);
    try {
      // Send the amount directly in the request body
      const response = await fetch(`/api/transactions/${transaction.id}/approve`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: transaction.amount })
      });
      
      const data = await response.json();

      if (!response.ok || !data.orderId) {
        alert(`Backend Error: ${data.error || "Failed to create order"}`);
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: data.amount, // This will now correctly be transaction.amount * 100
        currency: "INR",
        name: "Junior Pass",
        description: `Payment for Order`,
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch(`/api/transactions/${transaction.id}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (verifyRes.ok) {
            alert("Payment Successful! Junior has been updated.");
            router.refresh();
          } else {
            alert("Payment verification failed.");
            setIsProcessing(false);
          }
        },
        theme: { color: "#5f259f" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Network error: Could not reach the server.");
      setIsProcessing(false);
    }
  };
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className={`border bg-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm mb-4 gap-4 transition-all ${isExpired ? 'border-slate-200 opacity-60' : 'border-orange-400'}`}>
        <div>
          <p className="text-xs text-gray-500 mb-1" suppressHydrationWarning>
            From: <span className="font-bold">rohan</span> &nbsp; 
            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString() : "Just now"}
          </p>
          <p className="font-bold text-gray-900 text-lg">
            ₹{transaction.amount} <span className="font-normal text-sm">at {transaction.merchantName || "Unknown Merchant"}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">UPI ID: {transaction.merchantVpa || "N/A"}</p>
          
          {!isExpired ? (
            <p className="text-xs font-bold text-orange-600 mt-2 flex items-center gap-1">
              ⏳ Expires in {timerDisplay}
            </p>
          ) : (
            <p className="text-xs font-bold text-red-500 mt-2">❌ Request Expired</p>
          )}
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={handleDecline}
            disabled={isDeclining || isProcessing || isExpired}
            className="flex-1 sm:flex-none bg-slate-100 text-slate-600 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 transition"
          >
            {isDeclining ? "..." : "Decline"}
          </button>
          <button 
            onClick={handleApproveAndPay}
            disabled={isProcessing || isDeclining || isExpired}
            className="flex-1 sm:flex-none bg-[#5f259f] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-purple-800 disabled:opacity-50 shadow-md transition"
          >
            {isProcessing ? "Processing..." : isExpired ? "Expired" : "Approve & Pay"}
          </button>
        </div>
      </div>
    </>
  );
}