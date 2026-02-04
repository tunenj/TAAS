'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination/Pagination';
import { useAuth } from '@/app/hooks/useAuth';

/* ================= TYPES ================= */

interface TaskCase {
  id: number;
  test_case_id: number;
  name: string;
  description: string;
  status: 'pass' | 'fail';
  has_access: boolean;
  date: string;
  evidence: string | null;
  note: string;
}

interface Task {
  id: number;
  task_id: number;
  projectName: string;
  taskTitle: string;
  agentsAssigned: string[];
  cases: TaskCase[];
}

interface ApiSubmission {
  id: number;
  task: {
    id: number;
    title: string;
    project: {
      name: string;
    };
  };
  test_case_results: Array<{
    id: number;
    test_case: {
      id: number;
      description: string;
    };
    result: 'pass' | 'fail';
    has_access: boolean;
    submitted_at: string;
    evidence: string | null;
    note: string;
  }>;
  assigned_agents: Array<{
    id: number;
    full_name: string;
  }>;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiSubmission[];
}

const PAGE_SIZE = 2; // show 2 tasks per page

/* ================= COMPONENT ================= */

const TaskValidationTable = () => {
  const router = useRouter();
  const { BASE_URL, accessToken } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [validatingTaskId, setValidatingTaskId] = useState<number | null>(null);
  const [selectedTaskCases, setSelectedTaskCases] = useState<{ [taskId: number]: number[] }>({});
  const [remarks, setRemarks] = useState<{ [taskId: number]: string }>({});

  /* ================= FETCH SUBMISSIONS ================= */

  useEffect(() => {
    if (!accessToken) return;

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BASE_URL}/projects/tasks/admin/submissions/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch submissions');
        }

        const result = await res.json();
        console.log('API Response:', result);

        // Handle different response structures
        let submissions = [];
        
        if (result.success && result.data) {
          submissions = result.data;
        } else if (Array.isArray(result)) {
          submissions = result;
        } else if (result.data && Array.isArray(result.data)) {
          submissions = result.data;
        } else {
          console.error('Unexpected API response structure:', result);
          throw new Error('Unexpected API response structure');
        }

        if (!Array.isArray(submissions) || submissions.length === 0) {
          setTasks([]);
          return;
        }

        console.log('Submissions:', submissions);

        // Transform API data to match component structure
        const transformedTasks: Task[] = submissions.map((submission) => {
          // Log each submission to identify structure issues
          console.log('Processing submission:', submission);

          return {
            id: submission.id || submission.submission_id || 0,
            task_id: submission.task?.id || submission.task_id || 0,
            projectName: submission.task?.project?.name || submission.project_name || 'Unknown Project',
            taskTitle: submission.task?.title || submission.task_title || 'Unknown Task',
            agentsAssigned: submission.assigned_agents?.map((agent: any) => 
              agent.full_name || agent.name || `Agent ${agent.id}`
            ) || ['No agents assigned'],
            cases: (submission.test_case_results || submission.test_cases || []).map((result: any) => ({
              id: result.id || result.test_case_result_id || 0,
              test_case_id: result.test_case?.id || result.test_case_id || 0,
              name: result.test_case?.description || result.description || result.name || 'Unnamed test case',
              description: result.test_case?.description || result.description || result.name || 'No description',
              status: result.result || result.status || 'fail',
              has_access: result.has_access !== undefined ? result.has_access : true,
              date: result.submitted_at 
                ? new Date(result.submitted_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : 'N/A',
              evidence: result.evidence || null,
              note: result.note || '',
            })),
          };
        });

        console.log('Transformed tasks:', transformedTasks);
        setTasks(transformedTasks);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [accessToken, BASE_URL]);

  /* ================= HANDLE CHECKBOX SELECTION ================= */

  const handleCaseSelection = (taskId: number, caseId: number, checked: boolean) => {
    setSelectedTaskCases((prev) => {
      const currentSelections = prev[taskId] || [];
      if (checked) {
        return { ...prev, [taskId]: [...currentSelections, caseId] };
      } else {
        return { ...prev, [taskId]: currentSelections.filter((id) => id !== caseId) };
      }
    });
  };

  const handleSelectAllCases = (taskId: number, checked: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (checked) {
      setSelectedTaskCases((prev) => ({
        ...prev,
        [taskId]: task.cases.map((c) => c.id),
      }));
    } else {
      setSelectedTaskCases((prev) => ({
        ...prev,
        [taskId]: [],
      }));
    }
  };

  /* ================= VALIDATE TASK ================= */

  const handleValidate = async (taskId: number) => {
    const selectedCases = selectedTaskCases[taskId] || [];
    
    if (selectedCases.length === 0) {
      alert('Please select at least one test case to validate');
      return;
    }

    const remark = remarks[taskId] || '';

    setValidatingTaskId(taskId);

    try {
      const payload = {
        task_submission_id: taskId,
        approved_test_case_ids: selectedCases,
        remark: remark,
      };

      console.log('Validation payload:', payload);

      const res = await fetch(
        `${BASE_URL}/projects/tasks/admin/test-case-results/validate/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Validation failed (${res.status})`);
      }

      const result = await res.json();
      console.log('Validation success:', result);

      alert(`Validated successfully! ${selectedCases.length} test case(s) approved.`);

      // Clear selections and remarks for this task
      setSelectedTaskCases((prev) => ({ ...prev, [taskId]: [] }));
      setRemarks((prev) => ({ ...prev, [taskId]: '' }));

      // Optionally refresh the data
      // You can call fetchSubmissions again here if needed
    } catch (err) {
      console.error('Validation failed:', err);
      alert(`Validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setValidatingTaskId(null);
    }
  };

  /* ================= VIEW TASK DETAILS ================= */

  const handleViewDetails = (taskId: number) => {
    router.push(`/dashboard/admin/task-details/${taskId}`);
  };

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const currentTasks = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ================= LOADING & ERROR STATES ================= */

  if (loading) {
    return (
      <div className="p-6 bg-white mt-5 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-b-2 border-orange-500 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white mt-5">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-6 bg-white mt-5">
        <h2 className="text-lg font-semibold mb-4">Task Validation</h2>
        <p className="text-gray-600">No submissions found.</p>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="p-6 bg-white overflow-x-auto mt-5">
      <h2 className="text-lg font-semibold mb-4">Task Validation</h2>

      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Select</th>
            <th className="px-4 py-2 text-left">Project Name</th>
            <th className="px-4 py-2 text-left">Task/Test Title</th>
            <th className="px-4 py-2 text-left min-w-[200px]">Agent/Tester Assigned</th>
            <th className="px-4 py-2 text-left min-w-[250px]">Task/Test Cases</th>
            <th className="px-4 py-2 text-left min-w-[150px]">Result Status</th>
            <th className="px-4 py-2 text-left min-w-[200px]">Date/Time</th>
            <th className="px-4 py-2 text-left min-w-[200px]">Evidence</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentTasks.map((task) => (
            <React.Fragment key={task.id}>
              {task.cases.map((c, index) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  {index === 0 && (
                    <>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top">
                        <input
                          type="checkbox"
                          checked={
                            (selectedTaskCases[task.id] || []).length === task.cases.length &&
                            task.cases.length > 0
                          }
                          onChange={(e) => handleSelectAllCases(task.id, e.target.checked)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top font-medium text-gray-800">
                        {task.projectName}
                      </td>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top">
                        {task.taskTitle}
                      </td>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top space-y-2">
                        {task.agentsAssigned.map((agent, i) => (
                          <p key={i}>{agent}</p>
                        ))}
                      </td>
                    </>
                  )}

                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(selectedTaskCases[task.id] || []).includes(c.id)}
                        onChange={(e) => handleCaseSelection(task.id, c.id, e.target.checked)}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-700">{c.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                          c.status === 'pass'
                            ? 'bg-white text-green-700 border-green-400'
                            : 'bg-white text-red-700 border-red-400'
                        }`}
                      >
                        {c.status === 'pass' ? 'Pass' : 'Fail'}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                          c.has_access
                            ? 'bg-white text-green-700 border-green-400'
                            : 'bg-white text-red-700 border-red-400'
                        }`}
                      >
                        {c.has_access ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-gray-600">{c.date}</td>

                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {c.evidence ? (
                        <>
                          <Image
                            src={c.evidence}
                            alt="evidence"
                            width={130}
                            height={100}
                            className="rounded-md"
                          />
                          <a
                            href={c.evidence}
                            download
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">No evidence</span>
                      )}
                      <button
                        onClick={() => handleViewDetails(task.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>

                  {index === 0 && (
                    <td rowSpan={task.cases.length} className="px-4 py-2 align-top">
                      <div className="space-y-2">
                        <textarea
                          placeholder="Add remarks..."
                          value={remarks[task.id] || ''}
                          onChange={(e) =>
                            setRemarks((prev) => ({ ...prev, [task.id]: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs min-h-[60px] resize-none"
                        />
                        <button
                          onClick={() => handleValidate(task.id)}
                          disabled={validatingTaskId === task.id}
                          className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {validatingTaskId === task.id ? 'Validating...' : 'Validate'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6">
        <Pagination totalPages={totalPages} initialPage={page} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default TaskValidationTable;
