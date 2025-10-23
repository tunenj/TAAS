'use client';

import React, { useState } from 'react';
import { User, Users, Lock, Save, ArrowRight } from 'lucide-react';

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

    return (
        <main className="px-10 py-8 max-w-6xl mx-auto text-gray-700 mt-4">
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
                    <button className="flex items-center gap-2 bg-orange-500 text-white rounded-lg px-5 py-2 text-sm hover:bg-orange-600 transition cursor-pointer">
                        <Save size={16} />
                        {activeTab === 'profile' ? 'Save Changes' : 'Confirm Changes'}
                    </button>
                </div>

                <section className="flex flex-col md:flex-row gap-8">
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
                                <User size={18} className={`${activeTab === 'profile' ? 'text-orange-500' : 'text-gray-500'}`} />
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
                                <Users size={18} className={`${activeTab === 'userManagement' ? 'text-orange-500' : 'text-gray-500'}`} />
                                User Management
                            </button>
                        </div>
                    </aside>

                    <article className="flex-1 w-full">
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="border rounded-2xl border-gray-200 p-6 h-[556px]">
                                <h3 className="text-gray-900 font-semibold mb-2">User Settings</h3>
                                <p className="text-xs text-gray-500 mb-6">Personal Information and Security</p>

                                <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-lg">
                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Full name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Timezone</label>
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
                                            <p className="text-xs text-gray-500">It's a good idea to update your password regularly.</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 bg-orange-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-orange-600 transition cursor-pointer"
                                        >
                                            <Lock size={14} />
                                            Reset password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* USER MANAGEMENT TAB */}
                        {activeTab === 'userManagement' && (
                            <div className="space-y-8">
                                <div className="border border-gray-200 rounded-xl p-6">
                                    <h3 className="text-gray-800 font-semibold mb-2">User Management</h3>
                                    <p className="text-xs text-gray-500 mb-6">Create supervisors and assign agents</p>

                                    {/* Supervisors Section */}
                                    <div className="mb-8">
                                        <h4 className="text-gray-700 font-semibold mb-3">Supervisors</h4>
                                        <table className="w-full text-sm text-left border border-gray-200 rounded-xl">
                                            <thead className="bg-gray-50 text-gray-600">
                                                <tr>
                                                    <th className="px-4 py-2">Name</th>
                                                    <th className="px-4 py-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {['Jordan Lee', 'Paige Patel', 'Chris Wu'].map((name, idx) => (
                                                    <tr key={idx} className="border-t">
                                                        <td className="px-4 py-2">{name}</td>
                                                        <td className="px-4 py-2 space-x-2">
                                                            <button className="text-orange-500 hover:underline">Assign Agent</button>
                                                            <button className="text-gray-600 hover:underline">Edit</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Agents Section */}
                                    <div>
                                        <h4 className="text-gray-700 font-semibold mb-3">Agents</h4>
                                        <table className="w-full text-sm text-left border border-gray-200 rounded-xl">
                                            <thead className="bg-gray-50 text-gray-600">
                                                <tr>
                                                    <th className="px-4 py-2">Name</th>
                                                    <th className="px-4 py-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {['Admin Lee', 'Paige Patel', 'Chris Wu', 'Dayo Tai'].map((name, idx) => (
                                                    <tr key={idx} className="border-t">
                                                        <td className="px-4 py-2">{name}</td>
                                                        <td className="px-4 py-2 space-x-2">
                                                            <button className="text-orange-500 hover:underline">Assign to Supervisor</button>
                                                            <button className="text-gray-600 hover:underline">Edit</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Forms Section */}
                                <div className="space-y-6">
                                    {/* Create Supervisor Form */}
                                    <div className="border border-gray-200 rounded-xl p-6">
                                        <h4 className="text-gray-700 font-semibold mb-4">Create Supervisor</h4>
                                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="email"
                                                placeholder="example@email.com"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Enter username"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Nigeria"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Set Password"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                                                    Clear
                                                </button>
                                                <button className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-orange-600 transition">
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Create Agent Form */}
                                    <div className="border border-gray-200 rounded-xl p-6">
                                        <h4 className="text-gray-700 font-semibold mb-4">Create Agent</h4>
                                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="email"
                                                placeholder="example@email.com"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Enter username"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Nigeria"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Set Password"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                                            />
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                                                    Clear
                                                </button>
                                                <button className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-orange-600 transition">
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Assign Agent to Supervisor */}
                                    <div className="border border-gray-200 rounded-xl p-6">
                                        <h4 className="text-gray-700 font-semibold mb-4">Assign Agents to Supervisor</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 w-full">
                                                <option>Select supervisor</option>
                                                <option>Jordan Lee</option>
                                                <option>Paige Patel</option>
                                            </select>
                                            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 w-full">
                                                <option>Choose agents</option>
                                                <option>Chris Wu</option>
                                                <option>Dayo Tai</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                                                Cancel
                                            </button>
                                            <button className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-orange-600 transition">
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </article>
                </section>
            </div>
        </main>
    );
}