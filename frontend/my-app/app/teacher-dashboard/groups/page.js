"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FileText, Clock } from "lucide-react";
import { useApi } from "@/context/ApiContext";

export default function AllGroupsPage() {
  const { BASE_URL } = useApi();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/teacher/groups`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("group data:", data);

        if (res.ok) {
          setGroups(data.groups || []);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchGroups();
  }, [BASE_URL]);

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Assigned Project Groups
        </h1>
        <p className="text-white/60 mt-2">
          Manage, review, and track student project groups
        </p>
      </div>

      {/* GROUP LIST */}
      <div className="grid lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group._id}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition"
          >
            {/* GROUP TITLE */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {group.name || "No Name"}
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  {group.project || "No Project"}
                </p>
              </div>
              <StatusBadge status={group.status} />
            </div>

            {/* META INFO */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <MetaItem
                icon={Users}
                label="Students"
                value={`${group.students || 0} Members`}
              />
              <MetaItem
                icon={FileText}
                label="Review Stage"
                value={group.review || "N/A"}
              />
              <MetaItem
                icon={Clock}
                label="Last Updated"
                value={group.updated || "N/A"}
              />
            </div>

            {/* ACTION */}
            <Link
              href={`/teacher-dashboard/groups/${group._id}`}
              className="inline-flex items-center mt-6 text-sm font-medium text-[var(--pv-accent)] hover:underline"
            >
              View Group →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔹 COMPONENTS */

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-[var(--pv-accent)] mt-0.5" size={18} />
      <div>
        <p className="text-white/50">{label}</p>
        <p className="text-white">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isSubmitted = status?.toLowerCase() === "submitted";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${isSubmitted
        ? "bg-green-500/15 text-green-400"
        : "bg-yellow-500/15 text-yellow-400"
        }`}
    >
      {status || "Pending"}
    </span>
  );
}
