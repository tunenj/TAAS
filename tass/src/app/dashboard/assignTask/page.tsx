"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Pagination from "@/components/Pagination/Pagination";
import AgentAssignModal from "@/components/AgentListModal/AgentListModal";

type Task = {
  id: number;
  taskId: string;
  title: string;
  testCases: string[];
  status1: string[]; // Yes/No
  status2: string[]; // Pass/Fail
  start: string;
  end: string;
  project: string;
  location: string;
  priority: string;
  type: string;
  environment: string;
  status: string;
};

const tasks: Task[] = [
  {
    id: 1,
    taskId: "TSK-001",
    title: "Landing Page",
    testCases: [
      "Verify login via MTN chatbot assistant",
      "Start Now Connection",
      "Messenger icon redirects to Chat",
      "Telegram icon redirects",
      "myMTNApp icon redirects",
    ],
    status1: ["Yes", "Yes", "Yes", "No", "Yes"],
    status2: ["Pass", "Pass", "Fail", "Fail", "Pass"],
    start: "2025-07-30 8:00AM",
    end: "2025-08-30 10:00PM",
    project: "ZOI Audit",
    location: "All",
    priority: "High",
    type: "Functionality",
    environment: "Chrome",
    status: "Open",
  },
  {
    id: 2,
    taskId: "TSK-002",
    title: "Ability to link USSD menu",
    testCases: [
      "Access to service",
      "My Tools",
      "My Number",
      "2Way account balance",
      "2Way postpaid balance",
    ],
    status1: ["Yes", "No", "Yes", "Yes", "No"],
    status2: ["Pass", "Fail", "Pass", "Pass", "Fail"],
    start: "2025-07-30 8:00AM",
    end: "2025-08-30 10:00PM",
    project: "USSD Audit",
    location: "All",
    priority: "High",
    type: "Functionality",
    environment: "Chrome",
    status: "Open",
  },
  {
    id: 3,
    taskId: "TSK-003",
    title: "User Profile Page",
    testCases: [
      "Verify user data loading",
      "Check edit functionality",
      "Verify logout process",
      "Profile picture upload",
      "Change password",
    ],
    status1: ["Yes", "Yes", "No", "Yes", "No"],
    status2: ["Pass", "Pass", "Pass", "Fail", "Fail"],
    start: "2025-07-30 8:00AM",
    end: "2025-08-30 10:00PM",
    project: "User Management",
    location: "All",
    priority: "Medium",
    type: "Functionality",
    environment: "Firefox",
    status: "In Progress",
  },
  {
    id: 4,
    taskId: "TSK-004",
    title: "Payment Gateway Integration",
    testCases: [
      "Verify payment processing",
      "Check payment confirmation",
      "Refund process",
      "Transaction history",
      "Payment method updates",
    ],
    status1: ["No", "Yes", "No", "Yes", "Yes"],
    status2: ["Fail", "Pass", "Fail", "Pass", "Pass"],
    start: "2025-07-30 8:00AM",
    end: "2025-08-30 10:00PM",
    project: "Payment Integration",
    location: "All",
    priority: "High",
    type: "Functionality",
    environment: "Chrome",
    status: "Open",
  },
  {
    id: 5,
    taskId: "TSK-005",
    title: "Landing Page Redesign",
    testCases: [
      "Verify new design layout",
      "Check responsiveness",
      "Image loading times",
      "SEO performance",
      "Browser compatibility",
    ],
    status1: ["Yes", "Yes", "No", "Yes", "Yes"],
    status2: ["Pass", "Pass", "Fail", "Pass", "Pass"],
    start: "2025-07-30 8:00AM",
    end: "2025-08-30 10:00PM",
    project: "Marketing",
    location: "All",
    priority: "Medium",
    type: "Design",
    environment: "Chrome",
    status: "Open",
  },
  {
    id: 6,
    taskId: "TSK-006",
    title: "API Endpoint Testing",
    testCases: [
      "Verify GET requests",
      "Check POST requests",
      "Handle error responses",
      "Validate data format",
      "Test rate limiting",
    ],
    status1: ["Yes", "No", "Yes", "Yes", "Yes"],
    status2: ["Pass", "Fail", "Pass", "Pass", "Pass"],
    start: "2025-07-30 8:00AM",
    end: "2025-08-30 10:00PM",
    project: "API Development",
    location: "All",
    priority: "High",
    type: "Functionality",
    environment: "Postman",
    status: "Open",
  },
];

