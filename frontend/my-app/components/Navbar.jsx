"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { CATEGORIES } from "../app/data/categoryData";

export default function Navbar() {
  const [openCategories, setOpenCategories] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role,setRole] = useState(null);

 useEffect(() => {
  const updateAuth = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token && userRole) {
      setRole(userRole);
    } else {
      setRole(null);
    }
  };

  window.addEventListener("login-status", updateAuth);
  updateAuth();

  return () => window.removeEventListener("login-status", updateAuth);
}, []);

  return (
    <nav className="w-full fixed top-0 left-0 z-50">
      <div
        className="backdrop-blur-md"
        style={{
          background:
            "linear-gradient(90deg, var(--pv-bg-dark) 0%, #041227 60%)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-white">
              Project<span className="text-[var(--pv-accent)]">Vista</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-white/90 text-lg">

            <Link href="/" className="hover:text-[var(--pv-accent)]">Home</Link>
            <Link href="/explore" className="hover:text-[var(--pv-accent)]">Explore</Link>
            <Link href="/about" className="hover:text-[var(--pv-accent)]">About</Link>
            <Link href="/contact" className="hover:text-[var(--pv-accent)]">Contact</Link>

            {role === "student" && (
          <Link href="/student-dashboard" className="hover:text-[var(--pv-accent)]">
              Dashboard
            </Link>
          )}

          {role === "teacher" && (
            <Link href="/teacher-dashboard" className="hover:text-[var(--pv-accent)]">
              Dashboard
            </Link>
          )}

           {role === "admin" && (
            <Link href="/admin-dashboard" className="hover:text-[var(--pv-accent)]">
              Dashboard
            </Link>
          )}

            {/* Categories dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenCategories(!openCategories)}
                className="flex items-center gap-2 hover:text-[var(--pv-accent)] transition"
              >
                Categories <ChevronDown size={14} />
              </button>

              {openCategories && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0b1320]/95 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2 text-white hover:bg-[var(--pv-accent)] hover:text-black rounded transition"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {!isLoggedIn && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))" }}
              >
                Login
              </Link>
            )}

            {isLoggedIn && (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                }}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: "linear-gradient(90deg, #ff4b4b, #ff0000)" }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
