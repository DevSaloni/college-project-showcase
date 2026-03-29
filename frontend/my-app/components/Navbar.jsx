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

  const [isScrolled, setIsScrolled] = useState(false);
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
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("login-status", updateAuthStatus);
    setIsMenuOpen(false);
    setOpenCategories(false);
    return () => {
      window.removeEventListener("scroll", onScroll);
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
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out ${isScrolled
          ? "py-3 bg-[#020712]/80 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
          : "py-5 bg-transparent border-b border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="black" opacity="0.9" />
                <path d="M2 17l10 5 10-5" stroke="black" strokeWidth="2.2" strokeOpacity="0.6" />
                <path d="M2 12l10 5 10-5" stroke="black" strokeWidth="2.2" strokeOpacity="0.4" />
              </svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Project
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))" }}
              >
                Vault
              </span>
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                href={path}
                className={`relative text-[15px] font-semibold transition-colors duration-200 pb-0.5 ${pathname === path
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
                  className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-black text-black rounded-xl shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all"
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
          style={{ background: "rgba(5,10,22,0.98)", backdropFilter: "blur(32px)", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 group">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="black" opacity="0.9" />
                </svg>
              </div>
              <span className="text-base font-black text-white tracking-tight">
                Project<span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))" }}>Vault</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer nav links */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navLinks.map(({ name, path, icon: Icon }) => (
              <Link
                key={name}
                href={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all ${pathname === path
                  ? "text-black font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                style={pathname === path
                  ? { background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))" }
                  : {}}
              >
                <Icon size={16} />
                {name}
              </Link>
            ))}

            {/* Mobile Categories accordion */}
            <div>
              <button
                onClick={() => setMobileCatOpen(v => !v)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="flex items-center gap-3">
                  <Layers size={16} />
                  Categories
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${mobileCatOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileCatOpen && (
                <div className="mt-1 ml-4 pl-4 border-l border-white/[0.08] space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Compass size={13} className="text-[var(--pv-accent)]/60 shrink-0" />
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Drawer footer — auth actions */}
          <div className="px-4 pb-8 pt-4 border-t border-white/[0.06] space-y-3">
            {isLoggedIn ? (
              <>
                {/* User info card */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08]"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))" }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{userName}</p>
                    <p className="text-white/40 text-[11px] capitalize">{role}</p>
                  </div>
                </div>

                <Link
                  href={getDashboardPath()}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[15px] font-bold text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard size={15} className="text-[var(--pv-accent)]" />
                  My Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 rounded-xl text-[15px] font-bold text-red-400 border border-red-500/20 bg-red-500/[0.07] hover:bg-red-500/15 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 rounded-xl text-[15px] font-bold text-white border border-white/10 hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full py-4 rounded-xl text-[15px] font-black text-black transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))",
                    boxShadow: "0 6px 24px color-mix(in srgb, var(--pv-accent) 30%, transparent)"
                  }}
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
