"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // ✅ hamburger + close icons

const Sidebar: React.FC = () => {
  const path = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/dashboard/agent", icon: "/icons/home.png" },
    { name: "Attendance", path: "/dashboard/agent/attendance", icon: "/icons/attendance.png" },
    { name: "Task", path: "/dashboard/createTask", icon: "/icons/task.png" },
    { name: "Stipend", path: "/dashboard/agent/stipend", icon: "/icons/stipend.png" },
    { name: "Settings", path: "/dashboard/agent/settings", icon: "/icons/setting.png" },
  ];

  const logoutItem = { name: "Logout", path: "/logout", icon: "/icons/logout.png" };
  const anyActive = navItems.some(item => path === item.path);

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#F97316] text-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-[#FDF2EE] flex flex-col border-r border-gray-200
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-4">
          <span className={`text-lg font-bold ${anyActive ? "text-[#F97316]" : "text-gray-600"}`}>
            Avetium
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 font-medium overflow-y-auto ml-4 pb-6 pt-2 flex-grow">
          {navItems.map(item => {
            const isActive = path === item.path;
            return (
              <div
                key={item.name}
                className={`flex items-center gap-3 h-11 w-full px-4 cursor-pointer rounded-md transition
                ${isActive ? "bg-[#F97316]/10 text-[#F97316]" : "hover:bg-[#F97316]/10 text-gray-600"}`}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
              >
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
            );
          })}
        </nav>

        {/* Logout (bottom) */}
        <div className="mt-auto mb-6 ml-4">
          <div
            className="flex items-center gap-3 h-11 w-full px-4 cursor-pointer hover:bg-[#F97316]/10 text-gray-600 rounded-md"
            onClick={() => {
              router.push(logoutItem.path);
              setIsOpen(false);
            }}
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
      </aside>
    </>
  );
};

export default Sidebar;
