"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

interface Project {
  project_id: string;
  name: string;
  description: string;
  start_datetime?: string | null;
  end_datetime?: string | null;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  owner: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: Project;
  result?: Project;
  project?: Project;
}

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { BASE_URL, accessToken } = useAuth();

  const project_id = params?.project_id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    priority: "",
    status: "",
  });

  const formatDate = (date?: string | null) => date?.split("T")[0] || "";

  useEffect(() => {
    const fetchProject = async () => {
      if (!BASE_URL || !accessToken || !project_id) {
        setError("Missing required information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BASE_URL}/projects/${project_id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);

        const data: ApiResponse | Project = await res.json();

        const projectData: Project | null =
          "data" in data && data.data
            ? data.data
            : "result" in data && data.result
            ? data.result
            : "project" in data && data.project
            ? data.project
            : "project_id" in data
            ? (data as Project)
            : null;

        if (!projectData) throw new Error("Invalid project data format");

        setProject(projectData);
        setFormData({
          name: projectData.name,
          description: projectData.description,
          start_datetime: projectData.start_datetime || "",
          end_datetime: projectData.end_datetime || "",
          priority: projectData.priority,
          status: projectData.status,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load project";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [BASE_URL, accessToken, project_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!project || !BASE_URL || !accessToken) return;

    try {
      const res = await fetch(`${BASE_URL}/projects/${project_id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update project: ${text}`);
      }

      // Merge formData into project to ensure updated display
      const updated: Project = {
        ...project,
        ...formData,
      };

      setProject(updated);
      setIsEditing(false);
      toast.success("Project updated successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-orange-500 rounded-full mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg border">
          <p className="font-semibold">Error loading project</p>
          <p>{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-2 text-sm underline hover:text-red-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-yellow-100 text-yellow-600 px-4 py-3 rounded-lg border">
          <p className="font-semibold">Project not found</p>
          <button
            onClick={() => router.back()}
            className="mt-2 text-sm underline hover:text-yellow-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 mt-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Go back"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Project Details</h1>
          </div>
        </div>

        {/* Project Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Project ID</label>
                <p className="mt-1 font-semibold text-gray-900">{project.project_id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Project Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full border px-2 py-1 rounded"
                  />
                ) : (
                  <p className="mt-1 font-semibold text-lg text-gray-900">{project.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 w-full border px-2 py-1 rounded"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                    {project.description || "No description provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="start_datetime"
                      value={formData.start_datetime}
                      onChange={handleInputChange}
                      className="mt-1 w-full border px-2 py-1 rounded"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700">{formatDate(project.start_datetime)}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="end_datetime"
                      value={formData.end_datetime}
                      onChange={handleInputChange}
                      className="mt-1 w-full border px-2 py-1 rounded"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700">{formatDate(project.end_datetime)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  {isEditing ? (
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="mt-1 w-full border px-2 py-1 rounded"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  ) : (
                    <span
                      className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityClass(
                        project.priority
                      )}`}
                    >
                      {project.priority}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 w-full border px-2 py-1 rounded"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  ) : (
                    <span
                      className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Owner</label>
                <p className="mt-1 text-gray-700">{project.owner}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-gray-700">{formatDate(project.created_at)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-gray-700">{formatDate(project.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Projects
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Edit Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
