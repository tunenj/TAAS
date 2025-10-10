"use client";

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';

const CreateTaskForm: React.FC = () => {
    const [formData, setFormData] = useState({
        // Basic Information
        testCaseId: '',
        module: '',
        projects: [] as string[],
        testType: '',
        testTitle: '',
        requirementId: '',
        priority: '',
        testEnvironment: '',

        // Pre-requisites & Test Data
        prerequisites: '',
        testData: '',

        // Test Execution
        testSteps: '',
        expectedResults: '',
        actualResults: '',

        // Status & Assignment
        status: '',
        defectId: '',
        tester: '',
        executionDate: '',
        version: '',
        comments: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission logic here
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create New Task / Test Case</h1>
                        <p className="text-gray-600">Fill in the details to create a new task or test case.</p>
                    </div>
                    <FileUpload />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Case ID</label>
                                <input
                                    type="text"
                                    name="testCaseId"
                                    value={formData.testCaseId}
                                    onChange={handleChange}
                                    placeholder="e.g., TC-007"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                                <input
                                    type="text"
                                    name="testTitle"
                                    value={formData.testTitle}
                                    onChange={handleChange}
                                    placeholder="e.g., Verify Admin Dashboard"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                                <input
                                    type="text"
                                    name="module"
                                    value={formData.module}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requirement ID</label>
                                <input
                                    type="text"
                                    name="requirementId"
                                    value={formData.requirementId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Projects</label>
                                <select
                                    name="projects"
                                    value={formData.projects[0] || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {/* <option value="">Select Project</option>
                                    <option value="project-alpha">Project Alpha</option>
                                    <option value="project-beta">Project Beta</option>
                                    <option value="project-gamma">Project Gamma</option> */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">priority</label>
                                <input
                                    type="text"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                                <select
                                    name="testType"
                                    value={formData.testType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {/* <option value="">Select Test Type</option>
                                    <option value="functional">Functional</option>
                                    <option value="regression">Regression</option>
                                    <option value="performance">Performance</option>
                                    <option value="security">Security</option> */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Environment</label>
                                <input
                                    type="text"
                                    name="testEnvironment"
                                    value={formData.testEnvironment}
                                    onChange={handleChange}
                                    placeholder="e.g., Chrome, Windows 10"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Tester</label>
                                <select
                                    name="assignTester"
                                    value={formData.testType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Test Execution Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Test Execution</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Test Steps</label>
                            <textarea
                                name="testSteps"
                                value={formData.testSteps}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Results</label>
                            <textarea
                                name="expectedResults"
                                value={formData.expectedResults}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Results</label>
                            <textarea
                                name="actualResults"
                                value={formData.actualResults}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Assign Later
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#F97316] rounded-md"
                        >
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskForm;