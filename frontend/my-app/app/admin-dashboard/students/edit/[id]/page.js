"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, UploadCloud, User } from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditStudent() {
  const { id } = useParams();
  const { BASE_URL } = useApi();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    department: "",
    year: "",
    sem: "",
    status: "Active",
    image: null,
    imagePreview: "",
  });

  //fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      const res = await fetch(
        `${BASE_URL}/api/student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      const student = data.student;

      setForm({
        name: student.userId?.name || "",
        email: student.userId?.email || "",
        rollNo: student.rollNo || "",
        department: student.department || "",
        year: student.year || "",
        sem: student.sem || "",
        status: student.status || "Active",
        image: null,
        imagePreview: student.image
          ? `${BASE_URL}${student.image}`
          : "",
      });

    };

    fetchStudent();
  }, [id]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleImageChange = (file) => {
    setForm({
      ...form,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };


  //update student data 
  const handleUpdate = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("rollNo", form.rollNo);
    formData.append("department", form.department);
    formData.append("year", form.year);
    formData.append("sem", form.sem);
    formData.append("status", form.status);

    if (form.image) {
      formData.append("image", form.image);
    }

    const res = await fetch(
      `${BASE_URL}/api/student/update/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
            toast.error(data.message || "Failed to add student");
            return;
          }
    
          toast.success("Student edit successfully");
          router.push("/admin-dashboard/students");
    
    setForm({
      name: "",
      email: "",
      rollNo: "",
      department: "",
      year: "",
      sem: "",
      status: "Active",
      image: null,
      imagePreview: "",
    })
  };

 return (
  <div className="space-y-10 relative">

    {/* ================= HEADER ================= */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Edit Student
        </h1>
        <p className="text-white/60 mt-2 text-sm">
          Update student details and academic information
        </p>
      </div>

      <Link href="/admin-dashboard/students">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold 
        bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300">
          <ArrowLeft size={16} /> Back
        </button>
      </Link>

    </div>

    {/* ================= CARD ================= */}
    <div className="relative rounded-2xl bg-white/[0.04] border border-white/10 
    backdrop-blur-lg shadow-xl overflow-hidden p-8 md:p-12">

      {/* Top Gradient Line */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] opacity-70"
        style={{
          background:
            "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ================= IMAGE ================= */}
        <div className="flex flex-col items-center gap-6">

          <div className="relative group w-44 h-44">
            <div className="w-full h-full rounded-2xl bg-white/5 border border-white/10 
            overflow-hidden flex items-center justify-center">

              {form.imagePreview ? (
                <img
                  src={form.imagePreview}
                  alt="student"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <User size={70} className="text-white/30" />
              )}

            </div>

            <label className="absolute inset-0 bg-black/60 opacity-0 
            group-hover:opacity-100 transition flex flex-col items-center 
            justify-center text-sm text-white cursor-pointer rounded-2xl">

              <UploadCloud size={22} className="mb-2" />
              Change Photo

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </label>
          </div>

        </div>

        {/* ================= FORM ================= */}
        <div className="lg:col-span-2 space-y-8">

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              placeholder="Roll Number"
              value={form.rollNo}
              onChange={(e) => handleChange("rollNo", e.target.value)}
            />

            <Select
              placeholder="Select Department"
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
              options={["Computer Engineering", "IT", "ENTC", "Mechanical"]}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Select
              placeholder="Year"
              value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}
              options={["1st", "2nd", "3rd", "4th"]}
            />

            <Select
              placeholder="Semester"
              value={form.sem}
              onChange={(e) => handleChange("sem", e.target.value)}
              options={["1","2","3","4","5","6","7","8"]}
            />

            <Select
              placeholder="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={["Active", "Inactive"]}
            />
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex justify-end pt-6 items-center gap-4">

            <Link href="/admin-dashboard/students">
              <button className="px-6 py-2.5 rounded-xl text-sm font-semibold 
              text-white bg-white/5 border border-white/10 
              hover:bg-white/10 transition-all duration-300">
                Cancel
              </button>
            </Link>

            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl 
              text-sm font-semibold text-black shadow-lg 
              hover:scale-105 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
              }}
            >
              <Save size={16} />
              Save Changes
            </button>

          </div>

        </div>
      </div>
    </div>
  </div>
);
}

/* ================= REUSABLE ================= */

function Input({ placeholder, type = "text", onChange, value }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-5 h-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-[var(--pv-accent)] hover:border-white/20 transition"
    />
  );
}

function Select({ placeholder, options, onChange, value }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (opt) => {
    onChange({ target: { value: opt } });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="
          w-full
          h-12
          px-5
          rounded-2xl
          bg-white/5
          border border-white/10
          text-white
          backdrop-blur-xl
          hover:border-white/20
          focus:border-[var(--pv-accent)]
          transition
          cursor-pointer
          flex items-center justify-between
        "
      >
        <span className={`${value ? "" : "text-white/40"}`}>
          {value || placeholder}
        </span>
        <span className="text-white/50">▼</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 w-full mt-1 bg-[#0f172a] border border-white/10 rounded-2xl z-50 max-h-48 overflow-y-auto top-full shadow-2xl drop-shadow-2xl">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className="
                h-12
                px-5
                flex items-center
                cursor-pointer
                text-white
                hover:bg-[var(--pv-accent)]
                transition
              "
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
