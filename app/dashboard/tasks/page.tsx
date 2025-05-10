'use client';

import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchClients, fetchSubcontractors, fetchTasks} from '@/lib/api';
import {useSubcontractorsStore} from '@/lib/stores/subcontractors-store';
import {useTasksStore} from '@/lib/stores/tasks-store';
import {useQuery} from '@tanstack/react-query';
import {Plus} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {TasksTable} from '@/components/dashboard/tasks-table';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useClientsStore} from '@/lib/stores/client-store';

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {setTasks} = useTasksStore();
  const {setClients} = useClientsStore();
  const {setSubcontractors} = useSubcontractorsStore();

  const clientFilter = searchParams.get('client');
  const subcontractorFilter = searchParams.get('subcontractor');

  const [selectedClient, setSelectedClient] = useState<string>(clientFilter || 'all');
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<string>(
    subcontractorFilter || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch all data
  const {data: tasks, isLoading: isLoadingTasks} = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const {data: clients, isLoading: isLoadingClients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const {data: subcontractors, isLoading: isLoadingSubcontractors} = useQuery({
    queryKey: ['subcontractors'],
    queryFn: fetchSubcontractors,
  });

  useEffect(() => {
    if (tasks) setTasks(tasks);
    if (clients) setClients(clients);
    if (subcontractors) setSubcontractors(subcontractors);
  }, [tasks, clients, subcontractors, setTasks, setClients, setSubcontractors]);

  // Apply filters
  const filteredTasks =
    tasks?.filter((task) => {
      const matchesClient = selectedClient === 'all' || task.clientId === selectedClient;
      const matchesSubcontractor =
        selectedSubcontractor === 'all' ||
        (selectedSubcontractor === 'unassigned'
          ? !task.subcontractorId
          : task.subcontractorId === selectedSubcontractor);
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;

      return matchesClient && matchesSubcontractor && matchesStatus;
    }) || [];

  const isLoading = isLoadingTasks || isLoadingClients || isLoadingSubcontractors;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <Button
          onClick={() => router.push('/dashboard/tasks/new')}
          className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter tasks by client, subcontractor, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subcontractor</label>
              <Select value={selectedSubcontractor} onValueChange={setSelectedSubcontractor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcontractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcontractors</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {subcontractors?.map((subcontractor) => (
                    <SelectItem key={subcontractor.id} value={subcontractor.id}>
                      {subcontractor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold">All Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track tasks assigned to subcontractors.
          </p>
        </div>
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <TasksTable
            tasks={filteredTasks}
            clients={clients || []}
            subcontractors={subcontractors || []}
          />
        )}
      </div>
    </div>
  );
}
