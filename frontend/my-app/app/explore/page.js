"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Star } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useApi } from "@/context/ApiContext";

export default function ExploreProjects() {
  const { BASE_URL } = useApi();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
const [isBookmarked, setIsBookmarked] = useState(false);

  const tags = ["All", "AI", "Web", "Blockchain", "IoT", "Data"];

  // 🔹 GET ALL PROJECTS FROM BACKEND
  const getAllProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects/all`);
      setProjects(res.data.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  // 🔹 FILTER LOGIC
  const filteredProjects = projects.filter((p) => {
    const q = search.toLowerCase();

    const matchTag =
      activeTag === "All" ||
      p.tech?.toLowerCase().includes(activeTag.toLowerCase()) ||
      p.category?.toLowerCase().includes(activeTag.toLowerCase());

    const matchSearch =
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tech?.toLowerCase().includes(q);

    return matchTag && matchSearch;
  });

  //bookmark project 
  const handleBookmark = async (projectId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const res = await axios.post(
      `${BASE_URL}/api/projects/${projectId}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { isBookmarked, bookmarksCount } = res.data;

    setProjects(prev =>
      prev.map(p =>
        p._id === projectId
          ? { ...p, isBookmarked, bookmarksCount }
          : p
      )
    );
  } catch (err) {
    alert("Bookmark failed");
  }
};

  
  return (
    <section className="min-h-screen bg-[#050A16] py-20 px-6 relative">

      {/* Background Glow */}
      <div
        className="absolute inset-0 blur-[180px] opacity-40"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, var(--pv-accent), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10 mt-8">
          <div>
            <h2 className="text-white text-4xl font-extrabold">
              Explore Student Projects
            </h2>
            <p className="text-white/70 mt-2">
              Discover top projects, filter by tech, and connect with creators.
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-xl p-3 w-full lg:w-[450px]">
              <Search className="text-white/60 mr-3" />
              <input
                type="text"
                placeholder="Search by title, tools, or tech stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>

            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/6 border border-white/10 text-white">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-10">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTag === t
                  ? "bg-[linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))] text-black"
                  : "bg-white/6 text-white/90"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <article
              key={p._id}
              className="rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg hover:-translate-y-2 transition"
            >
              <img
                src={`${BASE_URL}/${p.bannerImage}`}
                alt={p.title}
                className="w-full h-44 object-cover"
              />

              <div className="p-5">
                <h3 className="text-white text-xl font-bold">{p.title}</h3>

                <p className="text-white/60 mt-2 text-sm line-clamp-3">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {p.tech?.split(",").map((t, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded bg-white/6 text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-white/50 text-xs">
                    {p.department} • {p.projectType}
                  </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" />
                      <span className="text-white text-sm">
                        {p.ratings?.ratingCount > 0
                          ? (p.ratings.totalRating / p.ratings.ratingCount).toFixed(1)
                          : "No ratings"}
                      </span>
                    </div> 
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link href={`/view-project/${p._id}`}>
                    <button className="px-3 py-2 rounded-lg text-sm bg-white/6 text-white">
                      View
                    </button>
                  </Link>

            <button
              onClick={() => handleBookmark(p._id)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                p.isBookmarked
                  ? "bg-green-500 text-black"
                  : "bg-gradient-to-r from-[var(--pv-accent)] to-[var(--pv-accent-2)] text-black"
              }`}
            >
              {p.isBookmarked ? "Bookmarked ✓" : "Bookmark"}
            </button>

                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .line-clamp-3{
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:3;
          overflow:hidden;
        }
      `}</style>
    </section>
  );
}
