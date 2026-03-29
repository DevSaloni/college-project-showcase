"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  UserPlus,
  UserCheck,
  Layers,
  BookOpen
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";

export default function ManageStudents() {
  const { BASE_URL } = useApi();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/student/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load students");
          return;
        }

        setStudents(data.students || []);

      } catch (err) {
        console.error(err);
        toast.error("Server error while loading students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [BASE_URL]);

  //delete the student 
  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this student?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs rounded bg-gray-600 text-white"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              const loadingToast = toast.loading("Deleting student...");

              try {
                const res = await fetch(`${BASE_URL}/api/student/delete/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });

                const data = await res.json();

                toast.dismiss(loadingToast);

                if (!res.ok) {
                  toast.error(data.message || "Failed to delete student");
                  return;
                }

                setStudents((prev) =>
                  prev.filter((s) => s._id !== id)
                );

                toast.success("Student deleted successfully");

              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Server error");
              }
            }}
            className="px-3 py-1 text-xs rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 2000,
    });
  };
  /* ================= SEARCH FILTER ================= */
  const filteredStudents = students.filter((s) => {
    const name = s?.userId?.name?.toLowerCase() || "";
    const rollNo = s?.rollNo?.toLowerCase() || "";

    return (
      name.includes(search.toLowerCase()) ||
      rollNo.includes(search.toLowerCase())
    );
  });


  /* ================= STATS ================= */
  const totalStudents = students.length;
  const activeStudents = students.filter(
    (s) => s.status === "Active"
  ).length;
  const groupsCreated = new Set(
    students
      .filter((s) => s.group)
      .map((s) => s.group._id)
  ).size;



  return (
    <div className="space-y-10">

      {/* HEADER + SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Student Roster
          </h1>
          <p className="text-white/40 mt-2 text-sm font-bold">
            Complete database of enrolled students — monitor academic status, group memberships, and projects.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-3.5 text-white/40"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, department..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                 text-white text-sm outline-none focus:border-white/30 focus:bg-white/10 
                 transition-all duration-300"
            />
          </div>

          <Link href="/admin-dashboard/students/add">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest text-black shadow-lg hover:scale-105 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
              }}
            >
              <Plus size={14} /> Add Student
            </button>
          </Link>

        </div>
      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Total Students", value: totalStudents, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: UserCheck, label: "Active Status", value: activeStudents, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { icon: Layers, label: "Assigned Groups", value: groupsCreated, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-4 p-5 rounded-2xl ${bg} border ${border} hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-3 rounded-xl bg-white/5 border ${border} ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">{label}</p>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-[var(--pv-accent)]" />
            <span className="text-white font-black text-sm uppercase tracking-widest">
              Student Records ({filteredStudents.length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-[10px] uppercase tracking-widest font-black border-b border-white/10 bg-white/[0.02]">
                <th className="px-8 py-4 text-left">Student</th>
                <th className="px-8 py-4 text-left">Roll No</th>
                <th className="px-8 py-4 text-left">Group</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredStudents.map((s) => (
                <tr
                  key={s._id}
                  className="group border-t border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pv-accent)]/30 to-[var(--pv-accent-2)]/30 border border-white/15 flex items-center justify-center text-sm font-black text-white shrink-0">
                        {s.userId?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="text-white font-black leading-tight tracking-tight capitalize">{s.userId?.name || "—"}</p>
                        <p className="text-white/35 text-xs font-bold mt-0.5">{s.userId?.email || "—"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className="font-mono text-white/80 text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-bold uppercase tracking-wider">
                      {s.rollNo || "—"}
                    </span>
                  </td>

                  <td className="px-8 py-5">
                    {s.group ? (
                      <div className="flex items-center gap-2 text-[var(--pv-accent)] text-xs font-black uppercase tracking-tight">
                        <Layers size={14} className="shrink-0 opacity-70" />
                        {s.group.groupName || s.group.name}
                      </div>
                    ) : (
                      <span className="text-white/30 text-xs italic">Unassigned</span>
                    )}
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.status === "Active"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${s.status === "Active" ? "bg-green-400" : "bg-red-400"}`} />
                      {s.status || "Active"}
                    </span>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin-dashboard/students/${s._id}`}>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/30 transition-all">
                          <Eye size={16} />
                        </button>
                      </Link>

                      <Link href={`/admin-dashboard/students/edit/${s._id}`}>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-blue-400 hover:border-blue-400/30 transition-all">
                          <Edit size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/30 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-white/50 text-sm"
                  >
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
