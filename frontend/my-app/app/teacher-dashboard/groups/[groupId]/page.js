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
  Layout,
  Code,
  Target,
  Info,
  Clock,
  ChevronRight,
  User,
  GraduationCap,
  Layers,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function GroupWorkspacePage() {
  const { BASE_URL } = useApi();
  const { groupId } = useParams();
  const router = useRouter();
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const [activeTab, setActiveTab] = useState("proposal");
  const [chatText, setChatText] = useState("");
  const [loading, setLoading] = useState(true);

  const [group, setGroup] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [messages, setMessages] = useState([]);
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [file, setFile] = useState(null);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch group and proposal
        const res = await fetch(`${BASE_URL}/api/proposal/${groupId}/workspace`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setGroup(data.group);
          setProposal(data.proposal);
          setFeedback(data.proposal?.teacherFeedback || "");
          setDuration(data.proposal?.totalWeeks || "");
        }
        // Fetch messages
        const msgRes = await fetch(`${BASE_URL}/api/discussions/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);

      } catch (err) {
        console.error("Error fetching workspace data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL, groupId]);

/* ================= SOCKET CONNECTION ================= */
useEffect(() => {
  if (!groupId) return;

if (!socketRef.current) {
    socketRef.current = io(BASE_URL, {
      transports: ["websocket"],
      withCredentials: true
    });
  }

  const socket = socketRef.current;

  socket.emit("joinGroup", groupId);

  socket.on("receiveMessage", (message) => {
    setMessages((prev) => {
      if (prev.find((m) => m._id === message._id)) return prev;
      return [...prev, message];
    });
  });



  return () => {
    socket.off("receiveMessage");
    
  };

}, [BASE_URL, groupId]);

  /* ================= SCROLL CHAT ================= */

  useEffect(() => {
    if (activeTab === "discussion") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (status) => {
    if (!feedback.trim()) {
      alert("Please provide feedback before making a decision.");
      return;
    }

    if (status === "Approved" && !duration) {
      alert("Please select a project duration for approval.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/proposal/update/${proposal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status,
          teacherFeedback: feedback,
          totalWeeks: duration,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating status");

      setProposal(data);
      alert(`Proposal successfully ${status.toLowerCase()}!`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= SEND MESSAGE ================= */

const sendMessage = async () => {
  if (!chatText.trim() && !file) return;

  try {

    const formData = new FormData();
    formData.append("message", chatText);
    if (file) {
      formData.append("file", file);
    }

    const res = await fetch(`${BASE_URL}/api/discussions/${groupId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();

    socketRef.current.emit("sendMessage", {
      groupId,
      message: data.message,
    });

    setChatText("");
    setFile(null);

  } catch (err) {
    console.error(err);
  }


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[var(--pv-accent-2)] animate-spin-slow" />
        </div>
        <p className="text-white/40 text-sm font-medium tracking-wide animate-pulse">
          Setting up workspace...
        </p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Group Not Found</h2>
        <p className="text-white/40 max-w-md text-center">
          We couldn't find the group you're looking for. It might have been deleted or moved.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const proposalStatus = proposal?.status || "Pending";
  const statusColors = {
    Approved: "bg-green-500/20 text-green-400 border-green-500/20 dot-bg-green-400",
    Rejected: "bg-red-500/20 text-red-400 border-red-500/20 dot-bg-red-400",
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20 dot-bg-yellow-400",
  };
  const currentStatusStyle = statusColors[proposalStatus] || statusColors.Pending;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">

      {/* ── HEADER & NAVIGATION ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 transition-all">
            <Link href="/teacher-dashboard/groups" className="hover:text-[var(--pv-accent)]">Groups</Link>
            <ChevronRight size={12} />
            <span className="text-white/60">Workspace</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
            {group.groupName}
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${currentStatusStyle.split(' dot-bg-')[0]}`}>
              {proposalStatus.toUpperCase()}
            </span>
          </h1>
          <p className="text-white/40 text-sm">
            Review project proposal, discuss improvements, and manage group progress
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all border-b-2 active:translate-y-0.5"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Roster
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">

        {/* ── MAIN CONTENT (LEFT 8/12) ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* TABS */}
          <div className="flex p-1.5 bg-white/[0.04] border border-white/10 rounded-2xl w-fit">
            <TabItem
              active={activeTab === "proposal"}
              onClick={() => setActiveTab("proposal")}
              icon={FileText}
              label="Proposal Review"
            />
            <TabItem
              active={activeTab === "discussion"}
              onClick={() => setActiveTab("discussion")}
              icon={MessageSquare}
              label="Discussion Chat"
              count={messages.length}
            />
          </div>

          {/* TAB CONTENT: PROPOSAL */}
          {activeTab === "proposal" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {!proposal ? (
                <div className="p-20 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center gap-4">
                  <div className="p-5 rounded-2xl bg-white/5">
                    <Sparkles size={32} className="text-white/20" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">No Proposal Yet</h3>
                    <p className="text-white/40 max-w-xs mt-2">
                      This group hasn't submitted their project proposal for review.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Proposal Details Card */}
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-sm relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Target size={120} />
                    </div>

                    <div className="p-8 border-b border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent">
                      <h2 className="text-2xl font-bold text-white mb-2">{proposal.title}</h2>
                      <div className="flex flex-wrap gap-3">
                        {proposal.techStack?.split(',').map((tech, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-[var(--pv-accent)]/10 border border-[var(--pv-accent)]/20 text-[var(--pv-accent)] text-xs font-bold">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-10">
                      <ProposalSection icon={Layout} title="Problem Statement" content={proposal.problemStatement} />
                      <ProposalSection icon={Info} title="Project Description" content={proposal.description} />
                      <ProposalSection icon={Target} title="Key Features" content={proposal.features} />
                      <ProposalSection icon={Sparkles} title="Expected Outcome" content={proposal.expectedOutcome} />
                    </div>
                  </div>

                  {/* Decision Area */}
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 space-y-6 border-l-[6px] border-l-[var(--pv-accent)]">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-[var(--pv-accent)]/20 text-[var(--pv-accent)]">
                        <CheckCircle size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Review & Decision</h2>
                        <p className="text-white/50 text-sm">Provide feedback and decide on the project proposal</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12} /> Project Duration
                        </label>
                        <select
                          disabled={proposal.status !== "Pending"}
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-white outline-none focus:border-[var(--pv-accent)] focus:ring-1 focus:ring-[var(--pv-accent)] transition-all cursor-pointer appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem' }}
                        >
                          <option value="">Select Duration</option>
                          <optgroup label="Mini Projects">
                            <option value="4">4 Weeks</option>
                            <option value="6">6 Weeks</option>
                            <option value="8">8 Weeks</option>
                          </optgroup>
                          <optgroup label="Major Projects">
                            <option value="12">12 Weeks</option>
                            <option value="16">16 Weeks</option>
                            <option value="24">24 Weeks</option>
                          </optgroup>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle size={12} /> Current Status
                        </label>
                        <div className={`p-4 rounded-2xl border ${currentStatusStyle.split(' dot-bg-')[0]} font-bold`}>
                          {proposalStatus}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={12} /> Mentor Feedback
                      </label>
                      <textarea
                        disabled={proposal.status !== "Pending"}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts, suggestions for improvement, or reasons for rejection..."
                        rows={4}
                        className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-white outline-none focus:border-[var(--pv-accent)] focus:ring-1 focus:ring-[var(--pv-accent)] transition-all resize-none"
                      />
                    </div>

                    {proposal.status === "Pending" ? (
                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <button
                          disabled={isSubmitting}
                          onClick={() => updateStatus("Approved")}
                          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--pv-accent)] text-black font-black hover:opacity-90 disabled:opacity-50 transition-all border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                        >
                          <CheckCircle size={20} /> Approve Project
                        </button>
                        <button
                          disabled={isSubmitting}
                          onClick={() => updateStatus("Rejected")}
                          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-red-500 text-white font-black hover:opacity-90 disabled:opacity-50 transition-all border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                        >
                          <XCircle size={20} /> Reject Proposal
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <Info size={18} className="text-white/40" />
                        <p className="text-sm text-white/60">
                          This proposal has already been <strong>{proposal.status.toLowerCase()}</strong>. Feedback is locked.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB CONTENT: DISCUSSION */}
          {activeTab === "discussion" && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col h-[700px] animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Chat Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Group Discussion</h3>
                    <p className="text-white/40 text-xs">{messages.length} messages in this thread</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/[0.1]">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40">
                    <div className="p-6 rounded-full bg-white/5">
                      <MessageSquare size={48} />
                    </div>
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderRole === "teacher";
                    return (
                      <div
                        key={msg._id || i}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-end gap-2`}
                      >
                        {!isMe && (
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black text-white/40 shrink-0 border border-white/10">
                            {msg.sender?.name?.charAt(0)|| "S"}
                          </div>
                        )}
                        <div className={`max-w-[80%] space-y-1`}>
                          {!isMe && (
                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider ml-1">
                              {msg.sender?.name || "Student"}
                            </span>
                          )}
                          <div
                            className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${isMe
                                ? 'bg-[var(--pv-accent)] text-black font-medium rounded-br-none'
                                : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                              }`}
                          >
                            {msg.message}
                          </div>
                          <p className={`text-[9px] text-white/20 font-medium ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {isMe && (
                          <div className="w-8 h-8 rounded-lg bg-[var(--pv-accent)]/20 flex items-center justify-center text-[10px] font-black text-[var(--pv-accent)] shrink-0 border border-[var(--pv-accent)]/20">
                            ME
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>


            
              {/* Input Area */}
              <div className="p-6 bg-white/[0.04] border-t border-white/10">
                <div className="relative flex gap-3">
                  
                  <input
                    value={chatText}
              onChange={(e) => setChatText(e.target.value)}
           onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}                    
                    placeholder="Type a message to the group..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-[var(--pv-accent)] transition-all pr-14"
                  />
                  <button
                    onClick={sendMessage}
                    className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center rounded-xl bg-[var(--pv-accent)] text-black hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-center text-[10px] text-white/20 mt-3 uppercase tracking-widest font-bold">
                  Press Enter to send
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR (RIGHT 4/12) ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Quick Info Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Info size={18} className="text-[var(--pv-accent)]" /> Group Overview
            </h3>

            <div className="space-y-4">
              <SidebarItem icon={Layers} label="Department" value={group.department} />
              <SidebarItem icon={GraduationCap} label="Academic Year" value={`${group.year} Year`} />
              <SidebarItem icon={Users} label="Total Members" value={`${group.students?.length || 0} Students`} />
              <SidebarItem icon={Calendar} label="Submission" value={proposal?.createdAt ? new Date(proposal.createdAt).toDateString() : "Not Submitted"} />
            </div>
          </div>

          {/* Team Members */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-blue-400" /> Team Members
              </h3>
              <span className="px-2.5 py-1 bg-white/5 rounded-lg text-xs font-bold text-white/40">
                {group.students?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {group.students?.map((s, idx) => (
                <div key={s._id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-black text-white/60 group-hover:text-white transition-colors border border-white/5">
                    {s.userId?.name?.charAt(0) || idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{s.userId?.name}</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Roll: {s.rollNo}</p>
                  </div>
                  <Link href={`/teacher-dashboard/student/${s.userId?._id}`} className="p-2 opacity-0 group-hover:opacity-100 text-[var(--pv-accent)] transition-all hover:bg-[var(--pv-accent)]/10 rounded-lg">
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ))}

              {(!group.students || group.students.length === 0) && (
                <p className="text-center py-6 text-white/30 text-sm">No students assigned</p>
              )}
            </div>
          </div>

          {/* Guidelines/Tips Card */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" /> Mentor Tips
            </h3>
            <ul className="space-y-3 text-xs text-white/60 leading-relaxed">
              <li className="flex gap-2">
                <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                Check if the project scope matches the selected duration.
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                Use the discussion chat for real-time clarification with the team.
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                Detailed feedback helps students improve faster.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */

function TabItem({ active, onClick, icon: Icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all relative ${active
          ? "bg-[var(--pv-accent)] text-black shadow-lg"
          : "text-white/40 hover:text-white/70"
        }`}
    >
      <Icon size={18} />
      {label}
      {count > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? 'bg-black/20 text-black' : 'bg-[var(--pv-accent)]/20 text-[var(--pv-accent)]'
          }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ProposalSection({ icon: Icon, title, content }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 text-white/40">
        <Icon size={16} className="text-[var(--pv-accent)]" />
        <h3 className="text-[10px] font-black uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-white/80 text-sm leading-relaxed min-h-[80px]">
        {content || "No information provided."}
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-white/5 text-white/40">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</p>
        <p className="text-sm text-white font-bold">{value || "N/A"}</p>
      </div>
    </div>
  );
}
}
