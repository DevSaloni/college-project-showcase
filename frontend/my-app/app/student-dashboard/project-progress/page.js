"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Clock,
  UploadCloud,
  CloudUploadIcon,
  Link as LinkIcon,
  AlertTriangle,
  Sparkles,
  Layers,
  GraduationCap,
  CalendarDays,
  Activity,
  ChevronRight,
  FileText,
  MessageSquare,
  ExternalLink,
  Target,
  ArrowRight,
  Monitor,
  Send,
  X,
  Plus,
  Video,
  MapPin,
  Paperclip,
  Image as ImageIcon,
  File,
  Check,
  CheckCheck,
  Edit2,
  Trash2,
  MoreVertical,
  Calendar,
  Timer,

} from "lucide-react";
import axios from "axios";
import { useApi } from "@/context/ApiContext";
import { io } from "socket.io-client";

// Placeholder components for StatCard
const StatCard = ({ icon: Icon, label, value, color, bg, border }) => (
  <div className={`bg-white/[0.03] border ${border} rounded-3xl p-6 group hover:bg-white/[0.05] transition-all cursor-default`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="space-y-1 text-left">
      <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">{label}</p>
      <p className="text-lg font-black text-white truncate">{value}</p>
    </div>
  </div>
);

export default function ProjectProgressPage() {
  const { BASE_URL } = useApi();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("milestones"); // "milestones", "discussion"
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");

  const [form, setForm] = useState({
    repoLink: "",
    description: "",
    files: [],
  });

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/progress/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data || {};
      setProject(data.project || null);
      setMilestones(data.milestones || []);
      setProgress(data.progressPercentage || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500); // Aesthetic delay
    }
  };

  useEffect(() => {
    fetchData();
  }, [BASE_URL]);

  /* ================= DISCUSSION & SOCKET ================= */
  useEffect(() => {
    if (!project?.groupId) return;

    const token = localStorage.getItem("token");
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/discussions/${project.groupId}?context=progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        setMessages(d.messages || []);
      } catch (err) { console.error(err); }
    };
    fetchMessages();

    if (!socketRef.current) {
      socketRef.current = io(BASE_URL, { transports: ["websocket"], withCredentials: true });
    }
    const socket = socketRef.current;
    socket.emit("joinGroup", project.groupId);

    socket.on("receiveMessage", (message) => {
      if (message.context !== "progress") return;
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (activeTab === "discussion") markAsRead(project.groupId);
    });

    socket.on("messageUpdated", (updatedMsg) => {
      setMessages((prev) => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
    });

    socket.on("messagesRead", ({ userId }) => {
      setMessages(prev => prev.map(m => {
        if (!m.readBy?.includes(userId)) {
          return { ...m, readBy: [...(m.readBy || []), userId] };
        }
        return m;
      }));
    });

    socket.on("userTyping", (name) => setTypingUser(name));
    socket.on("userStopTyping", () => setTypingUser(null));

    return () => {
      socket.off("receiveMessage");
      socket.off("messageUpdated");
      socket.off("messagesRead");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [project?.groupId, BASE_URL, activeTab]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (activeTab === "discussion") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      const token = localStorage.getItem("token");
      if (token && messages.length > 0) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const myId = payload.id;
        if (!messages[messages.length - 1].readBy?.includes(myId)) {
          if (project?.groupId) markAsRead(project.groupId);
        }
      }
    }
  }, [messages, activeTab, project?.groupId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/discussions/${id}/read?context=progress`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) { console.error(err); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File size exceeds 5MB limit.");
    setAttachment(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setAttachmentPreview({ type: "image", url, name: file.name });
    } else {
      setAttachmentPreview({ type: "file", url: null, name: file.name });
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (attachmentPreview?.url) URL.revokeObjectURL(attachmentPreview.url);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if (!chatText.trim() && !attachment) return;
    try {
      const formData = new FormData();
      if (chatText.trim()) formData.append("message", chatText);
      formData.append("context", "progress");
      if (attachment) formData.append("attachment", attachment);

      const res = await axios.post(`${BASE_URL}/api/discussions/${project.groupId}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      socketRef.current?.emit("sendMessage", {
        groupId: project.groupId,
        message: res.data.message,
      });
      setChatText("");
      removeAttachment();
    } catch (err) { console.error(err); }
  };

  const submitEdit = async () => {
    if (!editMessageText.trim()) return;
    try {
      await axios.put(`${BASE_URL}/api/discussions/${editingMessageId}/edit`,
        { message: editMessageText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditingMessageId(null);
      setEditMessageText("");
    } catch (err) { console.error(err); }
  };

  const deleteMessage = async (msgId) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/discussions/${msgId}/delete`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) { console.error(err); }
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return isToday ? `Today at ${time}` : `${date.toLocaleDateString()} at ${time}`;
  };

  /* ================= ACTIVE ================= */
  const activeMilestone =
    milestones.find((m) => m.status !== "approved") || {
      week: milestones.length + 1,
      title: `Week ${milestones.length + 1} Submission`,
    };

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((p) => ({ ...p, files: Array.from(files) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const submitProgress = async () => {
    if (!project?._id) return alert("Project not assigned");

    if (!form.repoLink && !form.description && form.files.length === 0) {
      return alert("Add something to submit");
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("projectId", project._id);
      formData.append("week", Number(activeMilestone.week));
      formData.append("title", activeMilestone.title);
      formData.append("repoLink", form.repoLink);
      formData.append("description", form.description);

      form.files.forEach((file) => formData.append("files", file));

      const res = await axios.post(
        `${BASE_URL}/api/progress/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);
      setForm({ repoLink: "", description: "", files: [] });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };



  const getPhaseName = (p) => {
    if (p < 25) return "Discovery & Planning";
    if (p < 50) return "Core Development";
    if (p < 75) return "Refinement & Polishing";
    if (p < 100) return "Testing & Finalization";
    return "Project Completed";
  };

  const statusConfig = {
    approved: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Approved" },
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Under Review" },
    rejected: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Needs Changes" },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
        <div className="space-y-1">

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Project Milestone Hub
          </h1>
          <p className="text-white/40 text-sm max-w-lg">
            Monitor your milestones, submit weekly progress, and drive your project towards excellence.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-end">
            <span className="text-[10px] text-white/30 uppercase font-black">Current Phase</span>
            <span className="text-sm font-bold text-white/80">{getPhaseName(progress)}</span>
          </div>
        </div>
      </div>

      {/* ── TOP STATS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Layers}
          label="Active Project"
          value={project?.title || "Not Assigned"}
          color="text-[var(--pv-accent)]"
          bg="bg-[var(--pv-accent)]/10"
          border="border-[var(--pv-accent)]/20"
        />
        <StatCard
          icon={GraduationCap}
          label="Mentor"
          value={project?.mentorName || project?.mentor?.name || "Unassigned"}
          color="text-blue-400"
          bg="bg-blue-500/10"
          border="border-blue-500/20"
        />
        <StatCard
          icon={Target}
          label="Completed"
          value={`${milestones.filter(m => m.status === 'approved').length} / ${milestones.length || '—'} Marks`}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          border="border-emerald-500/20"
        />
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:border-[var(--pv-accent)]/30 transition-all cursor-default">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity size={16} />
            </div>
            <span className="text-lg font-black text-white">{progress}%</span>
          </div>
          <div className="space-y-2 mt-4 text-left">
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Overall Velocity</p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-3">
        {[
          { id: "milestones", icon: Monitor, label: "Milestones & Submissions" },
          { id: "discussion", icon: MessageSquare, label: "Discussion Hub" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === id
              ? "bg-[var(--pv-accent)] text-black shadow-lg shadow-[var(--pv-accent)]/20"
              : "bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "milestones" && (
            <>
              {/* SUBMISSION FORM */}
              {activeMilestone && (
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--pv-accent)]/5 rounded-full blur-3xl -z-10" />
                  <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20">
                        <CloudUploadIcon />
                      </div>
                      <div>
                        <h2 className="text-white font-bold">New Submission</h2>
                        <p className="text-white/40 text-xs">Active Milestone: {activeMilestone.title}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/40 tracking-wider">
                      Week {activeMilestone.week}
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* FORM INPUTS */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <LinkIcon size={12} /> Repository Link
                        </label>
                        <input
                          name="repoLink"
                          value={form.repoLink}
                          onChange={handleChange}
                          placeholder="https://github.com/username/project"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--pv-accent)]/50 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <FileText size={12} /> Work Description
                        </label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Describe the tasks completed this week, challenges faced, and features implemented..."
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--pv-accent)]/50 transition-colors resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <Layers size={12} /> Artifacts & Assets (Optional)
                        </label>
                        <label className="group flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl py-8 transition-all hover:bg-white/[0.02] hover:border-[var(--pv-accent)]/30 cursor-pointer">
                          <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:bg-[var(--pv-accent)]/10 transition-colors">
                            <UploadCloud className="text-white/30 group-hover:text-[var(--pv-accent)]" />
                          </div>
                          <p className="text-sm text-white/50 font-medium">Click to upload files or drag & drop</p>
                          <p className="text-[10px] text-white/20 mt-1 uppercase font-bold tracking-tighter">PDF, ZIP, PNG, MP4 up to 20MB</p>
                          <input
                            type="file"
                            hidden
                            multiple
                            name="files"
                            onChange={handleChange}
                          />
                        </label>
                        {form.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {form.files.map((f, i) => (
                              <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs flex items-center gap-2">
                                <FileText size={10} className="text-blue-400" />
                                <span className="text-white/60 truncate max-w-[120px]">{f.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        disabled={submitting}
                        onClick={submitProgress}
                        className="w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm transition-all duration-300 bg-gradient-to-r from-[var(--pv-accent)] to-[var(--pv-accent-2)] text-black flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--pv-accent)]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Submit Weekly Progress
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-white/30 mt-4 text-center md:text-left">By submitting, you confirm that this work is original and adheres to the project guidelines.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* MILESTONE TIMELINE */}
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 overflow-hidden relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Project Timeline</h2>
                    <p className="text-white/40 text-xs">Phased milestone tracking and evaluation history</p>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <div className="absolute left-[21px] top-4 bottom-4 w-px bg-white/5" />
                  {milestones.length === 0 ? (
                    <div className="text-center py-10 text-white/20 italic text-sm">No milestones recorded yet.</div>
                  ) : (
                    milestones.map((ms, idx) => {
                      const sc = statusConfig[ms.status] || statusConfig.pending;
                      const Icon = sc.icon;

                      return (
                        <div key={idx} className="relative pl-12 group">
                          <div className={`absolute left-0 top-0 w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${sc.bg} ${sc.border} ${sc.color} group-hover:scale-110 shadow-lg`}>
                            <Icon size={18} />
                          </div>
                          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Week {ms.week}</span>
                                <h4 className="text-white font-bold">{ms.title}</h4>
                              </div>
                              <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${sc.bg} ${sc.border} ${sc.color}`}>
                                {sc.label}
                              </div>
                            </div>

                            {ms.description && <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{ms.description}</p>}

                            {ms.mentorFeedback && (
                              <div className={`p-4 rounded-xl border ${sc.bg} ${sc.border} relative overflow-hidden group/feedback`}>
                                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                  <MessageSquare size={12} /> Mentor Feedback
                                </div>
                                <p className="text-sm text-white/80 whitespace-pre-wrap italic leading-relaxed">"{ms.mentorFeedback}"</p>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/5">
                              {ms.repoLink && (
                                <a href={ms.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-[var(--pv-accent)] text-[10px] font-bold uppercase transition-colors">
                                  <LinkIcon size={12} /> Repository
                                </a>
                              )}
                              <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase ml-auto">
                                <Clock size={12} /> {new Date(ms.submittedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {/* DISCUSSION TAB */}
          {activeTab === "discussion" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-[var(--pv-accent)]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Discussion with Mentor</p>
                  <p className="text-white/40 text-xs">{project?.mentorName || "Mentor"} · {project?.title}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white/40 font-medium tracking-wider uppercase">Live</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-5 opacity-40">
                    <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10">
                      <MessageSquare size={40} className="text-white/40" />
                    </div>
                    <div>
                      <p className="font-bold text-white/60 mb-1">No messages yet</p>
                      <p className="text-white/30 text-sm">Start a conversation with your mentor!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderRole === "student";
                    const isRead = msg.readBy && msg.readBy.some((id) => id !== msg.sender?._id);

                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"} group items-end gap-2.5`}>
                        {!isMe && (
                          <div className="w-9 h-9 rounded-2xl bg-[var(--pv-accent)]/15 border border-[var(--pv-accent)]/25 flex items-center justify-center text-xs font-black text-[var(--pv-accent)] shrink-0">
                            {msg.sender?.name?.charAt(0) || "T"}
                          </div>
                        )}

                        {isMe && !msg.isDeleted && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 mb-4">
                            <button onClick={() => { setEditingMessageId(msg._id); setEditMessageText(msg.message); }} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                              <Edit2 size={11} />
                            </button>
                            <button onClick={() => deleteMessage(msg._id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}

                        <div className="max-w-[75%] space-y-1">
                          {!isMe && <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider ml-1">{msg.sender?.name || "Mentor"}</span>}

                          {editingMessageId === msg._id ? (
                            <div className="p-3 bg-black/40 border border-white/20 rounded-2xl flex flex-col gap-2 min-w-[240px]">
                              <textarea value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} className="bg-transparent outline-none text-white text-sm resize-none w-full" rows={2} autoFocus />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingMessageId(null)} className="text-xs text-white/50 hover:text-white px-3 py-1 rounded-lg bg-white/5 transition-colors">Cancel</button>
                                <button onClick={submitEdit} className="text-xs text-black font-bold px-3 py-1 rounded-lg bg-[var(--pv-accent)] transition-colors">Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${msg.isDeleted ? "bg-black/20 text-white/30 italic border border-white/5 rounded-bl-none" : isMe ? "bg-[var(--pv-accent)] text-black font-medium rounded-br-none shadow-[var(--pv-accent)]/20" : "bg-white/[0.07] text-white rounded-bl-none border border-white/10"}`}>
                              {msg.fileUrl && !msg.isDeleted && (
                                <div className="mb-2">
                                  {msg.fileType?.startsWith("image/") ? (
                                    <div className="rounded-lg overflow-hidden border border-white/10 max-w-[240px]">
                                      <img src={`${BASE_URL}${msg.fileUrl}`} alt="attachment" className="w-full object-cover" />
                                    </div>
                                  ) : (
                                    <a href={`${BASE_URL}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${isMe ? 'bg-black/10 border-black/10 text-black hover:bg-black/20' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}>
                                      <File size={16} className={isMe ? "opacity-60" : "text-[var(--pv-accent)]"} />
                                      <span className="text-xs font-bold truncate max-w-[150px]">{msg.fileName || "View Attachment"}</span>
                                    </a>
                                  )}
                                </div>
                              )}
                              <p>{msg.message}</p>
                              {msg.isEdited && !msg.isDeleted && <span className={`text-[9px] ml-1 font-bold ${isMe ? "opacity-40" : "text-white/20"}`}>(edited)</span>}
                            </div>
                          )}

                          <div className={`flex items-center gap-1.5 ${isMe ? "justify-end mr-1" : "ml-1"}`}>
                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{formatMessageDate(msg.createdAt)}</p>
                            {isMe && !msg.isDeleted && (
                              <span className="text-white/30">
                                {isRead ? <CheckCheck size={12} className="text-blue-400" /> : <Check size={12} />}
                              </span>
                            )}
                          </div>
                        </div>

                        {isMe && (
                          <div className="w-9 h-9 rounded-2xl bg-[var(--pv-accent)] border border-black/10 flex items-center justify-center text-xs font-black text-black shrink-0 uppercase">
                            ME
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {typingUser && <p className="px-6 py-2 text-[10px] text-[var(--pv-accent)] font-bold animate-pulse">{typingUser} is typing...</p>}

              {/* Input Area */}
              <div className="p-6 bg-white/[0.02] border-t border-white/10 space-y-4">
                {attachmentPreview && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl w-fit pr-10 relative group">
                    {attachmentPreview.type === "image" ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-xl">
                        <img src={attachmentPreview.url} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[var(--pv-accent)]/20 text-[var(--pv-accent)] flex items-center justify-center border border-[var(--pv-accent)]/30">
                        <File size={22} />
                      </div>
                    )}
                    <span className="text-xs font-bold text-white/70 truncate max-w-[180px]">{attachmentPreview.name}</span>
                    <button onClick={removeAttachment} className="absolute -top-2 -right-2 p-1.5 bg-black border border-white/10 text-white rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl"><X size={12} /></button>
                  </div>
                )}

                <div className="flex items-end gap-4">
                  <label className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/30 hover:bg-[var(--pv-accent)]/5 transition-all cursor-pointer group active:scale-95 shadow-xl">
                    <input type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                    <Paperclip size={20} className="transform rotate-45 group-hover:scale-110 transition-transform" />
                  </label>

                  <textarea
                    value={chatText}
                    onChange={(e) => {
                      setChatText(e.target.value);
                      socketRef.current?.emit("typing", { groupId: project.groupId, name: "Student" });
                      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => socketRef.current?.emit("stopTyping", project.groupId), 2000);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message to your mentor..."
                    rows={1}
                    className="flex-1 min-h-[48px] max-h-[160px] bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--pv-accent)]/50 transition-all resize-none overflow-y-auto"
                  />

                  <button onClick={sendMessage} className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--pv-accent)] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,107,107,0.2)]">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -z-10 group-hover:bg-purple-500/10 transition-colors" />
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              Guidelines
            </h3>
            <ul className="space-y-4">
              {[
                "Submit by Sunday 11:59 PM",
                "Include functional demo link",
                "Document all API changes",
                "Mention blockers early"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-white/40 group/item">
                  <ChevronRight size={14} className="mt-0.5 text-purple-400 group-hover/item:translate-x-1 transition-transform" />
                  <span className="group-hover/item:text-white/60 transition-colors">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-3xl p-8 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Target size={18} />
              </div>
              <h3 className="text-white font-bold">Goal Pursuit</h3>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-6">
              You're currently {progress}% through the project. Focus on completing the core features this week to stay on schedule.
            </p>
            <div className="flex items-center gap-2 text-white/60 font-bold text-[10px] uppercase tracking-widest bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
              <Timer size={14} className="text-emerald-400" />
              <span>Speed: 1.2x Target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
