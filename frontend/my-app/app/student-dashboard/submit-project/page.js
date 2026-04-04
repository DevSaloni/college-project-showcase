"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Send,
  Star,
  Layers,
  FileText,
  AlertCircle,
  Target,
  ListChecks,
  Cpu,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Users,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Check
} from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function SubmitProjectPage() {
  const { BASE_URL } = useApi();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Project details loaded from the selected active/completed project
  const [projectData, setProjectData] = useState(null);

  // Form data for the final publish
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    projectType: "",
    projectDuration: "",
    problem: "",
    description: "",
    projectOutcome: "",
    tech: "",
    toolsUsed: "",
    github: "",
    demoVideo: "",
    teamMembers: "",
    featureList: "",
    department: "",
    year: "",
    groupName: "",
    mentor: ""
  });

  const [bannerImage, setBannerImage] = useState(null);
  const [documentation, setDocumentation] = useState(null);

  // 1. Fetch academic projects to find completed ones
  useEffect(() => {
    const fetchAcademicProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await axios.get(`${BASE_URL}/api/student/my-academic-projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allSems = res.data.data || [];
        const completed = allSems.flatMap(sem => sem.projects).filter(p => p.status === "Completed" || p.status === "Active");
        // Allowing Active projects too so the user can see something during testing.
        setCompletedProjects(completed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicProjects();
  }, [BASE_URL]);

  // 2. Fetch full details when a project is selected
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/student/project-details/${selectedProjectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = res.data.data;
        setProjectData(data);
        
        // Auto-fill form
        setFormData({
          title: data.title || "",
          category: "",
          projectType: "Academic",
          projectDuration: data.totalWeeks ? `${data.totalWeeks} Weeks` : "",
          problem: data.problemStatement || "",
          description: data.description || "",
          projectOutcome: data.expectedOutcome || "",
          tech: Array.isArray(data.techStack) ? data.techStack.join(", ") : (data.techStack || ""),
          toolsUsed: "",
          github: "",
          demoVideo: "",
          teamMembers: "", 
          featureList: Array.isArray(data.features) ? data.features.join(", ") : (data.features || ""),
          department: data.department || "",
          year: data.year || "",
          groupName: data.groupName || "",
          mentor: data.mentorName || ""
        });
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project details.");
      }
    };
    
    fetchProjectDetails();
  }, [selectedProjectId, BASE_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) setBannerImage(file);
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file) setDocumentation(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !bannerImage) {
      toast.error("Please fill Title, Category, and provide a Banner Image.");
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });
      
      if (bannerImage) payload.append("bannerImage", bannerImage);
      if (documentation) payload.append("documentation", documentation);

      const res = await axios.post(`${BASE_URL}/api/projects/create`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        },
      });

      toast.success("Project submitted successfully to Explore Page!");
      router.push("/explore");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Publish Project
          </h1>
          <p className="text-white/40 text-sm">
            Showcase your completed project on the Explore Page for recruiters and peers to see.
          </p>
        </div>
      </div>

      {/* STAGE 1: SELECT PROJECT */}
      {!selectedProjectId ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20">
              <FolderKanban size={18} className="text-[var(--pv-accent)]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Select a Project to Publish</h2>
              <p className="text-white/40 text-sm">Choose from your completed academic projects.</p>
            </div>
          </div>

          {completedProjects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <AlertCircle size={40} className="text-white/20 mx-auto mb-3" />
              <p className="text-white font-bold">No eligible projects found</p>
              <p className="text-white/40 text-sm mt-1 mb-4">You need an active or completed academic project to publish.</p>
              <Link href="/student-dashboard/my-projects">
                <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/10 transition-all">
                  Go to My Projects
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedProjects.map((p) => (
                <div 
                  key={p._id}
                  onClick={() => setSelectedProjectId(p._id)}
                  className="bg-black/40 border border-white/10 hover:border-[var(--pv-accent)]/50 rounded-2xl p-5 cursor-pointer transition-all group hover:shadow-lg hover:shadow-[var(--pv-accent)]/10"
                >
                  <p className="text-white font-bold mb-1 truncate group-hover:text-[var(--pv-accent)] transition-colors">{p.title}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Select Project</span>
                    <ChevronRight size={14} className="text-white/30 group-hover:text-[var(--pv-accent)] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* STAGE 2: PUBLISH FORM */
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-0">
          
          <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20">
                <Star size={18} className="text-[var(--pv-accent)]" />
              </div>
              <div>
                <p className="text-white font-bold">Review & Publish</p>
                <p className="text-white/40 text-xs">Finalize your project details before publishing to Explore</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setSelectedProjectId(null)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold border border-white/10 transition-all"
            >
              Change Project
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={Star} label="Project Title *" name="title" value={formData.title} onChange={handleChange} placeholder="Project Vault Platform" />
              <InputField icon={Layers} label="Category *" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Web Development" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={Layers} label="Project Type" name="projectType" value={formData.projectType} onChange={handleChange} placeholder="Major / Minor" />
              <InputField icon={Layers} label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Computer Science" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextareaField icon={AlertCircle} label="Problem Statement" name="problem" value={formData.problem} onChange={handleChange} placeholder="What problem does this solve?" />
              <TextareaField icon={FileText} label="Project Description" name="description" value={formData.description} onChange={handleChange} placeholder="Detailed overview of the project" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextareaField icon={ListChecks} label="Key Features" name="featureList" value={formData.featureList} onChange={handleChange} placeholder="Comma-separated features e.g. Auth, Real-time Chat..." />
              <TextareaField icon={Target} label="Project Outcome" name="projectOutcome" value={formData.projectOutcome} onChange={handleChange} placeholder="What was achieved?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={Cpu} label="Tech Stack" name="tech" value={formData.tech} onChange={handleChange} placeholder="Comma-separated e.g. React, Node, MongoDB" />
              <InputField icon={Cpu} label="Tools Used" name="toolsUsed" value={formData.toolsUsed} onChange={handleChange} placeholder="Comma-separated e.g. VS Code, Figma" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={LinkIcon} label="GitHub Link" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." />
              <InputField icon={Video} label="Demo Video Link" name="demoVideo" value={formData.demoVideo} onChange={handleChange} placeholder="https://youtube.com/..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={Users} label="Team Members" name="teamMembers" value={formData.teamMembers} onChange={handleChange} placeholder="Comma-separated names e.g. Alice, Bob" />
              <InputField icon={Layers} label="Group Name" name="groupName" value={formData.groupName} onChange={handleChange} placeholder="Group 12" />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 rounded-2xl bg-black/20 border border-white/5">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                  <ImageIcon size={14} className="text-[var(--pv-accent)]" />
                  Banner Image *
                </label>
                <div className="relative">
                  <input type="file" required accept="image/*" onChange={handleBannerChange} className="w-full text-sm text-white/50 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 file:transition-colors file:cursor-pointer cursor-pointer border border-dashed border-white/10 rounded-xl p-2 pb-2 bg-white/[0.01] hover:bg-white/[0.02]" />
                  {bannerImage && <div className="absolute top-1/2 -translate-y-1/2 right-4 text-emerald-400 bg-emerald-500/10 p-1 rounded-full"><Check size={14} /></div>}
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                  <FileText size={14} className="text-[var(--pv-accent)]" />
                  Documentation (Optional)
                </label>
                <div className="relative">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleDocChange} className="w-full text-sm text-white/50 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 file:transition-colors file:cursor-pointer cursor-pointer border border-dashed border-white/10 rounded-xl p-2 pb-2 bg-white/[0.01] hover:bg-white/[0.02]" />
                  {documentation && <div className="absolute top-1/2 -translate-y-1/2 right-4 text-emerald-400 bg-emerald-500/10 p-1 rounded-full"><Check size={14} /></div>}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 border-b-2 active:translate-y-0.5 active:border-b-0 ${
                  submitting
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20 cursor-not-allowed"
                    : "bg-[var(--pv-accent)] text-black border-black/20 hover:shadow-lg hover:shadow-[var(--pv-accent)]/20 hover:scale-[1.02] cursor-pointer"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Publish to Explore
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function InputField({ icon: Icon, label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50">
        {Icon && <Icon size={14} className="text-[var(--pv-accent)]" />}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 focus:border-[var(--pv-accent)]/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--pv-accent)]/20"
      />
    </div>
  );
}

function TextareaField({ icon: Icon, label, name, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50">
        {Icon && <Icon size={14} className="text-[var(--pv-accent)]" />}
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-black/40 border border-white/10 focus:border-[var(--pv-accent)]/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--pv-accent)]/20 resize-y min-h-[100px]"
      />
    </div>
  );
}
