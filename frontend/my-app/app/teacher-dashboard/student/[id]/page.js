"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  BookOpen,
  GraduationCap,
  Layers,
  Calendar,
  Star,
  Github,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Package,
  Hash,
  Users,
  Award,
  Lightbulb,
  Code2,
  ExternalLink,
  Cpu,
  BadgeCheck,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function StudentProfilePage() {
  const { BASE_URL } = useApi();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [groupProject, setGroupProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/teacher/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("student detials:", data);
        if (res.ok) {
          setStudent(data.student);
          setProjects(data.projects || []);

          const grpRes = await fetch(`${BASE_URL}/api/teacher/groups`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const grpData = await grpRes.json();
          if (grpRes.ok && grpData.groups?.length > 0) {
            const matchedGroup = grpData.groups?.find(
              (g) => g.name === data.student?.groupName
            );
            if (matchedGroup) {
              const projRes = await fetch(
                `${BASE_URL}/api/proposal/group/${matchedGroup._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (projRes.ok) {
                const projData = await projRes.json();

                setGroupProject(projData);
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, BASE_URL]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[var(--pv-accent-2)] animate-spin-slow" />
        </div>
        <p className="text-white/40 text-sm animate-pulse">Loading student profile…</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <p className="text-white font-semibold text-lg">Student not found</p>
        <Link href="/teacher-dashboard/student">
          <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors">
            ← Back to Roster
          </button>
        </Link>
      </div>
    );
  }

  /* ── Derived values ── */

  const isActive = student.status === "Active" || !student.status;

  const approvedProjects = projects.filter(
    (p) => p.status?.toLowerCase() === "approved"
  ).length;

  const pendingProjects = projects.filter(
    (p) => p.status?.toLowerCase() === "pending"
  ).length;

  const rejectedProjects = projects.filter(
    (p) => p.status?.toLowerCase() === "rejected"
  ).length;

  const proposal = groupProject?.proposal;
  const submissionStatus = proposal?.status || "Pending";

  const normalizedProposalStatus = submissionStatus.toLowerCase();

  const statusStyle = {
    approved: {
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
      dot: "bg-green-400",
      icon: CheckCircle,
    },
    rejected: {
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      dot: "bg-red-400",
      icon: XCircle,
    },
    pending: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
      dot: "bg-yellow-400",
      icon: Clock,
    },
  };

  const pStat = statusStyle[normalizedProposalStatus] || statusStyle.pending;

  return (
    <div className="space-y-6 pb-16">

      {/* BREADCRUMB */}
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Student Profile
          </h1>
          <p className="text-white/40 text-sm mt-1">
            View student academic information and project activity
          </p>
        </div>

        <Link
          href="/teacher-dashboard/student"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Students
        </Link>

      </div>
      {/* ═══════════════════════════════════════════════ */}
      {/* PROFILE HEADER                                  */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden">
        {/* accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--pv-accent)]/60 to-transparent" />
        {/* subtle glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[var(--pv-accent)]/8 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start gap-6 p-6 md:p-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--pv-accent)]/30 to-blue-600/20 border border-white/10 flex items-center justify-center text-3xl font-black text-white">
              {student.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <span className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-[#0f0f0f] ${isActive ? "bg-green-400" : "bg-red-400"}`} />
          </div>

          {/* Core identity — shown ONCE */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{student.name}</h1>
              {isActive && <BadgeCheck size={20} className="text-[var(--pv-accent)] shrink-0" />}
            </div>

            <p className="text-white/40 text-sm mb-4">{student.email}</p>

            <div className="flex flex-wrap gap-2">
              <Chip icon={Hash} text={`Roll ${student.rollNo}`} />
              <Chip icon={GraduationCap} text={student.department} />
              <Chip icon={Calendar} text={`Year ${student.year}`} />
              {student.groupName && <Chip icon={Users} text={`Group: ${student.groupName}`} accent />}
              {student.mentorName && <Chip icon={BadgeCheck} text={`Mentor: ${student.mentorName}`} />}
            </div>
          </div>

          {/* Quick project status pill */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{projects.length}</p>
              <p className="text-white/30 text-xs font-medium uppercase tracking-widest">Projects</p>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* 4 STAT PILLS                                    */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="Approved" value={approvedProjects} color="green" />
        <MiniStat label="Pending" value={pendingProjects} color="yellow" />
        <MiniStat label="Rejected" value={rejectedProjects} color="red" />
      </div>
      {/* ═══════════════════════════════════════════════ */}
      {/* MAIN 2-COLUMN LAYOUT                            */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-5 gap-6 items-start">

        {/* ── LEFT (2/5): Proposal Status & Info ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Group Proposal Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/8 bg-white/[0.02]">
              <ClipboardList size={15} className="text-indigo-400" />
              <h2 className="text-white font-semibold text-sm">Project Proposal</h2>
              {student.groupName && (
                <span className="ml-auto text-xs text-white/30 font-medium">{student.groupName}</span>
              )}
            </div>

            {!student.groupName ? (
              <BlankSlate icon={Layers} text="No group assigned" sub="Student is not in any group yet." />
            ) : !proposal ? (
              <BlankSlate icon={FileText} text="No proposal yet" sub="The group hasn't submitted a proposal." />
            ) : (
              <div className="p-5 space-y-4">
                {/* Status badge */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${pStat.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${pStat.dot} animate-pulse`} />
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${pStat.color}`}>{submissionStatus}</p>
                    <p className="text-white/35 text-xs">Proposal review status</p>
                  </div>
                  <pStat.icon size={16} className={pStat.color} />
                </div>

                {/* Title */}
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Title</p>
                  <p className="text-white font-semibold text-base leading-snug">{proposal.title || "Untitled"}</p>
                </div>

                {/* Description */}
                {proposal.description && (
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Description</p>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-4">{proposal.description}</p>
                  </div>
                )}

                {/* Tech Stack */}
                {proposal.techStack && (
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proposal.techStack.split(",").map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/15 text-[var(--pv-accent)] text-[11px] font-semibold">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submitted date */}
                {proposal.submittedAt && (
                  <p className="text-white/25 text-xs flex items-center gap-1.5">
                    <Calendar size={11} />
                    Submitted {new Date(proposal.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}

                {/* Mentor feedback */}
                {proposal.teacherFeedback && (
                  <div className="mt-2 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageSquare size={12} className="text-amber-400" />
                      <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">Your Feedback</span>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed italic">"{proposal.teacherFeedback}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tech Tags from Projects (only if exists) */}
          {projects.length > 0 && (() => {
            const tags = [...new Set(
              projects.flatMap((p) => (p.tech ? p.tech.split(",").map((t) => t.trim()) : [])).filter(Boolean)
            )].slice(0, 10);
            return tags.length > 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={14} className="text-blue-400" />
                  <h3 className="text-white text-sm font-semibold">Student's Tech Skills</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-blue-500/8 border border-blue-500/15 text-blue-300 text-[11px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>

        {/* ── RIGHT (3/5): Project Submissions ── */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <Code2 size={15} className="text-orange-400" />
                <h2 className="text-white font-semibold text-sm">Project Submissions</h2>
              </div>
              <span className="text-xs text-white/30 font-medium bg-white/5 border border-white/8 px-3 py-1 rounded-full">
                {projects.length} total
              </span>
            </div>

            {projects.length === 0 ? (
              <BlankSlate icon={Code2} text="No projects submitted" sub="This student hasn't submitted any projects yet." />
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {projects.map((proj, i) => (
                  <StudentSubmissionCard key={proj._id || i} project={proj} idx={i + 1} />))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── COMPONENTS ── */

function Chip({ icon: Icon, text, accent }) {
  if (!text) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${accent
      ? "bg-[var(--pv-accent)]/10 border-[var(--pv-accent)]/20 text-[var(--pv-accent)]"
      : "bg-white/5 border-white/8 text-white/50"
      }`}>
      <Icon size={11} />
      {text}
    </span>
  );
}

function MiniStat({ label, value, color }) {
  const colors = {
    green: "bg-green-500/10 border-green-500/15 text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-500/15 text-yellow-400",
    red: "bg-red-500/10 border-red-500/15 text-red-400",
    blue: "bg-blue-500/10 border-blue-500/15 text-blue-400",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${colors[color] || colors.blue}`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[11px] font-semibold opacity-60 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function StudentSubmissionCard({ project, idx }) {
  const statusStyle = {
    approved: "text-green-400 bg-green-500/10 border-green-500/20",
    pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    rejected: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const status = statusStyle[project.status] || statusStyle.pending;

  const statusText = project.status
    ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
    : "Pending";

  return (
    <div className="p-5 hover:bg-white/[0.03] transition-colors">

      <h3 className="text-white font-semibold text-sm mb-1">
        Week {project.week} – {project.title || "Untitled Task"}
      </h3>

      {project.createdAt && (
        <p className="text-white/30 text-xs mb-2">
          Submitted:{" "}
          {new Date(project.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      )}

      {project.github && (
        <a
          href={project.github}
          target="_blank"
          className="text-blue-400 text-xs hover:underline block mb-1"
        >
          Repo
        </a>
      )}

      {project.description && (
        <p className="text-white/40 text-xs mb-2 leading-relaxed">
          {project.description}
        </p>
      )}

      <span
        className={`inline-block text-xs px-3 py-1 rounded-full border ${status}`}
      >
        {statusText}
      </span>
    </div>
  );
}
function BlankSlate({ icon: Icon, text, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <div className="p-3.5 bg-white/5 rounded-2xl border border-white/8">
        <Icon size={22} className="text-white/15" />
      </div>
      <p className="text-white/35 font-medium text-sm">{text}</p>
      {sub && <p className="text-white/20 text-xs max-w-xs">{sub}</p>}
    </div>
  );
}
