
import "./globals.css";

import { ApiProvider } from "@/context/ApiContext";
import { SocketProvider } from "@/context/SocketContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ProjectVista | Innovative Student Project Showcase",
  description: "A premium platform to discover, showcase, and connect with cutting-edge student innovations and academic projects.",
  keywords: ["student projects", "showcase", "innovation", "portfolio", "academic projects", "ProjectVista"],
  authors: [{ name: "ProjectVista Team" }],
  icons: {
    icon: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
          rel="stylesheet"
          precedence="default"
        />
      </head>
      <body className="bg-black text-white">
        <ApiProvider>
          <SocketProvider>
            <LayoutWrapper>
              <main>{children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "#1f2937",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                    },
                  }}
                />
              </main>
            </LayoutWrapper>
          </SocketProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
