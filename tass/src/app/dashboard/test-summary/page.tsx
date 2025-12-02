// app/test-summary/page.tsx
'use client';

import * as React from 'react';

type Activity = {
  id: string;
  title: string;
  time: string; // ISO or readable
};

type Summary = {
  progressLabel: string;
  completed: number;
  passed: number;
  failed: number;
  duration: string; // HH:MM or HH:MM:SS
  activities: Activity[];
};

const SAMPLE: Summary = {
  progressLabel: 'Completed',
  completed: 3,
  passed: 2,
  failed: 2,
  duration: '02:14',
  activities: [
    { id: 'a1', title: 'Run created', time: '2025-11-10T10:21:00' },
    { id: 'a2', title: 'Step 2 evidence added', time: '2025-11-10T10:23:00' },
    { id: 'a3', title: 'Status changed to Running', time: '2025-11-10T10:24:00' },
  ],
};

function formatTime(iso?: string) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export default function TestSummaryPage(): React.ReactElement {
  const data = SAMPLE;

  return (
    <main className="p-6 max-w-3xl mx-auto min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Test Summary</h1>
      {/* Summary Card */}
      <section className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500">Progress</div>
            <div className="mt-1 text-lg font-medium text-gray-800">{data.progressLabel}</div>
          </div>

          <div className="flex-1">
            <div className="text-xs text-gray-500">Passed</div>
            <div className="mt-1 text-lg font-medium text-green-600">{data.passed}</div>
          </div>

          <div className="flex-1">
            <div className="text-xs text-gray-500">Failed</div>
            <div className="mt-1 text-lg font-medium text-red-600">{data.failed}</div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-xs text-gray-500">Duration</div>
            <div className="mt-1 text-lg font-medium text-gray-800">{data.duration}</div>
          </div>
        </div>

        {/* horizontal divider */}
        <div className="border-t border-t-gray-100 border-gray-100 mt-4 pt-4">
          <div className="text-xs text-gray-500">Completed tests</div>
          <div className="mt-2 text-sm text-gray-700">{data.completed} total</div>
        </div>
      </section>

      {/* Activities / Timeline */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Activities</h2>

          <div className="space-y-3">
            {data.activities.map((a, idx) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-800">{a.title}</div>
                    <div className="text-xs text-gray-500">{formatTime(a.time)}</div>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">Tests • {idx + 1} step</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact timeline card (optional) */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            {data.activities.map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>{a.title}</span>
                <span className="text-xs text-gray-500">{formatTime(a.time)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
