import React from 'react';

type KPI = {
  title: string;
  value: string;
  desc: string;
};
type Test = {
  title: string;
  project: string;
  status: string;
  priority: string;
  action: string;
};
type Activity = {
  description: string;
  time: string;
};
type Due = {
  task: string;
  date: string;
};

const kpis: KPI[] = [
  { title: 'Meeting Targets', value: '92%', desc: '+5% from last month' },
  { title: 'Report Quality Score', value: '4.7/5', desc: 'Avg. across all reports' },
  { title: 'Escalation Turnaround', value: '2.1 hrs', desc: 'Avg. resolution time' },
  { title: 'Attrition Rate', value: '0.8%', desc: 'Decreased by 2.2%' },
  { title: 'Compliance Adherence', value: '99.5%', desc: 'No critical violations' },
  { title: 'Assigned Task', value: '85', desc: '3 new this week' },
  { title: 'Completed Tasks', value: '75', desc: 'Up by 15% from last week' },
  { title: 'Delayed Tasks', value: '18', desc: 'Reduced by 2 this week' },
];

const tests: Test[] = [
  { title: 'Checkout flow – guest user', project: 'Web Platform', status: 'In Progress', priority: 'High', action: 'Execute' },
  { title: 'Login with SSO', project: 'Mobile App', status: 'In Progress', priority: 'Medium', action: 'Details' },
  { title: 'API rate limit handling', project: 'API Service', status: 'Completed', priority: 'Low', action: 'High' },
  { title: 'Profile update validations', project: 'Web Platform', status: 'In Progress', priority: 'High', action: 'Execute' },
];

const activities: Activity[] = [
  { description: 'Marked API rate limit handling as Completed', time: '2h ago' },
  { description: 'Raised ticket: "Payment timeout error"', time: '3h ago' },
  { description: 'Added 3 cases to "Sprint"', time: '9h ago' },
  { description: 'Commented on "Login with SSO"', time: '12h ago' },
];

const dueSoon: Due[] = [
  { task: 'Complete “Checkout flow - guest user”', date: 'Due tomorrow' },
  { task: 'Execute “Login with SSO”', date: 'Due tomorrow' },
  { task: 'Start “Mobile Smoke - V3.2”', date: 'Due in 2 days' },
];

export default function DashboardPage() {
  return (
    <main className="bg-gray-50 mt-10 min-h-screen -ml-8">
      <h1 className="text-lg font-semibold mb-2">Hey Triston <span className="font-normal text-gray-500">– here’s what your dashboard looks like today!</span></h1>
      <section>
        <h2 className="text-orange-500 font-medium mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {kpis.map(({ title, value, desc }, idx) => (
            <div key={idx} className={`bg-white shadow-lg rounded-lg p-4`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-gray-700 font-semibold">{title}</span>
              </div>
              <div className="text-3xl font-bold mb-2">{value}</div>
              <div className="text-sm text-gray-500">{desc}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center mb-3">
            <h2 className="text-gray-700 font-bold text-lg">My Tests</h2>
            <div className="ml-auto space-x-2">
              <button className="text-xs text-gray-600 border px-2 py-1 rounded">Status: All</button>
              <button className="text-xs text-gray-600 border px-2 py-1 rounded">Priority</button>
              <button className="text-xs text-gray-600 border px-2 py-1 rounded">Project</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 text-left">Test Case</th>
                  <th className="py-2 text-left">Project</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Priority</th>
                  <th className="py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2">{t.title}</td>
                    <td className="py-2">{t.project}</td>
                    <td className="py-2">{t.status}</td>
                    <td className="py-2">{t.priority}</td>
                    <td className="py-2">
                      <button className="text-black px-3 py-1 rounded text-xs">{t.action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right">
            <a href="#" className="text-sm text-orange-500">View All</a>
          </div>
        </div>
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-gray-700 font-bold text-lg mb-3">Recent Activity</h2>
          <ul>
            {activities.map((a, idx) => (
              <li key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="text-gray-600 text-sm">{a.description}</span>
                <span className="text-gray-400 text-xs">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-gray-700 font-bold text-lg mb-3">Due Soon</h2>
          <ul>
            {dueSoon.map((d, idx) => (
              <li key={idx} className="py-2 border-b last:border-b-0 flex justify-between items-center">
                <span className="text-gray-600 text-sm">{d.task}</span>
                <span className="text-orange-500 text-xs">{d.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
