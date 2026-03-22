"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:2015/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();
    setMsg(data.message);

    if (res.ok) {
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-[#050A16]">

      {/* Glow Background */}
      <div
        className="absolute inset-0 opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, var(--pv-accent), transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-white text-center">
          Reset Password
        </h2>

        <p className="text-white/60 text-center mt-2">
          Enter your new password to continue
        </p>

        <form onSubmit={handleSubmit} className="mt-8">

          <input
            type="password"
            placeholder="New password"
            className="w-full p-3 rounded-lg border border-white/10 bg-white/[0.05] text-white placeholder-white/40 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full mt-5 py-3 rounded-lg text-white font-semibold
            bg-gradient-to-r from-[var(--pv-accent)] to-[var(--pv-accent-2)]
            hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </form>

        {msg && (
          <p className="text-center mt-4 text-[var(--pv-accent)] font-medium">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
