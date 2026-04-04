"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  Star,
  Eye,
  Github,
  Youtube,
  FileText,
  AlertCircle,
  Target,
  ListChecks,
  Cpu,
  User,
  Users,
  MapPin,
  Briefcase,
  Mail,
  Linkedin,
  MessageSquare,
  Send,
  ExternalLink,
  Terminal,
  Activity,
  Globe,
  Award,
  Phone
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useApi } from "@/context/ApiContext";

export default function ViewProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { BASE_URL } = useApi();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role && token) {
      setCurrentUser({ role });
    }

    const fetchProject = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${BASE_URL}/api/projects/${id}`, { headers });
        setProject(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, BASE_URL]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setAddingComment(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/projects/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setProject({ ...project, comments: res.data.comments });
      setCommentText("");
      toast.success("Comment added.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding comment.");
    } finally {
      setAddingComment(false);
    }
  };

  const handleRate = async (val) => {
    try {
      await axios.post(
        `${BASE_URL}/api/projects/${id}/rating`,
        { rating: val },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Thank you for rating!");
      setProject((prev) => ({
        ...prev,
        ratings: {
          ...prev.ratings,
          totalRating: prev.ratings.totalRating + val,
          ratingCount: prev.ratings.ratingCount + 1,
          users: [...(prev.ratings.users || []), "me"],
        },
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit rating.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050A16] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[var(--pv-accent)] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050A16] flex items-center justify-center text-white">
        <h1 className="text-xl font-black">Project Not Found</h1>
      </div>
    );
  }

  const averageRating = project.ratings?.ratingCount > 0
    ? (project.ratings.totalRating / project.ratings.ratingCount).toFixed(1)
    : "New";

  const bannerUrl = project.bannerImage?.startsWith("http")
    ? project.bannerImage
    : `${BASE_URL}/${project.bannerImage?.startsWith("/") ? project.bannerImage.substring(1) : project.bannerImage}`;

  return (
    <div className="min-h-screen bg-[#050A16] pt-24 pb-20 relative selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[180px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] blur-[150px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #4A90E2) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-6 relative z-10">

        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-white/40 hover:text-[var(--pv-accent)] transition-all text-1xl font-bold"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Explore
          </button>
        </div>

        {/* Project Header - Matching Explore Typography */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-2xl">
                {project.category || "Project"}
              </span>
              <span className="text-[11px] font-bold text-[var(--pv-accent)] uppercase tracking-wider">{project.department || "General"}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-white/40 text-sm max-w-2xl">
              Discover the technical architecture, problem statement, and the visionaries behind this innovation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Star size={14} className="fill-yellow-400" />
              <span className="text-[11px] font-black">{averageRating}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/50">
              <Eye size={14} />
              <span className="text-[11px] font-bold">{project.views?.length || 0} Views</span>
            </div>
          </div>
        </div>

        {/* Cinematic Banner */}
        <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 border border-white/5 shadow-2xl">
          <img src={bannerUrl} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050A16] via-transparent to-transparent opacity-60" />

          <div className="absolute bottom-6 right-6 flex gap-3">
            {project.github && (
              <a href={project.github} target="_blank" className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-[var(--pv-accent)] hover:text-black transition-all shadow-xl">
                <Github size={20} />
              </a>
            )}
            {project.demoVideo && (
              <a href={project.demoVideo} target="_blank" className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-red-500 transition-all shadow-xl">
                <Youtube size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Project Content Breakdown - Fluid "No Box" Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-32">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-16">

            {/* Core Challenge */}
            <section className="space-y-4">
              <p className="section-label">Core Challenge</p>
              <h2 className="section-title">Problem Statement</h2>
              <p className="section-text">
                {project.problem || "This project addresses real-world inefficiencies and aims to create a scalable and efficient solution."}
              </p>
            </section>

            {/* Solution */}
            <section className="space-y-4">
              <p className="section-label">Solution</p>
              <h2 className="section-title">Project Overview</h2>
              <p className="section-text">
                {project.description || "A structured and scalable solution designed with modern technologies."}
              </p>
            </section>

            {/* Features */}
            {project.featureList?.length > 0 && (
              <section className="space-y-4">
                <p className="section-label">Key Features</p>
                <h2 className="section-title">What This Project Offers</h2>

                <ul className="space-y-3">
                  {project.featureList.map((f, i) => (
                    <li key={i} className="flex gap-3 section-text">
                      <span className="text-[var(--pv-accent)] font-semibold">
                        {i + 1}.
                      </span>
                      <span>{f.trim()}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Outcome */}
            {project.projectOutcome && (
              <section className="space-y-4">
                <p className="section-label">Outcome</p>
                <h2 className="section-title">Final Result</h2>
                <p className="section-text">{project.projectOutcome}</p>
              </section>
            )}

            {/* Technical */}
            <section className="space-y-4">
              <p className="section-label">Technical Details</p>
              <h2 className="section-title">Tech Stack & Tools</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Technologies */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <p className="sub-title">Technologies</p>
                  <p className="section-text">
                    {project.tech || "Not specified"}
                  </p>
                </div>

                {/* Tools */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <p className="sub-title">Tools Used</p>
                  <p className="section-text">
                    {project.toolsUsed || "Not specified"}
                  </p>
                </div>

              </div>
            </section>

          </div>

          {/* Interaction Sidebar */}
          <div className="space-y-12">

            {/* Feedback / Comments Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-8">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <MessageSquare size={16} /> Insights Feed ({project.comments?.length || 0})
              </h3>

              <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
                {project.comments?.length === 0 ? (
                  <p className="text-[11px] text-white/20 italic">No activity yet...</p>
                ) : (
                  project.comments?.map((c, i) => (
                    <div key={i} className="space-y-2 border-l-2 border-white/5 pl-4 py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white leading-none">{c.user?.name || "User"}</span>
                        <span className="text-[8px] font-black text-[var(--pv-accent)] px-1.5 py-0.5 bg-[var(--pv-accent)]/10 rounded uppercase">{c.role}</span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {(currentUser?.role === "recruiter" || currentUser?.role === "teacher") && (
                <form onSubmit={handleAddComment} className="relative pt-4 border-t border-white/5">
                  <input
                    type="text"
                    placeholder="Add a perspective..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[var(--pv-accent)] transition-all"
                  />
                  <button type="submit" className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-[var(--pv-accent)] text-black hover:scale-105 transition-all">
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>

            {/* Recruiter Evaluation */}
            {currentUser?.role === "recruiter" && (
              <div className="bg-[var(--pv-accent)]/5 border border-[var(--pv-accent)]/10 rounded-2xl p-8 space-y-6">
                <h3 className="text-[11px] font-black text-[var(--pv-accent)] uppercase tracking-[0.3em]">Quality Rating</h3>
                <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleRate(s)}
                      onMouseEnter={() => setRating(s)}
                      onMouseLeave={() => setRating(0)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star size={20} className={rating >= s ? "fill-yellow-400 text-yellow-400" : "text-white/5"} />
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-white/20 font-bold text-center uppercase tracking-widest leading-relaxed">Anonymous Peer Review System</p>
              </div>
            )}
          </div>
        </div>

        {/* Meet the Innovators Section */}
        <section className="space-y-12 flex flex-col items-center text-center">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Meet the Innovators</h2>
            <p className="text-white/40 text-sm leading-relaxed">The brilliant collective responsible for this project's vision and execution.</p>
          </div>

          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
              {project.creatorProfiles?.map((cProfile, i) => (
                <CreatorCard key={i} creator={cProfile} BASE_URL={BASE_URL} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

function CreatorCard({ creator, BASE_URL }) {
  if (!creator) return null;
  const user = creator.userId || {};
  const profileImg = creator.image ? (creator.image.startsWith("http") ? creator.image : `${BASE_URL}${creator.image.startsWith("/") ? "" : "/"}${creator.image}`) : null;

  return (
    <div className="group relative flex flex-col items-center">
      <div className="absolute inset-x-0 bottom-0 top-16 bg-[#0A0F1B]/60 border border-white/10 rounded-3xl -z-10 group-hover:border-[var(--pv-accent)]/30 group-hover:bg-[#0A0F1B]/80 transition-all duration-500 shadow-xl" />
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute -inset-2 bg-[var(--pv-accent)]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-full h-full rounded-2xl bg-[#050A16] border border-white/10 p-1 group-hover:scale-105 transition-transform overflow-hidden relative z-10">
          {profileImg ? (
            <img src={profileImg} alt={user.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white/20 uppercase bg-white/5 rounded-xl">{user.name?.charAt(0)}</div>
          )}
        </div>
      </div>
      <div className="w-full px-6 pb-6 text-center space-y-4">
        <div className="space-y-1">
          <h4 className="text-base font-black text-white group-hover:text-[var(--pv-accent)] transition-colors truncate">{user.name || "Architect"}</h4>
          <span className="text-[9px] font-black text-[var(--pv-accent)] uppercase tracking-widest">{creator.interestedRoles?.[0] || "Innovator"}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 pt-2">
          <Link href={`/profile/${creator._id}`}>
            <button className="w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 bg-white/5 hover:bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))] text-white hover:text-black border border-white/10 flex items-center justify-center gap-2 group/btn">
              View Profile <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a href={`mailto:${user.email}`} className="block">
            <button className="w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 bg-white/5 hover:bg-white text-white/60 hover:text-black border border-white/10 flex items-center justify-center gap-2">
              Contact <Mail size={14} />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <section className="relative group">
      <div className="absolute inset-0 rounded-3xl bg-white/[0.02] border border-white/5 group-hover:border-[var(--pv-accent)]/20 transition-all duration-500" />
      <div className="relative p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[var(--pv-accent)] group-hover:scale-105 transition-transform">
            <Icon size={20} />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">{title}</h2>
        </div>
        <div className="pl-1">{children}</div>
      </div>
    </section>
  );
}