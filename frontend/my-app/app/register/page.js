"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, UserCircle, LayoutDashboard, ArrowRight, ShieldCheck, Cpu, ChevronDown, Check } from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function RegisterPage() {
  const router = useRouter();
  const { BASE_URL } = useApi();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const roles = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher / Mentor" },
    { value: "recruiter", label: "Industry Recruiter" },
    { value: "admin", label: "System Admin" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleSelect = (roleValue) => {
    setFormData({ ...formData, role: roleValue });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateForm = () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      toast.error("All identifiers are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Valid university email is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password requires minimum 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const loadId = toast.loading("Establishing credentials...");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, formData);
      toast.success("Profile successfully established!", { id: loadId });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data?.user?.role || res.data?.role || "student");

      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration sequence failed!", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#000000] overflow-hidden font-['Poppins',_sans-serif]">
      {/* Left Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-12 relative pt-[72px] lg:border-r lg:border-white/5">
        <div className="w-full max-w-lg py-4">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-white/50 text-xs">Register your academic identity to begin</p>
          </div>
 
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name + Email in a 2-column row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30 group-focus-within:text-[var(--pv-accent)] transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="w-full pl-11 pr-4 py-3 bg-[#0b1424] border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-[#0f1a2e] transition-all"
                  />
                </div>
              </div>
 
              {/* Email */}
              
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
            </div>
 
            {/* CUSTOM DROPDOWN */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Academic Role</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between pl-11 pr-4 py-3 bg-[#0b1424] border rounded-xl text-white text-sm transition-all relative ${isDropdownOpen ? "border-[var(--pv-accent)]/50 focus:ring-1 focus:ring-[var(--pv-accent)]/50" : "border-white/10"
                  }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <Cpu size={16} className={isDropdownOpen ? "text-[var(--pv-accent)]" : ""} />
                </div>
                <span className={formData.role ? "text-white" : "text-white/20"}>
                  {roles.find(r => r.value === formData.role)?.label || "Select Role"}
                </span>
                <ChevronDown size={14} className={`text-white/30 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
 
              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full p-2 bg-[#000000] border border-white/10 rounded-xl shadow-2xl z-[150] animate-in fade-in zoom-in-95 duration-200">
                  {roles.map((roleOpt) => (
                    <button
                      key={roleOpt.value}
                      type="button"
                      onClick={() => handleRoleSelect(roleOpt.value)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all mb-1 last:mb-0 ${formData.role === roleOpt.value
                        ? "bg-[linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))] text-black font-bold shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {roleOpt.label}
                      {formData.role === roleOpt.value && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
 
            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Secure Password</label>
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
                  autoComplete="new-password"
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
 
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-[linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))] text-black font-extrabold text-sm rounded-xl shadow-lg shadow-[var(--pv-accent)]/20 hover:shadow-[var(--pv-accent)]/30 hover:translate-y-[-1px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Establish Identity
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
 
          <div className="mt-8 text-center">
            <p className="text-white/40 text-[11px] mb-2 font-medium uppercase tracking-[0.2em]">Already have an account?</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[var(--pv-accent)] transition-colors group"
            >
              Sign into Secure Terminal
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
 
      {/* Right Side: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#000000] items-center justify-start px-8 sm:px-12 lg:px-16 xl:px-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#000000] via-[#000000]/70 to-[var(--pv-accent)]/20 shadow-inner" />
 
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--pv-accent)]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
 
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <UserCircle size={14} className="text-[var(--pv-accent)]" />
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Identity Verification</span>
          </div>
 
          <h1 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.1]">
            Start Your<br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))]">
              Project Journey
            </span>
          </h1>
 
          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-md">
            Create your account to start managing your semester projects, collaborate with your team and teachers, and stay organized throughout your project work.
          </p>
        </div>
      </div>
    </div>
  );
}
