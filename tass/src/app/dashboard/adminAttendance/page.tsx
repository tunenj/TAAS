'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { useAuth } from '@/app/hooks/useAuth';

dayjs.extend(durationPlugin);

interface AttendanceData {
  day: string;
  date: number;
  month: number;
  year: number;
  status: 'Present' | 'Absent' | 'Weekend';
  hours?: string;
  totalHours?: string;
}

interface AttendanceRecord {
  id: string;
  created_at: string;
  check_in_time: string | null;
  check_out_time: string | null;
  duration: string | null;
}

interface AttendanceSummaryResponse {
  success: boolean;
  message: string;
  data: {
    detail: string;
    attendance: AttendanceRecord[];
  };
}

interface AttendanceStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    week_days: number;
    week_percent: number;
    month_days: number;
    month_percent: number;
    year_days: number;
    year_percent: number;
  };
}

interface CheckInResponse {
  success: boolean;
  message: string;
  data: {
    session_id: number;
    check_in_datetime: string;
  };
}

interface CheckOutResponse {
  success: boolean;
  message: string;
  data: {
    session_id: number;
    check_in_datetime: string;
    check_out_datetime: string;
    duration: string;
  };
}

interface UserProfileResponse {
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
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  mobilePhone: string;
  email: string;
  workPhone: string;
  position?: string;
  department?: string;
}

type AttendanceStatus = 'checked-in' | 'checked-out' | 'not-checked-in' | null;

