import { generateInviteCode } from "./actions";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function ParentConnectPage() {
  const user = await getCurrentUser();
  
  const activeCodes = await prisma.inviteCode.findMany({
    where: { 
      parentId: user?.userId,
      isUsed: false,
      expiresAt: { gt: new Date() } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    // Max-w restriction and padding for edge constraints
    <div className="w-full max-w-2xl mx-auto px-1 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Connect a Junior</h1>
      <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">Generate a secure 6-digit code for a specific Junior username.</p>

      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-6 sm:mb-8">
        <form action={generateInviteCode} className="space-y-4">
          {/* Stacked grid for mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-2">Junior's Username</label>
              <div className="flex gap-2">
                <span className="bg-slate-100 border border-slate-200 rounded-xl px-3 sm:px-4 py-3 font-bold text-slate-500 flex items-center justify-center">@</span>
                <input type="text" name="childUsername" required placeholder="rohan2026" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-medium text-slate-900 focus:border-[#5f259f] outline-none lowercase text-sm sm:text-base" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-2">Daily Limit (₹)</label>
              <input type="number" name="dailyLimit" required defaultValue="500" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-medium text-slate-900 focus:border-[#5f259f] outline-none text-sm sm:text-base" />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-white px-6 py-3 sm:py-4 rounded-xl font-bold hover:bg-slate-800 transition mt-2 text-sm sm:text-base shadow-sm">
            Generate Secure Code
          </button>
        </form>
      </div>

      {activeCodes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Active Codes</h3>
          {activeCodes.map((invite) => (
            // Flex column on mobile to prevent the large pin from overflowing
            <div key={invite.id} className="bg-purple-50 p-4 sm:p-6 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-center sm:text-left">
              <div>
                <p className="text-xs sm:text-sm font-bold text-purple-900">Locked to: @{invite.childName}</p>
                <p className="text-[10px] sm:text-xs text-purple-600">Daily Limit: ₹{invite.dailyLimit}</p>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#5f259f] tracking-[0.2em] sm:tracking-[0.2em]">
                {invite.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}