'use client';

import {FreelancerAnalytics} from '@/components/dashboard/freelancer-analytics';
import {JobSeekerAnalytics} from '@/components/dashboard/job-seeker-analytics';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchClients, fetchJobs, fetchTasks} from '@/lib/api';
import {useUserStore} from '@/lib/stores/user-store';
import {useQuery} from '@tanstack/react-query';

export default function AnalyticsPage() {
  const {userType} = useUserStore();

  // Fetch jobs for job seekers
  const {data: jobs, isLoading: isLoadingJobs} = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    enabled: userType === 'jobSeeker',
  });

  // Fetch clients and tasks for freelancers
  const {data: clients, isLoading: isLoadingClients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    enabled: userType === 'freelancer',
  });

  const {data: tasks, isLoading: isLoadingTasks} = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: userType === 'freelancer',
  });

  const isLoading =
    (userType === 'jobSeeker' && isLoadingJobs) ||
    (userType === 'freelancer' && (isLoadingClients || isLoadingTasks));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pl-2">
        <h1 className="text-2xl font-bold tracking-tight ">Analytics</h1>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      ) : userType === 'jobSeeker' ? (
        <JobSeekerAnalytics jobs={jobs || []} />
      ) : (
        <FreelancerAnalytics clients={clients || []} tasks={tasks || []} />
      )}
    </div>
  );
}
