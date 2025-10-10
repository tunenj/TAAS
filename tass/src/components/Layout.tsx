'use client'
import React from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 text-xl font-bold border-b">My Dashboard</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-200">
                        Home
                    </Link>
                    <Link href="/AttendanceList" className="block px-3 py-2 rounded hover:bg-gray-200">
                        Attendance
                    </Link>
                    {/* add more links as needed */}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-white shadow flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold">Attendance Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="text-sm px-3 py-1 bg-orange-500 text-white rounded">
                            Notifications
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                    </div>
                </header>

                {/* Page body */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
