"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      role: "Project Discovery",
      title: "For Students",
      desc: "Upload academic or personal projects with details, tech stacks, and links to build your profile.",
      posClass: "sm:top-[80%] sm:left-[0%]",
    },
    {
      num: "2",
      role: "Validation Check",
      title: "For Teachers",
      desc: "Mentors can easily approve, rate, and verify student works and provide constructive feedback.",
      posClass: "sm:top-[20%] sm:left-[35%]",
    },
    {
      num: "3",
      role: "Talent Sourcing",
      title: "For Recruiters",
      desc: "Explore verified projects, filter by precise skills, and find candidates matching your hiring needs.",
      posClass: "sm:top-[50%] sm:left-[70%]",
    }
  ];

  return (
    <section className="py-24 bg-[#050A16] relative overflow-hidden selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Decorative Background Glows - Removed all #4A90E2 blue */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] blur-[150px] opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[0%] right-[-5%] w-[400px] h-[400px] blur-[150px] opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-4 items-center min-h-[500px]">

        {/* Header Content Block (Left Side) - ~35% width on desktop */}
        <div className="w-full lg:w-[35%] flex flex-col justify-center items-start z-10 pt-10 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)]"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-white/70">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
            Simple Steps to Get Started   <br /> Start Your Journey
          </h2>
          <p className="text-white/50 text-[14px] leading-relaxed mb-8 max-w-sm">
            Not sure where to start? Our unified platform makes it incredibly easy for students to shine, mentors to validate, and recruiters to hire perfectly tailored candidates instantly.
          </p>

          <Link href="/register">
            <button className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Get Started</span>
              <div className="w-6 h-6 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                <ArrowRight size={12} className="text-black font-black" />
              </div>
            </button>
          </Link>
        </div>


        {/* Timeline Steps with Exact mathematical SVG matching (Right Side) */}
        <div className="w-full lg:w-[65%] flex flex-col sm:block relative z-10 min-h-[400px] mt-16 lg:mt-0 gap-16 sm:gap-0">

          {/* Exactly mapped SVG - Dots are exactly at 80%, 50%, 20% heights along paths */}
          <div className="hidden sm:block absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <path
                d="M -10,80 L 0,80 C 15,80 20,50 35,50 C 50,50 55,20 70,20 C 85,20 90,20 105,20"
                fill="none"
                stroke="var(--pv-accent)"
                strokeWidth="2px"
                vectorEffect="nonScalingStroke"
                className="opacity-40 drop-shadow-[0_0_8px_var(--pv-accent)]"
              />
            </svg>
          </div>

          {[
            {
              num: "1",
              role: "Project Discovery",
              title: "For Students",
              desc: "Upload academic or personal projects with details, tech stacks, and links to build your profile.",
              posClass: "sm:top-[80%] sm:left-[0%]",
            },
            {
              num: "2",
              role: "Validation Check",
              title: "For Teachers",
              desc: "Mentors can easily approve, rate, and verify student works and provide constructive feedback.",
              posClass: "sm:top-[50%] sm:left-[35%]",
            },
            {
              num: "3",
              role: "Talent Sourcing",
              title: "For Recruiters",
              desc: "Explore verified projects, filter by precise skills, and find candidates matching your hiring needs.",
              posClass: "sm:top-[20%] sm:left-[70%]",
            }
          ].map((step, idx) => (
            <div
              key={idx}
              className={`w-full sm:w-[28%] relative sm:absolute flex flex-col group ${step.posClass}`}
            >
              {/* Large Abstract Background Number */}
              <div className="absolute -top-12 -left-4 text-[140px] md:text-[160px] font-black text-white/[0.02] z-0 leading-none select-none transition-all duration-700 pointer-events-none group-hover:-translate-y-3 group-hover:text-white/[0.05]">
                {step.num}
              </div>

              {/* Exact Timeline Accent Dot - Origin perfectly aligns with coordinate (0, y%) */}
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#050A16] border-[3px] border-[var(--pv-accent)] z-20 group-hover:bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)] transition-all duration-300" />

              {/* Mobile Vertical Connector Line (Hidden on Desktop) */}
              <div className="absolute top-4 -left-0 w-[px] border-l-2 border-dashed border-white/10 h-[calc(100%+40px)] sm:hidden -z-10" />

              {/* Content Box */}
              <div className="relative z-10 pl-6 pt-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-[var(--pv-accent)] mb-1 block drop-shadow-md">
                  {step.role}
                </span>
                <h3 className="text-lg font-black text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/50 text-[13px] leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
