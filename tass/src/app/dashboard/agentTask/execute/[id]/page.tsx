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

type SubmitResponse = {
  success: boolean;
  message: string;
  data: {
    progress: number;
    passed: number;
    failed: number;
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

        const res = await fetch(`${BASE_URL}/projects/tasks/${taskId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch task");

        const result: ApiResponse = await res.json();
        if (!result.success) throw new Error(result.message);

        setTaskTitle(result.data.title);

        setAllSteps(
          result.data.test_cases.map(tc => ({
            id: tc.id,
            description: tc.description,
            evidence: "",
            note: "",
            access: null,
            pass: null,
          }))
        );
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

  const stepsPassed = allSteps.filter(s => s.pass === true).length;
  const stepsFailed = allSteps.filter(s => s.pass === false).length;

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    setSaving(false);
  };

  /* ================= SUBMIT ================= */

  const handleFinalSubmit = async () => {
    if (!accessToken) {
      alert("No access token");
      return;
    }

    const incomplete = allSteps.filter(
      s => s.pass === null || s.access === null
    );

    if (incomplete.length > 0) {
      alert(`Complete all test cases (${incomplete.length} remaining).`);
      return;
    }

    const confirmed = window.confirm(
      `Submit test run?\n\nTotal: ${allSteps.length}\nPassed: ${stepsPassed}\nFailed: ${stepsFailed}`
    );

    if (!confirmed) return;

    setSubmitting(true);

    try {
      const payload = {
        test_cases: allSteps.map(step => ({
          test_case_id: step.id,
          result: step.pass ? "pass" : "fail",
          has_access: step.access === true,
          test_status: step.pass ? "pass" : "fail",
          duration: 33,
        })),
      };

      const res = await fetch(
        `${BASE_URL}/projects/tasks/${taskId}/test-cases/submit/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Submission failed");
      }

      const result: SubmitResponse = await res.json();

      alert(
        `Saved successfully!\n\nProgress: ${result.data.progress}%\nPassed: ${result.data.passed}\nFailed: ${result.data.failed}`
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= NAVIGATION ================= */

  const goToPrevious = () => {
    handleSave();
    setCurrentPage(p => Math.max(p - 1, 1));
  };

  const goToNext = () => {
    handleSave();
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const goToPage = (page: number) => {
    handleSave();
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  /* ================= FILE ================= */

  const handleEvidenceUpload = (file: File, index: number) => {
    const url = URL.createObjectURL(file);
    const globalIndex = startIndex + index;

    setAllSteps(prev =>
      prev.map((s, i) => (i === globalIndex ? { ...s, evidence: url } : s))
    );
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-orange-500 rounded-full" />
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  /* ================= UI ================= */

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col">
      <div className="text-xs mb-2">My Tasks &gt; {taskTitle} &gt; Execute</div>

      <h2 className="text-lg font-bold mb-4">Execute • {taskTitle}</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4 text-sm font-semibold">
            <span>Execution Steps</span>
            <span className="text-xs">
              {allSteps.length} steps · Page {currentPage} of {totalPages}
            </span>
          </div>

          {currentSteps.map((step, i) => {
            const globalIndex = startIndex + i;

            return (
              <div key={step.id} className="mb-6 pb-4 border-b">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">
                    {globalIndex + 1}. {step.description}
                  </div>

                  <div className="flex gap-6">
                    <div>
                      <div className="text-xs mb-1">Access</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setAllSteps(s =>
                              s.map((x, idx) =>
                                idx === globalIndex ? { ...x, access: true } : x
                              )
                            )
                          }
                          className={`px-2 py-0.5 text-xs border rounded ${
                            step.access === true
                              ? "bg-green-100 border-green-300 text-green-700"
                              : ""
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
                          className={`px-2 py-0.5 text-xs border rounded ${
                            step.access === false
                              ? "bg-red-100 border-red-300 text-red-700"
                              : ""
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs mb-1">Result</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setAllSteps(s =>
                              s.map((x, idx) =>
                                idx === globalIndex ? { ...x, pass: true } : x
                              )
                            )
                          }
                          className={`px-2 py-0.5 text-xs border rounded ${
                            step.pass === true
                              ? "bg-green-100 border-green-300 text-green-700"
                              : ""
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
                          className={`px-2 py-0.5 text-xs border rounded ${
                            step.pass === false
                              ? "bg-red-100 border-red-300 text-red-700"
                              : ""
                          }`}
                        >
                          Fail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 border rounded p-3 text-xs bg-gray-50">
                  <label className="cursor-pointer text-orange-600">
                    Attach screenshot
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={e =>
                        e.target.files?.[0] &&
                        handleEvidenceUpload(e.target.files[0], i)
                      }
                    />
                  </label>

                  {step.evidence && (
                    <img
                      src={step.evidence}
                      className="mt-2 max-h-40 border rounded"
                    />
                  )}
                </div>

                <input
                  className="w-full border rounded px-3 py-2 text-xs"
                  placeholder="Add notes..."
                  value={step.note}
                  onChange={e =>
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

          <div className="flex justify-between mt-6 border-t pt-4">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="flex items-center text-sm disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="flex items-center text-sm disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 rounded-full text-xs ${
                    currentPage === p
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="font-semibold mb-2">Test Summary</div>
          <div className="grid grid-cols-2 text-xs gap-y-1">
            <span>Progress</span>
            <span>
              {Math.round((stepsPassed / allSteps.length) * 100 || 0)}%
            </span>
            <span>Passed</span>
            <span>{stepsPassed}</span>
            <span>Failed</span>
            <span>{stepsFailed}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleFinalSubmit}
          disabled={submitting}
          className="bg-orange-500 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
