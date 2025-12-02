'use client';

import React from 'react';
import Image from 'next/image';
import { Search, Filter, Flag, Folder } from "lucide-react";

interface KpiProps {
  title: string;
  value: string;
  subtext: string;
  icon: string;
}

const KpiCard = ({ title, value, subtext, icon }: KpiProps) => (
  <div className="bg-white rounded shadow-sm p-4 border border-orange-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm text-black font-medium">{title}</p>
      <div className="w-8 h-8 flex items-center justify-center bg-orange-50 rounded-full">
        <Image src={icon} alt={title} width={16} height={16} />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{value}</h3>
    <p className="text-xs text-gray-400">{subtext}</p>
  </div>
);

const ActivityItem = ({ title, time, icon }: { title: string; time: string; icon: string }) => (
  <li className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 flex items-center justify-center bg-orange-50 rounded-full">
        <Image src={icon} alt={title} width={16} height={16} />
      </div>
      <span className="text-gray-700 text-sm md:text-base">{title}</span>
    </div>
    <span className="text-gray-400 text-xs md:text-sm">{time}</span>
  </li>
);

const DueItem = ({ title, due, icon }: { title: string; due: string; icon: string }) => (
  <li className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <Image src={icon} alt="Due" width={16} height={16} />
      <span className="text-gray-700 text-sm md:text-base">{title}</span>
    </div>
    <span className="text-gray-400 text-xs md:text-sm">{due}</span>
  </li>
);

const DashboardPage = () => {
  return (
      <div className="p-4 md:p-6 space-y-6 text-gray-800 mt-4 md:-ml-8">

        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-base md:text-lg text-black font-semibold">
            Hey Triston –{' '}
            <span className="text-gray-500 text-sm md:text-lg">
              here’s what your dashboard looks like today!
            </span>
          </h1>
        </div>

        {/* KPI Section */}
        <div>
          <h2 className="text-base md:text-lg font-semibold text-orange-500 mb-3">
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <KpiCard title="Daily Task Completion Rate" value="92%" subtext="+5% from last month" icon="/icons/daily.png" />
            <KpiCard title="Quality Score" value="4.7/5" subtext="Avg. across all reports" icon="/icons/quality.png" />
            <KpiCard title="Completed Tasks" value="75" subtext="Up by 13% from last week" icon="/icons/complete.png" />
            <KpiCard title="Delayed Tasks" value="18" subtext="Reduced by 21% this week" icon="/icons/delayed.png" />
            <KpiCard title="Compliance Adherence" value="99.5%" subtext="No critical violations" icon="/icons/compliance.png" />
            <KpiCard title="Assigned Tasks" value="85" subtext="Same this week" icon="/icons/assigned.png" />
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* My Tests */}
          <div className="col-span-2 bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h3 className="text-black font-semibold text-sm mb-2">My Test</h3>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search test cases"
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap justify-between sm:justify-end items-center gap-3 text-gray-700 text-sm">
                <div className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition">
                  <Filter size={16} />
                  <span>Status: All</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition">
                  <Flag size={16} />
                  <span>Priority</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition">
                  <Folder size={16} />
                  <span>Project</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 w-8"></th>
                    <th className="text-left py-3 font-semibold text-black">Test Case</th>
                    <th className="text-left py-3 font-semibold text-black">Project</th>
                    <th className="text-left py-3 font-semibold text-black">Status</th>
                    <th className="text-left py-3 font-semibold text-black">Priority</th>
                    <th className="text-left py-3 font-semibold text-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { test: "Checkout flow - guest user", project: "Web Platform", status: "In Progress", priority: "High", action: "Execute" },
                    { test: "Login with SSO", project: "Mobile App", status: "To Do", priority: "Medium", action: "Details" },
                    { test: "API rate limit handling", project: "API Services", status: "Completed", priority: "Low", action: "View" },
                    { test: "Profile update validations", project: "Web Platform", status: "In Progress", priority: "High", action: "Execute" }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="py-3 text-gray-900">{row.test}</td>
                      <td className="py-3 text-gray-600">{row.project}</td>
                      <td className="py-3 text-black text-xs">{row.status}</td>
                      <td className="py-3 text-black text-xs">{row.priority}</td>
                      <td className="py-3"><button className="px-3 py-1 text-black">{row.action}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-4">
              <button className="text-sm text-black font-medium hover:underline">View All</button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              <ActivityItem title="Marked 'rate limit handling' as Completed" time="2h ago" icon="/icons/marked.png" />
              <ActivityItem title="Raised defect 'Payment timeout on retry'" time="3h ago" icon="/icons/raised.png" />
              <ActivityItem title="Added 3 cases to 'Sprint 18'" time="5h ago" icon="/icons/added.png" />
              <ActivityItem title="Commented on 'Login with SSO'" time="8h ago" icon="/icons/commented.png" />
            </ul>
          </div>
        </div>

        {/* Due Soon */}
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 md:w-[401px] w-full">
          <h3 className="font-semibold text-gray-800 mb-3">Due Soon</h3>
          <ul className="space-y-3 text-sm">
            <DueItem icon="/icons/due.png" title="Complete 'Checkout flow - guest user'" due="Due in 1d" />
            <DueItem icon="/icons/due.png" title="Execute 'Login with SSO'" due="Due in 2d" />
            <DueItem icon="/icons/due.png" title="Start 'Mobile Smoke - v3.2'" due="Due in 3d" />
          </ul>
        </div>
      </div>
  );
};

export default DashboardPage;
