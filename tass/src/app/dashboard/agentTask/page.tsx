'use client';

import * as React from 'react';
import { Plus, Save, Search, Filter, Flag, Folder, Download, ArrowUpDown, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import dayjs from 'dayjs';

/* ================= TYPES ================= */

type Activity = { id: string; title: string; time: string };

type TestCaseResult = {
  id: number;
  test_case_id: string;
  result: string;
  has_access: boolean;
  test_status: string;
  duration: string;
  notes?: string;
};

type SubmissionPreviewResponse = {
  task: string;
  remark: string;
  progress: number;
  test_cases: TestCaseResult[];
  failed_count: number;
};

type FinalSubmitResponse = {
  success: boolean;
  message: string;
  data: {
    detail: string;
    task_id: string;
    submitted_at: string;
  };
};

type Task = {
  project_id: string;
  task_id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  start_datetime: string;
  end_datetime: string;
  test_cases: any[];
  expected_test_cases: any[];
};

type UserProfileResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    work_phone?: string;
    employee_id?: string;
    role_name?: string;
    department?: string;
    [key: string]: any;
  };
};

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  workPhone: string;
  position: string;
  department: string;
};

type TasksResponse = {
  success: boolean;
  message: string;
  data: Task[];
};

/* ================= HELPER FUNCTIONS ================= */

function formatTime(iso?: string) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function formatDate(iso?: string) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

function formatDateTime(iso?: string) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function parseDuration(durationStr: string): number {
  try {
    const parts = durationStr.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  } catch {
    return 0;
  }
}

