"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, FolderGit2, CheckCircle2, Clock, XCircle, ChevronRight, Filter } from "lucide-react";
import { useApi } from "@/context/ApiContext";

const TABS = ["pending", "approved", "rejected"];

export default function ReviewProjectsPage() {
  const { BASE_URL } = useApi();

  const [activeTab, setActiveTab] = useState("pending");
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalGroups: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const res = await fetch(
        `${BASE_URL}/api/progress/reviews?status=${activeTab}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch data");
        return;
      }

      setSubmissions(data.submissions || []);
      setStats(data.stats || {});
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) =>
      `${item.groupName} ${item.studentName} ${item.projectTitle}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, submissions]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── HEADER & NAVIGATION ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
            Weekly Progress
          </h1>
          <p className="text-white/40 text-sm">
            Review, evaluate, and manage student project milestone submissions.
          </p>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard color="blue" icon={FolderGit2} title="Total Submissions" value={stats.totalGroups || 0} />
        <StatCard color="yellow" icon={Clock} title="Pending Review" value={stats.pending || 0} />
        <StatCard color="green" icon={CheckCircle2} title="Approved" value={stats.approved || 0} />
        <StatCard color="red" icon={XCircle} title="Needs Revision" value={stats.rejected || 0} />
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--pv-accent)]/5 rounded-full blur-[80px] -z-10" />

        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full md:w-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab
                ? "bg-white/10 text-white shadow-lg shadow-black/20"
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={16} className="text-white/40 group-focus-within:text-[var(--pv-accent)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by group or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--pv-accent)] focus:ring-1 focus:ring-[var(--pv-accent)] transition-all"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Filter size={14} className="text-white/20" />
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-white/40 text-xs uppercase tracking-wider font-semibold border-b border-white/10">
                <th className="p-6 whitespace-nowrap">Group & Project</th>
                <th className="p-6 whitespace-nowrap">Student</th>
                <th className="p-6 whitespace-nowrap">Milestone</th>
                <th className="p-6 whitespace-nowrap">Submitted</th>
                <th className="p-6 whitespace-nowrap">Status</th>
                <th className="p-6 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-white/40">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[var(--pv-accent)] animate-spin" />
                      Loading submissions...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-red-400 bg-red-500/5">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-white/30">
                      <div className="p-6 rounded-full bg-white/5">
                        <FolderGit2 size={48} />
                      </div>
                      <div>
                        <p className="font-bold text-white/60">No submissions found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && filteredSubmissions.map((item) => (
                <tr key={item.milestoneId} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[var(--pv-accent)] transition-colors line-clamp-1">{item.groupName}</span>
                      <span className="text-xs text-white/40 mt-1 line-clamp-1">{item.projectTitle}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 uppercase">
                        {item.studentName?.charAt(0) || "S"}
                      </div>
                      <span className="text-sm text-white/80 font-medium">{item.studentName}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold whitespace-nowrap">
                      Week {item.week}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-sm text-white/60 whitespace-nowrap">
                      {new Date(item.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-6 text-right">
                    <Link
                      href={`/teacher-dashboard/reviews/${item.progressId}/${item.milestoneId}`}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border-b-2 active:translate-y-0.5 active:border-b-0 ${item.status === "pending"
                        ? "bg-[var(--pv-accent)] text-black border-black/20 hover:bg-[var(--pv-accent-2)]"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {item.status === "pending" ? "Review Now" : "View Details"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({ title, value, color, icon: Icon }) {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    yellow: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    green: "text-[var(--pv-accent)] bg-[var(--pv-accent)]/10 border-[var(--pv-accent)]/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const style = colors[color] || colors.blue;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 ${style.split(' ')[0].replace('text-', 'bg-')}`} />

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${style}`}>
        <Icon size={24} />
      </div>

      <p className="text-sm font-medium text-white/50 tracking-wide uppercase">{title}</p>
      <p className="text-4xl font-black text-white mt-1 group-hover:scale-105 origin-left transition-transform">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 dot-bg-amber-400",
    approved:
      "bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] border-[var(--pv-accent)]/20 dot-bg-[var(--pv-accent)]",
    rejected:
      "bg-red-500/10 text-red-400 border-red-500/20 dot-bg-red-400",
  };

  const style = styles[status] || styles.pending;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg border uppercase tracking-wider ${style.split(' dot-bg-')[0]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.split(' dot-bg-')[1] || 'bg-white'}`} />
      {status}
    </span>
  );
}
