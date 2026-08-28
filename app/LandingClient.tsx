"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  ShieldCheck, Smartphone, Users, QrCode, 
  CheckCircle, ArrowRight, Lock, Activity 
} from "lucide-react";

export default function LandingClient({ session }: { session: any }) {
  // Animation variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-[#5f259f] selection:text-white overflow-x-hidden">
      
      {/* Smart Sticky Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl hover:scale-110 transition-transform">💳</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Junior Pay</span>
        </div>
        <div className="flex items-center gap-6">
          <Link className="hidden md:block text-sm font-bold text-slate-500 hover:text-[#5f259f] transition" href="#network">
            Family Network
          </Link>
          <Link className="hidden md:block text-sm font-bold text-slate-500 hover:text-[#5f259f] transition" href="#how-it-works">
            How it Works
          </Link>
          <Link className="hidden md:block text-sm font-bold text-slate-500 hover:text-[#5f259f] transition" href="#features">
            Features
          </Link>
          
          {!session ? (
            <Link href="/login">
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-sm">
                Sign In
              </button>
            </Link>
          ) : (
            <Link href={session.role === "PARENT" ? "/parent-dashboard" : "/junior-hub"}>
              <button className="bg-[#5f259f] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-800 transition shadow-md flex items-center gap-2">
                {session.role === "PARENT" ? "👨‍👩‍👧 Parent Suite" : "👦 Junior Hub"}
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section with Floating UI */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] -z-10"></div>

        {/* Floating Transaction Chip 1 */}
        <motion.div 
          animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="hidden md:flex absolute left-10 top-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 items-center gap-3 z-10"
        >
          <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="text-green-600 w-5 h-5"/></div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">₹150 Approved</p>
            <p className="text-xs text-slate-500">at Burger King • by Mom</p>
          </div>
        </motion.div>

        {/* Floating Transaction Chip 2 */}
        <motion.div 
          animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="hidden md:flex absolute right-10 top-40 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 items-center gap-3 z-10"
        >
          <div className="bg-amber-100 p-2 rounded-full"><Activity className="text-amber-600 w-5 h-5"/></div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">₹400 Requested</p>
            <p className="text-xs text-slate-500">at Book Store • by Junior</p>
          </div>
        </motion.div>

        <motion.h1 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight relative z-20"
        >
          The smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5f259f] to-purple-600">allowance network</span> <br className="hidden md:block" /> for modern families.
        </motion.h1>
        
        <motion.p 
          initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl font-medium leading-relaxed"
        >
          Parents get complete control over spending limits. Juniors get the freedom to scan, request, and learn financial responsibility safely.
        </motion.p>

        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"
        >
          {!session && (
            <Link href="/login">
              <button className="w-full sm:w-auto bg-[#5f259f] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-[0_8px_20px_-6px_rgba(95,37,159,0.5)] hover:bg-purple-800 hover:-translate-y-1 transition-all duration-300">
                Get Started for Free
              </button>
            </Link>
          )}
          <Link href="#how-it-works">
            <button className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              See How It Works <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* The Family Network Node Section */}
      <section id="network" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Built for the Whole Family</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16">Connect multiple guardians to multiple children. Share the allowance management load instantly.</p>
          </motion.div>

          {/* Node Diagram */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="flex flex-col items-center justify-center relative"
          >
            {/* Parents Row */}
            <div className="flex gap-16 md:gap-32 relative z-10">
              <motion.div variants={fadeUp} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-xl border-4 border-slate-800 z-10">👨</div>
                <p className="mt-3 font-bold text-sm">Dad (Primary)</p>
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl shadow-xl border-4 border-slate-800 z-10">👩</div>
                <p className="mt-3 font-bold text-sm">Mom (Co-Guardian)</p>
              </motion.div>
            </div>

            {/* SVG Connecting Lines */}
            <svg className="absolute w-full h-48 top-12 left-0 -z-0 opacity-20 hidden md:block" preserveAspectRatio="none">
              <path d="M 35% 20 L 50% 120" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M 65% 20 L 50% 120" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            </svg>

            {/* Junior Row */}
            <div className="mt-12 relative z-10">
              <motion.div variants={fadeUp} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(168,85,247,0.4)] border-4 border-slate-800">👦</div>
                <p className="mt-3 font-bold text-sm">Junior</p>
                <div className="mt-2 bg-slate-800 rounded-full px-3 py-1 flex items-center gap-2 border border-slate-700">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-slate-300">₹500 Daily Limit</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Split Journey Section */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
          
          {/* Parent Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900 p-10 rounded-[40px] text-white overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mb-8 border border-slate-700">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold mb-4">The Parent Suite</h2>
              <p className="text-slate-400 mb-8 leading-relaxed max-w-md">You hold the keys. Approve payments on the go, set strict spending caps, and monitor exactly where allowance money goes.</p>
              
              {/* Mockup UI */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Daily Limit</span>
                  <span className="text-blue-400 font-bold">₹500</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-blue-500 rounded-full"></div>
                </div>
                <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition">Approve Payment</button>
              </div>
            </div>
          </motion.div>

          {/* Junior Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-purple-50 p-10 rounded-[40px] text-slate-900 overflow-hidden relative group border border-purple-100"
          >
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white text-[#5f259f] rounded-2xl flex items-center justify-center mb-8 border border-purple-100 shadow-sm">
                <QrCode className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold mb-4">The Junior Hub</h2>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-md">Experience digital payments safely. Scan merchant QRs, track your remaining allowance, and build money habits.</p>
              
              {/* Mockup UI */}
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center"><QrCode className="text-white w-6 h-6"/></div>
                  <div>
                    <p className="font-bold text-slate-900">Scan Any Store QR</p>
                    <p className="text-xs text-slate-500">UPI powered by Parents</p>
                  </div>
                </div>
                <button className="w-full bg-[#5f259f] text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-800 transition">Open Scanner</button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Step-by-Step Flow */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-4">How It All Works</motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">From setup to the first successful payment, here is the exact flow.</motion.p>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-800 z-0 rounded-full"></div>

            {[
              { step: 1, title: "Parent Sets Up", desc: "Parent logs in and generates a secure connection code locked to the junior's username." },
              { step: 2, title: "Junior Connects", desc: "Junior enters the code. Accounts are instantly linked with specific spending limits." },
              { step: 3, title: "Junior Scans", desc: "At a shop, the junior scans a QR code, enters the amount, and taps 'Send Request'." },
              { step: 4, title: "Parent Approves", desc: "Parent sees the request details and approves it. The payment is finalized immediately." }
            ].map((item) => (
              <motion.div variants={fadeUp} key={item.step} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold mb-6 border-4 border-slate-900 group-hover:bg-[#5f259f] group-hover:border-purple-400 transition-all duration-300 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm px-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Safety Features Grid */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Built for Absolute Security.</h2>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: Lock, title: "No Bank Access", desc: "Juniors never touch the actual bank account or UPI PIN. They only generate secure requests." },
              { icon: Smartphone, title: "Rolling Limits", desc: "Limits automatically reset daily at midnight or on the 1st of every month based on parent settings." },
              { icon: Users, title: "Strict Identity Locks", desc: "Connection codes are cryptographically locked to exact usernames, preventing unauthorized links." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-purple-50 text-[#5f259f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#5f259f] group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <span className="font-bold text-slate-900">Junior Pay</span>
          </div>
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Junior Pay. Designed for family finance.</p>
        </div>
      </footer>
    </main>
  );
}