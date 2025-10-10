// components/AttendanceDashboard.tsx

import React, { useState } from "react";

interface Agent {
    id: number;
    name: string;
    email: string;
    avatar: string;
}

const agents: Agent[] = [
    { id: 1, name: "Arlene McCoy", email: "tim.jennings@example.com", avatar: "/avatars/avatar1.jpg" },
    { id: 2, name: "Kristin Watson", email: "tim.jennings@example.com", avatar: "/avatars/avatar2.jpg" },
    { id: 3, name: "Ralph Edwards", email: "tim.jennings@example.com", avatar: "/avatars/avatar3.jpg" },
    { id: 4, name: "Wade Warren", email: "tim.jennings@example.com", avatar: "/avatars/avatar4.jpg" },
];

const attendanceStatus = ["Present", "Absent"] as const;
type AttendanceStatus = typeof attendanceStatus[number];

// Sample attendance data keyed by day (1-31 for September)
const attendanceData: Record<number, AttendanceStatus> = {
    2: "Present",
    3: "Present",
    4: "Present",
    5: "Absent",
    6: "Present",
    7: "Absent",
    9: "Present",
    10: "Present",
    11: "Absent",
    12: "Present",
    13: "Present",
    16: "Present",
    17: "Absent",
    18: "Present",
    19: "Present",
    20: "Present",
    23: "Present",
    24: "Absent",
    25: "Present",
    26: "Present",
    27: "Absent",
    30: "Present",
    31: "Present",
};

const AttendanceDashboard: React.FC = () => {
    const [selectedAgentId, setSelectedAgentId] = useState<number>(1);

    // Dummy stats
    const totalDaysWorked = 26;
    const totalPresent = 20;
    const totalAbsent = -6;

    const daysInSeptember = Array.from({ length: 30 }, (_, i) => i + 1);

    // Maps day to color classes based on attendance
    const getDayClass = (day: number) => {
        if (!(day in attendanceData)) {
            return "bg-gray-300 text-gray-600";
        }
        if (attendanceData[day] === "Present") {
            return "bg-green-500 text-white";
        }
        if (attendanceData[day] === "Absent") {
            return "bg-red-500 text-white";
        }
        return "";
    };

    return (
        <div className="min-h-screen bg-gray-100 flex p-8">
            {/* Left sidebar: attendance list */}
            <div className="bg-white rounded-lg p-4 w-80 mr-8 shadow section-scroll max-h-[600px] overflow-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Attendance list</h3>
                <input
                    type="search"
                    className="w-full mb-4 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                    placeholder="Search for Agents"
                />
                <ul>
                    {agents.map((agent) => (
                        <li
                            key={agent.id}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={`flex items-center gap-3 p-2 cursor-pointer rounded-md hover:bg-orange-100 ${selectedAgentId === agent.id ? "bg-orange-100" : ""
                                }`}
                        >
                            <img src={agent.avatar} alt={agent.name} className="w-9 h-9 rounded-full object-cover" />
                            <div>
                                <p className="font-medium text-gray-800">{agent.name}</p>
                                <p className="text-xs text-gray-400">{agent.email}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right main: attendance summary */}
            <div className="flex-1 bg-white rounded-lg p-6 shadow">
                <h3 className="font-semibold text-gray-900 mb-6">Attendance Summary</h3>
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                        <p className="font-semibold text-lg">{totalDaysWorked}</p>
                        <p className="text-gray-400 text-sm mt-1">Total days worked</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                        <p className="font-semibold text-lg">{totalPresent}</p>
                        <p className="text-gray-400 text-sm mt-1">Total present days</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                        <p className="font-semibold text-lg">{totalAbsent}</p>
                        <p className="text-gray-400 text-sm mt-1">Total absent days</p>
                    </div>
                </div>

                {/* Month selector */}
                <div className="flex items-center justify-between text-gray-700 font-medium mb-2">
                    <button className="hover:text-orange-500 focus:outline-none">&lt;</button>
                    <span>September</span>
                    <button className="hover:text-orange-500 focus:outline-none">&gt;</button>
                </div>

                {/* Weekday header */}
                <div className="grid grid-cols-7 gap-1 text-center text-gray-600 text-xs font-semibold mb-1">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {[...Array(2).fill(null)].map((_, idx) => (
                        <div key={`empty-top-${idx}`} className="bg-gray-300 opacity-30 rounded text-xs py-1" />
                    ))}
                    {daysInSeptember.map((day) => (
                        <div key={day} className={`${getDayClass(day)} rounded py-1`}>
                            {day}
                        </div>
                    ))}
                    {/* Empty days to fill final week */}
                    {[...Array(2).fill(null)].map((_, idx) => (
                        <div key={`empty-bottom-${idx}`} className="bg-gray-300 opacity-30 rounded text-xs py-1" />
                    ))}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-5 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Absent</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
