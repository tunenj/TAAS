// app/dashboard/layout.tsx

import Topbar from "@/components/Topbar/Topbar";
import Sidebar from "@/components/Sidebar/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 top-3">
            {/* TOPBAR */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white z-45">
                <Topbar />
            </header>

            {/* SIDEBAR */}
            <aside className="md:fixed md:-top-1.5 pt-2.5 md:left-0 md:bottom-0 md:w-64 md:bg-white md:z-40">
                <Sidebar />
            </aside>

            {/* MAIN CONTENT */}
            <main className="pt-12 md:pl-64 min-h-screen">
                {children}
            </main>
        </div>

    );
}
