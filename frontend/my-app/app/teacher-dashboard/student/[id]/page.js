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



   if (!student && !loading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <AlertCircle size={48} className="text-red-400/50" />
            <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter shadow-sm mb-2">Student Not Found</h2>
               <p className="text-white/30 text-xs font-bold uppercase tracking-widest px-4 max-w-sm">The requested student profile could not be synchronized with the repository hub.</p>
            </div>
            <button onClick={() => window.history.back()} className="mt-4 px-8 py-3 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl">Return to Control Center</button>
         </div>
      );
   }

   /* ── Derived values ── */

   const isActive = student?.status === "Active" || !student?.status;

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
      <div className="space-y-6 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

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
         <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.025] overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--pv-accent)]/60 to-transparent" />
            {/* subtle glow */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[var(--pv-accent)]/8 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start gap-6 p-6 md:p-8">
               {/* Avatar */}
               <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--pv-accent)]/30 to-blue-600/20 border border-white/10 flex items-center justify-center text-4xl font-black text-white shadow-inner">
                     {student?.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#0f0f0f] ${isActive ? "bg-green-400" : "bg-red-400"}`} />
               </div>

               {/* Core identity */}
               <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                     <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none uppercase">{student?.name || "Loading..."}</h1>
                     {isActive && <BadgeCheck size={24} className="text-[var(--pv-accent)] shrink-0" />}
                  </div>

                  <p className="text-white/40 text-sm font-bold tracking-tight mb-5 uppercase">{student?.email || "Loading..."}</p>

                  <div className="flex flex-wrap gap-2">
                     <Chip icon={Hash} text={`Roll ${student?.rollNo || "-"}`} />
                     <Chip icon={GraduationCap} text={student?.department || "..."} />
                     <Chip icon={Calendar} text={`Year ${student?.year || "-"}`} />
                     {student?.groupName && <Chip icon={Users} text={`Group: ${student.groupName}`} accent />}
                     {student?.mentorName && <Chip icon={BadgeCheck} text={`Mentor: ${student.mentorName}`} />}
                  </div>
               </div>

               {/* Quick project status pill */}
               <div className="shrink-0 flex flex-col items-end gap-2">
                  <div className="text-right p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                     <p className="text-4xl font-black text-white tracking-tighter">{projects.length}</p>
                     <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Total Submissions</p>
                  </div>
               </div>
            </div>
         </div>

         {/* ═══════════════════════════════════════════════ */}
         {/* 4 STAT PILLS                                    */}
         {/* ═══════════════════════════════════════════════ */}
         <div className="grid grid-cols-3 gap-4">
            <MiniStat label="Approved" value={approvedProjects} color="green" />
            <MiniStat label="Pending" value={pendingProjects} color="yellow" />
            <MiniStat label="Rejected" value={rejectedProjects} color="red" />
         </div>

         {/* ═══════════════════════════════════════════════ */}
         {/* MAIN 2-COLUMN LAYOUT                            */}
         {/* ═══════════════════════════════════════════════ */}
         <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* ── LEFT (2/5): Proposal Status & Info ── */}
            <div className="lg:col-span-2 space-y-6">

               {/* Group Proposal Card */}
               <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] overflow-hidden shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/8 bg-white/[0.02]">
                     <ClipboardList size={16} className="text-[var(--pv-accent)]" />
                     <h2 className="text-white font-black text-xs uppercase tracking-widest">Active Proposal</h2>
                     {student?.groupName && (
                        <span className="ml-auto text-[10px] text-white/30 font-black uppercase tracking-widest">{student.groupName}</span>
                     )}
                  </div>

                  {!student?.groupName ? (
                     <BlankSlate icon={Layers} text="No group assigned" sub="Student is not in any group yet." />
                  ) : !proposal ? (
                     <BlankSlate icon={FileText} text="No proposal yet" sub="The group hasn't submitted a proposal." />
                  ) : (
                     <div className="p-6 space-y-6">
                        {/* Status badge */}
                        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${pStat.bg} shadow-lg shadow-black/20`}>
                           <div className="relative">
                              <div className={`w-3 h-3 rounded-full ${pStat.dot} animate-pulse shadow-glow shadow-${pStat.dot.split('-')[1]}-400/50`} />
                           </div>
                           <div className="flex-1">
                              <p className={`font-black text-sm uppercase tracking-widest ${pStat.color}`}>{submissionStatus}</p>
                              <p className="text-white/35 text-[10px] font-bold uppercase tracking-tight mt-0.5">Approval Hierarchy Status</p>
                           </div>
                           <pStat.icon size={20} className={pStat.color} />
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5">
                           <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">Designation</p>
                           <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">{proposal.title || "Untitled Blueprint"}</p>
                        </div>

                        {/* Description */}
                        {proposal.description && (
                           <div className="space-y-1.5">
                              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">Methodology</p>
                              <p className="text-white/60 text-sm leading-relaxed font-bold line-clamp-4 ">"{proposal.description}"</p>
                           </div>
                        )}

                        {/* Tech Stack */}
                        {proposal.techStack && (
                           <div className="space-y-3">
                              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">Technology Stack</p>
                              <div className="flex flex-wrap gap-2">
                                 {proposal.techStack.split(",").map((t, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest shadow-md">
                                       {t.trim()}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Submitted date */}
                        {proposal.submittedAt && (
                           <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                              <Calendar size={12} className="text-white/20" />
                              <p className="text-white/25 text-[10px] font-black uppercase tracking-widest">
                                 Synced: {new Date(proposal.submittedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                           </div>
                        )}

                        {/* Mentor feedback */}
                        {proposal.teacherFeedback && (
                           <div className="mt-2 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 shadow-inner">
                              <div className="flex items-center gap-1.5 mb-2.5">
                                 <MessageSquare size={14} className="text-amber-400" />
                                 <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Control Hub Directive</span>
                              </div>
                              <p className="text-white/60 text-xs leading-relaxed font-bold italic">"{proposal.teacherFeedback}"</p>
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
                     <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                           <Cpu size={16} className="text-blue-400" />
                           <h3 className="text-white text-xs font-black uppercase tracking-widest">Artifact Mastery</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {tags.map((t) => (
                              <span key={t} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest shadow-md">
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
               <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] overflow-hidden shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 bg-white/[0.02]">
                     <div className="flex items-center gap-2.5">
                        <Code2 size={16} className="text-orange-400" />
                        <h2 className="text-white font-black text-xs uppercase tracking-widest">Sprint Submissions</h2>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/30 bg-white/5 border border-white/8 px-4 py-1.5 rounded-full shadow-inner">
                        {projects.length} Total Logs
                     </span>
                  </div>

                  {projects.length === 0 ? (
                     <BlankSlate icon={Code2} text="No artifacts found" sub="This student hasn't synchronized any project logs yet." />
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
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${accent
         ? "bg-[var(--pv-accent)]/10 border-[var(--pv-accent)]/20 text-[var(--pv-accent)] shadow-[0_0_15px_-5px_var(--pv-accent)]"
         : "bg-white/5 border-white/8 text-white/50 hover:bg-white/10"
         }`}>
         <Icon size={12} />
         {text}
      </span>
   );
}

