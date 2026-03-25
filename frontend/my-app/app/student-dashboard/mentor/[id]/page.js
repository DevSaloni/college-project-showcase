"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
   ArrowLeft,
   Mail,
   BookOpen,
   GraduationCap,
   MapPin,
   Phone,
   Github,
   Linkedin,
   Award,
   Briefcase,
   Layout,
   Users,
   AlertCircle,
   BadgeCheck,
   MessageSquare,
   Globe,
   Sparkles,
   ShieldCheck,
   Cpu,
   ExternalLink,
   Book,
   Trophy,
   Camera,
   Layers,
   CheckCircle2,
   FileText,
   Search,
   Zap,
   Star,
   Code2,
   Clock
} from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function MentorProfilePage() {
   const { BASE_URL } = useApi();
   const { id } = useParams();
   const router = useRouter();
   const [mentor, setMentor] = useState(null);
   const [groupsCount, setGroupsCount] = useState(0);
   const [studentsCount, setStudentsCount] = useState(0);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("about");

   useEffect(() => {
      const fetchMentor = async () => {
         try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/teacher/${id}`, {
               headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
               setMentor(data.teacher);
               setGroupsCount(data.groupsAssigned || 0);
               setStudentsCount(data.studentsCount || 0);
            }
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      if (id) fetchMentor();
   }, [id, BASE_URL]);

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-pulse">
            <div className="w-28 h-28 rounded-2xl bg-white/5" />
            <div className="space-y-3 flex flex-col items-center">
               <div className="h-8 w-64 bg-white/10 rounded-xl" />
               <div className="h-4 w-48 bg-white/5 rounded-lg" />
            </div>
         </div>
      );
   }

   if (!mentor) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
            <div className="p-6 rounded-[2.5rem] bg-red-500/10 border border-red-500/20">
               <AlertCircle size={64} className="text-red-400/50" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-3 leading-none">Mentor Not Found</h2>
               <p className="text-white/30 text-xs font-bold uppercase tracking-widest px-4 max-w-sm mx-auto leading-relaxed">The requested mentor profile could not be synchronized with the repository hub.</p>
            </div>
            <button onClick={() => router.back()} className="px-8 py-3.5 bg-white/5 text-white rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95">Return to Control Center</button>
         </div>
      );
   }

   const name = mentor.userId?.name || "Mentor";
   const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
   const isActive = mentor.status === "Active";

   const tabs = [
      { id: "about", label: "About" },
      { id: "academic", label: "Academic" },
      { id: "contact", label: "Contact & Links" },
   ];

   return (
      <div className="max-w-5xl mx-auto pb-24" style={{ fontFamily: "Poppins, sans-serif" }}>

         {/* BREADCRUMB */}
         <div className="mb-6 flex items-center justify-between px-2">
            <button
               onClick={() => router.back()}
               className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-xl active:scale-95"
            >
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               Back to Dashboard
            </button>
            <div className="hidden md:flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)] animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Faculty Profile</span>
            </div>
         </div>

         {/* HERO BANNER (Matches Student Profile) */}
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
                        {mentor.image ? (
                           <img src={`${BASE_URL}${mentor.image}`} alt={name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white" style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #7c3aed 100%)" }}>
                              {initials}
                           </div>
                        )}
                     </div>
                     <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full border border-black/40 font-black text-[8px] uppercase tracking-widest shadow-2xl z-20 ${isActive ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>
                        {isActive ? "Active" : "Inactive"}
                     </div>
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 pb-5 space-y-1">
                     <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase">{name}</h1>
                        <BadgeCheck size={24} className="text-[var(--pv-accent)]" />
                     </div>
                     <p className="text-white/50 text-sm font-medium">
                        {mentor.designation || "Faculty"} · {mentor.department || "No Department"}
                     </p>
                     <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span className="flex items-center gap-1.5 text-xs text-white/40 text-nowrap"><Mail size={12} className="text-[#FF6B6B]" /> {mentor.userId?.email}</span>
                        {mentor.location && <span className="flex items-center gap-1.5 text-xs text-white/40 text-nowrap"><MapPin size={12} className="text-[#FF6B6B]" /> {mentor.location}</span>}
                     </div>
                  </div>

                  {/* Verification Badge (Removed Reputation segment per user request) */}
               </div>
            </div>
         </div>

         {/* STATS BAR (Matches Student Profile) */}
         <div className="w-full rounded-b-3xl px-10 py-5 flex items-center justify-between gap-4 flex-wrap bg-white/[0.02] border-x border-b border-white/10">
            <div className="w-28 hidden md:block" />
            <div className="flex-1 flex items-center gap-8 flex-wrap">
               <StatItem icon={Layers} value={groupsCount} label="Groups Assigned" accent="#FF6B6B" />
               <div className="w-px h-8 bg-white/10 hidden sm:block" />
               <StatItem icon={Users} value={studentsCount} label="Students" accent="#a78bfa" />
               {mentor.experience && (
                  <>
                     <div className="w-px h-8 bg-white/10 hidden sm:block" />
                     <StatItem icon={Award} value={mentor.experience} label="Experience" accent="#34d399" />
                  </>
               )}
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
               {/* Bio */}
               <div>
                  <SectionLabel>Biography</SectionLabel>
                  <p className="text-white/60 text-sm leading-relaxed">
                     {mentor.bio || (
                        <span className="italic text-white/25">No bio available.</span>
                     )}
                  </p>
               </div>

               {/* Divider */}
               <div className="h-px bg-white/5" />

               {/* Expertise tags */}
               <div>
                  <SectionLabel>Areas of Expertise</SectionLabel>
                  {mentor.expertise ? (
                     <div className="flex flex-wrap gap-2">
                        {mentor.expertise.split(",").map((s, i) => (
                           <span
                              key={i}
                              className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold"
                              style={{ background: "rgba(255,107,107,0.1)", color: "#FF9A8B", border: "1px solid rgba(255,107,107,0.2)" }}
                           >
                              {s.trim()}
                           </span>
                        ))}
                     </div>
                  ) : (
                     <EmptyHint>No expertise listed.</EmptyHint>
                  )}
               </div>

               <div className="h-px bg-white/5" />

               {/* Subjects */}
               <div>
                  <SectionLabel>Subjects Taught</SectionLabel>
                  {mentor.subjects ? (
                     <div className="flex flex-wrap gap-2">
                        {mentor.subjects.split(",").map((s, i) => (
                           <span
                              key={i}
                              className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold"
                              style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}
                           >
                              {s.trim()}
                           </span>
                        ))}
                     </div>
                  ) : (
                     <EmptyHint>No subjects listed.</EmptyHint>
                  )}
               </div>
            </div>
         )}

         {/* TAB CONTENT: ACADEMIC */}
         {activeTab === "academic" && (
            <div className="space-y-0 divide-y divide-white/5 animate-in fade-in duration-500">
               <InfoRow icon={GraduationCap} label="Qualification" value={mentor.qualification} />
               <InfoRow icon={Briefcase} label="Experience" value={mentor.experience} />
               <InfoRow icon={BookOpen} label="Subjects" value={mentor.subjects} />
               <InfoRow icon={Code2} label="Expertise" value={mentor.expertise} />
            </div>
         )}

         {/* TAB CONTENT: CONTACT & LINKS */}
         {activeTab === "contact" && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
               <div className="space-y-0 divide-y divide-white/5">
                  <SectionLabel>Contact Details</SectionLabel>
                  <InfoRow icon={Mail} label="Email" value={mentor.userId?.email} />
                  <InfoRow icon={Phone} label="Phone" value={mentor.phone} />
                  <InfoRow icon={MapPin} label="Location" value={mentor.location} />
               </div>
               <div className="space-y-6">
                  <SectionLabel>Professional Links</SectionLabel>
                  <div className="space-y-3 mt-3">
                     <SocialLink icon={Linkedin} label="LinkedIn Presence" value={mentor.linkedin} color="rgba(59,130,246,0.08)" iconColor="text-blue-400" />
                     <SocialLink icon={Github} label="Repository Hub" value={mentor.github} color="rgba(255,255,255,0.04)" iconColor="text-white/70" />
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
         <div className="p-2.5 rounded-xl transition-all hover:scale-105" style={{ background: `${accent}18` }}><Icon size={16} style={{ color: accent }} /></div>
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

function InfoRow({ icon: Icon, label, value }) {
   return (
      <div className="flex items-start gap-4 py-5 hover:bg-white/[0.01] transition-all px-2 rounded-xl group">
         <div className="p-2.5 rounded-xl shrink-0 bg-[#FF6B6B08] border border-[#FF6B6B15] group-hover:border-[#FF6B6B33] transition-colors"><Icon size={15} className="text-[#FF6B6B]" /></div>
         <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">{label}</p>
            <p className="text-sm font-bold text-white/70 uppercase tracking-tight">{value || "Not synchronized"}</p>
         </div>
      </div>
   );
}

function SocialLink({ icon: Icon, label, value, color, iconColor }) {
   if (!value) return (
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl opacity-20 border border-white/5 bg-white/[0.02]">
         <Icon size={16} className="text-white" />
         <div>
            <p className="text-sm font-semibold text-white uppercase tracking-tight">{label}</p>
            <p className="text-[10px] text-white/40 uppercase font-black uppercase">Not Linked</p>
         </div>
      </div>
   );
   return (
      <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:scale-[1.02] border border-white/10 hover:border-white/20 shadow-xl" style={{ background: color }}>
         <div className={`p-2 rounded-xl bg-white/[0.05] ${iconColor}`}><Icon size={16} /></div>
         <div className="flex-1">
            <p className="text-sm font-bold text-white uppercase tracking-tight leading-none mb-1">{label}</p>
            <p className="text-[9px] text-white/35 truncate uppercase font-black tracking-widest">{value}</p>
         </div>
         <ExternalLink size={14} className="text-white/20" />
      </a>
   );
}
