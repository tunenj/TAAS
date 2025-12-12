"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { toast, Toaster } from "react-hot-toast";

const priorities = ["High", "Medium", "Low"];
const projects = ["1", "2", "3"]; // Replace with actual project IDs
const environments = ["chrome", "firefox", "Edge"];
const task_type = ["Functionality", "Performance", "Security"];

export default function CreateTaskPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, BASE_URL } = useAuth(); 

  const tabs = [
    { name: "Create Task", href: "/dashboard/createTask" },
    { name: "Assign Task", href: "/dashboard/assignTask" },
    { name: "Assigned Task", href: "/dashboard/assignedTask" },
  ];

  const [form, setForm] = useState({
    title: "",
    projectId: "",
    startDateTime: "",
    endDateTime: "",
    priority: "High",
    taskType: "",
    environment: "",
    location: "",
    testScript: "",
    expectedResult: "",
    upload: undefined as File | undefined,
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;

    if (name === "upload" && files?.[0]) {
      const file = files[0];
      if (file.type !== "text/csv") {
        toast.error("Only CSV files are allowed!");
        return;
      }

      setForm((prev) => ({
        ...prev,
        upload: file,
      }));

      // Read CSV content to populate Test Script and Expected Result
      const reader = new FileReader();
      reader.onload = function (event) {
        const text = event.target?.result as string;
        const rows = text.split("\n").map((row) => row.split(","));
        const testScript = rows.map((r) => r[0] || "").join("\n");
        const expectedResult = rows.map((r) => r[1] || "").join("\n");
        setForm((prev) => ({
          ...prev,
          testScript,
          expectedResult,
        }));
      };
      reader.readAsText(file);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.projectId) {
      toast.error("Project ID is required.");
      return;
    }

    const url = `${BASE_URL}/projects/${form.projectId}/tasks/create/`;

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.testScript);
    fd.append("status", "open");
    fd.append("is_completed", "false");
    fd.append("start_datetime", form.startDateTime);
    fd.append("end_datetime", form.endDateTime);
    fd.append("is_assigned", "false");

    // Test cases
    fd.append(
      "test_cases",
      JSON.stringify([
        {
          description: form.testScript,
          task: form.title,
        },
      ])
    );

    // Test scripts CSV file
    if (form.upload) {
      fd.append("test_scripts", form.upload);
      fd.append("expected_scripts", form.upload);
    }

    // Send task_type as required by backend
    fd.append("task_type", form.taskType.toLowerCase());
    fd.append("environment", form.environment.toLowerCase());
    fd.append("location", form.location);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Task creation failed");

      toast.success("Task created successfully!");

      // Reset form
      setForm({
        title: "",
        projectId: "",
        startDateTime: "",
        endDateTime: "",
        priority: "High",
        taskType: "",
        environment: "",
        location: "",
        testScript: "",
        expectedResult: "",
        upload: undefined,
      });

      router.push("/dashboard/assignTask");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <main className="flex flex-col px-4 sm:px-6 md:px-8 py-8 mt-2">
      <Toaster />

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-4 text-sm gap-2 sm:gap-4">
        {tabs.map((tab) => {
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
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-4"
      >
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
              Project ID
            </label>
            <input
              name="projectId"
              value={form.projectId}
              onChange={handleInput}
              placeholder="Enter Project ID"
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
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              {priorities.map((item) => (
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
              {task_type.map((item) => (
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
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleInput}
              placeholder="Type location"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
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
            Upload Test Scripts (CSV only)
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
              Upload CSV
              <input
                id="file-upload"
                type="file"
                name="upload"
                accept=".csv"
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
