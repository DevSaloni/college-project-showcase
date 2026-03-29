"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/student-dashboard") ||
    pathname.startsWith("/teacher-dashboard") ||
    pathname.startsWith("/admin-dashboard");

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && !isAuthPage && <Footer />}
    </>
  );
}
