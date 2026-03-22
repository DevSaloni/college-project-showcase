"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Search,
  Eye,
  Layers,
  ChevronRight,
  UserX,
  BookOpen,
} from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function StudentListPage() {
  const { BASE_URL } = useApi();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/teacher/students`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setStudents(data.students || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [BASE_URL]);

  const filtered = students.filter(
    (s) =>
      s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase()) ||
      s.groupName?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = students.filter((s) => s.status === "Active").length;
  const groups = new Set(students.filter((s) => s.groupName).map((s) => s.groupName)).size;

  return (
    <div className="space-y-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Student Roster
          </h1>
          <p className="text-white/50 mt-1.5 text-sm">
            All students assigned to your mentorship — review profiles, track group progress and project status.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-4 top-3.5 text-white/30" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, roll no, group…"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--pv-accent)]/50 focus:bg-white/[0.07] transition-all duration-300 placeholder:text-white/25"
          />
        </div>
      </div>

      {/* ── SUMMARY STRIP ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Total Assigned", value: students.length, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: UserCheck, label: "Active", value: activeCount, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { icon: Layers, label: "Groups", value: groups, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-4 p-4 rounded-xl ${bg} border ${border}`}>
            <div className={`p-2.5 rounded-xl bg-white/5 border ${border} ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider font-semibold">{label}</p>
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROSTER TABLE ── */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-lg shadow-xl overflow-hidden">

        {/* Table caption bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[var(--pv-accent)]" />
            <span className="text-white font-semibold text-sm">
              {filtered.length} Student{filtered.length !== 1 ? "s" : ""}
              {search && <span className="text-white/40 font-normal ml-1">matching "{search}"</span>}
            </span>
          </div>
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-white/40 hover:text-white transition-colors">
              Clear filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[var(--pv-accent-2)] animate-spin-slow" />
            </div>
            <p className="text-white/40 text-sm animate-pulse">Loading student roster…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <UserX size={22} className="text-white/25" />
            </div>
            <p className="text-white/50 font-medium">No students match your search</p>
            <p className="text-white/25 text-xs">Try a different name, roll no, or group</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-widest font-bold border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-3.5 text-left">#</th>
                  <th className="px-6 py-3.5 text-left">Student</th>
                  <th className="px-6 py-3.5 text-left">Roll No</th>
                  <th className="px-6 py-3.5 text-left">Group</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr
                    key={s._id}
                    className="group border-t border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-200"
                  >
                    {/* Index */}
                    <td className="px-6 py-4 text-white/30 text-xs font-mono">{String(idx + 1).padStart(2, "0")}</td>

                    {/* Student name + email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--pv-accent)]/30 to-[var(--pv-accent-2)]/30 border border-white/15 flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {s.user?.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="text-white font-semibold leading-tight">{s.user?.name || "—"}</p>
                          <p className="text-white/35 text-xs mt-0.5 truncate max-w-[160px]">{s.user?.email || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-white/80 text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                        {s.rollNo || "—"}
                      </span>
                    </td>

                    {/* Group */}
                    <td className="px-6 py-4">
                      {s.groupName ? (
                        <div className="flex items-center gap-1.5 text-[var(--pv-accent)] text-xs font-semibold">
                          <Layers size={13} className="shrink-0" />
                          {s.groupName}
                        </div>
                      ) : (
                        <span className="text-white/25 text-xs italic">Not assigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${s.status === "Active"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === "Active" ? "bg-green-400" : "bg-red-400"}`} />
                        {s.status || "Active"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <Link href={`/teacher-dashboard/student/${s._id}`}>
                        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-black transition-all hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] duration-200"
                          style={{ background: "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))" }}>
                          <Eye size={13} />
                          View
                          <ChevronRight size={12} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Table footer */}
            <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.02] text-right">
              <p className="text-white/25 text-xs">Showing {filtered.length} of {students.length} students</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
