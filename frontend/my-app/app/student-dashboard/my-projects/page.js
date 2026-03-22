"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";
import {
  FolderIcon,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  ArrowRight,
  Loader2,
  Calendar,
  User,
  Sparkles,
  Layers,
  BookOpen,
  GraduationCap,
  CalendarDays,
  ChevronRight
} from "lucide-react";

/* ================= PAGE ================= */

export default function StudentAcademicProjectsPage() {
  const { BASE_URL } = useApi();

  const [semesterProjects, setSemesterProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${BASE_URL}/api/student/my-academic-projects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSemesterProjects(res.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [BASE_URL]);

  /* ===== SUMMARY CALCULATIONS ===== */

  const totalProjects = semesterProjects.reduce(
    (acc, sem) => acc + sem.projects.length,
    0
  );

  const activeCount = semesterProjects
    .flatMap((sem) => sem.projects)
    .filter((p) => p.status === "Active").length;

  const completedCount = semesterProjects
    .flatMap((sem) => sem.projects)
    .filter((p) => p.status === "Completed").length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin" />
        </div>
        <p className="text-white/40 text-sm animate-pulse">Loading academic records…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
        <p className="text-red-400 font-bold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── PAGE HEADER ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[var(--pv-accent)] text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles size={13} />
          <span>Academic Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          My Academic Projects
        </h1>
        <p className="text-white/40 text-sm">
          A semester-wise record of your project implementations and academic progress.
        </p>
      </div>

      {/* ── SUMMARY GRID (Matching Proposal Page Group Info) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={CalendarDays}
          label="Semesters"
          value={semesterProjects.length}
          color="text-[var(--pv-accent)]"
          bg="bg-[var(--pv-accent)]/10"
          border="border-[var(--pv-accent)]/20"
        />
        <SummaryCard
          icon={Layers}
          label="Total Projects"
          value={totalProjects}
          color="text-blue-400"
          bg="bg-blue-500/10"
          border="border-blue-500/20"
        />
        <SummaryCard
          icon={Clock}
          label="Active"
          value={activeCount}
          color="text-amber-400"
          bg="bg-amber-500/10"
          border="border-amber-500/20"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={completedCount}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          border="border-emerald-500/20"
        />
      </div>

      {/* ── SEMESTERS SECTION ── */}
      {semesterProjects.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-20 text-center opacity-40">
          <FolderIcon size={40} className="mx-auto mb-4 text-white/20" />
          <p className="text-white font-bold">No academic projects found.</p>
          <p className="text-white/40 text-sm mt-1">Your semester records will appear here.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {semesterProjects.map((sem) => (
            <div key={sem.semester} className="space-y-8">

              {/* Semester Header */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-black italic">
                  S{sem.semester}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    Semester {sem.semester}
                  </h2>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">
                    {sem.projects.length} Project Checkpoint{sem.projects.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Project Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sem.projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SUMMARY CARD ================= */

function SummaryCard({ icon: Icon, label, value, color, bg, border }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200 shadow-lg`}>
      <div className={`p-2 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
        <p className={`font-black text-lg truncate ${color}`}>{value || "0"}</p>
      </div>
    </div>
  );
}

/* ================= PROJECT CARD ================= */

function ProjectCard({ project }) {
  const statusConfig = {
    Active: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    Completed: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    Pending: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    Rejected: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  };

  const sc = statusConfig[project.status] || statusConfig.Pending;

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col gap-5 hover:bg-white/[0.04] transition-all duration-300 group shadow-2xl">

      {/* Title + Status */}
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg font-bold text-white group-hover:text-[var(--pv-accent)] transition-colors leading-snug line-clamp-2">
          {project.title}
        </h3>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shrink-0 border ${sc.bg} ${sc.border} ${sc.color}`}>
          {project.status}
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30 shrink-0">
            <User size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-white/30 text-[9px] uppercase font-bold tracking-widest">Mentor</p>
            <p className="text-white/80 text-xs font-bold truncate">{project.mentorName || "Not Assigned"}</p>
          </div>
        </div>

        {project.startDate && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30 shrink-0">
              <Calendar size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-white/30 text-[9px] uppercase font-bold tracking-widest">Timeline</p>
              <p className="text-white/80 text-xs font-bold truncate">{project.startDate} — {project.endDate}</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      {(project.status === "Active" || project.status === "Completed") && (
        <div className="space-y-2">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Progress</span>
            <span className="text-sm font-black text-[var(--pv-accent)] italic">{project.progressPercent || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-[var(--pv-accent)] rounded-full transition-all duration-700"
              style={{ width: `${project.progressPercent || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer / Actions */}
      <div className="pt-4 mt-auto border-t border-white/5 flex gap-2">
        {(project.status === "Active" || project.status === "Completed") && (
          <Link
            href={`/student-dashboard/my-projects/${project._id}`}
            className="flex-1 flex items-center justify-center p-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            View Details
          </Link>
        )}
        
        {project.status === "Active" && (
          <Link
            href="/student-dashboard/project-progress"
            className="flex-1 flex items-center justify-center p-3 rounded-xl bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] border border-[var(--pv-accent)]/20 hover:bg-[var(--pv-accent)] hover:text-black text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(var(--pv-accent-rgb),0.1)] group/track"
          >
            <span>Track</span>
            <ChevronRight size={14} className="ml-1 group-hover/track:translate-x-1 transition-transform" />
          </Link>
        )}

        {(project.status === "Pending" || project.status === "Rejected") && (
          <Link
            href="/student-dashboard/proposal"
            className={`flex-1 flex items-center justify-center p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all group/btn ${
              project.status === "Rejected"
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{project.status === "Rejected" ? "Edit Proposal" : "Proposal Workspace"}</span>
            <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}