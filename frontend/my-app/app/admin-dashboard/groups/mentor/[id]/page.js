"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  ArrowLeft,
  Layers,
  GraduationCap,
  Calendar,
  User,
  ShieldCheck,
  Mail,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";

export default function MentorGroupsPage() {
  const { id } = useParams(); // mentorId
  const { BASE_URL } = useApi();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/group/mentor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const json = await res.json();
        setGroups(json.groups || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [id, BASE_URL]);


  return (
    <div className="space-y-10 relative pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--pv-accent)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
              <span className="p-3 bg-[var(--pv-accent)]/10 rounded-xl border border-[var(--pv-accent)]/30">
                <Users className="text-[var(--pv-accent)]" size={28} />
              </span>
              Mentor Groups Overview
            </h1>
            <p className="text-white/60 mt-3 text-sm flex items-center gap-2">
              <Layers size={14} className="text-[var(--pv-accent-2)]" />
              Detailed breakdown of assigned groups and student members
            </p>
          </div>

          <Link href={`/admin-dashboard/teachers/${id}`}>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.05)]">
              <ArrowLeft size={16} /> Back to Profile
            </button>
          </Link>
        </div>

        {/* GROUPS LIST */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white/[0.02] border border-white/10 rounded-2xl shadow-xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Users className="text-white/40" size={24} />
            </div>
            <p className="text-white/60 font-semibold text-lg">No groups currently assigned</p>
            <p className="text-white/40 text-sm">Assign groups to this mentor from the group management section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {groups.map((group) => (
              <div
                key={group._id}
                className="relative rounded-2xl bg-white/[0.03] border border-white/10 shadow-xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300 group/card"
              >
                {/* Top Gradient Glow */}
                <div
                  className="absolute inset-x-0 top-0 h-[3px] opacity-70 group-hover/card:opacity-100 transition-opacity"
                  style={{
                    background: "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
                  }}
                />

                <div className="p-6 md:p-8">
                  {/* GROUP HEADER INFO */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/30 flex items-center justify-center shadow-[0_0_15px_rgba(var(--pv-accent),0.1)] flex-shrink-0">
                        <Layers size={24} className="text-[var(--pv-accent)]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                          {group.groupName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1.5 text-sm text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                            <GraduationCap size={14} className="text-[var(--pv-accent)]/70" />
                            {group.department}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                            <Calendar size={14} className="text-[var(--pv-accent-2)]/70" />
                            Year {group.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end bg-white/5 px-4 py-3 rounded-xl border border-white/5 min-w-[140px]">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
                        <Users size={12} className="text-[var(--pv-accent)]" />
                        Total Students
                      </span>
                      <span className="text-2xl font-extrabold text-white">
                        {group.students.length}
                      </span>
                    </div>
                  </div>

                  {/* STUDENTS TABLE */}
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <User size={16} className="text-white/50" />
                      Student Roster
                    </h3>

                    {group.students.length === 0 ? (
                      <div className="p-6 text-center rounded-xl bg-white/5 border border-white/5 border-dashed">
                        <p className="text-white/40 text-sm italic">
                          No students are currently enrolled in this group.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.01]">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                          <thead className="text-[11px] text-white/50 bg-white/5 uppercase font-semibold tracking-wider">
                            <tr>
                              <th className="px-6 py-4 rounded-tl-xl border-b border-white/10 font-bold">Name</th>
                              <th className="px-6 py-4 border-b border-white/10 font-bold">Roll No</th>
                              <th className="px-6 py-4 border-b border-white/10 font-bold">Email</th>
                              <th className="px-6 py-4 rounded-tr-xl border-b border-white/10 font-bold text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {group.students.map((student) => (
                              <tr
                                key={student._id}
                                className="hover:bg-white/[0.04] transition-colors duration-200 group/row"
                              >
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[var(--pv-accent)]/20 border border-[var(--pv-accent)]/30 flex items-center justify-center text-[var(--pv-accent)] font-bold shadow-inner">
                                    {student.userId?.name ? student.userId.name.charAt(0).toUpperCase() : <User size={14} />}
                                  </div>
                                  {student.userId?.name || "Unknown"}
                                </td>
                                <td className="px-6 py-4 text-white/70 font-mono text-xs">
                                  {student.rollNo ? (
                                    <span className="flex items-center gap-2">
                                      <BookOpen size={12} className="text-white/30" />
                                      {student.rollNo}
                                    </span>
                                  ) : "-"}
                                </td>
                                <td className="px-6 py-4 text-white/70">
                                  {student.userId?.email ? (
                                    <span className="flex items-center gap-2">
                                      <Mail size={12} className="text-white/30 group-hover/row:text-[var(--pv-accent)] transition-colors" />
                                      {student.userId.email}
                                    </span>
                                  ) : "-"}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {student.status === "Active" || !student.status ? (
                                    <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                      <ShieldCheck size={12} />
                                      {student.status || "Active"}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                      {student.status}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
