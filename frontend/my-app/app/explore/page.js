"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Star, Users, ArrowRight, Layers, Eye, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useApi } from "@/context/ApiContext";

export default function ExploreProjects() {
  const { BASE_URL } = useApi();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalProjects: 0 });

  const tags = ["All", "AI", "Web", "Blockchain", "IoT", "Data"];

  // 🔹 FETCH PROJECTS FROM BACKEND (With Server-Side Filter/Search/Pagination)
  const fetchProjects = async (pageNum = 1, searchQuery = "", category = "All") => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/projects/all`, {
        params: {
          page: pageNum,
          search: searchQuery,
          category: category,
          limit: 9
        }
      });
      
      if (pageNum === 1) {
        setProjects(res.data.data);
      } else {
        setProjects(prev => [...prev, ...res.data.data]);
      }
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Immediate fetch on mount or tag change
  useEffect(() => {
    setPage(1);
    fetchProjects(1, search, activeTag);
  }, [activeTag]);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProjects(1, search, activeTag);
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(timer);
  }, [search]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjects(nextPage, search, activeTag);
  };

  // 🔹 HELPER: GET PROJECT AGE
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

  // ✅ MAIN RETURN
  return (
    <section className="min-h-screen bg-[#000000] pt-24 pb-20 relative selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Deep Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[180px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] blur-[150px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #4A90E2 0%, transparent 70%)" }} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">

        {/* Premium Header Layout */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 mb-12">
          <div className="space-y-3 shrink-0">
            <h1 className="section-title mb-4">
              Explore Innovations
            </h1>
            <p className="section-text">
              Discover cutting-edge student projects, filter by modern tech stacks, and connect with brilliant creators directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4 xl:mt-0">
            <div className="group flex items-center bg-white/[0.03] border border-white/[0.08] hover:border-[var(--pv-accent)]/40 focus-within:border-[var(--pv-accent)] focus-within:bg-black/40 rounded-2xl p-4 w-full transition-all duration-500 shadow-2xl backdrop-blur-md">
              <Search className="text-white/20 group-focus-within:text-[var(--pv-accent)] transition-colors mr-3 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search by title, department, or tech stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder-white/20 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Tags Selection */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-500 whitespace-nowrap ${activeTag === t
                  ? "bg-[var(--pv-accent)] text-black shadow-[0_4px_20px_rgba(var(--pv-accent-rgb),0.3)] scale-105"
                  : "text-white/40 hover:text-[var(--pv-accent)] hover:bg-[var(--pv-accent)]/10"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/20 to-transparent opacity-60" />

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
                          className={`w-9 h-9 rounded-full ring-2 ring-[#000000] flex items-center justify-center text-white text-[10px] font-bold shadow-2xl relative hover:z-20 transition-all hover:scale-110 hover:-translate-y-1 overflow-hidden ${!image ? bgColors[i % bgColors.length] : "bg-zinc-800"}`}
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
                      <div className="w-9 h-9 rounded-full bg-white/5 ring-2 ring-[#000000] flex items-center justify-center text-white text-[11px] font-black shadow-2xl relative backdrop-blur-xl border border-white/10">
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

        {/* Load More Section */}
        {page < pagination.totalPages && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-[var(--pv-accent)] hover:text-black transition-all duration-500 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Discovering..." : "Discover More Innovations"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="mt-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Layers size={40} className="text-white/20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">No innovations found</h3>
              <p className="text-white/40 text-sm max-w-xs">We couldn't find any projects matching your search or filters. Try adjusting them!</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
}
