import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ScanForm from "./ScanForm";
import QRScanner from "./QRScanner";

type PageProps = {
  searchParams: Promise<{ manual?: string; vpa?: string; name?: string }>;
};

export default async function JuniorScanPage({ searchParams }: PageProps) {
  const session = await getCurrentUser();
  if (!session) return null;

  const resolvedParams = await searchParams;
  const isManual = resolvedParams.manual === "true";
  const defaultVpa = resolvedParams.vpa || "";
  const defaultName = resolvedParams.name || "";

  const connections = await prisma.childConnection.findMany({
    where: { childId: session.userId },
    include: { parent: true },
  });

  return (
    // Added w-full and px-4 for mobile edge spacing
    <div className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto px-2 sm:px-4 pb-10">
      <Link href="/junior-hub" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition inline-block">
        ← Back to Hub
      </Link>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
          {isManual ? "Complete Payment Request" : "Scan Merchant QR"}
        </h2>
        <p className="text-xs text-slate-500">
          {isManual 
            ? "Verify details, select purpose, and enter your security PIN." 
            : "Point your camera at any store UPI QR code to scan."}
        </p>
      </div>

      {connections.length === 0 ? (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-rose-200 text-center space-y-3 mx-2 sm:mx-0">
          <p className="text-sm font-bold text-slate-800">No Guardians Connected</p>
          <p className="text-xs text-slate-500">You need at least one linked parent to request payment approvals.</p>
        </div>
      ) : isManual ? (
        <ScanForm 
          connections={connections} 
          defaultName={defaultName} 
          defaultVpa={defaultVpa} 
          isManual={isManual} 
        />
      ) : (
        <div className="space-y-4">
          <QRScanner />
          
          <div className="text-center">
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="mt-3">
              <Link 
                href="/junior-hub/scan?manual=true" 
                className="inline-block w-full sm:w-auto bg-slate-100 text-slate-800 px-6 py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
              >
                Enter UPI ID Manually Instead
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}