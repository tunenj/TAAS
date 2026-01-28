"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import toast from "react-hot-toast";

interface ProjectForm {
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  start_datetime: string;
  end_datetime: string;
  status: "open" | "close";
}

const NewProjectForm: React.FC = () => {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    priority: "medium",
    start_datetime: "",
    end_datetime: "",
    status: "open",
  });

  const [loading, setLoading] = useState(false);

  const { accessToken, BASE_URL, refreshUser, user } = useAuth(true);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!accessToken) await refreshUser();

      const response = await fetch(`${BASE_URL}/projects/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          priority: form.priority,
          status: form.status,
          start_datetime: form.start_datetime
            ? form.start_datetime.split("T")[0]
            : null,
          end_datetime: form.end_datetime
            ? form.end_datetime.split("T")[0]
            : null,
          created_by: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Project created successfully. Redirecting...");
        setTimeout(() => router.push("/dashboard/project"), 800);
      } else {
        toast.error(data.message || "Failed to create project");
      }
    } catch (error) {
      console.error(error);
      toast.error("A server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: "",
      description: "",
      priority: "medium",
      start_datetime: "",
      end_datetime: "",
      status: "open",
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft
            className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            Create New Project
          </h1>
        </div>

        {/* Project Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-700 font-medium mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Mobile App Development"
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your project..."
            required
            className="border border-gray-300 rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="start_datetime" className="text-gray-700 font-medium mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              value={form.start_datetime}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="end_datetime" className="text-gray-700 font-medium mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="end_datetime"
              value={form.end_datetime}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
          </div>
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="priority" className="text-gray-700 font-medium mb-2">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="text-gray-700 font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            >
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectForm;
