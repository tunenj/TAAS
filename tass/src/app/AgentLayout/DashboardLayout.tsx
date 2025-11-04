"use client";

import AdminSidebar from "@/components/AgentSidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";



const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar  />
        <main className="flex-1 overflow-y-auto p-6 bg-[#fefcfc]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;