const calculateTotalHours = (duration: string): string => {
  if (!duration) return '00:00 Hrs';

  try {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${totalHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')} Hrs`;
  } catch {
    return '00:00 Hrs';
  }
};

const getDayName = (date: string): string => {
  const day = dayjs(date).day();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const { accessToken, BASE_URL, refreshUser, user } = useAuth(true);

  const [activeTab, setActiveTab] = useState<'Activities' | 'Profile'>('Activities');
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("not-checked-in");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [durationStr, setDurationStr] = useState<string>('00:00:00');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceRecord[]>([]);
  const [attendanceCalendar, setAttendanceCalendar] = useState<AttendanceData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStatisticsResponse['data'] | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const userName = userProfile?.firstName || user?.first_name || 'User';
  const userEmail = userProfile?.email || user?.email || 'user@example.com';

  useEffect(() => {
    const savedStatus = localStorage.getItem('attendanceStatus') as AttendanceStatus;
    const savedCheckIn = localStorage.getItem('checkInTime');
    const savedCheckOut = localStorage.getItem('checkOutTime');

    if (savedStatus) {
      setAttendanceStatus(savedStatus);
      setCheckInTime(savedCheckIn);
      setCheckOutTime(savedCheckOut);
    }
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchUserProfile = async () => {
    if (!accessToken) return;

    try {
      setIsLoadingProfile(true);
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
        const profileData: UserProfile = {
          id: data.data.id || 'Not assigned',
          firstName: data.data.first_name || '',
          lastName: data.data.last_name || '',
          mobilePhone: data.data.phone_number || 'Not available',
          email: data.data.email || '',
          workPhone: data.data.work_phone || 'Not available',
          position: data.data.role_name || 'Supervisor',
          department: data.data.department || 'Not assigned'
        };

        setUserProfile(profileData);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchAttendanceStatistics = async () => {
    if (!accessToken) return;

    try {
      setIsLoadingStats(true);
      const res = await fetch(`${BASE_URL}/attendance/statistics/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: AttendanceStatisticsResponse = await res.json();

      if (data.success && data.data) {
        setAttendanceStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching attendance statistics:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchAttendanceSummary = async () => {
    if (!accessToken) return;

    try {
      setIsLoadingAttendance(true);

      const res = await fetch(`${BASE_URL}/attendance/statistics/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 400) {
        const emptyAttendance: AttendanceRecord[] = [];

        setAttendanceSummary(emptyAttendance);
        setAttendanceCalendar(generateAttendanceCalendar(emptyAttendance));

        setAttendanceStatus("not-checked-in");
        setCheckInTime(null);
        setCheckOutTime(null);

        localStorage.removeItem("attendanceStatus");
        localStorage.removeItem("checkInTime");
        localStorage.removeItem("checkOutTime");

        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: AttendanceSummaryResponse = await res.json();

      if (data.success && data.data?.attendance) {
        setAttendanceSummary(data.data.attendance);

        const calendarData = generateAttendanceCalendar(data.data.attendance);
        setAttendanceCalendar(calendarData);

        const today = dayjs().format("YYYY-MM-DD");

        const todayAttendance = data.data.attendance.find(
          (record) =>
            record.created_at === today &&
            record.check_in_time &&
            !record.check_out_time
        );

        if (todayAttendance) {
          setAttendanceStatus("checked-in");
          setCheckInTime(todayAttendance.check_in_time);
          setCheckOutTime(null);

          localStorage.setItem("attendanceStatus", "checked-in");
          localStorage.setItem(
            "checkInTime",
            todayAttendance.check_in_time || ""
          );
          localStorage.removeItem("checkOutTime");
        } else {
          setAttendanceStatus("not-checked-in");
          localStorage.removeItem("attendanceStatus");
        }
      }
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  const generateAttendanceCalendar = (attendance: AttendanceRecord[]): AttendanceData[] => {
    const calendarData: AttendanceData[] = [];
    const today = dayjs();

    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      const dayName = getDayName(dateStr);
      const dateNum = date.date();
      const month = date.month();
      const year = date.year();

      const dayAttendance = attendance.find(record => record.created_at === dateStr);

      const dayOfWeek = date.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isWeekend) {
        calendarData.push({
          day: dayName,
          date: dateNum,
          month,
          year,
          status: 'Weekend',
          hours: '',
          totalHours: ''
        });
      } else if (dayAttendance) {
        const totalHours = calculateTotalHours(dayAttendance.duration || '');
        calendarData.push({
          day: dayName,
          date: dateNum,
          month,
          year,
          status: 'Present',
          hours: totalHours,
          totalHours
        });
      } else {
        calendarData.push({
          day: dayName,
          date: dateNum,
          month,
          year,
          status: 'Absent',
          hours: '00:00 Hrs',
          totalHours: '00:00 Hrs'
        });
      }
    }

    return calendarData;
  };

  const handleCheckIn = async () => {
    if (!accessToken) {
      alert('Please login to check in');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/attendance/check-in/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: CheckInResponse = await res.json();

      if (data.success) {
        const checkInDateTime = data.data.check_in_datetime;
        
        setAttendanceStatus('checked-in');
        setCheckInTime(checkInDateTime);
        setCheckOutTime(null);

        localStorage.setItem('attendanceStatus', 'checked-in');
        localStorage.setItem('checkInTime', checkInDateTime);
        localStorage.removeItem('checkOutTime');

        await fetchAttendanceSummary();
        await fetchAttendanceStatistics();

        if (refreshUser) refreshUser();

        alert(data.message || 'Checked in successfully');
      }
    } catch (err) {
      console.error('Check-in failed:', err);
      alert('Failed to check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!accessToken) {
      alert('Please login to check out');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/attendance/check-out/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: CheckOutResponse = await res.json();

      if (data.success) {
        const checkInDateTime = data.data.check_in_datetime;
        const checkOutDateTime = data.data.check_out_datetime;
        const duration = data.data.duration;
        
        setAttendanceStatus('checked-out');
        setCheckInTime(checkInDateTime);
        setCheckOutTime(checkOutDateTime);

        localStorage.setItem('attendanceStatus', 'checked-out');
        localStorage.setItem('checkInTime', checkInDateTime);
        localStorage.setItem('checkOutTime', checkOutDateTime);

        await fetchAttendanceSummary();
        await fetchAttendanceStatistics();

        if (refreshUser) refreshUser();

        alert(data.message || 'Checked out successfully');
      }
    } catch (err) {
      console.error('Check-out failed:', err);
      alert('Failed to check out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (attendanceStatus === 'checked-in' && checkInTime) {
      const updateDuration = () => {
        const now = dayjs();
        const checkIn = dayjs(checkInTime);
        const diff = dayjs.duration(now.diff(checkIn));
        const hours = Math.floor(diff.asHours());
        const minutes = diff.minutes();
        const seconds = diff.seconds();

        setDurationStr(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      };

      updateDuration();
      timer = setInterval(updateDuration, 1000);
    } else if (attendanceStatus === 'checked-out' && checkInTime && checkOutTime) {
      const checkIn = dayjs(checkInTime);
      const checkOut = dayjs(checkOutTime);
      const diff = dayjs.duration(checkOut.diff(checkIn));
      const hours = Math.floor(diff.asHours());
      const minutes = diff.minutes();
      const seconds = diff.seconds();

      setDurationStr(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    } else {
      setDurationStr('00:00:00');
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [attendanceStatus, checkInTime, checkOutTime]);

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile();
      fetchAttendanceSummary();
      fetchAttendanceStatistics();
    }
  }, [accessToken]);

  useEffect(() => {
    const checkAndReset = () => {
      const now = new Date();
      const currentDate = now.getDate();
      const lastResetDate = parseInt(localStorage.getItem('lastResetDate') || '0');

      if (currentDate !== lastResetDate) {
        setAttendanceStatus(null);
        setCheckInTime(null);
        setCheckOutTime(null);
        localStorage.removeItem('attendanceStatus');
        localStorage.removeItem('checkInTime');
        localStorage.removeItem('checkOutTime');
        localStorage.setItem('lastResetDate', currentDate.toString());

        if (accessToken) {
          fetchAttendanceSummary();
          fetchAttendanceStatistics();
        }
      }
    };

    checkAndReset();
    const intervalId = setInterval(checkAndReset, 3600000);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  const calculateWeeklyTotal = () => {
    const presentDays = attendanceCalendar.filter(item => item.status === 'Present');
    if (presentDays.length === 0) return '00:00 Hrs';

    let totalMinutes = 0;

    presentDays.forEach(day => {
      if (day.hours) {
        const [hours, minutes] = day.hours.replace(' Hrs', '').split(':').map(Number);
        totalMinutes += (hours * 60) + minutes;
      }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${totalHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')} Hrs`;
  };

  const calculateAbsentDays = (totalDays: number, presentDays: number) => {
    return totalDays - presentDays;
  };

  const getTotalWorkingDays = (period: 'week' | 'month' | 'year'): number => {
    const today = dayjs();
    let totalDays = 0;

    if (period === 'week') {
      const startOfWeek = today.startOf('week');
      const endOfWeek = today.endOf('week');
      let currentDay = startOfWeek;
      while (currentDay.isBefore(endOfWeek) || currentDay.isSame(endOfWeek)) {
        if (currentDay.day() !== 0 && currentDay.day() !== 6) {
          totalDays++;
        }
        currentDay = currentDay.add(1, 'day');
      }
    } else if (period === 'month') {
      const daysInMonth = today.daysInMonth();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = today.date(i);
        if (date.day() !== 0 && date.day() !== 6) {
          totalDays++;
        }
      }
    } else if (period === 'year') {
      const startOfYear = today.startOf('year');
      const endOfYear = today.endOf('year');
      let currentDay = startOfYear;
      while (currentDay.isBefore(endOfYear) || currentDay.isSame(endOfYear)) {
        if (currentDay.day() !== 0 && currentDay.day() !== 6) {
          totalDays++;
        }
        currentDay = currentDay.add(1, 'day');
      }
    }

    return totalDays;
  };

  return (
    <main className="min-h-screen mt-10">
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
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {userName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {userProfile?.position || 'Supervisor'}
              </p>

              <div className="mb-2">
                {attendanceStatus === 'checked-in' ? (
                  <span className="text-[#52F44A] text-[16px] font-medium">Checked In</span>
                ) : attendanceStatus === 'checked-out' ? (
                  <span className="text-gray-500 text-[16px] font-medium">Checked Out</span>
                ) : (
                  <span className="text-black text-[16px] font-medium">Not Checked In</span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                {currentTime.split(':').map((unit, idx) => (
                  <div key={idx} className="text-xl font-bold text-gray-800 px-1.5 py-0.5 bg-gray-200 rounded-lg">
                    {unit}
                  </div>
                ))}
              </div>

              <button
                onClick={attendanceStatus === 'checked-in' ? handleCheckOut : handleCheckIn}
                disabled={isLoading}
                className={`w-[132px] py-2 px-3 rounded-lg text-sm font-medium mb-2 transition-colors ${attendanceStatus === 'checked-in'
                  ? 'bg-white text-red-500 border border-red-500 hover:bg-red-50'
                  : 'bg-white text-[#52F44A] border border-[#52F44A] hover:bg-green-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  'Loading...'
                ) : attendanceStatus === 'checked-in' ? (
                  'Check Out'
                ) : (
                  'Check In'
                )}
              </button>

              {checkInTime && (
                <div className="text-xs text-gray-500 text-center mt-2">
                  <p>Check-in: {dayjs(checkInTime).format('h:mm A')}</p>
                  {checkOutTime && (
                    <p>Check-out: {dayjs(checkOutTime).format('h:mm A')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Attendance Statistics */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Attendance Statistics
              </h3>
              
              {isLoadingStats ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : attendanceStats ? (
                <div className="space-y-4">
                  {/* Weekly Stats */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">This Week</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {attendanceStats.week_percent}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div>
                        <span className="text-green-600 font-medium">✓ {attendanceStats.week_days} days</span>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">
                          ✗ {calculateAbsentDays(getTotalWorkingDays('week'), attendanceStats.week_days)} days
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(attendanceStats.week_percent, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Monthly Stats */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">This Month</span>
                      <span className="text-sm font-semibold text-green-600">
                        {attendanceStats.month_percent}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div>
                        <span className="text-green-600 font-medium">✓ {attendanceStats.month_days} days</span>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">
                          ✗ {calculateAbsentDays(getTotalWorkingDays('month'), attendanceStats.month_days)} days
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(attendanceStats.month_percent, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Yearly Stats */}
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">This Year</span>
                      <span className="text-sm font-semibold text-purple-600">
                        {attendanceStats.year_percent}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div>
                        <span className="text-green-600 font-medium">✓ {attendanceStats.year_days} days</span>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">
                          ✗ {calculateAbsentDays(getTotalWorkingDays('year'), attendanceStats.year_days)} days
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(attendanceStats.year_percent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No statistics available
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
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

              <div className="p-6">
                {activeTab === 'Activities' && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {dayjs().hour() < 12 ? 'Good Morning' :
                            dayjs().hour() < 18 ? 'Good Afternoon' : 'Good Evening'}
                        </h2>
                        <span className="text-gray-500">- {userName}</span>
                      </div>
                      <Image
                        src="/icons/icon.png"
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border-4 border-gray-200"
                      />
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        </div>
                        <h3 className="font-semibold text-gray-800">Work Schedule</h3>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {attendanceCalendar.length > 0
                          ? `${dayjs().subtract(6, 'day').format('DD-MMM-YYYY')} — ${dayjs().format('DD-MMM-YYYY')}`
                          : 'Loading...'
                        }
                      </div>
                      <div className="bg-[#FBF1EF] border-l-4 border-[#BB3C2D] p-1 rounded">
                        <div className="text-sm font-medium text-gray-800">General</div>
                        <div className="text-xs text-gray-600">9:00 AM - 5:00 PM</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {isLoadingAttendance ? (
                        Array(7).fill(0).map((_, index) => (
                          <div key={index} className="text-center">
                            <div className="text-xs text-gray-500 mb-1 h-4 bg-gray-200 animate-pulse rounded"></div>
                            <div className="text-xs font-medium mb-1 h-6 bg-gray-200 animate-pulse rounded"></div>
                            <div className="text-xs px-1 py-1 rounded bg-gray-200 animate-pulse h-6"></div>
                            <div className="text-xs text-black mt-1 h-4 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        ))
                      ) : (
                        attendanceCalendar.map((item, index) => (
                          <div key={index} className="text-center">
                            <div className="text-xs text-gray-500 mb-1">{item.day}</div>
                            <div className="text-xs font-medium mb-1">{item.date.toString().padStart(2, '0')}</div>
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
                            {item.hours && <div className="text-xs text-black mt-1">{item.hours}</div>}
                          </div>
                        ))
                      )}
                    </div>

                    {!isLoadingAttendance && attendanceCalendar.length > 0 && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-700">
                            Week Total: {calculateWeeklyTotal()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Present: {attendanceCalendar.filter(item => item.status === 'Present').length} days
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='text-right'>
                      <button
                        onClick={() => router.push('/dashboard/adminAttendance/AttendanceList')}
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
                      <h2 className="text-sm text-black font-semibold mb-2">Basic Info</h2>
                      {isLoadingProfile ? (
                        <div className="grid grid-cols-2 gap-4">
                          {Array(6).fill(0).map((_, index) => (
                            <div key={index} className="flex flex-col">
                              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                              <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">ID Number</label>
                            <div className="border border-gray-200 p-2 rounded">
                              {userProfile?.id || 'Not assigned'}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">First Name</label>
                            <div className="border border-gray-200 p-2 rounded">
                              {userProfile?.firstName || userName}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Last Name</label>
                            <div className="border border-gray-200 p-2 rounded">
                              {userProfile?.lastName || user?.last_name || 'Not available'}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Mobile Phone</label>
                            <div className="border border-gray-200 p-2 rounded">
                              {userProfile?.mobilePhone || 'Not available'}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Email ID</label>
                            <div className="border border-gray-200 p-2 rounded">
                              {userProfile?.email || userEmail}
                            </div>
                          </div>
                          {userProfile?.position && (
                            <div className="flex flex-col">
                              <label className="text-sm font-medium text-gray-600">Position</label>
                              <div className="border border-gray-200 p-2 rounded">
                                {userProfile.position}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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