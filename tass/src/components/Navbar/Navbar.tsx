"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#E95D28] shadow-sm border-b border-[#e0e0e0]">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between px-3 sm:px-8 h-[52px]">
                {/* Left: Logo and nav links */}
                <div className="flex items-center space-x-7">
                    <Link href="/" className="flex-shrink-0 block">
                        <Image
                            src="/images/logo.png"
                            alt="Company Logo"
                            width={126}
                            height={27}
                            className="object-contain"
                            priority
                        />
                    </Link>
                    {/* Desktop nav links */}
                    <div className="hidden sm:flex items-center space-x-6 text-[14px] font-normal text-white">
                        <Link href="/Home" className="hover:underline transition-none">Home</Link>
                        <Link href="/How It Works" className="hover:underline transition-none">How It Works</Link>
                        <Link href="/FAQ" className="hover:underline transition-none">FAQ</Link>
                        <Link href="/pricing" className="hover:underline transition-none">Pricing</Link>
                    </div>
                </div>

                {/* Desktop buttons */}
                <div className="hidden sm:flex items-center space-x-2">
                    <Link href="/Register">
                        <button
                            className="border border-white bg-[#E95D28] text-white rounded-full px-4 py-1 text-[13px] font-medium cursor-pointer"
                            style={{ height: 30 }}
                        >
                            Register
                        </button>
                    </Link>
                    <Link href="/Login">
                        <button
                            className="bg-[#E95D28] text-white rounded-full px-5 py-1 text-[13px] font-medium transition hover:opacity-90 cursor-pointer"
                            style={{ height: 30, minWidth: 75 }}
                        >
                            Login
                        </button>
                    </Link>
                </div>

                {/* Hamburger for mobile */}
                <button
                    className="sm:hidden flex items-center focus:outline-none"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={menuOpen ? "Close Menu" : "Open Menu"}
                >
                    {menuOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="sm:hidden absolute top-full left-0 w-full bg-[#F8F5F6] border-t border-[#e0e0e0] px-6 py-4 z-40 shadow-md">
                    <div className="flex flex-col space-y-3 mb-3 text-[#222] text-[15px] font-normal">
                        <Link href="/Home" onClick={() => setMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/How It Works" onClick={() => setMenuOpen(false)}>
                            How It Works
                        </Link>
                        <Link href="/pricing" onClick={() => setMenuOpen(false)}>
                            FAQ
                        </Link>
                        <Link href="/pricing" onClick={() => setMenuOpen(false)}>
                            Pricing
                        </Link>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Link href="/register" onClick={() => setMenuOpen(false)}>
                            <button
                                className="border border-[#E95D28] text-[#E95D28] bg-transparent rounded-full px-4 py-2 text-[14px] font-medium"
                            >
                                Register
                            </button>
                        </Link>
                        <Link href="/login" onClick={() => setMenuOpen(false)}>
                            <button
                                className="bg-[#E95D28] text-white rounded-full px-4 py-2 text-[14px] font-medium"
                                style={{ minWidth: 75 }}
                            >
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
