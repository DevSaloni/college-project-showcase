"use client";

import { useState } from "react";
import axios from "axios";
import { useApi } from "@/context/ApiContext";

export default function ForgotPasswordPage() {
  const { BASE_URL } = useApi();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      alert("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      alert("Failed to send reset link!");
      console.error("Forgot Password Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] relative overflow-hidden pt-20 px-4 text-white">

      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, var(--pv-accent), transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl">

        <h2 className="text-3xl font-bold text-center">Forgot Password</h2>
        <p className="text-white/60 text-center mt-2">
          Enter your email to receive password reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">

          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg bg-white/[0.07] border border-white/10 text-white focus:outline-none focus:border-[var(--pv-accent)] placeholder-white/40"
            placeholder="Enter your email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white
            bg-gradient-to-r from-[var(--pv-accent)] to-[var(--pv-accent-2)]
            hover:opacity-90 transition-all"
          >
            Send Reset Link
          </button>

        </form>
      </div>
    </div>
  );
}
