"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  FolderGit2,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Filter,
  Layout,
  Layers,
  Target,
  Activity,
  GraduationCap
} from "lucide-react";
import { useApi } from "@/context/ApiContext";
import axios from "axios";
import { toast } from "react-hot-toast";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        toast.error("Session expired. Please login again.");
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/progress/reviews?status=${activeTab}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data || {};
      setSubmissions(data.submissions || []);
      setStats(data.stats || {});
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to synchronize review queue";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab, BASE_URL]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) =>
      `${item.groupName} ${item.studentName} ${item.projectTitle}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, submissions]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Weekly Progress
          </h1>
          <p className="text-white/40 text-sm font-bold mt-2">
            Centralized portal for project evaluation. Track, review, and mentor student milestones.
          </p>
        </div>
      </div>

      {/* ── HIGH FIDELITY STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: FolderGit2, label: "Total Load", value: stats.totalGroups || 0, color: "text-[var(--pv-accent)]", bg: "bg-[var(--pv-accent)]/10", border: "border-[var(--pv-accent)]/20" },
          { icon: Clock, label: "Pending", value: stats.pending || 0, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { icon: CheckCircle2, label: "Approved", value: stats.approved || 0, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { icon: XCircle, label: "Revisions", value: stats.rejected || 0, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
          { icon: Target, label: "Capacity", value: `${Math.round(((stats.approved || 0) / (stats.totalGroups || 1)) * 100)}%`, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-2 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-extrabold mb-0.5">{label}</p>
              <p className={`font-black text-lg ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── WORKSPACE FILTERS ── */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-sm relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--pv-accent)]/5 rounded-full blur-[80px] -z-10" />

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto shadow-inner">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                ? "bg-[var(--pv-accent)] text-black shadow-lg shadow-[var(--pv-accent)]/20"
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={16} className="text-white/40 group-focus-within:text-[var(--pv-accent)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by cohort or student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-5 py-3.5 text-sm text-white font-bold placeholder:text-white/20 outline-none focus:border-[var(--pv-accent)]/50 focus:ring-0 shadow-inner transition-all"
          />
        </div>
      </div>

      {/* ── QUEUE LIST ── */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-white/5" />
            <div className="h-4 w-48 bg-white/5 rounded" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03] text-white/30 text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/10">
                  <th className="p-8">Cohort & Initiative</th>
                  <th className="p-8">Contributor</th>
                  <th className="p-8 text-center">Sprint</th>
                  <th className="p-8">Submission Date</th>
                  <th className="p-8 text-center">Status</th>
                  <th className="p-8 text-right">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {error ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center">
                      <div className="flex flex-col items-center gap-4 text-red-400/60 font-black uppercase tracking-[0.1em] text-xs">
                        <Activity size={40} className="opacity-20" />
                        <p>{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center">
                      <div className="flex flex-col items-center gap-4 text-white/20">
                        <FolderGit2 size={40} className="opacity-20" />
                        <p className="font-black text-sm tracking-widest uppercase">The queue is currently empty</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((item) => (
                    <tr key={item.milestoneId} className="group hover:bg-white/[0.04] transition-all duration-300">
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="font-black text-white text-lg tracking-tight group-hover:text-[var(--pv-accent)] transition-colors line-clamp-1">{item.groupName}</span>
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1 line-clamp-1">{item.projectTitle}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center text-xs font-black text-[var(--pv-accent)] shadow-inner">
                            {item.studentName?.charAt(0) || "S"}
                          </div>
                          <span className="text-sm text-white font-black opacity-80 uppercase tracking-tight">{item.studentName}</span>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest shadow-lg">
                          Week {item.week}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2 text-white/40 font-black text-xs uppercase tracking-tighter">
                          <Clock size={14} className="opacity-50" />
                          {new Date(item.submittedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-8 text-right">
                        <Link
                          href={`/teacher-dashboard/reviews/${item.progressId}/${item.milestoneId}`}
                          className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap ${item.status === "pending"
                            ? "bg-[var(--pv-accent)] text-black shadow-lg shadow-[var(--pv-accent)]/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                          {item.status === "pending" ? "Review" : "Open"}
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 dot-bg-amber-400",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dot-bg-emerald-400",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20 dot-bg-red-400",
  };

  const style = styles[status] || styles.pending;
  const dotColor = style.split(' dot-bg-')[1];
  const badgeColors = style.split(' dot-bg-')[0];

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-black rounded-full border uppercase tracking-widest shadow-inner ${badgeColors}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      {status}
    </span>
  );
}
