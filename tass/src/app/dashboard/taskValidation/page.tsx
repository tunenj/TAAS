'use client';

import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import Image from 'next/image';
import Pagination from '@/components/Pagination/Pagination';

interface TaskCase {
  name: string;
  status: 'Pass' | 'Fail';
  date: string;
  evidence: string;
}

interface Task {
  projectName: string;
  taskTitle: string;
  agentsAssigned: string[];
  cases: TaskCase[];
}

const allTasks: Task[] = [
  {
    projectName: 'Zigi',
    taskTitle: 'Landing Page',
    agentsAssigned: ['Emily Carter', 'Nally Kris', 'Emma Jones', 'Forbes Jude'],
    cases: [
      { name: 'Yello Icon 7zigar MTN online assistant', status: 'Pass', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
      { name: 'Start a New Conversation', status: 'Fail', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
      { name: 'Messenger login', status: 'Fail', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
      { name: 'WhatsApp login redirects to Chat', status: 'Pass', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
      { name: 'Telegram icon', status: 'Pass', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
      { name: 'myMTNApp icon', status: 'Pass', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
      { name: 'Navigation & command recognition', status: 'Pass', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
      { name: 'MTNFront Banner', status: 'Pass', date: '2025-07-12 04:03pm', evidence: 'login_successEvidence.png' },
    ],
  },
  {
    projectName: 'MTN Business Suite',
    taskTitle: 'Admin Dashboard',
    agentsAssigned: ['Tina Gomez', 'Kola Adebayo'],
    cases: [
      { name: 'Login Functionality', status: 'Pass', date: '2025-08-01 09:45am', evidence: 'login_evidence.png' },
      { name: 'Add New User', status: 'Pass', date: '2025-08-01 09:47am', evidence: 'add_user.png' },
      { name: 'Delete User Action', status: 'Fail', date: '2025-08-01 09:49am', evidence: 'delete_error.png' },
      { name: 'View Reports', status: 'Pass', date: '2025-08-01 10:00am', evidence: 'reports.png' },
      { name: 'Download CSV', status: 'Fail', date: '2025-08-01 10:02am', evidence: 'download_error.png' },
    ],
  },
  {
    projectName: 'Zigi Audit',
    taskTitle: 'Functional Test',
    agentsAssigned: ['Emmanuel Duke', 'Sarah Cole'],
    cases: [
      { name: 'Chat UI Rendering', status: 'Pass', date: '2025-09-05 02:20pm', evidence: 'chat_ui.png' },
      { name: 'Bot Response Speed', status: 'Fail', date: '2025-09-05 02:23pm', evidence: 'bot_delay.png' },
      { name: 'Voice Assistant', status: 'Pass', date: '2025-09-05 02:25pm', evidence: 'voice_response.png' },
      { name: 'Quick Command Recognition', status: 'Pass', date: '2025-09-05 02:30pm', evidence: 'commands.png' },
    ],
  },
];

const PAGE_SIZE = 2; // show 2 tasks per page

const TaskValidationTable = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allTasks.length / PAGE_SIZE);
  const currentTasks = allTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 bg-white overflow-x-auto mt-5">
      <h2 className="text-lg font-semibold mb-4">Task Validation</h2>

      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Select</th>
            <th className="px-4 py-2 text-left">Project Name</th>
            <th className="px-4 py-2 text-left">Task/Test Title</th>
            <th className="px-4 py-2 text-left min-w-[200px]">Agent/Tester Assigned</th>
            <th className="px-4 py-2 text-left min-w-[250px]">Task/Test Cases</th>
            <th className="px-4 py-2 text-left min-w-[150px]">Result Status</th>
            <th className="px-4 py-2 text-left min-w-[200px]">Date/Time</th>
            <th className="px-4 py-2 text-left min-w-[200px]">Evidence</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentTasks.map((task, idx) => (
            <React.Fragment key={idx}>
              {task.cases.map((c, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                  {index === 0 && (
                    <>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top">
                        <input type="checkbox" />
                      </td>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top font-medium text-gray-800">
                        {task.projectName}
                      </td>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top">
                        {task.taskTitle}
                      </td>
                      <td rowSpan={task.cases.length} className="px-4 py-2 align-top space-y-2">
                        {task.agentsAssigned.map((agent, i) => (
                          <p key={i}>{agent}</p>
                        ))}
                      </td>
                    </>
                  )}

                  <td className="px-4 py-2 text-gray-700">{c.name}</td>

                  <td className="px-4 py-2 flex items-center gap-2">
                    {c.status === 'Pass' ? (
                      <>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white text-green-700 border border-green-400">
                          Pass
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white text-green-700 border border-green-400">
                          Yes
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white text-red-700 border border-red-400">
                          Fail
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white text-red-700 border border-red-400">
                          No
                        </span>
                      </>
                    )}
                  </td>

                  <td className="px-4 py-2 text-gray-600">{c.date}</td>

                  <td className="px-4 py-2 flex items-center gap-2">
                    <Image
                      src="/icons/receipt.png"
                      alt="evidence"
                      width={130}
                      height={100}
                      className="rounded-md"
                    />
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      <Download className="w-4 h-4" />
                    </a>
                    <a href="/dashboard/admin/task-details" className="text-gray-600 hover:text-gray-800">
                      <Eye className="w-5 h-5" />
                    </a>
                  </td>

                  <td className="px-4 py-2">
                    <button className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition">
                      Validate
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6">
        <Pagination totalPages={totalPages} initialPage={page} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default TaskValidationTable;
