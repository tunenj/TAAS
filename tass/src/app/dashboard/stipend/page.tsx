"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Search, Download } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";

type Stipend = {
  id: number;
  testerName: string;
  projectLinked: string;
  eligibilityStatus: "Eligible" | "Not Eligible";
  consistency: number;
  timeliness: number;
  attendance: number;
  taskCompletion: number;
  availability: "Active" | "Inactive";
  stipendAmount: number;
  period: string;
};

const mockData: Stipend[] = Array.from({ length: 45 }).map((_, idx) => ({
  id: idx + 1,
  testerName: "Ethan Harper",
  projectLinked: "Project Alpha",
  eligibilityStatus: idx % 5 === 0 ? "Not Eligible" : "Eligible",
  consistency: 90,
  timeliness: idx % 4 === 0 ? 65 : 95,
  attendance: 85,
  taskCompletion: 98,
  availability: "Active",
  stipendAmount: 3500,
  period: "Month",
}));

export default function StipendManagement() {
  const [data] = useState<Stipend[]>(mockData);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = data.filter((item) =>
    item.testerName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-2 mt-14 max-w-7xl -ml-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Stipend Management —
            <span className="text-orange-500 font-normal text-lg">
              {" "}
              Manage and oversee stipend records for testers and interns.
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Testers Name"
              className="border border-gray-300 rounded-2xl pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Filter Section */}
        <div className="flex items-center gap-3 border border-gray-200 p-2 rounded-lg overflow-hidden text-xs font-medium">
          <button className="flex items-center px-3 py-1 border-r border-gray-200 text-gray-600">
            <Image
              src="/icons/filter-list.png"
              alt="Filter"
              width={20}
              height={20}
              className="object-cover"
            />
          </button>

          <button className="px-4 py-2 border-r border-gray-200 text-gray-700">
            Filter By
          </button>

          <button className="flex items-center px-4 py-2 border-r border-gray-200 text-gray-700">
            <span>Date</span>
            <ChevronDown size={18} className="ml-2 text-gray-600" />
          </button>

          <button className="flex items-center px-4 py-2 gap-2 text-orange-500 hover:text-orange-600">
            <Image
              src="/icons/ic-replay.png"
              alt="Reset"
              width={20}
              height={20}
              className="object-cover"
            />
            Reset Filter
          </button>
        </div>

        {/* Export Button */}
        <div>
          <button className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-2xl text-sm hover:bg-orange-600">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold">
            <tr>
              <th className="p-3 text-left">
                <input type="checkbox" />
              </th>
              <th className="p-3 text-left">Tester/Intern Name</th>
              <th className="p-3 text-left">Project Linked</th>
              <th className="p-3 text-left">Eligibility Status</th>
              <th className="p-3 text-center">Consistency of Performance</th>
              <th className="p-3 text-center">Timeliness</th>
              <th className="p-3 text-center">Attendance %</th>
              <th className="p-3 text-center">Task Completion %</th>
              <th className="p-3 text-center">Availability</th>
              <th className="p-3 text-center">Stipend Amount</th>
              <th className="p-3 text-center">Period</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition text-gray-700"
              >
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3">{item.testerName}</td>
                <td className="p-3 text-orange-500">{item.projectLinked}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.eligibilityStatus === "Eligible"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.eligibilityStatus}
                  </span>
                </td>
                <td className="p-3 text-center text-orange-500">
                  {item.consistency}%
                </td>
                <td className="p-3 text-center text-orange-500">
                  {item.timeliness}%
                </td>
                <td className="p-3 text-center text-orange-500">
                  {item.attendance}%
                </td>
                <td className="p-3 text-center text-orange-500">
                  {item.taskCompletion}%
                </td>
                <td
                  className={`p-3 text-center font-medium ${
                    item.availability === "Active"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.availability}
                </td>
                <td className="p-3 text-center text-orange-500">
                  ₦{item.stipendAmount}
                </td>
                <td className="p-3 text-center text-orange-500">
                  {item.period}
                </td>
                <td className="p-3 text-center text-orange-500">
                  <button className="hover:underline mr-2">View</button>|
                  <button className="hover:underline ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 text-sm text-gray-600">
        <Pagination
          totalPages={totalPages}
          initialPage={currentPage}
          initialPageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
