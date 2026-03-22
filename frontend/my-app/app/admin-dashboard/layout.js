import Sidebar from "../../components/admin-dash/Sidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#050A16] min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 px-8 py-6">
        {children}
      </main>
    </div>
  );
}
