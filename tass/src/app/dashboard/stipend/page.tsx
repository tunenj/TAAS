'use client'

import React, { useState } from 'react';
import { Search } from "lucide-react";

interface StipendRecord {
    id: number;
    selected: boolean;
    name: string;
    projectTask: string;
    eligibilityStatus: 'Eligible' | 'Not Eligible';
    consistency: number;
    timeliness: number;
    attendance: number;
    taskCompletion: number;
    availability: 'Active' | 'Inactive';
    stipendAmount: number;
    period: 'Day' | 'Week' | 'Month' | 'Year';
}

const StipendManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFrame, setTimeFrame] = useState<'All' | 'Day' | 'Week' | 'Month' | 'Year'>('All');
    const [eligibilityFilter, setEligibilityFilter] = useState<'All' | 'Eligible' | 'Not Eligible'>('All');

    const [records, setRecords] = useState<StipendRecord[]>([
        {
            id: 1,
            selected: false,
            name: 'Ethan Harper',
            projectTask: 'Project Alpha',
            eligibilityStatus: 'Eligible',
            consistency: 90,
            timeliness: 95,
            attendance: 85,
            taskCompletion: 95,
            availability: 'Active',
            stipendAmount: 3500,
            period: 'Month'
        },
        {
            id: 2,
            selected: false,
            name: 'Olivia Bennett',
            projectTask: 'Task Beta',
            eligibilityStatus: 'Not Eligible',
            consistency: 75,
            timeliness: 80,
            attendance: 70,
            taskCompletion: 85,
            availability: 'Inactive',
            stipendAmount: 300,
            period: 'Week'
        },
        {
            id: 3,
            selected: false,
            name: 'Liam Carter',
            projectTask: 'Project Gamma',
            eligibilityStatus: 'Eligible',
            consistency: 86,
            timeliness: 92,
            attendance: 80,
            taskCompletion: 90,
            availability: 'Active',
            stipendAmount: 3500,
            period: 'Month'
        },
        {
            id: 4,
            selected: false,
            name: 'Sophia Davis',
            projectTask: 'Task Delta',
            eligibilityStatus: 'Eligible',
            consistency: 95,
            timeliness: 99,
            attendance: 90,
            taskCompletion: 95,
            availability: 'Active',
            stipendAmount: 3000,
            period: 'Month'
        },
        {
            id: 5,
            selected: false,
            name: 'Noah Evans',
            projectTask: 'Project Epsilon',
            eligibilityStatus: 'Not Eligible',
            consistency: 65,
            timeliness: 70,
            attendance: 60,
            taskCompletion: 75,
            availability: 'Inactive',
            stipendAmount: 250,
            period: 'Week'
        }
    ]);

    const toggleSelect = (id: number) => {
        setRecords(records.map(record =>
            record.id === id ? { ...record, selected: !record.selected } : record
        ));
    };

    const toggleSelectAll = () => {
        const allSelected = records.every(record => record.selected);
        setRecords(records.map(record => ({ ...record, selected: !allSelected })));
    };

    const filteredRecords = records.filter(record => {
        const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTimeFrame = timeFrame === 'All' || record.period === timeFrame;
        const matchesEligibility = eligibilityFilter === 'All' || record.eligibilityStatus === eligibilityFilter;

        return matchesSearch && matchesTimeFrame && matchesEligibility;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 mt-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Stipend Management</h1>
                <p className="text-[#F97316] mb-8">Manage and oversee stipend records for testers and interns.</p>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search by Tester Name
                            </label>

                            <div className="relative w-full">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F97316]"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search testers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {/* Time Frame Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Frame
                            </label>
                            <div className="flex space-x-2">
                                {(['All', 'Day', 'Week', 'Month', 'Year'] as const).map((frame) => (
                                    <button
                                        key={frame}
                                        onClick={() => setTimeFrame(frame)}
                                        className={`px-3 py-1 rounded-md text-sm ${timeFrame === frame
                                            ? 'bg-[#F97316] text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {frame}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Eligibility Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Eligibility Status
                            </label>
                            <select
                                value={eligibilityFilter}
                                onChange={(e) => setEligibilityFilter(e.target.value as 'All' | 'Eligible' | 'Not Eligible')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Status</option>
                                <option value="Eligible">Eligible</option>
                                <option value="Not Eligible">Not Eligible</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={records.length > 0 && records.every(record => record.selected)}
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300 text-[#F97316]"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tester/Intern Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Project/Task Linked
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Eligibility Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Consistency
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timeliness
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Attendance
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Task Completion
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Availability
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stipend Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Period
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={record.selected}
                                                onChange={() => toggleSelect(record.id)}
                                                className="rounded border-gray-300 text-[F97316]"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.projectTask}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.eligibilityStatus === 'Eligible'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {record.eligibilityStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.consistency}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.timeliness}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.attendance}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.taskCompletion}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.availability === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {record.availability}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ¥{record.stipendAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.period}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button className="text-[#F97316">Edit</button>
                                                <button className="text-green-600 hover:text-green-900">View</button>
                                                <button className="text-red-600 hover:text-red-900">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredRecords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No records found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StipendManagement;