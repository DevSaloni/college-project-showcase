"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Search, Star } from "lucide-react";
import { CATEGORIES } from "../../data/categoryData";
import Link from "next/link";
import { useApi } from "@/context/ApiContext";

export default function CategoryPage() {
    const { slug } = useParams();

  const { BASE_URL } = useApi();

  const category = CATEGORIES.find((c) => c.slug === slug);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [techFilter, setTechFilter] = useState("All");

  const [page, setPage] = useState(1);
  const ITEMS = 6;

  // 🔥 FETCH PROJECTS CATEGORY-WISE
 useEffect(() => {
  if (!category || !BASE_URL) return;

  setLoading(true);

  fetch(`${BASE_URL}/api/projects/category/${category.slug}`)
    .then((res) => res.json())
    .then((data) => {
      setProjects(data.data || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));

}, [category, BASE_URL]);

  if (!category) {
    return <div className="text-white p-10">Category not found</div>;
  }

  // ---- FILTER PROJECTS ----
  let filtered = projects;

  if (search) {
    filtered = filtered.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (yearFilter !== "All") {
    filtered = filtered.filter((p) => p.year === yearFilter);
  }

  if (techFilter !== "All") {
    filtered = filtered.filter((p) =>
      p.tech?.toLowerCase().includes(techFilter.toLowerCase())
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS);
  const paginated = filtered.slice((page - 1) * ITEMS, page * ITEMS);

  // ⭐ Bookmark
  const handleBookmark = (project) => {
    const saved =
      JSON.parse(localStorage.getItem("bookmarkedProjects")) || [];

    const exists = saved.find((item) => item._id === project._id);

    if (!exists) {
      saved.push(project);
      localStorage.setItem("bookmarkedProjects", JSON.stringify(saved));
      alert("Project added to bookmarks");
    } else {
      alert("Already in bookmarks ❤️");
    }
  };

  return (
    <section className="min-h-screen bg-[#050A16] px-6 py-20">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-white">
          {category.title}
        </h1>
        <p className="text-white/60 mt-2 mb-10">
          Showing projects related to{" "}
          <span className="text-white">{category.title}</span>
        </p>

        {/* FILTERS */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-10">
          <div className="grid md:grid-cols-3 gap-4">

            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl p-3">
              <Search className="text-white/60 mr-3" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-white"
              />
            </div>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option className="text-black">All</option>
              <option className="text-black">2024</option>
              <option className="text-black">2023</option>
              <option className="text-black">2022</option>
            </select>

            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option className="text-black">All</option>
              <option className="text-black">React</option>
              <option className="text-black">Node</option>
              <option className="text-black">MongoDB</option>
              <option className="text-black">Python</option>
              <option className="text-black">Solidity</option>
            </select>
          </div>
        </div>

        {/* PROJECT GRID */}
        {loading ? (
          <p className="text-white/40">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.length === 0 ? (
              <p className="text-white/40">No projects found.</p>
            ) : (
              paginated.map((p) => (
                <article
                  key={p._id}
                  className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 hover:-translate-y-2 transition"
                >
                  <img
                    src={`${BASE_URL}/${p.bannerImage}`}
                    className="w-full h-44 object-cover"
                    alt={p.title}
                  />

                  <div className="p-5">
                    <h3 className="text-white text-xl font-bold">
                      {p.title}
                    </h3>

                    <p className="text-white/60 mt-2 text-sm line-clamp-3">
                      {p.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-white/50 text-xs">
                        {p.department} • {p.projectType}
                      </div>

                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          fill="yellow"
                          className="text-yellow-400"
                        />
                        <span className="text-white text-sm">
                          {p.ratings?.ratingCount
                            ? (
                                p.ratings.totalRating /
                                p.ratings.ratingCount
                              ).toFixed(1)
                            : "0"}
                        </span>
                        <span className="text-white/50 text-xs">
                          ({p.ratings?.ratingCount || 0})
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Link href={`/view-project/${p._id}`}>
                        <button className="px-3 py-2 rounded-lg bg-white/6 text-white text-sm font-semibold">
                          View
                        </button>
                      </Link>

                      <button
                        onClick={() => handleBookmark(p)}
                        className="px-3 py-2 rounded-lg text-sm font-semibold text-black"
                        style={{
                          background:
                            "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
                        }}
                      >
                        Bookmark
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
