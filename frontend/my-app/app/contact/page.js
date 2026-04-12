"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Mail, User, MessageSquare, Send, Compass, ArrowRight, Github, Linkedin, Twitter, Sparkles } from "lucide-react";
import { useApi } from "@/context/ApiContext";
import Link from "next/link";

export default function ContactPage() {
  const { BASE_URL } = useApi();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ count: 0, profiles: [] });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/public-stats`);
        setStats({
          count: res.data.totalCount,
          profiles: res.data.profiles
        });
      } catch (err) {
        console.error("Failed to fetch public stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [BASE_URL]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All identifiers are required for transmission.");
      return;
    }

    setLoading(true);
    const loadId = toast.loading("Establishing connection...");

    try {
      await axios.post(`${BASE_URL}/api/contact/save`, formData);
      toast.success("Message successfully transmitted!", { id: loadId });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Transmission failed. Please retry signal.", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#000000] overflow-hidden font-['Poppins',_sans-serif]">

      {/* ── LEFT SIDE: CONTACT FORM ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-12 relative pt-[80px] border-r border-white/5">

        {/* Dynamic Backgrounds on Form Side */}
        <div className="absolute top-0 left-0 w-full h-[300px] z-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <div className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent" />
        </div>

        <div className="w-full max-w-lg relative z-10 py-4">
          <div className="mb-8 text-left">
            <h2 className="text-4xl font-bold text-white mb-2">Send a Signal</h2>
            <p className="text-white/80 text-xs font-medium">Reach out for support, collaboration, or feedback</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-4">
              {/* Innovator Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">full name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[var(--pv-accent)] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-white/[0.05] transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* University Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[var(--pv-accent)] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-white/[0.05] transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Transmission Details */}
            <div className="space-y-1">
              <label htmlFor="message" className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">message</label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-white/30 group-focus-within:text-[var(--pv-accent)] transition-colors">
                  <MessageSquare size={18} />
                </div>
                <textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you create impact?"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-28 pl-12 pr-4 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--pv-accent)]/50 focus:bg-white/[0.05] transition-all resize-none shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))] text-black font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[var(--pv-accent)]/20 hover:shadow-[var(--pv-accent)]/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 font-bold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Send Message <Send size={18} />
                </>
              )}
            </button>
          </form>

          {/* Social architecture footer */}
          <div className="mt-6 text-center">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-3">Reach out via Direct Social Channels</p>
            <div className="flex items-center justify-center gap-6">
              {[<Linkedin size={18} />, <Twitter size={18} />, <Github size={18} />].map((icon, i) => (
                <button key={i} className="text-white/20 hover:text-[var(--pv-accent)] transition-all hover:scale-110">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: THEMATIC BRANDING & IMAGE ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#000000] items-center justify-start px-8 sm:px-12 lg:px-16 xl:px-20 overflow-hidden">

        {/* Background Image / Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/contact-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#000000] via-[#000000]/70 to-[var(--pv-accent)]/20 shadow-inner" />

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--pv-accent)]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Compass size={14} className="text-[var(--pv-accent)]" />
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Innovation Support</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Connect with the<br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))]">
              Future of Tech
            </span>
          </h1>

          <p className="text-white/80 text-base leading-relaxed mb-10 max-w-md">
            Have questions about ProjectVista? Reach out to us for collaborations, support, or general project inquiries. Join the community of innovators and start your journey today.
          </p>


        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
