"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Send,
  Users,
  Calendar,
  ArrowLeft,
  Layout as LayoutIcon,
  Target,
  Info,
  Clock,
  ChevronRight,
  File,
  Paperclip,
  Check,
  CheckCheck,
  Edit2,
  Trash2,
  Monitor,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ListChecks,
  Cpu,
  Star,
  GraduationCap,
  BookOpen
} from "lucide-react";

import { useApi } from "@/context/ApiContext";
import { toast } from "react-hot-toast";

export default function GroupWorkspacePage() {
  const { BASE_URL } = useApi();
  const { groupId } = useParams();
  const router = useRouter();

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("discussion"); // "proposal", "discussion", "milestones"
  const [chatText, setChatText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [group, setGroup] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");

  const [approveStatus, setApproveStatus] = useState(null); // "Approved" or "Rejected"
  const [totalWeeks, setTotalWeeks] = useState("");
  const [mentorFeedback, setMentorFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Group and Proposal
        const res = await fetch(`${BASE_URL}/api/proposal/${groupId}/workspace`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setGroup(data.group);
          setProposal(data.proposal);
          if (data.proposal) {
            setMentorFeedback(data.proposal.teacherFeedback || "");
          }
          if (data.project) {
            setTotalWeeks(data.project.totalWeeks || "");
          }
        }

        // Fetch Progress/Milestones
        const progRes = await fetch(`${BASE_URL}/api/progress/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const progData = await progRes.json();
        if (progRes.ok) {
          // Filter milestones for this group
          const groupProgress = progData.submissions?.filter(s => s.groupId === groupId) || [];
          setMilestones(groupProgress);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, BASE_URL]);

  const handleStatusUpdate = async () => {
    if (!approveStatus) return toast.error("Please select Approve or Reject");
    if (approveStatus === "Approved" && (!totalWeeks || totalWeeks <= 0)) {
      return toast.error("Please enter a valid project duration (weeks)");
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/proposal/update/${proposal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: approveStatus,
          teacherFeedback: mentorFeedback,
          totalWeeks: parseInt(totalWeeks),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(approveStatus === "Approved" ? "Proposal Approved & Project Created!" : "Proposal Rejected.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during update");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DISCUSSION & SOCKET ================= */
  useEffect(() => {
    if (!groupId) return;

    const token = localStorage.getItem("token");
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/discussions/${groupId}?context=proposal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) { console.error(err); }
    };
    fetchMessages();

    if (!socketRef.current) {
      socketRef.current = io(BASE_URL, { transports: ["websocket"], withCredentials: true });
    }
    const socket = socketRef.current;
    socket.emit("joinGroup", groupId);

    socket.on("receiveMessage", (message) => {
      if (message.context !== "proposal") return;
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (activeTab === "discussion") markAsRead(groupId);
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
  }, [groupId, BASE_URL, activeTab]);

  useEffect(() => {
    if (activeTab === "discussion") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      const token = localStorage.getItem("token");
      if (token && messages.length > 0) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const myId = payload.id;
        if (!messages[messages.length - 1].readBy?.includes(myId)) {
          markAsRead(groupId);
        }
      }
    }
  }, [messages, activeTab, groupId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/discussions/${id}/read?context=proposal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) { console.error(err); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("File size exceeds 5MB limit.");
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
      formData.append("context", "proposal");
      if (attachment) formData.append("attachment", attachment);

      const res = await fetch(`${BASE_URL}/api/discussions/${groupId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      socketRef.current?.emit("sendMessage", {
        groupId,
        message: data.message,
      });
      setChatText("");
      removeAttachment();
    } catch (err) { console.error(err); }
  };

  const submitEdit = async () => {
    if (!editMessageText.trim()) return;
    try {
      await fetch(`${BASE_URL}/api/discussions/${editingMessageId}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: editMessageText }),
      });
      setEditingMessageId(null);
      setEditMessageText("");
    } catch (err) { console.error(err); }
  };

  const deleteMessage = async (msgId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/discussions/${msgId}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        toast.success("Message deleted successfully");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (err) { 
      console.error(err);
      toast.error("Network error during deletion");
    }
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return isToday ? `Today at ${time}` : `${date.toLocaleDateString()} at ${time}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-white/5" />
        <div className="h-4 w-48 bg-white/5 rounded" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} className="text-red-400/50" />
        <p className="text-white/40 font-black uppercase tracking-widest text-xs">Group Repository Not Found</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px]">Go Back</button>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
        <div className="space-y-1">

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {group.groupName} Workspace
          </h1>
          <p className="text-white/40 text-sm max-w-lg">
            Monitor group progress, provide feedback, and communicate in real-time.
          </p>
        </div>

        <button onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
          <ArrowLeft size={18} />
          Back to Groups
        </button>
      </div>

      {/* ── TOP STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: LayoutIcon, label: "Project", value: proposal?.title || "No Proposal", color: "text-[var(--pv-accent)]", bg: "bg-[var(--pv-accent)]/10", border: "border-[var(--pv-accent)]/20" },
          { icon: BookOpen, label: "Dept", value: group.department, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { icon: GraduationCap, label: "Mentor", value: group.mentor?.userId?.name || "Unassigned", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { icon: Users, label: "Year", value: group.year, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} ${border} group hover:scale-[1.02] transition-transform duration-200`}>
            <div className={`p-2 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
              <p className={`font-bold text-sm truncate ${color}`}>{value || "—"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-3">
        {[
          { id: "discussion", label: "Discovery Discussion", icon: MessageSquare },
          { id: "proposal", label: "Proposal Framework", icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === tab.id
              ? "bg-[var(--pv-accent)] text-black shadow-lg shadow-[var(--pv-accent)]/20"
              : "bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === "discussion" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-[var(--pv-accent)]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Discussion with Group</p>
                  <p className="text-white/40 text-xs">{group.groupName} · {group.department}</p>
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
                      <p className="text-white/30 text-sm">Start a conversation with the group!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderRole === "teacher";
                    const isRead = msg.readBy && msg.readBy.some((id) => id !== msg.sender?._id);

                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"} group items-end gap-2.5`}>
                        {!isMe && (
                          <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xs font-black text-white shrink-0 uppercase shadow-inner">
                            {msg.sender?.name?.charAt(0) || "S"}
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
                          {!isMe && <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider ml-1">{msg.sender?.name || "Student"}</span>}

                          {editingMessageId === msg._id ? (
                            <div className="p-3 bg-black/40 border border-white/20 rounded-2xl flex flex-col gap-2 min-w-[240px]">
                              <textarea value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} className="bg-transparent outline-none text-white text-sm resize-none w-full" rows={2} autoFocus />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingMessageId(null)} className="text-xs text-white/50 hover:text-white px-3 py-1 rounded-lg bg-white/5 transition-colors">Cancel</button>
                                <button onClick={submitEdit} className="text-xs text-black font-bold px-3 py-1 rounded-lg bg-[var(--pv-accent)] transition-colors">Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${msg.isDeleted ? "bg-black/20 text-white/30 border border-white/5 rounded-bl-none" : isMe ? "bg-[var(--pv-accent)] text-black font-medium rounded-br-none" : "bg-white/[0.07] text-white rounded-bl-none border border-white/10"}`}>
                              {msg.fileUrl && !msg.isDeleted && (
                                <div className="mb-2">
                                  {msg.fileType?.startsWith("image/") ? (
                                    <div className="rounded-lg overflow-hidden border border-white/10 max-w-[240px]">
                                      <img src={`${BASE_URL}${msg.fileUrl}`} alt="attachment" className="w-full object-cover" />
                                    </div>
                                  ) : (
                                    <a href={`${BASE_URL}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${isMe ? 'bg-black/10 border-black/10 text-white font-bold hover:bg-black/20' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}>
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
                          <div className="w-9 h-9 rounded-2xl bg-[var(--pv-accent)] border border-black/10 flex items-center justify-center text-xs font-black text-black shrink-0 uppercase shadow-inner">
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

                <div className="flex items-end gap-4 shadow-xl">
                  <label className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/30 hover:bg-[var(--pv-accent)]/5 transition-all cursor-pointer group active:scale-95 shadow-xl">
                    <input type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                    <Paperclip size={20} className="transform rotate-45 group-hover:scale-110 transition-transform" />
                  </label>

                  <textarea
                    value={chatText}
                    onChange={(e) => {
                      setChatText(e.target.value);
                      socketRef.current?.emit("typing", { groupId: groupId, name: "Mentor" });
                      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => socketRef.current?.emit("stopTyping", groupId), 2000);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message to the group..."
                    rows={1}
                    className="flex-1 min-h-[48px] max-h-[160px] bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--pv-accent)]/50 transition-all resize-none shadow-inner"
                  />

                  <button onClick={sendMessage} className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--pv-accent)] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,107,107,0.2)]">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "proposal" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Form Header */}
              <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 shadow-inner">
                  <Target size={18} className="text-[var(--pv-accent)]" />
                </div>
                <div>
                  <p className="text-white font-black tracking-tight">Project Framework</p>
                  <p className="text-white/40 text-xs">Architectural blueprint submitted by the cohort</p>
                </div>
                {proposal && (
                  <div className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-inner ${proposal.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : proposal.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${proposal.status === 'Approved' ? 'bg-emerald-400' : proposal.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
                    {proposal.status}
                  </div>
                )}
              </div>

              {proposal ? (
                <div className="p-8 space-y-6">
                  {/* Title - Full Width */}
                  <DisplayField
                    icon={Star}
                    label="Project Title"
                    value={proposal.title}
                    accent
                  />

                  {/* Two Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DisplayArea
                      icon={AlertCircle}
                      label="Problem Statement"
                      value={proposal.problemStatement}
                    />
                    <DisplayArea
                      icon={FileText}
                      label="Detailed Description"
                      value={proposal.description}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DisplayArea
                      icon={ListChecks}
                      label="Key Deliverables"
                      value={proposal.features}
                    />
                    <DisplayArea
                      icon={Target}
                      label="Expected Outcome"
                      value={proposal.expectedOutcome}
                    />
                  </div>

                  {/* Tech Stack - Full Width */}
                  <DisplayField
                    icon={Cpu}
                    label="Technology Stack"
                    value={proposal.techStack}
                  />

                  {/* Evaluation Portal */}
                  {proposal.status === "Pending" && (
                    <div className="pt-8 mt-8 border-t border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={24} className="text-[var(--pv-accent)] shadow-xl" />
                        <div>
                          <h3 className="text-lg font-black text-white">Evaluation Engine</h3>
                          <p className="text-white/40 text-xs">Set parameters and provide mentor insights</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2"><Clock size={12} /> Target Duration (Weeks)</label>
                          <input
                            type="number"
                            min="1"
                            value={totalWeeks}
                            onChange={(e) => setTotalWeeks(e.target.value)}
                            placeholder="e.g. 12"
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-[var(--pv-accent)] font-bold focus:border-[var(--pv-accent)]/50 focus:outline-none transition-all shadow-inner"
                          />
                        </div>
                        <div className="flex items-end gap-3 pb-0.5">
                          <button
                            onClick={() => setApproveStatus("Approved")}
                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${approveStatus === 'Approved' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setApproveStatus("Rejected")}
                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${approveStatus === 'Rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'}`}
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2"><MessageSquare size={12} /> Critical Feedback</label>
                        <textarea
                          rows={4}
                          value={mentorFeedback}
                          onChange={(e) => setMentorFeedback(e.target.value)}
                          placeholder="Constructive feedback to guide the development cycle..."
                          className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-[var(--pv-accent)]/50 focus:outline-none transition-all resize-none shadow-inner"
                        />
                      </div>

                      <button
                        onClick={handleStatusUpdate}
                        disabled={submitting || !approveStatus}
                        className="w-full py-5 rounded-2xl bg-[var(--pv-accent)] text-black font-black uppercase tracking-[0.1em] text-[11px] hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-[var(--pv-accent)]/20 disabled:opacity-40 disabled:scale-100"
                      >
                        {submitting ? "Processing Framework..." : "Confirm Evaluation & Sync"}
                      </button>
                    </div>
                  )}

                  {proposal.status === "Approved" && (
                    <div className="pt-8 mt-8 border-t border-white/5 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-6 shadow-xl">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner">
                        <CheckCircle size={32} />
                      </div>
                      <div>
                        <h4 className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">Framework Active</h4>
                        <p className="text-white font-black text-xl tracking-tight">Timeline: {totalWeeks} Sprints (Weeks)</p>
                        <div className="mt-2 flex items-start gap-2 max-w-lg">
                          <MessageSquare size={14} className="text-white/20 mt-0.5" />
                          <p className="text-white/60 text-xs leading-relaxed">"{proposal.teacherFeedback || "No additional feedback synchronized."}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-white/20 bg-black/20 rounded-3xl border border-dashed border-white/10 flex flex-col items-center gap-4">
                  <AlertCircle size={40} />
                  <p className="font-bold uppercase tracking-widest text-xs">No discovery proposal found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pv-accent)]/5 rounded-full blur-2xl -z-10 group-hover:bg-[var(--pv-accent)]/10 transition-colors" />
            <h3 className="text-white font-black tracking-tighter text-lg mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--pv-accent)] shadow-xl" />
              Cohort Metadata
            </h3>
            <div className="space-y-5">
              <InfoItem label="Operational Domain" value={group.department} />
              <InfoItem label="Academic Phase" value={group.year} />
              <InfoItem label="Appointed Mentor" value={group.mentor?.userId?.name || "Unassigned"} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-3xl p-8 group shadow-2xl">
            <h3 className="text-white font-black tracking-tighter text-lg mb-6 flex items-center gap-2">
              <Users size={20} className="text-blue-400 shadow-xl" />
              Contributor Team
            </h3>
            <div className="space-y-3">
              {group.students?.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all shadow-md group/student">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs uppercase shadow-inner group-hover/student:scale-110 transition-transform">
                    {s.userId?.name?.charAt(0) || "S"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{s.userId?.name || "Student Name"}</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider truncate">{s.userId?.email || "contributor@college.edu"}</p>
                  </div>
                </div>
              ))}
              {(!group.students || group.students.length === 0) && (
                <p className="text-white/20 text-[10px] uppercase font-bold text-center tracking-widest py-8">Roster currently empty</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── REUSABLE RENDERING COMPONENTS ── */

function DisplayField({ icon: Icon, label, value, accent }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
        <Icon size={12} className={accent ? "text-[var(--pv-accent)]" : "text-white/40"} />
        {label}
      </label>
      <div className={`p-5 rounded-2xl bg-black/40 border-b border-white/5 text-sm font-bold shadow-inner ${accent ? "text-[var(--pv-accent)]" : "text-white"}`}>
        {value || "Not synchronized (Pending)"}
      </div>
    </div>
  );
}

function DisplayArea({ icon: Icon, label, value }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
        <Icon size={12} className="text-white/40" />
        {label}
      </label>
      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-[13px] leading-relaxed text-white/70 whitespace-pre-wrap shadow-inner h-full min-h-[140px]">
        {value || "Detailed criteria not yet provided in discovery framework."}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-sm text-white font-black tracking-tight">{value || "—"}</p>
    </div>
  );
}