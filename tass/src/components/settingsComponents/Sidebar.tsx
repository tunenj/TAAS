'use client';

import React from 'react';
import { User, Users } from 'lucide-react';

interface SidebarProps {
  activeTab: 'profile' | 'userManagement';
  onTabChange: (tab: 'profile' | 'userManagement') => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-full md:w-56 h-[556px] border border-gray-200 rounded-xl px-4 py-5 flex flex-col gap-6 shrink-0 sticky top-8">
      
      {/* General Section */}
      <div>
        <p className="text-gray-700 text-sm font-medium mb-2 tracking-tight">General</p>
        <button
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 w-full text-left group hover:shadow-sm ${
            activeTab === 'profile'
              ? 'bg-orange-50 border border-orange-200 text-orange-700 shadow-md'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
          }`}
          onClick={() => onTabChange('profile')}
        >
          <User
            size={18}
            className={`transition-colors duration-200 flex-shrink-0 ${
              activeTab === 'profile' 
                ? 'text-orange-500' 
                : 'text-gray-500 group-hover:text-gray-600'
            }`}
          />
          <span>Profile</span>
        </button>
      </div>

      {/* Administration Section */}
      <div>
        <p className="text-gray-700 text-sm font-medium mb-2 tracking-tight">Administration</p>
        <button
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 w-full text-left group hover:shadow-sm ${
            activeTab === 'userManagement'
              ? 'bg-orange-50 border border-orange-200 text-orange-700 shadow-md'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
          }`}
          onClick={() => onTabChange('userManagement')}
        >
          <Users
            size={18}
            className={`transition-colors duration-200 flex-shrink-0 ${
              activeTab === 'userManagement' 
                ? 'text-orange-500' 
                : 'text-gray-500 group-hover:text-gray-600'
            }`}
          />
          <span>User Management</span>
        </button>
      </div>
    </aside>
  );
}
