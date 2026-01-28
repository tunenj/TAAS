"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";

interface NavItem {
  name: string;
  path: string;
  icon: string;
  children?: { name: string; path: string }[];
}

const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const path = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://abasstaging.avetiumconsult.com/api/v1";

  const toggleSubMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  /* ================= NAV ITEMS ================= */

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

  const navItems = role === "ADMINISTRATOR" ? adminNavItems : agentNavItems;

  /* ================= LOGOUT ================= */

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

  /* ================= AUTO-CLOSE ON DESKTOP ================= */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= CLOSE ON NAV CLICK (MOBILE) ================= */
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  /* ================= UI ================= */

  return (
    <>
      {/* ✅ MOBILE HAMBURGER - Improved from first code */}
      <div className="md:hidden fixed top-4 left-4 z-50 mt-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#F97316] text-white p-2 rounded flex items-center gap-1"
        >
          <Menu className="w-5 h-5" />
          <span className="hidden">Menu</span>
        </button>
      </div>

      {/* ✅ MOBILE OVERLAY - Improved from first code */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 bg-[#FDF2EE] flex flex-col border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {/* CLOSE BUTTON (MOBILE) */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col font-medium ml-4 overflow-y-auto pb-6 flex-grow">
          {user &&
            navItems.map((item) => {
              const isActive = path === item.path;

              return (
                <div key={item.name}>
                  <div
                    onClick={() => {
                      if (item.children) {
                        toggleSubMenu(item.name);
                      } else {
                        router.push(item.path);
                        handleNavClick(); // Auto-close on mobile
                      }
                    }}
                    className={`flex items-center justify-between h-11 px-4 rounded-md cursor-pointer
                      ${isActive
                        ? "bg-[#F97316]/10 text-[#F97316]"
                        : "hover:bg-[#F97316]/10 text-gray-600"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Image src={item.icon} alt={item.name} width={20} height={20} />
                      <span className="text-sm">{item.name}</span>
                    </div>

                    {item.children &&
                      (openMenu === item.name ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>

                  {item.children && openMenu === item.name && (
                    <ul className="ml-10 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.path}
                            onClick={handleNavClick} // Auto-close on mobile
                            className={`block text-sm py-1 ${path === child.path
                                ? "text-[#F97316]"
                                : "text-gray-600"
                              }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
        </nav>

        {/* LOGOUT */}
        {user && (
          <div className="mb-6 ml-4">
            <div
              onClick={() => {
                handleLogout();
                handleNavClick(); // Auto-close on mobile
              }}
              className="flex items-center gap-3 h-11 px-4 cursor-pointer hover:bg-[#F97316]/10 rounded-md text-gray-600"
            >
              <Image src="/icons/logout.png" alt="Logout" width={20} height={20} />
              <span className="text-sm">Logout</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;