function MiniStat({ label, value, color }) {
   const colors = {
      green: "bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/5",
      yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 shadow-yellow-500/5",
      red: "bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/5",
      blue: "bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-blue-500/5",
   };
   return (
      <div className={`rounded-2xl border p-5 transition-all hover:scale-[1.02] shadow-xl ${colors[color] || colors.blue}`}>
         <p className="text-3xl font-black tracking-tighter">{value}</p>
         <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">{label}</p>
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
      <div className="p-6 md:p-8 hover:bg-white/[0.04] transition-all group">
         <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-white font-black text-lg tracking-tight group-hover:text-[var(--pv-accent)] transition-colors uppercase">
               Sprint {project.week} – {project.title || "Untitled Operation"}
            </h3>
            <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${status}`}>
               {statusText}
            </span>
         </div>

         {project.createdAt && (
            <div className="flex items-center gap-2 mb-4">
               <Clock size={12} className="text-white/20" />
               <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                  Logged on: {new Date(project.createdAt).toLocaleDateString("en-US", {
                     day: "numeric",
                     month: "short",
                     year: "numeric",
                  })}
               </p>
            </div>
         )}

         {project.description && (
            <p className="text-white/50 text-sm mb-5 leading-relaxed font-bold">
               "{project.description}"
            </p>
         )}

         {project.github && (
            <a
               href={project.github}
               target="_blank"
               className="inline-flex items-center gap-2 text-[var(--pv-accent)] text-[10px] font-black uppercase tracking-widest hover:underline bg-[var(--pv-accent)]/5 px-3 py-1.5 rounded-lg border border-[var(--pv-accent)]/10 shadow-inner"
            >
               <Github size={12} />
               View Source Repository hub
               <ExternalLink size={10} />
            </a>
         )}
      </div>
   );
}

function BlankSlate({ icon: Icon, text, sub }) {
   return (
      <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
         <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl">
            <Icon size={32} className="text-white/20" />
         </div>
         <div className="space-y-1">
            <p className="text-white/40 font-black text-sm uppercase tracking-widest">{text}</p>
            {sub && <p className="text-white/20 text-[10px] font-bold uppercase tracking-tight max-w-[200px] mx-auto">{sub}</p>}
         </div>
      </div>
   );
}