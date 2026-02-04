"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Upload, ChevronRight, FolderOpen, FileText } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { toast, Toaster } from "react-hot-toast";

const priorities = ["High", "Medium", "Low"];
const environments = ["chrome", "firefox", "Edge"];
const task_type = ["Functionality", "Performance", "Security"];

interface ExcelTask {
  title: string;
  testCases: string[];
  status1: string[];
  status2: string[];
}

interface TestCase {
  description: string;
}

interface TestData {
  description: string;
}

interface ExpectedTestCase {
  description: string;
  expected_text: string;
}

// ✅ NEW TaskData interface matching the updated payload
interface TaskData {
  title: string;
  location: string;
  description: string;
  status: "open" | string;
  status_1: string;
  status_2: string;
  start_datetime: string;
  end_datetime: string;
  task_type: "functionality" | string;
  environment: "chrome" | string;
  version_build: string;
  requirement_id: string;
  setup_steps: string;
  test_cases: TestCase[];
  test_data: TestData[];
  expected_test_cases: ExpectedTestCase[];
}

// ✅ TRANSFERRED LOCATION HANDLING FUNCTIONS
// Function to capitalize first letter of location
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Function to format location properly (capitalize first letter of each word)
const formatLocation = (location: string): string => {
  if (!location) return "";

  // Split by common separators and capitalize first letter of each part
  return location
    .split(/[\s,\-]+/) // Split by space, comma, or hyphen
    .map(word => {
      // Handle special cases like "LGA" or abbreviations
      if (word.toUpperCase() === word) {
        return word; // Keep acronyms as-is
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

// Combined location formatting function
const capitalizeLocation = (location: string): string => {
  return formatLocation(location);
};

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
    description: "",
    testScript: "",
    expectedResult: "",
    versionBuild: "",
    requirementId: "",
    setupSteps: "",
    upload: undefined as File | undefined,
  });

  const [parsedTasks, setParsedTasks] = useState<ExcelTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;

    if (name === "upload" && files?.[0]) {
      const file = files[0];
      const allowedMimeTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      const allowedExtensions = ["csv", "xlsx"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (
        !allowedMimeTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension || "")
      ) {
        toast.error("Only CSV or Excel (.xlsx) files are allowed.");
        return;
      }

      setFileName(file.name);
      setIsProcessing(true);
      setForm((prev) => ({
        ...prev,
        upload: file,
      }));

      // Handle CSV separately
      if (fileExtension === "csv") {
        const reader = new FileReader();
        reader.onload = function (event) {
          try {
            const text = event.target?.result as string;
            const rows = text.split("\n").map((row) => {
              const result = [];
              let current = '';
              let inQuotes = false;

              for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                  result.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              result.push(current.trim());
              return result;
            });

            const tasks: ExcelTask[] = [];
            let currentTask: ExcelTask | null = null;

            for (let i = 2; i < rows.length; i++) {
              const row = rows[i];

              if (row.length >= 2) {
                let menu = row[1]?.replace(/"/g, '').trim();
                if (menu) {
                  menu = menu.replace(/[0-9]/g, '').replace(/\s+/g, ' ').trim();
                }
                
                const feature = row[2] ? row[2]?.replace(/"/g, '').trim() : "";
                const status1 = row[3] ? row[3]?.replace(/"/g, '').trim() : "";
                const status2 = row[4] ? row[4]?.replace(/"/g, '').trim() : "";

                if (menu && menu !== '' && menu.toLowerCase() !== 'menu') {
                  if (currentTask) {
                    tasks.push(currentTask);
                  }
                  currentTask = {
                    title: menu,
                    testCases: [],
                    status1: [],
                    status2: []
                  };

                  if (feature && feature !== '') {
                    currentTask.testCases.push(feature);
                    currentTask.status1.push(status1 || "");
                    currentTask.status2.push(status2 || "");
                  }
                } else if (currentTask) {
                  if (feature && feature !== '') {
                    currentTask.testCases.push(feature);
                    currentTask.status1.push(status1 || "");
                    currentTask.status2.push(status2 || "");
                  }
                }
              }
            }

            if (currentTask) {
              tasks.push(currentTask);
            }

            setParsedTasks(tasks);
            setIsProcessing(false);

            if (tasks.length > 0) {
              const formattedTestScript = tasks.map(task =>
                `${task.title}:\n${task.testCases.map(testCase => `  • ${testCase}`).join('\n')}`
              ).join('\n\n');

              const firstTitle = tasks[0].title;

              setForm(prev => ({
                ...prev,
                title: firstTitle,
                testScript: formattedTestScript
              }));

              toast.success(`Found ${tasks.length} tasks with ${tasks.reduce((sum, task) => sum + task.testCases.length, 0)} test cases`);
            } else {
              toast.error("No valid tasks found in the Excel file.");
            }
          } catch (error) {
            setIsProcessing(false);
            toast.error("Error processing CSV file");
            console.error(error);
          }
        };

        reader.onerror = () => {
          setIsProcessing(false);
          toast.error("Error reading CSV file");
        };

        reader.readAsText(file);
        return;
      }

      // Handle XLSX safely
      if (fileExtension === "xlsx") {
        import("xlsx").then((XLSX) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = e.target?.result as ArrayBuffer;
              const workbook = XLSX.read(data, { type: "array" });
              const sheet = workbook.Sheets[workbook.SheetNames[0]];

              const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" } as any) as string[][];

              const tasks: ExcelTask[] = [];
              let currentTask: ExcelTask | null = null;

              for (let i = 2; i < json.length; i++) {
                const row = json[i];

                if (row && row.length >= 2) {
                  let menu = row[1]?.toString().replace(/\0/g, "").trim();
                  if (menu) {
                    menu = menu.replace(/[0-9]/g, '').replace(/\s+/g, ' ').trim();
                  }
                  
                  const feature = row[2] ? row[2]?.toString().replace(/\0/g, "").trim() : "";
                  const status1 = row[3] ? row[3]?.toString().replace(/\0/g, "").trim() : "";
                  const status2 = row[4] ? row[4]?.toString().replace(/\0/g, "").trim() : "";

                  if (menu && menu !== '' && menu.toLowerCase() !== 'menu') {
                    if (currentTask) {
                      tasks.push(currentTask);
                    }
                    currentTask = {
                      title: menu,
                      testCases: [],
                      status1: [],
                      status2: []
                    };

                    if (feature && feature !== '') {
                      currentTask.testCases.push(feature);
                      currentTask.status1.push(status1 || "");
                      currentTask.status2.push(status2 || "");
                    }
                  } else if (currentTask) {
                    if (feature && feature !== '') {
                      currentTask.testCases.push(feature);
                      currentTask.status1.push(status1 || "");
                      currentTask.status2.push(status2 || "");
                    }
                  }
                }
              }

              if (currentTask) {
                tasks.push(currentTask);
              }

              setParsedTasks(tasks);
              setIsProcessing(false);

              if (tasks.length > 0) {
                const formattedTestScript = tasks.map(task =>
                  `${task.title}:\n${task.testCases.map(testCase => `  • ${testCase}`).join('\n')}`
                ).join('\n\n');

                const firstTitle = tasks[0].title;

                setForm(prev => ({
                  ...prev,
                  title: firstTitle,
                  testScript: formattedTestScript
                }));

                toast.success(`Found ${tasks.length} tasks with ${tasks.reduce((sum, task) => sum + task.testCases.length, 0)} test cases`);
              } else {
                toast.error("No valid tasks found in the Excel file.");
              }
            } catch (error) {
              setIsProcessing(false);
              toast.error("Error processing Excel file");
              console.error(error);
            }
          };

          reader.onerror = () => {
            setIsProcessing(false);
            toast.error("Error reading Excel file");
          };

          reader.readAsArrayBuffer(file);
        }).catch(() => {
          setIsProcessing(false);
          toast.error("Failed to load Excel parser");
        });
        return;
      }
    }

    // ✅ TRANSFERRED LOCATION HANDLING - Special handling for location field
    if (name === "location") {
      // Format the location as user types
      const formattedLocation = formatLocation(value);
      setForm((prev) => ({
        ...prev,
        [name]: formattedLocation,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const createMultipleTasks = async () => {
    if (!form.projectId) {
      toast.error("Project ID is required.");
      return;
    }

    setIsProcessing(true);

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const task of parsedTasks) {
      const url = `${BASE_URL}/projects/${form.projectId}/tasks/create/`;

      // ✅ TRANSFERRED LOCATION HANDLING - Ensure location is properly formatted
      const formattedLocation = formatLocation(form.location);
      
      // ✅ Prepare test cases from Excel data
      const testCasesForBackend: TestCase[] = task.testCases.map((testCase) => ({
        description: testCase.trim()
      }));
      
      // ✅ Prepare test_data from status1 and status2
      const testDataForBackend: TestData[] = task.testCases.map((_, index) => ({
        description: `${task.status1[index] || ""} ${task.status2[index] || ""}`.trim() || "Test data placeholder"
      }));
      
      // ✅ Prepare expected test cases from expectedResult
      const expectedTestCasesArray = form.expectedResult
        .split('\n')
        .filter(line => line.trim())
        .map(line => ({
          description: line.trim(),
          expected_text: line.trim() // Using same value for expected_text
        }));

      // If no expected test cases are provided, create from test cases
      const expectedTestCasesForBackend: ExpectedTestCase[] = expectedTestCasesArray.length > 0 
        ? expectedTestCasesArray 
        : task.testCases.map(testCase => ({
            description: testCase.trim(),
            expected_text: testCase.trim()
          }));

      // ✅ Create the task data object matching the updated schema
      const taskData: TaskData = {
        title: task.title,
        location: formattedLocation,
        description: form.description || task.testCases.join("\n"),
        status: "open",
        status_1: task.status1.join(", ") || "Pending",
        status_2: task.status2.join(", ") || "Pending",
        start_datetime: form.startDateTime 
          ? new Date(form.startDateTime).toISOString()
          : new Date().toISOString(),
        end_datetime: form.endDateTime 
          ? new Date(form.endDateTime).toISOString()
          : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        task_type: form.taskType.toLowerCase() || "functionality",
        environment: form.environment.toLowerCase() || "chrome",
        version_build: form.versionBuild || "1.0.0",
        requirement_id: form.requirementId || `REQ-${Date.now()}`,
        setup_steps: form.setupSteps || "Standard setup procedure",
        test_cases: testCasesForBackend,
        test_data: testDataForBackend,
        expected_test_cases: expectedTestCasesForBackend
      };

      console.log("Sending task data:", JSON.stringify(taskData, null, 2));

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        const responseData = await res.json();
        
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
          errors.push(`${task.title}: ${responseData.message || JSON.stringify(responseData)}`);
        }
      } catch (error: any) {
        failCount++;
        errors.push(`${task.title}: ${error.message || 'Network error'}`);
      }
    }

    setIsProcessing(false);

    if (failCount === 0 && successCount > 0) {
      toast.success(`Successfully created ${successCount} tasks!`);
      resetForm();
      router.push("/dashboard/assignTask");
    } else if (successCount > 0) {
      toast.success(`Created ${successCount} tasks, ${failCount} failed.`);
      resetForm();
      router.push("/dashboard/assignTask");
    } else {
      toast.error(`Failed to create tasks. ${errors[0] || 'Please try again.'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.projectId) {
      toast.error("Project ID is required.");
      return;
    }

    if (!form.title) {
      toast.error("Title is required.");
      return;
    }

    // ✅ TRANSFERRED LOCATION HANDLING - Ensure location is properly formatted before submitting
    if (form.location) {
      const formattedLocation = formatLocation(form.location);
      setForm(prev => ({ ...prev, location: formattedLocation }));
    }

    if (parsedTasks.length > 0) {
      await createMultipleTasks();
    } else {
      await createSingleTask();
    }
  };

  const createSingleTask = async () => {
    const url = `${BASE_URL}/projects/${form.projectId}/tasks/create/`;

    // ✅ TRANSFERRED LOCATION HANDLING - Format location before sending
    const formattedLocation = formatLocation(form.location);

    // ✅ Parse test cases from testScript
    const testCasesArray: TestCase[] = form.testScript.split("\n")
      .filter(line => line.trim() && line.includes("•"))
      .map(line => ({
        description: line.replace(/^[•\-\*]\s*/, "").trim()
      }));

    // ✅ Create test_data array (using status from Excel or default)
    const testDataArray: TestData[] = testCasesArray.map(() => ({
      description: "Test data placeholder"
    }));

    // ✅ Parse expected test cases from expectedResult
    const expectedTestCasesArray: ExpectedTestCase[] = form.expectedResult
      .split('\n')
      .filter(line => line.trim())
      .map(line => ({ 
        description: line.trim(),
        expected_text: line.trim()
      }));

    // If no expected test cases are provided, create from test cases
    const expectedTestCasesForBackend: ExpectedTestCase[] = expectedTestCasesArray.length > 0 
      ? expectedTestCasesArray 
      : testCasesArray.map(testCase => ({
          description: testCase.description,
          expected_text: testCase.description
        }));

    // ✅ Create the task data object matching the updated schema
    const taskData: TaskData = {
      title: form.title,
      location: formattedLocation,
      description: form.description || form.testScript,
      status: "open",
      status_1: "Pending",
      status_2: "Pending",
      start_datetime: form.startDateTime 
        ? new Date(form.startDateTime).toISOString()
        : new Date().toISOString(),
      end_datetime: form.endDateTime 
        ? new Date(form.endDateTime).toISOString()
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      task_type: form.taskType.toLowerCase() || "functionality",
      environment: form.environment.toLowerCase() || "chrome",
      version_build: form.versionBuild || "1.0.0",
      requirement_id: form.requirementId || `REQ-${Date.now()}`,
      setup_steps: form.setupSteps || "Standard setup procedure",
      test_cases: testCasesArray,
      test_data: testDataArray,
      expected_test_cases: expectedTestCasesForBackend
    };

    console.log("Sending single task data:", JSON.stringify(taskData, null, 2));

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || JSON.stringify(responseData));
      }

      console.log("Task created response:", responseData);
      
      toast.success("Task created successfully!");
      resetForm();
      router.push("/dashboard/assignTask");
    } catch (err: any) {
      console.error("Error creating task:", err);
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      projectId: "",
      startDateTime: "",
      endDateTime: "",
      priority: "High",
      taskType: "",
      environment: "",
      location: "",
      description: "",
      testScript: "",
      expectedResult: "",
      versionBuild: "",
      requirementId: "",
      setupSteps: "",
      upload: undefined,
    });
    setParsedTasks([]);
    setFileName("");
  };

  return (
    <main className="flex flex-col px-4 sm:px-6 md:px-8 py-8 mt-2">
      <Toaster />

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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6"
      >
        {fileName && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{fileName}</span>
              </div>
              {parsedTasks.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {parsedTasks.length} tasks, {parsedTasks.reduce((sum, task) => sum + task.testCases.length, 0)} test cases
                </span>
              )}
            </div>
            {parsedTasks.length > 0 && (
              <div className="mt-2 text-xs text-blue-600">
                First task "<span className="font-semibold">{parsedTasks[0]?.title}</span>" will be created
                {parsedTasks.length > 1 && ` along with ${parsedTasks.length - 1} more tasks`}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleInput}
              placeholder="Menu/Module Name"
              className="w-full border border-gray-300 placeholder-gray-500 rounded px-3 py-2 text-sm"
              required
            />
            {parsedTasks.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                First of {parsedTasks.length} tasks from Excel
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Project ID *
            </label>
            <input
              name="projectId"
              value={form.projectId}
              onChange={handleInput}
              placeholder="Enter Project ID"
              className="w-full border border-gray-300 placeholder-gray-500 rounded px-3 py-2 text-sm"
              required
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
              Task Type *
            </label>
            <select
              name="taskType"
              value={form.taskType}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="" className="text-gray-500">Please select</option>
              {task_type.map((item) => (
                <option key={item} value={item.toLowerCase()}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Environment *
            </label>
            <select
              name="environment"
              value={form.environment}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="" className="text-gray-500">Please select</option>
              {environments.map((item) => (
                <option key={item} value={item.toLowerCase()}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleInput}
              placeholder="Enter location (e.g., Lagos, Ogun)"
              className="w-full border border-gray-300 placeholder-gray-500 rounded px-3 py-2 text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.location 
                ? `Will be saved as: ${formatLocation(form.location)}`
                : "Enter location for agent assignment"}
            </p>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-semibold text-sm">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInput}
            className="w-full border border-gray-300 placeholder-gray-500 rounded px-3 py-2 text-sm min-h-[80px]"
            placeholder="Task description (optional, will be auto-filled from Excel)"
          />
          <p className="text-xs text-gray-500 mt-1">
            General description of the task. Auto-filled from Excel upload.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-gray-700 font-semibold text-sm">
              Test Script *
            </label>
            {form.testScript && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  {parsedTasks.length > 0
                    ? `${parsedTasks.reduce((sum, task) => sum + task.testCases.length, 0)} cases`
                    : `${form.testScript.split('\n').filter(line => line.includes('•')).length} test cases`
                  }
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <textarea
              name="testScript"
              value={form.testScript}
              onChange={handleInput}
              className="w-full border border-gray-300 placeholder-gray-500 rounded px-3 py-2 min-h-[250px] font-mono text-sm"
              placeholder="Test cases will appear here in bullet format after uploading Excel file. Each line starting with • will be a test case."
              required
              style={{ whiteSpace: 'pre' }}
            />
            {parsedTasks.length > 0 && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded border">
                  <FolderOpen size={12} className="text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">
                    {parsedTasks.length} menus
                  </span>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Each line starting with • will be converted to a test case. Format: • Test case description
          </p>
        </div>

        {parsedTasks.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ChevronRight size={16} className="text-orange-500" />
              Tasks from Excel ({parsedTasks.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {parsedTasks.map((task, index) => (
                <div key={index} className={`border rounded-lg p-3 ${index === 0 ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {task.title}
                    </h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {task.testCases.length} cases
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1 max-h-20 overflow-y-auto">
                    {task.testCases.slice(0, 3).map((testCase, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span className="truncate">{testCase}
                          {task.status1[idx] && <span className="text-green-600 ml-1">[{task.status1[idx]}]</span>}
                          {task.status2[idx] && <span className="text-blue-600 ml-1">[{task.status2[idx]}]</span>}
                        </span>
                      </div>
                    ))}
                    {task.testCases.length > 3 && (
                      <div className="text-gray-500 italic">
                        +{task.testCases.length - 3} more...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              All {parsedTasks.length} tasks will be created with the project settings above.
              Status values from Excel will be used for status_1 and status_2 fields.
            </p>
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-1 font-semibold text-sm">
            Expected Test Cases *
          </label>
          <textarea
            name="expectedResult"
            value={form.expectedResult}
            onChange={handleInput}
            className="w-full border border-gray-300 placeholder-gray-500 rounded px-3 py-2 text-sm min-h-[120px]"
            placeholder="Enter expected test cases (one per line). Each line will be an expected test case with description and expected_text."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            These will be used as expected_test_cases in the backend. Each line will be converted to an expected test case with both description and expected_text.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-700 text-sm font-semibold">
              Upload Test Scripts (Excel/CSV) *
            </label>
            {isProcessing && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded animate-pulse">
                Processing...
              </span>
            )}
          </div>
          <div className="flex flex-col items-start">
            <label
              htmlFor="file-upload"
              className={`relative cursor-pointer px-6 py-2 rounded-md border ${isProcessing ? 'border-gray-300 text-gray-500' : 'border-orange-400 text-orange-500 hover:bg-orange-50'} bg-white text-sm transition w-fit font-medium flex items-center gap-2`}
            >
              <Upload size={16} />
              {isProcessing ? "Processing..." : "Upload Excel/CSV"}
              <input
                id="file-upload"
                type="file"
                name="upload"
                accept=".csv,.xlsx"
                onChange={handleInput}
                className="hidden"
                disabled={isProcessing}
                required
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Required. Upload Excel/CSV file containing test cases.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            className="px-6 py-2.5 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto text-sm font-medium"
            onClick={() => router.push("/dashboard/assignTask")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing || !form.upload || !form.projectId || !form.taskType || !form.environment || !form.location || !form.expectedResult}
            className={`px-6 py-2.5 rounded-2xl ${!form.upload || !form.projectId || !form.taskType || !form.environment || !form.location || !form.expectedResult ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'} text-white w-full sm:w-auto text-sm font-medium flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : parsedTasks.length > 1 ? (
              `Create ${parsedTasks.length} Tasks`
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </main>
  );
}