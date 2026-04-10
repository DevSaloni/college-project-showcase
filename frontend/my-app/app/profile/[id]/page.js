"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ExternalLink,
  Award,
  Globe,
  FileText,
  Rocket,
  Brain,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { toast } from "react-hot-toast";

export default function PublicInnovatorProfile() {
  const { BASE_URL } = useApi();
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalProjects: 0, approvedProjects: 0 });
  const [viewerRole, setViewerRole] = useState(null);
  const [viewerId, setViewerId] = useState(null);

  useEffect(() => {
    setViewerRole(localStorage.getItem("role"));
    setViewerId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/student/${id}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.student);
          setStats(data.stats || { totalProjects: 0, approvedProjects: 0 });
        } else {
          toast.error("Profile not found.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error fetching profile.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id, BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#FF6B6B] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-4">Profile Unavailable</h1>
          <button onClick={() => window.history.back()} className="text-sm font-bold text-[#FF6B6B] hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h1 className="text-xl font-black">Profile Not Found</h1>
      </div>
    );
  }

  // Enforce Recruiter Visibility (Privacy)
  // Logic: Allow access if:
  // 1. You are the owner (viewerId === profile.userId._id)
  // 2. You are a teacher, admin, or fellow student (authorized academic roles)
  // 3. You are a recruiter AND openToWork is true
  const isOwner = viewerId === profile?.userId?._id;
  const isAuthorizedRole = ["teacher", "admin", "student", "recruiter"].includes(viewerRole);

  if (profile && !profile.openToWork && !isOwner && !isAuthorizedRole) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 selection:bg-[#FF6B6B] selection:text-black">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Globe size={40} className="text-white/20" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Profile is Private</h1>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          This innovator has chosen to keep their profile private for recruiters. They are currently not visible to external hiring partners.
        </p>
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm font-bold text-[#FF6B6B] hover:text-[#FF9A8B] transition-colors">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const user = profile?.userId || {};
  const name = user.name || "Innovator";
  const email = user.email || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const profileImg = profile?.image ? (profile.image.startsWith("http") ? profile.image : `${BASE_URL}${profile.image}`) : null;

  const tabs = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills & Career" },
    { id: "academic", label: "Academic" },
    { id: "contact", label: "Contact & Links" },
  ];

  return (
    <div className="min-h-screen bg-black pt-12 pb-24 relative selection:bg-[#FF6B6B] selection:text-black font-['Poppins',sans-serif]">

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[180px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #FF6B6B 0%, transparent 70%)" }} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 pt-12">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="group flex items-center gap-2 text-white/40 hover:text-[#FF6B6B] transition-all text-1xl font-bold">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
          </button>
          <a href={`mailto:${email}`} className="block">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-xl" style={{ background: "linear-gradient(135deg, #FF6B6B, #FF9A8B)" }}>
              <Mail size={14} /> Hire This Innovator
            </button>
          </a>
        </div>

        {/* HERO BANNER - Exact match to Student Dashboard Profile */}
        <div className="relative w-full rounded-3xl overflow-hidden mb-0 shadow-2xl border border-white/5" style={{ minHeight: 220 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d1b35 0%, #12082a 40%, #1a0a10 70%, #0d1b35 100%)" }} />
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #FF6B6B 0%, transparent 70%)" }} />
          <div className="absolute -bottom-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,107,107,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,107,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="relative z-10 px-10 pt-10 pb-0">
            <div className="flex flex-col md:flex-row items-end gap-7">
              {/* Avatar */}
              <div className="relative shrink-0 md:translate-y-12">
                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl bg-[#1e293b] border-2 border-white/10" style={{ boxShadow: "0 0 40px rgba(255,107,107,0.15)" }}>
                  {profileImg ? (
                    <img src={profileImg} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white" style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #7c3aed 100%)" }}>
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Name + meta */}
              <div className="flex-1 pb-5 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{name}</h1>
                  {profile?.openToWork && (
                    <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-widest">Open to Work</span>
                  )}
                </div>
                <p className="text-white/50 text-sm font-medium">
                  {profile?.department || "No Department"}{profile?.department && profile?.year && " · "}{profile?.year} Year
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="flex items-center gap-1.5 text-xs text-white/40"><Mail size={12} className="text-[#FF6B6B]" /> {email}</span>
                  {profile?.location && <span className="flex items-center gap-1.5 text-xs text-white/40"><MapPin size={12} className="text-[#FF6B6B]" /> {profile.location}</span>}
                  <span className="flex items-center gap-1.5 text-xs text-white/40"><Rocket size={12} className="text-[#FF6B6B]" /> Roll No: {profile?.rollNo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="w-full rounded-b-3xl px-10 py-5 flex items-center justify-between gap-4 flex-wrap bg-white/[0.02] border-x border-b border-white/10 shadow-xl mb-10">
          <div className="w-28 hidden md:block" />
          <div className="flex-1 flex items-center gap-8 flex-wrap">
            <StatItem icon={Layers} value={stats.totalProjects} label="Total Projects" accent="#FF6B6B" />
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <StatItem icon={CheckCircle2} value={stats.approvedProjects} label="Approved" accent="#34d399" />
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <StatItem icon={Award} value={profile?.certifications?.length || 0} label="Certifications" accent="#a78bfa" />
          </div>
        </div>

        {/* TAB NAV */}
        <div className="mt-8 mb-6 flex gap-1 p-1 rounded-2xl w-full md:w-fit bg-white/[0.04] border border-white/10 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`whitespace-nowrap px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === t.id ? 'bg-[#FF6B6B22] text-[#FF6B6B] border border-[#FF6B6B44]' : 'text-white/40 border border-transparent hover:text-white/60'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT Area */}
        <div className="min-h-[400px]">
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <SectionLabel>Professional Bio</SectionLabel>
                <p className="text-white/60 text-sm leading-relaxed">{profile?.bio || <span className="italic text-white/20">Bio not available.</span>}</p>
              </div>
              <div className="h-px bg-white/5" />
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <SectionLabel>Interested Roles</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {profile?.interestedRoles?.length > 0 ? profile.interestedRoles.map((r, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#FF6B6B11] text-[#FF6B6B] border border-[#FF6B6B22] uppercase tracking-wider">{r.trim()}</span>
                    )) : <EmptyHint>No roles specified.</EmptyHint>}
                  </div>
                </div>
                <div>
                  <SectionLabel>Personal Links</SectionLabel>
                  <div className="flex flex-wrap gap-3">
                    {profile?.portfolio && (
                      <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#FF6B6B] hover:underline"><Globe size={14} /> Portfolio</a>
                    )}
                    {profile?.resume && (
                      <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60"><FileText size={14} /> Resume</a>
                    )}
                    {!profile?.portfolio && !profile?.resume && <EmptyHint>No links available.</EmptyHint>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <SectionLabel>Technical Skills</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {profile?.technicalSkills?.length > 0 ? profile.technicalSkills.map((s, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] text-white/80 border border-white/10">{s.trim()}</span>
                  )) : <EmptyHint>No technical skills listed.</EmptyHint>}
                </div>
              </div>
              <div>
                <SectionLabel>Soft Skills</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {profile?.softSkills?.length > 0 ? profile.softSkills.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.03] text-white/50 border border-white/5">{s.trim()}</span>
                  )) : <EmptyHint>No soft skills listed.</EmptyHint>}
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl border transition-all ${profile?.openToWork ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.04] border-white/10'}`}>
                  <div className="flex items-center gap-3">
                    <Rocket size={18} className={profile?.openToWork ? 'text-green-400' : 'text-white/20'} />
                    <div>
                      <p className="text-sm font-bold text-white">Recruiter Visibility</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Profile Visible to Recruiters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-0 divide-y divide-white/5 animate-in fade-in duration-500">
              <InfoRow icon={GraduationCap} label="Course / Department" value={profile?.department} />
              <InfoRow icon={Globe} label="Year / Semester" value={`${profile?.year || 'N/A'} Year, Sem ${profile?.sem || 'N/A'}`} />
              <InfoRow icon={Rocket} label="Roll Number" value={profile?.rollNo} />
              <InfoRow icon={Brain} label="Achievements" value={profile?.achievements?.join(", ") || "No achievements recorded"} isWide={true} />
            </div>
          )}

          {activeTab === "contact" && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="space-y-0 divide-y divide-white/5 border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                <SectionLabel>Contact Details</SectionLabel>
                <InfoRow icon={Mail} label="Email" value={email} />
                <InfoRow icon={Phone} label="Phone" value={profile.phone || "Privacy Shielded"} />
                <InfoRow icon={MapPin} label="Location" value={profile.location || "Global"} />
              </div>
              <div>
                <SectionLabel>Social Presence</SectionLabel>
                <div className="space-y-3 mt-3">
                  <SocialLink icon={Linkedin} label="LinkedIn" value={profile?.linkedin} color="rgba(59,130,246,0.08)" iconColor="text-blue-400" />
                  <SocialLink icon={Github} label="GitHub" value={profile?.github} color="rgba(255,255,255,0.04)" iconColor="text-white/70" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ATOMIC COMPONENTS
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

function InfoRow({ icon: Icon, label, value, isWide }) {
  return (
    <div className="flex items-start gap-4 py-5 group">
      <div className="p-2.5 rounded-xl shrink-0 bg-[#FF6B6B08] border border-[#FF6B6B15] group-hover:scale-105 transition-transform"><Icon size={15} className="text-[#FF6B6B]" /></div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">{label}</p>
        <p className={`text-sm text-white/70 ${isWide ? 'leading-relaxed' : ''}`}>{value || "Not set"}</p>
      </div>
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