"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Bookmark,
  User,
  Settings,
  LogOut
} from "lucide-react";


const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
  { name: "Proposal", icon: LayoutDashboard, path: "/student-dashboard/proposal" },
  { name: "Project Progress", icon: LayoutDashboard, path: "/student-dashboard/project-progress" },
  { name: "My Projects", icon: FolderKanban, path: "/student-dashboard/my-projects" },
  { name: "Profile", icon: User, path: "/student-dashboard/profile" },
];



export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#050A16] border-r border-white/10">
      
      {/* LOGO */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-extrabold text-white">
          Project<span className="text-[var(--pv-accent)]">Vault</span>
        </h1>
        <p className="text-xs text-white/50 mt-1">Student Dashboard</p>
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
                ${
                  active
                    ? "bg-[linear-gradient(90deg,var(--pv-accent),var(--pv-accent-2))] text-black"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="absolute bottom-6 w-full px-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
