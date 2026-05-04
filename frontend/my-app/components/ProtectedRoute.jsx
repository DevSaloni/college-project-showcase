"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      toast.error("Please login to access this section");
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      toast.error("Unauthorized access");
      router.push("/");
      return;
    }

    setAuthorized(true);
  }, [router, pathname, allowedRoles]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--pv-accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return children;
}
