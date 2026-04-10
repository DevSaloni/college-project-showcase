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
  ClipboardCheck,
  Menu,
  X,
  Home
} from "lucide-react";
import { toast } from "react-hot-toast";

// ✅ Teacher Sidebar Menu
const menu = [
  { name: "Home", icon: Home, path: "/" },
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
  const [isOpen, setIsOpen] = useState(false);

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
            <p className="text-sm font-bold text-white">Sign Out?</p>
            <p className="text-xs text-white/50">Are you sure you want to logout?</p>
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
              toast.success("Session ended successfully", { icon: "👋" });
              router.push("/");
            }}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/20"
          >
            Logout
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-xl text-xs font-bold transition-all"
          >
            Keep me in
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
    <>
      {/* Cohesive Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-4">
        <img src="/logo.jpg" alt="Logo" className="h-8 w-auto object-contain" />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`h-screen w-64 fixed left-0 top-0 bg-black border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        {/* Mobile Close Button (Inside Sidebar) */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-6 right-4 p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* LOGO */}
        <div className="px-6 py-6 border-b border-white/10 flex flex-col items-center">
          <div className="p-1 bg-black">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-full h-auto max-h-16 object-contain" 
            />
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold text-center mt-3">Control Hub</p>
        </div>

        {/* MENU */}
        <nav className="mt-6 px-4 space-y-2 flex-1 overflow-y-auto no-scrollbar pb-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
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
        <div className="w-full p-4 space-y-4 border-t border-white/10 shrink-0 bg-[#000000]">
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
    </>
  );
}
