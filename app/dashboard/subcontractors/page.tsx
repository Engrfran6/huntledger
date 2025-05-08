'use client';

import {SubcontractorsTable} from '@/components/dashboard/subcontractors-table';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchSubcontractors} from '@/lib/api';
import {useSubcontractorsStore} from '@/lib/stores/subcontractors-store';
import {useQuery} from '@tanstack/react-query';
import {Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function SubcontractorsPage() {
  const router = useRouter();
  const {setSubcontractors} = useSubcontractorsStore();

  const {data: subcontractors, isLoading} = useQuery({
    queryKey: ['subcontractors'],
    queryFn: fetchSubcontractors,
  });

  useEffect(() => {
    if (subcontractors) {
      setSubcontractors(subcontractors);
    }
  }, [subcontractors, setSubcontractors]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Subcontractors</h1>
        <Button
          onClick={() => router.push('/dashboard/subcontractors/new')}
          className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Add Subcontractor
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold">All Subcontractors</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all your subcontractors and team members.
          </p>
        </div>
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <SubcontractorsTable subcontractors={subcontractors || []} />
        )}
      </div>
    </div>
  );
}
