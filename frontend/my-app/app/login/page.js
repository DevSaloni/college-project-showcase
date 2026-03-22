"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useApi } from "@/context/ApiContext";

const LoginPage = () => {
  const router = useRouter();

  const { BASE_URL } = useApi();

  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData);

      alert("Login successful!");
      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data?.user?.role || res.data?.role || "student");
      localStorage.setItem("userName", res.data?.user?.name || res.data?.name || "");
      localStorage.setItem("userEmail", res.data?.user?.email || res.data?.email || "");


      window.dispatchEvent(new Event("login-status"));

      //reset form
      setFormData({
        email: "",
        password: "",
      });

      router.push("/");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed!");
    }
  };


  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#071426,#020712)] flex items-center justify-center px-6 py-12">

      {/* Left info panel for large screens */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-start pr-12">
        <div className="max-w-sm">
          <h1 className="text-4xl font-extrabold text-white">Welcome back</h1>
          <p className="mt-4 text-white/70">Sign in to access your projects, messages, and opportunities.</p>

          <ul className="mt-6 space-y-3 text-white/80">
            <li className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="text-sm">Fast sign in</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="text-sm">Secure profiles</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="text-sm">Connect with recruiters</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right form card */}
      <div className="w-full lg:w-1/2 flex justify-center pt-10">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 backdrop-blur-3xl shadow-[0_20px_60px_rgba(2,6,23,0.7)] relative z-10">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.95" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
              <p className="text-white/70 text-sm">Login to continue your journey</p>
            </div>
          </div>

          <form autoComplete="on" className="mt-6 grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm text-white/70">Email address</span>
              <input name="email"
                autoComplete="new-email"
                type="email" placeholder="you@college.edu"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 bg-white/6 border border-white/8 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-(--pv-accent) focus:border-(--pv-accent) transition" />
            </label>

            <label className="block relative">
              <span className="text-sm text-white/70">Password</span>
              <input
                name="password"
                autoComplete="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 bg-white/6 border border-white/8 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-(--pv-accent) focus:border-(--pv-accent) transition" />
              <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-[76%] -translate-y-1/2 text-white/60">{showPassword ? '🙈' : '👁️'}</button>
            </label>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-white/70 text-sm">
                <input type="checkbox" name="remember" className="w-4 h-4 rounded bg-white/6" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-(--pv-accent) text-sm hover:underline">Forgot?</Link>
            </div>

            <button type="submit" className="mt-2 w-full py-3 rounded-xl text-white font-semibold shadow-lg" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>Sign in</button>
          </form>

          <p className="text-center text-white/70 mt-4 text-sm">Don't have an account? <Link href="/register" className="text-(--pv-accent) hover:underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;