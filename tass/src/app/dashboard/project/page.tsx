// components/ProjectsTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const projectId = "PRJ-001";

const projects = Array.from({ length: 11 }).map((_, idx) => ({
    id: idx + 1,
    projectName: "Mobile App Development",
    description: "Comprehensive testing of modules for functionality and efficiency...",
    startDate: "2025-07-30",
    deadline: "2024-08-30",
    assignedAgents:
        idx % 2
            ? "Ethan Harper, Liam Carter"
            : idx === 2
                ? "Noah Evans"
                : "Ethan Harper, Ava Foster",
}));

export default function ProjectsTable() {
    return (
        <div className="min-h-screen bg-white p-6 mt-5">
            <div className="flex justify-between mb-3 flex-wrap gap-2">
                <h2 className="font-semibold text-lg">All Projects</h2>
                <Link href="/dashboard/project/new-project" passHref>
                    <button className="border border-orange-400 text-orange-500 px-4 py-1 rounded-lg hover:bg-orange-50 transition text-sm">
                        Add Projects
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="w-[533.2px] flex items-center space-x-1 gap-8 border border-gray-200 p-2 mb-3 rounded-lg overflow-hidden text-xs font-medium">
                <button className="flex items-center px-12 py-1 border-r border-gray-200 text-gray-600">
                    <Image
                        src="/icons/filter-list.png"
                        alt="Filter"
                        width={28}
                        height={28}
                        className="object-cover"
                    />
                </button>
                <button className="px-3 py-1 border-r border-gray-200">Filter By</button>
                <button className="flex items-center px-3 py-1 border-r border-gray-200">
                    <span>Date</span>
                    <ChevronDown size={20} className="ml-2 text-gray-600" />
                </button>
                <button className="flex items-center px-3 py-1 gap-3 text-orange-500 hover:text-orange-600">
                    <Image
                        src="/icons/ic-replay.png"
                        alt="Reset"
                        width={28}
                        height={28}
                        className="object-cover"
                    />
                    Reset Filter
                </button>
            </div>

            {/* Table */}
            <div className="overflow-auto rounded-xl border border-gray-200">
                <table className="min-w-full bg-white text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600">
                            <th className="px-3 py-2 text-left font-semibold">
                                <input type="checkbox" />
                            </th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">S/N</th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">Project Name</th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">Description</th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">Start Date</th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">Deadline</th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">Assigned Agents</th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">Test Cases</th>
                            <th className="px-3 py-2 text-[#374151] text-left font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((proj, i) => (
                            <tr className="border-b border-gray-300 last:border-0" key={proj.id}>
                                <td className="px-3 py-2">
                                    <input type="checkbox" defaultChecked={i === 0} />
                                </td>
                                <td className="px-2 py-2">{i + 1}</td>
                                <td className="px-2 py-2 text-[#374151] cursor-pointer">{proj.projectName}</td>
                                <td className="px-2 py-2 text-[#374151] max-w-xs truncate">
                                    {proj.description}
                                </td>
                                <td className="px-2 py-2 text-[#374151]">{proj.startDate}</td>
                                <td className="px-2 py-2 text-[#374151]">{proj.deadline}</td>
                                <td className="px-2 py-2 text-[#4D7399]">{proj.assignedAgents}</td>
                                <td className="px-2 py-2">
                                    <Image
                                        src="/icons/csv.png"
                                        alt="CSV"
                                        width={28}
                                        height={28}
                                        className="object-cover"
                                    />
                                </td>
                                <td className="px-3 py-2 space-x-1">
                                    <Link
                                        href={`/dashboard/project/${projectId}`}
                                        className="text-orange-500 hover:underline text-xs"
                                    >
                                        View
                                    </Link>
                                    <span className="text-gray-400">|</span>
                                    <Link
                                        href={`/dashboard/project/${projectId}?edit=true`}
                                        className="text-green-700 hover:underline text-xs"
                                    >
                                        Edit
                                    </Link>
                                    <span className="text-gray-400">|</span>
                                    <button className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
