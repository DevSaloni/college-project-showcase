"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";
import {
  ArrowLeft,
  CalendarDays,
  User,
  Layers,
  CheckCircle2,
  Clock,
  ClipboardList,
  Cpu,
  ListChecks,
  Activity,
  Trophy,
  AlertCircle,
  Hash,
  Box,
  Layout,
  Code,
  CheckCircle,
  FileText,
  Workflow,
  ShieldCheck,
  Zap,
  Paperclip,
  GraduationCap,
  Users,
  BookOpen,
  Target,
  Star
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { BASE_URL } = useApi();
  const router = useRouter();

  const [project, setProject] = useState({
    _id: "loading",
    title: "Loading Project Data...",
    description: "Synchronizing workspace payload...",
    features: "Fetching Core Mechanics",
    techStack: "Syncing Architectures",
    status: "Active",
    mentor: { name: "Resolving Mentor..." },
    students: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/student/project-details/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setProject(res.data.data);
          toast.success("Project details loaded successfully");
        } else {
          toast.error("Failed to authenticate project node");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Data integrity failure in transmission");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, BASE_URL]);

  // The blocking full page loader was removed for instantaneous layout rendering

  if (!project && !loading) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 rounded-3xl bg-red-500/5 border border-red-500/10 text-center animate-in zoom-in-95 duration-500">
        <AlertCircle size={48} className="text-red-500/40 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white mb-2">Project Not Found</h2>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">The requested project could not be located in your records.</p>
        <button
          onClick={() => router.back()}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const featuresList = project.features ? project.features.split(",").map(f => f.trim()) : [];
  const techStackList = project.techStack ? project.techStack.split(",").map(t => t.trim()) : [];

  const statusConfig = {
    Approved: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: CheckCircle2,
      dot: "bg-emerald-400",
    },
    Completed: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: CheckCircle2,
      dot: "bg-emerald-400",
    },
    Active: {
      color: "text-[var(--pv-accent)]",
      bg: "bg-[var(--pv-accent)]/10",
      border: "border-[var(--pv-accent)]/20",
      icon: Zap,
      dot: "bg-[var(--pv-accent)]",
    },
    Rejected: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: AlertCircle,
      dot: "bg-red-400",
    },
    Pending: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: Clock,
      dot: "bg-amber-400",
    },
  };

  const sc = statusConfig[project.status] || statusConfig.Pending;
  const StatusIcon = sc.icon;

  const calculateRemainingDays = () => {
    if (!project?.endDate) return "0";
    const today = new Date();
    const end = new Date(project.endDate);
    if (isNaN(end.getTime())) return "0";
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Project Details
          </h1>
          <p className="text-white/40 text-sm">
            {project.title}
          </p>
          <Link
            href="/student-dashboard/my-projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to projects
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {project.status === "Active" && (
            <Link
              href="/student-dashboard/project-progress"
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] border border-[var(--pv-accent)]/20 rounded-2xl hover:bg-[var(--pv-accent)] hover:text-black transition-all font-bold text-sm"
            >
              <Activity size={16} />
              <span>Track Workspace</span>
            </Link>
          )}

          <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border ${sc.bg} ${sc.border}`}>
            <span className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`} />
            <StatusIcon size={15} className={sc.color} />
            <span className={`text-sm font-bold ${sc.color}`}>{project.status}</span>
          </div>
        </div>
      </div>

      {/* ── GROUP INFO CARDS (Like Proposal Page) ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Layers, label: "Group", value: project.groupName, color: "text-[var(--pv-accent)]", bg: "bg-[var(--pv-accent)]/10", border: "border-[var(--pv-accent)]/20" },
          { icon: BookOpen, label: "Department", value: project.department, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: GraduationCap, label: "Mentor", value: project.mentorName, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { icon: Users, label: "Year", value: project.year, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
          { icon: CalendarDays, label: "Semester", value: `Sem ${project.semester}`, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-2 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
              <p className={`font-bold text-sm truncate ${color}`}>{value || "—"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── PROJECT DURATION BANNER (Like Proposal Page) ── */}
      {(project.status === "Active" || project.status === "Completed") && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 ${project.status === "Completed" ? "bg-emerald-500/5" : "bg-[var(--pv-accent)]/5"}`} />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg border ${sc.bg} ${sc.border}`}>
                <StatusIcon size={16} className={sc.color} />
              </div>
              <p className={`text-sm font-bold ${sc.color}`}>
                {project.status === "Completed" ? "Project Completed — Archive Locked" : "Project Active — Timeline Running"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40">Progress</span>
                <span className="text-lg font-black text-white">{project.progressPercent || 0}%</span>
              </div>
              <div className="w-12 h-12 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={Math.PI * 40} strokeDashoffset={Math.PI * 40 * (1 - (project.progressPercent || 0) / 100)} className={project.status === "Completed" ? "text-emerald-400" : "text-[var(--pv-accent)]"} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Weeks", value: `${project.totalWeeks} Weeks`, icon: CalendarDays, color: "text-[var(--pv-accent)]" },
              { label: "Start Date", value: project.startDate ? new Date(project.startDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A', icon: CalendarDays, color: "text-blue-400" },
              { label: "End Date", value: project.endDate ? new Date(project.endDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A', icon: CalendarDays, color: "text-purple-400" },
              { label: "Days Remaining", value: project.status === "Completed" ? "0 Days" : `${calculateRemainingDays()} Days`, icon: Clock, color: "text-amber-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-black/20 rounded-xl p-4 border border-white/5">
                <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-1">{label}</p>
                <p className={`font-black text-lg ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TEACHER FEEDBACK BANNER ── */}
      {project.teacherFeedback && project.status === "Completed" && (
        <div className="flex items-start gap-4 p-5 rounded-2xl border bg-emerald-500/10 border-emerald-500/20">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Final Verdict / Evaluation
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              {project.teacherFeedback}
            </p>
          </div>
        </div>
      )}

      {/* ── CONTENT PANELS ── */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20">
            <ClipboardList size={18} className="text-[var(--pv-accent)]" />
          </div>
          <div>
            <p className="text-white font-bold">Execution Plan & Specs</p>
            <p className="text-white/40 text-xs">A comprehensive overview of the approved proposal variables.</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentBlock icon={AlertCircle} title="Problem Statement" content={project.problemStatement} />
            <ContentBlock icon={FileText} title="Project Description" content={project.description} />
            <ContentBlock icon={ListChecks} title="Key Features" list={featuresList} />
            <ContentBlock icon={Target} title="Expected Outcome" content={project.expectedOutcome} />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-2 mr-4 opacity-60">
                <Cpu size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">Tech Stack</span>
              </div>
              {techStackList.length > 0 ? (
                techStackList.map((t, i) => (
                  <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white/60">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-white/40 italic">Not defined.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MILESTONES ── */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl mt-8">
        <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Workflow size={18} className="text-purple-400" />
          </div>
          <div>
            <p className="text-white font-bold">Milestones & Progress Logs</p>
            <p className="text-white/40 text-xs">Tracking execution points directly mapped to initial targets.</p>
          </div>
        </div>

        <div className="p-8">
          {(!project.milestones || project.milestones.length === 0) ? (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
              <Workflow size={40} className="mb-4" />
              <p className="font-bold">No milestones logged yet.</p>
              <p className="text-xs mt-1">Milestones will appear here once submitted.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.milestones.map((m, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col h-full gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/5 px-2 py-1 rounded-md">Log {i + 1}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1">
                        <Clock size={10} />
                        Wk {m.week}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border ${m.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : m.status === "NeedsWork" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                      {m.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1 leading-snug">{m.title}</h4>
                    <p className="text-white/50 text-xs leading-[1.6] line-clamp-3">{m.description}</p>
                  </div>

                  {/* Mentor Feedback Box */}
                  <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-wider mb-1">Mentor Feedback</p>
                      <p className="text-white/60 text-xs italic line-clamp-2">
                        {m.mentorFeedback || "No feedback provided yet."}
                      </p>
                    </div>

                    {/* Files */}
                    {m.files && m.files.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.files.map((file, idx) => (
                          <a
                            key={idx}
                            href={`${BASE_URL}/${file.path.replace(/\\/g, '/')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/30 transition-all"
                          >
                            <Paperclip size={10} />
                            <span className="truncate max-w-[100px]">{file.filename}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function ContentBlock({ icon: Icon, title, content, list }) {
  return (
    <div className="space-y-3 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
      <div className="flex items-center gap-2 text-white/60">
        <Icon size={16} />
        <h4 className="text-xs font-bold uppercase tracking-wider">{title}</h4>
      </div>
      {list ? (
        <ul className="space-y-1">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/80">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--pv-accent)]/50 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
          {list.length === 0 && <p className="text-sm text-white/30 italic">Not defined.</p>}
        </ul>
      ) : (
        <p className="text-sm text-white/80 leading-relaxed font-medium">
          {content || <span className="text-white/30 italic">Not defined.</span>}
        </p>
      )}
    </div>
  );
}
