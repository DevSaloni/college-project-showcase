import Sidebar from "../../components/teacher-dash/Sidebar";
import { Toaster } from "react-hot-toast";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#050A16] min-h-screen">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 px-8 py-6">
        {children}
      </main>
    </div>
  );
}
