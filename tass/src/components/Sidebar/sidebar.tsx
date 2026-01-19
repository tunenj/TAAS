"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";

interface NavItem {
  name: string;
  path: string;
  icon: string;
  children?: { name: string; path: string }[];
}

const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth(); // Added role from useAuth
  const path = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://abasstaging.avetiumconsult.com/api";

  const toggleSubMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  // --------------------------
  // NAV ITEMS
  // --------------------------
  const adminNavItems: NavItem[] = [
    { name: "Home", path: "/dashboard/admin", icon: "/icons/home.png" },
    { name: "Attendance", path: "/dashboard/adminAttendance", icon: "/icons/attendance.png" },
    { name: "Projects", path: "/dashboard/project", icon: "/icons/project.png" },
    { name: "Task", path: "/dashboard/createTask", icon: "/icons/task.png" },
    { name: "Task Validation", path: "/dashboard/taskValidation", icon: "/icons/validate.png" },
    { name: "Stipend", path: "/dashboard/adminStipend", icon: "/icons/stipend.png" },
    {
      name: "Report",
      path: "/dashboard/reports",
      icon: "/icons/report.png",
      children: [
        { name: "Agent Report", path: "/dashboard/reports/agent-report" },
        { name: "Test Report", path: "/dashboard/reports/test-report" },
        { name: "Project Report", path: "/dashboard/reports/project-report" },
      ],
    },
    { name: "Settings", path: "/dashboard/adminSettings", icon: "/icons/setting.png" },
  ];

  const agentNavItems: NavItem[] = [
    { name: "Home", path: "/dashboard/agent", icon: "/icons/home.png" },
    { name: "Attendance", path: "/dashboard/agentAttendance", icon: "/icons/attendance.png" },
    { name: "Task", path: "/dashboard/agentTask", icon: "/icons/task.png" },
    { name: "Stipend", path: "/dashboard/agentStipend", icon: "/icons/stipend.png" },
    { name: "Settings", path: "/dashboard/agentSettings", icon: "/icons/setting.png" },
  ];

  // Determine nav items based on role
  const getNavItems = () => {
    if (!user || !role) return [];
    
    // Use the role from useAuth (which should be "ADMINISTRATOR" or "AGENT")
    if (role === "ADMINISTRATOR") {
      return adminNavItems;
    } else {
      return agentNavItems;
    }
  };

  const navItems = getNavItems();

  const logoutItem = {
    name: "Logout",
    path: "/logout",
    icon: "/icons/logout.png",
  };

  // --------------------------
  // LOGOUT HANDLER
  // --------------------------
  const handleLogout = async () => {
    toast.loading("Logging out...");
    try {
      await fetch(`${BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      logout();
      toast.dismiss();
      toast.success("Logout successful!");
      setTimeout(() => router.replace("/login"), 1200);
    }
  };

  const renderSkeleton = () => {
    return Array(6)
      .fill(0)
      .map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 h-11 w-full px-4 rounded-md bg-gray-200 animate-pulse mb-2"
        >
          <div className="w-5 h-5 bg-gray-300 rounded" />
          <div className="h-3 w-24 bg-gray-300 rounded" />
        </div>
      ));
  };

  // Debug: Log user and role for verification
  useEffect(() => {
    console.log("Sidebar - User:", user);
    console.log("Sidebar - Role:", role);
  }, [user, role, navItems]);

  return (
    <>
      {/* Overlay for MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-[#FDF2EE] flex flex-col border-r border-gray-200
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="h-20 flex items-center px-4">
          <span className={`text-lg font-bold text-gray-600`}>Avetium</span>
        </div>

        {/* NAV */}
        <nav className="flex flex-col font-medium ml-4 overflow-y-auto pb-6 pt-2 flex-grow">
          {user && role ? (
            navItems.map((item) => {
              const isActive = path === item.path;

              const handleClick = () => {
                if (item.children) {
                  toggleSubMenu(item.name);
                } else {
                  router.push(item.path);
                  setIsOpen(false);
                }
              };

              return (
                <div key={item.name} className="w-full">
                  {/* MAIN ITEM */}
                  <div
                    className={`flex items-center justify-between h-11 w-full px-4 cursor-pointer rounded-md transition
                      ${
                        isActive
                          ? "bg-[#F97316]/10 text-[#F97316]"
                          : "hover:bg-[#F97316]/10 text-gray-600"
                      }`}
                    onClick={handleClick}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.icon}
                        alt={`${item.name} icon`}
                        width={20}
                        height={20}
                        className="object-contain"
                        style={{
                          filter: isActive
                            ? "invert(49%) sepia(96%) saturate(1651%) hue-rotate(351deg) brightness(97%) contrast(101%)"
                            : "none",
                        }}
                      />
                      <span className="text-sm leading-[150%]">{item.name}</span>
                    </div>

                    {item.children &&
                      (openMenu === item.name ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ))}
                  </div>

                  {/* SUBMENU */}
                  {item.children && openMenu === item.name && (
                    <ul className="ml-10 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.path}
                            className={`block text-sm py-1 hover:text-[#F97316] ${
                              path === child.path ? "text-[#F97316]" : "text-gray-600"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          ) : (
            renderSkeleton()
          )}
        </nav>

        {/* LOGOUT */}
        {user && (
          <div className="mt-auto mb-6 ml-4">
            <div
              className="flex items-center gap-3 h-11 w-full px-4 cursor-pointer hover:bg-[#F97316]/10 text-gray-600 rounded-md"
              onClick={handleLogout}
            >
              <Image
                src={logoutItem.icon}
                alt="Logout icon"
                width={20}
                height={20}
                className="object-contain"
              />
              <span className="text-sm leading-[150%]">Logout</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;