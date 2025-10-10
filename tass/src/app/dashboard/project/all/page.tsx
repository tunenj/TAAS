// pages/projects.tsx
import ProjectsTable from "@/components/ProjectComponent/ProjectsTable";

export default function ProjectsPage() {
    return (
        <main className="min-h-screen bg-white p-6 mt-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">All Projects</h2>
                    <button className="border border-orange-500 text-orange-500 font-semibold rounded px-4 py-1 flex items-center hover:bg-orange-50 transition">
                        <span className="mr-1">+</span> Add Project
                    </button>
                </div>
                <ProjectsTable />
            </div>
        </main>
    );
}
