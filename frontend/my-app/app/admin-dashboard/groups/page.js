"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, Eye, FolderKanban } from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function GroupsPage() {
  const { BASE_URL } = useApi();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH GROUPS ================= */
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/group/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setGroups(data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("GROUP DATA 👉", groups);
  }, [groups]);

  return (
    <div className="space-y-6 max-w-6xl">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Groups & Projects
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Manage student groups and their projects
          </p>
        </div>

        <Link
          href="/admin-dashboard/groups/create-groups"
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-black"
          style={{
            background:
              "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
          }}
        >
          <Plus size={16} /> Create Group
        </Link>
      </div>

      {/* GROUPS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6 relative z-10 w-full">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[var(--pv-accent)] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[var(--pv-accent-2)] animate-spin-slow"></div>
          </div>
          <p className="text-white/60 font-medium tracking-wide animate-pulse">Loading groups...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-[23px]">
          {groups
            .filter(
              (group) =>
                group.mentor &&
                group.students &&
                group.students.length > 0
            )
            .map((group) => (
              <div
                key={group._id}
                className="relative p-5 rounded-2xl bg-white/[0.04] border border-white/10 
              backdrop-blur-lg shadow-lg overflow-hidden
              hover:bg-white/[0.06] hover:shadow-2xl transition-all duration-300 group"
              >

                {/* TOP GRADIENT LINE */}
                <div
                  className="absolute inset-x-0 top-0 h-[3px] opacity-70"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
                  }}
                />

                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {group.groupName}
                    </h2>

                    <p className="text-white/60 text-sm mt-1">
                      Mentor: {group.mentor?.userId?.name || "Not Assigned"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${group.status === "Active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                      }`}
                  >
                    {group.status}
                  </span>
                </div>

                {/* GROUP INFO */}
                <div className="grid grid-cols-2 gap-2 text-sm text-white/70 mt-5">

                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    {group.students.length} Students
                  </div>

                  <div className="flex items-center gap-2">
                    <FolderKanban size={16} />
                    {group.project?.title || "Project Not Assigned"}
                  </div>

                </div>

                {/* ACTION BUTTON */}
                <div className="flex justify-end pt-5">
                  <Link
                    href={`/admin-dashboard/groups/${group._id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-black shadow-md hover:scale-105 transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))",
                    }}
                  >
                    <Eye size={16} /> View
                  </Link>

                </div>

              </div>
            ))}

          {groups.length === 0 && (
            <p className="text-white/50 text-sm">
              No groups created yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}