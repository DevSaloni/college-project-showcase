"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "axios";

import { useApi } from "@/context/ApiContext";

export default function RegisterPage() {
  const router = useRouter();

  const {BASE_URL} = useApi();

const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
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
      const res = await axios.post(`${BASE_URL}/api/auth/register`, formData);

      alert("Registration successful!");
      localStorage.setItem("token", res.data.token);   
localStorage.setItem("role", res.data?.user?.role || res.data?.role || "student");
      
      console.log(res.data);

      //reset form
      setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
    });

    router.push("/login");


    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(180deg,#071426,#020712)] flex flex-col lg:flex-row items-start justify-start px-2 pt-20 pb-20">
      
      {/* Left panel for large screens */}
      <div className="hidden lg:flex lg:items-start lg:justify-end lg:w-1/2 pr-29 pt-14">
        <div className="max-w-md text-left mt-0">
          <h1 className="text-4xl font-extrabold text-white leading-tight">Welcome to ProjectVista</h1>
          <p className="mt-4 text-white/70">
            Showcase your college projects, get mentorship, and connect with recruiters — all in one professional space.
          </p>
          <ul className="mt-6 space-y-3 text-white/80">
            <li className="flex items-center gap-3 justify-start">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-sm">Verified mentor feedback</span>
            </li>
            <li className="flex items-center gap-3 justify-start">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-sm">Curated recruitment access</span>
            </li>
            <li className="flex items-center gap-3 justify-start">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-sm">Beautiful, shareable portfolios</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right - form card */}
      <div className="w-full lg:w-1/2 flex justify-center mt-0">
        <div className="w-full max-w-[550px] bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 md:p-12 backdrop-blur-3xl shadow-[0_20px_60px_rgba(2,6,23,0.7)] relative z-10">

          <div className="absolute -top-8 left-8 right-8 mx-auto h-1 rounded-full" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))', opacity: 0.12 }} />

          <div className="flex items-center gap-4 mb-8 ">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.95"/></svg>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Create your account</h2>
              <p className="text-white/70 text-sm">Sign up to publish projects, get feedback, and connect with industry.</p>
            </div>
          </div>
          <form autoComplete="on" className="mt-3 grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
            <input name="hidden-username" type="text" autoComplete="username" className="hidden" />

            <label className="block">
              <span className="text-sm text-white/70">Full name</span>
              <input name="name"
               autoComplete="name" 
               type="text"
               placeholder="Full name"
               value={formData.name}
               onChange={handleChange}
               className="mt-2 w-full px-5 py-2 bg-white/6 border border-white/8 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-(--pv-accent) focus:border-(--pv-accent) transition" />
            </label>

            <label className="block">
              <span className="text-sm text-white/70">Email</span>
              <input name="email"
               autoComplete="email"
               type="email"
               placeholder="you@college.edu" 
               value={formData.email}
               onChange={handleChange}
              className="mt-2 w-full px-5 py-2 bg-white/6 border border-white/8 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-(--pv-accent) focus:border-(--pv-accent) transition" />
            </label>

            <label className="block">
              <span className="text-sm text-white/70">Role</span>
              <select name="role"
              value={formData.role}
               onChange={handleChange}
               className="mt-2 w-full px-5 py-2 bg-white/6 border border-white/8 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-(--pv-accent) focus:border-(--pv-accent) transition">
                <option value="student" className="text-black">Student</option>
                <option value="teacher" className="text-black">Teacher</option>
                <option value="recruiter" className="text-black">Recruiter</option>
                <option value="admin" className="text-black">Admin</option>
              </select>
            </label>

            <label className="block relative">
              <span className="text-sm text-white/70">Password</span>
              <input
                name="password"
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
               onChange={handleChange}
                className="mt-2 w-full px-5 py-2 bg-white/6 border border-white/8 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-(--pv-accent) focus:border-(--pv-accent) transition"
              />
              <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-[75%] -translate-y-1/2 text-white/60">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </label>

            <button type="submit"
             className="mt-2 w-full py-3 rounded-2xl text-white font-semibold shadow-lg" style={{ background: 'linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))' }}>
              Create Account
            </button>
          </form>

          <p className="text-center text-white/70 mt-4 text-sm">Already have an account? <Link href="/login" className="text-(--pv-accent) hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
