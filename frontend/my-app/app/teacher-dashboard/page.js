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
  X as XIcon
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";

export default function TeacherDashboardOverview() {
  const { BASE_URL } = useApi();
  const [loading, setLoading] = useState(true);
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
    },
    meetings: []
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

        const [groupsRes, studentsRes, reviewsRes, meetingsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/teacher/groups`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/teacher/students`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/progress/reviews`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/meetings/teacher`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const groupsData = await groupsRes.json();
        const studentsData = await studentsRes.json();
        const reviewsData = await reviewsRes.json();
        const meetingsData = await meetingsRes.json();

        setData({
          groups: groupsData.groups?.slice(0, 4) || [],
          studentsCount: studentsData.students?.length || 0,
          submissions: reviewsData.submissions?.slice(0, 5) || [],
          stats: {
            totalGroups: groupsData.groups?.length || 0,
            pending: reviewsData.stats?.pending || 0,
            approved: reviewsData.stats?.approved || 0,
          },
          meetings: Array.isArray(meetingsData) ? meetingsData.slice(0, 5) : [],
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [BASE_URL]);

  const updateMeetingStatus = async (meetingId, status) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/api/meetings/${meetingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      // Refresh data
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

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
            Welcome back, {teacherName || "Professor"}!
          </h1>

          <p className="text-white/60 mt-1 flex items-center gap-2">
            <Clock size={14} /> {currentDate} {teacherEmail && <span className="hidden sm:inline">• {teacherEmail}</span>}
          </p>
        </div>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Layers size={24} />}
          title="Assigned Groups"
          value={data.stats.totalGroups}
          colorClass="text-indigo-400"
          bgClass="bg-indigo-500/10"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Total Students"
          value={data.studentsCount}
          colorClass="text-blue-400"
          bgClass="bg-blue-500/10"
        />
        <StatCard
          icon={<Clock size={24} />}
          title="Pending Reviews"
          value={data.stats.pending}
          colorClass="text-amber-400"
          bgClass="bg-amber-500/10"
        />
        <StatCard
          icon={<ClipboardCheck size={24} />}
          title="Approved Tasks"
          value={data.stats.approved}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

        {/* LEFT TWO COLUMNS */}
        <div className="lg:col-span-2 space-y-8">

          {/* MY GROUPS PANEL */}
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  My Assigned Groups
                </h2>
              </div>

              <Link
                href="/teacher-dashboard/groups"
                className="text-sm font-medium text-[var(--pv-accent)] flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.groups.length > 0 ? data.groups.map((group) => (
                <Link
                  href={`/teacher-dashboard/groups/${group._id}`}
                  key={group._id}
                  className="group relative overflow-hidden p-6 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[var(--pv-accent)] transition-colors line-clamp-1">
                    {group.name}
                  </h3>
                  <p className="text-sm text-white/40 mb-4 line-clamp-1">{group.project}</p>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-white/30">{group.students} Students</span>
                    <span className={`px-2 py-1 rounded-md border ${group.status.includes('Progress') || group.status.includes('Approved')
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-white/5 text-white/50 border-white/10'
                      }`}>
                      {group.status}
                    </span>
                  </div>
                </Link>
              )) : (
                <div className="col-span-2 p-10 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/30 text-center gap-4">
                  <Layers size={40} />
                  <p>No groups assigned to you yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS PANEL */}
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white/10 rounded-xl text-white">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ActionCard href="/teacher-dashboard/reviews" icon={<FolderGit2 size={24} />} title="Review Submissions" color="group-hover:text-blue-400" />
              <ActionCard href="/teacher-dashboard/student" icon={<Users size={24} />} title="Student List" color="group-hover:text-purple-400" />
              <ActionCard href="/teacher-dashboard/groups" icon={<MessageSquare size={24} />} title="Message Groups" color="group-hover:text-amber-400" />
            </div>
          </div>

          {/* UPCOMING MEETINGS PANEL */}
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                  <Video size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Upcoming Meetings</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {data.meetings && data.meetings.length > 0 ? data.meetings.map((meeting) => (
                <div key={meeting._id} className="p-5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10">
                      <span className="text-[10px] font-black uppercase text-white/40">{new Date(meeting.date).toLocaleDateString(undefined, {month: 'short'})}</span>
                      <span className="text-lg font-bold text-white leading-none">{new Date(meeting.date).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{meeting.title}</h4>
                      <p className="text-xs text-white/40">{meeting.group?.groupName} • {meeting.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {meeting.status === 'requested' ? (
                      <>
                        <button 
                          onClick={() => updateMeetingStatus(meeting._id, 'approved')}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => updateMeetingStatus(meeting._id, 'cancelled')}
                          className="px-4 py-2 bg-white/5 text-white/40 rounded-xl text-xs font-bold hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                        meeting.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-100'
                      }`}>
                        {meeting.status}
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="p-10 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/30 text-center gap-4">
                  <Video size={40} className="opacity-20" />
                  <p>No meetings scheduled for this week.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - RECENT SUBMISSIONS */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
              <FolderGit2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Recent Submissions</h2>
          </div>

          <div className="space-y-3">
            {data.submissions.length === 0 ? (
              <p className="text-white/50 text-sm">No recent submissions found.</p>
            ) : (
              data.submissions.map((sub, i) => (
                <Link
                  key={i}
                  href={`/teacher-dashboard/reviews/${sub.progressId}/${sub.milestoneId}`}
                  className="block"
                >
                  <div className="flex items-start justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Week {sub.week} Progress
                      </p>
                      <p className="text-xs text-white/50 mt-1 max-w-[160px] truncate">
                        {sub.groupName}
                      </p>
                      <p className="text-xs text-[var(--pv-accent)] mt-0.5 max-w-[160px] truncate opacity-70">
                        {sub.studentName}
                      </p>
                    </div>

                    {sub.status === "pending" ? (
                      <span className="shrink-0 px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold uppercase">
                        Review
                      </span>
                    ) : (
                      <ChevronRight size={18} className="text-white/30 self-center" />
                    )}
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
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bgClass} ${colorClass}`}>
        {icon}
      </div>

      <h3 className="text-3xl font-extrabold text-white mt-4">{value}</h3>
      <p className="text-sm text-white/60">{title}</p>
    </div>
  );
}

function ActionCard({ href, icon, title, color }) {
  return (
    <Link href={href} className="block group">
      <div className="h-32 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center flex flex-col justify-center items-center">

        <div className={`mb-3 flex justify-center text-white/60 transition-colors ${color}`}>
          {icon}
        </div>

        <h3 className="text-white font-semibold text-sm">{title}</h3>

      </div>
    </Link>
  );
}
