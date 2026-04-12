"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Lock, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useApi } from "@/context/ApiContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const { BASE_URL } = useApi();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a new secure password");
      return;
    }

    setLoading(true);
    const loadId = toast.loading("Updating security credentials...");

    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Security reset success! Redirecting...", { id: loadId });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || "Credential update failed!", { id: loadId });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] relative overflow-hidden px-4 font-['Poppins',_sans-serif]">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--pv-accent)]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Lock size={14} className="text-[var(--pv-accent)]" />
            <span className="text-[10px] uppercase font-black tracking-widest text-white/60">Digital Key Reset</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">New Credentials</h1>
          <p className="text-white/40 text-sm font-medium">Re-establish your connection with a new password</p>
        </div>

        {/* Central Glass Card */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--pv-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">New secure password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-[var(--pv-accent)] transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-white/[0.05] transition-all shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Establish Access <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em]">Ensure your password contains at least 8 characters</p>
        </div>
      </div>
    </div>
  );
}
