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

/* ================= COMPONENTS ================= */
const ProposalInput = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2 group">
    <label className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[var(--pv-accent)]">
      <Icon size={14} className="text-white/40 group-focus-within:text-[var(--pv-accent)]" />
      {label}
    </label>
    <div className="relative">
      <input
        {...props}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--pv-accent)] focus:bg-white/[0.08] transition-all placeholder:text-white/20"
      />
    </div>
  </div>
);

const ProposalTextarea = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2 group">
    <label className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[var(--pv-accent)]">
      <Icon size={14} className="text-white/40 group-focus-within:text-[var(--pv-accent)]" />
      {label}
    </label>
    <textarea
      {...props}
      rows={4}
      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--pv-accent)] focus:bg-white/[0.08] transition-all placeholder:text-white/20 resize-none custom-scrollbar"
    />
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

    socket.on("userTyping", (name) => setTypingUser(name));
    socket.on("userStopTyping", () => setTypingUser(null));

    return () => {
      socket.off("receiveMessage");
      socket.off("messageUpdated");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [project?.groupId, BASE_URL, activeTab]);

  useEffect(() => {
    if (activeTab === "discussion") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

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
    } catch (err) { console.error(err); }
  };

  const deleteMessage = async (msgId) => {
    if (!confirm("Delete message?")) return;
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

  /* ================= WINDOW LOGIC ================= */
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  const isSubmissionWindow = [0, 5, 6].includes(dayOfWeek);

  const getNextFriday = () => {
    const d = new Date();
    d.setDate(d.getDate() + (5 - d.getDay() + 7) % 7);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  /* ================= ACTIVE ================= */
  const activeMilestone = (() => {
    // If a week was rejected, prioritized it (RE-SUBMIT)
    const rejected = milestones.find((m) => m.status === "rejected");
    if (rejected) return rejected;

    // IF A WEEK IS PENDING, wait
    const pending = milestones.find((m) => m.status === "pending");
    if (pending) return { ...pending, isPendingWait: true };

    // Next week logic
    const nextWeek = milestones.length + 1;
    const totalPossible = project?.totalWeeks || 8;

    if (nextWeek > totalPossible) {
      return null; // All weeks submitted
    }

    // Weekly limit check
    if (milestones.length > 0) {
      const latestMilestone = milestones.reduce((latest, m) => {
        return new Date(m.submittedAt) > new Date(latest.submittedAt) ? m : latest;
      }, milestones[0]);

      const daysSinceLastSubmit = (new Date() - new Date(latestMilestone.submittedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastSubmit < 4) {
        return { week: nextWeek, title: `Week ${nextWeek} Progress`, isTooEarlyWait: true };
      }
    }

    return {
      week: nextWeek,
      title: `Week ${nextWeek} Progress`,
    };
  })();

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

      await axios.post(
        `${BASE_URL}/api/progress/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Milestone submitted!", { id: loadToast });
      setForm({ repoLink: "", description: "", files: [] });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed", { id: loadToast });
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    approved: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Approved" },
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Pending" },
    rejected: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Rejected" },
  };

  if (loading) return null;

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
          { icon: GraduationCap, label: "Mentor", value: project?.mentorName || "Unassigned", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: Target, label: "Timeline", value: `${milestones.filter(m => m.status === 'approved').length} / ${project?.totalWeeks || 8} Weeks`, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { icon: Zap, label: "Status", value: progress === 100 ? "Finalized" : "In Progress", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-2 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
              <div className="flex items-center gap-2 truncate">
                <p className={`font-bold text-sm truncate ${color}`}>{value}</p>
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
        <div className="lg:col-span-8 space-y-8">
          {activeTab === "milestones" && (
            <>
              {!activeMilestone ? (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-6 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 scale-150" />
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Timeline Finalized</h2>
                    <p className="text-white/40 text-sm max-w-sm mx-auto">
                      You have successfully submitted all <span className="text-emerald-400 font-bold">{project?.totalWeeks} scheduled milestones</span>. Great job on completing your project journey!
                    </p>
                  </div>
                  <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <ShieldCheck size={14} />
                    Project Complete
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                  {activeMilestone.isPendingWait ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                        <Clock size={40} className="animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Under Review</h2>
                        <p className="text-white/40 text-sm max-w-sm mx-auto">
                          Your submission for <span className="text-amber-400 font-bold">Week {activeMilestone.week}</span> is currently under mentor review. Please wait for approval before submitting the next milestone.
                        </p>
                      </div>
                    </div>
                  ) : activeMilestone.isTooEarlyWait ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <Calendar size={40} className="animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Weekly Limit Reached</h2>
                        <p className="text-white/40 text-sm max-w-sm mx-auto">
                          You have already submitted a milestone this week. You can unlock the <span className="text-blue-400 font-bold">Week {activeMilestone.week}</span> submission next week.
                        </p>
                      </div>
                      <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-[#3b82f6] flex items-center gap-2">
                        <Clock size={14} />
                        Next window: {getNextFriday()}
                      </div>
                    </div>
                  ) : !isSubmissionWindow && activeMilestone.status !== "rejected" ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                        <Timer size={40} className="animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Submission Window Closed</h2>
                        <p className="text-white/40 text-sm max-w-sm mx-auto">
                          To maintain a professional weekly cadence, submissions for <span className="text-[var(--pv-accent)] font-bold">Week {activeMilestone.week}</span> are only accepted from <span className="text-white font-bold">Friday to Sunday</span>.
                        </p>
                      </div>
                      <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-[var(--pv-accent)] flex items-center gap-2">
                        <Calendar size={14} />
                        Next window: {getNextFriday()}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20">
                            {activeMilestone.status === "rejected" ? <AlertTriangle size={18} className="text-red-400" /> : <UploadCloud size={18} className="text-[var(--pv-accent)]" />}
                          </div>
                          <div>
                            <p className="text-white font-bold">{activeMilestone.status === "rejected" ? "Fix & Resubmit" : "Submit Progress"}</p>
                            <p className="text-white/40 text-xs">{activeMilestone.title}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${activeMilestone.status === "rejected" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white/5 border-white/5 text-white/40"}`}>
                          Week {activeMilestone.week}
                        </div>
                      </div>

                      <div className="p-8 space-y-6">
                        <ProposalInput icon={LinkIcon} label="Repository Link" name="repoLink" value={form.repoLink} onChange={handleChange} placeholder="https://github.com/..." />
                        <ProposalTextarea icon={FileText} label="Progress Summary" name="description" value={form.description} onChange={handleChange} placeholder="Describe this week's work..." />

                        <div className="space-y-4">
                          <label className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest">
                            <Layers size={14} className="text-white/40" />
                            Attachments
                          </label>
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl py-8 px-4 transition-all hover:bg-white/[0.02] hover:border-[var(--pv-accent)]/30 cursor-pointer bg-black/20 group">
                            <UploadCloud size={24} className="text-white/40 group-hover:text-[var(--pv-accent)] mb-3" />
                            <p className="text-sm font-bold text-white/60 text-center">Click to upload milestone files</p>
                            <input type="file" hidden multiple name="files" onChange={handleChange} />
                          </label>
                          {form.files.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {form.files.map((f, i) => (
                                <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 flex items-center gap-2 tracking-tight uppercase">
                                  <FileText size={12} className="text-[var(--pv-accent)]" /> {f.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                          <button
                            disabled={submitting}
                            onClick={submitProgress}
                            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${submitting ? "bg-white/5 text-white/20" : "bg-[var(--pv-accent)] text-black hover:scale-[1.02]"}`}
                          >
                            {submitting ? "Submitting..." : "Submit Milestone"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10"><History size={16} className="text-white/40" /></div>
                  <h2 className="text-xl font-bold text-white">Timeline History</h2>
                </div>

                <div className="space-y-4">
                  {milestones.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                      <p className="text-white/30 text-sm font-bold uppercase tracking-widest">No submissions yet.</p>
                    </div>
                  ) : (
                    milestones.map((ms, idx) => {
                      const sc = statusConfig[ms.status] || statusConfig.pending;
                      const Icon = sc.icon;
                      return (
                        <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sc.bg} ${sc.color}`}><Icon size={18} /></div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-black text-[var(--pv-accent)] uppercase tracking-widest">Week {ms.week}</span>
                                  <span className="text-[9px] font-bold text-white/30 uppercase">{new Date(ms.submittedAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-black text-white">{ms.title}</h3>
                              </div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${sc.bg} ${sc.border} ${sc.color}`}>{sc.label}</div>
                          </div>
                          {ms.description && <p className="mt-4 text-sm text-white/60 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{ms.description}</p>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "discussion" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] backdrop-blur-md">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--pv-accent)]/10 flex items-center justify-center text-[var(--pv-accent)]"><MessageSquare size={16} /></div>
                  <p className="text-white font-black text-xs uppercase tracking-widest">Mentor Chat</p>
                </div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Online</span></div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => {
                  const isMe = msg.senderRole === "student";
                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${isMe ? "bg-[var(--pv-accent)] text-black rounded-br-none" : "bg-white/5 border border-white/10 text-white rounded-bl-none"}`}>
                        <p className="text-sm font-medium">{msg.message}</p>
                        <p className={`text-[8px] mt-1 font-black uppercase tracking-widest opacity-40`}>{formatMessageDate(msg.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                <textarea
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Ask your mentor something..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white resize-none outline-none focus:border-[var(--pv-accent)]"
                  rows={1}
                />
                <button onClick={sendMessage} className="w-10 h-10 rounded-xl bg-[var(--pv-accent)] text-black flex items-center justify-center hover:scale-105 transition-all"><Send size={16} /></button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: GUIDELINES ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pv-accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--pv-accent)]"><ShieldCheck size={18} /></div>
              <h3 className="font-black text-white text-sm uppercase tracking-widest">Professional Standards</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Reporting Window", value: "Fri-Sun only", icon: Calendar },
                { label: "Deliverables", value: "Code + Docs", icon: FileText },
                { label: "Feedback Loop", value: "Required", icon: MessageSquare }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2"><item.icon size={12} className="text-white/40" /><span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{item.label}</span></div>
                  <span className="text-xs font-black text-white tracking-tight">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}