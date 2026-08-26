import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-[#5f259f] selection:text-white">
      
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl">💳</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Junior Pay</span>
        </div>
        <div className="flex items-center gap-4">
          <Link className="hidden md:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition" href="#how-it-works">
            How it Works
          </Link>
          <Link href="/login">
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-sm">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
          The smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5f259f] to-purple-600">allowance network</span> <br className="hidden md:block" /> for modern families.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Parents get complete control over spending limits. Juniors get the freedom to scan, request, and learn financial responsibility safely.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <button className="w-full sm:w-auto bg-[#5f259f] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-[0_8px_20px_-6px_rgba(95,37,159,0.5)] hover:bg-purple-800 hover:-translate-y-0.5 transition-all">
              Get Started for Free
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 hover:shadow-sm transition-all">
              See How It Works
            </button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything a family needs.</h2>
            <p className="text-slate-500 mt-4">Built for safety, designed for independence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-6">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Absolute Control</h3>
              <p className="text-slate-500 leading-relaxed">Set daily limits and approve every transaction before the money leaves your bank account. No surprises.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-6">📱</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real UPI Scanning</h3>
              <p className="text-slate-500 leading-relaxed">Juniors scan any merchant QR code just like a standard UPI app. We seamlessly route the request to the parent.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl mb-6">🔗</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Parent Support</h3>
              <p className="text-slate-500 leading-relaxed">Connect multiple guardians to a single child, or manage multiple children from one parent dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold">How Junior Pay Works</h2>
            <p className="text-slate-400 mt-4">Three simple steps to financial freedom.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-800 z-0"></div>

            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-[#5f259f] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-[0_0_30px_rgba(95,37,159,0.5)] border-4 border-slate-900">1</div>
              <h3 className="text-xl font-bold mb-3">Link Devices</h3>
              <p className="text-slate-400 text-sm px-4">The parent generates a secure 6-digit code. The junior enters it to instantly link their accounts.</p>
            </div>

            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-4 border-slate-900">2</div>
              <h3 className="text-xl font-bold mb-3">Scan & Request</h3>
              <p className="text-slate-400 text-sm px-4">The junior scans a QR code at any local store. The app sends a real-time notification to the parent.</p>
            </div>

            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-4 border-slate-900">3</div>
              <h3 className="text-xl font-bold mb-3">Approve & Pay</h3>
              <p className="text-slate-400 text-sm px-4">The parent reviews the merchant name and amount, clicks approve, and the payment completes instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <span className="font-bold text-slate-900">Junior Pay</span>
          </div>
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Junior Pay. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}