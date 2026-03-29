"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Layers,
  FileText,
  PlusCircle,
  Activity,
  UserPlus,
  UserCheck,
  Briefcase,
  Clock,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";

export default function AdminOverview() {
  const { BASE_URL } = useApi();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [recentGroups, setRecentGroups] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  /* ===== SET DATE AND ADMIN DETAILS ===== */
  useEffect(() => {
    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("en-US", dateOptions));

    setAdminName(localStorage.getItem("userName") || "");
    setAdminEmail(localStorage.getItem("userEmail") || "");
  }, []);

  /* ===== FETCH DASHBOARD DATA ===== */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/overview`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [BASE_URL]);

  /* ===== FETCH RECENT GROUPS ===== */
  useEffect(() => {
    const fetchRecentGroups = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/recent-groups`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentGroups(data);
        } else {
          setRecentGroups([]);
        }
      } catch (err) {
        console.error("Recent groups error:", err);
        setRecentGroups([]);
      }
    };

    fetchRecentGroups();
  }, [BASE_URL]);


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--pv-accent)] mb-2">
            <Activity size={18} />
            <span className="text-xs font-black tracking-widest uppercase mb-0.5">
              Live Analytics
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Welcome back, {adminName || "Admin"}!
          </h1>

          <p className="text-white/40 text-sm flex items-center gap-2 pt-1 font-bold">
            <Clock size={14} /> {currentDate} {adminEmail && <span className="hidden sm:inline">• {adminEmail}</span>}
          </p>
        </div>

        <Link href="/admin-dashboard/groups/create-groups">
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-black shadow-lg hover:scale-105 transition-all duration-300"
            style={{
              background:
                "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
            }}
          >
            <PlusCircle size={18} /> New Group
          </button>
        </Link>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: GraduationCap, label: "Total Students", value: data?.stats?.totalStudents || 0, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: Users, label: "Total Teachers", value: data?.stats?.totalTeachers || 0, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { icon: Layers, label: "Active Groups", value: data?.stats?.activeGroups || 0, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { icon: FileText, label: "Total Projects", value: data?.stats?.totalProjects || 0, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Briefcase size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-white text-sm sm:text-base font-black">Project Groups Status</p>
                  <p className="hidden sm:block text-white/40 text-xs font-bold text-left">Real-time cohort synchronization and assignment</p>
                </div>
              </div>

              <Link
                href="/admin-dashboard/groups"
                className="px-4 py-2 rounded-xl bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] border border-[var(--pv-accent)]/20 text-xs font-black uppercase tracking-widest hover:bg-[var(--pv-accent)] hover:text-black transition-all flex items-center gap-2 shrink-0 shadow-lg"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatusBadge
                title="Active Groups"
                value={data?.groupStatus?.activeGroups || 0}
                color="text-indigo-400"
                borderColor="border-indigo-500/20"
                bgColor="bg-indigo-500/10"
              />
              <StatusBadge
                title="Completed Groups"
                value={data?.groupStatus?.completedGroups || 0}
                color="text-emerald-400"
                borderColor="border-emerald-500/20"
                bgColor="bg-emerald-500/10"
              />
              <StatusBadge
                title="Unassigned Mentor"
                value={data?.groupStatus?.groupsWithoutMentor || 0}
                color="text-amber-400"
                borderColor="border-amber-500/30"
                bgColor="bg-amber-500/10"
              />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white/10 border border-white/10 rounded-xl text-white">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/admin-dashboard/students/add", icon: UserPlus, title: "Add Student", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                { href: "/admin-dashboard/teachers/add", icon: UserCheck, title: "Add Teacher", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                { href: "/admin-dashboard/groups/create-groups", icon: Users, title: "Assemble Group", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
              ].map(({ href, icon: Icon, title, color, bg, border }) => (
                <Link key={title} href={href} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-[var(--pv-accent)]/30 hover:scale-[1.05] transition-all duration-300 group">
                  <div className={`p-3 rounded-xl ${bg} border ${border} ${color} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">{title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - RECENT GROUPS */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers size={18} />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">Recent Groups</h2>
          </div>

          <div className="p-4 space-y-3">
            {!Array.isArray(recentGroups) || recentGroups.length === 0 ? (
              <div className="py-10 text-center opacity-40">
                <Layers size={32} className="mx-auto mb-2" />
                <p className="font-black uppercase tracking-widest text-[10px]">No activity</p>
              </div>
            ) : (
              recentGroups.map((group) => (
                <Link
                  key={group._id}
                  href={`/admin-dashboard/groups/${group._id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:border-[var(--pv-accent)]/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center text-[var(--pv-accent)] group-hover:scale-110 transition-transform shadow-lg">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-black text-sm tracking-tight truncate">
                          {group?.groupName}
                        </p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider truncate">
                          Mentor: <span className="capitalize">{group?.mentor?.userId?.name || "N/A"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-white font-black text-xs">{group.projectProgress?.progressPercent || 0}%</p>
                        <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-[var(--pv-accent)] transition-all duration-500"
                            style={{ width: `${group.projectProgress?.progressPercent || 0}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-white/20 group-hover:text-[var(--pv-accent)] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===== REUSABLE COMPONENTS ===== */

function StatusBadge({ title, value, color, bgColor, borderColor }) {
  return (
    <div className={`flex flex-col p-6 rounded-3xl border ${borderColor} ${bgColor} group hover:scale-[1.02] transition-all duration-300`}>
      <h4 className={`text-4xl font-black mb-1 ${color}`}>{value}</h4>
      <p className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold">{title}</p>
    </div>
  );
}