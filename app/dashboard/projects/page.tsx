'use client';

import type React from 'react';

import {useEffect, useState} from 'react';

import {ProjectCard} from '@/components/dashboard/project-card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchClients, fetchTasks} from '@/lib/api';
import {useClientsStore} from '@/lib/stores/client-store';
import {useTasksStore} from '@/lib/stores/tasks-store';
import {useQuery} from '@tanstack/react-query';
import {Plus, Search} from 'lucide-react';
import {useRouter} from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const {setClients} = useClientsStore();
  const {setTasks} = useTasksStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch clients and tasks
  const {data: clients, isLoading: isLoadingClients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const {data: tasks, isLoading: isLoadingTasks} = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  useEffect(() => {
    if (clients) setClients(clients);
    if (tasks) setTasks(tasks);
  }, [clients, tasks, setClients, setTasks]);

  // Filter clients based on search query and status
  const filteredProjects = clients?.filter((client) => {
    const matchesSearch =
      client.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Group tasks by client
  const tasksByClient = tasks?.reduce((acc, task) => {
    if (!acc[task.clientId]) {
      acc[task.clientId] = [];
    }
    acc[task.clientId].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const isLoading = isLoadingClients || isLoadingTasks;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button
          onClick={() => router.push('/dashboard/clients/new')}
          className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[250px] w-full" />
          ))}
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((client) => (
            <ProjectCard
              key={client.id}
              project={client}
              tasks={tasksByClient?.[client.id] || []}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FolderIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? "Try adjusting your search or filter to find what you're looking for."
              : 'Get started by creating a new project.'}
          </p>
          <Button onClick={() => router.push('/dashboard/clients/new')} className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      )}
    </div>
  );
}

function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}
