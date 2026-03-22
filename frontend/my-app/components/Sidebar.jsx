"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Folder, Upload, User, Bell, LogOut } from "lucide-react";

export default function Sidebar() {
  const path = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Projects", href: "/my-projects", icon: <Folder size={20} /> },
    { name: "Upload Project", href: "/upload-project", icon: <Upload size={20} /> },
    { name: "Profile", href: "/profile", icon: <User size={20} /> },
    { name: "Messages", href: "/messages", icon: <Bell size={20} /> },
    { name: "Logout", href: "/logout", icon: <LogOut size={20} /> },
  ];

  return (
    <aside className="w-64 fixed h-full bg-white shadow-lg p-10">
      {/* Logo */}
      <h2 className="text-2xl font-bold text-blue-600 mb-8">Student Panel</h2>

      {/* Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <div
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
                ${path === item.href ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
