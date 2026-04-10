"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, Menu, X, LogOut, LayoutDashboard,
  Compass, Home, Search, Info, Phone, Layers
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { CATEGORIES } from "@/app/data/categoryData";
import { toast } from "react-hot-toast";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Explore", path: "/explore", icon: Search },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");

  const catRef = useRef(null);

  /* ── auth state ── */
  const updateAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const name = localStorage.getItem("userName");
    if (token) { setIsLoggedIn(true); setRole(userRole); setUserName(name || "User"); }
    else { setIsLoggedIn(false); setRole(null); setUserName(""); }
  };

  useEffect(() => {
    updateAuthStatus();
    window.addEventListener("login-status", updateAuthStatus);
    setIsMenuOpen(false);
    setOpenCategories(false);
    return () => {
      window.removeEventListener("login-status", updateAuthStatus);
    };
  }, [pathname]);

  /* close cat dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCategories(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setRole(null);
    toast.success("Successfully logged out");
    router.push("/");
    window.dispatchEvent(new Event("login-status"));
    setIsMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (role === "student") return "/student-dashboard";
    if (role === "teacher") return "/teacher-dashboard";
    if (role === "admin") return "/admin-dashboard";
    return "/";
  };

  const initials = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* ══════════════ NAVBAR BAR ══════════════ */}
      <nav
        style={{ fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}
        className="fixed top-0 left-0 w-full z-[100] py-2 bg-black border-b border-white/[0.07] shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center group shrink-0 -ml-2">
            <div className="p-1 bg-black">
              <img
                src="/logo.jpg"
                alt="ProjectVault"
                className="h-12 w-auto object-contain group-hover:scale-105 transition-all duration-500"
              />
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                href={path}
                className={`relative text-[14px] font-normal uppercase tracking-[0.12em] transition-colors duration-200 pb-0.5 ${pathname === path
                  ? "text-white"
                  : "text-white/60 hover:text-white"
                  }`}
              >
                {name}
                {/* Active underline pill */}
                {pathname === path && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))" }}
                  />
                )}
              </Link>
            ))}


          </div>

          {/* ── Desktop Auth ── */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Avatar pill */}
                {role === "recruiter" ? (
                  <div
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-xs font-black shrink-0"
                      style={{ background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))" }}
                    >
                      {initials}
                    </div>
                    <div className="leading-none">
                      <p className="text-white text-[13px] font-bold">{userName}</p>
                      <p className="text-white/40 text-[11px] capitalize mt-0.5">{role}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={getDashboardPath()}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-xs font-black shrink-0"
                      style={{ background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))" }}
                    >
                      {initials}
                    </div>
                    <div className="leading-none">
                      <p className="text-white text-[13px] font-bold">{userName}</p>
                      <p className="text-white/40 text-[11px] capitalize mt-0.5">{role}</p>
                    </div>
                    <LayoutDashboard size={13} className="text-white/30 group-hover:text-[var(--pv-accent)] transition-colors ml-1" />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-[13px] font-normal uppercase tracking-widest text-white/70 hover:text-white rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-[13px] font-normal uppercase tracking-widest text-black rounded-xl shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all"
                  style={{
                    background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))",
                    boxShadow: "0 4px 20px color-mix(in srgb, var(--pv-accent) 35%, transparent)"
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setIsMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`absolute transition-all duration-300 ${isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
            >
              <X size={18} />
            </span>
            <span
              className={`absolute transition-all duration-300 ${isMenuOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}
            >
              <Menu size={18} />
            </span>
          </button>
        </div>
      </nav>

      {/* ══════════════ MOBILE DRAWER ══════════════ */}
      {/* Backdrop */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`lg:hidden fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Drawer panel */}
      <div
        style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
        className={`lg:hidden fixed top-0 right-0 h-full w-[300px] z-[99] flex flex-col transition-transform duration-400 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Use inline style for the drawer background */}
        <div
          className="h-full flex flex-col"
          style={{ background: "rgba(0,0,0,0.98)", backdropFilter: "blur(32px)", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center group">
              <div className="overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="ProjectVault"
                  className="h-10 w-auto object-contain mix-blend-screen filter brightness-[0.8] contrast-[5] brightness-[1.5]"
                />
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer nav links */}
          <div className="flex-1 flex flex-col px-8 py-10 overflow-y-auto no-scrollbar">
            {/* ── Main Links ── */}
            <div className="space-y-2">
              {navLinks.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between py-5 transition-all duration-300 group ${pathname === path
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`transition-colors duration-300 ${pathname === path ? "text-[var(--pv-accent)]" : "text-white/30 group-hover:text-white"}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-[14px] font-normal uppercase tracking-[0.2em] transition-colors duration-300`}>
                      {name}
                    </span>
                  </div>
                  {pathname === path && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)]" />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Auth Actions (Unified) ── */}
            <div className="mt-8 pt-8 border-t border-white/[0.04] space-y-2">
              {isLoggedIn ? (
                <>
                  {role !== "recruiter" && (
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 py-5 text-[14px] font-normal uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all group"
                    >
                      <LayoutDashboard size={20} className="text-[var(--pv-accent)] opacity-60 group-hover:opacity-100" />
                      My Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 py-5 text-[14px] font-normal uppercase tracking-[0.2em] text-red-400 opacity-60 hover:opacity-100 transition-all w-full text-left group"
                  >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-5 text-[13px] font-normal uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full py-4 mt-4 rounded-xl text-[12px] font-normal uppercase tracking-[0.2em] text-black transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))"
                    }}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
