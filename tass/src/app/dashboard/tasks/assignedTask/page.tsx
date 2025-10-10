"use client";

import { useState, ChangeEvent } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface TestCase {
    id: string;
    testTitle: string;
    module: string;
    requirementId: string;
    assignedToProject: string;
    assignedToTester: string;
    priority: string;
    testType: string;
    testEnvironment: string;
    deadline: string;
}

const TestCasesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const testCases: TestCase[] = [
        {
            id: 'TC001',
            testTitle: 'Verify User Login',
            module: 'Authentication',
            requirementId: 'REG001',
            assignedToProject: 'Project Alpha',
            assignedToTester: 'Emily Carter',
            priority: 'High',
            testType: 'Functional',
            testEnvironment: 'Chrome',
            deadline: '2024-07-15'
        },
        {
            id: 'TC002',
            testTitle: 'Check Product Listing',
            module: 'Catalog',
            requirementId: 'REG002',
            assignedToProject: 'Project Alpha',
            assignedToTester: 'David Lee',
            priority: 'Medium',
            testType: 'UI',
            testEnvironment: 'Safari',
            deadline: '2024-07-16'
        },
        {
            id: 'TC003',
            testTitle: 'Process Order',
            module: 'Checkout',
            requirementId: 'REG003',
            assignedToProject: 'Project Beta',
            assignedToTester: 'Sophia Clark',
            priority: 'High',
            testType: 'Functional',
            testEnvironment: 'Firefox',
            deadline: '2024-07-17'
        },
        {
            id: 'TC004',
            testTitle: 'Update Profile',
            module: 'User Management',
            requirementId: 'REG004',
            assignedToProject: 'Project Beta',
            assignedToTester: 'Ethan Brown',
            priority: 'Low',
            testType: 'UI',
            testEnvironment: 'Edge',
            deadline: '2024-07-18'
        },
        {
            id: 'TC005',
            testTitle: 'Search Products',
            module: 'Catalog',
            requirementId: 'REG005',
            assignedToProject: 'Project Alpha',
            assignedToTester: 'Olivia Green',
            priority: 'Medium',
            testType: 'Functional',
            testEnvironment: 'Chrome',
            deadline: '2024-07-19'
        }
    ];

    const filteredTestCases = testCases.filter(testCase => {
        return (
            testCase.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            testCase.testTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-white text-black';
            case 'Medium':
                return 'bg-white text-black';
            case 'Low':
                return 'bg-white text-black';
            default:
                return 'bg-white text-black';
        }
    };

    const getTestTypeColor = (testType: string) => {
        switch (testType) {
            case 'Functional':
                return 'bg-white text-black';
            case 'UI':
                return 'bg-white text-black';
            default:
                return 'bg-white text-black';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 mt-5">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Test Cases</h1>
                    <p className='bg-gray-200 p-1 rounded text-sm'>New Test Case</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by Test Case ID or Test Title"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tester</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="bg-gray-300 p-1 rounded flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Test Cases Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">
                                        <input type="checkbox" id="select-all" className="form-checkbox mt-4 text-[#F97316]" />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Test Case ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Test Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Requirement ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assigned To Project
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assigned To Tester
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Test Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Test Environment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Deadline
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTestCases.map((testCase) => (
                                    <tr key={testCase.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" id={`select-${testCase.id}`} className="form-checkbox mt-4 text-[#F97316]" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testCase.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{testCase.testTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testCase.module}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testCase.requirementId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testCase.assignedToProject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testCase.assignedToTester}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(testCase.priority)}`} >
                                                {testCase.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTestTypeColor(testCase.testType)}`} >
                                                {testCase.testType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testCase.testEnvironment}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testCase.deadline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredTestCases.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No test cases found matching your criteria</p>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-10">
                    <div className="">
                        <button className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold shadow">
                            Run Selected Tests
                        </button>
                        <button className="px-6 py-2 rounded-md bg-gray-100 text-gray-800 font-semibold ml-4">
                            Re-Assign Selected
                        </button>
                    </div>
                    <div className="flex sm:flex-row gap-3">
                        <button className="px-6 py-2 rounded-md bg-gray-100 text-gray-800 font-semibold">
                            Delete Selected
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

export default TestCasesPage;