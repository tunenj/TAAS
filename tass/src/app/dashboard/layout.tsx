import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 md:pl-64">
            <Sidebar />
            <div className="flex flex-col min-h-screen">
                <Topbar />
                {/* REMOVE overflow-y-auto here */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
