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
    <div className="space-y-10">

      {/* HEADER + SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Teacher Roster
          </h1>
          <p className="text-white/40 mt-2 text-sm font-bold">
            All registered mentors and faculty members — manage access, profiles, and assignments.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-white/40" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, department..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
            text-white text-sm outline-none focus:border-white/30 focus:bg-white/10 
            transition-all duration-300"
            />
          </div>

          <Link href="/admin-dashboard/teachers/add">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest text-black shadow-lg hover:scale-105 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
              }}
            >
              <Plus size={14} /> Add Teacher
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Total Mentors", value: teachers.length, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: UserCheck, label: "Active Status", value: teachers.filter(t => t.status === "Active").length, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { icon: Layers, label: "Active Assignments", value: assignedTeachers, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
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

      {/* TABLE */}
      <div className="rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <UserCheck size={18} className="text-[var(--pv-accent)]" />
            <span className="text-white font-black text-sm uppercase tracking-widest">
              Faculty Roster ({filteredTeachers.length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-[10px] uppercase tracking-widest font-black border-b border-white/10 bg-white/[0.02]">
                <th className="px-8 py-4 text-left">Mentor</th>
                <th className="px-8 py-4 text-left">Department</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredTeachers.map((t) => (
                <tr key={t._id} className="group border-t border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pv-accent)]/30 to-[var(--pv-accent-2)]/30 border border-white/15 flex items-center justify-center text-sm font-black text-white shrink-0">
                        {t.userId?.name?.charAt(0) || "T"}
                      </div>
                      <div>
                        <p className="text-white font-black leading-tight tracking-tight capitalize">{t.userId?.name || "—"}</p>
                        <p className="text-white/35 text-xs font-bold mt-0.5">{t.userId?.email || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-white/70 text-xs font-bold">
                      <span className="w-1 h-1 rounded-full bg-[var(--pv-accent)]" />
                      {t.department}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${t.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      <span className={`w-1 h-1 rounded-full ${t.status === "Active" ? "bg-green-400" : "bg-red-400"}`} />
                      {t.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin-dashboard/teachers/${t._id}`}>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/30 transition-all">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <Link href={`/admin-dashboard/teachers/edit/${t._id}`}>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-blue-400 hover:border-blue-400/30 transition-all">
                          <Edit size={16} />
                        </button>
                      </Link>
                      <button onClick={() => handleDeleteTeacher(t._id)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/30 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-white/50 text-sm">No teachers found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}