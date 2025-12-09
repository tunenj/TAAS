export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  work_phone?: string;
  employee_id?: string;
  role_name?: string;
  department?: string;
  username?: string;
  organization?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_logged_in?: boolean;
  role_details?: {
    role_id?: string;
    name?: string;
    description?: string;
    organization_group?: string;
  };
}

export interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface FormState {
  fullName: string;
  email: string;
  role: string;
  organization: string;
  phone: string;
  username: string;
  employeeId?: string;
  department?: string;
  workPhone?: string;
}
