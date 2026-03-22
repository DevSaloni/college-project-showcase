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
  Layers
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Manage Students
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            Create, assign, and manage student accounts efficiently
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold 
                 text-black shadow-lg hover:scale-105 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
              }}
            >
              <UserPlus size={16} /> Add Student
            </button>
          </Link>

        </div>
      </div>


      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
        />

        <StatCard
          title="Active Students"
          value={activeStudents}
          icon={UserCheck}
        />

        <StatCard
          title="Groups Created"
          value={groupsCreated}
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
            <p className="text-white/60 font-medium tracking-wide animate-pulse">Loading students...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.06] text-white/60 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Roll No</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-left">Group</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-white/10 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {s.rollNo}
                    </td>

                    <td className="px-6 py-4 text-white">
                      {s.userId?.name}
                    </td>

                    <td className="px-6 py-4 text-white/70">
                      {s.userId?.email}
                    </td>

                    <td className="px-6 py-4 text-white/70">
                      {s.department}
                    </td>

                    <td className="px-6 py-4 text-white/70">
                      {s.group ? s.group.name : "Not Assigned"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${s.status === "Active"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                          }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <Link
                          href={`/admin-dashboard/students/${s._id}`}
                        >
                          <Eye
                            size={18}
                            className="cursor-pointer text-white/60 hover:text-white transition"
                          />
                        </Link>

                        <Link
                          href={`/admin-dashboard/students/edit/${s._id}`}
                        >
                          <Edit
                            size={18}
                            className="cursor-pointer text-white/60 hover:text-white transition"
                          />
                        </Link>

                        <Trash2
                          size={18}
                          className="cursor-pointer text-white/60 hover:text-red-400 transition"
                          onClick={() => handleDelete(s._id)}
                        />
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

      {/* Top Gradient Glow */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] opacity-70"
        style={{
          background:
            "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
        }}
      />

      <div className="flex items-center justify-between">

        {/* Text Section */}
        <div>
          <p className="text-white/60 text-sm uppercase tracking-wide">
            {title}
          </p>

          <h3 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
            {value}
          </h3>
        </div>

        {/* Icon Section */}
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