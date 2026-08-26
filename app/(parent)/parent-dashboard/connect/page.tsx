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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Connect a Junior</h1>
      <p className="text-slate-500 mb-8">Generate a secure 6-digit code for a specific Junior username.</p>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <form action={generateInviteCode} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Junior's Username</label>
              <div className="flex gap-2">
                <span className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-500">@</span>
                <input type="text" name="childUsername" required placeholder="rohan2026" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:border-[#5f259f] outline-none lowercase" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Daily Limit (₹)</label>
              <input type="number" name="dailyLimit" required defaultValue="500" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:border-[#5f259f] outline-none" />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition mt-2">
            Generate Secure Code
          </button>
        </form>
      </div>

      {activeCodes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Codes</h3>
          {activeCodes.map((invite) => (
            <div key={invite.id} className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-purple-900">Locked to: @{invite.childName}</p>
                <p className="text-xs text-purple-600">Daily Limit: ₹{invite.dailyLimit}</p>
              </div>
              <div className="text-4xl font-extrabold text-[#5f259f] tracking-[0.2em]">
                {invite.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}