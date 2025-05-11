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
  interviewDate?: string;
  startDate?: string;
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

export interface Subcontractor {
  id: string;
  userId: string; // ID of the main freelancer
  name: string;
  email?: string;
  phone?: string;
  expertise: string;
  rate?: string;
  notes?: string;
  createdAt?: any;
}

export interface Task {
  id: string;
  userId: string; // ID of the main freelancer
  clientId: string;
  subcontractorId?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  budget?: string;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  paymentAmount?: string;
  notes?: string;
  createdAt?: any;
}

export type UserType = 'jobSeeker' | 'freelancer';

export interface NotificationPreferences {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  applicationReminders?: boolean; // For job seekers
  deadlineReminders?: boolean; // For freelancers
  clientUpdates?: boolean; // For freelancers
  paymentReminders?: boolean; // For freelancers
  interviewReminders?: boolean; // For job seekers
  offerDeadlineReminders?: boolean; // For job seekers
}

export interface UserPreferences {
  userType: UserType;
  theme?: string;
  rememberUserType?: boolean;
  notifications: NotificationPreferences;
}
