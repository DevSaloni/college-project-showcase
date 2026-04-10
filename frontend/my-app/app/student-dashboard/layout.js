import Sidebar from "../../components/student-dash/sidebar";
import { Toaster } from "react-hot-toast";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#000000] min-h-screen relative">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-64 px-4 sm:px-6 md:px-8 pt-24 pb-10 md:py-6 overflow-x-hidden transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
