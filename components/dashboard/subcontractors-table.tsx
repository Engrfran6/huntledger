'use client';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import type {Subcontractor} from '@/lib/types';
import {ChevronDown, ChevronUp, Mail, MoreHorizontal, Phone} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

interface SubcontractorsTableProps {
  subcontractors: Subcontractor[];
}

export function SubcontractorsTable({subcontractors}: SubcontractorsTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<keyof Subcontractor>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: keyof Subcontractor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSubcontractors = subcontractors.filter((subcontractor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      subcontractor.name.toLowerCase().includes(searchLower) ||
      subcontractor.expertise.toLowerCase().includes(searchLower) ||
      (subcontractor.email && subcontractor.email.toLowerCase().includes(searchLower))
    );
  });

  const sortedSubcontractors = [...filteredSubcontractors].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="p-4">
        <Input
          placeholder="Search subcontractors..."
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
                Name
                {sortField === 'name' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('expertise')}>
                Expertise
                {sortField === 'expertise' &&
                  (sortDirection === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Rate</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubcontractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No subcontractors found. Add your first subcontractor!
                </TableCell>
              </TableRow>
            ) : (
              sortedSubcontractors.map((subcontractor) => (
                <TableRow
                  key={subcontractor.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/subcontractors/${subcontractor.id}`)}>
                  <TableCell className="font-medium">{subcontractor.name}</TableCell>
                  <TableCell>{subcontractor.expertise}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {subcontractor.email && <div className="text-sm">{subcontractor.email}</div>}
                    {subcontractor.phone && (
                      <div className="text-sm text-muted-foreground">{subcontractor.phone}</div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {subcontractor.rate || 'N/A'}
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
                            router.push(`/dashboard/subcontractors/${subcontractor.id}`);
                          }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/tasks?subcontractor=${subcontractor.id}`);
                          }}>
                          View Tasks
                        </DropdownMenuItem>
                        {subcontractor.email && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${subcontractor.email}`;
                            }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </DropdownMenuItem>
                        )}
                        {subcontractor.phone && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${subcontractor.phone}`;
                            }}>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
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
