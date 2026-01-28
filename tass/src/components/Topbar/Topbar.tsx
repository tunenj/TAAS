"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, X, Search, Menu } from "lucide-react";
import { useState } from "react";

type NavItem = {
    name: string;
    path: string;
    icon: string;
};

const navItems: NavItem[] = [
    { name: "Home", path: "/dashboard/admin", icon: "/icons/home.png" },
    { name: "Attendance", path: "/dashboard/admin/attendance", icon: "/icons/attendance.png" },
    { name: "Projects", path: "/dashboard/admin/project", icon: "/icons/project.png" },
    { name: "Task", path: "/dashboard/admin/createTask", icon: "/icons/task.png" },
    { name: "Task Validation", path: "/dashboard/admin/taskValidation", icon: "/icons/validate.png" },
    { name: "Stipend", path: "/dashboard/admin/stipend", icon: "/icons/stipend.png" },
    { name: "Report", path: "/dashboard/admin/report", icon: "/icons/report.png" },
    { name: "Settings", path: "/dashboard/admin/settings", icon: "/icons/setting.png" },
];

const Topbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* ================= HEADER ================= */}
            <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
                <div className="flex items-center justify-between px-4 md:px-9 h-14">
                    
                    {/* Left: Hamburger + Logo */}
                    <div className="flex items-center gap-3">
                        {/* Hamburger (mobile) */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="md:hidden p-2 rounded hover:bg-gray-100"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Logo (desktop only) */}
                        <Link href="/" className="hidden md:block">
                            <Image
                                src="/images/Avetium.png"
                                alt="Avetium"
                                width={120}
                                height={32}
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Center: Search (desktop only) */}
                    <div className="hidden md:flex flex-1 justify-center px-6">
                        <div className="relative w-full max-w-md -ml-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm border border-gray-300 focus:outline-none"
                            />
                        </div>
                    </div>
                    {/* Right: Icons */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded hover:bg-gray-100">
                            <Image src="/icons/inbox.png" alt="Inbox" width={22} height={22} />
                        </button>

                        <button className="p-2 rounded hover:bg-gray-100">
                            <Bell className="w-6 h-6" />
                        </button>

                        <button className="p-2 rounded hover:bg-gray-100">
                            <Image src="/icons/profile.png" alt="Profile" width={24} height={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ================= MOBILE DRAWER ================= */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white shadow z-40 transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
            >
                {/* Drawer Header */}
                <div className="h-14 px-4 flex items-center justify-between border-b">
                    <Image
                        src="/images/Avetium.png"
                        alt="Avetium"
                        width={110}
                        height={28}
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Search */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm border border-gray-300 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex flex-col gap-1 px-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                            <Image src={item.icon} alt={item.name} width={20} height={20} />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Topbar;
