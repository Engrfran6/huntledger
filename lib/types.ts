export interface Job {
  id: string;
  userId: string;
  company: string;
  position: string;
  location: string;
  status: string;
  url?: string;
  salary?: string;
  notes?: string;
  appliedDate: string;
  createdAt?: any;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  company?: string;
  project: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget?: string;
  rate?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  createdAt?: any;
}

export type UserType = 'jobSeeker' | 'freelancer';

export interface UserPreferences {
  userType: UserType;
  theme?: string;
  emailNotifications?: boolean;
}
