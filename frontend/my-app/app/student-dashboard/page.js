"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Layers,
  ClipboardCheck,
  Clock,
  ChevronRight,
  FolderGit2,
  MessageSquare,
  Activity,
  Briefcase,
  Video,
  Calendar,
  Check,
  Star,
  Upload,
  ShieldCheck,
  GraduationCap,
  Zap,
  Target,
  Sparkles,
  TrendingUp,
  Layout,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";
import axios from "axios";

export default function StudentDashboardOverview() {
  const { BASE_URL } = useApi();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const [data, setData] = useState({
    activeProjects: [],
    academicStats: {
      total: 0,
      active: 0,
      completed: 0,
    },
    currentProgress: null,
    milestones: [],
    feedback: []
  });

  /* ===== SET DATE AND STUDENT DETAILS ===== */
  useEffect(() => {
    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("en-US", dateOptions));

    setStudentName(localStorage.getItem("userName") || "");
    setStudentEmail(localStorage.getItem("userEmail") || "");
  }, []);

  /* ===== FETCH DASHBOARD DATA ===== */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [progressRes, academicRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/progress/current`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/student/my-academic-projects`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const progressData = progressRes.data || {};
        const academicData = academicRes.data.data || [];

        // Flatten projects for stats
        const allProjects = academicData.flatMap(sem => sem.projects);

        setData({
          activeProjects: allProjects.slice(0, 4),
          academicStats: {
            total: allProjects.length,
            active: allProjects.filter(p => p.status === "Active").length,
            completed: allProjects.filter(p => p.status === "Completed").length,
          },
          currentProgress: progressData.project || null,
          milestones: progressData.milestones || [],
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setTimeout(() => setLoading(false), 500); // slight delay to show loading animation safely
      }
    };

    fetchDashboardData();
  }, [BASE_URL]);

  const currentPercent = data.currentProgress?.progressPercent || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--pv-accent)] mb-2">
            <Layout size={18} />
            <span className="text-xs font-bold tracking-widest uppercase mb-0.5">
              Live Overview
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight capitalize">
            Welcome back, {studentName || "Student"}!
          </h1>
          <p className="text-white/40 text-sm flex items-center gap-2 pt-1 font-medium">
            <Clock size={14} /> {currentDate} {studentEmail && <span>• {studentEmail}</span>}
          </p>
        </div>
      </div>

      {/* ── KPI STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Layers, label: "Total Projects", value: data.academicStats.total, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
          { icon: Activity, label: "Active Workspaces", value: data.academicStats.active, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: ClipboardCheck, label: "Completed Projects", value: data.academicStats.completed, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { icon: Target, label: "Total Milestones", value: data.milestones.length, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex flex-col p-6 rounded-3xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-3 rounded-2xl ${bg} border ${border} ${color} w-fit mb-4`}>
              <Icon size={20} />
            </div>
            {loading ? (
              <div className="h-9 w-12 bg-white/10 rounded-xl animate-pulse mb-1" />
            ) : (
              <h3 className="text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
            )}
            <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">{label}</p>
          </div>
        ))}
      </div>

      {/* ── MAIN DASHBOARD GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">

          {/* CURRENT DEPLOYMENT (Match Project Progress style) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Briefcase size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-white text-sm sm:text-base font-bold">Current Deployment</p>
                  <p className="hidden sm:block text-white/40 text-xs">Primary active project assigned to you</p>
                </div>
              </div>
              {data.currentProgress && (
                <Link
                  href={`/student-dashboard/my-projects/${data.currentProgress._id}`}
                  className="px-4 py-2 rounded-xl bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] border border-[var(--pv-accent)]/20 text-xs font-bold hover:bg-[var(--pv-accent)] hover:text-black transition-all flex items-center gap-2 shrink-0"
                >
                  <span className="hidden sm:inline">Workspace</span>
                  <ChevronRight size={14} className="sm:hidden" />
                </Link>
              )}
            </div>

            <div className="p-4 sm:p-8">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 animate-pulse">
                  <div className="h-16 w-16 bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 rounded-2xl shadow-xl" />
                  <div className="h-5 w-48 bg-white/10 rounded-full" />
                  <div className="h-3 w-32 bg-white/5 rounded-full" />
                </div>
              ) : data.currentProgress ? (
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-all shadow-lg text-left">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 bg-[var(--pv-accent)]/5 group-hover:bg-[var(--pv-accent)]/15 transition-colors duration-700" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="p-3.5 rounded-2xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 text-[var(--pv-accent)] shadow-xl shrink-0">
                        <Zap size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-black text-white tracking-tight mb-2 leading-tight break-words line-clamp-2">
                          {data.currentProgress.title}
                        </h3>
                        <p className="text-white/60 text-sm font-semibold flex items-center gap-2 truncate">
                          <GraduationCap size={16} className="shrink-0" /> Mentor: {data.currentProgress.mentorName || "Unassigned"}
                          {data.currentProgress.mentorId && (
                            <Link
                              href={`/student-dashboard/mentor/${data.currentProgress.mentorId}`}
                              className="text-[var(--pv-accent)] hover:underline text-xs ml-2 font-black uppercase tracking-widest"
                            >
                              View Profile
                            </Link>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-1 shrink-0 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner min-w-[140px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                        Completion Progress
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-[var(--pv-accent)]">
                          {currentPercent}
                        </span>
                        <span className="text-white/40 font-bold text-lg">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 relative z-10 w-full mb-8">
                    <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-[#FF9A8B] to-[var(--pv-accent)] transition-all duration-1000 relative" style={{ width: `${currentPercent}%` }}>
                        <div className="absolute top-0 right-0 bottom-0 w-20 bg-white/20 blur-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Approved Milestones", value: `${data.milestones.filter(m => m.status === 'Approved').length} / ${data.milestones.length || 0}`, icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                      { label: "Pending Reviews", value: data.milestones.filter(m => m.status === 'Pending').length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                      { label: "Next Deadline", value: `Week ${data.milestones.length + 1}`, icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                      { label: "Latest Activity", value: "Progress Sync", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-black/20 rounded-2xl p-4 border border-white/5 shadow-md flex items-start gap-4 hover:bg-black/40 transition-colors">
                        <div className={`p-2 rounded-xl ${stat.bg} ${stat.border} ${stat.color} shrink-0`}>
                          <stat.icon size={16} />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-bold text-white/50 mb-1">{stat.label}</p>
                          <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 text-center gap-4 bg-white/[0.01]">
                  <Layers size={48} className="opacity-20 mb-2" />
                  <p className="font-semibold text-sm">No active project deployment mapped yet.</p>
                  <Link href="/student-dashboard/proposal" className="mt-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold tracking-wider uppercase border border-white/10 transition-all text-white">Create Proposal</Link>
                </div>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS ROW */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-white">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-white text-sm sm:text-base font-bold">Quick Actions</p>
                <p className="hidden sm:block text-white/40 text-xs">Direct paths to major workflows</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 md:p-8">
              <ActionCard href="/student-dashboard/my-projects" icon={Briefcase} title="My Projects" color="text-blue-400" bg="bg-blue-500/10 border-blue-500/20" hoverBorder="hover:border-blue-500/50" />
              <ActionCard href="/student-dashboard/proposal" icon={FolderGit2} title="Create Proposal" color="text-purple-400" bg="bg-purple-500/10 border-purple-500/20" hoverBorder="hover:border-purple-500/50" />
              <ActionCard href="/student-dashboard/project-progress" icon={TrendingUp} title="Track Progress" color="text-amber-400" bg="bg-amber-500/10 border-amber-500/20" hoverBorder="hover:border-amber-500/50" />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-8 lg:sticky lg:top-8 self-start">

          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--pv-accent)]/5 rounded-full blur-[80px] -z-10" />

            <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 text-[var(--pv-accent)]">
                <Target size={18} />
              </div>
              <div>
                <p className="text-white text-sm sm:text-base font-black">Recent Milestones</p>
                <p className="hidden sm:block text-white/40 text-[10px] uppercase font-black tracking-tighter">Synchronization logs</p>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(k => (
                    <div key={k} className="h-16 w-full bg-white/[0.03] border border-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : data.milestones.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <Activity size={32} className="mx-auto mb-3 text-white/40" />
                  <p className="text-white/60 text-xs font-black uppercase tracking-widest text-center">Queue is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.milestones.slice(-5).reverse().map((ms, i) => (
                    <Link href="/student-dashboard/project-progress" key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-[var(--pv-accent)]/30 transition-all group cursor-pointer shadow-md">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-black text-sm group-hover:text-[var(--pv-accent)] transition-colors truncate">
                          Week {ms.week} Progress
                        </p>
                        <ChevronRight size={14} className="text-white/30 group-hover:text-[var(--pv-accent)]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-white/40 font-black uppercase tracking-wider flex items-center gap-1.5 truncate">
                            <Clock size={10} /> {new Date(ms.submittedAt).toLocaleDateString()}
                          </p>
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${ms.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              ms.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {ms.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {!loading && data.milestones.length > 5 && (
              <div className="p-4 border-t border-white/10 bg-white/[0.01]">
                <Link href="/student-dashboard/project-progress" className="block text-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  Open Portal
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

/* ===== REUSABLE COMPONENTS ===== */

function ActionCard({ href, icon: Icon, title, color, bg, hoverBorder }) {
  return (
    <Link href={href} className="block group h-full">
      <div className={`h-full p-6 sm:p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 transition-all text-center flex flex-col justify-center items-center ${hoverBorder} hover:bg-white/[0.04] shadow-lg`}>
        <div className={`mb-4 w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${color} ${bg} group-hover:scale-110 shadow-md`}>
          <Icon size={20} />
        </div>
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>
    </Link>
  );
}
