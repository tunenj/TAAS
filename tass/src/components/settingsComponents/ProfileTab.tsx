'use client';

import React from 'react';
import { Lock, ArrowRight, User } from 'lucide-react';
import { UserProfile, FormState } from '@/types/settings';
import ProfileForm from '../../components/settingsComponents/ProfileForm';

interface ProfileTabProps {
  userProfile: UserProfile | null;
  isLoading: boolean;
  onPasswordResetClick: () => void;
  onOpenUserManagement: () => void;
}

export default function ProfileTab({
  userProfile,
  isLoading,
  onPasswordResetClick,
  onOpenUserManagement
}: ProfileTabProps) {
  // Transform UserProfile to FormState (required by ProfileForm)
  const formData: FormState = userProfile ? {
    fullName: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim(),
    email: userProfile.email || '',
    role: userProfile.role_details?.name || userProfile.role_name || '',
    organization: userProfile.organization || userProfile.role_details?.organization_group || '',
    phone: userProfile.phone_number || '',
    username: userProfile.username || '',
    employeeId: userProfile.employee_id || '',
    department: userProfile.department || '',
    workPhone: userProfile.work_phone || ''
  } : {
    fullName: '',
    email: '',
    role: '',
    organization: '',
    phone: '',
    username: '',
    employeeId: '',
    department: '',
    workPhone: ''
  };

  return (
    <div className="border rounded-2xl border-gray-200 p-6 h-[556px]">
      <h3 className="text-gray-900 font-semibold mb-2">User Settings</h3>
      <p className="text-xs text-gray-500 mb-6">
        Personal Information and Security
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      ) : (
        <>
          {/* Pass ALL required props explicitly */}
          <ProfileForm
            form={formData}
            isLoading={false}  
            onResetPassword={onPasswordResetClick}
            onSwitchToUserManagement={onOpenUserManagement}
          />

          {/* These sections can stay outside ProfileForm or move inside */}
          <div className="max-w-lg mt-8">
            <PasswordResetSection onResetClick={onPasswordResetClick} />
            <AdministrativeSettingsSection onOpenUserManagement={onOpenUserManagement} />
          </div>
        </>
      )}
    </div>
  );
}

// Keep your existing sub-components unchanged
function PasswordResetSection({ onResetClick }: { onResetClick: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-b border-gray-300 py-3">
      <div className="flex flex-col">
        <h6 className="font-medium">Password</h6>
        <p className="text-xs text-gray-500">
          It's a good idea to update your password regularly.
        </p>
      </div>
      <button
        type="button"
        onClick={onResetClick}
        className="flex items-center gap-1 bg-orange-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-orange-600 transition cursor-pointer"
      >
        <Lock size={14} />
        Reset password
      </button>
    </div>
  );
}

function AdministrativeSettingsSection({ onOpenUserManagement }: { onOpenUserManagement: () => void }) {
  return (
    <>
      <div className="mt-5">
        <h3 className="text-sm text-black">Administrative Settings</h3>
        <p className="text-xs text-black"> {/* ✅ Fixed: text-sx → text-xs */}
          Manage organization, users and permissions
        </p>
      </div>

      <div className="rounded-2xl border border-gray-300 mt-3 p-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">User Management</span>
          </div>
          <button
            type="button"
            onClick={onOpenUserManagement}
            className="flex items-center gap-1 bg-[#E6EAF0] text-black rounded-lg border border-gray-400 px-4 py-2 text-sm transition cursor-pointer hover:text-gray-600 hover:bg-gray-100"
          >
            <ArrowRight className="w-5 h-5" />
            Open
          </button>
        </div>
        <p className="text-xs text-black mt-4"> {/* ✅ Fixed: text-sx → text-xs */}
          Create supervisors and assign agents. Review roles and access.
        </p>
      </div>
    </>
  );
}
