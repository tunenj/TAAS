import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

const stats = [
    {
        label: 'Ongoing Projects',
        value: 12,
        icon: (
            <div className="flex flex-col items-center gap-2">
                <Image src="/icons/filter-list.png" alt="Card icon" width={24} height={24} className="w-6 h-6" />
                <Image src="/icons/card3.png" alt="Second icon" width={24} height={24} className="w-6 h-6" />
            </div>
        ),
    },
    {
        label: 'Ongoing Test Cases',
        value: 122,
        icon: (
            <div className="mt-6">
                <Image src="/icons/card.png" alt="Menu icon" width={24} height={24} className="w-6 h-6 text-orange-500" />
            </div>
        ),
    },
    {
        label: 'Execution Progress 60%',
        icon: (
            <Image src="/icons/frames.png" alt="Menu icon" width={0} height={24} className="w-[73px] rounded-2xl h-2" />
        ),
    },
    {
        label: 'Test Pass Rate',
        value: '92%',
        icon: (
            <div className="mt-6">
                <Image src="/icons/card.png" alt="Menu icon" width={24} height={24} className="w-6 h-6 text-orange-500" />
            </div>
        ),
    },
    {
        label: 'Completed Projects',
        value: 6,
        icon: (
            <div className="mt-6">
                <Image src="/icons/card3.png" alt="Menu icon" width={24} height={24} className="w-6 h-6 text-orange-500" />
            </div>
        ),
    },
    {
        label: 'Average cycle time',
        value: '12 Days',
        icon: (
            <div className="mt-6">
                <Image src="/icons/card1.png" alt="Menu icon" width={24} height={24} className="w-6 h-6 text-orange-500" />
            </div>
        ),
    },
]

const projects = [
    {
        name: 'Mobile Banking Revamp',
        testers: [{ name: 'Kristin Watson', email: 'example@mail.com', image: '/images/image.png' }],
        date: 'sep-12-25',
        status: 'Ongoing',
        progress: 88,
    },
    {
        name: 'E-commerce checkout',
        testers: [{ name: 'Ralph Edwards', email: 'example2@mail.com', image: '/images/image.png' }],
        date: 'sep-12-25',
        status: 'Ongoing',
        progress: 70,
    },
    {
        name: 'Health Care portal QA',
        testers: [{ name: 'Ralph Edwards', email: 'example2@mail.com', image: '/images/image.png' }],
        date: 'sep-12-25',
        status: 'Ongoing',
        progress: 86,
    },
]

// ✅ Added progress field here
const testCases = [
    {
        name: 'Checkout Payment Validation',
        text: 'Project E-commerce checkout',
        status: 'passed',
        tester: 'Kristin Watson',
        timeElapsed: '1 hour 17 mins left',
        progress: 70,
    },
    {
        name: 'Login Rate Limiting',
        text: 'Project E-commerce checkout',
        status: 'failed',
        tester: 'Kristin Watson',
        timeElapsed: '1 hour 25 mins left',
        progress: 40,
    },
    {
        name: 'Checkout Payment Validation',
        text: 'Project E-commerce checkout',
        status: 'passed',
        tester: 'Kristin Watson',
        timeElapsed: '1 hour 23 mins left',
        progress: 65,
    },
    {
        name: 'Checkout Payment Validation',
        text: 'Project E-commerce checkout',
        status: 'passed',
        tester: 'Ralph Edwards',
        timeElapsed: '1 hour 27 mins left',
        progress: 55,
    },
    {
        name: 'Profile Update Validation',
        text: 'Project E-commerce checkout',
        status: 'failed',
        tester: 'Ralph Edwards',
        timeElapsed: '1 hour 55 mins left',
        progress: 30,
    },
    {
        name: 'Checkout Payment Validation',
        text: 'Project E-commerce checkout',
        status: 'passed',
        tester: 'Kristin Watson',
        timeElapsed: '1 hour 29 mins left',
        progress: 60,
    },
    {
        name: 'Notification Preferences',
        text: 'Project E-commerce checkout',
        status: 'passed',
        tester: 'Kristin Watson',
        timeElapsed: '1 hr left',
        progress: 80,
    },
]