function formatDuration(durationStr: string): string {
  const seconds = parseDuration(durationStr);
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

function getTotalDuration(testCases: TestCaseResult[]): string {
  const totalSeconds = testCases.reduce((sum, tc) => sum + parseDuration(tc.duration), 0);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/* ================= SUBMISSION PREVIEW MODAL ================= */

function SubmissionPreviewModal({ 
  taskId, 
  onClose,
  onFinalSubmit
}: { 
  taskId: string;
  onClose: () => void;
  onFinalSubmit?: () => void;
}) {
  const { BASE_URL, accessToken } = useAuth();
  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<SubmissionPreviewResponse | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Fetch submission preview using GET request to /projects/tasks/task_id/submission-preview/
  const fetchSubmissionPreview = React.useCallback(async () => {
    console.log('fetchSubmissionPreview called with:', { taskId, accessToken: !!accessToken, BASE_URL });
    
    if (!taskId) {
      setError('Task ID is missing');
      setLoading(false);
      return;
    }

    if (!accessToken) {
      setError('Authentication token is missing. Please try again.');
      setLoading(false);
      return;
    }

    if (!BASE_URL) {
      setError('API base URL is not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching submission preview for task:', taskId);
      console.log('Using BASE_URL:', BASE_URL);
      
      const endpoint = `${BASE_URL}/projects/tasks/${taskId}/submission-preview/`;
      console.log('Full endpoint:', endpoint);

      const res = await fetch(
        endpoint,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status:', res.status);

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication expired. Please refresh the page and try again.');
        } else if (res.status === 404) {
          throw new Error('Submission preview not found for this task.');
        } else {
          let errorMessage = `HTTP Error ${res.status}`;
          try {
            const errorData = await res.json();
            console.error('Error response data:', errorData);
            errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
          } catch {
            try {
              const errorText = await res.text();
              console.error('Error response text:', errorText);
              errorMessage = errorText || `Failed to fetch: ${res.status}`;
            } catch {
              errorMessage = `Server error: ${res.status}`;
            }
          }
          throw new Error(errorMessage);
        }
      }

      const result = await res.json();
      console.log('Raw response data:', result);

      // Handle different response formats
      if (result && typeof result === 'object') {
        let previewData = null;
        
        if (result.success !== undefined && result.data) {
          // Response format: { success: true, message: "...", data: {...} }
          console.log('Response has success/data structure');
          previewData = result.data;
        } else if (result.task) {
          // Response format: { task: "...", test_cases: [...] }
          console.log('Response has direct task/test_cases structure');
          previewData = result;
        } else {
          // Try to find the data in the response
          console.log('Looking for data in response keys');
          const possibleData = Object.values(result).find((v: any) => 
            v && typeof v === 'object' && v.task !== undefined
          );
          previewData = possibleData || result;
        }
        
        if (previewData && (previewData.task || previewData.test_cases)) {
          setPreviewData(previewData);
          console.log('Preview data set successfully');
        } else {
          console.warn('Preview data missing required fields:', previewData);
          setPreviewData(previewData);
        }
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      console.error('Error fetching submission preview:', err);
      setError(err instanceof Error ? err.message : 'Failed to load submission preview');
    } finally {
      setLoading(false);
    }
  }, [taskId, accessToken, BASE_URL, retryCount]);

  // Handle final submission using POST request to /projects/tasks/task_id/final-submit/
  const handleFinalSubmit = async () => {
    if (!accessToken || !taskId || !previewData) return;

    const passedCount = previewData.test_cases.filter(tc => tc.test_status === 'pass').length;
    const totalCount = previewData.test_cases.length;

    const confirmed = window.confirm(
      `Are you sure you want to submit this task?\n\n` +
      `Progress: ${previewData.progress}%\n` +
      `Passed: ${passedCount}/${totalCount}\n` +
      `Failed: ${previewData.failed_count}\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmed) return;

    setSubmitting(true);
    try {
      // Prepare payload from preview data
      const payload = {
        test_cases: previewData.test_cases.map(testCase => ({
          test_case_id: testCase.test_case_id,
          result: testCase.result,
          has_access: testCase.has_access,
          test_status: testCase.test_status,
          duration: testCase.duration,
          ...(testCase.notes && { notes: testCase.notes })
        }))
      };

      console.log('Final submit payload:', payload);

      const res = await fetch(
        `${BASE_URL}/projects/tasks/${taskId}/final-submit/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const result: FinalSubmitResponse = await res.json();

      if (!res.ok || !result.success) {
        console.error('Final submit error:', result);
        throw new Error(result.message || `Submission failed (${res.status})`);
      }

      console.log('Final submit success:', result);

      alert(`Task submitted successfully!\n\n${result.data.detail}\nTask ID: ${result.data.task_id}\nSubmitted at: ${formatDateTime(result.data.submitted_at)}`);
      
      if (onFinalSubmit) {
        onFinalSubmit();
      }
      
      onClose();
      
    } catch (err) {
      console.error('Final submission failed:', err);
      alert(`Submission failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (taskId && accessToken && BASE_URL) {
      fetchSubmissionPreview();
    } else {
      // If auth data isn't ready yet, wait a bit and retry
      const timer = setTimeout(() => {
        if (taskId) {
          console.log('Retrying fetch due to missing auth data...');
          setRetryCount(prev => prev + 1);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [taskId, accessToken, BASE_URL, fetchSubmissionPreview, retryCount]);

  React.useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = 0;
    }
  }, []);

  const passedCount = previewData ? previewData.test_cases.filter(tc => tc.test_status === 'pass').length : 0;
  const totalCount = previewData ? previewData.test_cases.length : 0;

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Submission Preview</h2>
            <p className="text-sm text-gray-500">
              Task: {previewData?.task || taskId || 'Loading...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div
          ref={scrollableRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            maxHeight: 'calc(90vh - 120px)',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">
                {!accessToken ? 'Loading authentication...' : 'Loading submission preview...'}
              </span>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2 mb-6">
                <p className="text-xs text-gray-500">Task ID: {taskId || 'Not available'}</p>
                <p className="text-xs text-gray-500">Retry count: {retryCount}</p>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          ) : previewData ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500">Progress</div>
                  <div className="mt-1 text-xl font-bold text-blue-700">
                    {previewData.progress || 0}%
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500">Passed</div>
                  <div className="mt-1 text-xl font-bold text-green-700">
                    {passedCount}/{totalCount}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500">Failed</div>
                  <div className="mt-1 text-xl font-bold text-red-700">
                    {previewData.failed_count || 0}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500">Total Duration</div>
                  <div className="mt-1 text-xl font-bold text-gray-800">
                    {previewData.test_cases ? getTotalDuration(previewData.test_cases) : '0s'}
                  </div>
                </div>
              </div>

              {previewData.remark && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Remarks</h4>
                  <p className="text-sm text-amber-700">{previewData.remark}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Test Cases ({previewData.test_cases?.length || 0})
                </h3>
                {previewData.test_cases && previewData.test_cases.length > 0 ? (
                  <div className="space-y-2">
                    {previewData.test_cases.map((testCase, index) => (
                      <div
                        key={testCase.id || index}
                        className="p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                {index + 1}. Test Case ID: {testCase.test_case_id}
                              </span>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  testCase.test_status === 'pass'
                                    ? 'bg-green-100 text-green-700'
                                    : testCase.test_status === 'fail'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {testCase.test_status === 'pass'
                                  ? 'Passed'
                                  : testCase.test_status === 'fail'
                                  ? 'Failed'
                                  : testCase.test_status || 'Unknown'}
                              </span>
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                {(testCase.result || '').toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                {testCase.has_access ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    Access Granted
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 text-red-500" />
                                    No Access
                                  </>
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {testCase.duration ? formatDuration(testCase.duration) : '0s'}
                              </span>
                            </div>
                            {testCase.notes && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {testCase.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No test cases found
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800">Before Submitting</h4>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        <li>• Review all test case results carefully</li>
                        <li>• Verify {passedCount} test case{passedCount !== 1 ? 's' : ''} passed out of {totalCount}</li>
                        <li>• Ensure all required evidence is attached</li>
                        <li>• Verify access permissions are correctly marked</li>
                        <li>• Once submitted, changes cannot be undone</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {(previewData.progress || 0) < 100 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">Task Incomplete</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        This task is {previewData.progress || 0}% complete. You may want to complete all test cases before submitting.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-yellow-700 mb-2">No Preview Data</h3>
              <p className="text-gray-600 mb-4">No submission preview data available for this task.</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between items-center shrink-0">
          <div className="text-sm text-gray-600">
            Task ID: <span className="font-mono">{taskId}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
              disabled={submitting}
            >
              Cancel
            </button>
            {previewData && (
              <button
                onClick={handleFinalSubmit}
                disabled={submitting || !previewData || loading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Task'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE COMPONENT ================= */

export default function MyTaskPage() {
  const router = useRouter();
  const { BASE_URL, accessToken, user } = useAuth();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = React.useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = React.useState(false);
  const [openPreviewFor, setOpenPreviewFor] = React.useState<string | null>(null);
  const [refreshingTasks, setRefreshingTasks] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const statusColor: Record<string, string> = {
    'open': 'text-gray-500',
    'in_progress': 'text-orange-500',
    'completed': 'text-green-600',
    'closed': 'text-gray-700',
  };

  const statusDisplay: Record<string, string> = {
    'open': 'To Do',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'closed': 'Closed',
  };

  const handleViewSubmissionPreview = (taskId: string) => {
    console.log('Opening preview for task:', taskId);
    console.log('Current accessToken:', !!accessToken);
    console.log('Current BASE_URL:', BASE_URL);
    setOpenPreviewFor(taskId);
  };

  const handleRefreshTasks = () => {
    fetchTasks();
  };

  const fetchUserProfile = async () => {
    if (!accessToken) return;

    try {
      setLoadingProfile(true);
      const res = await fetch(`${BASE_URL}/profile/me/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: UserProfileResponse = await res.json();
      if (data.success && data.data) {
        const profileData = data.data;
        setUserProfile({
          id: profileData.id,
          firstName: profileData.first_name,
          lastName: profileData.last_name || '',
          fullName: `${profileData.first_name} ${profileData.last_name || ''}`.trim(),
          email: profileData.email,
          phoneNumber: profileData.phone_number || '',
          workPhone: profileData.work_phone || '',
          position: profileData.role_name || '',
          department: profileData.department || '',
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchTasks = async () => {
    if (!BASE_URL || !accessToken) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setRefreshingTasks(true);
      const response = await fetch(`${BASE_URL}/projects/tasks/assigned/me/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const result: TasksResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setTasks(result.data);
      } else {
        console.warn('Unexpected response format:', result);
        setTasks([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
      setRefreshingTasks(false);
    }
  };

  React.useEffect(() => {
    const loadData = async () => {
      if (accessToken) {
        await fetchUserProfile();
        await fetchTasks();
      }
    };

    loadData();
  }, [BASE_URL, accessToken]);

  const getGreeting = () => {
    const hour = dayjs().hour();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = () => {
    if (userProfile?.fullName) return userProfile.fullName;
    if (user?.first_name) return `${user.first_name} ${user.last_name || ''}`.trim();
    return 'User';
  };

  const getUserPosition = () => {
    if (userProfile?.position) return userProfile.position;
    if (user?.role_name) return user.role_name;
    return 'Supervisor';
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.task_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project_id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  if (loading && !refreshingTasks) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-gray-800 mt-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error && !tasks.length) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-gray-800 mt-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800 mt-5">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold">My Tasks</h1>
          {!loadingProfile && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{getGreeting()},</span>
              <span className="text-sm font-medium">{getUserName()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefreshTasks}
            disabled={refreshingTasks}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50"
          >
            {refreshingTasks ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-orange-500 rounded-full"></div>
                Refreshing...
              </>
            ) : (
              <>
                <ArrowUpDown size={16} />
                Refresh Tasks
              </>
            )}
          </button>
          <button className="flex items-center gap-2 text-black px-4 py-2 rounded-lg text-sm bg-orange-50 hover:bg-orange-100">
            <Plus size={16} /> New Test Case
          </button>
        </div>
      </div>

      {userProfile && (
        <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">{getUserName()}</h3>
              <p className="text-sm text-gray-600">{getUserPosition()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">ID: {userProfile.id}</p>
              <p className="text-sm text-gray-600">{userProfile.department}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-4 h-4" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 w-full"
          />
        </div>

        <div className="flex items-center gap-3 text-gray-700 text-sm">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option value="all">All Status</option>
            <option value="open">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition text-sm">
          <Download size={16} />
          <span>Export</span>
        </div>
      </div>

      <div className="flex gap-6 text-sm font-medium text-gray-600 mb-3 border-b border-gray-200 mt-3">
        <button 
          onClick={() => setStatusFilter('all')}
          className={`pb-2 px-4 py-2 rounded-md ${statusFilter === 'all' ? 'bg-amber-600 text-white' : 'hover:text-indigo-600'}`}
        >
          All Tasks
        </button>
        <button 
          onClick={() => setStatusFilter('open')}
          className={`pb-2 ${statusFilter === 'open' ? 'text-amber-600 border-b-2 border-amber-600' : 'hover:text-indigo-600'}`}
        >
          To Do
        </button>
        <button 
          onClick={() => setStatusFilter('in_progress')}
          className={`pb-2 ${statusFilter === 'in_progress' ? 'text-amber-600 border-b-2 border-amber-600' : 'hover:text-indigo-600'}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setStatusFilter('completed')}
          className={`pb-2 ${statusFilter === 'completed' ? 'text-amber-600 border-b-2 border-amber-600' : 'hover:text-indigo-600'}`}
        >
          Completed
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Project ID</th>
              <th className="p-3 text-left">Task ID</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {refreshingTasks ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-2"></div>
                    Refreshing tasks...
                  </div>
                </td>
              </tr>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.task_id} className="border-b border-b-gray-200 hover:bg-gray-50">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3 font-medium">{task.title}</td>
                  <td className="p-3">{task.project_id}</td>
                  <td className="p-3">{task.task_id}</td>
                  <td className={`p-3 font-medium ${statusColor[task.status] || 'text-gray-500'}`}>
                    {statusDisplay[task.status] || task.status}
                  </td>
                  <td className="p-3">{task.location}</td>
                  <td className="p-3">{formatDate(task.start_datetime)}</td>
                  <td className="p-3">{formatDate(task.end_datetime)}</td>
                  <td className="p-3 flex gap-3">
                    {task.status !== 'completed' && task.status !== 'closed' ? (
                      <>
                        <button
                          onClick={() => router.push(`/dashboard/agentTask/execute/${task.task_id}`)}
                          className="text-orange-600 font-semibold hover:text-orange-700"
                        >
                          Execute
                        </button>
                        {/* <button
                          onClick={() => router.push(`/dashboard/agentTask/task-details/${task.task_id}`)}
                          className="text-gray-600 font-semibold hover:text-gray-800"
                        >
                          Details
                        </button> */}
                        <button
                          onClick={() => handleViewSubmissionPreview(task.task_id)}
                          className="text-blue-600 font-semibold hover:text-blue-700"
                        >
                          View
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => router.push(`/dashboard/agentTask/task-details/${task.task_id}`)}
                          className="text-gray-600 font-semibold hover:text-gray-800"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTaskDetails(task);
                            setShowTaskDetails(true);
                          }}
                          className="text-blue-600 font-semibold hover:text-blue-700"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleViewSubmissionPreview(task.task_id)}
                          className="text-green-600 font-semibold hover:text-green-700"
                        >
                          View Submission
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No tasks match your search criteria.' 
                    : 'No tasks found. You don\'t have any assigned tasks.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showTaskDetails && selectedTaskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <h2 className="text-lg font-semibold">Task Details - {selectedTaskDetails.title}</h2>
              <button
                onClick={() => setShowTaskDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                <p className="mt-1 text-sm text-gray-600">{selectedTaskDetails.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Project ID</h3>
                  <p className="mt-1 text-sm text-gray-600">{selectedTaskDetails.project_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Task ID</h3>
                  <p className="mt-1 text-sm text-gray-600">{selectedTaskDetails.task_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Status</h3>
                  <p className={`mt-1 text-sm font-medium ${statusColor[selectedTaskDetails.status]}`}>
                    {statusDisplay[selectedTaskDetails.status]}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Location</h3>
                  <p className="mt-1 text-sm text-gray-600">{selectedTaskDetails.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Start Date</h3>
                  <p className="mt-1 text-sm text-gray-600">{formatDateTime(selectedTaskDetails.start_datetime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">End Date</h3>
                  <p className="mt-1 text-sm text-gray-600">{formatDateTime(selectedTaskDetails.end_datetime)}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3 shrink-0">
              <button
                onClick={() => setShowTaskDetails(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
              {selectedTaskDetails.status !== 'completed' && selectedTaskDetails.status !== 'closed' && (
                <button
                  onClick={() => router.push(`/dashboard/agentTask/execute/${selectedTaskDetails.task_id}`)}
                  className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Execute Task
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {openPreviewFor !== null && (
        <SubmissionPreviewModal
          taskId={openPreviewFor}
          onClose={() => setOpenPreviewFor(null)}
          onFinalSubmit={handleRefreshTasks}
        />
      )}
    </div>
  );
}