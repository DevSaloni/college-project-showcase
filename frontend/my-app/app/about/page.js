"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Info, Target, Eye, Users, Rocket, Award, ShieldCheck, ArrowRight, Zap, Target as MissionTarget } from "lucide-react";

export default function AboutPage() {

  // Animation on Load
  useEffect(() => {
    // Reveal animation logic or styling triggers
  }, []);

  return (
    <section className="min-h-screen bg-[#050A16] relative overflow-hidden pt-32 pb-20 selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* ── HERO GRID LAYER (Only Top Section) ── */}
      <div className="absolute top-0 left-0 w-full h-[600px] z-0 pointer-events-none opacity-[0.13] overflow-hidden">
        <div className="absolute inset-0 animate-grid-move"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 107, 107, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 107, 0.6) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Mask to fade grid at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A16] via-transparent to-transparent" />
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--pv-accent)]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,22,0.8)_100%)] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10">

        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[var(--pv-accent)] text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-fade-in shadow-2xl backdrop-blur-xl">
            <Info size={14} /> Our Story & Vision
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight">
            Empowering the Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pv-accent)] to-[var(--pv-accent-2)]">
              Generation of Innovators
            </span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            ProjectVista is more than just a showcase platform. It's a bridge between academic excellence and professional success, where ideas transform into impact.
          </p>
        </div>

        {/* MISSION & VISION - PREMIUM GLASS BOXES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32 text-left">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--pv-accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10" />
            <div className="h-full p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl hover:border-[var(--pv-accent)]/30 transition-all duration-500 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[var(--pv-accent)]/10 flex items-center justify-center text-[var(--pv-accent)] mb-8 group-hover:scale-110 transition-transform duration-500 ring-1 ring-[var(--pv-accent)]/20">
                <MissionTarget size={32} />
              </div>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Our Mission</h2>
              <p className="text-white/50 leading-relaxed text-lg font-medium">
                To provide students with a professional stage where their technical journey can be documented, validated, and celebrated. We aim to break the traditional barriers of "just another college project" and turn them into recruiter-ready portfolios.
              </p>
              <div className="mt-8 flex items-center gap-2 text-white/30 font-black uppercase tracking-widest text-[10px]">
                <Zap size={14} className="text-[var(--pv-accent)]" /> Purpose Driven Innovation
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10" />
            <div className="h-full p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl hover:border-blue-500/20 transition-all duration-500 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform duration-500 ring-1 ring-blue-500/20">
                <Eye size={32} />
              </div>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Our Vision</h2>
              <p className="text-white/50 leading-relaxed text-lg font-medium">
                To become the global standard for academic project discovery. We envision a world where a student's potential is measured by the quality of their work and their ability to solve real-world problems, creating a transparent ecosystem for innovation.
              </p>
              <div className="mt-8 flex items-center gap-2 text-white/30 font-black uppercase tracking-widest text-[10px]">
                <Zap size={14} className="text-blue-400" /> Shaping The Future
              </div>
            </div>
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="mb-32 text-center">
          <div className="flex flex-col items-center mb-16">
            <div className="text-[var(--pv-accent)] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Core Principles</div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">What we stand for</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Excellence",
                desc: "We prioritize quality over quantity. Every project featured is a testament to student dedication and technical rigour.",
                color: "var(--pv-accent)"
              },
              {
                title: "Transparency",
                desc: "Real feedback, real metrics, and real people. We believe in an honest showcase of skills and achievements.",
                color: "#4A90E2"
              },
              {
                title: "Impact",
                desc: "We focus on projects that solve real problems, bridging the gap between theory and real-world application.",
                color: "#10B981"
              }
            ].map((v, i) => (
              <div key={i} className="relative p-10 rounded-[2.5rem] bg-[#0A0F1B]/40 border border-white/[0.05] group overflow-hidden hover:border-white/[0.1] transition-all">
                <div
                  className="absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-10 group-hover:opacity-40 transition-opacity"
                  style={{ background: v.color }}
                />
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{v.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION - PERFECT BALANCED & CONSISTENT SPACING */}
        <div className="relative w-full rounded-[2.5rem] px-8 py-10  text-center overflow-hidden shadow-2xl border border-white/5 bg-white/[0.01]">

          {/* Background Layers (NEW) */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 20% 30%, rgba(255,107,107,0.25), transparent 40%),
                           radial-gradient(circle at 80% 70%, rgba(59,130,246,0.25), transparent 40%),
                           linear-gradient(135deg, #0A0F1B, #050A16)`
            }}
          />

          <div className="absolute inset-0 backdrop-blur-3xl -z-20" />
          {/* Content */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              Ready to showcase your <br className="hidden sm:block" />
              graduation talent?
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-10 font-medium">
              Join students building strong portfolios and getting noticed by recruiters through ProjectVista.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[var(--pv-accent)] text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 hover:shadow-[0_15px_35px_rgba(var(--pv-accent-rgb),0.3)] transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Explore <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
