"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { useState } from "react";

type NavItem = {
    name: string;
    path: string;
    icon: string;
};

const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "/icons/Frame.png" },
    { name: "Attendance", path: "/#", icon: "/icons/Frame (1).png" },
    { name: "Projects", path: "/#", icon: "/icons/Frame (2).png" },
    { name: "Testers", path: "/transactions", icon: "/icons/Frame (3).png" },
    { name: "Tasks", path: "/#", icon: "/icons/Frame (4).png" },
    { name: "Stipend", path: "/", icon: "/icons/Frame (5).png" },
    { name: "Report", path: "/", icon: "/icons/Frame (6).png" },
    { name: "Monitoring", path: "/", icon: "/icons/Fram.png" },
    { name: "Settings", path: "/", icon: "/icons/Frame (7).png" },
];

const Topbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white shadow py-2 flex items-center justify-between z-50 px-4 md:px-9">
                {/* Left Section (Hamburger + Logo) */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Hamburger (mobile only) */}
                    <button
                        onClick={() => setIsOpen((v) => !v)}
                        className="md:hidden p-2 rounded-md text-2xl hover:bg-gray-100"
                        aria-label="Menu"
                    >
                        ☰
                    </button>

                    {/* Logo (desktop) */}
                    <Link
                        href="/"
                        className="hidden md:flex items-center justify-center mb-1 lg:mb-0"
                    >
                        <Image
                            src="/images/Avetium.png"
                            alt="squareme"
                            width={128.99}
                            height={25.92}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Mobile: centered logo */}
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 md:hidden flex items-center"
                >
                    <Image
                        src="/images/Avetium.png"
                        alt="Avetium"
                        width={120}
                        height={32}
                        className="object-contain"
                    />
                </Link>

                {/* Right Section: Notifications */}
                <div className="flex items-center gap-2 md:gap-6">
                    <button
                        className="flex items-center hover:bg-gray-100 rounded transition p-1.5"
                        aria-label="Notifications"
                    >
                        <Bell className="w-6 h-6 text-black" />
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
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2"
                    >
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
