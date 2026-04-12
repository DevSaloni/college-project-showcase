"use client";

import { useState } from "react";
import axios from "axios";
import { useApi } from "@/context/ApiContext";
import { Mail, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const { BASE_URL } = useApi();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your university email");
      return;
    }

    setLoading(true);
    const loadId = toast.loading("Sending reset link...");

    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      toast.success("Reset link transmitted! Check your inbox.", { id: loadId });
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Transmission failed!", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] relative overflow-hidden px-4 font-['Poppins',_sans-serif]">
      
      {/* Premium Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--pv-accent)]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <ShieldCheck size={14} className="text-[var(--pv-accent)]" />
            <span className="text-[10px] uppercase font-black tracking-widest text-white/60">Account Security</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Recover Shield</h1>
          <p className="text-white/40 text-sm font-medium">Enter your email to restore your project hub access</p>
        </div>

        {/* Central Glass Card */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--pv-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">university email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-[var(--pv-accent)] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-white/[0.05] transition-all shadow-inner"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))] text-black font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[var(--pv-accent)]/20 hover:shadow-[var(--pv-accent)]/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-bold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Send Reset Link <Sparkles size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-white/40 hover:text-[var(--pv-accent)] transition-all font-bold text-xs uppercase tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