const PAGE_SIZE = 5;

export default function AssignTaskPage() {
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const currentTasks = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs = [
    { name: "Create Task", href: "/dashboard/createTask" },
    { name: "Assign Task", href: "/dashboard/assignTask" },
    { name: "Assigned Task", href: "/dashboard/assignedTask" },
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? currentTasks.map((t) => t.id) : []);
  };

  const handleSelect = (id: number) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };

  // For status1 ("Yes"/"No") and status2 ("Pass"/"Fail")
  const renderTag = (type: "status1" | "status2", label: string) => {
    let color = "";
    let text = label;
    if (type === "status1") {
      color =
        label === "Yes"
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300";
    } else {
      color =
        label === "Pass"
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300";
    }
    return (
      <span
        key={`${type}-${label}-${Math.random()}`}
        className={`text-xs border px-2 py-0.5 rounded-full font-medium inline-block my-0.5 ${color}`}
      >
        {text}
      </span>
    );
  };

  return (
    <main className="flex flex-col px-4 sm:px-6 md:px-8 py-8 mt-2 p-6 -ml-10">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 text-sm gap-2 sm:gap-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`px-3 sm:px-4 py-2 font-medium ${
                isActive
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-orange-500"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Top Right Buttons */}
      <div className="flex justify-end items-center gap-3 mb-4">
        <button className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
          Upload Test Script
        </button>
        <button className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
          New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <select className="border border-gray-300 rounded-2xl px-2 py-1 text-sm">
            <option>Filter: Active</option>
            <option>Filter: Inactive</option>
          </select>
          <select className="border border-gray-300 rounded-2xl px-2 py-1 text-sm">
            <option>Sort: Progress</option>
            <option>Sort: Priority</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <button className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
            View selected
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm"
          >
            Assign selected to agents
          </button>
          <button className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
            Delete selected
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="p-2 w-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selected.length === currentTasks.length &&
                    currentTasks.length > 0
                  }
                />
              </th>
              <th className="p-2">S/N</th>
              <th className="p-2">Task ID</th>
              <th className="p-2">Test Title</th>
              <th className="p-2">Test Cases</th>
              <th className="p-2">Status 1</th>
              <th className="p-2">Status 2</th>
              <th className="p-2">Start Date/Time</th>
              <th className="p-2">End Date/Time</th>
              <th className="p-2">Projects</th>
              <th className="p-2">Location</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Task Type</th>
              <th className="p-2">Environment</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task, idx) => (
              <tr
                key={task.id}
                className="border-b border-gray-200 hover:bg-orange-50/40 align-top"
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(task.id)}
                    onChange={() => handleSelect(task.id)}
                  />
                </td>
                <td className="p-2 text-gray-800">
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </td>
                <td className="p-2">{task.taskId}</td>
                <td className="p-2 font-medium text-gray-900">{task.title}</td>
                <td className="p-2">
                  <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                    {task.testCases.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-2">
                  {task.status1.map((s, i) => renderTag("status1", s))}
                </td>
                <td className="p-2">
                  {task.status2.map((s, i) => renderTag("status2", s))}
                </td>
                <td className="p-2">{task.start}</td>
                <td className="p-2">{task.end}</td>
                <td className="p-2">{task.project}</td>
                <td className="p-2">{task.location}</td>
                <td className="p-2">{task.priority}</td>
                <td className="p-2">{task.type}</td>
                <td className="p-2">{task.environment}</td>
                <td className="p-2">
                  <span className="px-3 py-1 rounded-full border border-orange-400 text-orange-500 bg-white text-xs font-semibold">
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6">
        <Pagination
          totalPages={totalPages}
          initialPage={page}
          onPageChange={setPage}
        />
      </div>

      {/* Modal */}
      {showModal && <AgentAssignModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
