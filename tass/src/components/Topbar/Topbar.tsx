"use client";
// top bar
import Image from "next/image";
import Link from "next/link";
import { Bell, X, Search, Mail, User } from "lucide-react";
import { useState } from "react";

type NavItem = {
    name: string;
    path: string;
    icon: string;
};

const navItems = [
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
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white shadow py-2 flex items-center justify-between z-50 px-4 md:px-9">
                {/* Left Section (Logo) */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Logo (desktop) */}
                    <Link href="/" className="hidden md:flex items-center justify-center mb-1 lg:mb-0">
                        <Image
                            src="/images/Avetium.png"
                            alt="Avetium"
                            width={120}
                            height={32}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Search Bar - to the left */}
                <div className="absolute max-w-xs w-full ml-52">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Search width={20} height={20} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-gray-100 p-2 rounded-full text-sm border border-gray-300 focus:outline-none pl-10"
                    />
                </div>

                {/* Right Section: Notifications */}
                <div className="flex items-center gap-2 md:gap-2">
                    <button className="flex items-center hover:bg-gray-100 rounded transition p-1.5" aria-label="Mail">
                         <Image
                            src="/icons/inbox.png"
                            alt="Avetium"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    </button>
                    <button className="flex items-center hover:bg-gray-100 rounded transition p-1.5" aria-label="Notifications">
                        <Bell className="w-6 h-6 text-black" />
                    </button>
                    <button className="flex items-center hover:bg-gray-100 rounded transition p-1.5" aria-label="Profile">
                        <Image
                            src="/icons/profile.png"
                            alt="Avetium"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer (Hamburger) */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white shadow transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
                aria-hidden={!isOpen}
            >
                {/* Drawer Header */}
                <div className="h-14 px-4 flex items-center justify-between border-b">
                    <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                        <Image
                            src="/images/Avetium.png"
                            alt="Avetium"
                            width={110}
                            height={28}
                            className="object-contain"
                        />
                    </Link>
                    <button
                        aria-label="Close menu"
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Drawer Body */}
                <nav className="flex flex-col gap-1 p-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name} icon`}
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                            <span className="text-sm text-gray-800">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Topbar;
