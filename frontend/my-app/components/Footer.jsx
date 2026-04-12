"use client";
import Link from "next/link";
import { Github, Linkedin, Mail, Phone, ArrowRight, ShieldCheck, Globe, Zap } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Explore All Projects", path: "/explore" },
    { name: "Submit Innovation", path: "/student-dashboard/submit-project" },
    { name: "Project Progress", path: "/student-dashboard/project-progress" },
  ],
  portals: [
    { name: "Student Portal", path: "/student-dashboard" },
    { name: "Faculty Console", path: "/teacher-dashboard" },
    { name: "Institutional Admin", path: "/admin-dashboard" },
  ],
  company: [
    { name: "About ProjectVault", path: "/about" },
    { name: "Contact Support", path: "/contact" },
  ],
};

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/saloni-pawar-630b23270" },
  { icon: Github, label: "GitHub", href: "https://github.com/DevSaloni" },
  { icon: Mail, label: "Email", href: "mailto:salonipawar294@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#000000] border-t border-white/5 overflow-hidden selection:bg-[var(--pv-accent)] selection:text-black">

      {/* ── Background Design Elements ── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--pv-accent)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-24 pb-12 relative z-10">

        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Column 1: Brand (Spans 4) */}
          <div className="lg:col-span-4 space-y-8 text-left">
            <Link href="/" className="inline-block">
              <div className="p-1 bg-black group transition-all duration-500">
                <img
                  src="/logo.jpg"
                  alt="ProjectVault"
                  className="h-14 w-auto object-contain brightness-110"
                />
              </div>
            </Link>

            <p className="text-white/50 text-[15px] leading-relaxed max-w-sm font-['Inter']">
              The premier institutional showcase platform bridging innovation and talent sourcing through verified student projects.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Platform (Spans 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] mb-8 text-white font-['Outfit']">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-[14px] text-white/40 hover:text-white font-['Inter'] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[var(--pv-accent)] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Portals (Spans 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] mb-8 text-white font-['Outfit']">Dashboard Access</h4>
            <ul className="space-y-4">
              {footerLinks.portals.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-[14px] text-white/40 hover:text-white font-['Inter'] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[var(--pv-accent)] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company (Spans 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] mb-8 text-white font-['Outfit']">Information</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-[14px] text-white/40 hover:text-white font-['Inter'] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[var(--pv-accent)] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[13px] text-white/30 font-['Inter']">
              &copy; {new Date().getFullYear()} ProjectVault Ecosystem. All rights reserved.
            </p>

          </div>
          <div className="text-[12px] text-white/20 font-medium font-['Inter']">
            Crafted for Institutional Excellence
          </div>
        </div>

      </div>


    </footer>
  );
}

