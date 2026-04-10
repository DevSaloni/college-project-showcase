"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateGroup() {
  const { BASE_URL } = useApi();
  const router = useRouter();

  /* ================= STATES ================= */
  const [form, setForm] = useState({
    groupName: "",
    department: "",
    year: "",
    mentor: "",
    students: [],
    status: "Active",
  });

  const [groupSize, setGroupSize] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [studentSelectKey, setStudentSelectKey] = useState(0);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch(`${BASE_URL}/api/teacher/dropdown`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    const fixedTeachers = data.teachers.map((t) => ({
      name: t.name,
      _id: t._id || t.id,
      groupCount: t.groupCount || 0,
    }));
    setTeachers(fixedTeachers);
  };

  const fetchStudents = async () => {
    const res = await fetch(`${BASE_URL}/api/student/dropdown`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setStudentsList(data.students || []);
  };

  /* ================= STUDENT LOGIC ================= */
  const addStudent = (id) => {
    if (!groupSize) {
      toast.error("Please select group size first");
      return;
    }

    if (form.students.length >= Number(groupSize)) {
      toast.error(`You can only select ${groupSize} students`);
      return;
    }

    const student = studentsList.find((s) => s._id === id);
    if (!student) return;

    if (!form.students.some((s) => s._id === id)) {
      setForm((prev) => ({
        ...prev,
        students: [...prev.students, student],
      }));
    }

    setStudentSelectKey((prev) => prev + 1);
  };

  const removeStudent = (id) => {
    setForm((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s._id !== id),
    }));
  };

  const availableStudents = studentsList.filter(
    (s) => !form.students.some((fs) => fs._id === s._id)
  );

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (
      !form.groupName ||
      !form.department ||
      !form.year ||
      !form.mentor ||
      !groupSize
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.students.length !== Number(groupSize)) {
      toast.error(`Please select exactly ${groupSize} students`);
      return;
    }

    try {
      const payload = {
        groupName: form.groupName,
        department: form.department,
        year: form.year,
        mentor: form.mentor,
        students: form.students.map((s) => s._id),
        groupSize: Number(groupSize),
        status: form.status,
      };

      const res = await fetch(`${BASE_URL}/api/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to create group");
        return;
      }

      toast.success("Group created successfully ✅");
      router.push("/admin-dashboard/groups");

      // RESET FORM
      setForm({
        groupName: "",
        department: "",
        year: "",
        mentor: "",
        students: [],
        status: "Active",
      });
      setGroupSize("");
      setStudentSelectKey((prev) => prev + 1);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Create New Group
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            Register a new group into the system
          </p>
        </div>

        <Link href="/admin-dashboard/groups">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold 
                bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300">
            <ArrowLeft size={16} /> Back
          </button>
        </Link>

      </div>

      {/* ===== CARD ===== */}
      <div className="relative p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-xl space-y-6">
        {/* Gradient top line */}
        <div
          className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
          style={{
            background:
              "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
          }}
        />

        {/* Group Name */}
        <Input
          placeholder="Group Name"
          value={form.groupName}
          onChange={(e) => setForm({ ...form, groupName: e.target.value })}
        />

        {/* Department & Year */}
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            placeholder="Department"
            value={form.department}
            options={["Computer Engineering", "IT", "ENTC", "Mechanical"]}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <Select
            placeholder="Year"
            value={form.year}
            options={["1st", "2nd", "3rd", "4th"]}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
        </div>

        {/* Mentor */}
        <Select
          placeholder="Select Mentor"
          value={form.mentor}
          options={teachers.map((m) => ({
            label: `${m.name} (Assigned Groups: ${m.groupCount})`,
            value: m._id,
          }))}
          onChange={(e) => setForm({ ...form, mentor: e.target.value })}
        />

        {/* Group Size & Add Student */}
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            placeholder="Select Group Size"
            value={groupSize}
            options={["1", "2", "3", "4", "5", "6"]}
            onChange={(e) => {
              setGroupSize(e.target.value);
              setForm({ ...form, students: [] });
              setStudentSelectKey((prev) => prev + 1);
            }}
          />
          <Select
            key={studentSelectKey}
            placeholder={
              form.students.length >= groupSize
                ? "Student limit reached"
                : "Add Student"
            }
            options={availableStudents.map((s) => ({
              label: `${s.userId.name} (${s.rollNo})`,
              value: s._id,
            }))}
            onChange={(e) => addStudent(e.target.value)}
            disabled={!groupSize || form.students.length >= groupSize}
          />
        </div>

        {/* Selected Students */}
        {form.students.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-white/60">Selected Students</p>
            <div className="flex flex-wrap gap-2">
              {form.students.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 text-white text-sm"
                >
                  {s.userId.name} ({s.rollNo})
                  <X
                    size={14}
                    className="cursor-pointer hover:text-red-400"
                    onClick={() => removeStudent(s._id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <Select
          placeholder="Group Status"
          value={form.status}
          options={["Active", "Completed"]}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        />

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-black shadow-lg hover:scale-105 transition-all duration-300"
            style={{
              background:
                "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
            }}
          >
            <Save size={16} /> Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */
function Input({ placeholder, value, onChange }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-[var(--pv-accent)] transition"
    />
  );
}

function Select({ placeholder, options, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (opt) => {
    onChange({ target: { value: opt.value || opt } });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:border-[var(--pv-accent)] transition flex items-center justify-between cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        <span className={`${value ? "" : "text-white/40"}`}>
          {options.find((o) => o.value === value)?.label || value || placeholder}
        </span>
        <span className="text-white/50">▼</span>
      </div>

      {open && !disabled && (
        <div className="absolute w-full mt-1 bg-[#0f172a] border border-white/10 rounded-xl z-50 max-h-36 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value || opt}
              onClick={() => handleOptionClick(opt)}
              className="h-10 px-4 flex items-center cursor-pointer text-white hover:bg-[var(--pv-accent)] transition"
            >
              {opt.label || opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
