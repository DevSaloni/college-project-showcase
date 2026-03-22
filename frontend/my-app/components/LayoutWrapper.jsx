"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/student-dashboard") ||
    pathname.startsWith("/teacher-dashboard") ||
    pathname.startsWith("/admin-dashboard");


  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
