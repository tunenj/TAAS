'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import ResetPasswordModal from '@/components/ResetPassword/ResetPassword';
import { ResetPasswordFormData } from '@/components/ResetPassword/ResetPassword';
import { useUserProfile } from '@/app/hooks/useUserProfile';
import Sidebar from '@/components/settingsComponents/Sidebar';
import ProfileForm from '@/components/settingsComponents/ProfileForm';
import UserManagementTab from '@/components/settingsComponents/UserManagementTab';
import FormCard from '@/components/settingsComponents/FormCard';
import UserTable from '@/components/settingsComponents/UserTable';


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'userManagement' | 'user'>('profile');
  const { refreshUser } = useAuth();
  const [showResetModal, setShowResetModal] = useState(false);

  const { form, isLoadingProfile } = useUserProfile();
  const isLoadingOverall = isLoadingProfile;

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

  const refreshProfile = () => {
    if (refreshUser) refreshUser();
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    console.log('Submitting password reset:', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowResetModal(false);
    refreshProfile();
    alert('Password updated successfully! A confirmation email has been sent.');
  };

  return (
    <main className="px-10 py-8 max-w-6xl mx-auto text-gray-700 mt-2">
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
          <li
            className={`pb-3 cursor-pointer ${activeTab === 'user'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
              }`}
            onClick={() => setActiveTab('user')}
          >
            User
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
          {activeTab !== 'user' && (
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          )}

         <article className="flex-1 w-full">
            {activeTab === 'profile' && (
              <div className="border rounded-2xl border-gray-200 p-6 h-[556px]">
                <h3 className="text-gray-900 font-semibold mb-2">User Settings</h3>
                <p className="text-xs text-gray-500 mb-6">Personal Information and Security</p>

                <ProfileForm
                  form={form}
                  isLoading={isLoadingOverall}
                  onResetPassword={() => setShowResetModal(true)}
                  onSwitchToUserManagement={() => setActiveTab('userManagement')}
                />
              </div>
            )}

            {activeTab === 'userManagement' && <UserManagementTab supervisors={supervisors} agents={agents} />}
            {activeTab === 'user' && <UserTable />}
          </article>
        </section>

        {activeTab === 'userManagement' && (
          <div className="mt-10 w-full">
            <div className="space-y-6 w-full">
              <div className="w-full"><FormCard title="Create Supervisor" /></div>
              <div className="w-full"><FormCard title="Create Agent" /></div>
              <div className="w-full"><FormCard title="Assign Agents to Supervisor" assign /></div>
            </div>
          </div>
        )}
      </div>
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        user={{ name: form.fullName, email: form.email }}
        onSubmit={handleResetPassword}
      />
    </main>
  );
}
