"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    const hideFooter = pathname === "/login" || pathname === "/register";

    return (
        <>
            <Navbar />   {/* always show */}

            {children}

            {!hideFooter && <Footer />}  {/* only hide footer */}
        </>
    );
}