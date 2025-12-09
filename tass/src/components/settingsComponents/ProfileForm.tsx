'use client';

import React from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { FormState } from '@/types/settings';

interface ProfileFormProps {
  form: FormState;
  isLoading: boolean;
  onResetPassword: () => void;
  onSwitchToUserManagement: () => void;
}

export default function ProfileForm({
  form,
  isLoading,
  onResetPassword,
  onSwitchToUserManagement
}: ProfileFormProps) {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-lg">

        {/* Full Name */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Full name</label>
          <input
            type="text"
            value={form.fullName}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-default"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-default"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={form.role}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-default"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={form.username}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-default"
          />
        </div>

        {/* Optional Fields */}
        {form.employeeId && (
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              value={form.employeeId}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-default"
            />
          </div>
        )}

        {form.department && (
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={form.department}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-default"
            />
          </div>
        )}

        {form.workPhone && (
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">Work Phone</label>
            <input
              type="text"
              value={form.workPhone}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-default"
            />
          </div>
        )}

        {/* Password Reset Section */}
        <div className="sm:col-span-2 flex items-center justify-between gap-4 border-t border-b border-gray-300 py-3">
          <div className="flex flex-col">
            <h6 className="font-medium">Password</h6>
            <p className="text-xs text-gray-500">
              It's a good idea to update your password regularly.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetPassword}
            className="flex items-center gap-1 bg-orange-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-orange-600 transition cursor-pointer"
          >
            <Lock size={14} />
            Reset password
          </button>
        </div>

        {/* Administrative Settings Header */}
        <div className="sm:col-span-2 mt-5">
          <h3 className="text-sm text-black">Administrative Settings</h3>
          <p className="text-xs text-black">
            Manage organization, users and permissions
          </p>
        </div>

        {/* Administrative Settings Box */}
        <div className="sm:col-span-2 rounded-2xl border border-gray-300 mt-3 p-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">User Management</span>
            </div>

            <button
              type="button"
              onClick={onSwitchToUserManagement}
              className="flex items-center gap-1 bg-[#E6EAF0] text-black rounded-lg border border-gray-400 px-4 py-2 text-sm hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
              Open
            </button>
          </div>

          <p className="text-xs text-black mt-4">
            Create supervisors and assign agents. Review roles and access.
          </p>
        </div>

      </form>
    </>
  );
}
