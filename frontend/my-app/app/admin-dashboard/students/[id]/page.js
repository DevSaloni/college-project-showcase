"use client";

import { useEffect, useState } from "react";
import {
  User, Mail, GraduationCap, Users, ArrowLeft, BookOpen,
  Calendar, Briefcase, CheckCircle, AlertCircle, Edit, Trash2,
  MapPin, Award, ShieldCheck, Layers, ChevronRight, Phone, Activity
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/context/ApiContext";
import toast from "react-hot-toast";

export default function ViewStudent() {
  const { BASE_URL } = useApi();
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [academic, setAcademic] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/student/academic-project/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        console.log("student dta>>", data);

        if (!res.ok) throw new Error(data.message || "Failed to fetch");
        setStudent(data.student);
        setAcademic(data.academicDetails);
        setProject(data.projectDetails);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load student");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [id, BASE_URL]);

  const handleDelete = (studentId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this student?
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
              const loadingToast = toast.loading("Deleting student...");

              try {
                const res = await fetch(`${BASE_URL}/api/student/delete/${studentId}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();

                toast.dismiss(loadingToast);

                if (res.ok) {
                  toast.success("Student deleted successfully");
                  setTimeout(() => {
                    router.push("/admin-dashboard/students");
                  }, 1000);
                } else {
                  toast.error(data.message || "Failed to delete");
                  setDeleteLoading(false);
                }
              } catch (err) {
                console.error(err);
                toast.dismiss(loadingToast);
                toast.error("Server error");
                setDeleteLoading(false);
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


  if (!loading && !student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <AlertCircle className="text-red-400" size={24} />
        </div>
        <p className="text-red-400 font-semibold text-lg">Student not found</p>
        <Link href="/admin-dashboard/students">
          <button className="mt-4 px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors">
            Return to Directory
          </button>
        </Link>
      </div>
    );
  }

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
              {student?.image ? (
                <img
                  src={`${BASE_URL}${student.image}`}
                  alt="student"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={50} className="text-white/30" />
              )}
              {/* Status Badge overlay */}
              <div className={`absolute bottom-0 left-0 right-0 py-1 flex items-center justify-center backdrop-blur-md ${student?.status === 'Active' || !student?.status ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{student?.status || 'Active'}</span>
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-3">
                {student?.name}
                {(student?.status === 'Active' || !student?.status) && (
                  <ShieldCheck size={28} className="text-green-400 hidden sm:block drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                )}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2">
                  <BookOpen size={14} className="text-[var(--pv-accent)]" />
                  Roll No: {student?.rollNo || "-"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2">
                  <GraduationCap size={14} className="text-[var(--pv-accent)]" />
                  {student?.department}
                </span>
              </div>
            </div>
          </div>

          <Link href="/admin-dashboard/students" className="self-center md:self-auto w-full md:w-auto">
            <button className="w-full md:w-auto flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <ArrowLeft size={16} /> Directory
            </button>
          </Link>
        </div>
      </div>

      {/* PROFILE GRID */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">

        {/* LEFT COLUMN - CONTACT & ACTIONS */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-7 space-y-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
            {/* Decorative flair */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pv-accent)]/10 blur-[50px] rounded-full pointer-events-none transition-all duration-700 group-hover:scale-150" />

            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
              <User size={18} className="text-[var(--pv-accent)]" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <Info icon={Mail} label="Email Address" value={student?.email} />
              {student?.phone && (
                <Info icon={Phone} label="Phone Number" value={student?.phone} />
              )}
              <Info icon={Calendar} label="Member Since" value={new Date(student?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-6 relative z-10">
              <button
                onClick={() => (window.location.href = `/admin-dashboard/students/edit/${id}`)}
                className="flex items-center justify-center w-full gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                style={{ background: "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))" }}
              >
                <Edit size={16} /> Edit Profile
              </button>

              <button
                onClick={() => handleDelete(student?._id)}
                disabled={deleteLoading}
                className="flex items-center justify-center w-full gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleteLoading ? "Removing..." : "Remove Student"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT DETAILS - OVERVIEW & GROUPS */}
        <div className="lg:col-span-2 space-y-8 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:pr-4 scrollbar-thin scrollbar-thumb-[var(--pv-accent)] scrollbar-track-white/5">

          {/* PERFORMANCE STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Group Name" value={academic?.groupName || "None"} color="text-blue-400" />
            <StatCard icon={Award} label="Mentor" value={academic?.mentorName || "None"} color="text-purple-400" />
            <StatCard icon={ShieldCheck} label="Account Status" value={student?.status || "Active"} color={student?.status === 'Active' || !student?.status ? 'text-green-400' : 'text-yellow-400'} />
            <StatCard icon={Briefcase} label="Projects" value={project ? 1 : 0} color="text-orange-400" />
          </div>

          {/* ACADEMIC & PROJECT LIST */}
          <div className="space-y-8">
            <AcademicDetailsCard academic={academic} student={student} />
            <ProjectDetailsCard project={project} />
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
      <div className="z-10 w-full px-2">
        <h4 className="text-xl md:text-2xl font-extrabold text-white mb-1 truncate" title={value || "0"}>{value || "0"}</h4>
        <p className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest truncate" title={label}>{label}</p>
      </div>
    </div>
  );
}

function AcademicDetailsCard({ academic, student }) {
  const academicItems = [
    { icon: BookOpen, label: "Year", value: student?.year },
    { icon: Calendar, label: "Semester", value: student?.semester },
    { icon: Users, label: "Group Name", value: academic?.groupName },
    { icon: Award, label: "Assigned Mentor", value: academic?.mentorName },
    { icon: CheckCircle, label: "Group Status", value: academic?.groupStatus, badge: true },
  ];

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="p-6 md:p-7 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap size={22} className="text-[var(--pv-accent)]" />
            Academic Details
          </h3>
          <p className="text-white/50 text-sm mt-1">Enrollment & Academic Information</p>
        </div>
      </div>

      <div className="p-6 md:p-7">
        {!academic && !student?.year ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-white/20" />
            </div>
            <h4 className="text-white text-lg font-semibold mb-1">No academic data</h4>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              Academic details have not been fully populated yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {academicItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="group/item flex flex-col gap-1.5 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 w-full relative overflow-hidden">
                  <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wider font-semibold z-10">
                    <Icon size={14} className="text-[var(--pv-accent)]/70 group-hover/item:text-[var(--pv-accent)] transition-colors" />
                    {item.label}
                  </div>
                  <div className="z-10">
                    {item.badge && item.value ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 mt-1">
                        <CheckCircle size={12} />
                        {item.value}
                      </span>
                    ) : item.badge ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/60 border border-white/20 mt-1">
                        -
                      </span>
                    ) : (
                      <span className="text-white font-medium text-base truncate">{item.value || "-"}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectDetailsCard({ project }) {
  const projectItems = [
    { icon: Briefcase, label: "Project Title", value: project?.title },
    { icon: Calendar, label: "Duration", value: project?.totalWeeks ? `${project.totalWeeks} weeks` : null },
    { icon: Activity, label: "Completion", value: project?.progressPercent !== undefined ? `${project.progressPercent}%` : "0%" },
    { icon: Calendar, label: "Start Date", value: project?.startDate ? new Date(project.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null },
    { icon: Calendar, label: "End Date", value: project?.endDate ? new Date(project.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null },
    { icon: CheckCircle, label: "Project Status", value: project?.status, badge: true },
    { icon: Award, label: "Proposal Status", value: project?.proposalStatus, badge: true },
  ];

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="p-6 md:p-7 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase size={22} className="text-[var(--pv-accent)]" />
            Project Information
          </h3>
          <p className="text-white/50 text-sm mt-1">Project Details & Timeline</p>
        </div>
      </div>

      <div className="p-6 md:p-7">
        {!project ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Layers size={24} className="text-white/20" />
            </div>
            <h4 className="text-white text-lg font-semibold mb-1">No project assigned</h4>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              This student currently has no active projects assigned.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projectItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`group/item flex flex-col gap-1.5 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 w-full relative overflow-hidden ${item.label === 'Project Title' ? 'sm:col-span-2' : ''}`}>
                  <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wider font-semibold z-10">
                    <Icon size={14} className="text-[var(--pv-accent)]/70 group-hover/item:text-[var(--pv-accent)] transition-colors" />
                    {item.label}
                  </div>
                  <div className="z-10">
                    {item.badge && item.value ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 mt-1">
                        <CheckCircle size={12} />
                        {item.value}
                      </span>
                    ) : item.badge ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/60 border border-white/20 mt-1">
                        -
                      </span>
                    ) : (
                      <span className="text-white font-medium text-base">{item.value || "-"}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}