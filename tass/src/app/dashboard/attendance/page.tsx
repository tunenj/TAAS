'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'

interface AttendanceData {
    day: string;
    date: number;
    status: 'Present' | 'Absent' | 'Weekend';
    hours?: string;
}

const userInfo = {
    idNumber: "HTS-101",
    firstName: "Triston",
    lastName: "Anny",
    mobilePhone: "234-8120573456",
    email: "tristontest@gmail.com",
    workPhone: "234-8120573456"
};

export default function EmployeeDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'Activities' | 'Profile'>('Activities');
    const attendanceData: AttendanceData[] = [
        { day: 'Sun', date: 7, status: 'Weekend', hours: '01:35 Hrs' },
        { day: 'Mon', date: 8, status: 'Absent', hours: '01:39 Hrs' },
        { day: 'Tue', date: 9, status: 'Present', hours: '01:39 Hrs' },
        { day: 'Wed', date: 10, status: 'Present', hours: '01:39 Hrs' },
        { day: 'Thu', date: 11, status: 'Absent', hours: '01:39 Hrs' },
        { day: 'Fri', date: 12, status: 'Present', hours: '01:39 Hrs' },
        { day: 'Sat', date: 13, status: 'Weekend', hours: '' },
    ];


    return (
        <main className="min-h-screen mt-24">
            {/* Cover Image */}
            <div className="absolute inset-0 z-10">
                <div className="relative w-full h-[279px]">
                    <Image
                        className="absolute inset-0 bg-center filter brightness-105"
                        src="/images/attendance.png"
                        alt="Cover image"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 h-fit mt-6">
                        <div className="flex flex-col items-center">
                            <div className="relative -mt-14 mb-4">
                                <Image
                                    src="/icons/profile.png"
                                    alt="Profile"
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Triston@33</h3>
                            <p className="text-sm text-gray-500 mb-4">Supervisor</p>
                            <button className="text-[#52F44A] text-[16px] font-medium mb-2">In</button>

                            {/* Clock */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="text-xl font-bold text-gray-800 px-1.5 py-0.5 bg-gray-200 rounded-lg">06</div>
                                <span className="text-black mx-1">:</span>
                                <div className="text-xl font-bold text-gray-800 px-1.5 py-0.5 bg-gray-200 rounded-lg">49</div>
                                <span className="text-black mx-1">:</span>
                                <div className="text-xl font-bold text-gray-800 px-1.5 py-0.5 bg-gray-200 rounded-lg">06</div>
                            </div>

                            <button className="w-[132px] bg-white text-red-500 py-2 px-3 rounded-lg border border-red-500 text-sm font-medium mt-4">
                                Check Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-lg mt-20">
                            <div className="border-b border-gray-200">
                                <nav className="flex">
                                    <button
                                        onClick={() => setActiveTab('Activities')}
                                        className={`px-6 py-3 font-medium text-sm ${activeTab === 'Activities'
                                            ? 'text-orange-500 border-b-2 border-orange-500'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Activities
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('Profile')}
                                        className={`px-6 py-3 font-medium text-sm ${activeTab === 'Profile'
                                            ? 'text-orange-500 border-b-2 border-orange-500'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Profile
                                    </button>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'Activities' && (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-xl font-semibold text-gray-800">Good Morning</h2>
                                                <span className="text-gray-500">- Triston</span>
                                            </div>
                                            <Image
                                                src="/icons/icon.png"
                                                alt="Profile"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover border-4 border-gray-200"
                                            />
                                        </div>

                                        {/* Work Schedule */}
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Work Schedule</h3>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">02-Sep-2025 — 13-Sep-2025</div>

                                            <div className="bg-[#FBF1EF] border-l-4 border-[#BB3C2D] p-3 rounded">
                                                <div className="text-sm font-medium text-gray-800">General</div>
                                                <div className="text-xs text-gray-600">9:00 AM - 5:00 PM</div>
                                            </div>
                                        </div>

                                        {/* Attendance Calendar */}
                                        <div className="grid grid-cols-7 gap-2 mb-4">
                                            {attendanceData.map((item, index) => (
                                                <div key={index} className="text-center">
                                                    <div className="text-xs text-gray-500 mb-1">{item.day}</div>
                                                    <div className="text-xs font-medium mb-1">
                                                        {item.date.toString().padStart(2, '0')}
                                                    </div>
                                                    <div
                                                        className={`text-xs px-1 py-1 rounded ${item.status === 'Present'
                                                            ? 'bg-green-100 text-green-600'
                                                            : item.status === 'Absent'
                                                                ? 'bg-red-100 text-red-600'
                                                                : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </div>
                                                    {item.hours && (
                                                        <div className="text-xs text-gray-400 mt-1">{item.hours}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-right">
                                            <button
                                                onClick={() => router.push('/dashboard/AttendanceList')}
                                                className="text-orange-500 hover:text-orange-600 text-sm font-medium cursor-pointer"
                                            >
                                                Attendance List
                                            </button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'Profile' && (
                                    <div>
                                        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto mt-2">
                                            <h2 className="text-sm text-gray-400 font-semibold mb-2">Basic Info</h2>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-600">ID Number</label>
                                                    <div className="border border-gray-200 p-2 rounded">{userInfo.idNumber}</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-600">First Name</label>
                                                    <div className="border border-gray-200 p-2 rounded">{userInfo.firstName}</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                                                    <div className="border border-gray-200 p-2 rounded">{userInfo.lastName}</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-600">Mobile Phone</label>
                                                    <div className="border border-gray-200 p-2 rounded">{userInfo.mobilePhone}</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-600">Email ID</label>
                                                    <div className="border border-gray-200 p-2 rounded">{userInfo.email}</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-600">Work Phone</label>
                                                    <div className="border border-gray-200 p-2 rounded">{userInfo.workPhone}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
