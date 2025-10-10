import { Search } from "lucide-react";

const projects = [
    {
        name: "Website Redesign", testers: ["Alice", "Bob"], status: "In Progress", start: "2024-07-30", deadline: "2024-07-30", progress: 75,
    },
    {
        name: "Mobile App Development", testers: ["Carol"], status: "Pending", start: "2024-07-30", deadline: "2024-09-15", progress: 10,
    },
    {
        name: "API Integration", testers: ["David"], status: "Completed", start: "2024-07-30", deadline: "2024-06-20", progress: 100,
    },
    {
        name: "Database Migration", testers: ["Eve"], status: "In Progress", start: "2024-07-30", deadline: "2024-08-01", progress: 40,
    },
    {
        name: "Marketing Campaign Launch", testers: [], status: "Open", start: "2024-07-30", deadline: "2024-07-10", progress: 0,
    },
];

function statusClass(status: string) {
    switch (status) {
        case "In Progress": return "bg-orange-100 text-orange-600";
        case "Pending": return "bg-gray-100 text-gray-600";
        case "Completed": return "bg-green-100 text-green-600";
        case "Open": return "bg-red-100 text-red-600";
        default: return "bg-gray-100 text-gray-600";
    }
}

export default function ProjectsTable() {
    return (
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
            <div className="flex justify-between items-center px-4 py-3">
                <div className="relative w-96 border-gray-300">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by project name, tester, or status"
                        className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:outline-none"
                    />
                </div>
                <button className="border px-3 py-1 rounded text-gray-500 text-xs border-gray-200 hover:bg-gray-100">
                    Filter by Status
                </button>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-gray-400">
                        <th className="py-2 px-3 text-left">Project Name</th>
                        <th className="py-2 px-3 text-left">Assigned Testers</th>
                        <th className="py-2 px-3 text-left">Status</th>
                        <th className="py-2 px-3">Start Date</th>
                        <th className="py-2 px-3">Deadline</th>
                        <th className="py-2 px-3">Progress %</th>
                        <th className="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((p, i) => (
                        <tr key={i} className="border-b border-gray-300 last:border-0">
                            <td className="py-3 px-3">{p.name}</td>
                            <td className="py-3 px-3">{p.testers.join(", ") || <span className="text-gray-300">-</span>}</td>
                            <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusClass(p.status)}`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="py-3 px-3 text-center">{p.start}</td>
                            <td className="py-3 px-3 text-center">{p.deadline}</td>
                            <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-orange-500 h-2"
                                            style={{ width: `${p.progress > 100 ? 100 : p.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-semibold">{p.progress}%</span>
                                </div>
                            </td>
                            <td className="py-3 px-3 flex gap-2 text-gray-400 items-center">
                                <button title="View">👁️</button>
                                <button title="Edit">✏️</button>
                                <button title="Delete">🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
