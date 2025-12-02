'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Pagination from "@/components/Pagination/Pagination";
import AgentAssignModal from "@/components/AgentListModal/AgentListModal";
import { Upload } from "lucide-react";

type Task = {
  id: number;
  taskId: string;
  title: string;
  testCases: string[];
  status1: string[]; // Yes/No per test case
  status2: string[]; // Pass/Fail per test case
  start: string;
  end: string;
  project: string;
  location: string;
  priority: string;
  type: string;
  environment: string;
  status: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    taskId: "TSK-001",
    title: "Landing Page",
    testCases: [
      "Verify the URL path of the voice assistant landing page",
      "Verify login via MTN chatbot assistant",
      "Start Now Connection",
      "Messenger icon redirects to Chat",
      "Telegram icon redirects",
    ],
    status1: ["Yes", "Yes", "Yes", "No", "Yes"],
    status2: ["Pass", "Pass", "Pass", "Fail", "Pass"],
    start: "2025-07-30 08:00",
    end: "2025-08-30 22:00",
    project: "ZIGI Audit",
    location: "All",
    priority: "High",
    type: "Functional",
    environment: "Chrome",
    status: "Open",
  },
  {
    id: 2,
    taskId: "TSK-002",
    title: "USSD Link",
    testCases: [
      "Access to service",
      "My Tools flow",
      "My Number validation",
      "2Way account balance",
      "2Way postpaid balance",
    ],
    status1: ["Yes", "No", "Yes", "Yes", "No"],
    status2: ["Pass", "Fail", "Pass", "Pass", "Fail"],
    start: "2025-07-31 08:00",
    end: "2025-08-31 22:00",
    project: "USSD Audit",
    location: "All",
    priority: "High",
    type: "Functional",
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
    start: "2025-07-30 08:00",
    end: "2025-09-01 22:00",
    project: "User Management",
    location: "All",
    priority: "Medium",
    type: "Functional",
    environment: "Firefox",
    status: "Open",
  },
  {
    id: 4,
    taskId: "TSK-004",
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
    start: "2025-07-30 08:00",
    end: "2025-09-01 22:00",
    project: "ZIGI Audit",
    location: "All",
    priority: "Medium",
    type: "Functional",
    environment: "Firefox",
    status: "Open",
  },
  {
    id: 5,
    taskId: "TSK-005",
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
    start: "2025-07-30 08:00",
    end: "2025-09-01 22:00",
    project: "USSD Audit",
    location: "All",
    priority: "Medium",
    type: "Functional",
    environment: "Firefox",
    status: "Open",
  },
  {
    id: 6,
    taskId: "TSK-006",
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
    start: "2025-07-30 08:00",
    end: "2025-09-01 22:00",
    project: "USSD Audit",
    location: "All",
    priority: "Medium",
    type: "Functional",
    environment: "Firefox",
    status: "Open",
  },
];

const PAGE_SIZE = 6;

export default function AssignTaskPage() {
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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
    setSelected(selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]);
  };

  // update handlers for inline controls
  const updateStatus1 = (taskId: number, caseIndex: number, value: "Yes" | "No") => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status1: t.status1.map((s, i) => (i === caseIndex ? value : s)) } : t
      )
    );
  };

  const updateStatus2 = (taskId: number, caseIndex: number, value: "Pass" | "Fail") => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status2: t.status2.map((s, i) => (i === caseIndex ? value : s)) } : t
      )
    );
  };

  // small helper to style selected option button
  const btnClass = (active: boolean, color = "green") =>
    `${active ? (color === "green" ? "bg-green-600 text-white" : "bg-red-600 text-white") : "bg-white text-gray-700 border"} inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full border`;

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
              className={`px-3 sm:px-4 py-2 font-medium ${isActive ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 hover:text-orange-500"}`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Top Right Buttons */}
      <div className="flex justify-end items-center gap-3 mb-4">
        <button className="flex items-center gap-2 px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
          <Upload size={18} />
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
          <button onClick={() => setShowModal(true)} className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
            Assign selected to agents
          </button>
          <button className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
            Delete selected
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700 align-top">
              <th className="p-2 w-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selected.length === currentTasks.length && currentTasks.length > 0}
                />
              </th>
              <th className="p-2">S/N</th>
              <th className="p-2 min-w-[100px]">Task ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Test Cases</th>
              <th className="p-2">Status 1</th>
              <th className="p-2">Status 2</th>
              <th className="p-2">Start Date/Time</th>
              <th className="p-2">End Date/Time</th>
              <th className="p-2">Projects</th>
              <th className="p-2">Location</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Test Type</th>
              <th className="p-2">Environment</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task, idx) => (
              <tr key={task.id} className="border-b border-gray-200 hover:bg-orange-50/40 align-top">
                <td className="p-2">
                  <input type="checkbox" checked={selected.includes(task.id)} onChange={() => handleSelect(task.id)} />
                </td>

                <td className="p-2 text-gray-800">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td className="p-2">{task.taskId}</td>
                <td className="p-2 font-medium text-gray-900">{task.title}</td>

                {/* Test cases: wider column, longer lines */}
                <td className="p-2 align-top min-w-[450px]">
                  <ul className="space-y-1 text-gray-700">
                    {task.testCases.map((c, i) => (
                      <li key={i} className="max-w-2xl break-words">
                        {c}
                      </li>
                    ))}
                  </ul>
                </td>

                {/* Status1: Yes/No as side-by-side buttons per test case */}
                <td className="p-2 align-top">
                  <div className="flex flex-col">
                    {task.status1.map((s, i) => (
                      <div key={i} className="flex gap-1 mb-1">
                        <button
                          type="button"
                          onClick={() => updateStatus1(task.id, i, "Yes")}
                          className={btnClass(s === "Yes", "green")}
                          aria-label={`Status1 ${i} Yes`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus1(task.id, i, "No")}
                          className={btnClass(s === "No", "red")}
                          aria-label={`Status1 ${i} No`}
                        >
                          No
                        </button>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Status2: Pass/Fail as side-by-side buttons per test case */}
                <td className="p-2 align-top">
                  <div className="flex flex-col">
                    {task.status2.map((s, i) => (
                      <div key={i} className="flex gap-1 mb-1">
                        <button
                          type="button"
                          onClick={() => updateStatus2(task.id, i, "Pass")}
                          className={btnClass(s === "Pass", "green")}
                          aria-label={`Status2 ${i} Pass`}
                        >
                          Pass
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus2(task.id, i, "Fail")}
                          className={btnClass(s === "Fail", "red")}
                          aria-label={`Status2 ${i} Fail`}
                        >
                          Fail
                        </button>
                      </div>
                    ))}
                  </div>
                </td>

                <td className="p-2">{task.start}</td>
                <td className="p-2">{task.end}</td>
                <td className="p-2">{task.project}</td>
                <td className="p-2">{task.location}</td>
                <td className="p-2">{task.priority}</td>
                <td className="p-2">{task.type}</td>
                <td className="p-2">{task.environment}</td>
                <td className="p-2">
                  <span className="px-3 py-1 rounded-full border border-green-500 text-green-500 bg-white text-xs font-semibold">
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
        <Pagination totalPages={totalPages} initialPage={page} onPageChange={setPage} />
      </div>

      {/* Modal */}
      {showModal && <AgentAssignModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
