"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LayoutDashboard, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { useApi } from "@/context/ApiContext";

const LoginPage = () => {
  const router = useRouter();
  const { BASE_URL } = useApi();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Valid email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const loadId = toast.loading("Authenticating...");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      toast.success("Login successful!", { id: loadId });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data?.user?.role || res.data?.role || "student");
      localStorage.setItem("userName", res.data?.user?.name || res.data?.name || "");
      localStorage.setItem("userEmail", res.data?.user?.email || res.data?.email || "");

      window.dispatchEvent(new Event("login-status"));
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed!", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#020712] overflow-hidden font-['Poppins',_sans-serif]">
      {/* Left Side: Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050A16] items-center justify-center p-12 overflow-hidden border-r border-white/5">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020712] via-[#020712]/70 to-[var(--pv-accent)]/20 shadow-inner" />

        {/* Subtle dynamic background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--pv-accent)]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <ShieldCheck size={14} className="text-[var(--pv-accent)]" />
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Secure Access Terminal</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.1]">
            Continue Your  <br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))]">
              Project Journey
            </span>
          </h1>

          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-md">
            Access your college workspace to manage semester projects, work with your team and teachers, and keep track of your progress in one place.          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-sm">
          {/* Mobile Logo (visible only on lg:hidden) */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.95" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Project<span className="text-[var(--pv-accent)]">Vault</span></h2>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/50 text-xs">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">University Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30 group-focus-within:text-[var(--pv-accent)] transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-[#0b1424] border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-[#0f1a2e] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Secure Password</label>
                <Link href="/forgot-password" size={10} className="text-[10px] text-[var(--pv-accent)] hover:text-[var(--pv-accent-2)] transition-colors font-medium">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30 group-focus-within:text-[var(--pv-accent)] transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 bg-[#0b1424] border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-[#0f1a2e] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-[var(--pv-accent)] focus:ring-offset-0 focus:ring-1 focus:ring-[var(--pv-accent)] cursor-pointer appearance-none checked:bg-[var(--pv-accent)] border transition-all"
                />
                <ShieldCheck size={10} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <label htmlFor="remember" className="text-[11px] text-white/40 cursor-pointer hover:text-white/60 transition-colors">Keep me signed in on this device</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))] text-black font-extrabold text-sm rounded-xl shadow-lg shadow-[var(--pv-accent)]/20 hover:shadow-[var(--pv-accent)]/30 hover:translate-y-[-1px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-[11px] mb-2 font-medium uppercase tracking-[0.2em]">New here?</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[var(--pv-accent)] transition-colors group"
            >
              Create Platform Identity
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;