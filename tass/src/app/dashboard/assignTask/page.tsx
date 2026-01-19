'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Pagination from "@/components/Pagination/Pagination";
import AgentAssignModal from "@/components/AgentListModal/AgentListModal";
import { useAuth } from "@/app/hooks/useAuth";
import toast from "react-hot-toast";

type Task = {
  id: number;
  taskId: string;
  title: string;
  testCases: string[];
  status1: string[];
  status2: string[];
  start: string;
  end: string;
  project: string;
  location: string;
  priority: string;
  type: string;
  environment: string;
  status: string;
};

const PAGE_SIZE = 6;

export default function AssignTaskPage() {
  const pathname = usePathname();
  const { BASE_URL, accessToken } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch tasks safely
  useEffect(() => {
    const fetchTasks = async () => {
      if (!BASE_URL || !accessToken) return;
      setLoading(true);

      try {
        const projectRes = await fetch(`${BASE_URL}/projects/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!projectRes.ok) throw new Error("Failed to fetch projects");
        const projectData = await projectRes.json();
        const projectList = Array.isArray(projectData.results) ? projectData.results : [];

        const allTasks: Task[] = [];
        for (const project of projectList) {
          const taskRes = await fetch(`${BASE_URL}/projects/${project.project_id}/tasks/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!taskRes.ok) continue;

          const taskData = await taskRes.json();
          const taskList = Array.isArray(taskData.results) ? taskData.results : [];

          taskList.forEach((t: any) => {
            const testCases = t.description?.split(/\r?\n/).filter(Boolean) || [];
            const status1 = testCases.map(() => (t.is_completed ? "Yes" : "No"));
            const status2 = testCases.map(() => (t.status === "open" ? "Pass" : "Fail"));

            allTasks.push({
              id: allTasks.length + 1,
              taskId: t.task_id,
              title: t.title || "Untitled Task",
              testCases,
              status1,
              status2,
              start: t.start_datetime || "",
              end: t.end_datetime || "",
              project: project.name || "",
              location: t.location || t.task_location || "All",
              priority: t.priority || "Medium",
              type: t.task_type || "Functional",
              environment: t.environment || "N/A",
              status: t.status || "Open",
            });
          });
        }

        setTasks(allTasks);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [BASE_URL, accessToken]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? currentTasks.map((t) => t.id) : []);
  };

  const handleSelect = (id: number) => {
    setSelected(selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]);
  };

  const updateStatus1 = (taskId: number, caseIndex: number, value: "Yes" | "No") => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status1: t.status1.map((s, i) => (i === caseIndex ? value : s)) } : t
      )
    );
  };

  const updateStatus2 = (taskId: number, caseIndex: number, value: "Pass" | "Fail") => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status2: t.status2.map((s, i) => (i === caseIndex ? value : s)) } : t
      )
    );
  };

  const btnClass = (active: boolean, color = "green") =>
    `${active ? (color === "green" ? "bg-green-600 text-white" : "bg-red-600 text-white") : "bg-white text-gray-700 border"} inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full border`;

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return toast.error("No task selected");
    if (!BASE_URL || !accessToken) return toast.error("Missing API credentials");

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selected.length} selected task(s)?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const tasksToDelete = tasks.filter((t) => selected.includes(t.id));
      let successCount = 0;

      for (const task of tasksToDelete) {
        try {
          const res = await fetch(`${BASE_URL}/projects/tasks/${task.taskId}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) successCount++;
        } catch { }
      }

      setTasks((prev) => prev.filter((t) => !selected.includes(t.id)));
      setSelected([]);
      toast.success(`${successCount} task(s) deleted successfully`);
    } catch {
      toast.error("Failed to delete tasks");
    } finally {
      setLoading(false);
    }
  };


 const handleAssignTasks = async (userIds: string[]) => {
  if (selected.length === 0) return toast.error("No task selected");
  if (userIds.length === 0) return toast.error("No agents selected");

  try {
    setLoading(true);
    const successfulTasks: number[] = [];

    for (const taskLocalId of selected) {
      const task = tasks.find((t) => t.id === taskLocalId);
      if (!task) continue;

      const response = await fetch(
        `${BASE_URL}/projects/tasks/${task.taskId}/assign/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_ids: userIds }), 
        }
      );

      if (response.ok) {
        successfulTasks.push(taskLocalId);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(`Failed: ${task.title} – ${errorData.message || "Unknown error"}`);
      }
    }

    if (successfulTasks.length > 0) {
      toast.success(`Assigned ${successfulTasks.length} task(s) successfully!`);
      setTasks(prev => prev.map(t => successfulTasks.includes(t.id) ? { ...t, status: "Assigned" } : t));
      setSelected([]);
    }

    setShowModal(false);
  } catch (err) {
    toast.error("Network error during assignment");
  } finally {
    setLoading(false);
  }
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
              className={`px-3 sm:px-4 py-2 font-medium ${isActive ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 hover:text-orange-500"
                }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Top Buttons */}
      <div className="flex justify-end items-center gap-3 mb-4">
        <button className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
          <Link href="/dashboard/createTask">New Task</Link>
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
          <button
            onClick={() => setShowModal(true)}
            disabled={selected.length === 0 || loading}
            className={`px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm ${selected.length === 0 || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            Assign selected ({selected.length})
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selected.length === 0 || loading}
            className={`px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm ${selected.length === 0 || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
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
                  disabled={loading}
                />
              </th>
              <th className="p-2">S/N</th>
              <th className="p-2">Task ID</th>
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
                  <input
                    type="checkbox"
                    checked={selected.includes(task.id)}
                    onChange={() => handleSelect(task.id)}
                    disabled={loading}
                  />
                </td>
                <td className="p-2">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td className="p-2">{task.taskId}</td>
                <td className="p-2 font-medium">{task.title}</td>
                <td className="p-2 min-w-[450px]">
                  <ul className="space-y-1">
                    {task.testCases.map((c, i) => (
                      <li key={i} className="max-w-2xl break-words whitespace-pre-wrap leading-tight">
                        {c}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2">
                  {task.testCases.map((_, i) => (
                    <div key={i} className="flex gap-1 mb-2">
                      <button
                        type="button"
                        onClick={() => updateStatus1(task.id, i, "Yes")}
                        className={btnClass(task.status1[i] === "Yes", "green")}
                        disabled={loading}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus1(task.id, i, "No")}
                        className={btnClass(task.status1[i] === "No", "red")}
                        disabled={loading}
                      >
                        No
                      </button>
                    </div>
                  ))}
                </td>
                <td className="p-2">
                  {task.testCases.map((_, i) => (
                    <div key={i} className="flex gap-1 mb-2">
                      <button
                        type="button"
                        onClick={() => updateStatus2(task.id, i, "Pass")}
                        className={btnClass(task.status2[i] === "Pass", "green")}
                        disabled={loading}
                      >
                        Pass
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus2(task.id, i, "Fail")}
                        className={btnClass(task.status2[i] === "Fail", "red")}
                        disabled={loading}
                      >
                        Fail
                      </button>
                    </div>
                  ))}
                </td>
                <td className="p-2">{task.start}</td>
                <td className="p-2">{task.end}</td>
                <td className="p-2">{task.project}</td>
                <td className="p-2">{task.location}</td>
                <td className="p-2">{task.priority}</td>
                <td className="p-2">{task.type}</td>
                <td className="p-2">{task.environment}</td>
                <td className="p-2">
                  <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${task.status === "Assigned"
                      ? "border-blue-500 text-blue-500 bg-blue-50"
                      : task.status === "Completed"
                        ? "border-green-500 text-green-500 bg-green-50"
                        : "border-green-500 text-green-500 bg-white"
                    }`}>
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
      {showModal && (
        <AgentAssignModal
          onClose={() => setShowModal(false)}
          onAssign={handleAssignTasks}  // ← TypeScript now happy: number[] → number[]
        />
      )}
    </main>
  );
}