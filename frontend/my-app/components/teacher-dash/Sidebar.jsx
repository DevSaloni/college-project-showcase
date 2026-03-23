"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  User,
  LogOut,
  Users,
  ClipboardCheck
} from "lucide-react";
import { toast } from "react-hot-toast";

// ✅ Teacher Sidebar Menu
const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/teacher-dashboard" },
  { name: "Review Projects", icon: ClipboardCheck, path: "/teacher-dashboard/reviews" },
  { name: "All Groups", icon: FolderKanban, path: "/teacher-dashboard/groups" },
  { name: "Students", icon: Users, path: "/teacher-dashboard/student" },
  { name: "Profile", icon: User, path: "/teacher-dashboard/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");

  useEffect(() => {
    setTeacherName(localStorage.getItem("userName") || "");
    setTeacherEmail(localStorage.getItem("userEmail") || "");
  }, []);

  // Logout logic 
  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
            <LogOut size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">End Session?</p>
            <p className="text-xs text-white/50">Are you sure you want to sign out?</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("userName");
              localStorage.removeItem("userEmail");
              localStorage.removeItem("userRole");
              toast.success("Logged out successfully", { icon: "👋" });
              router.push("/");
            }}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/20"
          >
            Sign Out
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-xl text-xs font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: "#080E1D",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "16px",
        minWidth: "280px"
      }
    });
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#050A16] border-r border-white/10">

      {/* LOGO */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-extrabold text-white">
          Project<span className="text-[var(--pv-accent)]">Vault</span>
        </h1>
        <p className="text-xs text-white/50 mt-1">Teacher Dashboard</p>
      </div>

      {/* MENU */}
      <nav className="mt-6 px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${active
                  ? "bg-[linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))] text-black shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE & LOGOUT */}
      <div className="absolute bottom-6 w-full px-4 space-y-4">
        {/* Profile Info */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500/40 to-blue-500/40 border border-white/20 flex items-center justify-center text-white font-bold">
            {teacherName ? teacherName.charAt(0).toUpperCase() : "T"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{teacherName || "Professor"}</p>
            <p className="text-white/50 text-xs truncate">{teacherEmail || "teacher@example.com"}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-red-400 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/40 transition-all font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
