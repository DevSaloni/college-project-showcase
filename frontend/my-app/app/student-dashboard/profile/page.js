"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Code2,
  Linkedin,
  Github,
  BadgeCheck,
  Layers,
  Edit3,
  Save,
  X,
  Camera,
  ExternalLink,
  Award,
  Globe,
  FileText,
  Rocket,
  Brain,
  CheckCircle2,
  Eye
} from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function StudentProfilePage() {
  const { BASE_URL } = useApi();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [publicView, setPublicView] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  const [profile, setProfile] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [stats, setStats] = useState({ totalProjects: 0, approvedProjects: 0 });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    rollNo: "",
    department: "",
    year: "",
    sem: "",
    technicalSkills: "",
    softSkills: "",
    interestedRoles: "",
    achievements: "",
    certifications: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resume: "",
    openToWork: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const s = data.student;
          setProfile(s);
          setStudentId(s._id);
          setStats(data.stats || { totalProjects: 0, approvedProjects: 0 });
          setForm({
            name: s.userId?.name || "",
            email: s.userId?.email || "",
            phone: s.phone || "",
            bio: s.bio || "",
            location: s.location || "",
            rollNo: s.rollNo || "",
            department: s.department || "",
            year: s.year || "",
            sem: s.sem || "",
            technicalSkills: s.technicalSkills?.join(", ") || "",
            softSkills: s.softSkills?.join(", ") || "",
            interestedRoles: s.interestedRoles?.join(", ") || "",
            achievements: s.achievements?.join(", ") || "",
            certifications: s.certifications?.join(", ") || "",
            linkedin: s.linkedin || "",
            github: s.github || "",
            portfolio: s.portfolio || "",
            resume: s.resume || "",
            openToWork: s.openToWork || false,
          });
          if (s.image) setImagePreview(`${BASE_URL}${s.image}`);
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
      Object.entries(form).forEach(([k, v]) => {
        formData.append(k, v);
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${BASE_URL}/api/student/update/${studentId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Profile updated successfully!");
        const updatedStudent = data.student;
        setProfile(updatedStudent);
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
        name: profile.userId?.name || "",
        email: profile.userId?.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
        rollNo: profile.rollNo || "",
        department: profile.department || "",
        year: profile.year || "",
        sem: profile.sem || "",
        technicalSkills: profile.technicalSkills?.join(", ") || "",
        softSkills: profile.softSkills?.join(", ") || "",
        interestedRoles: profile.interestedRoles?.join(", ") || "",
        achievements: profile.achievements?.join(", ") || "",
        certifications: profile.certifications?.join(", ") || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
        resume: profile.resume || "",
        openToWork: profile.openToWork || false,
      });
      setImageFile(null);
      setImagePreview(profile.image ? `${BASE_URL}${profile.image}` : "");
    }
  };

  const name = form.name || "Student";
  const email = form.email || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const tabs = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills & Career" },
    { id: "academic", label: "Academic" },
    { id: "contact", label: "Contact & Links" },
  ];

  // The blocking full page loader was purposefully removed logic here for instantaneous layout rendering

  return (
    <div className="max-w-5xl mx-auto pb-24" style={{ fontFamily: "Poppins, sans-serif" }}>

      {publicView && (
        <div className="mb-6 flex items-center justify-between px-6 py-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 animate-in fade-in slide-in-from-top-4">
           <div className="flex items-center gap-3">
              <Eye size={20} className="text-blue-400 animate-pulse" />
              <div>
                 <h3 className="font-bold text-white text-sm">Recruiter Preview Mode Active</h3>
                 <p className="text-xs text-white/50 mt-0.5">This is exactly how your profile appears to recruiters and external viewers.</p>
              </div>
           </div>
           <button onClick={() => setPublicView(false)} className="text-xs font-bold text-black hover:scale-105 active:scale-95 bg-white px-5 py-2.5 rounded-xl transition-all shadow-xl">
             Exit Preview
           </button>
        </div>
      )}

      {/* TOASTS */}
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

      {/* HERO BANNER */}
      <div className="relative w-full rounded-3xl overflow-hidden mb-0" style={{ minHeight: 220 }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d1b35 0%, #12082a 40%, #1a0a10 70%, #0d1b35 100%)" }} />
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #FF6B6B 0%, transparent 70%)" }} />
        <div className="absolute -bottom-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,107,107,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,107,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 px-10 pt-10 pb-0">
          <div className="flex flex-col md:flex-row items-end gap-7">
            {/* Avatar */}
            <div className="relative shrink-0 translate-y-12">
              <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl bg-[#1e293b] border-2 border-white/10" style={{ boxShadow: "0 0 40px rgba(255,107,107,0.15)" }}>
                {imagePreview ? (
                  <img src={imagePreview} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white" style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #7c3aed 100%)" }}>
                    {initials}
                  </div>
                )}
              </div>
              {editMode && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white whitespace-nowrap transition-all" style={{ background: "rgba(0,0,0,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Camera size={10} /> Change
                  </button>
                </>
              )}
            </div>

            {/* Name + meta */}
            <div className={`flex-1 pb-5 space-y-1 ${loading ? "animate-pulse" : ""}`}>
              <div className="flex items-center gap-3 flex-wrap">
                {loading ? (
                  <div className="h-10 w-64 bg-white/10 rounded-xl" />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{name}</h1>
                )}
                {!loading && form.openToWork && (
                  <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-widest">Open to Work</span>
                )}
              </div>
              {loading ? (
                 <div className="h-4 w-48 bg-white/10 rounded-md mt-2" />
              ) : (
                 <p className="text-white/50 text-sm font-medium">
                   {form.department || "No Department"}{form.department && form.year && " · "}{form.year} Year
                 </p>
              )}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {loading ? (
                   <div className="h-3 w-80 bg-white/5 rounded-md mt-1" />
                ) : (
                   <>
                     <span className="flex items-center gap-1.5 text-xs text-white/40"><Mail size={12} className="text-[#FF6B6B]" /> {email}</span>
                     {form.location && <span className="flex items-center gap-1.5 text-xs text-white/40"><MapPin size={12} className="text-[#FF6B6B]" /> {form.location}</span>}
                     <span className="flex items-center gap-1.5 text-xs text-white/40"><Rocket size={12} className="text-[#FF6B6B]" /> Roll No: {form.rollNo}</span>
                   </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pb-6 flex items-center gap-2 shrink-0">
              {publicView ? (
                <button onClick={() => setPublicView(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white/90 hover:text-white transition-all hover:bg-white/10" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <X size={15} /> Exit Recruiter View
                </button>
              ) : !editMode ? (
                <>
                  <button onClick={() => setPublicView(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white/80 hover:text-white transition-all hover:bg-white/10 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <Eye size={15} /> View as Recruiter
                  </button>
                  <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg, #FF6B6B, #FF9A8B)", boxShadow: "0 4px 20px rgba(255,107,107,0.35)" }}>
                    <Edit3 size={15} /> Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white/70 transition-all hover:bg-white/10" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <X size={15} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #FF6B6B, #FF9A8B)", boxShadow: "0 4px 20px rgba(255,107,107,0.35)" }}>
                    <Save size={15} /> {saving ? "Saving…" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="w-full rounded-b-3xl px-10 py-5 flex items-center justify-between gap-4 flex-wrap bg-white/[0.02] border-x border-b border-white/10">
        <div className="w-28 hidden md:block" />
        <div className="flex-1 flex items-center gap-8 flex-wrap">
          <StatItem icon={Layers} value={stats.totalProjects} label="Total Projects" accent="#FF6B6B" />
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <StatItem icon={CheckCircle2} value={stats.approvedProjects} label="Approved" accent="#34d399" />
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <StatItem icon={Award} value={form.certifications ? form.certifications.split(",").length : 0} label="Certifications" accent="#a78bfa" />
        </div>
      </div>

      {/* TAB NAV */}
      <div className="mt-8 mb-6 flex gap-1 p-1 rounded-2xl w-fit bg-white/[0.04] border border-white/10">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === t.id ? 'bg-[#FF6B6B22] text-[#FF6B6B] border border-[#FF6B6B44]' : 'text-white/40 border border-transparent hover:text-white/60'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ABOUT */}
      {activeTab === "about" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <SectionLabel>Professional Bio</SectionLabel>
            {editMode ? (
              <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself, your passions, and your goals..." className="w-full px-5 py-4 rounded-2xl text-white/80 placeholder-white/25 text-sm leading-relaxed resize-none outline-none transition-all bg-white/[0.04] border border-[#FF6B6B44]" />
            ) : (
              <p className="text-white/60 text-sm leading-relaxed">{form.bio || <span className="italic text-white/20">Click Edit to add your bio.</span>}</p>
            )}
          </div>
          <div className="h-px bg-white/5" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <SectionLabel>Interested Roles</SectionLabel>
              {editMode ? (
                <input type="text" value={form.interestedRoles} onChange={(e) => setForm({ ...form, interestedRoles: e.target.value })} placeholder="e.g. Frontend Dev, UI/UX Designer" className="w-full px-5 py-3 rounded-2xl text-white/80 placeholder-white/25 text-sm outline-none transition-all bg-white/[0.04] border border-[#FF6B6B44]" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.interestedRoles ? form.interestedRoles.split(",").map((r, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#FF6B6B11] text-[#FF6B6B] border border-[#FF6B6B22] uppercase tracking-wider">{r.trim()}</span>
                  )) : <EmptyHint>No roles specified.</EmptyHint>}
                </div>
              )}
            </div>
            <div>
              <SectionLabel>Personal Links</SectionLabel>
              <div className="flex flex-wrap gap-3">
                {form.portfolio && !editMode && (
                  <a href={form.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#FF6B6B] hover:underline"><Globe size={14} /> Portfolio</a>
                )}
                {form.resume && !editMode && (
                  <a href={form.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60"><FileText size={14} /> Resume</a>
                )}
                {editMode && (
                  <div className="w-full space-y-3">
                    <input type="text" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} placeholder="Portfolio Link" className="w-full px-4 py-2 rounded-xl text-white/70 text-xs bg-white/[0.04] border border-white/10 outline-none" />
                    <input type="text" value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })} placeholder="Resume Drive/Public Link" className="w-full px-4 py-2 rounded-xl text-white/70 text-xs bg-white/[0.04] border border-white/10 outline-none" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SKILLS & CAREER */}
      {activeTab === "skills" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <SectionLabel>Technical Skills</SectionLabel>
            {editMode ? (
              <textarea rows={3} value={form.technicalSkills} onChange={(e) => setForm({ ...form, technicalSkills: e.target.value })} placeholder="React, Node.js, Python, AWS (comma separated)" className="w-full px-5 py-4 rounded-2xl text-white/80 placeholder-white/25 text-sm bg-white/[0.04] border border-[#FF6B6B44]" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {form.technicalSkills ? form.technicalSkills.split(",").map((s, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] text-white/80 border border-white/10">{s.trim()}</span>
                )) : <EmptyHint>No technical skills listed.</EmptyHint>}
              </div>
            )}
          </div>
          <div>
            <SectionLabel>Soft Skills</SectionLabel>
            {editMode ? (
              <input type="text" value={form.softSkills} onChange={(e) => setForm({ ...form, softSkills: e.target.value })} placeholder="Leadership, Communication (comma separated)" className="w-full px-5 py-3 rounded-2xl text-white/80 placeholder-white/25 text-sm bg-white/[0.04] border border-[#FF6B6B44]" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {form.softSkills ? form.softSkills.split(",").map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.03] text-white/50 border border-white/5">{s.trim()}</span>
                )) : <EmptyHint>No soft skills listed.</EmptyHint>}
              </div>
            )}
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl border transition-all ${form.openToWork ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.04] border-white/10'}`}>
              <div className="flex items-center gap-3">
                <Rocket size={18} className={form.openToWork ? 'text-green-400' : 'text-white/20'} />
                <div>
                  <p className="text-sm font-bold text-white">Career Availability</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Open for Internships & Full-time</p>
                </div>
                {editMode && (
                  <button onClick={() => setForm({ ...form, openToWork: !form.openToWork })} className={`ml-4 w-12 h-6 rounded-full relative transition-all ${form.openToWork ? 'bg-green-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.openToWork ? 'left-7' : 'left-1'}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACADEMIC */}
      {activeTab === "academic" && (
        <div className="space-y-0 divide-y divide-white/5 animate-in fade-in duration-500">
          <InfoRow icon={GraduationCap} label="Course / Department" value={form.department} editMode={editMode} onChange={(v) => setForm({ ...form, department: v })} />
          <InfoRow icon={Globe} label="Year / Semester" value={`${form.year} Year, Sem ${form.sem}`} editMode={editMode} onChange={(v) => {
            const parts = v.split(",");
            setForm({ ...form, year: parts[0]?.trim(), sem: parts[1]?.trim() });
          }} isDual={editMode} val1={form.year} val2={form.sem} label1="Year" label2="Sem" />
          <InfoRow icon={Rocket} label="Roll Number" value={form.rollNo} editMode={editMode} onChange={(v) => setForm({ ...form, rollNo: v })} />
          <InfoRow icon={Brain} label="Achievements" value={form.achievements} editMode={editMode} onChange={(v) => setForm({ ...form, achievements: v })} isWide={true} />
        </div>
      )}

      {/* TAB CONTENT: CONTACT */}
      {activeTab === "contact" && (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <div className="space-y-0 divide-y divide-white/5">
            <SectionLabel>Contact Details</SectionLabel>
            <InfoRow icon={Mail} label="Email" value={email} />
            <InfoRow icon={Phone} label="Phone" value={form.phone} editMode={editMode} onChange={(v) => setForm({ ...form, phone: v })} />
            <InfoRow icon={MapPin} label="Location" value={form.location} editMode={editMode} onChange={(v) => setForm({ ...form, location: v })} />
          </div>
          <div>
            <SectionLabel>Social Presence</SectionLabel>
            <div className="space-y-3 mt-3">
              {editMode ? (
                <>
                  <LinkEditRow icon={Linkedin} label="LinkedIn" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} placeholder="https://linkedin.com/..." />
                  <LinkEditRow icon={Github} label="GitHub" value={form.github} onChange={(v) => setForm({ ...form, github: v })} placeholder="https://github.com/..." />
                </>
              ) : (
                <>
                  <SocialLink icon={Linkedin} label="LinkedIn" value={form.linkedin} color="rgba(59,130,246,0.08)" iconColor="text-blue-400" />
                  <SocialLink icon={Github} label="GitHub" value={form.github} color="rgba(255,255,255,0.04)" iconColor="text-white/70" />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTS
function StatItem({ icon: Icon, value, label, accent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl" style={{ background: `${accent}18` }}><Icon size={16} style={{ color: accent }} /></div>
      <div>
        <p className="text-xl font-black text-white leading-none">{value}</p>
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-[#FF6B6B]/70">{children}</p>;
}

function EmptyHint({ children }) {
  return <span className="text-xs text-white/20 italic">{children}</span>;
}

function InfoRow({ icon: Icon, label, value, editMode, onChange, isDual, val1, val2, label1, label2, isWide }) {
  return (
    <div className="flex items-start gap-4 py-5">
      <div className="p-2.5 rounded-xl shrink-0 bg-[#FF6B6B08] border border-[#FF6B6B15]"><Icon size={15} className="text-[#FF6B6B]" /></div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">{label}</p>
        {editMode ? (
          isDual ? (
            <div className="flex gap-2">
              <input type="text" value={val1} onChange={(e) => onChange(`${e.target.value}, ${val2}`)} placeholder={label1} className="w-full px-4 py-2 rounded-xl text-white/80 bg-white/[0.04] border border-white/10 text-sm outline-none" />
              <input type="text" value={val2} onChange={(e) => onChange(`${val1}, ${e.target.value}`)} placeholder={label2} className="w-full px-4 py-2 rounded-xl text-white/80 bg-white/[0.04] border border-white/10 text-sm outline-none" />
            </div>
          ) : isWide ? (
            <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 rounded-xl text-white/80 bg-white/[0.04] border border-white/10 text-sm outline-none" rows={3} />
          ) : (
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 rounded-xl text-white/80 bg-white/[0.04] border border-white/10 text-sm outline-none" />
          )
        ) : (
          <p className="text-sm text-white/70">{value || "Not set"}</p>
        )}
      </div>
    </div>
  );
}

function LinkEditRow({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20"><Icon size={11} /> {label}</label>
      <input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl text-white/80 text-sm bg-white/[0.04] border border-white/10 outline-none" />
    </div>
  );
}

function SocialLink({ icon: Icon, label, value, color, iconColor }) {
  if (!value) return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl opacity-30 border border-white/5 bg-white/[0.02]">
      <Icon size={16} className="text-white" />
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-[10px] text-white/40">Not linked</p>
      </div>
    </div>
  );
  return (
    <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:scale-[1.02] border border-white/10" style={{ background: color }}>
      <div className={`p-2 rounded-xl bg-white/[0.05] ${iconColor}`}><Icon size={16} /></div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-[10px] text-white/35 truncate">{value}</p>
      </div>
      <ExternalLink size={14} className="text-white/20" />
    </a>
  );
}
