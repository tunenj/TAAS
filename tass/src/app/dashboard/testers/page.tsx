"use client";

import { useState, ChangeEvent } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface Tester {
    id: string;
    fullName: string;
    email: string;
    username: string;
    role: 'Tester' | 'Supervisor' | 'Admin';
    status: 'Active' | 'Inactive' | 'Suspended';
    dateRegistered: string;
}

const RegisteredTestersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [roleFilter, setRoleFilter] = useState<string>('All');

    const testers: Tester[] = [
        {
            id: '12345',
            fullName: 'Clara Bennett',
            email: 'clara.bennett@email.com',
            username: 'clara_b',
            role: 'Tester',
            status: 'Active',
            dateRegistered: '2023-08-15'
        },
        {
            id: '67890',
            fullName: 'Owen Carter',
            email: 'owen.carter@email.com',
            username: 'owen_c',
            role: 'Supervisor',
            status: 'Inactive',
            dateRegistered: '2023-07-22'
        },
        {
            id: '11223',
            fullName: 'Emma Hayes',
            email: 'emma.hayes@email.com',
            username: 'emma_h',
            role: 'Admin',
            status: 'Active',
            dateRegistered: '2023-06-10'
        },
        {
            id: '11223',
            fullName: 'Emma Hayes',
            email: 'emma.hayes@email.com',
            username: 'emma_h',
            role: 'Admin',
            status: 'Suspended',
            dateRegistered: '2023-06-10'
        }
    ];

    const statusOptions = ['All', 'Active', 'Inactive', 'Suspended'];
    const roleOptions = ['All', 'Tester', 'Supervisor', 'Admin'];

    const filteredTesters = testers.filter(tester => {
        const matchesSearch =
            tester.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tester.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tester.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || tester.status === statusFilter;
        const matchesRole = roleFilter === 'All' || tester.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-gray-200 text-black';
            case 'Inactive':
                return 'bg-gray-200 text-black';
            case 'Suspended':
                return 'bg-gray-200 text-black';
            default:
                return 'bg-gray-100 text-black';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Admin':
                return 'bg-gray-200 text-black';
            case 'Supervisor':
                return 'bg-gray-200 text-black';
            case 'Tester':
                return 'bg-gray-200 text-black';
            default:
                return 'bg-gray-100 text-black';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 mt-3">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Registered Testers</h1>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Registered</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Testers Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">
                                        <input type="checkbox" id="select-all" className="form-checkbox mt-4 text-[#F97316]" />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tester ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date Registered
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTesters.map((tester) => (
                                    <tr key={tester.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" id={`select-${tester.id}`} className="form-checkbox mt-4 text-[#F97316]" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tester.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tester.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tester.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tester.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(tester.role)}`} >{tester.role}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tester.status)}`} >{tester.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tester.dateRegistered}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredTesters.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No testers found matching your criteria</p>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-10">
                    <div className="">
                        <button className="px-6 py-2 rounded-md bg-[#F97316] text-white font-semibold shadow hover:bg-[#f89e4a] transition">
                            Add New Tester
                        </button>
                        <button className="px-6 py-2 rounded-md bg-gray-100 text-gray-800 font-semibold">
                            Activate / Deactivate Selected
                        </button>
                    </div>
                    <div className="flex sm:flex-row gap-3">
                        <button className="px-6 py-2 rounded-md bg-gray-100 text-gray-800 font-semibold">
                            Delete Selected
                        </button>
                        <button className="px-6 py-2 rounded-md bg-gray-100 text-gray-800 font-semibold">
                            Export List
                        </button>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-2 mt-6">
                    <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                        &lt;
                    </button>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            className={`h-8 w-8 flex items-center justify-center rounded-full ${num === 1 ? 'bg-gray-100 font-bold text-black' : 'hover:bg-gray-200 text-gray-800'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                    <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                        &gt;
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RegisteredTestersPage;
