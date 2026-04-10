"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Users,
  ShieldCheck,
  Edit,
  Trash2,
  ArrowLeft,
  Phone,
  Briefcase,
  Layers,
  Calendar,
  ChevronRight
} from "lucide-react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/context/ApiContext";
import toast from "react-hot-toast";

export default function TeacherDetails() {
  const { id } = useParams();
  const { BASE_URL } = useApi();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ================= FETCH TEACHER ================= */

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/teacher/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const json = await res.json();
        console.log("Teacher>>", json);

        if (!res.ok) throw new Error(json.message);

        setData(json);
      } catch (err) {
        console.error("Teacher fetch error", err);
        toast.error("Failed to load teacher");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, BASE_URL]);

  /* ================= DELETE TEACHER ================= */

  const handleDeleteTeacher = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this teacher?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeleteLoading(true);
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
                  toast.error(data.message || "Failed to delete teacher");
                  setDeleteLoading(false);
                  return;
                }

                toast.success("Teacher deleted successfully");

                setTimeout(() => {
                  router.push("/admin-dashboard/teachers");
                }, 1000);

              } catch (error) {
                setDeleteLoading(false);
                toast.dismiss(loadingToast);
                toast.error("Server error");
              }
            }}
            className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 3000,
    });
  };

  /* ================= LOADING ================= */


  if (!loading && !data) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
        <User className="text-red-400" size={24} />
      </div>
      <p className="text-red-400 font-semibold text-lg">Teacher not found</p>
      <Link href="/admin-dashboard/teachers">
        <button className="mt-4 px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors">
          Return to Directory
        </button>
      </Link>
    </div>
  );

  const teacher = data?.teacher;
  const groupsAssigned = data?.groupsAssigned || 0;
  const studentsCount = data?.studentsCount || 0;
  const groups = data?.groups || [];

  return (
    <div className="space-y-8 relative pb-20">

      {/* HEADER SECTION - Enhanced with a subtle gradient background */}
      <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 mb-8 shadow-2xl">
        {/* Decorative gradient blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--pv-accent)]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 md:gap-8 w-full">
            <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-white/5 border-4 border-white/10 flex-shrink-0 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              {teacher?.image ? (
                <img
                  src={`${BASE_URL}${teacher?.image}`}
                  alt="mentor"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={50} className="text-white/30" />
              )}
              {/* Status Badge overlay */}
              <div className={`absolute bottom-0 left-0 right-0 py-1 flex items-center justify-center backdrop-blur-md ${teacher?.status === 'Active' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{teacher?.status || 'Unknown'}</span>
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-3">
                {teacher?.userId?.name}
                {teacher?.status === 'Active' && (
                  <ShieldCheck size={28} className="text-green-400 hidden sm:block drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                )}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2">
                  <Briefcase size={14} className="text-[var(--pv-accent)]" />
                  {teacher?.designation || "Mentor"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2">
                  <GraduationCap size={14} className="text-[var(--pv-accent)]" />
                  {teacher?.department}
                </span>
              </div>
            </div>
          </div>

          <Link href="/admin-dashboard/teachers" className="self-center md:self-auto w-full md:w-auto">
            <button className="w-full md:w-auto flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <ArrowLeft size={16} /> Directory
            </button>
          </Link>
        </div>
      </div>

      {/* PROFILE GRID */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN - CONTACT & ACTIONS */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-7 space-y-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
            {/* Decorative flair */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pv-accent)]/10 blur-[50px] rounded-full pointer-events-none transition-all duration-700 group-hover:scale-150" />

            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
              <User size={18} className="text-[var(--pv-accent)]" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <Info icon={Mail} label="Email Address" value={teacher?.userId?.email} />
              {teacher?.phone && (
                <Info icon={Phone} label="Phone Number" value={teacher?.phone} />
              )}
              <Info icon={Calendar} label="Member Since" value={new Date(teacher?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-6 relative z-10">
              <button
                onClick={() => (window.location.href = `/admin-dashboard/teachers/edit/${id}`)}
                className="flex items-center justify-center w-full gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                style={{ background: "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))" }}
              >
                <Edit size={16} /> Edit Profile
              </button>

              <button
                onClick={() => handleDeleteTeacher(teacher?._id)}
                disabled={deleteLoading}
                className="flex items-center justify-center w-full gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleteLoading ? "Removing..." : "Remove Teacher"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT DETAILS - OVERVIEW & GROUPS */}
        <div className="lg:col-span-2 space-y-8">

          {/* PERFORMANCE STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Students" value={studentsCount} color="text-blue-400" />
            <StatCard icon={Layers} label="Total Groups" value={groupsAssigned} color="text-purple-400" />
            <StatCard icon={ShieldCheck} label="Account Status" value={teacher?.status} color={teacher?.status === 'Active' ? 'text-green-400' : 'text-yellow-400'} />
            <StatCard icon={Briefcase} label="Projects" value={groupsAssigned} color="text-orange-400" />
          </div>

          {/* ASSIGNED GROUPS LIST */}
          <div className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="p-6 md:p-7 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users size={22} className="text-[var(--pv-accent)]" />
                  Assigned Student Groups
                </h3>
                <p className="text-white/50 text-sm mt-1">Active mentoring sessions ({groupsAssigned})</p>
              </div>

              {groups && groups.length > 0 && (
                <Link
                  href={`/admin-dashboard/groups/mentor/${teacher?._id}`}
                  className="text-sm font-semibold text-white/80 hover:text-white flex items-center gap-1 group bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  View All Groups <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>

            <div className="divide-y divide-white/5 max-h-[450px] overflow-y-auto custom-scrollbar">
              {groups && groups.length > 0 ? (
                groups.map((group) => (
                  <div key={group._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group/item">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform shadow-[0_0_15px_rgba(var(--pv-accent),0.1)]">
                        <Layers size={20} className="text-[var(--pv-accent)]" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">{group.groupName}</h4>
                        <p className="text-white/50 text-xs mt-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> {group.department}
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Year {group.year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pt-2 sm:pt-0 border-t border-white/5 sm:border-0 mt-2 sm:mt-0">
                      <div className="flex flex-col items-start sm:items-end">
                        <p className="text-white/40 text-[11px] mb-1.5 uppercase font-semibold tracking-wider">Students</p>
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(group.students?.length || 0, 4))].map((_, i) => (
                            <div key={i} className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#121212] flex items-center justify-center relative hover:z-10 hover:scale-110 transition-transform">
                              <User size={12} className="text-white/60" />
                            </div>
                          ))}
                          {(group.students?.length || 0) > 4 && (
                            <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-[#121212] flex items-center justify-center text-[10px] font-bold text-white relative hover:z-10 hover:scale-110 transition-transform">
                              +{(group.students?.length || 0) - 4}
                            </div>
                          )}
                          {(group.students?.length || 0) === 0 && (
                            <span className="text-xs text-white/30 italic">No students yet</span>
                          )}
                        </div>
                      </div>
                      <Link href={`/admin-dashboard/groups/${group._id}`}>
                        <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-[var(--pv-accent)] hover:border-[var(--pv-accent)] text-white/70 hover:text-white transition-all duration-300 group-hover/item:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          <ChevronRight size={18} />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 px-6 text-center flex flex-col items-center justify-center bg-white/[0.01]">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                    <Users size={30} className="text-white/20" />
                  </div>
                  <h4 className="text-white text-lg font-semibold mb-2">No groups assigned</h4>
                  <p className="text-white/40 text-sm max-w-sm mx-auto">
                    This teacher currently has no active groups. You can assign groups to this mentor from the group management page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= REUSABLE FUNCTIONAL COMPONENTS ================= */

function Info({ icon: Icon, label, value }) {
  return (
    <div className="group flex flex-col gap-1.5 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--pv-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wider font-semibold z-10">
        <Icon size={14} className="text-[var(--pv-accent)]/70 group-hover:text-[var(--pv-accent)] transition-colors" />
        {label}
      </div>
      <div className="text-white font-medium text-base truncate z-10" title={value || "-"}>
        {value || <span className="text-white/30 italic">Not provided</span>}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="group rounded-xl bg-white/[0.03] border border-white/10 p-5 md:p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 shadow-xl overflow-hidden relative">
      <div className={`absolute -bottom-4 -right-4 opacity-10 scale-150 rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0 ${color}`}>
        <Icon size={60} />
      </div>
      <div className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner z-10 ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      <div className="z-10">
        <h4 className="text-1xl md:text-2xl font-extrabold text-white mb-1">{value || "0"}</h4>
        <p className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}
