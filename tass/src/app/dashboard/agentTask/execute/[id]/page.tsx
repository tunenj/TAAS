'use client';

import React, { useEffect, useState } from "react";
import { Save, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

/* ================= TYPES ================= */

type TestCase = {
  id: number;
  description: string;
};

type Step = {
  id: number;
  description: string;
  evidence: string;
  note: string;
  access: boolean | null;
  pass: boolean | null;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    task_id: string;
    title: string;
    test_cases: TestCase[];
  };
};

/* ================= PAGE ================= */

export default function TestRunPage() {
  const { id: taskId } = useParams<{ id: string }>();
  const { BASE_URL, accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState("");
  const [allSteps, setAllSteps] = useState<Step[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STEPS_PER_PAGE = 3;

  /* ================= FETCH TASK ================= */

  useEffect(() => {
    if (!taskId || !accessToken) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${BASE_URL}/projects/tasks/${taskId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch task");
        }

        const result: ApiResponse = await res.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setTaskTitle(result.data.title);

        const mappedSteps: Step[] = result.data.test_cases.map(tc => ({
          id: tc.id,
          description: tc.description,
          evidence: "",
          note: "",
          access: null,
          pass: null,
        }));

        setAllSteps(mappedSteps);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, accessToken, BASE_URL]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(allSteps.length / STEPS_PER_PAGE);
  const startIndex = (currentPage - 1) * STEPS_PER_PAGE;
  const currentSteps = allSteps.slice(startIndex, startIndex + STEPS_PER_PAGE);
  const stepsPassed = allSteps.filter(step => step.pass === true).length;
  const stepsFailed = allSteps.filter(step => step.pass === false).length;

  /* ================= SAVE FUNCTION ================= */

  const handleSave = async () => {
    if (!accessToken) return;

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/projects/tasks/${taskId}/test-run/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_cases: allSteps.map(step => ({
            test_case_id: step.id,
            access: step.access,
            pass: step.pass,
            evidence: step.evidence,
            note: step.note,
          })),
        }),
      });

      if (res.ok) {
        // Data saved successfully
        console.log('Progress saved');
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  /* ================= SUBMIT ALL TEST CASES ================= */

  const handleSubmitAll = async () => {
    if (!accessToken) {
      alert("No access token available");
      return;
    }

    // Validate all steps have been completed
    const incompleteSteps = allSteps.filter(step => 
      step.pass === null || step.access === null
    );

    if (incompleteSteps.length > 0) {
      alert(`Please complete all test cases before submitting. ${incompleteSteps.length} steps are incomplete.`);
      return;
    }

    setSubmitting(true);
    try {
      // Submit each test case individually to the specified endpoint
      const submissionPromises = allSteps.map(async (step) => {
        const formData = new FormData();
        
        // Convert boolean values to string as expected by the API
        formData.append("result", step.pass ? "pass" : "fail");
        formData.append("test_status", step.pass ? "pass" : "fail");
        formData.append("duration", "33"); // You can calculate actual duration if needed
        formData.append("has_access", step.access ? "yes" : "no");
        
        // Note: Evidence handling might need adjustment based on your backend
        // The original code sent files, but your current UI only stores URLs
        if (step.evidence && step.evidence.startsWith('blob:')) {
          // Convert blob URL to file if needed
          try {
            const response = await fetch(step.evidence);
            const blob = await response.blob();
            const file = new File([blob], `evidence_${step.id}.png`, { type: blob.type });
            formData.append("files", file);
          } catch (err) {
            console.warn(`Could not convert evidence for test case ${step.id}:`, err);
          }
        }

        const res = await fetch(
          `${BASE_URL}/projects/tasks/test-cases/${step.id}/submit/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to submit test case ${step.id}`);
        }

        return res.json();
      });

      await Promise.all(submissionPromises);
      alert("Test run submitted successfully!");
      
      // Optional: Redirect or refresh data after successful submission
      // window.location.reload();
      
    } catch (err) {
      console.error('Submission failed:', err);
      alert(`Submission failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= NAVIGATION ================= */

  const goToPrevious = () => {
    handleSave();
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    handleSave();
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPage = (page: number) => {
    handleSave();
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  /* ================= FILE HANDLER ================= */

  const handleEvidenceUpload = (file: File, index: number) => {
    const imageUrl = URL.createObjectURL(file);
    const globalIndex = startIndex + index;

    setAllSteps(prev =>
      prev.map((step, i) =>
        i === globalIndex ? { ...step, evidence: imageUrl } : step
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-orange-500 rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col">
      {/* Breadcrumbs */}
      <div className="text-xs text-black mb-2">
        My Tasks &gt; {taskTitle} &gt; Execute
      </div>

      <h2 className="text-lg font-bold mb-4">
        Execute • {taskTitle}
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* ================= Execution Steps ================= */}
        <div className="md:col-span-2 bg-white p-6 rounded shadow">
          <div className="text-sm font-semibold mb-4 flex justify-between items-center">
            <span>Execution Steps</span>
            <span className="text-xs">
              {allSteps.length} steps · Page {currentPage} of {totalPages}
            </span>
          </div>

          {currentSteps.map((step, i) => {
            const globalIndex = startIndex + i;
            return (
              <div key={step.id} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">
                    {globalIndex + 1}. {step.description}
                  </div>

                  <div className="flex gap-6">
                    {/* Access */}
                    <div>
                      <div className="text-xs mb-2">Access</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setAllSteps(s =>
                              s.map((x, idx) =>
                                idx === globalIndex ? { ...x, access: true } : x
                              )
                            )
                          }
                          className={`px-2 py-0.5 rounded-full text-xs border ${
                            step.access === true
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() =>
                            setAllSteps(s =>
                              s.map((x, idx) =>
                                idx === globalIndex ? { ...x, access: false } : x
                              )
                            )
                          }
                          className={`px-2 py-0.5 rounded-full text-xs border ${
                            step.access === false
                              ? "bg-red-100 border-red-300 text-red-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Pass / Fail */}
                    <div>
                      <div className="text-xs mb-2">Result</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setAllSteps(s =>
                              s.map((x, idx) =>
                                idx === globalIndex ? { ...x, pass: true } : x
                              )
                            )
                          }
                          className={`px-2 py-0.5 rounded-full text-xs border ${
                            step.pass === true
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          onClick={() =>
                            setAllSteps(s =>
                              s.map((x, idx) =>
                                idx === globalIndex ? { ...x, pass: false } : x
                              )
                            )
                          }
                          className={`px-2 py-0.5 rounded-full text-xs border ${
                            step.pass === false
                              ? "bg-red-100 border-red-300 text-red-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          Fail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence upload */}
                <div className="mb-3 border border-gray-300 rounded-lg p-3 text-xs bg-gray-50">
                  <label className="cursor-pointer text-orange-600 font-medium">
                    Attach screenshot
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleEvidenceUpload(e.target.files[0], i);
                        }
                      }}
                    />
                  </label>

                  {step.evidence && (
                    <div className="mt-2">
                      <img
                        src={step.evidence}
                        alt="Evidence"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  )}
                </div>

                {/* Notes */}
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs placeholder-gray-400"
                  placeholder="Add notes or paste logs for this step..."
                  value={step.note}
                  onChange={(e) =>
                    setAllSteps(s =>
                      s.map((x, idx) =>
                        idx === globalIndex ? { ...x, note: e.target.value } : x
                      )
                    )
                  }
                />
              </div>
            );
          })}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Page indicator */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-full text-xs flex items-center justify-center transition-all ${
                    currentPage === page
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= Test Summary ================= */}
        <div className="bg-white p-6 rounded shadow flex flex-col justify-between">
          <div>
            <div className="font-semibold mb-2">Test Summary</div>
            <div className="grid grid-cols-2 text-xs gap-y-1">
              <span>Progress</span>
              <span>{Math.round((stepsPassed / allSteps.length) * 100 || 0)}%</span>
              <span>Passed</span>
              <span>{stepsPassed}</span>
              <span>Failed</span>
              <span>{stepsFailed}</span>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button className="text-xs underline">View Logs</button>
            <button className="text-xs underline">Complete Run</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmitAll}
          disabled={submitting}
          className="w-[138px] bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}