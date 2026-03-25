"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Send,
  Paperclip,
  X,
  File,
  Check,
  CheckCheck,
  Edit2,
  Trash2,
  Users,
  GraduationCap,
  CalendarDays,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Layers,
  Target,
  Cpu,
  ListChecks,
  ClipboardList,
  Star,
} from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

export default function StudentProposalWorkspace() {
  const { BASE_URL } = useApi();
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("proposal");
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [proposal, setProposal] = useState({
    title: "",
    problemStatement: "",
    description: "",
    features: "",
    techStack: "",
    expectedOutcome: "",
  });

  const [group, setGroup] = useState({
    _id: "loading",
    groupName: "Loading Workspace...",
    department: "Synchronizing...",
    mentorName: "Fetching Routing...",
    year: "...",
    semester: "..."
  });
  const [existingProposal, setExistingProposal] = useState(null);
  const [project, setProject] = useState(null);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");

  /* ===== GET STUDENT GROUP ===== */
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/group/student`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setGroup(data.group);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroup();
  }, []);

  /* ===== GET EXISTING PROPOSAL ===== */
  useEffect(() => {
    if (!group) return;
    const fetchProposal = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/proposal/group/${group._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) {
          if (data.proposal) {
            setExistingProposal(data.proposal);
            setProposal({
              title: data.proposal.title,
              problemStatement: data.proposal.problemStatement,
              description: data.proposal.description,
              features: data.proposal.features,
              techStack: data.proposal.techStack,
              expectedOutcome: data.proposal.expectedOutcome,
            });
          }
          if (data.project) setProject(data.project);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProposal();
  }, [group]);

  /* ===== GET DISCUSSION ===== */
  useEffect(() => {
    if (!group) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/discussions/${group._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [group]);

  /* ===== SOCKET CONNECTION ===== */
  useEffect(() => {
    if (!group) return;
    if (!socketRef.current) {
      socketRef.current = io(BASE_URL, {
        transports: ["websocket"],
        withCredentials: true,
      });
    }
    const socket = socketRef.current;
    socket.emit("joinGroup", group._id);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (activeTab === "discussion") markAsRead(group._id);
    });

    socket.on("messageUpdated", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    });

    socket.on("messagesRead", ({ userId }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (!m.readBy?.includes(userId))
            return { ...m, readBy: [...(m.readBy || []), userId] };
          return m;
        })
      );
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
  }, [BASE_URL, group, activeTab]);

  /* ===== SCROLL & READ ===== */
  useEffect(() => {
    if (activeTab === "discussion") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      const token = localStorage.getItem("token");
      if (token && messages.length > 0) {
        const myId = JSON.parse(atob(token.split(".")[1])).id;
        if (!messages[messages.length - 1].readBy?.includes(myId)) {
          if (group) markAsRead(group._id);
        }
      }
    }
  }, [messages, activeTab, group]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/discussions/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== ATTACHMENT HANDLER ===== */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
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

  const handleChange = (e) => {
    setProposal({ ...proposal, [e.target.name]: e.target.value });
  };

  /* ===== SUBMIT PROPOSAL ===== */
  const submitProposal = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...proposal,
        groupId: group._id,
        groupName: group.groupName,
        department: group.department,
        year: group.year,
        semester: group.semester,
        mentorId: group.mentorId,
      };
      const res = await fetch(`${BASE_URL}/api/proposal/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      setExistingProposal(data);
      toast.success("Proposal submitted successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== UPDATE & RESUBMIT ===== */
  const updateProposal = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/proposal/student-update/${existingProposal._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(proposal),
        }
      );
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      setExistingProposal(data);
      toast.success("Proposal updated and re-submitted");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== SEND MESSAGE ===== */
  const sendMessage = async () => {
    if (!chatText.trim() && !attachment) return;
    try {
      const formData = new FormData();
      if (chatText.trim()) formData.append("message", chatText);
      if (attachment) formData.append("attachment", attachment);

      const res = await fetch(`${BASE_URL}/api/discussions/${group._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        socketRef.current?.emit("sendMessage", {
          groupId: group._id,
          message: data.message,
        });
        setChatText("");
        removeAttachment();
      } else {
        toast.error(data.message || "Error sending message");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== EDIT & DELETE MESSAGES ===== */
  const submitEdit = async () => {
    if (!editMessageText.trim()) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/discussions/${editingMessageId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message: editMessageText }),
        }
      );
      if (res.ok) {
        setEditingMessageId(null);
        setEditMessageText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (msgId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch(`${BASE_URL}/api/discussions/${msgId}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (isToday) return `Today at ${time}`;
    if (isYesterday) return `Yesterday at ${time}`;
    return `${date.toLocaleDateString()} at ${time}`;
  };

  const calculateRemainingDays = () => {
    if (!project?.endDate) return "0";
    const today = new Date();
    const end = new Date(project.endDate);
    if (isNaN(end.getTime())) return "0";
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // The blocking full page loader was purposefully removed logic here for instantaneous layout rendering

  const statusConfig = {
    Approved: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: CheckCircle2,
      dot: "bg-emerald-400",
    },
    Rejected: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: XCircle,
      dot: "bg-red-400",
    },
    Pending: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: Clock,
      dot: "bg-amber-400",
    },
  };

  const status = existingProposal?.status || "Pending";
  const sc = statusConfig[status] || statusConfig.Pending;
  const StatusIcon = sc.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Project Proposal
          </h1>
          <p className="text-white/40 text-sm">
            Submit, refine, and discuss your project proposal with your mentor.
          </p>
        </div>

        {existingProposal && (
          <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border ${sc.bg} ${sc.border}`}>
            <span className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`} />
            <StatusIcon size={15} className={sc.color} />
            <span className={`text-sm font-bold ${sc.color}`}>{status}</span>
          </div>
        )}
      </div>

      {/* ── GROUP INFO CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Layers, label: "Group", value: group.groupName, color: "text-[var(--pv-accent)]", bg: "bg-[var(--pv-accent)]/10", border: "border-[var(--pv-accent)]/20" },
          { icon: GraduationCap, label: "Mentor", value: group.mentorName, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", mentorId: group.mentorId },
          { icon: Users, label: "Year", value: group.year, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
          { icon: CalendarDays, label: "Semester", value: `Sem ${group.semester}`, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-2 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
              <div className="flex items-center gap-2 truncate">
                <p className={`font-bold text-sm truncate ${color}`}>{value || "—"}</p>
                {label === "Mentor" && value && value !== "Fetching Routing..." && group.mentorId && (
                  <Link
                    href={`/student-dashboard/mentor/${group.mentorId}`}
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

      {/* ── MENTOR FEEDBACK BANNER ── */}
      {existingProposal?.teacherFeedback && (
        <div className={`flex items-start gap-4 p-5 rounded-2xl border ${sc.bg} ${sc.border}`}>
          <div className={`p-2 rounded-xl ${sc.bg} border ${sc.border} ${sc.color} shrink-0 mt-0.5`}>
            <AlertCircle size={18} />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${sc.color} mb-1`}>
              Mentor Feedback
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              {existingProposal.teacherFeedback}
            </p>
          </div>
        </div>
      )}

      {/* ── PROJECT DURATION BANNER (Approved) ── */}
      {existingProposal?.status === "Approved" && project && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10" />
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-emerald-400">Project Approved — Timeline Active</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Weeks", value: `${project.totalWeeks} Weeks`, icon: CalendarDays, color: "text-emerald-400" },
              { label: "Start Date", value: new Date(project.startDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }), icon: CalendarDays, color: "text-blue-400" },
              { label: "End Date", value: new Date(project.endDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }), icon: CalendarDays, color: "text-purple-400" },
              { label: "Days Remaining", value: `${calculateRemainingDays()} Days`, icon: Clock, color: "text-amber-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-black/20 rounded-xl p-4 border border-white/5">
                <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-1">{label}</p>
                <p className={`font-black text-lg ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TABS ── */}
      <div className="flex gap-3">
        {[
          { id: "proposal", icon: FileText, label: "Proposal Form" },
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

      {/* ── PROPOSAL FORM ── */}
      {activeTab === "proposal" && (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Form Header */}
          <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20">
              <ClipboardList size={18} className="text-[var(--pv-accent)]" />
            </div>
            <div>
              <p className="text-white font-bold">Proposal Details</p>
              <p className="text-white/40 text-xs">Fill in all sections below to submit your project proposal</p>
            </div>
            {existingProposal && (
              <div className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${sc.bg} ${sc.border} ${sc.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {status}
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            {/* Title - Full Width */}
            <ProposalInput
              icon={Star}
              label="Project Title"
              name="title"
              value={proposal.title}
              onChange={handleChange}
              placeholder="e.g. AI-Powered College Showcase Platform"
              disabled={existingProposal?.status === "Approved"}
              accent
            />

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProposalTextarea
                icon={AlertCircle}
                label="Problem Statement"
                name="problemStatement"
                value={proposal.problemStatement}
                onChange={handleChange}
                placeholder="What problem does your project solve? Describe the challenge clearly..."
                disabled={existingProposal?.status === "Approved"}
              />
              <ProposalTextarea
                icon={FileText}
                label="Project Description"
                name="description"
                value={proposal.description}
                onChange={handleChange}
                placeholder="Provide a detailed overview of your project, its purpose, and scope..."
                disabled={existingProposal?.status === "Approved"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProposalTextarea
                icon={ListChecks}
                label="Key Features"
                name="features"
                value={proposal.features}
                onChange={handleChange}
                placeholder="List the main features (one per line)&#10;• Feature A&#10;• Feature B"
                disabled={existingProposal?.status === "Approved"}
              />
              <ProposalTextarea
                icon={Target}
                label="Expected Outcome"
                name="expectedOutcome"
                value={proposal.expectedOutcome}
                onChange={handleChange}
                placeholder="What will the project deliver? What are the measurable results?"
                disabled={existingProposal?.status === "Approved"}
              />
            </div>

            {/* Tech Stack - Full Width */}
            <ProposalInput
              icon={Cpu}
              label="Tech Stack"
              name="techStack"
              value={proposal.techStack}
              onChange={handleChange}
              placeholder="e.g. React.js, Node.js, MongoDB, Tailwind CSS, Socket.io"
              disabled={existingProposal?.status === "Approved"}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={
                  existingProposal
                    ? existingProposal.status === "Rejected"
                      ? updateProposal
                      : null
                    : submitProposal
                }
                disabled={
                  submitting ||
                  existingProposal?.status === "Approved" ||
                  existingProposal?.status === "Pending"
                }
                className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 border-b-2 active:translate-y-0.5 active:border-b-0 ${existingProposal?.status === "Approved"
                  ? "bg-white/5 text-white/30 border-white/5 cursor-not-allowed"
                  : existingProposal?.status === "Pending"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20 cursor-not-allowed"
                    : "bg-[var(--pv-accent)] text-black border-black/20 hover:shadow-lg hover:shadow-[var(--pv-accent)]/20 hover:scale-[1.02] cursor-pointer"
                  }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                    Submitting...
                  </>
                ) : existingProposal ? (
                  existingProposal.status === "Approved" ? (
                    <>
                      <CheckCircle2 size={16} />
                      Proposal Approved
                    </>
                  ) : existingProposal.status === "Pending" ? (
                    <>
                      <Clock size={16} />
                      Awaiting Review
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Update & Resubmit
                      <ChevronRight size={14} />
                    </>
                  )
                ) : (
                  <>
                    <Send size={16} />
                    Submit Proposal
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
              {existingProposal?.status === "Pending" && (
                <p className="text-white/30 text-xs mt-3">
                  Your proposal is under review. You will be notified once your mentor responds.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DISCUSSION / CHAT ── */}
      {activeTab === "discussion" && (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "720px" }}>

          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center">
              <MessageSquare size={18} className="text-[var(--pv-accent)]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Discussion with Mentor</p>
              <p className="text-white/40 text-xs flex items-center gap-2">
                {group.mentorName} · {group.groupName}
                {group.mentorId && (
                  <Link
                    href={`/student-dashboard/mentor/${group.mentorId}`}
                    className="text-[var(--pv-accent)] hover:underline text-[10px] font-black uppercase tracking-widest"
                  >
                    View Profile
                  </Link>
                )}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/40 font-medium">Live</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                const isRead =
                  msg.readBy && msg.readBy.some((id) => id !== msg.sender?._id);

                return (
                  <div
                    key={msg._id || i}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} group items-end gap-2.5`}
                  >
                    {/* Avatar (Teacher) */}
                    {!isMe && (
                      <div className="w-9 h-9 rounded-2xl bg-[var(--pv-accent)]/15 border border-[var(--pv-accent)]/25 flex items-center justify-center text-xs font-black text-[var(--pv-accent)] shrink-0">
                        {msg.sender?.name?.charAt(0) || "T"}
                      </div>
                    )}

                    {/* Edit/Delete Buttons (only for own messages) */}
                    {isMe && !msg.isDeleted && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 mb-4">
                        <button
                          onClick={() => {
                            setEditingMessageId(msg._id);
                            setEditMessageText(msg.message);
                          }}
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}

                    <div className="max-w-[75%] space-y-1">
                      {!isMe && (
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider ml-1">
                          {msg.sender?.name || "Mentor"}
                        </span>
                      )}

                      {editingMessageId === msg._id ? (
                        <div className="p-3 bg-black/40 border border-white/20 rounded-2xl flex flex-col gap-2 min-w-[240px]">
                          <textarea
                            value={editMessageText}
                            onChange={(e) => setEditMessageText(e.target.value)}
                            className="bg-transparent outline-none text-white text-sm resize-none w-full"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="text-xs text-white/50 hover:text-white px-3 py-1 rounded-lg bg-white/5 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={submitEdit}
                              className="text-xs text-black font-bold px-3 py-1 rounded-lg bg-[var(--pv-accent)] transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${msg.isDeleted
                            ? "bg-black/20 text-white/30 italic border border-white/5 rounded-bl-none"
                            : isMe
                              ? "bg-[var(--pv-accent)] text-black font-medium rounded-br-none shadow-[var(--pv-accent)]/20"
                              : "bg-white/[0.07] text-white rounded-bl-none border border-white/10"
                            }`}
                        >
                          {msg.fileUrl && !msg.isDeleted && (
                            <div className="mb-2">
                              {msg.fileType?.startsWith("image/") ? (
                                <img
                                  src={`${BASE_URL}${msg.fileUrl}`}
                                  alt="attachment"
                                  className="max-w-[200px] max-h-[200px] rounded-xl border border-black/10 object-cover"
                                />
                              ) : (
                                <a
                                  href={`${BASE_URL}${msg.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 p-3 rounded-xl transition-colors border ${isMe
                                    ? "bg-black/10 hover:bg-black/20 text-black border-black/10"
                                    : "bg-black/10 hover:bg-black/20 text-white/80 border-white/10"
                                    }`}
                                >
                                  <File size={18} />
                                  <span className="truncate max-w-[140px] font-medium text-xs">
                                    {msg.fileName || "View Attachment"}
                                  </span>
                                </a>
                              )}
                            </div>
                          )}
                          <p>{msg.message}</p>
                          {msg.isEdited && !msg.isDeleted && (
                            <span className={`text-[9px] ml-1 font-medium opacity-60`}>
                              (edited)
                            </span>
                          )}
                        </div>
                      )}

                      <div className={`flex items-center gap-1.5 ${isMe ? "justify-end mr-1" : "ml-1"}`}>
                        <p className="text-[9px] text-white/20 font-medium">
                          {formatMessageDate(msg.createdAt)}
                        </p>
                        {isMe && !msg.isDeleted && (
                          <span>
                            {isRead ? (
                              <CheckCheck size={11} className="text-[var(--pv-accent)]" />
                            ) : (
                              <Check size={11} className="text-white/30" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Avatar (Self) */}
                    {isMe && (
                      <div className="w-9 h-9 rounded-2xl bg-[var(--pv-accent)] flex items-center justify-center text-[10px] font-black text-black shrink-0">
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
            <div className="px-6 py-2 shrink-0">
              <div className="flex items-center gap-2 text-white/40 text-xs">
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
          <div className="p-4 border-t border-white/10 bg-white/[0.02] shrink-0 space-y-3">
            {/* Attachment Preview */}
            {attachmentPreview && (
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl w-fit pr-10 relative">
                {attachmentPreview.type === "image" ? (
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
                    <img src={attachmentPreview.url} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] flex items-center justify-center border border-[var(--pv-accent)]/20">
                    <File size={18} />
                  </div>
                )}
                <span className="text-sm text-white/80 truncate max-w-[150px]">
                  {attachmentPreview.name}
                </span>
                <button
                  onClick={removeAttachment}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-black/70 text-white/50 hover:text-white rounded-full transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex items-end gap-3">
              {/* File Upload */}
              <label className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer hover:border-[var(--pv-accent)]/30">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <Paperclip size={18} className="transform rotate-45" />
              </label>

              {/* Text Input */}
              <textarea
                value={chatText}
                onChange={(e) => {
                  setChatText(e.target.value);
                  if (!socketRef.current) return;
                  socketRef.current.emit("typing", {
                    groupId: group._id,
                    name: "Student Group",
                  });
                  if (typingTimeoutRef.current)
                    clearTimeout(typingTimeoutRef.current);
                  typingTimeoutRef.current = setTimeout(() => {
                    socketRef.current.emit("stopTyping", group._id);
                  }, 1500);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                className="flex-1 min-h-[44px] max-h-[120px] bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--pv-accent)]/50 focus:bg-black/40 transition-all resize-none overflow-y-auto placeholder:text-white/25"
                rows={1}
              />

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!chatText.trim() && !attachment}
                className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--pv-accent)] text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-[var(--pv-accent)]/20"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── FORM FIELD COMPONENTS ── */

function ProposalInput({ icon: Icon, label, disabled, accent, ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider">
        <Icon size={12} className={accent ? "text-[var(--pv-accent)]" : "text-white/40"} />
        {label}
      </label>
      <input
        {...props}
        disabled={disabled}
        className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-200 placeholder:text-white/20 ${disabled
          ? "border-white/5 text-white/40 cursor-not-allowed"
          : "border-white/10 focus:border-[var(--pv-accent)]/50 focus:bg-black/50 focus:ring-1 focus:ring-[var(--pv-accent)]/20"
          }`}
      />
    </div>
  );
}

function ProposalTextarea({ icon: Icon, label, disabled, ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider">
        <Icon size={12} className="text-white/40" />
        {label}
      </label>
      <textarea
        {...props}
        rows={5}
        disabled={disabled}
        className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-200 resize-none placeholder:text-white/20 ${disabled
          ? "border-white/5 text-white/40 cursor-not-allowed"
          : "border-white/10 focus:border-[var(--pv-accent)]/50 focus:bg-black/50 focus:ring-1 focus:ring-[var(--pv-accent)]/20"
          }`}
      />
    </div>
  );
}
