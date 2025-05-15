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
import type {Job} from '@/lib/types';
import {formatDistanceToNow} from 'date-fns';
import {ChevronDown, ChevronUp, Edit, ExternalLink, MoreHorizontal} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

interface JobsTableProps {
  jobs: Job[];
}

export function JobsTable({jobs}: JobsTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<keyof Job>('appliedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      job.company.toLowerCase().includes(searchLower) ||
      job.position.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.status.toLowerCase().includes(searchLower)
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortField === 'appliedDate') {
      const dateA = new Date(a.appliedDate).getTime();
      const dateB = new Date(b.appliedDate).getTime();
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
      case 'applied':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
      case 'interview':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      case 'offer':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-100 hover:bg-red-200 text-red-800';
      case 'withdrawn':
        return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4">
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('company')}>
                Company
                {sortField === 'company' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('position')}>
                Position
                {sortField === 'position' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('location')}>
                Location
                {sortField === 'location' &&
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
                onClick={() => handleSort('appliedDate')}>
                Applied
                {sortField === 'appliedDate' &&
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
            {sortedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No jobs found. Add your first job application!
                </TableCell>
              </TableRow>
            ) : (
              sortedJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/jobs/${job.id}`)}>
                  <TableCell className="font-medium max-w-[9rem]  truncate">
                    {job.company}
                  </TableCell>
                  <TableCell>{job.position}</TableCell>
                  <TableCell className="hidden md:table-cell">{job.location}</TableCell>

                  <TableCell className="hidden md:table-cell">
                    <Badge className={getStatusColor(job.status)} variant="outline">
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(job.appliedDate), {addSuffix: true})}
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
                            router.push(`/dashboard/jobs/${job.id}`);
                          }}>
                          <Edit />
                          Edit
                        </DropdownMenuItem>

                        {job.url && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(job.url, '_blank');
                            }}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Job URL
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
