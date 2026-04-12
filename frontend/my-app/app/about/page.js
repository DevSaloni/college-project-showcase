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
    <section className="min-h-screen bg-black relative overflow-hidden pt-32 pb-20 selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>





      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--pv-accent)]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,22,0.8)_100%)] pointer-events-none z-0" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">

        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          {/* Premium Badge Pattern */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 hover:border-[var(--pv-accent)]/50 transition-all duration-700 backdrop-blur-xl animate-fade-in shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-accent)] shadow-[0_0_12px_var(--pv-accent)]"></span>
            <span className="text-[11px] uppercase font-black tracking-[0.25em] text-[var(--pv-accent)]">Our Story & Vision</span>
          </div>
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black text-white leading-[1.05] mb-8 tracking-[-0.04em] animate-fade-in delay-100">
            Empowering the Next <br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))]">
              Generation of Innovators
            </span>
          </h1>
          <p className="section-text mx-auto animate-fade-in delay-200">
            ProjectVault is more than just a showcase platform. It's a digital bridge between academic excellence and professional success, where ideas transform into impact.
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
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Our Mission</h2>
              <p className="section-text text-white/50">
                To provide students with a professional stage where their technical journey—from initial digital proposals to weekly milestones—can be documented, validated, and celebrated. We aim to transform academic efforts into industry-ready, recruiter-verified portfolios.
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
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Our Vision</h2>
              <p className="section-text text-white/50">
                To become the global standard for academic project discovery and verification. We envision an ecosystem where student potential is measured by real technical milestones, expert validations, and the ability to solve complex problems through iterative development.
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
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 hover:border-[var(--pv-accent)]/50 transition-all duration-300 shadow-xl backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-accent)] shadow-[0_0_12px_var(--pv-accent)]"></span>
              <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[var(--pv-accent)]">Core Principles</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">What we stand for</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Structural Rigour",
                desc: "We enforce development integrity through mandatory digital abstracts and milestone checks, ensuring projects meet professional standards.",
                color: "var(--pv-accent)"
              },
              {
                title: "Verified Credibility",
                desc: "Every project is backed by a technical audit trail and faculty-verified ratings, providing recruiters with an authentic showcase of talent.",
                color: "#4A90E2"
              },
              {
                title: "Collaborative Synergy",
                desc: "We bridge the gap between students and mentors through real-time discussion hubs, fostering a culture of continuous feedback and growth.",
                color: "#10B981"
              }
            ].map((v, i) => (
              <div key={i} className="relative p-10 rounded-[2.5rem] bg-[#0A0F1B]/40 border border-white/[0.05] group overflow-hidden hover:border-white/[0.1] transition-all">
                <div
                  className="absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-10 group-hover:opacity-40 transition-opacity"
                  style={{ background: v.color }}
                />
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{v.title}</h3>
                <p className="section-text text-white/40">{v.desc}</p>
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
                           linear-gradient(135deg, #0A0F1B, #000000)`
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link href="/register">
                <button className="group relative flex items-center gap-4 px-10 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Get Started</span>
                  <div className="w-6 h-6 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                    <ArrowRight size={12} className="text-black font-black" />
                  </div>
                </button>
              </Link>
              <Link href="/explore">
                <button className="group relative flex items-center gap-4 px-10 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Explore Repository</span>
                  <div className="w-6 h-6 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                    <ArrowRight size={12} className="text-black font-black" />
                  </div>
                </button>
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
