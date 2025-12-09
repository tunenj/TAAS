'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { UserProfile, ProfileApiResponse, FormState } from '@/types/settings';

export const useUserProfile = () => {
  const { BASE_URL, accessToken } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    role: '',
    organization: '',
    phone: '',
    username: '',
    employeeId: '',
    department: '',
    workPhone: ''
  });

  const fetchUserProfile = async () => {
    if (!accessToken) {
      console.error('No authentication token found');
      return;
    }
    
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
      
      const data: ProfileApiResponse = await res.json();
      
      if (data.success && data.data) {
        setUserProfile(data.data);
        
        setForm({
          fullName: `${data.data.first_name || ''} ${data.data.last_name || ''}`.trim(),
          email: data.data.email || '',
          role: data.data.role_details?.name || data.data.role_name || '',
          organization: data.data.organization || data.data.role_details?.organization_group || '',
          phone: data.data.phone_number || '',
          username: data.data.username || '',
          employeeId: data.data.employee_id || '',
          department: data.data.department || '',
          workPhone: data.data.work_phone || ''
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);

  return {
    userProfile,
    form,
    isLoadingProfile,
    refetch: fetchUserProfile
  };
};
