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
        setRecentGroups(data);
      } catch (err) {
        console.error("Recent groups error:", err);
      }
    };

    fetchRecentGroups();
  }, [BASE_URL]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 relative z-10 w-full h-[70vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[var(--pv-accent-2)] animate-spin-slow"></div>
        </div>
        <p className="text-white/60 font-medium tracking-wide animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--pv-accent)] mb-2">
            <Activity size={18} />
            <span className="text-sm font-semibold tracking-wider uppercase">
              Live Dashboard
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {adminName || "Admin"}!
          </h1>

          <p className="text-white/60 mt-1 flex items-center gap-2">
            <Clock size={14} /> {currentDate} {adminEmail && <span className="hidden sm:inline">• {adminEmail}</span>}
          </p>
        </div>

        <Link href="/admin-dashboard/groups/create-groups">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-black shadow-lg hover:scale-105 transition-all duration-300"
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
        <StatCard
          icon={<GraduationCap size={24} />}
          title="Total Students"
          value={data?.stats?.totalStudents || 0}
          colorClass="text-blue-400"
          bgClass="bg-blue-500/10"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Total Teachers"
          value={data?.stats?.totalTeachers || 0}
          colorClass="text-purple-400"
          bgClass="bg-purple-500/10"
        />
        <StatCard
          icon={<Layers size={24} />}
          title="Active Groups"
          value={data?.stats?.activeGroups || 0}
          colorClass="text-green-400"
          bgClass="bg-green-500/10"
        />
        <StatCard
          icon={<FileText size={24} />}
          title="Total Projects"
          value={data?.stats?.totalProjects || 0}
          colorClass="text-orange-400"
          bgClass="bg-orange-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* GROUP STATUS */}
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Project Groups Status
                </h2>
              </div>

              <Link
                href="/admin-dashboard/groups"
                className="text-sm font-medium text-[var(--pv-accent)] flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white/10 rounded-xl text-white">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ActionCard
                href="/admin-dashboard/students/add"
                icon={<UserPlus size={24} />}
                title="Add Student"
                color="group-hover:text-blue-400"
              />
              <ActionCard
                href="/admin-dashboard/teachers/add"
                icon={<UserCheck size={24} />}
                title="Add Teacher"
                color="group-hover:text-purple-400"
              />
              <ActionCard
                href="/admin-dashboard/groups/create-groups"
                icon={<Users size={24} />}
                title="Assemble Group"
                color="group-hover:text-green-400"
              />
            </div>
          </div>
        </div>

        {/* RIGHT - RECENT GROUPS */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Layers size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Recent Groups</h2>
          </div>

          <div className="space-y-3">
            {recentGroups.length === 0 ? (
              <p className="text-white/50 text-sm">No groups created yet</p>
            ) : (
              recentGroups.map((group) => (
                <Link
                  key={group._id}
                  href={`/admin-dashboard/groups/${group._id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer">

                    <div>
                      <p className="text-white font-semibold text-sm">
                        {group.groupName}
                      </p>
                      <p className="text-xs text-white/50">
                        Mentor: {group?.mentor?.userId?.name || "N/A"}
                      </p>
                    </div>

                    <ChevronRight size={18} className="text-white/30" />

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

function StatCard({ icon, title, value, colorClass, bgClass }) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
        {icon}
      </div>

      <h3 className="text-3xl font-extrabold text-white mt-4">{value}</h3>
      <p className="text-sm text-white/60">{title}</p>
    </div>
  );
}

function StatusBadge({ title, value, color, bgColor, borderColor }) {
  return (
    <div className={`flex flex-col p-6 rounded-xl border ${borderColor} ${bgColor}`}>
      <h4 className={`text-4xl font-black mb-2 ${color}`}>{value}</h4>
      <p className="text-sm text-white/70">{title}</p>
    </div>
  );
}

function ActionCard({ href, icon, title, color }) {
  return (
    <Link href={href} className="block group">
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center">
        <div className={`mb-3 text-white/60 ${color}`}>{icon}</div>
        <h3 className="text-white font-semibold text-sm">{title}</h3>
      </div>
    </Link>
  );
}