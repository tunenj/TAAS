'use client';

import React from 'react';
import { UserPlus, Save, UserCircle, ArrowRight } from 'lucide-react';

interface UserData {
  name: string;
  agents: number;
}

interface UserManagementTabProps {
  supervisors: UserData[];
  agents: UserData[];
}

export default function UserManagementTab({ supervisors, agents }: UserManagementTabProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-gray-900 font-semibold">User Management</h3>
          <p className="text-xs text-gray-500">Create supervisors and assign agents</p>
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
      <SupervisorTable data={supervisors} />

      {/* Agents Section */}
      <AgentTable data={agents} />
    </div>
  );
}

function SupervisorTable({ data }: { data: UserData[] }) {
  return (
    <div className="space-y-1">
      <div className="font-medium">Supervisors</div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <TableHeader />
        <div className="divide-y">
          {data.map((sup, index) => (
            <SupervisorRow key={index} supervisor={sup} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentTable({ data }: { data: UserData[] }) {
  return (
    <div className="space-y-1">
      <div className="bg-gray-50 px-6 py-3 text-gray-700 font-medium">Agents</div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <TableHeader />
        <div className="divide-y">
          {data.map((agent, index) => (
            <AgentRow key={index} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex justify-between items-center px-6 py-3 border-gray-200 bg-gray-100">
      <p className="text-xs text-gray-500 font-semibold">Name</p>
      <p className="text-xs text-gray-500 font-semibold">Actions</p>
    </div>
  );
}

function SupervisorRow({ supervisor }: { supervisor: UserData }) {
  return (
    <div className="flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-3">
        <UserCircle size={32} className="text-black" />
        <div>
          <p className="text-gray-800 font-medium">{supervisor.name}</p>
          <p className="text-xs text-gray-500">{supervisor.agents} agents</p>
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
  );
}

function AgentRow({ agent }: { agent: UserData }) {
  return (
    <div className="flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-3">
        <UserCircle size={32} className="text-black" />
        <div>
          <p className="text-gray-800 font-medium">{agent.name}</p>
          <p className="text-xs text-gray-500">{agent.agents} agents</p>
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
  );
}
