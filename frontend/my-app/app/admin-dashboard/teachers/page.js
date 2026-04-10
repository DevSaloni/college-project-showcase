"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCheck,
  Layers,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";
import toast from "react-hot-toast";

export default function ManageTeachers() {
  const { BASE_URL } = useApi();


  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  /* ================= FETCH TEACHERS ================= */
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/teacher/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load teachers");
        return;
      }

      setTeachers(data.teachers || []);

    } catch (error) {
      console.error("Failed to fetch teachers", error);
      toast.error("Server error while loading teachers");
    } finally {
      setLoading(false);
    }
  };

  //fetech groups to calculate assigned tecahers 
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/group/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setGroups(data.groups || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
  }, [BASE_URL]);

  //delete the teacher
  const handleDeleteTeacher = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this teacher?
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

              const loadingToast = toast.loading("Deleting teacher...");

              try {
                const res = await fetch(`${BASE_URL}/api/teacher/delete/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });

                const data = await res.json();

                toast.dismiss(loadingToast);

                if (!res.ok) {
                  toast.error(data.message || "Delete failed");
                  return;
                }

                setTeachers(prev => prev.filter(t => t._id !== id));
                toast.success("Teacher deleted successfully");

              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Something went wrong");
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
  const filteredTeachers = teachers.filter((t) => {
    const name = t?.userId?.name?.toLowerCase() || "";
    const email = t?.userId?.email?.toLowerCase() || "";
    const department = t?.department?.toLowerCase() || "";

    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      department.includes(search.toLowerCase())
    );
  });

  const assignedTeachers = new Set(
    groups
      .filter(g => g.mentor)
      .map(g => g.mentor._id)
  ).size;

  return (
    <div className="space-y-8 px-2 sm:px-0">

      {/* HEADER + SEARCH */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Faculty Roster
          </h1>
          <p className="text-white/40 mt-2 text-xs md:text-sm font-bold max-w-2xl text-left">
            All registered mentors and faculty members — manage access, profiles, and assignments.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, department..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--pv-accent)]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md"
            />
          </div>

          <Link href="/admin-dashboard/teachers/add" className="w-full lg:w-auto">
            <button
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))",
              }}
            >
              <Plus size={18} /> Add Teacher
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Total Mentors", value: teachers.length, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: UserCheck, label: "Active Status", value: teachers.filter(t => t.status === "Active").length, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { icon: Layers, label: "Active Assignments", value: assignedTeachers, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }, index) => (
          <div key={label} className={`flex items-center gap-5 p-6 rounded-[2rem] ${bg} border ${border} backdrop-blur-md hover:scale-[1.02] transition-all duration-300 ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
            <div className={`p-4 rounded-2xl bg-white/5 border ${border} ${color} shadow-inner`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-1">{label}</p>
              <p className={`text-3xl font-black ${color} tracking-tight`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--pv-accent)] animate-pulse" />
            <span className="text-white font-black text-xs sm:text-sm uppercase tracking-widest">
              Faculty Roster ({filteredTeachers.length})
            </span>
          </div>
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-[10px] uppercase tracking-widest font-black border-b border-white/10 bg-white/[0.02]">
                <th className="px-8 py-5 text-left">Mentor</th>
                <th className="px-8 py-5 text-left">Department</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredTeachers.map((t) => (
                <tr key={t._id} className="group border-t border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--pv-accent)]/20 to-[var(--pv-accent-2)]/20 border border-white/10 flex items-center justify-center text-lg font-black text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {t.userId?.name?.charAt(0) || "T"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold leading-tight tracking-tight capitalize truncate text-base">{t.userId?.name || "—"}</p>
                        <p className="text-white/35 text-xs font-medium mt-1 truncate">{t.userId?.email || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-white/70 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--pv-accent)]" />
                      {t.department}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${t.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-green-500/5" : "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.status === "Active" ? "bg-green-400" : "bg-red-400 shadow-pulse"}`} />
                      {t.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center gap-3">
                      <Link href={`/admin-dashboard/teachers/${t._id}`}>
                        <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/30 transition-all">
                          <Eye size={18} />
                        </button>
                      </Link>
                      <Link href={`/admin-dashboard/teachers/edit/${t._id}`}>
                        <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-blue-400 hover:border-blue-400/30 transition-all">
                          <Edit size={18} />
                        </button>
                      </Link>
                      <button onClick={() => handleDeleteTeacher(t._id)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/30 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (Shown on Mobile) */}
        <div className="md:hidden divide-y divide-white/5">
          {filteredTeachers.map((t) => (
            <div key={t._id} className="p-6 space-y-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--pv-accent)]/20 to-[var(--pv-accent-2)]/20 border border-white/10 flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg">
                    {t.userId?.name?.charAt(0) || "T"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-black leading-tight tracking-tight capitalize truncate text-lg">{t.userId?.name || "—"}</p>
                    <p className="text-white/35 text-xs font-bold mt-1 truncate">{t.userId?.email || "—"}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg shrink-0 ${t.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  <span className={`w-1 h-1 rounded-full ${t.status === "Active" ? "bg-green-400" : "bg-red-400"}`} />
                  {t.status}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-black">Department</p>
                  <p className="text-[var(--pv-accent)] text-sm font-black truncate">{t.department || "General"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/admin-dashboard/teachers/${t._id}`} className="flex-[2]">
                  <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all shadow-lg">
                    <Eye size={16} className="text-[var(--pv-accent)]" /> View
                  </button>
                </Link>
                <Link href={`/admin-dashboard/teachers/edit/${t._id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-blue-400 transition-all shadow-lg">
                    <Edit size={18} />
                  </button>
                </Link>
                <button onClick={() => handleDeleteTeacher(t._id)} className="flex-1 flex items-center justify-center py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 transition-all shadow-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredTeachers.length === 0 && (
            <div className="text-center py-16 px-10">
              <div className="w-16 h-16 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/20">
                <Search size={32} />
              </div>
              <p className="text-white/40 text-sm font-bold">No results found for "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
