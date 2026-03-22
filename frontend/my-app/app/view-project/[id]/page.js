"use client";

import {
  Star,
  Github,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  Bookmark,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useApi } from "@/context/ApiContext";

export default function ViewProjectPage() {
  const { BASE_URL } = useApi();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

  // ✅ get role from localStorage
  const userRole =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  /* ================= FETCH PROJECT ================= */
const getProjectById = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BASE_URL}/api/projects/${id}`, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

    setProject({
      ...res.data.data,
      views: res.data.data.views || [],
      bookmarks: res.data.data.bookmarks || [],
    });

    setComments(res.data.data.comments || []);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    if (id) getProjectById();
  }, [id]);

  /* ================= RATING (Recruiter only) ================= */
  const submitRating = async (value) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login required");

      await axios.post(
        `${BASE_URL}/api/projects/${id}/rating`,
        { rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(value);
      getProjectById();
    } catch (err) {
      alert(err.response?.data?.message || "Rating failed");
    }
  };

  /* ================= COMMENT (Recruiter / Teacher) ================= */
  const addComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login required");
      if (!commentInput.trim()) return;

      const res = await axios.post(
        `${BASE_URL}/api/projects/${id}/comment`,
        { text: commentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(res.data.comments);
      setCommentInput("");
    } catch (err) {
      alert(err.response?.data?.message || "Comment failed");
    }
  };



  /* ================= LOADING ================= */
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading project...
      </div>
    );
  }

  const avgRating =
    project.ratings.ratingCount === 0
      ? "No ratings"
      : (
          project.ratings.totalRating / project.ratings.ratingCount
        ).toFixed(1);

  return (
    <section className="py-24 bg-linear-to-b from-[#050A16] to-[#0B1025]">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-8">

        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* Banner */}
          <div className="w-full h-80 rounded-3xl overflow-hidden border border-white/10">
            <img
              src={`${BASE_URL}/${project.bannerImage}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overview */}
          <div className="bg-white/6 p-6 rounded-3xl border border-white/8">
            <h2 className="text-2xl text-white font-bold">Overview</h2>
            <p className="text-white/70 mt-2">{project.description}</p>

            <div className="flex gap-3 mt-4">
              {project.github && (
                <a href={project.github} target="_blank" className="btn-primary">
                  <Github size={16} /> GitHub
                </a>
              )}
              {project.documentation && (
                <a
                  href={`${BASE_URL}/${project.documentation}`}
                  target="_blank"
                  className="btn-secondary"
                >
                  <FileText size={16} /> Docs
                </a>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Stat label="Team" value={project.teamMembers.length} icon={<Users />} />
              <Stat label="Duration" value={project.projectDuration} icon={<Calendar />} />
              <Stat label="Features" value={project.featureList.length} icon={<CheckCircle />} />
            </div>
          </div>

          <Section title="Problem Statement" content={project.problem} />
          <Section title="Project Features" content={project.featureList.join(" • ")} />
          <InfoBox label="Tech Stack" value={project.tech} />
          <InfoBox label="Tools Used" value={project.toolsUsed} />
        </div>

        {/* ================= RIGHT ================= */}
        <aside className="sticky top-24 space-y-6">

          {/* Rating */}
          <div className="bg-white/6 p-6 rounded-3xl border border-white/8 text-center">
            <p className="text-white font-semibold text-lg">⭐ {avgRating}</p>
            <p className="text-white/60 text-sm">
              {project.ratings.ratingCount} ratings
            </p>

{userRole === "recruiter" && !project.ratings.users?.includes(project?.userId) ? (
              <div className="flex justify-center gap-2 mt-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => submitRating(n)}>
                    <Star 
                      size={22}
                      fill={rating >= n ? "currentColor" : "none"}
                      className={rating >= n ? "text-yellow-400" : "text-white/40"}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/40 mt-2">
                Only recruiters can rate projects
              </p>
            )}

            <div className="mt-4 space-y-1 text-white/70 text-sm">
              <p className="flex justify-center gap-2">
               <Eye size={16} /> {project.views?.length || 0} Views
              </p>
              <p className="flex justify-center gap-2">
               <Bookmark size={16} /> {project.bookmarks?.length || 0} Bookmarks
              </p>
              <p>💬 {comments.length} Comments</p>
            </div>

        
          </div>

          {/* Comments */}
          <div className="bg-white/6 p-4 rounded-2xl border border-white/8">
            <p className="text-white font-semibold mb-3">Comments</p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments.map((c) => (
                <p key={c._id} className="text-white/80 text-sm">
                  <b>
                    {c.user?.name}
                    <span className="text-xs text-white/50 ml-1">
                      ({c.role})
                    </span>
                  </b>
                  : {c.text}
                </p>
              ))}
            </div>

            {(userRole === "recruiter" || userRole === "teacher") ? (
              <div className="flex gap-2 mt-3">
                <input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 rounded bg-white/10 text-white"
                />
                <button onClick={addComment} className="btn-primary">
                  Post
                </button>
              </div>
            ) : (
              <p className="text-xs text-white/40 mt-2">
                Login as recruiter or teacher to comment
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, content }) {
  return (
    <div className="bg-white/6 p-6 rounded-2xl border border-white/8">
      <h2 className="text-xl text-white font-bold">{title}</h2>
      <p className="text-white/80 mt-2">{content}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-white/6 p-6 rounded-2xl border border-white/8">
      <h3 className="text-white font-semibold">{label}</h3>
      <p className="text-white/70 mt-1">{value}</p>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
      <div className="p-2 bg-white/10 rounded">{icon}</div>
      <div>
        <div className="text-white font-semibold">{value}</div>
        <div className="text-white/60 text-sm">{label}</div>
      </div>
    </div>
  );
}
