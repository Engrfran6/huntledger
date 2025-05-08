'use client';

import {ClientsTable} from '@/components/dashboard/clients-table';
import {JobsTable} from '@/components/dashboard/jobs-table';
import {StatsCards} from '@/components/dashboard/stats-cards';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchClients, fetchJobs} from '@/lib/api';
import {useClientsStore} from '@/lib/stores/client-store';
import {useJobsStore} from '@/lib/stores/jobs-store';
import {useUserStore} from '@/lib/stores/user-store';
import {useQuery} from '@tanstack/react-query';
import {Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const {setJobs} = useJobsStore();
  const {setClients} = useClientsStore();
  const {userType} = useUserStore();

  const {data: jobs, isLoading: isLoadingJobs} = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    enabled: userType === 'jobSeeker',
  });

  const {data: clients, isLoading: isLoadingClients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    enabled: userType === 'freelancer',
  });

  useEffect(() => {
    if (userType === 'jobSeeker' && jobs) {
      setJobs(jobs);
    } else if (userType === 'freelancer' && clients) {
      setClients(clients);
    }
  }, [jobs, clients, setJobs, setClients, userType]);

  const isLoading = userType === 'jobSeeker' ? isLoadingJobs : isLoadingClients;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        {userType === 'jobSeeker' ? (
          <Button
            onClick={() => router.push('/dashboard/jobs/new')}
            className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" /> Add Job
          </Button>
        ) : (
          <Button
            onClick={() => router.push('/dashboard/clients/new')}
            className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      ) : (
        <StatsCards items={userType === 'jobSeeker' ? jobs || [] : clients || []} type={userType} />
      )}

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold">
            {userType === 'jobSeeker' ? 'Job Applications' : 'Client Projects'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {userType === 'jobSeeker'
              ? 'Manage and track all your remote job applications.'
              : 'Manage and track all your client projects.'}
          </p>
        </div>
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : userType === 'jobSeeker' ? (
          <JobsTable jobs={jobs || []} />
        ) : (
          <ClientsTable clients={clients || []} />
        )}
      </div>
    </div>
  );
}

//  <div className="space-y-6">
//    <div className="flex items-center justify-between">
//      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
//      <Button
//        onClick={() => router.push('/dashboard/jobs/new')}
//        className="bg-orange-600 hover:bg-orange-700">
//        <Plus className="mr-2 h-4 w-4" /> Add Job
//      </Button>
//    </div>

//    {isLoading ? (
//      <div className="grid gap-4 md:grid-cols-3">
//        {Array(3)
//          .fill(0)
//          .map((_, i) => (
//            <Skeleton key={i} className="h-32 w-full" />
//          ))}
//      </div>
//    ) : (
//      <StatsCards jobs={jobs || []} />
//    )}

//    <div className="rounded-lg border bg-card">
//      <div className="p-6">
//        <h2 className="text-xl font-semibold">Job Applications</h2>
//        <p className="text-sm  text-orange-600">
//          Manage and track all your remote job applications.
//        </p>
//      </div>
//      {isLoading ? (
//        <div className="p-6">
//          <Skeleton className="h-64 w-full" />
//        </div>
//      ) : (
//        <JobsTable jobs={jobs || []} />
//      )}
//    </div>
//  </div>;
