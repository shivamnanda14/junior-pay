import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md border-8 border-slate-800">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            💳
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Junior Pay</h1>
          <p className="text-slate-500 font-medium mt-2">The smart allowance network.</p>
        </div>
        
        {/* Role Selection Buttons */}
        <div className="space-y-4">
          
          {/* Routes to the Parent Login Portal */}
          <Link href="/login/parent" className="block w-full">
            <button className="w-full bg-[#5f259f] text-white font-bold py-4 rounded-xl shadow-[0_8px_20px_-6px_rgba(95,37,159,0.5)] hover:bg-purple-800 hover:-translate-y-0.5 transition-all duration-200">
              Login as Parent
            </button>
          </Link>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold tracking-wider">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Routes to the Junior Login Portal */}
          <Link href="/login/junior" className="block w-full">
            <button className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
              Login as Junior
            </button>
          </Link>
          
        </div>

      </div>
    </main>
  );
}