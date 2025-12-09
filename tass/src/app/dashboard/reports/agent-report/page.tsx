"use client";

import * as React from "react";
import { Search } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";

/* Types */
type Tester = {
  name: string;
  status: "Active" | "Inactive";
  dailyTaskCompletion: number;
  accuracy: string;
  submissionTimeliness: "On-time" | "Late";
  availability: "Active" | "Inactive";
  consistency: number;
  testTitle: string;
  resultStatus: "Pass" | "Fail";
  dateTime: string;
  evidence: string;
  amountEarned: number;
};

type Project = {
  name: string;
  testers: Tester[];
};

/* Data */
const projects: Project[] = [
  {
    name: "Project Alpha",
    testers: [
      {
        name: "Kola Adebayo",
        status: "Active",
        dailyTaskCompletion: 92,
        accuracy: "High",
        submissionTimeliness: "On-time",
        availability: "Active",
        consistency: 88,
        testTitle: "Login Functionality",
        resultStatus: "Pass",
        dateTime: "2025-11-10 09:40 AM",
        evidence: "login_success.png",
        amountEarned: 2000,
      },
      {
        name: "Tina Gomez",
        status: "Active",
        dailyTaskCompletion: 85,
        accuracy: "High",
        submissionTimeliness: "On-time",
        availability: "Active",
        consistency: 80,
        testTitle: "Signup Validation",
        resultStatus: "Fail",
        dateTime: "2025-11-10 10:10 AM",
        evidence: "signup_test.png",
        amountEarned: 1800,
      },
      {
        name: "Tiwa Gomez",
        status: "Active",
        dailyTaskCompletion: 85,
        accuracy: "High",
        submissionTimeliness: "On-time",
        availability: "Active",
        consistency: 80,
        testTitle: "Signup Validation",
        resultStatus: "Pass",
        dateTime: "2025-11-10 10:10 AM",
        evidence: "signup_test.png",
        amountEarned: 1800,
      },
      {
        name: "Gomez paul",
        status: "Active",
        dailyTaskCompletion: 85,
        accuracy: "High",
        submissionTimeliness: "On-time",
        availability: "Active",
        consistency: 80,
        testTitle: "Signup Validation",
        resultStatus: "Fail",
        dateTime: "2025-11-10 10:10 AM",
        evidence: "signup_test.png",
        amountEarned: 1800,
      },
    ],
  },
  {
    name: "Payment Integration",
    testers: [
      {
        name: "Jayden Lee",
        status: "Active",
        dailyTaskCompletion: 91,
        accuracy: "High",
        submissionTimeliness: "On-time",
        availability: "Active",
        consistency: 87,
        testTitle: "Checkout Flow",
        resultStatus: "Pass",
        dateTime: "2025-11-04 09:00 AM",
        evidence: "checkout.png",
        amountEarned: 2050,
      },
    ],
  },
];

/* UI helpers */
function ProgressBar({ value }: { value: number }) {
  const color =
    value >= 80 ? "bg-orange-500" : value >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full max-w-[200px]">
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${color} h-full`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-600 text-right">{value}%</div>
    </div>
  );
}

/* Component */
export default function AgentReportPage(): React.ReactElement {
  const [query, setQuery] = React.useState("");
  const [filterProject, setFilterProject] = React.useState<string>("Project");
  const [filterAgent, setFilterAgent] = React.useState<string>("Agent");
  const [filterStatus, setFilterStatus] = React.useState<string>("All");

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);

  // Flatten all project + testers into rows
  const allRows = React.useMemo(
    () =>
      projects.flatMap((p) =>
        p.testers.map((t) => ({
          project: p.name,
          tester: t,
        }))
      ),
    []
  );

  // Dropdown options
  const projectOptions = React.useMemo(
    () => ["Project", ...projects.map((p) => p.name)],
    []
  );
  const agentOptions = React.useMemo(
    () => ["Agent", ...Array.from(new Set(allRows.map((r) => r.tester.name)))],
    [allRows]
  );

  // Filtering logic
  const filteredRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRows.filter(({ project, tester }) => {
      if (filterProject !== "Project" && project !== filterProject) return false;
      if (filterAgent !== "Agent" && tester.name !== filterAgent) return false;
      if (filterStatus !== "All" && tester.resultStatus !== filterStatus)
        return false;
      if (!q) return true;
      return (
        project.toLowerCase().includes(q) ||
        tester.name.toLowerCase().includes(q) ||
        tester.testTitle.toLowerCase().includes(q)
      );
    });
  }, [allRows, filterProject, filterAgent, filterStatus, query]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize);

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen bg-[#fafafb] mt-3">
      <h1 className="text-sm font-medium text-[#E95D28] border-b border-b-orange-500 pb-1 inline-block">
        Agents Report
      </h1>
      <p className="text-sm text-gray-600 mb-4 mt-3">
        Review and manage detailed reports of agent performance across projects.
      </p>

      {/* Search */}
      <div className="mb-4 relative max-w-[538px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search project, agent, or test"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-4">
        <select
          value={filterProject}
          onChange={(e) => {
            setFilterProject(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {projectOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filterAgent}
          onChange={(e) => {
            setFilterAgent(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {agentOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="All">Status</option>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-[1300px] w-full text-sm">
          <thead className="bg-[#fafafb] text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left">
                <input type="checkbox" />
              </th>
              <th className="p-3 text-left">Project Name</th>
              <th className="p-3 text-left">Agent/Task Name</th>
              <th className="p-3 text-left">Daily Task Completion</th>
              <th className="p-3 text-left">Accuracy & Feedback</th>
              <th className="p-3 text-left">Timeliness</th>
              <th className="p-3 text-left">Availability</th>
              <th className="p-3 text-left">Consistency</th>
              <th className="p-3 text-left">Test Title</th>
              <th className="p-3 text-left">Result</th>
              <th className="p-3 text-left">Date/Time</th>
              <th className="p-3 text-left">Evidence</th>
              <th className="p-3 text-left">Amount Earned</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={14} className="p-6 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              visibleRows.map(({ project, tester }, idx) => (
                <tr key={`${project}-${tester.name}-${idx}`} className="border-t border-gray-200">
                  <td className="p-3" />
                  <td className="p-3 font-semibold text-gray-800">{project}</td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{tester.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <ProgressBar value={tester.dailyTaskCompletion} />
                  </td>
                  <td className="p-3">{tester.accuracy}</td>
                  <td className="p-3">{tester.submissionTimeliness}</td>
                  <td className="p-3">{tester.availability}</td>
                  <td className="p-3">
                    <ProgressBar value={tester.consistency} />
                  </td>
                  <td className="p-3">{tester.testTitle}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${tester.resultStatus === "Pass"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {tester.resultStatus}
                    </span>
                  </td>
                  <td className="p-3">{tester.dateTime}</td>
                  <td className="p-3">
                    <a href="#" className="text-[#E95D28] underline text-sm">
                      {tester.evidence}
                    </a>
                  </td>
                  <td className="p-3">₦{tester.amountEarned.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <button className="text-gray-700 font-semibold text-sm flex items-center gap-1">
                        View
                      </button>
                      <button className="text-gray-700 font-semibold text-sm flex items-center gap-1">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 text-sm text-gray-600">
        <Pagination
          totalPages={totalPages}
          initialPage={currentPage}
          initialPageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </main>
  );
}
