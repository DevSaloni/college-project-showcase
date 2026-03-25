"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Monitor,
  BookOpen,
  User,
  GraduationCap,
  Layers,
  Calendar,
  Activity,
  CheckCircle,
  Github,
  Link as LinkIcon
} from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function AdminGroupView() {
  const { BASE_URL } = useApi();
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/group/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        console.log("view details group data", data);
        setGroup(data);
      } catch (err) {
        console.error("Failed to fetch group", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, BASE_URL]);


  if (!loading && !group) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="p-4 bg-red-500/10 rounded-full">
          <Users className="w-12 h-12 text-red-400" />
        </div>
        <p className="text-xl font-semibold text-white">Group not found</p>
        <Link href="/admin-dashboard/groups">
          <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
            Go Back
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-[var(--pv-accent)]" />
            Group Details
          </h1>
          <p className="text-white/60 mt-2 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--pv-accent)]"></span>
            Viewing details for <span className="font-semibold text-white">{group?.groupName}</span>
          </p>
        </div>

        <Link href="/admin-dashboard/groups">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300">
            <ArrowLeft size={16} /> Back to Groups
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT MAIN COLUMN ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* ===== GROUP INFO CARD ===== */}
          <div className="relative p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
            <div
              className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
              style={{
                background: "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
              }}
            />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[var(--pv-accent)]/20 rounded-xl text-[var(--pv-accent)]">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">General Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBadge icon={<Layers />} label="Group Name" value={group?.groupName} />
              <InfoBadge icon={<GraduationCap />} label="Department" value={group?.department} />
              <InfoBadge icon={<Calendar />} label="Year" value={group?.year} />
              <InfoBadge
                icon={<Activity />}
                label="Status"
                value={
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${group?.status === "Active"
                      ? "bg-green-500/20 text-green-400 border border-green-500/20"
                      : group?.status === "Completed"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        : "bg-white/10 text-white/70 border border-white/10"
                      }`}
                  >
                    {group?.status}
                  </span>
                }
              />
            </div>
          </div>

          {/* ===== PROJECT CARD ===== */}
          <ProjectCard group={group} />
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="space-y-6">
          {/* ===== MENTOR CARD ===== */}
          <MentorCard mentor={group?.mentor} />

          {/* ===== STUDENTS CARD ===== */}
          <StudentsCard students={group?.students} />
        </div>
      </div>
    </div>
  );
}

// ===== REUSABLE SUB-COMPONENTS =====
function InfoBadge({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="p-2 rounded-lg bg-white/10 text-white/80 mt-1">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <div>
        <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">{label}</p>
        <div className="text-white font-medium">{value || "-"}</div>
      </div>
    </div>
  );
}

function ProjectCard({ group }) {
  return (
    <div className="relative p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl flex flex-col">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
          <Monitor size={20} />
        </div>
        <h2 className="text-xl font-bold text-white">Project Details</h2>
      </div>

      {group?.project ? (
        <div className="space-y-6 max-h-[450px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-all pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">{group?.project?.title}</h3>
            <div className="text-white/70 leading-relaxed text-sm p-4 bg-white/5 rounded-xl border border-white/10 break-words">
              {group?.project?.proposalId?.description || "No description provided."}
            </div>
            <div className="flex items-center gap-2 mt-4 text-white/50 text-sm">
              <Calendar size={14} />
              <span>
                Duration: {group?.project?.startDate ? new Date(group.project.startDate).toLocaleDateString() : "-"} - {group?.project?.endDate ? new Date(group.project.endDate).toLocaleDateString() : "-"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Tech Stack</p>
              <p className="text-white font-medium break-all">{group?.project?.proposalId?.techStack || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                <span className="text-white font-medium">{group?.project?.status}</span>
              </div>
            </div>
          </div>

          {(group?.project?.github || group?.project?.documentation) && (
            <div className="flex flex-wrap gap-4 pt-2">
              {group?.project?.github && (
                <Link href={group.project.github} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm group">
                  <Github size={16} className="group-hover:text-white transition-colors" /> GitHub Repo
                </Link>
              )}
              {group?.project?.documentation && (
                <Link href={group.project.documentation} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm group">
                  <LinkIcon size={16} className="group-hover:text-white transition-colors" /> Documentation
                </Link>
              )}
            </div>
          )}

          {group?.milestones?.length > 0 && (
            <div className="mt-6 space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-blue-400" />
                <h4 className="text-white font-semibold text-lg">Milestones Progress</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {group.milestones.map((progress) => (
                  <div key={progress._id} className="p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-[rgba(255,255,255,0.08)] transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-white font-medium flex items-center gap-2">
                        <User size={16} className="text-white/50" />
                        {progress.studentId?.name || "Unknown"}
                      </p>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/80">
                        {progress.progressPercent || 0}% Complete
                      </span>
                    </div>

                    <div className="w-full bg-white/5 rounded-full h-1.5 mb-5 shadow-inner overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress.progressPercent || 0}%` }}
                      ></div>
                    </div>

                    <ul className="text-white/70 text-sm space-y-4">
                      {progress.milestones.map((m) => (
                        <li key={m._id} className="flex gap-3 items-start border-l-2 border-white/10 pl-4 ml-1 relative">
                          <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-[#1a1a1a] ${m.status === 'Completed' ? 'bg-green-500' :
                              m.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-gray-500'
                            }`}></div>
                          <div className="flex-1 -mt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                              <span className="font-semibold text-white/90 text-base">{m.title}</span>
                              <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold w-fit ${m.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                  m.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                    'bg-white/10 text-white/50 border border-white/10'
                                }`}>
                                {m.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              {m.repoLink && (
                                <a href={m.repoLink} target="_blank" className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors border border-white/5">
                                  <Github size={14} /> View Repository
                                </a>
                              )}
                              {m.mentorFeedback && (
                                <span className="text-xs text-white/70 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <CheckCircle size={14} className="text-purple-400" /> "{m.mentorFeedback}"
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 flex-1 h-full min-h-[300px]">
          <div className="p-4 bg-white/5 rounded-full border border-white/10 inline-block">
            <Monitor className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/60 font-medium">No project assigned yet</p>
          <p className="text-white/40 text-sm max-w-xs">This group hasn't submitted a project or hasn't had one approved yet.</p>
        </div>
      )}
    </div>
  );
}

function MentorCard({ mentor }) {
  return (
    <div className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <User size={18} />
        </div>
        <h2 className="text-lg font-bold text-white">Assigned Mentor</h2>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-white/20 flex items-center justify-center text-xl font-bold text-white">
          {mentor?.userId?.name?.charAt(0) || "M"}
        </div>
        <div>
          <p className="text-white font-semibold">{mentor?.userId?.name || "Not Assigned"}</p>
          <p className="text-white/60 text-xs mt-0.5">{mentor?.userId?.email || ""}</p>
        </div>
      </div>
    </div>
  );
}

function StudentsCard({ students }) {
  return (
    <div className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
            <Users size={18} />
          </div>
          <h2 className="text-lg font-bold text-white">Team Members</h2>
        </div>
        <span className="px-2.5 py-1 bg-white/10 rounded-lg text-xs font-semibold text-white/80">
          {students?.length || 0}
        </span>
      </div>

      {students?.length > 0 ? (
        <ul className="space-y-3">
          {students.map((s, index) => (
            <li
              key={s._id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/80">
                {s.userId?.name?.charAt(0) || index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{s.userId?.name}</p>
                <p className="text-white/50 text-xs mt-0.5">Roll No: {s.rollNo}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/50 text-sm">No students assigned</p>
        </div>
      )}
    </div>
  );
}