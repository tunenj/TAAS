import React from 'react';
import { UserCircle } from 'lucide-react';

interface User {
  name: string;
  agents: number;
}

interface UserManagementTableProps {
  title: string;
  users: User[];
  type: 'supervisor' | 'agent';
  bgHeader?: boolean;
}

export default function UserManagementTable({
  title,
  users,
  type,
  bgHeader = false
}: UserManagementTableProps) {
  const getActionButtons = (type: 'supervisor' | 'agent') => {
    if (type === 'supervisor') {
      return (
        <>
          <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
            Assign Agents
          </button>
          <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
            Edit
          </button>
        </>
      );
    }

    return (
      <>
        <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
          Assign to Supervisor
        </button>
        <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition">
          Edit
        </button>
      </>
    );
  };

  return (
    <div className="space-y-1">
      {!bgHeader && <div className="font-medium">{title}</div>}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div>
          {/* Table Header */}
          <div className={`flex justify-between items-center px-6 py-3 border-gray-200 ${bgHeader ? 'bg-gray-50' : 'bg-gray-100'}`}>
            <p className="text-xs text-gray-500 font-semibold">Name</p>
            <p className="text-xs text-gray-500 font-semibold">Actions</p>
          </div>
        </div>
        <div className="divide-y">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-3"
            >
              <div className="flex items-center gap-3">
                <UserCircle size={32} className="text-black" />
                <div>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.agents} {type === 'supervisor' ? 'agents' : 'agents'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {getActionButtons(type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}