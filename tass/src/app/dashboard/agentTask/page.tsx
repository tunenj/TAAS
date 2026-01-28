'use client';

import * as React from 'react';
import { Plus, Save, Search, Filter, Flag, Folder, Download, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import dayjs from 'dayjs';

type Activity = { id: string; title: string; time: string };
type Summary = {
    progressLabel: string;
    completed: number;
    passed: number;
    failed: number;
    duration: string;
    activities: Activity[];
};

type Task = {
    project_id: string;
    task_id: string;
    title: string;
    description: string;
    status: string;
    location: string;
    start_datetime: string;
    end_datetime: string;
    test_cases: any[];
    expected_test_cases: any[];
};

type ApiResponse = {
    success: boolean;
    message: string;
    data: Task[];
};

type UserProfileResponse = {
    success: boolean;
    message: string;
    data: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number?: string;
        work_phone?: string;
        employee_id?: string;
        role_name?: string;
        department?: string;
        [key: string]: any;
    };
};

type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    workPhone: string;
    position: string;
    department: string;
};

const SAMPLE_SUMMARY: Summary = {
    progressLabel: 'Completed',
    completed: 3,
    passed: 2,
    failed: 2,
    duration: '02:14',
    activities: [
        { id: 'a1', title: 'Run created', time: '2025-11-10T10:21:00' },
        { id: 'a2', title: 'Step 2 evidence added', time: '2025-11-10T10:23:00' },
        { id: 'a3', title: 'Status changed to Running', time: '2025-11-10T10:24:00' },
    ],
};

function formatTime(iso?: string) {
    if (!iso) return '-';
    try {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return iso;
    }
}

function formatDate(iso?: string) {
    if (!iso) return '-';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString();
    } catch {
        return iso;
    }
}

function formatDateTime(iso?: string) {
    if (!iso) return '-';
    try {
        const d = new Date(iso);
        return d.toLocaleString();
    } catch {
        return iso;
    }
}

