'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Pagination from "@/components/Pagination/Pagination";
import { User, Upload } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import toast from "react-hot-toast";

// Define types based on the API response
interface ApiTask {
  task_id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  start_datetime: string;
  end_datetime: string;
  task_type: string;
  environment: string;
  is_assigned: boolean;
  assigned_users: string[];
  test_cases: any[];
  expected_test_cases: any[];
  project: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiTask[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
  location?: string;
}

interface Task {
  id: number;
  taskId: string;
  title: string;
  description: string;
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
  isAssigned: boolean;
  assignedAgents?: Agent[];
  isCompleted: boolean;
  assignedUserIds: string[];
}

const PAGE_SIZE = 6;

// Helper function to extract test cases from description
const extractTestCases = (description: string): string[] => {
  if (!description) return [];
  
  // Split by newlines and filter out empty lines
  const lines = description.split(/\r?\n/).filter(line => line.trim() !== '');
  
  // For simplicity, we'll return the first 5 lines or all lines if less than 5
  return lines.slice(0, 5);
};

// Helper function to format date
const formatDateTime = (datetime: string): string => {
  if (!datetime) return "";
  try {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return datetime;
  }
};

export default function AssignTaskPage() {
  const pathname = usePathname();
  const { BASE_URL, accessToken } = useAuth();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string>("");
  const [projectList, setProjectList] = useState<Array<{project_id: string, name: string}>>([]);

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const currentTasks = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs = [
    { name: "Create Task", href: "/dashboard/createTask" },
    { name: "Assign Task", href: "/dashboard/assignTask" },
    { name: "Assigned Task", href: "/dashboard/assignedTask" },
  ];

  // Fetch projects first
  useEffect(() => {
    const fetchProjects = async () => {
      if (!BASE_URL || !accessToken) return;
      
      try {
        const projectRes = await fetch(`${BASE_URL}/projects/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!projectRes.ok) throw new Error("Failed to fetch projects");
        const projectData = await projectRes.json();
        
        if (projectData.results && Array.isArray(projectData.results)) {
          setProjectList(projectData.results);
          if (projectData.results.length > 0) {
            setProjectId(projectData.results[0].project_id);
          }
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, [BASE_URL, accessToken]);

  // Fetch tasks for the selected project
  useEffect(() => {
    const fetchTasks = async () => {
      if (!BASE_URL || !accessToken || !projectId) return;
      setLoading(true);

      try {
        // Fetch tasks for the selected project
        const taskRes = await fetch(`${BASE_URL}/projects/${projectId}/tasks/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!taskRes.ok) {
          throw new Error(`Failed to fetch tasks: ${taskRes.status}`);
        }

        const taskData: ApiResponse = await taskRes.json();
        
        // Convert API tasks to our Task format
        const formattedTasks: Task[] = taskData.results.map((apiTask, index) => {
          const testCases = extractTestCases(apiTask.description);
          
          // Determine priority based on due date
          const now = new Date();
          const endDate = new Date(apiTask.end_datetime);
          const daysUntilDue = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          let priority = "Medium";
          if (daysUntilDue <= 1) priority = "High";
          if (daysUntilDue >= 7) priority = "Low";

          // Determine status
          let status = apiTask.status;
          if (apiTask.is_completed) {
            status = "Completed";
          } else if (apiTask.is_assigned && apiTask.status === "open") {
            status = "Assigned";
          }

          return {
            id: index + 1,
            taskId: apiTask.task_id,
            title: apiTask.title,
            description: apiTask.description,
            testCases,
            status1: testCases.map(() => ""), // Initialize empty status1
            status2: testCases.map(() => ""), // Initialize empty status2
            start: formatDateTime(apiTask.start_datetime),
            end: formatDateTime(apiTask.end_datetime),
            project: apiTask.project,
            location: apiTask.location,
            priority,
            type: apiTask.task_type,
            environment: apiTask.environment,
            status,
            isAssigned: apiTask.is_assigned,
            isCompleted: apiTask.is_completed,
            assignedUserIds: apiTask.assigned_users || []
          };
        });

        setTasks(formattedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [BASE_URL, accessToken, projectId]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? currentTasks.map((t) => t.id) : []);
  };

  const handleSelect = (id: number) => {
    setSelected(selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]);
  };

  const updateStatus1 = (taskId: number, caseIndex: number, value: "Yes" | "No") => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status1: t.status1.map((s, i) => (i === caseIndex ? value : s)) }
          : t
      )
    );
  };

  const updateStatus2 = (taskId: number, caseIndex: number, value: "Pass" | "Fail") => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status2: t.status2.map((s, i) => (i === caseIndex ? value : s)) }
          : t
      )
    );
  };

  const btnClass = (active: boolean, variant: "green" | "red") =>
    `${active
      ? variant === "green"
        ? "bg-green-600 text-white border-green-600"
        : "bg-red-600 text-white border-red-600"
      : "bg-white text-gray-700 border-gray-300"
    } inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full border`;

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

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectId(e.target.value);
    setPage(1); // Reset to first page when changing project
  };

  return (
    <main className="flex flex-col px-4 sm:px-6 md:px-8 py-8 mt-2 p-6 -ml-6">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 text-sm gap-2 sm:gap-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`px-3 sm:px-4 py-2 font-medium ${isActive
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-orange-500"
                }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Top Right Buttons
      <div className="flex justify-end items-center gap-3 mb-4">
        <button className="px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm">
          <Link href="/dashboard/createTask">New Task</Link>
        </button>
      </div> */}

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
          {/* <button
            onClick={() => setShowModal(true)}
            disabled={selected.length === 0 || loading}
            className={`px-4 py-1 rounded-2xl border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 text-sm ${selected.length === 0 || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            Assign selected ({selected.length})
          </button> */}
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
              <th className="p-2">Project</th>
              <th className="p-2">Location</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Test Type</th>
              <th className="p-2">Environment</th>
              <th className="p-2">Status</th>
              <th className="p-2 min-w-[150px]">Assigned Users</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={16} className="p-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-600">Loading tasks...</span>
                  </div>
                </td>
              </tr>
            ) : currentTasks.length === 0 ? (
              <tr>
                <td colSpan={16} className="p-8 text-center text-gray-500">
                  {projectId ? "No tasks found for this project." : "Please select a project to view tasks."}
                </td>
              </tr>
            ) : (
              currentTasks.map((task, idx) => (
                <tr key={task.id} className="border-b border-gray-200 hover:bg-orange-50/40 align-top">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(task.id)}
                      onChange={() => handleSelect(task.id)}
                      disabled={loading}
                    />
                  </td>

                  <td className="p-2 text-gray-800">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="p-2 font-mono">{task.taskId}</td>
                  <td className="p-2 font-medium text-gray-900">{task.title}</td>

                  <td className="p-2 align-top min-w-[400px]">
                    <ul className="space-y-1 text-gray-700">
                      {task.testCases.length > 0 ? (
                        task.testCases.map((c, i) => (
                          <li key={i} className="max-w-3xl break-words whitespace-pre-wrap leading-tight">
                            {c}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">No test cases extracted</li>
                      )}
                    </ul>
                  </td>

                  <td className="p-2 align-top">
                    <div className="flex flex-col">
                      {task.testCases.map((_, i) => (
                        <div key={i} className="flex gap-1 mb-1">
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
                    </div>
                  </td>

                  <td className="p-2 align-top">
                    <div className="flex flex-col">
                      {task.testCases.map((_, i) => (
                        <div key={i} className="flex gap-1 mb-1">
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
                    </div>
                  </td>

                  <td className="p-2 text-gray-600">{task.start}</td>
                  <td className="p-2 text-gray-600">{task.end}</td>
                  <td className="p-2">{task.project}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{task.location}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === "High" ? "bg-red-100 text-red-700" :
                      task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-2 capitalize">{task.type}</td>
                  <td className="p-2 capitalize">{task.environment}</td>
                  <td className="p-2">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${task.status === "Assigned"
                        ? "border-blue-500 text-blue-500 bg-blue-50"
                        : task.status === "Completed"
                          ? "border-green-500 text-green-500 bg-green-50"
                          : task.status === "Open"
                            ? "border-green-500 text-green-500 bg-white"
                            : "border-gray-500 text-gray-500 bg-gray-50"
                      }`}>
                      {task.status}
                    </span>
                  </td>

                  {/* Assigned Users column */}
                  <td className="p-2 min-w-[150px]">
                    {task.assignedUserIds && task.assignedUserIds.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {task.assignedUserIds.slice(0, 2).map((userId, i) => (
                          <div
                            key={i}
                            className="flex items-center text-xs px-2 py-1 rounded-md bg-gray-100 border border-gray-200 text-gray-700"
                          >
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <div className="leading-tight truncate">
                              <p className="font-medium truncate">User ID: {userId.substring(0, 8)}...</p>
                              <p className="text-gray-500 text-[11px] truncate">{userId}</p>
                            </div>
                          </div>
                        ))}
                        {task.assignedUserIds.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{task.assignedUserIds.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {tasks.length > 0 && (
        <div className="flex justify-end items-center mt-6">
          <Pagination totalPages={totalPages} initialPage={page} onPageChange={setPage} />
        </div>
      )}
    </main>
  );
}