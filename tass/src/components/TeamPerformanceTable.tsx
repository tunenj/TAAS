// components/TeamPerformanceTable.tsx
const teamData = [
    { name: "Alice Johnson", attendance: "Present", completed: 12, delayed: 0, status: "Active" },
    { name: "Bob Williams", attendance: "Present", completed: 9, delayed: 1, status: "Active" },
    { name: "Carol Davis", attendance: "Absent", completed: 7, delayed: 2, status: "On Leave" },
    { name: "David Brown", attendance: "Present", completed: 15, delayed: 0, status: "Active" },
    { name: "Eve White", attendance: "Present", completed: 8, delayed: 0, status: "Idle" },
];

export default function TeamPerformanceTable() {
    return (
        <div className="border border-gray-300 rounded-md p-10">
            <h2 className="text-lg font-semibold mb-2">Team Performance</h2>
            <p className="text-gray-500 mb-4 text-sm">Detailed status of all team members.</p>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th>Tester Name</th>
                        <th>Attendance</th>
                        <th>Tasks Completed</th>
                        <th>Delayed Tasks</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {teamData.map((member) => (
                        <tr key={member.name} className="border-b border-gray-300 last:border-0">
                            <td className="py-2">{member.name}</td>
                            <td>
                                <span className={`px-2 py-0.5 rounded text-xs 
                  ${member.attendance === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
                `}>
                                    {member.attendance}
                                </span>
                            </td>
                            <td>{member.completed}</td>
                            <td>
                                <span className={`px-2 py-0.5 rounded text-xs 
                  ${member.delayed === 0 ? "bg-gray-100 text-gray-700" : "bg-yellow-100 text-yellow-900"}
                `}>
                                    {member.delayed}
                                </span>
                            </td>
                            <td>
                                <span className={`px-2 py-0.5 rounded text-xs
                  ${member.status === "Active"
                                        ? "bg-green-100 text-green-700"
                                        : member.status === "On Leave"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-700"
                                    }
                `}>
                                    {member.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
