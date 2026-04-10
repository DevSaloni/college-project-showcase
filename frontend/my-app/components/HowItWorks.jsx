"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      role: "Digital Identity",
      title: "For Students",
      desc: "Build your professional brand by uploading institutional projects, tracking milestones, and showcasing data-rich portfolios to recruiters.",
    },
    {
      num: "2",
      role: "Verification Hub",
      title: "For Mentors",
      desc: "A streamlined authority dashboard to evaluate project quality, provide real-time feedback, and validate student contributions.",
    },
    {
      num: "3",
      role: "Talent Acquisition",
      title: "For Recruiters",
      desc: "Access a curated talent pool with verified academic records, filtrable by specific tech stacks, roles, and institutional rankings.",
    }
  ];

  return (
    <section className="pt-10 pb-24 bg-[#000000] relative overflow-hidden selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.35]">
        <img
          src="/about-innovation.png"
          alt=""
          className="w-full h-full object-cover brightness-80 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black z-0" />
      </div>

      {/* Decorative Background Glows - Removed all #4A90E2 blue */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] blur-[150px] opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[0%] right-[-5%] w-[400px] h-[400px] blur-[150px] opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />

      <div className="max-w-[1440px] Smx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-8 items-center min-h-[500px]">

        {/* Header Content Block (Left Side) - ~35% width on desktop */}
        <div className="w-full lg:w-[35%] flex flex-col justify-center items-start z-10 pt-10 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 hover:border-[var(--pv-accent)]/50 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)]"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--pv-accent)]">How It Works</span>
          </div>
          <h2 className="section-title mb-8">
            Simple Steps to Start Your Journey
          </h2>
          <p className="section-text mb-8">
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
        <div className="w-full lg:w-[60%] flex flex-col sm:block relative z-10 min-h-[400px] mt-16 lg:mt-0 gap-16 sm:gap-0">

          {/* Exactly mapped SVG - Dots are exactly at 80%, 50%, 20% heights along paths */}
          <div className="hidden sm:block absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--pv-accent)" stopOpacity="0.1" />
                  <stop offset="30%" stopColor="var(--pv-accent)" stopOpacity="1" />
                  <stop offset="70%" stopColor="var(--pv-accent)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--pv-accent)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M -5,80 C 15,80 15,50 35,50 C 55,50 55,20 75,20"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="1px"
                vectorEffect="nonScalingStroke"
                className="drop-shadow-[0_0_15px_var(--pv-accent)] opacity-80"
              />
            </svg>
          </div>

          {[
            {
              num: "1",
              role: "Digital Identity",
              title: "For Students",
              desc: "Build your professional brand by uploading institutional projects, tracking milestones, and showcasing portfolios.",
              posClass: "sm:top-[80%] sm:left-[0%]",
            },
            {
              num: "2",
              role: "Verification Hub",
              title: "For Mentors",
              desc: "A streamlined authority dashboard to evaluate project quality, provide real-time feedback, and validate work.",
              posClass: "sm:top-[50%] sm:left-[35%]",
            },
            {
              num: "3",
              role: "Talent Acquisition",
              title: "For Recruiters",
              desc: "Access a curated talent pool with verified academic records, filtrable by tech stacks and institutional rankings.",
              posClass: "sm:top-[20%] sm:left-[75%]",
            }
          ].map((step, idx) => (
            <div
              key={idx}
              className={`w-full sm:w-[28%] relative sm:absolute flex flex-col group ${step.posClass}`}
            >
              {/* Large Abstract Background Number */}
              <div className="absolute -top-20 -left-8 text-[140px] md:text-[180px] font-black text-white/[0.02] z-0 leading-none select-none transition-all duration-700 pointer-events-none group-hover:-translate-y-3 group-hover:text-[var(--pv-accent)]/5">
                {step.num}
              </div>

              {/* Exact Timeline Accent Dot - Origin perfectly aligns with coordinate (0, y%) */}
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#000000] border-[3px] border-[var(--pv-accent)] z-20 group-hover:bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)] transition-all duration-300" />

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
                <p className="text-white/60 text-sm leading-relaxed max-w-[280px] font-medium group-hover:text-white/80 transition-colors">
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
