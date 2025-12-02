// app/my-task/page.tsx
'use client';

import * as React from 'react';
import { Plus, Save, Search, Filter, Flag, Folder, Download, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Activity = { id: string; title: string; time: string };
type Summary = {
    progressLabel: string;
    completed: number;
    passed: number;
    failed: number;
    duration: string;
    activities: Activity[];
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
    const tasks = [
        { id: 1, name: 'Checkout flow - guest user', project: 'Web Platform', status: 'In Progress', priority: 'High', updated: '2h ago' },
        { id: 2, name: 'Login with SSO', project: 'Mobile App', status: 'To Do', priority: 'Medium', updated: '5h ago' },
        { id: 3, name: 'API rate limit handling', project: 'API Services', status: 'Completed', priority: 'Low', updated: '1d ago' },
        { id: 4, name: 'Profile update validations', project: 'Web Platform', status: 'In Progress', priority: 'High', updated: '2d ago' },
    ];

    const statusColor: Record<string, string> = {
        'In Progress': 'text-orange-500',
        'Completed': 'text-green-600',
        'To Do': 'text-gray-500',
    };

    const [openSummaryFor, setOpenSummaryFor] = React.useState<number | null>(null);

    const handleExecute = (taskId: number) => {
        router.push(`/dashboard/agent/task/execute/${taskId}`);
    };


    return (
            <div className="p-6 bg-gray-50 min-h-screen text-gray-800 mt-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h1 className="text-xl font-semibold">My Task</h1>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
                            <Save size={16} /> Save View
                        </button>
                        <button className="flex items-center gap-2 text-black px-4 py-2 rounded-lg text-sm">
                            <Plus size={16} /> New Test Case
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search test cases"
                            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
                        />
                    </div>
                    {/* Filters */}
                    <div className="flex  items-center gap-3 text-gray-700 text-sm">
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
                < div className="flex gap-6 text-sm font-medium text-gray-600 mb-3 border-b border-gray-200 mt-3" >
                    <button className="pb-2 bg-amber-600 px-4 py-2 rounded-md text-black">All</button>
                    <button className="pb-2 hover:text-indigo-600">Assigned to Me</button>
                    <button className="pb-2 hover:text-indigo-600">To Do</button>
                    <button className="pb-2 hover:text-indigo-600">In Progress</button>
                    <button className="pb-2 hover:text-indigo-600">Completed</button>
                </div >

                {/* Table */}
                < div className="bg-white shadow-sm rounded-lg overflow-hidden" >
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 font-semibold">
                            <tr>
                                <th className="p-3 text-left"></th>
                                <th className="p-3 text-left">Test Case</th>
                                <th className="p-3 text-left">Project</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Priority</th>
                                <th className="p-3 text-left">Last Updated</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className="border-b border-b-gray-200 hover:bg-gray-50">
                                    <td className="p-3"><input type="checkbox" /></td>
                                    <td className="p-3">{task.name}</td>
                                    <td className="p-3">{task.project}</td>
                                    <td className={`p-3 font-medium ${statusColor[task.status]}`}>{task.status}</td>
                                    <td className="p-3">{task.priority}</td>
                                    <td className="p-3">{task.updated}</td>
                                    <td className="p-3 flex gap-3">
                                        {task.status !== 'Completed' ? (
                                            <>
                                                <button
                                                    onClick={() => handleExecute(task.id)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    Execute
                                                </button>
                                                <button
                                                    onClick={() => router.push('/task-details')}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    Details
                                                </button>

                                                <button
                                                    onClick={() => setOpenSummaryFor(task.id)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    View
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-13"></div> {/* Empty space to maintain alignment */}
                                                <button className="text-gray-600 font-semibold">Details</button>
                                                <button
                                                    onClick={() => setOpenSummaryFor(task.id)}
                                                    className="text-gray-600 font-semibold"
                                                >
                                                    View
                                                </button>

                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >

                {/* Modal: show TestSummary when openSummaryFor is set */}
                {
                    openSummaryFor !== null && (
                        <TestSummary
                            data={SAMPLE_SUMMARY}
                            onClose={() => setOpenSummaryFor(null)}
                        />
                    )
                }
            </div>
    );
}