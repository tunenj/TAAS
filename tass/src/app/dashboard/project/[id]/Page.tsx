"use client";

import React, { useState } from "react";
import { Pen, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectDetailsProps {
  projectName: string;
  projectId: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
}

// ✅ Using default props safely with Partial + defaults in the component
const ProjectDetailsPage: React.FC<Partial<ProjectDetailsProps>> = ({
  projectName = "Mobile App Development",
  projectId = "PRJ-001",
  description = "Comprehensive testing of the new mobile application for iOS and Android platforms.",
  startDate = "2025-01-15",
  endDate = "2025-03-15",
  priority = "High",
  status = "Open",
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [projectDetails, setProjectDetails] = useState({
    projectName,
    projectId,
    description,
    startDate,
    endDate,
    priority,
    status,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated project:", projectDetails);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProjectDetails({
      projectName,
      projectId,
      description,
      startDate,
      endDate,
      priority,
      status,
    });
  };

  return (
    <div className="mx-auto bg-white p-6 rounded shadow-md mt-16 -ml-8">
      {/* 🔙 Back Arrow and Title */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-gray-100 transition"
          title="Go back"
        >
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold">
          {isEditing ? "Edit Project" : "Project Details"}
        </h1>
      </div>

      {/* ✏️ Edit / Save toggle */}
      {!isEditing && (
        <button
          onClick={handleEditToggle}
          className="flex items-center justify-end text-sm text-orange-500 hover:underline gap-2 w-full mb-6"
        >
          Edit
          <Pen size={14} />
        </button>
      )}

      {isEditing ? (
        // 📝 Editable Form View
        <form className="space-y-6 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Project Name</label>
              <input
                name="projectName"
                value={projectDetails.projectName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Project ID</label>
              <input
                name="projectId"
                value={projectDetails.projectId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={projectDetails.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={projectDetails.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={projectDetails.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={projectDetails.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-1.5 border border-orange-500 text-orange-500 rounded-2xl hover:bg-orange-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-1.5 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        //Read-only View
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="col-span-1 space-y-4">
            <p>Project Name</p>
            <p>Project ID</p>
            <p>Description</p>
            <p>Start Date / End Date</p>
            <p>Priority</p>
            <p>Status</p>
          </div>

          <div className="col-span-2 space-y-4 text-black font-medium text-right">
            <p>{projectDetails.projectName}</p>
            <p>{projectDetails.projectId}</p>
            <p>{projectDetails.description}</p>
            <p>
              {projectDetails.startDate} / {projectDetails.endDate}
            </p>
            <p>{projectDetails.priority}</p>
            <p
              className={
                projectDetails.status.toLowerCase() === "open"
                  ? "text-green-600"
                  : "text-gray-800"
              }
            >
              {projectDetails.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
