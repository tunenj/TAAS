// pages/test-run.tsx
'use client'
import React, { useState } from "react";
import { Save } from "lucide-react";

type Step = {
  id: number;
  description: string;
  evidence: string;
  note: string;
  access: boolean | null;
  pass: boolean | null;
};

const initialSteps: Step[] = [
  {
    id: 1,
    description: "Navigate to product page",
    evidence: "screenshot.png",
    note: "",
    access: true,
    pass: true,
  },
  {
    id: 2,
    description: "Add item to cart",
    evidence: "screenshot.png",
    note: "",
    access: true,
    pass: true,
  },
  {
    id: 3,
    description: "Proceed to checkout",
    evidence: "screenshot.png",
    note: "",
    access: false,
    pass: false,
  },
];

export default function TestRun() {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  // Example test summary data
  const stepsPassed = steps.filter(step => step.pass).length;

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col">
      {/* Breadcrumbs/Header */}
      <div className="text-xs text-black mb-2">
        My Tests &gt; Checkout flow – guest user &gt; Execute
      </div>
      <h2 className="text-lg font-bold mb-4">Run #143 &bull; Checkout flow – guest user</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Execution Steps */}
        <div className="md:col-span-2 bg-white p-6 rounded shadow">
          <div className="text-xm font-semibold mb-4 flex justify-between items-center">
            <span>Execution Steps</span>
            <span className="text-xs text-black">12 steps <span className="ml-2">Last saved 1m ago</span></span>
          </div>
          {steps.map((step, i) => (
            <div key={step.id} className="mb-4 pb-3">
              <div className="flex justify-between mb-2">
                <div className="font-medium">{i + 1}. {step.description}</div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-black mb-2">Access/No Access</span>

                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-0.5 rounded-full text-xs mr-1 border ${step.access === true ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-300 text-black bg-white'}`}
                      >
                        Yes
                      </button>
                      <button
                        className={`px-2 py-0.5 rounded-full text-xs border ${step.access === false ? 'bg-red-100 border-red-300 text-red-700' : 'border-gray-300 text-black bg-white'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-xs text-black ml-3 mr-2 mb-2">Pass/Fail</span>

                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-0.5 rounded-full text-xs mr-1 border ${step.pass === true ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-300 text-black bg-white'}`}
                      >
                        Pass
                      </button>
                      <button
                        className={`px-2 py-0.5 rounded-full text-xs border ${step.pass === false ? 'bg-red-100 border-red-300 text-red-700' : 'border-gray-300 text-black bg-white'}`}
                      >
                        Fail
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              <div className="mb-4 shadow-md p-2 border border-gray-200 rounded-lg">
                <span className="text-sm text-black">Attach evidence: </span>
                <span className="inline-flex items-center gap-1 text-xs text-black">{step.evidence}</span>
              </div>
              <div className="shadow-md border border-gray-200 block w-full px-3 py-2 text-xs mt-2 rounded-lg">
                <input
                  className="w-full p-1 border-none outline-none focus:ring-2 focus:ring-gray-200 placeholder:text-sm placeholder-black rounded-lg"
                  placeholder="Add notes or paste logs for this step..."
                  value={step.note}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[i].note = e.target.value;
                    setSteps(newSteps);
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end items-center mt-4">
            {/* Previous Button */}
            <button className="flex items-center text-sm text-black px-3 py-1 hover:bg-gray-100">
              <span className="mr-1">{'<'}</span> Previous
            </button>

            {/* Save Button centered */}
            <button className="flex items-center text-sm text-black px-3 py-1 hover:bg-gray-100">
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>

            {/* Next Button */}
            <button className="flex items-center text-sm text-black px-3 py-1 hover:bg-gray-100">
              Next <span className="ml-1">{'>'}</span>
            </button>
          </div>

        </div>
        {/* Test Summary */}
        <div className="bg-white p-6 rounded shadow flex flex-col justify-between">
          <div>
            <div className="font-semibold mb-2">Test Summary</div>
            <div className="mb-3 grid grid-cols-2 text-xs gap-y-1">
              <span className="text-gray-700">Progress</span>
              <span>25%</span>
              <span className="text-gray-700">Passed</span>
              <span>{stepsPassed}</span>
              <span className="text-gray-700">Failed</span>
              <span>0</span>
              <span className="text-gray-700">Duration</span>
              <span>02:14</span>
            </div>
            <div className="font-medium mt-3 mb-1 text-xs">Activity</div>
            <ul className="text-xs text-gray-500 mb-2">
              <li>Run created <span className="float-right text-black">10:21</span></li>
              <li>Step 2 evidence added <span className="float-right text-black">10:23</span></li>
              <li>Status changed to <span className="text-gray-700">Running</span> <span className="float-right text-black">10:24</span></li>
            </ul>
            <div className="font-medium text-xs mb-1">Linked Items</div>
            <div className="text-xs text-gray-500 mb-1">PAY-102 Timeout on retry</div>
            <div className="text-xs text-gray-500 mb-1">DOC Checkout Spec v3</div>
          </div>
          <div>
            <div className="flex justify-between mt-6">
              <button className="text-xs underline text-gray-700 cursor-pointer">View Logs</button>
              <button className="text-xs underline text-gray-700 cursor-pointer">Complete Run</button>
            </div>
          </div>
        </div>

      </div>
      <div className="flex justify-end">
        <button className="w-[138px] mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow">
          Submit
        </button>
      </div>
    </div>
  );
}
