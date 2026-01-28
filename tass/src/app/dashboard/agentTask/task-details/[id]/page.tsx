// pages/details.tsx
import React from "react";


type TestStep = {
  description: string;
  expected: string;
  checked: boolean;
};

const testSteps: TestStep[] = [
  {
    description: "Verify successful login with valid credentials",
    expected: "User is redirected to dashboard.",
    checked: true,
  },
  {
    description: "Verify failed login with invalid password",
    expected: "Invalid email or password. Credentials message is displayed.",
    checked: true,
  },
  {
    description: "Verify successful login with secondary user",
    expected: "User is redirected to login.",
    checked: true,
  },
  {
    description: "Check 'Forgot Password'",
    expected: "User receives password reset message.",
    checked: false,
  },
];

export default function Details() {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-2 items-center flex flex-col  mt-4">
      {/* Header */}
      <div className="w-full max-w-4xl mb-4">
        <h2 className="text-black text-xl font-semibold">Details</h2>
        <div className="flex items-center opacity-90 text-sm pb-2">
          <span className="text-lg font-semibold">Checkout flow – guest user</span>
          <span className="flex gap-2">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm ml-14">High</span>
            <span className="px-2 py-1 rounded text-sm"># Task ID: 123-456-789</span>
            <span className="px-2 py-1 rounded text-sm">Task assigned: 2024-07-20</span>
          </span>
        </div>
        <div className="flex flex-wrap justify-between items-center text-xs text-gray-600 mb-3">
          <span>Assigned to <span className="font-semibold text-gray-800">Emily Carter</span></span>
          <span>🗓 Deadline <span className="font-semibold text-gray-800">2024-08-15</span></span>
          <span>Location <span className="font-semibold text-gray-800">All</span></span>
        </div>
      </div>

      {/* Task Details Card */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow mb-4 p-6">
        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
          <div>
            <div className="font-semibold mb-1">Requirement ID</div>
            <div>REQ-FN-001</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Module / Feature</div>
            <div>User Management / Authentication</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Environment</div>
            <div>Staging (AWS us-east-1)</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Version / Build</div>
            <div>v1.2.0-beta</div>
          </div>
        </div>
        <div className="font-semibold text-xs mb-1">Setup Steps</div>
        <ol className="pl-6 text-xs list-decimal mb-1 text-gray-700 space-y-0.5">
          <li>Ensure NodeJS v16+ is installed.</li>
          <li>Clone the Project Nova repository: <a className="text-blue-500 underline" href="https://github.com/project-nova/nvn." target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li>Navigate to the project folder.</li>
          <li>Install dependencies: <span className="font-mono">npm install</span></li>
          <li>Start server: <span className="font-mono">npm start</span></li>
          <li>Access the login page: <span className="font-mono">localhost:3000/login</span></li>
          <li>Use test credentials provided in .env file.</li>
        </ol>
      </div>

      {/* Execution Details Card */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-6">
        <div className="font-semibold text-xs mb-2">Test Data</div>
        <textarea
          className="w-full text-xs border rounded px-2 py-1 bg-gray-50 mb-4"
          rows={2}
          readOnly
          value={`USER NAME: test.user@example.com, PASSWORD: Password123\nUSER NAME: admin@example.com, PASSWORD: SecretPassword`}
        />
        <div className="font-semibold text-xs mb-2">Test Steps Checklist</div>
        <table className="w-full text-xs mb-2 border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left font-semibold py-1 px-2">Description</th>
              <th className="text-left font-semibold py-1 px-2">Expected Result</th>
            </tr>
          </thead>
          <tbody>
            {testSteps.map((step, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-1 px-2">
                  <span className={`inline-block align-middle w-2 h-2 mr-2 ${step.checked ? "bg-orange-400" : "bg-gray-300"}`}></span>
                  {step.description}
                </td>
                <td className="py-1 px-2">{step.expected}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="font-semibold text-xs mb-1">Additional Details</div>
        <div className="text-xs text-gray-700 mb-1">
          Verification code: BUG-HP-457<br />
          Date executed: 2024-07-20
        </div>
      </div>
    </div>
  );
}
