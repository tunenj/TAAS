'use client';

import React, { useState } from 'react';
import { User, Users, Lock, Save, UserCircle, UserPlus, ArrowRight } from 'lucide-react';
import ResetPasswordModal, { ResetPasswordFormData } from '@/components/ResetPassword/ResetPassword';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'userManagement'>('profile');


    const [form, setForm] = useState({
        fullName: 'Jordan Lee',
        email: 'jordan.lee@acme.co',
        role: 'Supervisor',
        timezone: 'WAT',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const [showResetModal, setShowResetModal] = useState(false);
    const handleResetPassword = async (data: ResetPasswordFormData) => {
        // Implement your password reset API call here
        console.log('Submitting password reset:', data);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // On success, close modal
        setShowResetModal(false);

        // Show success message (you can add a toast here)
        alert('Password updated successfully! A confirmation email has been sent.');

        // If using toast: toast.success('Password updated successfully!');
    };


    const supervisors = [
        { name: 'Jordan Lee', agents: 5 },
        { name: 'Priya Patel', agents: 3 },
        { name: 'Chen Wu', agents: 2 },
    ];

    const agents = [
        { name: 'Kola Adebayo', agents: 3 },
        { name: 'Tina Gomez', agents: 2 },
        { name: 'Michael Park', agents: 1 },
    ];

    return (
        <main className="px-10 py-8 max-w-6xl mx-auto text-gray-700 mt-2">
            {/* Top Navigation Tabs */}
            <nav className="mb-6 border-b border-gray-200 text-sm font-medium">
                <ul className="flex gap-6">
                    <li
                        className={`pb-3 cursor-pointer ${activeTab === 'profile'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Settings
                    </li>
                    <li
                        className={`pb-3 cursor-pointer ${activeTab === 'userManagement'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('userManagement')}
                    >
                        User Management
                    </li>
                </ul>
            </nav>

            <div className="bg-white rounded-xl shadow-xl p-8 -ml-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <p className="text-sm text-gray-600 mb-3 sm:mb-0">
                        Manage your account preferences and administrative controls
                    </p>
                </div>

                {/* === UPPER SECTION: Sidebar + main side-by-side === */}
                <section className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-56 h-[556px] border border-gray-200 rounded-xl px-4 py-5 flex flex-col gap-6 shrink-0 sticky top-8">
                        <div>
                            <p className="flex flex-col text-gray-700 text-sm">General</p>
                            <button
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition ${activeTab === 'profile'
                                    ? 'bg-gray-200 w-full text-orange-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <User
                                    size={18}
                                    className={`${activeTab === 'profile' ? 'text-orange-500' : 'text-gray-500'
                                        }`}
                                />
                                Profile
                            </button>
                        </div>
                        <div>
                            <p className="flex flex-col text-gray-700 text-sm">Administration</p>
                            <button
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition ${activeTab === 'userManagement'
                                    ? 'bg-gray-200 w-full text-orange-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => setActiveTab('userManagement')}
                            >
                                <Users
                                    size={18}
                                    className={`${activeTab === 'userManagement' ? 'text-orange-500' : 'text-gray-500'
                                        }`}
                                />
                                User Management
                            </button>
                        </div>
                    </aside>

                    {/* Main Section */}
                    <article className="flex-1 w-full">
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="border rounded-2xl border-gray-200 p-6 h-[556px]">
                                <h3 className="text-gray-900 font-semibold mb-2">User Settings</h3>
                                <p className="text-xs text-gray-500 mb-6">
                                    Personal Information and Security
                                </p>

                                <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-lg">
                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">
                                            Full name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">
                                            Timezone
                                        </label>
                                        <input
                                            type="text"
                                            name="timezone"
                                            value={form.timezone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 flex items-center justify-between gap-4 border-t border-b border-gray-300 py-3">
                                        <div className="flex flex-col">
                                            <h6>Password</h6>
                                            <p className="text-xs text-gray-500">
                                                It's a good idea to update your password regularly.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowResetModal(true)}
                                            className="flex items-center gap-1 bg-orange-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-orange-600 transition cursor-pointer"
                                        >
                                            <Lock size={14} />
                                            Reset password
                                        </button>
                                    </div>
                                </form>
                                <div className="max-w-lg">
                                    <div className="mt-5">
                                        <h3 className="text-sm text-gray-400">Administrative Settings</h3>
                                        <p className="text-sx text-gray-400">
                                            Manage organization, users and permissions
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-gray-300 mt-3 p-3">
                                        <div className="flex justify-between mt-3">
                                            <div className="flex items-center gap-2">
                                                <User className="w-6 h-6 text-gray-700" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    User Management
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('userManagement')}
                                                className="flex items-center gap-1 bg-[#E6EAF0] text-gray-400 rounded-lg border border-gray-400 px-4 py-2 text-sm transition cursor-pointer hover:text-gray-600"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                                Open
                                            </button>
                                        </div>

                                        <p className="text-sx text-gray-400 mt-5">
                                            Create supervisors and assign agents. Review roles and access.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* USER MANAGEMENT TAB */}
                        {activeTab === 'userManagement' && (
                            <>
                                <div className="space-y-8">
                                    {/* Header Section */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div>
                                            <h3 className="text-gray-900 font-semibold">User Management</h3>
                                            <p className="text-xs text-gray-500">
                                                Create supervisors and assign agents
                                            </p>
                                        </div>
                                        <div className="flex gap-3 mt-3 sm:mt-0">
                                            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                                                <UserPlus size={16} />
                                                Create Supervisor
                                            </button>
                                            <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition">
                                                <Save size={16} />
                                                Confirm Changes
                                            </button>
                                        </div>
                                    </div>

                                    {/* Supervisors Section */}
                                    <div className="space-y-1">
                                        <div className="font-medium">
                                            Supervisors
                                        </div>
                                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div>
                                                {/* Table Header */}
                                                <div className="flex justify-between items-center px-6 py-3 border-gray-200 bg-gray-100">
                                                    <p className="text-xs text-gray-500 font-semibold">Name</p>
                                                    <p className="text-xs text-gray-500 font-semibold">Actions</p>
                                                </div>
                                            </div>
                                            <div className="divide-y">
                                                {supervisors.map((sup, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center px-6 py-3"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <UserCircle size={32} className="text-gray-400" />
                                                            <div>
                                                                <p className="text-gray-800 font-medium">{sup.name}</p>
                                                                <p className="text-xs text-gray-500">{sup.agents} agents</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
                                                                Assign Agents
                                                            </button>
                                                            <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Agents Section */}
                                    <div className="space-y-1">
                                        <div className="bg-gray-50 px-6 py-3 text-gray-700 font-medium">
                                            Agents
                                        </div>
                                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div>
                                                {/* Table Header */}
                                                <div className="flex justify-between items-center px-6 py-3 border-gray-200 bg-gray-100">
                                                    <p className="text-xs text-gray-500 font-semibold">Name</p>
                                                    <p className="text-xs text-gray-500 font-semibold">Actions</p>
                                                </div>
                                            </div>
                                            <div className="divide-y">
                                                {agents.map((agent, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center px-6 py-3"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <UserCircle size={32} className="text-gray-400" />
                                                            <div>
                                                                <p className="text-gray-800 font-medium">{agent.name}</p>
                                                                <p className="text-xs text-gray-500">{agent.agents}agents</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
                                                                Assign to Supervisor
                                                            </button>
                                                            <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Reset Password Modal */}
                        <ResetPasswordModal
                            isOpen={showResetModal}
                            onClose={() => setShowResetModal(false)}
                            user={{
                                name: form.fullName,
                                email: form.email
                            }}
                            onSubmit={handleResetPassword}
                        />
                    </article>
                </section>

                {activeTab === 'userManagement' && (
                    <div className="mt-10 w-full">
                        <div className="space-y-6 w-full">
                            {/* Create Supervisor */}
                            <div className="w-full">
                                <FormCard title="Create Supervisor" />
                            </div>

                            {/* Create Agent */}
                            <div className="w-full">
                                <FormCard title="Create Agent" />
                            </div>

                            {/* Assign Agent to Supervisor */}
                            <div className="w-full">
                                <FormCard title="Assign Agents to Supervisor" assign />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}


function FormCard({ title, assign = false }: { title: string; assign?: boolean }) {
    return (
        <div className="border border-gray-200 rounded-xl p-6 w-full">
            <p className="text-xs text-gray-600 mb-4 font-semibold">{title}</p>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assign ? (
                    <>
                        <input
                            type="text"
                            placeholder="Select supervisor"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Choose agents"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
                        />
                        <div className="flex justify-end gap-3 sm:col-span-2 mt-3">
                            <button
                                type="button"
                                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition"
                            >
                                Assign
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
                        />
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Nigeria"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
                        />
                        <input
                            type="text"
                            placeholder="27npag12bx"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-full"
                        />
                        <div className="flex justify-end gap-3 sm:col-span-2">
                            <button
                                type="reset"
                                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition"
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}