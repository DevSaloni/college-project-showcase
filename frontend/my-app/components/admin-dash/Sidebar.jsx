"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LogOut
} from "lucide-react";

import { useRouter } from "next/navigation";


// ✅ Admin Sidebar Menu
const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { name: "Manage Students", icon: Users, path: "/admin-dashboard/students" },
  { name: "Manage Teachers", icon: Users, path: "/admin-dashboard/teachers" },
  { name: "Groups & Projects", icon: FolderKanban, path: "/admin-dashboard/groups" },
];



export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    setAdminName(localStorage.getItem("userName") || "");
    setAdminEmail(localStorage.getItem("userEmail") || "");
  }, []);

  //logout logic 
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      router.push("/");
    }
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#050A16] border-r border-white/10">

      {/* LOGO */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-extrabold text-white">
          Project<span className="text-[var(--pv-accent)]">Vault</span>
        </h1>
        <p className="text-xs text-white/50 mt-1">Admin Dashboard</p>
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

      {/* USER PROFILE & LOGOUT */}
      <div className="absolute bottom-6 w-full px-4 space-y-4">
        {/* Profile Info */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-white/20 flex items-center justify-center text-white font-bold">
            {adminName ? adminName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{adminName || "Admin"}</p>
            <p className="text-white/50 text-xs truncate">{adminEmail || "admin@example.com"}</p>
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
