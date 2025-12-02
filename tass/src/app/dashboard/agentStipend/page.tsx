import Image from "next/image";

interface Employee {
  name: string;
  username: string;
  testerId: string;
  role: string;
  profileImage: string;
}

interface StipendDetails {
  averageTestScore: string;
  amount: string;
  period: string;
  eligibilityStatus: string;
}


export default function StipendManagement() {
  const employee: Employee = {
    name: "Ethan Harper",
    username: "Ethan@33",
    testerId: "TC12345",
    role: "Tester",
    profileImage: "/icons/profile.png",
  };

  const stipendDetails: StipendDetails = {
    averageTestScore: "89%",
    amount: "₦3500",
    period: "June 1 – June 30, 2024",
    eligibilityStatus: "Eligible",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Stipend Management —
            <span className="text-orange-500 font-normal text-lg">
              {" "}
              Manage and oversee stipend records for testers and interns.
            </span>
          </h1>
        </div>

        {/* Flex container */}
        <div className="flex flex-col lg:flex-row gap-6 mt-12">
          {/* Left: Employee Info */}
          <div className="lg:w-1/3 h-fit">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center">
              <div className="relative -mt-14 mb-4">
                <Image
                  src={employee.profileImage}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mt-6">{employee.name}</h2>
              <div className="space-y-2 text-gray-600 mt-3 text-center">
                <p className="font-medium mb-2">{employee.username}</p>
                <p className="mb-4 text-orange-500">Tester ID: {employee.testerId}</p>
                <p className="mb-20 text-orange-500">Role: {employee.role}</p>
              </div>
            </div>
          </div>

          {/* Right: Stipend Details */}
          <div className="flex-1 mt-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium border-b-2 border-[#F97316] w-fit pb-2 text-orange-500 mb-6">Stipend Details</h3>
              {/* Performance Metrics */}
              <div className="mb-6">
                <table className="w-full border-collapse table-fixed">
                  <thead>
                    <tr className="border-gray-200">
                      <th className="text-left font-medium text-orange-500 w-2/3">Performance Metrics</th>
                      <th className="text-left font-medium text-orange-500 w-1/3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">
                        Average Test Score: {stipendDetails.averageTestScore}
                      </td>
                      <td className="py-3 font-medium text-gray-800">{stipendDetails.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Period & Eligibility */}
              <div className="mb-6">
                <table className="w-full border-collapse table-fixed">
                  <thead>
                    <tr className="border-gray-200">
                      <th className="text-left font-medium text-orange-500 w-2/3">Period Covered</th>
                      <th className="text-left font-medium text-orange-500 w-1/3">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">
                        {stipendDetails.period}
                      </td>
                      <td className="py-3 font-medium text-green-400">
                        {stipendDetails.eligibilityStatus}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 justify-end mt-10">
          <button className="px-6 py-1 bg-orange-500 hover:bg-orange-300 text-white rounded-2xl font-medium">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
