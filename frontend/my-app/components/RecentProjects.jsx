"use client";

import { useEffect, useState } from "react";
import { Star, Eye, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useApi } from "@/context/ApiContext";

export default function RecentProjects() {
  const { BASE_URL } = useApi();
  const [projects, setProjects] = useState([]);

  // Fetch recent projects
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/projects/all`);
        // Sort by newest first and take top 6
        const sorted = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProjects(sorted.slice(0, 6)); // Display up to 6 recent projects
      } catch (err) {
        console.error("Failed to fetch recent projects:", err.message);
      }
    };
    fetchRecentProjects();
  }, [BASE_URL]);

  // Helper: GET PROJECT AGE
  const getProjectAge = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <section className="py-24 bg-[#050A16] relative overflow-hidden selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Decorative Glows */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] blur-[150px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[0%] right-[-5%] w-[400px] h-[400px] blur-[150px] opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header (Matching Feature/HowItWorks Pattern) */}
        <div className="flex flex-col items-center justify-center text-center mb-16 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 hover:border-[var(--pv-accent)]/50 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)]"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--pv-accent)] drop-shadow-md">Recent Projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
            Discover the <br className="sm:hidden" /> latest innovations
          </h2>
          <p className="text-white/50 text-[14px] leading-relaxed max-w-xl mx-auto">
            Explore the most recent groundbreaking projects deployed by our top student creators and visionaries across the platform.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((p) => (
            <article
              key={p._id}
              className="flex flex-col rounded-[2rem] bg-[#0A0F1B]/60 border border-white/[0.08] backdrop-blur-xl overflow-hidden hover:-translate-y-2 transition-all duration-700 hover:border-[var(--pv-accent)]/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group relative h-full"
            >
              {/* Image Section */}
              <div className="relative h-40 w-full overflow-hidden shrink-0">
                <img
                  src={p.bannerImage?.startsWith("http") ? p.bannerImage : `${BASE_URL}/${p.bannerImage?.startsWith("/") ? p.bannerImage.substring(1) : p.bannerImage}`}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050A16] via-[#050A16]/20 to-transparent opacity-60" />

                {/* Category Floater */}
                <div className="absolute top-4 right-4 bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-2xl">
                  {p.category || "Project"}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 relative z-10">

                {/* Header Stats */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      <Star size={10} className="fill-yellow-400" />
                      <span className="text-[10px] font-black">{p.ratings?.ratingCount > 0 ? (p.ratings.totalRating / p.ratings.ratingCount).toFixed(1) : "New"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/50">
                      <Eye size={10} />
                      <span className="text-[10px] font-bold">{p.views?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 text-[var(--pv-accent)]">
                    <Clock size={10} />
                    <span className="text-[10px] font-bold">{getProjectAge(p.createdAt)}</span>
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="text-white text-lg lg:text-xl font-black mb-1.5 leading-tight line-clamp-1 truncate">{p.title}</h3>
                <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2 mb-3">
                  {p.description}
                </p>

                {/* Tech Stack Bubbles */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech ? p.tech.split(",").slice(0, 3).map((t, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-white/70"
                    >
                      {t.trim()}
                    </span>
                  )) : null}
                  {p.tech?.split(",").length > 3 && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-1 rounded bg-transparent text-white/30">
                      +{p.tech.split(",").length - 3} more
                    </span>
                  )}
                </div>

                {/* Team & Members UI */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between mb-3">
                  <div className="flex flex-col truncate pr-2">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate" title={p.groupName || "Individual Creator"}>{p.groupName || "Individual Creator"}</span>
                    <span className="text-[9px] text-[var(--pv-accent)] uppercase tracking-widest mt-0.5 truncate">{p.department || "General Team"}</span>
                  </div>

                  <div className="flex -space-x-2.5 shrink-0 items-center">
                    {(p.creatorProfiles && p.creatorProfiles.length > 0 ? p.creatorProfiles : (p.teamMembers?.length > 0 ? p.teamMembers : ["Creator"])).slice(0, 3).map((member, i) => {
                      const isProfile = typeof member === "object";
                      const name = isProfile ? member.userId?.name : member;
                      const image = isProfile ? member.image : null;
                      const initial = name ? name.charAt(0).toUpperCase() : "C";
                      const bgColors = ["bg-indigo-600", "bg-fuchsia-600", "bg-cyan-600", "bg-orange-600"];

                      const imgSrc = image ? (image.startsWith("http") ? image : `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`) : null;

                      return (
                        <div
                          key={i}
                          className={`w-9 h-9 rounded-full ring-2 ring-[#050A16] flex items-center justify-center text-white text-[10px] font-bold shadow-2xl relative hover:z-20 transition-all hover:scale-110 hover:-translate-y-1 overflow-hidden ${!image ? bgColors[i % bgColors.length] : "bg-zinc-800"}`}
                          title={name}
                        >
                          {imgSrc ? (
                            <img src={imgSrc} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = initial; }} />
                          ) : (
                            initial
                          )}
                        </div>
                      )
                    })}
                    {(p.creatorProfiles?.length > 3 || p.teamMembers?.length > 3) && (
                      <div className="w-9 h-9 rounded-full bg-white/5 ring-2 ring-[#050A16] flex items-center justify-center text-white text-[11px] font-black shadow-2xl relative backdrop-blur-xl border border-white/10">
                        +{(p.creatorProfiles?.length || p.teamMembers?.length) - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/view-project/${p._id}`} className="block w-full">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 bg-white/5 hover:bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))] text-white hover:text-black border border-white/10 hover:border-transparent group-hover:shadow-[0_4px_20px_rgba(var(--pv-accent-rgb),0.3)]">
                    Explore Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <Link href="/explore">
            <button className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
              <span className="text-xs font-bold text-white uppercase tracking-widest">View All Projects</span>
              <div className="w-6 h-6 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                <ArrowRight size={12} className="text-black font-black" />
              </div>
            </button>
          </Link>
        </div>

      </div>

      <style>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
}
