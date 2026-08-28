import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

export default async function Navbar() {
  const session = await getCurrentUser();

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      {/* Keep your existing logo and static links here */}
      <Link href="/" className="font-bold text-xl">JuniorPay</Link>

      <div className="flex gap-4">
        <Link href="/features">Features</Link>
        <Link href="/how-it-works">How it Works</Link>
        
        {/* Dynamic Auth Button */}
        {!session ? (
          <Link href="/login" className="bg-[#5f259f] text-white px-4 py-2 rounded-lg">
            Sign In
          </Link>
        ) : session.role === "PARENT" ? (
          <Link href="/parent-dashboard" className="bg-slate-900 text-white px-4 py-2 rounded-lg">
            Parent Suite
          </Link>
        ) : (
          <Link href="/junior-hub" className="bg-[#5f259f] text-white px-4 py-2 rounded-lg">
            Junior Hub
          </Link>
        )}
      </div>
    </nav>
  );
}