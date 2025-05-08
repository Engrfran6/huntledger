'use client';

import {ClientsTable} from '@/components/dashboard/clients-table';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchClients} from '@/lib/api';
import {useClientsStore} from '@/lib/stores/client-store';
import {useQuery} from '@tanstack/react-query';
import {Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function ClientsPage() {
  const router = useRouter();
  const {setClients} = useClientsStore();

  const {data: clients, isLoading} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  useEffect(() => {
    if (clients) {
      setClients(clients);
    }
  }, [clients, setClients]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <Button
          onClick={() => router.push('/dashboard/clients/new')}
          className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold">All Clients</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all your client relationships.
          </p>
        </div>
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <ClientsTable clients={clients || []} />
        )}
      </div>
    </div>
  );
}
