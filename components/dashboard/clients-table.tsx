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
import type {Client} from '@/lib/types';
import {formatDistanceToNow} from 'date-fns';
import {ChevronDown, ChevronUp, Mail, MoreHorizontal} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({clients}: ClientsTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<keyof Client>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      (client.company && client.company.toLowerCase().includes(searchLower)) ||
      client.project.toLowerCase().includes(searchLower) ||
      client.status.toLowerCase().includes(searchLower)
    );
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortField === 'startDate') {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
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
      case 'active':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'completed':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 hover:bg-red-200 text-red-800';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4">
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                Client
                {sortField === 'name' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('project')}>
                Project
                {sortField === 'project' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('status')}>
                Status
                {sortField === 'status' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('startDate')}>
                Start Date
                {sortField === 'startDate' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="hidden lg:table-cell">Budget</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No clients found. Add your first client!
                </TableCell>
              </TableRow>
            ) : (
              sortedClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/clients/${client.id}`)}>
                  <TableCell className="font-medium">
                    {client.name}
                    {client.company && (
                      <div className="text-xs text-muted-foreground">{client.company}</div>
                    )}
                  </TableCell>
                  <TableCell>{client.project}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className={getStatusColor(client.status)} variant="outline">
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(client.startDate), {addSuffix: true})}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{client.budget || 'N/A'}</TableCell>
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
                            router.push(`/dashboard/clients/${client.id}`);
                          }}>
                          Edit
                        </DropdownMenuItem>
                        {client.contactEmail && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${client.contactEmail}`;
                            }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email Client
                          </DropdownMenuItem>
                        )}
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
