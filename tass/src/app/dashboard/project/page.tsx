"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import { useAuth } from "@/app/hooks/useAuth";
import toast, { Toaster } from "react-hot-toast"; // Import toast

interface Project {
  project_id: string;
  name: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  owner: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export default function ProjectsTable() {
  const { BASE_URL, accessToken } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch projects
  const fetchProjects = async () => {
    if (!BASE_URL || !accessToken) return;

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/projects/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("SERVER ERROR:", await response.text());
        throw new Error("Failed to fetch projects");
      }

      const data: ApiResponse = await response.json();
      setProjects(data.results || []);
      setTotalCount(data.count || 0);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [BASE_URL, accessToken]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProjects = projects.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateString: string) => dateString ? dateString.split("T")[0] : "";

  // Delete project with toast notification
  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete");

      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
      setTotalCount((c) => c - 1);

      toast.success("Project deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading projects…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-100 p-4 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 mt-5">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between mb-6">
        <h2 className="font-semibold text-lg">All Projects</h2>
        <Link href="/dashboard/project/new-project">
          <button className="border border-orange-400 text-orange-500 px-4 py-2 font-semibold rounded-lg hover:bg-orange-50">
            Add Project
          </button>
        </Link>
      </div>

      <div className="overflow-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-black">
              <th className="px-3 py-2"><input type="checkbox" /></th>
              <th className="px-3 py-2 text-left font-semibold">S/N</th>
              <th className="px-3 py-2 text-left font-semibold">Project ID</th>
              <th className="px-3 py-2 text-left font-semibold">Project Name</th>
              <th className="px-3 py-2 text-left font-semibold">Description</th>
              <th className="px-3 py-2 text-left font-semibold min-w-[100px]">Start Date</th>
              <th className="px-3 py-2 text-left font-semibold min-w-[100px]">Deadline</th>
              {/* <th className="px-3 py-2 text-left font-semibold">Assigned Agents</th>
              <th className="px-3 py-2 text-left font-semibold">Test Cases</th> */}
              <th className="px-3 py-2 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8">
                  No projects found.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project, i) => (
                <tr key={project.project_id} className=" hover:bg-gray-50">
                  <td className="px-3 py-2"><input type="checkbox" /></td>
                  <td className="px-3 py-2">{startIndex + i + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-800">{project.project_id}</td>
                  <td className="px-3 py-2 font-medium">{project.name}</td>
                  <td className="px-3 py-2 max-w-xs truncate">{project.description}</td>
                  <td className="px-3 py-2">{formatDate(project.start_datetime)}</td>
                  <td className="px-3 py-2">{formatDate(project.end_datetime)}</td>
                  {/* <td className="px-3 py-2 text-center">0</td>
                  <td className="px-3 py-2 text-center">0</td> */}
                  <td className="px-3 py-2 flex gap-2">
                    <Link
                      href={`/dashboard/project/${project.project_id}`}
                      className="text-orange-500 text-xs hover:underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(project.project_id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {projects.length > 0 && (
        <div className="flex justify-end mt-6">
          <Pagination
            totalPages={totalPages}
            initialPage={currentPage}
            initialPageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}
    </div>
  );
}
