'use client';

import {useQuery} from '@tanstack/react-query';
import {
  Briefcase,
  CheckCircle2,
  CircleDashed,
  Clock,
  FileText,
  Filter,
  Handshake,
  Megaphone,
  Pause,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

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

const statusOptions = [
  {value: 'all', label: 'All Statuses', icon: Briefcase},
  {value: 'cold-pitch', label: 'Cold Pitch', icon: Megaphone},
  {value: 'proposal', label: 'Proposal Sent', icon: FileText},
  {value: 'negotiation', label: 'Negotiation', icon: Handshake},
  {value: 'active', label: 'Active', icon: CircleDashed},
  {value: 'delivered', label: 'Delivered', icon: Clock},
  {value: 'paid', label: 'Paid', icon: CheckCircle2},
  {value: 'on-hold', label: 'On Hold', icon: Pause},
  {value: 'cancelled', label: 'Cancelled', icon: XCircle},
  {value: 'lost', label: 'Lost', icon: XCircle},
];

export default function ProjectsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const {data: clients, isLoading: isLoadingClients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const {data: tasks, isLoading: isLoadingTasks} = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // Filter and sort projects
  const filteredProjects = clients
    ?.filter((client) => {
      const matchesSearch =
        client.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    ?.sort((a, b) => {
      if (sortBy === 'recent') {
        return (
          new Date(b.startDate || b.createdAt).getTime() -
          new Date(a.startDate || a.createdAt).getTime()
        );
      } else if (sortBy === 'budget') {
        const budgetA = a.budget ? parseFloat(a.budget.replace(/[^0-9.-]+/g, '')) : 0;
        const budgetB = b.budget ? parseFloat(b.budget.replace(/[^0-9.-]+/g, '')) : 0;
        return budgetB - budgetA;
      }
      return 0;
    });

  const isLoading = isLoadingClients || isLoadingTasks;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center px-2">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button
          onClick={() => router.push('/dashboard/clients/new')}
          className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="budget">Highest Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
          ))}
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((client) => (
            <ProjectCard
              key={client.id}
              project={client}
              tasks={tasks?.filter((t) => t.clientId === client.id) || []}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Get started by adding your first project'}
          </p>
          <Button onClick={() => router.push('/dashboard/clients/new')} className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      )}
    </div>
  );
}
