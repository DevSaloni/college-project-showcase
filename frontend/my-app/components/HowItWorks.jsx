"use client";
import { GraduationCap, ClipboardCheck, Briefcase } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <GraduationCap className="w-12 h-12 text-[var(--pv-accent)]" />,
      role: "For Students",
      title: "Showcase Your Projects",
      desc: "Upload your academic or personal projects with descriptions, tech stack, GitHub links, images, and videos. Build your portfolio and get visibility."
    },
    {
      icon: <ClipboardCheck className="w-12 h-12 text-[var(--pv-accent)]" />,
      role: "For Teachers",
      title: "Review & Validate Work",
      desc: "Mentors can approve, rate, and verify student projects. Provide feedback and highlight the best innovative projects of the college."
    },
    {
      icon: <Briefcase className="w-12 h-12 text-[var(--pv-accent)]" />,
      role: "For Recruiters",
      title: "Discover Skilled Talent",
      desc: "Explore verified student projects, filter by skills, and find candidates who match real industry needs."
    }
  ];

  return (
    <section className="py-24 bg-[#050A16] relative overflow-hidden">

      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, var(--pv-accent), transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-extrabold text-white text-center">
          How It Works
        </h2>
        <p className="text-center text-white/70 max-w-2xl mx-auto mt-3">
          One platform connecting <span className="text-[var(--pv-accent)]">students</span>, 
          <span className="text-[var(--pv-accent-2)]"> mentors</span>, and 
          <span className="text-[var(--pv-accent)]"> recruiters</span> — making project showcasing smarter and easier.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          {steps.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-10 border border-white/10 bg-white/[0.03] backdrop-blur-xl
              hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-2 transition-all"
            >
              <div className="mb-6">{item.icon}</div>

              <p className="text-sm text-[var(--pv-accent)] tracking-wider font-semibold uppercase">
                {item.role}
              </p>

              <h3 className="text-2xl font-bold text-white mt-1">
                {item.title}
              </h3>

              <p className="text-white/70 mt-3 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
