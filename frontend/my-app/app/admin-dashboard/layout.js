import Sidebar from "../../components/admin-dash/Sidebar";
import { Toaster } from "react-hot-toast";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#000000] min-h-screen">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-0 md:ml-64 flex-1 px-4 md:px-8 pt-20 md:py-6">
        {children}
      </main>
    </div>
  );
}
