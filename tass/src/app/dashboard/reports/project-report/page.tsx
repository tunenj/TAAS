"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";

interface Task {
  agent: string;
  title: string;
  status: "Pass" | "Fail";
  access: boolean;
  evidence: string;
  submission: string;
  start: string;
  end: string;
}

interface ProjectGroup {
  project: string;
  progress: number;
  tasks: Task[];
}

interface ProgressBarProps {
  value: number;
}

// Progress Bar — percentage at the side
const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <div className="flex flex-col items-center gap-2 w-full">
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
    <span className="text-sm font-semibold text-gray-700">{value}%</span>
  </div>
);

interface ResultPillProps {
  status: "Pass" | "Fail";
}

const ResultPill: React.FC<ResultPillProps> = ({ status }) => (
  <span
    className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${status === "Pass"
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-red-100 text-red-700 border border-red-200"
      }`}
  >
    {status}
  </span>
);

export default function ReportTable() {
  const [query, setQuery] = useState(""); // search query
  const [projectFilter, setProjectFilter] = useState("Project"); // project filter
  const [agentFilter, setAgentFilter] = useState("Agent"); // agent filter
  const [statusFilter, setStatusFilter] = useState("Status"); // status filter

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Dummy arrays for filters
  const projects = ["Project", "ZIGI", "USSD"];
  const agents = [
    "Agent",
    "John Doe",
    "Jane Smith",
    "Michael Brown",
    "Nora White",
    "Samuel Lee",
    "Lisa Green",
  ];
  const statuses = ["Status", "Pass", "Fail"];

  const [visibleGrouped] = useState<ProjectGroup[]>([
    {
      project: "ZIGI",
      progress: 75,
      tasks: [
        {
          agent: "John Doe",
          title: "Verify Login Flow",
          status: "Pass",
          access: true,
          evidence: "Screenshot1.png",
          submission: "2025-11-10 10:45 AM",
          start: "2025-11-09 8:00 AM",
          end: "2025-11-10 10:45 AM",
        },
        {
          agent: "Jane Smith",
          title: "Check Registration Page",
          status: "Fail",
          access: false,
          evidence: "ErrorLog.txt",
          submission: "2025-11-10 11:15 AM",
          start: "2025-11-09 9:00 AM",
          end: "2025-11-10 11:15 AM",
        },
        {
          agent: "Michael Brown",
          title: "Password Reset Test",
          status: "Pass",
          access: true,
          evidence: "ResetFlow.png",
          submission: "2025-11-10 12:00 PM",
          start: "2025-11-09 10:00 AM",
          end: "2025-11-10 12:00 PM",
        },
        {
          agent: "Nora White",
          title: "API Response Verification",
          status: "Fail",
          access: false,
          evidence: "API_Fail.png",
          submission: "2025-11-10 1:00 PM",
          start: "2025-11-09 11:00 AM",
          end: "2025-11-10 1:00 PM",
        },
      ],
    },
    {
      project: "USSD",
      progress: 50,
      tasks: [
        {
          agent: "Samuel Lee",
          title: "Test Payment Gateway",
          status: "Pass",
          access: true,
          evidence: "Receipt.png",
          submission: "2025-11-11 3:20 PM",
          start: "2025-11-10 9:30 AM",
          end: "2025-11-11 3:20 PM",
        },
        {
          agent: "Lisa Green",
          title: "Validate Product UI",
          status: "Fail",
          access: false,
          evidence: "UI_Issue.png",
          submission: "2025-11-11 5:00 PM",
          start: "2025-11-10 10:00 AM",
          end: "2025-11-11 5:00 PM",
        },
        {
          agent: "Nora White",
          title: "API Response Verification",
          status: "Fail",
          access: false,
          evidence: "API_Fail.png",
          submission: "2025-11-10 1:00 PM",
          start: "2025-11-09 11:00 AM",
          end: "2025-11-10 1:00 PM",
        },
      ],
    },
  ]);

  // Flatten tasks for pagination
  const allTasks = visibleGrouped.flatMap((group) =>
    group.tasks.map((task) => ({ project: group.project, progress: group.progress, ...task }))
  );

  const totalPages = Math.ceil(allTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleTasks = allTasks.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto mt-3">
      <h1 className="text-sm font-medium text-[#E95D28] border-b border-b-orange-500 pb-1 inline-block">
        Project Report
      </h1>
      <p className="text-sm text-gray-600 mb-4 mt-3">
        Review and manage detailed reports of agent performance across projects.
      </p>

      {/* Search + Filters */}
      <div className="mb-4 relative max-w-[538px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by project, agent, or task"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-4">
        <select
          className="border rounded-md p-2 text-sm bg-white"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          className="border rounded-md p-2 text-sm bg-white"
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
        >
          {agents.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          className="border rounded-md p-2 text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 text-sm  text-gray-700">
          <tr>
            <th rowSpan={2} className="p-3 text-left w-6">Select</th>
            <th rowSpan={2} className="p-3 text-left">Project Name</th>
            <th rowSpan={2} className="p-3 text-left">Progress</th>
            <th rowSpan={2} className="p-3 text-left">Agent/Tester</th>
            <th rowSpan={2} className="p-3 text-left min-w-[200px]">Task/Case Title</th>
            <th colSpan={2} className="p-3 text-center">Result Status</th>
            <th rowSpan={2} className="p-3 text-left">Evidence</th>
            <th rowSpan={2} className="p-3 text-left min-w-[160px]">Submission Time</th>
            <th rowSpan={2} className="p-3 text-left min-w-[160px]">Start Date/Time</th>
            <th rowSpan={2} className="p-3 text-left min-w-[160px]">End Date/Time</th>
            <th rowSpan={2} className="p-3 text-left">Actions</th>
          </tr>
          <tr className="">
            <th className="text-black text-sm font-medium min-w-[70px]">Fail / Pass</th>
            <th className="text-black text-sm font-medium min-w-[70px]">Access / No Access</th>
          </tr>
        </thead>

        <tbody>
          {visibleTasks.length === 0 ? (
            <tr>
              <td colSpan={12} className="p-6 text-center text-gray-500">
                No results found
              </td>
            </tr>
          ) : (
            visibleTasks.map((task, idx) => (
              <tr key={`${task.project}-${task.agent}-${idx}`} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-center">
                  <input type="checkbox" />
                </td>
                <td className="p-3 font-semibold text-sm  text-gray-800">{task.project}</td>
                <td className="p-3"><ProgressBar value={task.progress} /></td>
                <td className="p-3 text-sm">{task.agent}</td>
                <td className="p-3 text-sm text-gray-700">{task.title}</td>
                <td className="p-3 text-center"><ResultPill status={task.status} /></td>
                <td className="p-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${task.access
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                  >
                    {task.access ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3 text-sm text-orange-500 cursor-pointer">{task.evidence}</td>
                <td className="p-3 text-sm">{task.submission}</td>
                <td className="p-3 text-sm">{task.start}</td>
                <td className="p-3 text-sm">{task.end}</td>
                <td className="p-3 text-sm flex flex-col gap-1">
                  <button className="text-gray-700 font-semibold hover:underline">View</button>
                  <button className="text-gray-700 font-semibold hover:underline">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
