'use client';

import {Badge} from '@/components/ui/badge';
import type {Job} from '@/lib/types';
import {eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth} from 'date-fns';

interface JobSeekerCalendarProps {
  jobs: Job[];
}

export function JobSeekerCalendar({jobs}: JobSeekerCalendarProps) {
  const today = new Date();
  const firstDay = startOfMonth(today);
  const lastDay = endOfMonth(today);
  const days = eachDayOfInterval({start: firstDay, end: lastDay});

  // Get day of week with 0 as Sunday, 1 as Monday, etc.
  const getFirstDayOfMonth = () => {
    return firstDay.getDay();
  };

  const getJobsForDay = (day: Date) => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const appliedDate = new Date(job.appliedDate);
      return isSameDay(appliedDate, day);
    });
  };

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
    <div className="grid grid-cols-7 gap-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
        <div key={i} className="text-center text-sm font-medium">
          {day}
        </div>
      ))}

      {/* Empty cells for days before the first day of month */}
      {Array.from({length: getFirstDayOfMonth()}).map((_, i) => (
        <div key={`empty-${i}`} className="h-24 rounded-md border border-dashed p-1" />
      ))}

      {/* Calendar days */}
      {days.map((day, i) => {
        const dayJobs = getJobsForDay(day);
        const isToday = isSameDay(day, new Date());

        return (
          <div
            key={i}
            className={`h-24 overflow-auto rounded-md border p-1 ${
              isToday ? 'border-orange-600 bg-orange-50' : ''
            }`}>
            <div className="text-right text-sm font-medium">{format(day, 'd')}</div>
            <div className="mt-1 space-y-1">
              {dayJobs.map((job, j) => (
                <div key={j} className="rounded-sm px-1 py-0.5 text-xs">
                  <Badge className={getStatusColor(job.status)} variant="outline">
                    {job.status}
                  </Badge>
                  <div className="truncate font-medium">{job.company}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
