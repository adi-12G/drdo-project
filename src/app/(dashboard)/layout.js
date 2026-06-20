import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <Navbar />

      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}