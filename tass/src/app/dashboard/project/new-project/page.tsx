"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface ProjectForm {
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  start_datetime: string;
  end_datetime: string;
}

const NewProjectForm: React.FC = () => {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    priority: "medium",
    start_datetime: "",
    end_datetime: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { accessToken, BASE_URL, refreshUser, user } = useAuth(true);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!accessToken) {
        await refreshUser();
      }

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
          // Convert datetime-local to YYYY-MM-DD
          start_datetime: form.start_datetime ? form.start_datetime.split("T")[0] : null,
          end_datetime: form.end_datetime ? form.end_datetime.split("T")[0] : null,
          created_by: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Project created successfully!");
        console.log("API Response:", data.data);
        setForm({
          name: "",
          description: "",
          priority: "medium",
          start_datetime: "",
          end_datetime: "",
        });
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      setMessage("An error occurred while creating the project.");
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
    });
    setMessage(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded shadow-md mt-12"
    >
      <h1 className="flex items-center gap-2 text-xl font-semibold mb-4">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer hover:text-gray-600"
          onClick={() => router.back()}
        />
        New Project
      </h1>

      {message && (
        <div
          className={`p-3 rounded ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Project Name */}
      <div className="flex flex-col">
        <label htmlFor="name" className="font-medium mb-1">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Mobile App Development"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label htmlFor="description" className="font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Describe your project here..."
          required
        />
      </div>

      {/* Start Datetime */}
      <div className="flex flex-col">
        <label htmlFor="start_datetime" className="font-medium mb-1">
          Start Date & Time
        </label>
        <input
          type="datetime-local"
          id="start_datetime"
          name="start_datetime"
          value={form.start_datetime}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* End Datetime */}
      <div className="flex flex-col">
        <label htmlFor="end_datetime" className="font-medium mb-1">
          End Date & Time
        </label>
        <input
          type="datetime-local"
          id="end_datetime"
          name="end_datetime"
          value={form.end_datetime}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col">
        <label htmlFor="priority" className="font-medium mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-8 py-1 border border-orange-500 text-orange-500 rounded-2xl hover:bg-orange-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-1 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 focus:outline-none disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default NewProjectForm;
