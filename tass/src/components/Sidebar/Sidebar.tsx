"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const Sidebar: React.FC = () => {
    const path = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const navItems = [
        { name: "Dashboard", path: "/dashboard/admin", icon: "/icons/Frame.png" },
        { name: "Attendance", path: "/dashboard/attendance", icon: "/icons/Frame (1).png" },
        {
            name: "Projects",
            path: "/dashboard/project",
            icon: "/icons/Frame (2).png",
            children: [
                { name: "All Projects", path: "/dashboard/project/all" },
            ],
        },
        // { name: "Testers", path: "/dashboard/testers", icon: "/icons/Frame (3).png" },
        {
            name: "Tasks", path: "/dashboard/createTask", icon: "/icons/Frame (4).png",
            // children: [
            //     { name: "Assigned Task", path: "/dashboard/tasks/assignedTask" },
            // ],
        },
        { name: "Stipend", path: "/dashboard/stipend", icon: "/icons/Frame (5).png" },
        { name: "Report", path: "/", icon: "/icons/Frame (6).png" },
        { name: "Monitoring", path: "/", icon: "/icons/Fram.png" },
        { name: "Settings", path: "/dashboard/settings", icon: "/icons/Frame (7).png" },
    ];

    const anyActive = navItems.some(item => path === item.path);

    const handleParentClick = (itemName: string, itemPath?: string) => {
        // Toggle submenu open/close
        setOpenSubmenu(prev => (prev === itemName ? null : itemName));
        // Navigate if path defined
        if (itemPath) {
            router.push(itemPath);
            setIsOpen(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 h-full w-56 bg-white flex flex-col border-r border-gray-200
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
            >
                {/* Logo / Header */}
                <div className="h-20 flex items-center px-4">
                    <span className={`text-lg font-bold ${anyActive ? "text-[#F97316]" : "text-gray-400"}`}>
                        Avetium
                    </span>
                </div>

                {/* Nav items */}
                <nav className="flex flex-col gap-2 font-medium overflow-y-auto ml-4 pb-6 mt-4">
                    {navItems.map(item => {
                        const isActive = path === item.path;

                        return (
                            <div key={item.name}>
                                <div
                                    className={`flex items-center gap-3 h-11 w-full px-4 cursor-pointer transition
                    ${isActive ? "text-[#F97316]" : "hover:bg-gray-100 text-gray-400"}`}
                                    onClick={() => {
                                        if (item.children) {
                                            handleParentClick(item.name, item.path);
                                        } else if (item.path) {
                                            router.push(item.path);
                                            setIsOpen(false);
                                        }
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
                                                ? " invert(49%) sepia(96%) saturate(1651%) hue-rotate(351deg) brightness(97%) contrast(101%)"
                                                : item.name === "Dashboard"
                                                    ? "grayscale(1) brightness(0.7)"
                                                    : "none",
                                        }}
                                    />
                                    <span className="text-sm leading-[150%]">{item.name}</span>
                                </div>

                                {/* Submenu if available and open */}
                                {item.children && openSubmenu === item.name && (
                                    <div className="ml-10 mt-1 flex flex-col gap-1">
                                        {item.children.map(child => {
                                            const childActive = path === child.path;
                                            return (
                                                <Link
                                                    key={child.name}
                                                    href={child.path}
                                                    className={`text-sm py-1 px-2 rounded-md transition
                            ${childActive
                                                            ? "text-[#F97316] bg-orange-100"
                                                            : "text-gray-400 hover:bg-gray-100"
                                                        }`}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {child.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
