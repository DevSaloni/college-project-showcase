"use client";
import { Laptop, Layers, Users, Star, Search, Upload, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Upload className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Digital Proposals",
      desc: "Submit structured abstracts with tech stacks and get instant digital approval from mentors to kickstart your creation.",
    },
    {
      icon: <Layers className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Milestone Tracking",
      desc: "Break down projects into weekly tasks. Track completion with visual progress bars and automated status monitoring.",
    },
    {
      icon: <Users className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Unified Team Hubs",
      desc: "Manage projects in dedicated workspaces with member roles, shared resources, and centralized contribution tracking.",
    },
    {
      icon: <MessageSquare className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Live Discussions",
      desc: "Engage in real-time threads with mentors. share technical files and receive contextual feedback as you build.",
    },
    {
      icon: <Search className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Smart Discovery",
      desc: "Browse high-quality projects filtered by domain, tech stack, and academic year to find inspiration and innovation.",
    },
    {
      icon: <Laptop className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Recruiter Ready",
      desc: "Transform your work into professional project cards that highlight your technical skills and verified mentor ratings.",
    },
  ];

  return (
    <section className="py-24 bg-[#000000] relative selection:bg-[var(--pv-accent)] selection:text-black overflow-hidden">

      {/* Deep Background Glows to match Explore/Dashboard */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] blur-[150px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-[-20%] w-[500px] h-[500px] blur-[150px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, #4A90E2) 0%, transparent 70%)" }} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">

        {/* Left-aligned Premium Header (Matching Explore/Hero Pattern) */}
        <div className="flex flex-col items-start justify-start text-left mb-20 z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 hover:border-[var(--pv-accent)]/50 transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-accent)] shadow-[0_0_12px_var(--pv-accent)]"></span>
            <span className="text-[11px] uppercase font-black tracking-[0.25em] text-[var(--pv-accent)]">Platform features</span>
          </div>
          <h2 className="section-title mb-6">
            Features That Power  Your Projects
          </h2>
          <p className="section-text">
            A comprehensive suite of tools designed specifically for students, mentors, and recruiters to thrive in a digital-first academic ecosystem.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group flex flex-col p-8 rounded-[2rem] bg-[#0A0F1B]/60 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden transition-all hover:border-[var(--pv-accent)]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 duration-700"
            >
              {/* Subtle hover gradient inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--pv-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--pv-accent)]/10 transition-all duration-500 relative z-10">
                {feature.icon}
              </div>

              <h3 className="text-lg md:text-xl font-black text-white mb-3 tracking-wide relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[var(--pv-accent)] transition-all">
                {feature.title}
              </h3>

              <p className="text-white/60 text-sm leading-relaxed relative z-10 group-hover:text-white/80 transition-colors font-medium">
                {feature.desc}
              </p>

              {/* Decorative element bottom right */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <ArrowRight size={16} className="text-[var(--pv-accent)]/50" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Features / Explore Button Centered at Bottom */}
        <div className="mt-16 flex justify-center">
          <Link href="/explore">
            <button className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Explore Platform</span>
              <div className="w-6 h-6 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                <ArrowRight size={12} className="text-black font-black" />
              </div>
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
