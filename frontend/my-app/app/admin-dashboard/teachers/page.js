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
  Layers
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Manage Teachers
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            Create, assign, and manage teacher accounts efficiently
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

          <Link href="/admin-dashboard/teachers/add">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold 
              text-black shadow-lg hover:scale-105 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
              }}
            >
              <UserPlus size={16} /> Add Teacher
            </button>
          </Link>

        </div>
      </div>


      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={Users}
        />
        <StatCard
          title="Active Mentors"
          value={teachers.filter(t => t.status === "Active").length}
          icon={UserCheck}
        />
        <StatCard
          title="Assigned Teachers"
          value={assignedTeachers}
          icon={Layers}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg overflow-hidden shadow-xl">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 relative z-10 w-full">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[var(--pv-accent-2)] animate-spin-slow"></div>
            </div>
            <p className="text-white/60 font-medium tracking-wide animate-pulse">Loading teachers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.06] text-white/60 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t border-white/10 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {t.userId?.name || "—"}
                    </td>

                    <td className="px-6 py-4 text-white/70">
                      {t.userId?.email || "—"}
                    </td>

                    <td className="px-6 py-4 text-white/70">
                      {t.department}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === "Active"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                          }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <Link href={`/admin-dashboard/teachers/${t._id}`}>
                          <Eye
                            size={18}
                            className="cursor-pointer text-white/60 hover:text-white transition"
                          />
                        </Link>

                        <Link href={`/admin-dashboard/teachers/edit/${t._id}`}>
                          <Edit
                            size={18}
                            className="cursor-pointer text-white/60 hover:text-white transition"
                          />
                        </Link>

                        <Trash2
                          onClick={() => handleDeleteTeacher(t._id)}
                          size={18}
                          className="cursor-pointer text-white/60 hover:text-red-400 transition"
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTeachers.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-white/50 text-sm"
                    >
                      No teachers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 
    backdrop-blur-lg shadow-lg overflow-hidden
    hover:bg-white/[0.06] hover:shadow-2xl transition-all duration-300 group">

      <div
        className="absolute inset-x-0 top-0 h-[3px] opacity-70"
        style={{
          background:
            "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
            {value}
          </h3>
        </div>

        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 
        flex items-center justify-center
        group-hover:scale-110 transition-all duration-300">

          {Icon && (
            <Icon
              size={22}
              className="text-white/70 group-hover:text-white transition"
            />
          )}
        </div>
      </div>
    </div>
  );
}