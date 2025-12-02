'use client';

import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import ResetPasswordModal, { ResetPasswordFormData } from '@/components/ResetPassword/ResetPassword';

export default function SettingsPage() {
    const [form, setForm] = useState({
        fullName: 'Jordan Lee',
        email: 'jordan.lee@acme.co',
        role: 'Supervisor',
        timezone: 'WAT',
    });

    const [showResetModal, setShowResetModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleResetPassword = async (data: ResetPasswordFormData) => {
        try {
            console.log('Submitting password reset:', data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setShowResetModal(false);
            alert('Password updated successfully! A confirmation email has been sent.');
        } catch (error) {
            console.error('Reset password error:', error);
            alert('Failed to update password. Please try again.');
        }
    };

    return (
        <>
            <main className="px-10 py-8 max-w-6xl mx-auto text-gray-700 mt-2">
                <nav className="mb-6 border-b border-gray-200 text-sm font-medium">
                    <ul className="flex gap-6">
                        <li className="pb-3 text-orange-500 border-b-2 border-orange-500">
                            Settings
                        </li>
                    </ul>
                </nav>

                <div className="bg-white rounded-xl shadow-xl p-8 -ml-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <p className="text-sm text-gray-600 mb-3 sm:mb-0">
                            Manage your account preferences and administrative controls
                        </p>
                    </div>

                    <section className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full md:w-56 h-[556px] border border-gray-200 rounded-xl px-4 py-5 flex flex-col gap-6 shrink-0 sticky top-8">
                            <div>
                                <p className="flex flex-col text-gray-700 text-sm mb-2">General</p>
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold bg-gray-200 w-full text-orange-600"
                                >
                                    <User size={18} className="text-orange-500" />
                                    Profile
                                </button>
                            </div>
                        </aside>

                        {/* Profile Section */}
                        <article className="flex-1 w-full">
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
                            </div>
                        </article>
                    </section>
                </div>
            </main>

            {/* Reset Password Modal */}
            {showResetModal && (
                <ResetPasswordModal
                    isOpen={showResetModal}
                    onClose={() => setShowResetModal(false)}
                    user={{ name: form.fullName, email: form.email }}
                    onSubmit={handleResetPassword}
                />
            )}
        </>
    );
}
