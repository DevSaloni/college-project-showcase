"use client";
import { Laptop, Layers, Users, Star, Search, Upload, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Upload className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Upload & Showcase",
      desc: "Upload project details, images, and GitHub links to present your work professionally to recruiters.",
    },
    {
      icon: <Layers className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Explore Categories",
      desc: "Browse through AI/ML, Blockchain, Web Dev, and IoT projects built with modern tech domains.",
    },
    {
      icon: <Users className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Team Collaboration",
      desc: "Add team members, assign individual roles, and highlight the exact contributions of each student.",
    },
    {
      icon: <Star className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Mentor Reviews",
      desc: "Teachers and domain experts can rate projects, give constructive feedback, and validate work.",
    },
    {
      icon: <Search className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Smart Filters",
      desc: "Find exactly what you're looking for with filters for domain, year, tech stack, and difficulty level.",
    },
    {
      icon: <Laptop className="w-5 h-5 group-hover:text-[var(--pv-accent)] text-white/70 transition-colors" />,
      title: "Recruiter Ready",
      desc: "Get discovered through detailed, data-rich project cards that help companies evaluate your skills.",
    },
  ];

  return (
    <section className="py-24 bg-[#050A16] relative selection:bg-[var(--pv-accent)] selection:text-black overflow-hidden" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Deep Background Glows to match Explore/Dashboard */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] blur-[150px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-[-20%] w-[500px] h-[500px] blur-[150px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, #4A90E2 0%, transparent 70%)" }} />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Premium Header Layout */}
        <div className="flex flex-col xl:flex-row items-center xl:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 text-center xl:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-2">
              <span className="w-2 h-2 rounded-full bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)]"></span>
              <span className="text-[10px] uppercase font-black tracking-widest text-white/70">Platform features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Features That Power <br /> Your Projects
            </h2>
            <p className="text-white/50 text-sm md:text-[15px] leading-relaxed max-w-xl mx-auto xl:mx-0">
              Everything students, mentors, and recruiters need in one platform.
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <Link href="/explore">
              <button className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
                <span className="text-xs font-bold text-white uppercase tracking-widest">Explore Platform</span>
                <div className="w-6 h-6 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                  <ArrowRight size={12} className="text-black font-black" />
                </div>
              </button>
            </Link>
          </div>
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

              <p className="text-white/50 text-[13px] leading-relaxed relative z-10 group-hover:text-white/70 transition-colors">
                {feature.desc}
              </p>

              {/* Decorative element bottom right */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <ArrowRight size={16} className="text-[var(--pv-accent)]/50" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
