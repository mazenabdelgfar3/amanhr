import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main layout container */}
      <div className="lg:pr-64 min-h-screen flex flex-col transition-all">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content area */}
        <main className="flex-1 p-6 lg:p-8 rtl">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  );
}
