
import "./globals.css";

import { ApiProvider } from "@/context/ApiContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title:"ProjectVista",
  description: "Student Project Showcase Platform",
}

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
        <body className="bg-[#050816] text-white">
       <ApiProvider>
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
        </ApiProvider>
      </body>
    </html>
  );
}
