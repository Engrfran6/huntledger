'use client';

import {JobsTable} from '@/components/dashboard/jobs-table';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchJobs} from '@/lib/api';
import {useJobsStore} from '@/lib/stores/jobs-store';
import {Job} from '@/lib/types';
import {useQuery} from '@tanstack/react-query';
import {Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function ApplicationsPage() {
  const router = useRouter();
  const {jobs, setJobs} = useJobsStore();

  const {data: fetchedJobs, isLoading} = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  useEffect(() => {
    if (fetchedJobs) {
      setJobs(fetchedJobs);
    }
  }, [fetchedJobs, setJobs]);

  const displayJobs = jobs || fetchedJobs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <Button
          onClick={() => router.push('/dashboard/jobs/new')}
          className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Add Job
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="py-6 px-2 md:px-6">
          <h2 className="text-xl font-semibold">All Job Applications</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all your remote job applications.
          </p>
        </div>
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <JobsTable jobs={displayJobs} />
        )}
      </div>
    </div>
  );
}
