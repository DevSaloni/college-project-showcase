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

  const isFullHeightPage = pathname === "/login" || pathname === "/register" || pathname === "/contact";

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && !isFullHeightPage && <Footer />}
    </>
  );
}
