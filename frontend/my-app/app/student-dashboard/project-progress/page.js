"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  UploadCloud,
  Link as LinkIcon,
  AlertTriangle,
  Layers,
  GraduationCap,
  Activity,
  FileText,
  MessageSquare,
  Target,
  Send,
  X,
  Plus,
  Paperclip,
  Check,
  CheckCheck,
  Edit2,
  Trash2,
  Calendar,
  Timer,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingUp,
  History,
  Terminal,
  Github,
  Monitor,
  Video,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Sparkles,
  File
} from "lucide-react";
import axios from "axios";
import { useApi } from "@/context/ApiContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

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
      // Adhering rigidly to explicit backend progress parameter identical to my-projects tab
      setProgress(data.project?.progressPercent || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800);
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }
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
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    }
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
      toast.success("Message updated");
    } catch (err) { console.error(err); }
  };

  const deleteMessage = async (msgId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/discussions/${msgId}/delete`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Message deleted");
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
    milestones.find((m) => m.status === "rejected") || {
      week: milestones.length + 1,
      title: `Week ${milestones.length + 1} Progress`,
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
    if (!project?._id) return toast.error("Active project not found");

    if (!form.repoLink && !form.description && form.files.length === 0) {
      return toast.error("Please provide some progress updates");
    }

    setSubmitting(true);
    const loadToast = toast.loading("Submitting milestone updates...");

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

      toast.success("Milestone submitted successfully", { id: loadToast });
      setForm({ repoLink: "", description: "", files: [] });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed", { id: loadToast });
    } finally {
      setSubmitting(false);
    }
  };

  // The blocking full page loader was removed for instantaneous layout rendering

  const statusConfig = {
    approved: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Approved" },
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Pending" },
    rejected: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Rejected" },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Project Progress
          </h1>
          <p className="text-white/40 text-sm">
            Track milestones, submit weekly progress, and stay in sync with your mentor.
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-xl backdrop-blur-xl">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Activity size={16} className="text-emerald-400 animate-pulse" />
          </div>
          <div className="flex flex-col items-start translate-y-0.5">
            <span className="text-xs text-white/40 uppercase font-semibold tracking-wider leading-none mb-1">Total Progress</span>
            <span className="text-sm font-bold text-white leading-none">{progress}% Completed</span>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Layers, label: "Active Project", value: project?.title || "No Active Project", color: "text-[var(--pv-accent)]", bg: "bg-[var(--pv-accent)]/10", border: "border-[var(--pv-accent)]/20" },
          { icon: GraduationCap, label: "Mentor", value: project?.mentorName || project?.mentor?.name || "Unassigned", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: Target, label: "Approved Milestones", value: `${milestones.filter(m => m.status === 'approved').length} / ${milestones.length || '0'} Milestones`, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { icon: Zap, label: "Current Phase", value: progress === 100 ? "Completed" : progress > 50 ? "Development" : "Initialization", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-2 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
              <div className="flex items-center gap-2 truncate">
                <p className={`font-bold text-sm truncate ${color}`}>{value}</p>
                {label === "Mentor" && value && value !== "Unassigned" && project?.mentorId && (
                  <Link
                    href={`/student-dashboard/mentor/${project.mentorId}`}
                    className="text-[var(--pv-accent)] hover:underline text-[9px] font-black uppercase tracking-widest shrink-0"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-3">
        {[
          { id: "milestones", icon: Monitor, label: "Milestones" },
          { id: "discussion", icon: MessageSquare, label: "Discussion" },
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === "milestones" && (
            <>
              {/* SUBMISSION FORM */}
              {activeMilestone && (
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                  <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20">
                        <UploadCloud size={18} className="text-[var(--pv-accent)]" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Submit Progress</p>
                        <p className="text-white/40 text-xs">{activeMilestone.title}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase text-white/40 tracking-widest">
                      Week {activeMilestone.week}
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-6">
                      <ProposalInput
                        icon={LinkIcon}
                        label="Repository Link"
                        name="repoLink"
                        value={form.repoLink}
                        onChange={handleChange}
                        placeholder="https://github.com/username/project"
                      />

                      <ProposalTextarea
                        icon={FileText}
                        label="Progress Summary"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe what you've achieved this week, any challenges faced, and next steps..."
                      />

                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest">
                          <Layers size={14} className="text-white/40" />
                          Attachments (Optional)
                        </label>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl py-8 px-4 transition-all hover:bg-white/[0.02] hover:border-[var(--pv-accent)]/30 cursor-pointer bg-black/20 group">
                          <div className="p-3 bg-white/5 rounded-xl mb-3 group-hover:scale-105 group-hover:bg-[var(--pv-accent)]/10 transition-all">
                            <UploadCloud size={24} className="text-white/40 group-hover:text-[var(--pv-accent)]" />
                          </div>
                          <p className="text-sm font-bold text-white/60">Upload files</p>
                          <p className="text-xs text-white/40 mt-1">DOC, PDF, ZIP | MAX 10MB</p>
                          <input type="file" hidden multiple name="files" onChange={handleChange} />
                        </label>
                        {form.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {form.files.map((f, i) => (
                              <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/60 flex items-center gap-2">
                                <FileText size={14} className="text-[var(--pv-accent)]" />
                                <span className="truncate max-w-[120px]">{f.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end border-t border-white/10">
                      <button
                        disabled={submitting}
                        onClick={submitProgress}
                        className={`group px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-xl flex items-center gap-2 ${submitting ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5" : "bg-[var(--pv-accent)] text-black hover:scale-[1.02] active:scale-95 border-b-2 border-black/10 active:border-b-0"
                          }`}
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Document
                            <ArrowUpRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MILIASTONE HISTORY */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <History size={16} className="text-white/40" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Timeline History</h2>
                </div>

                <div className="space-y-4">
                  {milestones.length === 0 ? (
                    <div className="text-center py-20 rounded-3xl border border-dashed border-white/5 bg-white/[0.01]">
                      <Activity size={32} className="mx-auto text-white/20 mb-4" />
                      <p className="font-semibold text-sm text-white/40">No milestones submitted yet.</p>
                    </div>
                  ) : (
                    milestones.map((ms, idx) => {
                      const sc = statusConfig[ms.status] || statusConfig.pending;
                      const Icon = sc.icon;

                      return (
                        <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-300 group shadow-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg ${sc.bg} ${sc.border} ${sc.color}`}>
                                <Icon size={20} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold uppercase text-[var(--pv-accent)] tracking-widest">Week {ms.week}</span>
                                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">/ {new Date(ms.submittedAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-tight leading-tight line-clamp-1">{ms.title}</h3>
                              </div>
                            </div>

                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider shadow-md h-fit whitespace-nowrap ${sc.bg} ${sc.border} ${sc.color}`}>
                              {sc.label}
                            </div>
                          </div>

                          {ms.description && (
                            <div className="mt-5 p-4 rounded-xl bg-black/20 border border-white/5">
                              <p className="text-white/60 text-sm leading-relaxed">{ms.description}</p>
                            </div>
                          )}

                          {ms.mentorFeedback && (
                            <div className={`mt-4 p-5 rounded-xl border border-dashed bg-white/[0.02] relative group/feedback ${sc.border}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare size={14} className={sc.color} />
                                <p className="text-xs font-bold uppercase tracking-wider text-[var(--pv-accent)]">Mentor Feedback</p>
                              </div>
                              <p className="text-sm text-white/80 font-medium leading-relaxed">"{ms.mentorFeedback}"</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-4">
                              {ms.repoLink && (
                                <a href={ms.repoLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white/40 hover:text-[var(--pv-accent)] transition-colors flex items-center gap-1.5 group/link">
                                  <Github size={14} className="group-hover/link:scale-110 transition-transform" /> Repository
                                  <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                </a>
                              )}
                              {ms.files && ms.files.length > 0 && (
                                <div className="text-xs font-bold text-white/40 flex items-center gap-1.5">
                                  <Paperclip size={14} /> {ms.files.map((file, i) => <a key={i} href={`${BASE_URL}/${file.path.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--pv-accent)] mr-2 transition-colors">{file.filename}</a>)}
                                </div>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{new Date(ms.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "discussion" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "700px" }}>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-[var(--pv-accent)]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Discussion with Mentor</p>
                  <p className="text-white/40 text-xs flex items-center gap-2">
                    {project?.mentorName || "Mentor"} · Project Progress
                    {project?.mentorId && (
                      <Link
                        href={`/student-dashboard/mentor/${project.mentorId}`}
                        className="text-[var(--pv-accent)] hover:underline text-[10px] font-black uppercase tracking-widest"
                      >
                        View Profile
                      </Link>
                    )}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white/40 font-bold">Online</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/10 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-5 opacity-40 px-10">
                    <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10">
                      <MessageSquare size={40} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-2">No messages yet</p>
                      <p className="text-xs text-white/60 font-medium">Start a conversation with your mentor regarding your progress.</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderRole === "student";
                    const isRead = msg.readBy && msg.readBy.some((id) => id !== msg.sender?._id);

                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"} group items-end gap-3`}>
                        {!isMe && (
                          <div className="w-9 h-9 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--pv-accent)] shrink-0 shadow-sm">
                            {msg.sender?.name?.charAt(0) || "M"}
                          </div>
                        )}

                        <div className={`max-w-[80%] space-y-1 ${isMe ? "text-right" : "text-left"}`}>
                          {!isMe && (
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider ml-1">
                              {msg.sender?.name || "Mentor"}
                            </span>
                          )}

                          {editingMessageId === msg._id ? (
                            <div className="p-4 bg-black/40 border border-white/20 rounded-2xl flex flex-col gap-3 min-w-[280px] shadow-lg backdrop-blur-md">
                              <textarea value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} className="bg-transparent outline-none text-white text-sm resize-none w-full" rows={3} autoFocus />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingMessageId(null)} className="text-xs font-bold text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 transition-colors">Cancel</button>
                                <button onClick={submitEdit} className="text-xs font-bold text-black bg-[var(--pv-accent)] px-4 py-1.5 rounded-lg transition-colors">Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 font-medium ${msg.isDeleted ? "bg-black/20 text-white/40 border border-white/5 shadow-none italic" :
                              isMe ? "bg-[var(--pv-accent)] text-black rounded-br-none shadow-[var(--pv-accent)]/10" :
                                "bg-white/[0.08] text-white/90 border border-white/10 rounded-bl-none"
                              }`}>
                              {msg.fileUrl && !msg.isDeleted && (
                                <div className="mb-3 rounded-xl overflow-hidden border border-black/10 shadow-sm max-w-[200px]">
                                  {msg.fileType?.startsWith("image/") ? (
                                    <img src={`${BASE_URL}${msg.fileUrl}`} className="w-full object-cover transition-transform duration-700" alt="Attachment" />
                                  ) : (
                                    <a href={`${BASE_URL}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 transition-colors ${isMe ? 'bg-black/10 hover:bg-black/20' : 'bg-white/5 hover:bg-white/10'}`}>
                                      <FileText size={18} className={isMe ? "text-black/60" : "text-[var(--pv-accent)]"} />
                                      <div className="text-left overflow-hidden">
                                        <p className={`text-xs font-bold truncate ${isMe ? 'text-black/80' : 'text-white/80'}`}>{msg.fileName || "View Attachment"}</p>
                                      </div>
                                    </a>
                                  )}
                                </div>
                              )}
                              <p>{msg.isDeleted ? "This message was deleted." : msg.message}</p>
                            </div>
                          )}

                          <div className={`flex items-center gap-2 mt-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                            {isMe && !msg.isDeleted && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingMessageId(msg._id); setEditMessageText(msg.message); }} className="p-1 px-2 flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-max transition-colors">
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button onClick={() => deleteMessage(msg._id)} className="p-1 px-2 flex items-center gap-1 text-[10px] font-bold text-red-400/60 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-max transition-colors">
                                  <Trash2 size={10} /> Delete
                                </button>
                                <span className="w-px h-3 bg-white/10 mx-1" />
                              </div>
                            )}
                            <p className="text-[10px] text-white/40 font-semibold">{formatMessageDate(msg.createdAt)}</p>
                            {isMe && !msg.isDeleted && (
                              <span className="transition-all">
                                {isRead ? <CheckCheck size={12} className="text-[var(--pv-accent)]" /> : <Check size={12} className="text-white/40" />}
                              </span>
                            )}
                          </div>
                        </div>

                        {isMe && (
                          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                            ME
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Typing Indicator */}
              {typingUser && (
                <div className="px-8 py-2 shrink-0 bg-transparent">
                  <div className="flex items-center gap-2 text-white/40 text-xs font-semibold animate-in fade-in">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span>{typingUser} is typing...</span>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-5 bg-white/[0.03] border-t border-white/10 shrink-0 space-y-4">
                {attachmentPreview && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl w-fit pr-10 relative animate-in slide-in-from-bottom-2">
                    {attachmentPreview.type === "image" ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 shadow-sm">
                        <img src={attachmentPreview.url} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] flex items-center justify-center border border-[var(--pv-accent)]/20">
                        <File size={18} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-white/80 truncate max-w-[150px]">{attachmentPreview.name}</p>
                    </div>
                    <button onClick={removeAttachment} className="absolute -top-2 -right-2 p-1.5 bg-black border border-white/10 text-white/60 hover:text-red-400 rounded-full transition-colors shadow-sm">
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-3">
                  <label className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95">
                    <input type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                    <Paperclip size={18} />
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
                    placeholder="Type your message..."
                    className="flex-1 min-h-[44px] max-h-[160px] bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--pv-accent)] transition-colors resize-none custom-scrollbar placeholder:text-white/30"
                    rows={1}
                  />

                  <button onClick={sendMessage} disabled={!chatText.trim() && !attachment} className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--pv-accent)] text-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 self-start">
          {/* PROTOCOL GUIDELINES */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Action Guidelines</h3>
            </div>
            <ul className="space-y-4">
              {[
                { title: "Weekly Submission", desc: "Submit progress updates to keep the mentor informed.", icon: Timer },
                { title: "Valid Links", desc: "Ensure all repository links are accessible.", icon: LinkIcon },
                { title: "Clear Description", desc: "Provide a detailed summary of accomplishments.", icon: Activity },
                { title: "Report Issues", desc: "Always mention blockers if any exist.", icon: AlertTriangle }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40">
                    <item.icon size={14} />
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    <p className="text-xs font-bold text-white/80">{item.title}</p>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* MISSION VECTOR */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 group shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Status Overview</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed relative z-10">
              The project is currently at <span className="font-bold">{progress}%</span> completion. Maintain weekly submissions and regular contact with your mentor to clear pending milestones smoothly.
            </p>

            <div className="mt-6 flex items-center gap-3 relative z-10">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── HELPER COMPONENTS ── */

function ProposalInput({ icon: Icon, label, accent, ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-semibold text-white/60 tracking-wider uppercase ml-1">
        <Icon size={14} className={accent ? "text-[var(--pv-accent)]" : "text-white/40"} />
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-[var(--pv-accent)]/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20"
      />
    </div>
  );
}

function ProposalTextarea({ icon: Icon, label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-semibold text-white/60 tracking-wider uppercase ml-1">
        <Icon size={14} className="text-white/40" />
        {label}
      </label>
      <textarea
        {...props}
        rows={4}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-[var(--pv-accent)]/50 focus:bg-white/[0.05] transition-all resize-none shadow-inner custom-scrollbar placeholder:text-white/20"
      />
    </div>
  );
}