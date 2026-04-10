"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, UploadCloud, User } from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddTeacher() {
  const { BASE_URL } = useApi();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
    status: "Active",
    image: null,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {

      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.department ||
        !form.designation.trim() ||
        !form.phone.trim() ||
        !form.status ||
        !form.image
      ) {
        toast.error("All fields including image are required");
        return;
      }

      if (!/^\d{10}$/.test(form.phone)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "image") {
          formData.append("image", form.image);
        } else {
          formData.append(key, form[key]);
        }
      });

      const res = await fetch(`${BASE_URL}/api/teacher/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add teacher");
        return;
      }

      toast.success("Teacher added successfully");
      router.push("/admin-dashboard/teachers");

    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Add New Teacher
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            Register a new teacher into the system
          </p>
        </div>

        <Link href="/admin-dashboard/teachers">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold 
          bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300">
            <ArrowLeft size={16} /> Back
          </button>
        </Link>

      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="relative rounded-2xl bg-white/[0.04] border border-white/10 
      backdrop-blur-lg shadow-xl overflow-hidden p-8 md:p-12">

        {/* Gradient Top Line */}
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

            <div className="relative group">
              <div className="w-44 h-44 rounded-2xl bg-white/5 border border-white/10 
              overflow-hidden flex items-center justify-center">

                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="teacher"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={70} className="text-white/30" />
                )}

              </div>

              <label className="absolute inset-0 bg-black/60 opacity-0 
              group-hover:opacity-100 transition flex flex-col items-center 
              justify-center text-sm text-white cursor-pointer rounded-2xl">

                <UploadCloud size={22} />
                Upload Photo

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleChange("image", e.target.files[0])
                  }
                />
              </label>
            </div>

            <p className="text-xs text-white/40 text-center">
              Upload teacher profile image
            </p>
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
                placeholder="Designation"
                value={form.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
              />

              <Input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) handleChange("phone", value);
                }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Select
                placeholder="Select Department"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                options={[
                  "Computer Engineering",
                  "IT",
                  "ENTC",
                  "Mechanical",
                ]}
              />

              <Select
                placeholder="Status"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                options={["Active", "Inactive"]}
              />
            </div>

            {/* ================= BUTTON ================= */}
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl 
                text-sm font-semibold text-black shadow-lg 
                hover:scale-105 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
                }}
              >
                <Save size={16} />
                Save Teacher
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ placeholder, type = "text", onChange, value }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--pv-accent)] transition"
    />
  );
}

/* ================= SELECT ================= */

function Select({ placeholder, options, onChange, value }) {
  const [open, setOpen] = React.useState(false);
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
    onChange({ target: { value: opt } });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">

      <div
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white cursor-pointer flex items-center justify-between"
      >
        <span className={`${value ? "" : "text-white/40"}`}>
          {value || placeholder}
        </span>
        <span className="text-white/50">▼</span>
      </div>

      {open && (
        <div className="absolute w-full mt-1 bg-[#0f172a] border border-white/10 rounded-2xl z-50 max-h-36 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className="h-12 px-5 flex items-center cursor-pointer text-white hover:bg-[var(--pv-accent)] transition"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
