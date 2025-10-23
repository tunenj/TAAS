"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Upload } from "lucide-react";

const priorities = ["High", "Medium", "Low"];
const projects = ["Project Alpha", "Project Beta", "Project Gamma"];
const taskTypes = ["Feature", "Bug", "Test", "Improvement"];
const environments = ["Development", "QA", "Production"];
const locations = ["Lagos", "Abuja", "Remote"];

export default function CreateTaskPage() {
  const pathname = usePathname();

  const tabs = [
    { name: "Create Task", href: "/dashboard/createTask" },
    { name: "Assign Task", href: "/dashboard/assignTask" },
    { name: "Assigned Task", href: "/dashboard/assignedTask" },
  ];

  const [form, setForm] = useState({
    title: "",
    taskId: "",
    startDateTime: "",
    endDateTime: "",
    project: "",
    priority: "High",
    taskType: "",
    environment: "",
    location: "",
    testScript: "",
    expectedResult: "",
    upload: undefined as File | undefined,
  });

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <main className="flex flex-col px-4 sm:px-6 md:px-8 py-8 mt-2">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-4 text-sm gap-2 sm:gap-4">
        {tabs.map((tab) => {
          // Default to "Create Task" if pathname doesn't match any tab
          const isActive =
            pathname === tab.href ||
            (tab.name === "Create Task" && pathname === "/dashboard/createTask");

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`px-3 sm:px-4 py-2 focus:outline-none ${
                isActive
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-orange-500"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Form */}
      <form className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleInput}
              placeholder="Mobile App Development"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Task ID
            </label>
            <input
              name="taskId"
              value={form.taskId}
              onChange={handleInput}
              placeholder="TSK-001"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Start Date/Time
            </label>
            <input
              name="startDateTime"
              type="datetime-local"
              value={form.startDateTime}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              End Date/Time
            </label>
            <input
              name="endDateTime"
              type="datetime-local"
              value={form.endDateTime}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Assign to Project
            </label>
            <select
              name="project"
              value={form.project}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select projects</option>
              {projects.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              {["High", "Medium", "Low"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Task Type
            </label>
            <select
              name="taskType"
              value={form.taskType}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Please select</option>
              {taskTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Environment
            </label>
            <select
              name="environment"
              value={form.environment}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Please select</option>
              {environments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Location
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Please select</option>
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-semibold text-sm">
            Test Script
          </label>
          <textarea
            name="testScript"
            value={form.testScript}
            onChange={handleInput}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-semibold text-sm">
            Expected Result
          </label>
          <textarea
            name="expectedResult"
            value={form.expectedResult}
            onChange={handleInput}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Upload Test Scripts
          </label>
          <div className="flex flex-col items-start mt-2">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer px-6 py-1 rounded-md border border-orange-400 text-orange-500 bg-white text-sm hover:bg-orange-50 transition w-fit"
            >
              <Upload
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-500 pointer-events-none"
              />
              Upload Files
              <input
                id="file-upload"
                type="file"
                name="upload"
                onChange={handleInput}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-6 py-2 rounded-2xl border border-orange-400 text-orange-500 hover:bg-orange-50 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-2xl bg-orange-500 text-white hover:bg-orange-600 w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </form>
    </main>
  );
}
