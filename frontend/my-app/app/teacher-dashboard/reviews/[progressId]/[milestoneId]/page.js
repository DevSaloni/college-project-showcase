"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Calendar,
  Link as LinkIcon,
  FileText,
  User,
  ArrowLeft,
  MessageSquare,
  Clock,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Paperclip,
  X,
  File,
  Check,
  CheckCheck,
  Edit2,
  Trash2,
  Send,
  Monitor
} from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { io } from "socket.io-client";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ReviewDetailsPage() {
  const { BASE_URL } = useApi();
  const { progressId, milestoneId } = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("submission"); // "submission", "discussion"
  const [decision, setDecision] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chat/Socket state
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (progressId && milestoneId) {
      fetchDetails();
    }
  }, [progressId, milestoneId]);

  const fetchDetails = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/progress/reviews/${progressId}/${milestoneId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        toast.error(result.message || "Failed to fetch submission details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error fetching details");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DISCUSSION & SOCKET ================= */
  const groupId = data?.progress?.groupId || data?.project?.groupId || data?.group?._id;

  useEffect(() => {
    if (!groupId) return;

    const token = localStorage.getItem("token");
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/discussions/${groupId}?context=progress`, {
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
    socket.emit("joinGroup", groupId);

    socket.on("receiveMessage", (message) => {
      if (message.context !== "progress") return;
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
    setAttachment(file);
    if (file.type.startsWith("image/")) {
      setAttachmentPreview({ type: "image", url: URL.createObjectURL(file), name: file.name });
    } else {
      setAttachmentPreview({ type: "file", url: null, name: file.name });
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
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

      const res = await fetch(`${BASE_URL}/api/discussions/${groupId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const d = await res.json();
      socketRef.current?.emit("sendMessage", {
        groupId,
        message: d.message,
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

  const handleSubmitReview = async () => {
    if (!decision) return toast.error("Please select Approve or Reject");
    if (decision === "rejected" && !feedback.trim()) {
        return toast.error("Feedback is required for rejection");
    }

    try {
      const res = await fetch(`${BASE_URL}/api/progress/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          progressId,
          milestoneId,
          status: decision,
          mentorFeedback: feedback,
        }),
      });

      const result = await res.json();
      if (!res.ok) return toast.error(result.message || "Review failed");
      
      toast.success(`Submission ${decision === 'approved' ? 'Approved' : 'Rejected'}!`);
      setTimeout(() => router.push("/teacher-dashboard/reviews"), 1500);
    } catch (err) { 
      console.error(err);
      toast.error("Network error during review submission");
    }
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday ? `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-white/5" />
        <div className="h-4 w-48 bg-white/5 rounded" />
      </div>
    );
  }

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <AlertCircle size={48} className="text-red-400/50" />
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter shadow-sm mb-2">Submission Out of Sync</h2>
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest px-4 max-w-sm">The requested sprint report could not be synchronized with the repository hub.</p>
      </div>
      <button onClick={() => router.back()} className="mt-4 px-8 py-3 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl">Return to Control Center</button>
    </div>
  );

  const isPending = data?.milestone?.status === "pending";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
            Weekly Progress Review
            {!isPending && (
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${data.milestone.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${data.milestone.status === 'approved' ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                {data.milestone.status}
              </span>
            )}
          </h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-tight">Reviewing submission for <span className="text-white/60">{data?.student?.name}</span> • <span className="text-[var(--pv-accent)]">Week {data?.milestone?.week}</span></p>
        </div>

        <button onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shadow-lg">
          <ArrowLeft size={16} />
          Back to List
        </button>
      </div>

      {/* ── TOP STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem icon={User} label="Student" value={data?.student?.name} />
        <StatItem icon={Calendar} label="Milestone" value={data?.milestone?.title} />
        <StatItem icon={Clock} label="Submitted" value={new Date(data?.milestone?.submittedAt).toLocaleDateString()} />
        <StatItem icon={Monitor} label="Status" value={data?.milestone?.status} color={isPending ? "text-amber-400" : "text-emerald-400"} />
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-3">
        {[
          { id: "submission", icon: FileText, label: "Review Workspace" },
          { id: "discussion", icon: MessageSquare, label: "Live Chat Hub" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-200 ${activeTab === id
              ? "bg-[var(--pv-accent)] text-black shadow-lg shadow-[var(--pv-accent)]/20"
              : "bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {activeTab === "submission" ? (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-2xl">
              <div className="p-8 space-y-8">
                {data?.milestone?.repoLink && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest flex items-center gap-2"><LinkIcon size={12} className="text-[var(--pv-accent)]" /> Repository Hub</label>
                    <a href={data.milestone.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-[var(--pv-accent)]/30 transition-all group shadow-inner">
                      <div className="w-12 h-12 rounded-xl bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 flex items-center justify-center text-[var(--pv-accent)] group-hover:scale-110 transition-transform"><LinkIcon size={20} /></div>
                      <div className="min-w-0">
                        <h4 className="font-black text-white uppercase tracking-tight">Full Source Code</h4>
                        <p className="text-xs text-white/40 truncate font-bold">{data.milestone.repoLink}</p>
                      </div>
                      <div className="ml-auto p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-[var(--pv-accent)] group-hover:text-black transition-all"><ChevronRight size={18} /></div>
                    </a>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest flex items-center gap-2"><MessageSquare size={12} className="text-blue-400" /> Work Description</label>
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-sm font-bold text-white/80 leading-relaxed whitespace-pre-wrap shadow-inner min-h-[140px]">
                    {data?.milestone?.description || "No description provided for this sprint."}
                  </div>
                </div>

                {data?.milestone?.files?.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest flex items-center gap-2"><FileText size={12} className="text-purple-400" /> Technical Artifacts</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {data.milestone.files.map((file, i) => (
                        <a key={i} href={`${BASE_URL}/${file.path}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition-all group shadow-md">
                          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform"><FileText size={16} /></div>
                          <span className="text-[11px] font-black text-white/70 truncate uppercase tracking-tight">{file.filename}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[700px] animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-2xl">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-5 opacity-40">
                    <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10">
                      <MessageSquare size={40} className="text-white/40" />
                    </div>
                    <div>
                      <p className="font-black text-white/60 mb-1 uppercase tracking-widest">No messages synchronized</p>
                      <p className="text-white/30 text-xs font-bold uppercase tracking-tight">Initiate the discovery conversation</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderRole === "teacher";
                    const isRead = msg.readBy && msg.readBy.some((id) => id !== msg.sender?._id);
                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2.5 group animate-in slide-in-from-bottom-1 duration-300`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xs font-black shrink-0 text-white uppercase shadow-inner">
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

                        <div className={`max-w-[80%] space-y-1 ${isMe ? "text-right" : "text-left"}`}>
                          {!isMe && <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">{msg.sender?.name || "Student"}</p>}

                          {editingMessageId === msg._id ? (
                            <div className="p-3 bg-black/40 border border-white/20 rounded-2xl flex flex-col gap-2 min-w-[240px]">
                              <textarea value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} className="bg-transparent outline-none text-white text-sm resize-none w-full text-left font-bold" rows={2} autoFocus />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingMessageId(null)} className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 transition-colors">Cancel</button>
                                <button onClick={submitEdit} className="text-[10px] font-black uppercase tracking-widest text-black px-3 py-1.5 rounded-lg bg-[var(--pv-accent)] transition-colors">Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${msg.isDeleted ? "bg-black/20 text-white/30 border border-white/5 rounded-bl-none shadow-inner" : isMe ? "bg-[var(--pv-accent)] text-black font-black rounded-br-none shadow-[var(--pv-accent)]/20" : "bg-white/[0.07] text-white rounded-bl-none border border-white/10 font-bold"}`}>
                              {msg.fileUrl && !msg.isDeleted && (
                                <div className="mb-2">
                                  {msg.fileType?.startsWith("image/") ? (
                                    <div className="rounded-lg overflow-hidden border border-white/10 max-w-[240px] shadow-lg">
                                      <img src={`${BASE_URL}${msg.fileUrl}`} alt="attachment" className="w-full object-cover" />
                                    </div>
                                  ) : (
                                    <a href={`${BASE_URL}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${isMe ? 'bg-black/10 border-black/10 text-white font-black hover:bg-black/20' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}>
                                      <File size={16} className={isMe ? "text-white opacity-60" : "text-[var(--pv-accent)]"} />
                                      <span className="text-[10px] font-black uppercase truncate max-w-[150px]">{msg.fileName || "View Attachment"}</span>
                                    </a>
                                  )}
                                </div>
                              )}
                              <p className="text-left">{msg.message}</p>
                              {msg.isEdited && !msg.isDeleted && <span className={`text-[9px] ml-1 font-black uppercase ${isMe ? "opacity-40" : "text-white/20"}`}>(edited)</span>}
                            </div>
                          )}

                          <div className={`flex items-center gap-1.5 ${isMe ? "justify-end mr-1" : "ml-1"}`}>
                            <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{formatMessageDate(msg.createdAt)}</span>
                            {isMe && !msg.isDeleted && <span className="text-white/30">{isRead ? <CheckCheck size={10} className="text-blue-400" /> : <Check size={10} />}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 border-t border-white/10 space-y-4 bg-white/[0.02]">
                {attachmentPreview && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl w-fit pr-10 relative group shadow-lg">
                    {attachmentPreview.type === "image" ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-xl">
                        <img src={attachmentPreview.url} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[var(--pv-accent)]/20 text-[var(--pv-accent)] flex items-center justify-center border border-[var(--pv-accent)]/30">
                        <File size={22} />
                      </div>
                    )}
                    <span className="text-[10px] font-black text-white/70 truncate max-w-[180px] uppercase tracking-tight">{attachmentPreview.name}</span>
                    <button onClick={removeAttachment} className="absolute -top-2 -right-2 p-1.5 bg-black border border-white/10 text-white rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl"><X size={12} /></button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <label className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[var(--pv-accent)] hover:border-[var(--pv-accent)]/30 hover:bg-[var(--pv-accent)]/5 transition-all cursor-pointer group active:scale-95 shadow-xl">
                    <input type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                    <Paperclip size={20} className="transform rotate-45 group-hover:scale-110 transition-transform" />
                  </label>
                  <textarea value={chatText} onChange={(e) => { setChatText(e.target.value); socketRef.current?.emit("typing", { groupId, name: "Mentor" }); if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); typingTimeoutRef.current = setTimeout(() => socketRef.current?.emit("stopTyping", groupId), 2000); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Direct message to group..." rows={1} className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-[var(--pv-accent)]/50 transition-all resize-none max-h-[160px] overflow-y-auto shadow-inner" />
                  <button onClick={sendMessage} className="w-12 h-12 shrink-0 rounded-2xl bg-[var(--pv-accent)] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--pv-accent)]/20"><Send size={18} /></button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SIDE PANEL - DECISION ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`bg-white/[0.03] border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl ${isPending ? 'border-t-4 border-t-amber-400' : 'border-t-4 border-t-emerald-400'}`}>
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className={isPending ? 'text-amber-400' : 'text-emerald-400'} size={24} />
              <div><h2 className="text-xl font-black text-white tracking-tight">Review Portal</h2><p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Final decision terminal</p></div>
            </div>

            {isPending ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setDecision("approved")} className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-2 ${decision === 'approved' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>
                    <CheckCircle size={32} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Approve</span>
                  </button>
                  <button onClick={() => setDecision("rejected")} className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-2 ${decision === 'rejected' ? 'bg-red-500/10 border-red-500 text-red-400 shadow-lg shadow-red-500/10' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>
                    <XCircle size={32} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Reject</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest flex items-center gap-2"><MessageSquare size={12} /> Mentor Feedback</label>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-[var(--pv-accent)]/40 transition-all resize-none shadow-inner" placeholder="Provide constructive technical guidance..." />
                </div>
                <button onClick={handleSubmitReview} disabled={!decision || (decision === 'rejected' && !feedback.trim())} className="w-full py-5 rounded-2xl bg-[var(--pv-accent)] text-black font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xl shadow-[var(--pv-accent)]/20">Confirm Evaluation</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border shadow-xl ${data.milestone.status === 'approved' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    {data.milestone.status === 'approved' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] shadow-sm">Evaluation: {data.milestone.status}</h3>
                  </div>
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/5 shadow-inner">
                    <p className="text-xs font-bold text-white/70 leading-relaxed uppercase tracking-tight">"{data.milestone.mentorFeedback || "No feedback provided."}"</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 py-3 border-t border-white/5">
                  <Clock size={14} className="text-white/20" />
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Reviewed on {new Date(data.milestone.reviewDate || data.milestone.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color = "text-white" }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 hover:bg-white/[0.05] hover:scale-[1.02] transition-all shadow-lg group">
      <div className="flex items-center gap-2 mb-2 text-white/30 group-hover:text-[var(--pv-accent)] transition-colors"><Icon size={14} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span></div>
      <p className={`text-sm font-black truncate tracking-tight ${color}`}>{value || "—"}</p>
    </div>
  );
}
