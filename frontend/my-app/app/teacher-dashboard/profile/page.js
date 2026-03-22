"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  BookOpen,
  Code2,
  Linkedin,
  Github,
  BadgeCheck,
  Users,
  Layers,
  Edit3,
  Save,
  X,
  Camera,
  Clock,
  ExternalLink,
  ChevronRight,
  Star,
  Award,
} from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function TeacherProfilePage() {
  const { BASE_URL } = useApi();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  const [profile, setProfile] = useState(null);
  const [teacherId, setTeacherId] = useState("");
  const [stats, setStats] = useState({ groups: 0, students: 0 });

  const [form, setForm] = useState({
    phone: "",
    bio: "",
    experience: "",
    qualification: "",
    subjects: "",
    expertise: "",
    linkedin: "",
    github: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/teacher/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const t = data.teacher;
          setProfile(t);
          setTeacherId(t._id);
          setStats({ groups: data.groupsAssigned, students: data.studentsCount });
          setForm({
            phone: t.phone || "",
            bio: t.bio || "",
            experience: t.experience || "",
            qualification: t.qualification || "",
            subjects: t.subjects || "",
            expertise: t.expertise || "",
            linkedin: t.linkedin || "",
            github: t.github || "",
            location: t.location || "",
          });
          if (t.image) setImagePreview(`${BASE_URL}/${t.image}`);
        } else {
          setErrorMsg("Failed to load profile.");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Network error fetching profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [BASE_URL]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${BASE_URL}/api/teacher/update/${teacherId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Profile updated successfully!");
        setProfile({ ...profile, ...data.teacher });
        setEditMode(false);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.message || "Update failed.");
      }
    } catch (err) {
      setErrorMsg("Network error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setErrorMsg("");
    if (profile) {
      setForm({
        phone: profile.phone || "",
        bio: profile.bio || "",
        experience: profile.experience || "",
        qualification: profile.qualification || "",
        subjects: profile.subjects || "",
        expertise: profile.expertise || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        location: profile.location || "",
      });
      setImageFile(null);
      setImagePreview(profile.image ? `${BASE_URL}/${profile.image}` : "");
    }
  };

  const isActive = profile?.status === "Active";
  const name = profile?.userId?.name || "Professor";
  const email = profile?.userId?.email || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const tabs = [
    { id: "about", label: "About" },
    { id: "academic", label: "Academic" },
    { id: "contact", label: "Contact & Links" },
  ];

  /* ─── LOADING ─── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[var(--pv-accent-2)] animate-spin" style={{ animationDirection: "reverse" }} />
        </div>
        <p className="text-white/50 text-sm tracking-wide animate-pulse">Loading your profile…</p>
      </div>
    );
  }

  /* ─── PAGE ─── */
  return (
    <div className="max-w-5xl mx-auto pb-24" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* ── TOASTS ── */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 font-semibold text-sm shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-300">
          <BadgeCheck size={18} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-semibold text-sm shadow-2xl backdrop-blur-xl">
          <X size={18} /> {errorMsg}
        </div>
      )}

      {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
      <div className="relative w-full rounded-3xl overflow-hidden mb-0" style={{ minHeight: 220 }}>
        {/* Cover gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0d1b35 0%, #12082a 40%, #1a0a10 70%, #0d1b35 100%)",
          }}
        />
        {/* Decorative orbs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #FF6B6B 0%, transparent 70%)" }} />
        <div className="absolute -bottom-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,107,107,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,107,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content inside banner */}
        <div className="relative z-10 px-10 pt-10 pb-0">
          <div className="flex flex-col md:flex-row items-end gap-7">

            {/* Avatar */}
            <div className="relative shrink-0 translate-y-12">
              <div
                className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "3px solid rgba(255,107,107,0.4)", boxShadow: "0 0 40px rgba(255,107,107,0.25)" }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-4xl font-black text-white"
                    style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #7c3aed 100%)" }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              {/* Status dot */}
              <span
                className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2`}
                style={{
                  borderColor: "#050A16",
                  backgroundColor: isActive ? "#4ade80" : "#f87171",
                  boxShadow: isActive ? "0 0 8px #4ade8099" : "0 0 8px #f8717199",
                }}
              />
              {editMode && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white whitespace-nowrap transition-all"
                    style={{ background: "rgba(0,0,0,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <Camera size={10} /> Change
                  </button>
                </>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 pb-5 space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {name}
                </h1>
                <span
                  className={`px-3 py-0.5 text-[11px] font-bold rounded-full`}
                  style={isActive
                    ? { background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }
                    : { background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }
                  }
                >
                  {profile?.status}
                </span>
              </div>
              <p className="text-white/50 text-sm font-medium">
                {profile?.designation}{profile?.designation && profile?.department && " · "}{profile?.department}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <Mail size={12} className="text-[var(--pv-accent)]" /> {email}
                </span>
                {form.location && (
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <MapPin size={12} className="text-[var(--pv-accent)]" /> {form.location}
                  </span>
                )}
                {form.experience && (
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <Clock size={12} className="text-[var(--pv-accent)]" /> {form.experience} experience
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pb-6 flex items-center gap-2 shrink-0">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #FF6B6B, #FF9A8B)", boxShadow: "0 4px 20px rgba(255,107,107,0.35)" }}
                >
                  <Edit3 size={15} /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white/70 transition-all hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #FF6B6B, #FF9A8B)", boxShadow: "0 4px 20px rgba(255,107,107,0.35)" }}
                  >
                    <Save size={15} /> {saving ? "Saving…" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STATS BAR  (sits just below hero)
      ══════════════════════════════════════ */}
      <div
        className="w-full rounded-b-3xl px-10 py-5 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Left offset for avatar overlap */}
        <div className="w-28 hidden md:block" />

        <div className="flex-1 flex items-center gap-8 flex-wrap">
          <StatItem icon={Layers} value={stats.groups} label="Groups Assigned" accent="#FF6B6B" />
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <StatItem icon={Users} value={stats.students} label="Students" accent="#a78bfa" />
          {form.experience && (
            <>
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <StatItem icon={Award} value={form.experience} label="Experience" accent="#34d399" />
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          TAB NAV
      ══════════════════════════════════════ */}
      <div className="mt-8 mb-6 flex gap-1 p-1 rounded-2xl w-fit"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            style={activeTab === t.id
              ? { background: "linear-gradient(135deg, #FF6B6B22, #FF9A8B11)", color: "#FF6B6B", border: "1px solid rgba(255,107,107,0.25)" }
              : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TAB: ABOUT
      ══════════════════════════════════════ */}
      {activeTab === "about" && (
        <div className="space-y-8">
          {/* Bio */}
          <div>
            <SectionLabel>Biography</SectionLabel>
            {editMode ? (
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Write a short professional bio about yourself…"
                className="w-full px-5 py-4 rounded-2xl text-white/80 placeholder-white/25 text-sm leading-relaxed resize-none outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,107,0.3)" }}
              />
            ) : (
              <p className="text-white/60 text-sm leading-relaxed">
                {form.bio || (
                  <span className="italic text-white/25">No bio yet. Click "Edit Profile" to add a professional bio.</span>
                )}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Expertise tags */}
          <div>
            <SectionLabel>Areas of Expertise</SectionLabel>
            {editMode ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={form.expertise}
                  onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                  placeholder="e.g. Machine Learning, Cloud Computing, DevOps  (comma-separated)"
                  className="w-full px-5 py-3 rounded-2xl text-white/80 placeholder-white/25 text-sm outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,107,0.3)" }}
                />
                <p className="text-xs text-white/25 pl-1">Separate multiple areas with commas</p>
              </div>
            ) : form.expertise ? (
              <div className="flex flex-wrap gap-2">
                {form.expertise.split(",").map((s, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(255,107,107,0.1)", color: "#FF9A8B", border: "1px solid rgba(255,107,107,0.2)" }}
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyHint>No expertise listed yet.</EmptyHint>
            )}
          </div>

          <div className="h-px bg-white/5" />

          {/* Subjects */}
          <div>
            <SectionLabel>Subjects Taught</SectionLabel>
            {editMode ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={form.subjects}
                  onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                  placeholder="e.g. Data Structures, Operating Systems, Networks  (comma-separated)"
                  className="w-full px-5 py-3 rounded-2xl text-white/80 placeholder-white/25 text-sm outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,107,0.3)" }}
                />
                <p className="text-xs text-white/25 pl-1">Separate multiple subjects with commas</p>
              </div>
            ) : form.subjects ? (
              <div className="flex flex-wrap gap-2">
                {form.subjects.split(",").map((s, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyHint>No subjects listed yet.</EmptyHint>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: ACADEMIC
      ══════════════════════════════════════ */}
      {activeTab === "academic" && (
        <div className="space-y-0 divide-y divide-white/5">
          <InfoRow
            icon={GraduationCap}
            label="Qualification"
            value={form.qualification}
            editMode={editMode}
            inputValue={form.qualification}
            onChange={(v) => setForm({ ...form, qualification: v })}
            placeholder="e.g. Ph.D. Computer Science, IIT Bombay"
          />
          <InfoRow
            icon={Briefcase}
            label="Experience"
            value={form.experience}
            editMode={editMode}
            inputValue={form.experience}
            onChange={(v) => setForm({ ...form, experience: v })}
            placeholder="e.g. 8 years"
          />
          <InfoRow
            icon={BookOpen}
            label="Subjects"
            value={form.subjects}
            editMode={editMode}
            inputValue={form.subjects}
            onChange={(v) => setForm({ ...form, subjects: v })}
            placeholder="e.g. Data Structures, OS, Networks"
          />
          <InfoRow
            icon={Code2}
            label="Expertise"
            value={form.expertise}
            editMode={editMode}
            inputValue={form.expertise}
            onChange={(v) => setForm({ ...form, expertise: v })}
            placeholder="e.g. Machine Learning, Cloud, DevOps"
          />
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: CONTACT & LINKS
      ══════════════════════════════════════ */}
      {activeTab === "contact" && (
        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact details */}
          <div className="space-y-0 divide-y divide-white/5">
            <SectionLabel>Contact Details</SectionLabel>
            <InfoRow icon={Mail} label="Email" value={email} editMode={false} />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={form.phone}
              editMode={editMode}
              inputValue={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="+91 98765 43210"
            />
            <InfoRow
              icon={MapPin}
              label="Location"
              value={form.location}
              editMode={editMode}
              inputValue={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
              placeholder="e.g. Pune, Maharashtra"
            />
          </div>

          {/* Professional links */}
          <div>
            <SectionLabel>Professional Links</SectionLabel>
            <div className="space-y-3 mt-3">
              {editMode ? (
                <>
                  <LinkEditRow
                    icon={Linkedin}
                    label="LinkedIn"
                    value={form.linkedin}
                    onChange={(v) => setForm({ ...form, linkedin: v })}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <LinkEditRow
                    icon={Github}
                    label="GitHub"
                    value={form.github}
                    onChange={(v) => setForm({ ...form, github: v })}
                    placeholder="https://github.com/yourusername"
                  />
                </>
              ) : (
                <>
                  {form.linkedin ? (
                    <a
                      href={form.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl group transition-all hover:scale-[1.01]"
                      style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                      <div className="p-2 rounded-xl" style={{ background: "rgba(59,130,246,0.15)" }}>
                        <Linkedin size={16} className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">LinkedIn</p>
                        <p className="text-xs text-white/35 truncate">{form.linkedin}</p>
                      </div>
                      <ExternalLink size={14} className="text-white/30 group-hover:text-blue-400 transition-colors" />
                    </a>
                  ) : (
                    <EmptyLinkCard icon={Linkedin} label="LinkedIn" color="rgba(59,130,246,0.08)" border="rgba(59,130,246,0.15)" />
                  )}

                  {form.github ? (
                    <a
                      href={form.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl group transition-all hover:scale-[1.01]"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <Github size={16} className="text-white/70" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">GitHub</p>
                        <p className="text-xs text-white/35 truncate">{form.github}</p>
                      </div>
                      <ExternalLink size={14} className="text-white/30 group-hover:text-white/70 transition-colors" />
                    </a>
                  ) : (
                    <EmptyLinkCard icon={Github} label="GitHub" color="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.1)" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   HELPER COMPONENTS
─────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest mb-4"
      style={{ color: "rgba(255,107,107,0.7)" }}>
      {children}
    </p>
  );
}

function EmptyHint({ children }) {
  return <span className="text-xs text-white/25 italic">{children}</span>;
}

function StatItem({ icon: Icon, value, label, accent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl" style={{ background: `${accent}18` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xl font-black text-white leading-none">{value}</p>
        <p className="text-xs text-white/35 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, editMode, inputValue, onChange, placeholder }) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="p-2 rounded-xl mt-0.5 shrink-0" style={{ background: "rgba(255,107,107,0.1)" }}>
        <Icon size={15} style={{ color: "#FF9A8B" }} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-1">{label}</p>
        {editMode && onChange ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-xl text-white/80 placeholder-white/20 text-sm outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,107,0.3)" }}
          />
        ) : (
          <p className="text-sm text-white/65">
            {value || <span className="text-white/25 italic text-xs">Not added yet</span>}
          </p>
        )}
      </div>
    </div>
  );
}

function LinkEditRow({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30">
        <Icon size={11} /> {label}
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-white/80 placeholder-white/20 text-sm outline-none transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,107,0.3)" }}
      />
    </div>
  );
}

function EmptyLinkCard({ icon: Icon, label, color, border }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl opacity-40"
      style={{ background: color, border: `1px solid ${border}` }}
    >
      <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
        <Icon size={16} className="text-white/50" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/35 italic">Not added yet</p>
      </div>
    </div>
  );
}