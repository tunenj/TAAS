"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Priority = "Low" | "Medium" | "High";

interface ProjectForm {
    projectName: string;
    projectId: string;
    startDate: string;
    endDate: string;
    priority: Priority;
    description: string;
}

const NewProjectForm: React.FC = () => {
    const [form, setForm] = useState<ProjectForm>({
        projectName: "",
        projectId: "",
        startDate: "",
        endDate: "",
        priority: "Medium",
        description: "",
    });

    const router = useRouter();

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", form);
    };

    const handleCancel = () => {
        // Reset form or handle cancel action
        setForm({
            projectName: "",
            projectId: "",
            startDate: "",
            endDate: "",
            priority: "Medium",
            description: "",
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto p-6 space-y-6 bg-white rounded shadow-md mt-6"
        >
            <h1 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <ArrowLeft
                    className="w-5 h-5 cursor-pointer hover:text-gray-600"
                    onClick={() => router.back()}
                />
                New Project
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col">
                    <label htmlFor="projectName" className="font-medium mb-1">
                        Project Name
                    </label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={form.projectName}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Mobile App Development"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="projectId" className="font-medium mb-1">
                        Project ID
                    </label>
                    <input
                        type="text"
                        id="projectId"
                        name="projectId"
                        value={form.projectId}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="PRJ-001"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="startDate" className="font-medium mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="endDate" className="font-medium mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

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
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

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
                    placeholder="Comprehensive testing of the new mobile application for iOS and Android platforms."
                />
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
                    className="px-8 py-1 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 focus:outline-none"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default NewProjectForm;
