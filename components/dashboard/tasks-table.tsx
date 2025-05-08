'use client';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import type {Client, Subcontractor, Task} from '@/lib/types';
import {formatDistanceToNow} from 'date-fns';
import {Calendar, ChevronDown, ChevronUp, MoreHorizontal} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

interface TasksTableProps {
  tasks: Task[];
  clients: Client[];
  subcontractors: Subcontractor[];
}

export function TasksTable({tasks, clients, subcontractors}: TasksTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<keyof Task>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortField === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'cancelled':
        return 'bg-red-100 hover:bg-red-200 text-red-800';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 hover:bg-red-200 text-red-800';
      case 'medium':
        return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
      case 'low':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getSubcontractorName = (subcontractorId?: string) => {
    if (!subcontractorId) return 'Unassigned';
    const subcontractor = subcontractors.find((s) => s.id === subcontractorId);
    return subcontractor ? subcontractor.name : 'Unknown Subcontractor';
  };

  return (
    <div className="space-y-4">
      <div className="p-4">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                Task
                {sortField === 'title' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead className="hidden md:table-cell">Assigned To</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                Status
                {sortField === 'status' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="hidden lg:table-cell cursor-pointer"
                onClick={() => handleSort('priority')}>
                Priority
                {sortField === 'priority' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="hidden lg:table-cell cursor-pointer"
                onClick={() => handleSort('dueDate')}>
                Due Date
                {sortField === 'dueDate' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No tasks found. Add your first task!
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/tasks/${task.id}`)}>
                  <TableCell className="font-medium">
                    {task.title}
                    {task.description && (
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {task.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getClientName(task.clientId)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getSubcontractorName(task.subcontractorId)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)} variant="outline">
                      {task.status
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.dueDate ? (
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDistanceToNow(new Date(task.dueDate), {addSuffix: true})}
                        </span>
                      </div>
                    ) : (
                      'No deadline'
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/tasks/${task.id}`);
                          }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/tasks/${task.id}/details`);
                          }}>
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
