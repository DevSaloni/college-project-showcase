"use client";
import Link from "next/link";
import { Github, Linkedin, Instagram, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#050A16] border-t border-white/10 overflow-hidden selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Background Ambient Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] opacity-[0.05] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom, var(--pv-accent) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Brand & Description (Spans 2 cols on Large screens) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--pv-accent)] shadow-[0_0_15px_var(--pv-accent)]"></span>
                ProjectVista
              </h2>
            </Link>
            <p className="text-white/50 leading-relaxed text-[14px] max-w-sm mb-8">
              A unified showcase ecosystem bridging the gap between student innovation, mentor validation, and professional talent sourcing.
            </p>

            {/* Direct Register Link Inside Brand Area */}
            <Link href="/register">
              <button className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
                <span className="text-[11px] font-bold text-white uppercase tracking-widest">Join Platform</span>
                <div className="w-5 h-5 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                  <ArrowRight size={10} className="text-black font-black" />
                </div>
              </button>
            </Link>
          </div>

          {/* Available Platform Links */}
          <div>
            <h4 className="text-[13px] font-black uppercase tracking-widest mb-6 text-[var(--pv-accent)]">Platform</h4>
            <ul className="space-y-4">
              {[
                { name: "Explore Projects", path: "/explore" },
                { name: "Student Dashboard", path: "/student-dashboard" },
                { name: "Mentor Portal", path: "/teacher-dashboard" },
                { name: "Login", path: "/login" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-[14px] text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[13px] font-black uppercase tracking-widest mb-6 text-[var(--pv-accent)]">Company</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Getting Started", path: "/register" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-[14px] text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Actions (Dashboard & Explore Hooks) */}
          <div>
            <h4 className="text-[13px] font-black uppercase tracking-widest mb-6 text-[var(--pv-accent)]">Ecosystem</h4>
            <ul className="space-y-4">
              {[
                { name: "Submit Project", path: "/student-dashboard/submit-project" },
                { name: "Track Progress", path: "/student-dashboard/project-progress" },
                { name: "Mentor Reviews", path: "/teacher-dashboard/reviews" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-[14px] text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">

          <div className="flex flex-col sm:flex-row items-center gap-4 text-[13px] text-white/40">
            <p>© {new Date().getFullYear()} ProjectVista. All rights reserved.</p>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></span>
            <div className="flex items-center gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>

          {/* Social Links using lucide-react */}
          <div className="flex items-center gap-4">
            {[
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Github, label: "GitHub" },
              { icon: Instagram, label: "Instagram" },
              { icon: Mail, label: "Email" },
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </footer>
  );
}