function TestSummary({ data, onClose }: { data: Summary; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold">Test Summary</h2>
                        <p className="text-sm text-gray-500">Overview of run progress, results and activity timeline.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div>
                            <div className="text-xs text-gray-500">Progress</div>
                            <div className="mt-1 text-lg font-medium text-gray-800">{data.progressLabel}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Passed</div>
                            <div className="mt-1 text-lg font-medium text-green-600">{data.passed}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Failed</div>
                            <div className="mt-1 text-lg font-medium text-red-600">{data.failed}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">Duration</div>
                            <div className="mt-1 text-lg font-medium text-gray-800">{data.duration}</div>
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <div className="text-xs text-gray-500">Completed tests</div>
                        <div className="mt-2 text-sm text-gray-700">{data.completed} total</div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Activities</h3>
                        <div className="space-y-3">
                            {data.activities.map((a, idx) => (
                                <div key={a.id} className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-gray-800">{a.title}</div>
                                            <div className="text-xs text-gray-500">{formatTime(a.time)}</div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Tests • {idx + 1} step</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Page component */
export default function MyTaskPage() {
    const router = useRouter();
    const { BASE_URL, accessToken, user } = useAuth();
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = React.useState(false);
    
    // State for showing task heading details
    const [selectedTaskDetails, setSelectedTaskDetails] = React.useState<Task | null>(null);
    const [showTaskHeading, setShowTaskHeading] = React.useState(false);

    const statusColor: Record<string, string> = {
        'open': 'text-gray-500',
        'in_progress': 'text-orange-500',
        'completed': 'text-green-600',
        'closed': 'text-gray-700',
    };

    const statusDisplay: Record<string, string> = {
        'open': 'To Do',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'closed': 'Closed',
    };

    const [openSummaryFor, setOpenSummaryFor] = React.useState<string | null>(null);

    const handleExecute = (taskId: string) => {
        router.push(`/dashboard/agentTask/execute/${taskId}`);
    };

    const handleDetails = (taskId: string) => {
        router.push(`/dashboard/agentTask/task-details/${taskId}`);
    };

    const handleViewHeading = (task: Task) => {
        setSelectedTaskDetails(task);
        setShowTaskHeading(true);
    };

    // Fetch user profile from /profile/me/
    const fetchUserProfile = async () => {
        if (!accessToken) return;

        try {
            setLoadingProfile(true);
            const res = await fetch(`${BASE_URL}/profile/me/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: UserProfileResponse = await res.json();
            if (data.success && data.data) {
                const profileData = data.data;
                setUserProfile({
                    id: profileData.id,
                    firstName: profileData.first_name,
                    lastName: profileData.last_name,
                    fullName: `${profileData.first_name} ${profileData.last_name}`,
                    email: profileData.email,
                    phoneNumber: profileData.phone_number || '',
                    workPhone: profileData.work_phone || '',
                    position: profileData.role_name || '',
                    department: profileData.department || '',
                });
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchTasks = async () => {
        if (!BASE_URL || !accessToken) {
            setError('Authentication required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/projects/tasks/assigned/me/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }

            const result = await response.json();

            // Handle different possible response structures
            if (result && Array.isArray(result)) {
                // If the response is directly an array
                setTasks(result);
            } else if (result && result.data && Array.isArray(result.data)) {
                // If response has { success: true, data: [], message: '' }
                setTasks(result.data);
            } else if (result && result.results && Array.isArray(result.results)) {
                // If response has pagination structure { results: [], count: n, next: null, previous: null }
                setTasks(result.results);
            } else if (result && Array.isArray(result.tasks)) {
                // If response has { tasks: [] }
                setTasks(result.tasks);
            } else {
                // Fallback: try to extract any array from the response
                const possibleArrays = Object.values(result).filter(v => Array.isArray(v));
                if (possibleArrays.length > 0) {
                    setTasks(possibleArrays[0] as Task[]);
                } else {
                    console.warn('No array found in response, setting empty array');
                    setTasks([]);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const loadData = async () => {
            if (accessToken) {
                await fetchUserProfile();
                await fetchTasks();
            }
        };

        loadData();
    }, [BASE_URL, accessToken]);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = dayjs().hour();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Get user's name for display
    const getUserName = () => {
        if (userProfile?.fullName) return userProfile.fullName;
        if (user?.first_name) return `${user.first_name} ${user.last_name || ''}`.trim();
        return 'User';
    };

    // Get user's position/role
    const getUserPosition = () => {
        if (userProfile?.position) return userProfile.position;
        if (user?.role_name) return user.role_name;
        return 'Supervisor';
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen text-gray-800 mt-5 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen text-gray-800 mt-5">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-gray-800 mt-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-semibold">My Task</h1>
                    {!loadingProfile && (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">{getGreeting()},</span>
                            <span className="text-sm font-medium">{getUserName()}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
                        <Save size={16} /> Save View
                    </button>
                    <button className="flex items-center gap-2 text-black px-4 py-2 rounded-lg text-sm">
                        <Plus size={16} /> New Test Case
                    </button>
                </div>
            </div>

            {/* User Profile Info Card (Optional) */}
            {userProfile && (
                <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-800">{getUserName()}</h3>
                            <p className="text-sm text-gray-600">{getUserPosition()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">ID: {userProfile.id}</p>
                            <p className="text-sm text-gray-600">{userProfile.department}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-4 h-4" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Search test cases"
                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition">
                        <Filter size={16} />
                        <span>Status: All</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition">
                        <Flag size={16} />
                        <span>Priority</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition">
                        <Folder size={16} />
                        <span>Project</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition">
                    <ArrowUpDown size={16} />
                    <span>Sort: Updated</span>
                    <Download size={16} />
                    <span>Export</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 text-sm font-medium text-gray-600 mb-3 border-b border-gray-200 mt-3">
                <button className="pb-2 bg-amber-600 px-4 py-2 rounded-md text-black">All</button>
                <button className="pb-2 hover:text-indigo-600">Assigned to Me</button>
                <button className="pb-2 hover:text-indigo-600">To Do</button>
                <button className="pb-2 hover:text-indigo-600">In Progress</button>
                <button className="pb-2 hover:text-indigo-600">Completed</button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 font-semibold">
                        <tr>
                            <th className="p-3 text-left"></th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Project ID</th>
                            <th className="p-3 text-left">Task ID</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Start Date</th>
                            <th className="p-3 text-left">End Date</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-gray-500">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-2"></div>
                                        Loading tasks...
                                    </div>
                                </td>
                            </tr>
                        ) : Array.isArray(tasks) && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.task_id} className="border-b border-b-gray-200 hover:bg-gray-50">
                                    <td className="p-3"><input type="checkbox" /></td>
                                    <td className="p-3 font-medium">{task.title}</td>
                                    <td className="p-3">{task.project_id}</td>
                                    <td className="p-3">{task.task_id}</td>
                                    <td className={`p-3 font-medium ${statusColor[task.status] || 'text-gray-500'}`}>
                                        {statusDisplay[task.status] || task.status}
                                    </td>
                                    <td className="p-3">{task.location}</td>
                                    <td className="p-3">{formatDate(task.start_datetime)}</td>
                                    <td className="p-3">{formatDate(task.end_datetime)}</td>
                                    <td className="p-3 flex gap-3">
                                        {task.status !== 'completed' && task.status !== 'closed' ? (
                                            <>
                                                <button
                                                    onClick={() => handleExecute(task.task_id)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    Execute
                                                </button>
                                                <button
                                                    onClick={() => handleDetails(task.task_id)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => handleViewHeading(task)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    View
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-13"></div>
                                                <button
                                                    onClick={() => handleDetails(task.task_id)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => handleViewHeading(task)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    View
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-gray-500">
                                    No tasks found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {tasks.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    No tasks assigned to you.
                </div>
            )}

            {/* Task Heading Details Modal */}
            {showTaskHeading && selectedTaskDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Task Details - {selectedTaskDetails.title}</h2>
                            <button
                                onClick={() => setShowTaskHeading(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Project ID</h3>
                                    <p className="mt-1 text-gray-800">{selectedTaskDetails.project_id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Task ID</h3>
                                    <p className="mt-1 text-gray-800">{selectedTaskDetails.task_id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                    <p className="mt-1 text-gray-800">{selectedTaskDetails.title}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                    <p className={`mt-1 font-medium ${statusColor[selectedTaskDetails.status] || 'text-gray-500'}`}>
                                        {statusDisplay[selectedTaskDetails.status] || selectedTaskDetails.status}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                    <p className="mt-1 text-gray-800">{selectedTaskDetails.location}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                    <p className="mt-1 text-gray-800 whitespace-pre-wrap">{selectedTaskDetails.description || 'No description provided'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Start Date & Time</h3>
                                    <p className="mt-1 text-gray-800">{formatDateTime(selectedTaskDetails.start_datetime)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">End Date & Time</h3>
                                    <p className="mt-1 text-gray-800">{formatDateTime(selectedTaskDetails.end_datetime)}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Test Cases</h3>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 bg-gray-100 rounded text-sm">
                                        Assigned: {selectedTaskDetails.test_cases?.length || 0}
                                    </div>
                                    <div className="px-3 py-1 bg-gray-100 rounded text-sm">
                                        Expected: {selectedTaskDetails.expected_test_cases?.length || 0}
                                    </div>
                                </div>
                                
                                {/* Display test cases if available */}
                                {selectedTaskDetails.test_cases && selectedTaskDetails.test_cases.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700">Test Case Details:</h4>
                                        {selectedTaskDetails.test_cases.map((testCase, index) => (
                                            <div key={testCase.id || index} className="p-2 bg-gray-50 rounded border">
                                                <div className="text-xs text-gray-500">ID: {testCase.id}</div>
                                                <div className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{testCase.description}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Created: {formatDateTime(testCase.created_at)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowTaskHeading(false)}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleExecute(selectedTaskDetails.task_id)}
                                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                Execute Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {openSummaryFor !== null && (
                <TestSummary
                    data={SAMPLE_SUMMARY}
                    onClose={() => setOpenSummaryFor(null)}
                />
            )}
        </div>
    );
}