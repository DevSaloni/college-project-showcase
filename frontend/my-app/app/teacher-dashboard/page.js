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
  Layout,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function TeacherDashboardOverview() {
  const { BASE_URL } = useApi();
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");

  const [data, setData] = useState({
    groups: [],
    studentsCount: 0,
    submissions: [],
    stats: {
      totalGroups: 0,
      pending: 0,
      approved: 0,
    }
  });

  /* ===== SET DATE AND TEACHER DETAILS ===== */
  useEffect(() => {
    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("en-US", dateOptions));

    setTeacherName(localStorage.getItem("userName") || "");
    setTeacherEmail(localStorage.getItem("userEmail") || "");
  }, []);

  /* ===== FETCH DASHBOARD DATA ===== */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [groupsRes, studentsRes, reviewsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/teacher/groups`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/teacher/students`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/progress/reviews`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const groupsData = groupsRes.data || {};
        const studentsData = studentsRes.data || {};
        const reviewsData = reviewsRes.data || {};

        setData({
          groups: groupsData.groups?.slice(0, 4) || [],
          studentsCount: studentsData.students?.length || 0,
          submissions: reviewsData.submissions?.slice(0, 5) || [],
          stats: {
            totalGroups: groupsData.groups?.length || 0,
            pending: reviewsData.stats?.pending || 0,
            approved: reviewsData.stats?.approved || 0,
          }
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, [BASE_URL]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--pv-accent)] mb-2">
            <Layout size={18} />
            <span className="text-xs font-black tracking-widest uppercase mb-0.5">
              Mentor Hub
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Welcome back, {teacherName || "Professor"}!
          </h1>
          <p className="text-white/40 text-sm flex items-center gap-2 pt-1 font-bold">
            <Clock size={14} /> {currentDate} {teacherEmail && <span>• {teacherEmail}</span>}
          </p>
        </div>
      </div>

      {/* ── KPI STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Layers, label: "Assigned Groups", value: data.stats.totalGroups, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
          { icon: Users, label: "Total Students", value: data.studentsCount, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: Clock, label: "Pending Reviews", value: data.stats.pending, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { icon: ClipboardCheck, label: "Approved Tasks", value: data.stats.approved, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex flex-col p-6 rounded-3xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-3 rounded-2xl ${bg} border ${border} ${color} w-fit mb-4`}>
              <Icon size={20} />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
            <p className="text-white/40 text-[10px] uppercase tracking-wider font-extrabold">{label}</p>
          </div>
        ))}
      </div>

      {/* ── MAIN DASHBOARD GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">

          {/* ASSIGNED GROUPS PANEL */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Briefcase size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-white text-sm sm:text-base font-black">My Assigned Groups</p>
                  <p className="hidden sm:block text-white/40 text-xs font-bold text-left">Cohorts currently under your mentorship</p>
                </div>
              </div>
              <Link
                href="/teacher-dashboard/groups"
                className="px-4 py-2 rounded-xl bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] border border-[var(--pv-accent)]/20 text-xs font-black uppercase tracking-widest hover:bg-[var(--pv-accent)] hover:text-black transition-all flex items-center gap-2 shrink-0 shadow-lg"
              >
                <span className="hidden sm:inline">View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.groups.map((group) => (
                  <Link
                    href={`/teacher-dashboard/groups/${group._id}`}
                    key={group._id}
                    className="group relative overflow-hidden p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-[var(--pv-accent)]/30 hover:scale-[1.02] transition-all duration-300 shadow-lg text-left"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pv-accent)]/5 rounded-full blur-2xl -z-10 group-hover:bg-[var(--pv-accent)]/15 transition-colors" />

                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[var(--pv-accent)] transition-colors line-clamp-1">
                            {group.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${(group.status === "Approved" || group.status === "In Progress" || group.status === "Submitted") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                            {group.status}
                          </span>
                        </div>
                        <p className="text-white/50 text-xs font-bold line-clamp-2 mb-4">
                          {group.project || "Active Research Project"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-1.5 text-[var(--pv-accent)]">
                          <Users size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{group.students} Members</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
                }
                {data.groups.length === 0 && (
                  <div className="col-span-full py-20 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 text-center gap-4 bg-white/[0.01]">
                    <Layers size={48} className="opacity-20 mb-2" />
                    <p className="font-black uppercase tracking-widest text-xs">No cohorts mapped to your profile yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS ROW */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-white">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-white text-sm sm:text-base font-black">Quick Actions</p>
                <p className="hidden sm:block text-white/40 text-xs font-bold">Direct paths to mentor workflows</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 md:p-8">
              <ActionCard href="/teacher-dashboard/reviews" icon={ClipboardCheck} title="Review Queue" color="text-blue-400" bg="bg-blue-500/10 border-blue-500/20" hoverBorder="hover:border-blue-500/50" />
              <ActionCard href="/teacher-dashboard/student" icon={Users} title="Student Roster" color="text-purple-400" bg="bg-purple-500/10 border-purple-500/20" hoverBorder="hover:border-purple-500/50" />
              <ActionCard href="/teacher-dashboard/groups" icon={MessageSquare} title="Group Chat" color="text-amber-400" bg="bg-amber-500/10 border-amber-500/20" hoverBorder="hover:border-amber-500/50" />
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
                <p className="text-white text-sm sm:text-base font-black">Evaluation Queue</p>
                <p className="hidden sm:block text-white/40 text-[10px] uppercase font-black tracking-tighter">Recent Submissions</p>
              </div>
            </div>

            <div className="p-6">
              {data.submissions.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <Activity size={32} className="mx-auto mb-3 text-white/40" />
                  <p className="text-white/60 text-xs font-black uppercase tracking-widest text-center">Queue is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.submissions.map((sub, i) => (
                    <Link href={`/teacher-dashboard/reviews/${sub.progressId}/${sub.milestoneId}`} key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-[var(--pv-accent)]/30 transition-all group cursor-pointer shadow-md">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-black text-sm group-hover:text-[var(--pv-accent)] transition-colors truncate">
                          Week {sub.week} Progress
                        </p>
                        <ChevronRight size={14} className="text-white/30 group-hover:text-[var(--pv-accent)]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-wider flex items-center gap-1.5 truncate">
                          <Briefcase size={10} /> {sub.groupName}
                        </p>
                        <p className="text-[10px] text-[var(--pv-accent)] font-black flex items-center gap-1.5 truncate opacity-70 uppercase">
                          <Users size={10} /> {sub.studentName}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {data.submissions.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-white/[0.01]">
                <Link href="/teacher-dashboard/reviews" className="block text-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
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
        <h3 className="text-white font-black text-sm tracking-tight">{title}</h3>
      </div>
    </Link>
  );
}