function getStatusColor(status: string) {
    switch (status) {
        case 'passed':
            return 'bg-green-100 text-green-700'
        case 'failed':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const Dashboard: React.FC = () => (
    <main className="bg-gray-50 mt-10 min-h-screen -ml-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-semibold text-gray-800">
                Hey Triston -
                <span className="text-gray-400 text-sm"> here’s what your dashboard looks like today!</span>
            </h1>
            <button className="bg-orange-500 text-white px-5 py-2 rounded-2xl font-medium hover:bg-orange-600 transition">
                New project
            </button>
        </div>

        {/* Top stats cards */}
        <div className="grid grid-cols-6 gap-4 mb-10">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white shadow-xl rounded-lg p-2 flex items-center cursor-default"
                    title={stat.label}
                >
                    <div>
                        <div className="text-sm text-gray-500 mb-4">{stat.label}</div>
                        <div className="text-lg mt-4 font-bold text-gray-700">{stat.value}</div>
                        {stat.label === 'Execution Progress 60%' && <div className="mt-2">{stat.icon}</div>}
                    </div>
                    {stat.label !== 'Execution Progress 60%' && <div className="ml-8 pt-6 flex-shrink-0">{stat.icon}</div>}
                </div>
            ))}
        </div>

        <div className="flex flex-row gap-4 mb-10">
            {/* ===== Ongoing Projects Table ===== */}
            <div>
                <div className="bg-white rounded shadow-2xl p-4 sm:p-6">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h2 className="text-lg font-bold text-gray-700">On going Projects</h2>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button className="px-3 py-1 text-sm flex items-center gap-2 bg-white border border-gray-300 rounded-2xl">
                                Filter: Active
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="px-3 py-1 text-sm flex items-center gap-2 bg-white border border-gray-300 rounded-2xl">
                                Sort: Progress
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="px-6 py-1 bg-[#F97316] text-white rounded-2xl hover:bg-orange-200 transition">
                                View All
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] table-auto text-left text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Project Name</th>
                                    <th className="py-2">Testers</th>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2">Progress</th>
                                    <th className="py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p, idx) => (
                                    <tr key={idx} className="border-b border-gray-200">
                                        <td className="py-2">{p.name}</td>
                                        <td className="py-2">
                                            {p.testers.map((t, tIdx) => (
                                                <div key={tIdx} className="flex items-center space-x-1 mb-1">
                                                    <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" src={t.image} alt={t.name} />
                                                    <span className="text-xs sm:text-sm">{t.name}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="py-2 text-xs sm:text-sm">{p.date}</td>
                                        <td className="py-2">
                                            <span className="bg-green-100 text-green-700 rounded px-2 py-1 text-xs">{p.status}</span>
                                        </td>
                                        <td className="py-2">
                                            <div className="w-20 sm:w-24 h-2 rounded bg-gray-200 mb-1 relative">
                                                <div
                                                    className="absolute left-0 top-0 h-2 rounded bg-orange-500"
                                                    style={{ width: `${p.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs">{p.progress}%</span>
                                        </td>
                                        <td className="py-2">
                                            <a href="#" className="text-orange-600 text-xs underline hover:text-orange-700">
                                                Details
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Simple bar chart section */}
                <div className="bg-white p-6 rounded-xl shadow mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Ongoing Projects &amp; Test Cases</h2>
                        <div className="flex gap-2">
                            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Projects</button>
                            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Test Cases</button>
                            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Last 12 weeks</button>
                        </div>
                    </div>
                    <div className="flex items-center text-xs mb-2">
                        <span className="flex items-center mr-4">
                            <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                            Projects
                        </span>
                        <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                            Test Cases
                        </span>
                    </div>
                </div>
                {/* Grouped bar chart mockup */}
                <div className="bg-white p-6 rounded-xl shadow mt-4">
                    {/* Grouped bar chart mockup */}
                    <div className="rounded-lg border border-gray-100 bg-white p-4">
                        <div className="flex items-end justify-between h-44 w-full space-x-4">
                            {/* Static data: Each week, blue = project, orange = test case */}
                            {[[50, 80], [60, 95], [70, 110], [80, 120], [70, 100], [90, 120]].map(([project, test], i) => (
                                <div key={i} className="flex items-end space-x-2">
                                    <div style={{ height: `${project}px` }} className="w-10 bg-blue-600 rounded-t"></div>
                                    <div style={{ height: `${test}px` }} className="w-10 bg-orange-500 rounded-t"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-3">Weekly throughput of active projects vs. executed test cases</p>
                </div>
            </div>

            {/* ===== Ongoing Test Cases with gray/orange bar ===== */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">On going Test Cases</h2>
                    <button className="px-5 py-2 bg-[#F97316] text-white text-sm rounded-2xl hover:bg-orange-600 transition">
                        View All
                    </button>
                </div>

                <div className="flex gap-3 mb-5">
                    <Image src="/icons/filter-list.png" alt="Card icon" width={24} height={24} className="w-6 h-6" />
                    <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-2xl text-sm bg-white">
                        Filter: Testers
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-2xl text-sm bg-white">
                        Sort: Status
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Test Case Cards */}
                <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                    {testCases.map((test, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center border border-gray-200 rounded-xl p-3 hover:shadow-md transition"
                        >
                            {/* left: name + status */}
                            <div className="flex flex-col">
                                <p className="text-black font-bold text-sm sm:text-base">{test.name.split(' ')[0]}</p>
                                <p className="text-black font-bold text-xs">{test.name.replace(/^[^ ]+\s*/, '')}</p>
                                <span className="text-xs text-black font-bold mt-1">{test.text}</span>
                                <span
                                    className={`mt-2 inline-block px-2 py-0.5 text-xs rounded ${getStatusColor(test.status)}`}
                                >
                                    {test.status}
                                </span>
                            </div>

                            {/* middle: tester image + name */}
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/images/image1.png"
                                    alt={test.tester}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm text-black font-bold">{test.tester}</span>
                            </div>

                            {/* right: progress bar (orange = elapsed, gray = remaining) */}
                            <div className="flex flex-col items-end w-24 sm:w-32">
                                <div className="relative w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-2 bg-orange-500 rounded-full"
                                        style={{ width: `${test.progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 mt-1">{test.timeElapsed}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </main>
)

export default Dashboard
