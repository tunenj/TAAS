"use client";

import React, { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";

/* Types */
type ResultStatus = "Pass" | "Fail";

interface ReportRow {
  id: number;
  project: string;
  testName: string;
  agent: string;
  taskTitle: string;
  failPass: ResultStatus;
  access: "Yes" | "No";
  evidence: string;
  submissionTime: string;
  startTime: string;
  endTime: string;
}

/* Sample Data */
const SAMPLE_DATA: ReportRow[] = [
  {
    id: 1,
    project: "Landing Page",
    testName: "Landing Page",
    agent: "Emily Carter",
    taskTitle:
      "Y’ello I am Zig your MTN online assistant What can I help you with today?",
    failPass: "Pass",
    access: "Yes",
    evidence: "login_successful.png",
    submissionTime: "2025-07-30 12:40pm",
    startTime: "2025-07-30 12:40pm",
    endTime: "2025-07-30 12:40pm",
  },
  {
    id: 2,
    project: "Landing Page",
    testName: "Landing Page",
    agent: "Olivia Green",
    taskTitle: "Start a New Conversation",
    failPass: "Fail",
    access: "No",
    evidence: "login_successful.png",
    submissionTime: "2025-07-30 12:40pm",
    startTime: "2025-07-30 12:40pm",
    endTime: "2025-07-30 12:40pm",
  },
  {
    id: 3,
    project: "Landing Page",
    testName: "Landing Page",
    agent: "Liam White",
    taskTitle:
      "Messenger Icon: Redirects to Chat on WhatsApp with +234 903 300 0001",
    failPass: "Fail",
    access: "No",
    evidence: "login_successful.png",
    submissionTime: "2025-07-30 12:40pm",
    startTime: "2025-07-30 12:40pm",
    endTime: "2025-07-30 12:40pm",
  },
  {
    id: 4,
    project: "Landing Page",
    testName: "Landing Page",
    agent: "Ava Taylor",
    taskTitle: "Telegram Icon",
    failPass: "Pass",
    access: "Yes",
    evidence: "login_successful.png",
    submissionTime: "2025-07-30 12:40pm",
    startTime: "2025-07-30 12:40pm",
    endTime: "2025-07-30 12:40pm",
  },
];

/* Component */
export default function TestReport() {
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("Project");
  const [agentFilter, setAgentFilter] = useState("Agent");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Extract unique filter options
  const projects = ["Project", ...new Set(SAMPLE_DATA.map((row) => row.project))];
  const agents = ["Agent", ...new Set(SAMPLE_DATA.map((row) => row.agent))];
  const statuses = ["All", "Pass", "Fail"];

  // Combined filtering logic
  const filtered = useMemo(() => {
    return SAMPLE_DATA.filter((row) => {
      const q = query.trim().toLowerCase();

      const matchesSearch =
        row.testName.toLowerCase().includes(q) ||
        row.agent.toLowerCase().includes(q) ||
        row.taskTitle.toLowerCase().includes(q);

      const matchesProject =
        projectFilter === "Project" || row.project === projectFilter;

      const matchesAgent = agentFilter === "Agent" || row.agent === agentFilter;

      const matchesStatus =
        statusFilter === "All" || row.failPass === statusFilter;

      return matchesSearch && matchesProject && matchesAgent && matchesStatus;
    });
  }, [query, projectFilter, agentFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto mt-3">
      <h1 className="text-sm font-medium text-[#E95D28] border-b border-b-orange-500 pb-1 inline-block">
        Test Report
      </h1>
      <p className="text-sm text-gray-600 mb-4 mt-3">
        Review and manage detailed reports of agent performance across projects.
      </p>

      {/* Search + Filters */}
      <div className="mb-4 relative max-w-[538px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by project, agent, or task"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-4">
        <select
          value={projectFilter}
          onChange={(e) => {
            setProjectFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={agentFilter}
          onChange={(e) => {
            setAgentFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {agents.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "Status" : s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th rowSpan={2} className="p-3 text-black text-left w-6">
                  Select
                </th>
                <th rowSpan={2} className="p-3 text-black text-left">
                  Project Name
                </th>
                <th rowSpan={2} className="p-3 text-black text-left">
                  Agent/Tester Assigned
                </th>
                <th rowSpan={2} className="p-3 text-black text-left min-w-[200px]">
                  Task/Test Case Title
                </th>
                <th colSpan={2} className="p-3 text-black text-center">
                  Result Status
                </th>
                <th rowSpan={2} className="p-3 text-black text-left">
                  Evidence
                </th>
                <th rowSpan={2} className="p-3 text-left min-w-[160px]">
                  Submission Time
                </th>
                <th rowSpan={2} className="p-3 text-black text-left min-w-[160px]">
                  Start Date/Time
                </th>
                <th rowSpan={2} className="p-3 text-black text-left min-w-[160px]">
                  End Date/Time
                </th>
                <th rowSpan={2} className="p-3 text-black text-left">
                  Actions
                </th>
              </tr>
              <tr className="">
                <th className="text-black text-sm font-medium min-w-[70px]">Fail / Pass</th>
                <th className="text-black text-sm font-medium min-w-[70px]">Access / No Access</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm text-center">
                    <input type="checkbox" />
                  </td>

                  <td className="p-3 text-sm font-medium">{row.testName}</td>
                  <td className="p-3 text-sm">{row.agent}</td>
                  <td className="p-3 text-sm text-gray-700">{row.taskTitle}</td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${row.failPass === "Pass"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                        }`}
                    >
                      {row.failPass}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${row.access === "Yes"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                        }`}
                    >
                      {row.access}
                    </span>
                  </td>

                  <td className="p-3 text-sm flex items-center gap-2 text-orange-600">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span className="underline cursor-pointer">
                      {row.evidence}
                    </span>
                  </td>

                  <td className="p-3 text-sm">{row.submissionTime}</td>
                  <td className="p-3 text-sm">{row.startTime}</td>
                  <td className="p-3 text-sm">{row.endTime}</td>

                  <td className="p-3 text-sm flex flex-col gap-1">
                    <button className="text-gray-700 font-semibold hover:underline">
                      View
                    </button>
                    <button className="text-gray-700 font-semibold hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {visibleRows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center text-gray-500 p-6 text-sm"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
