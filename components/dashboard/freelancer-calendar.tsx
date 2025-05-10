'use client';

import React from 'react';

import {Badge} from '@/components/ui/badge';
import type {Client, Task} from '@/lib/types';
import {eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth} from 'date-fns';

interface FreelancerCalendarProps {
  clients: Client[];
  tasks: Task[];
}

export function FreelancerCalendar({clients, tasks}: FreelancerCalendarProps) {
  const today = new Date();
  const firstDay = startOfMonth(today);
  const lastDay = endOfMonth(today);
  const days = eachDayOfInterval({start: firstDay, end: lastDay});

  // Get day of week with 0 as Sunday, 1 as Monday, etc.
  const getFirstDayOfMonth = () => {
    return firstDay.getDay();
  };

  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      // Check start date
      if (task.startDate && isSameDay(new Date(task.startDate), day)) {
        return true;
      }

      // Check due date
      if (task.dueDate && isSameDay(new Date(task.dueDate), day)) {
        return true;
      }

      return false;
    });
  };

  // Get project milestones (client start/end dates)
  const getMilestonesForDay = (day: Date) => {
    if (!clients) return [];

    return clients.filter((client) => {
      // Check start date
      if (client.startDate && isSameDay(new Date(client.startDate), day)) {
        return true;
      }

      // Check end date
      if (client.endDate && isSameDay(new Date(client.endDate), day)) {
        return true;
      }

      return false;
    });
  };

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

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-purple-100 hover:bg-purple-200 text-purple-800';
      case 'end':
        return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800';
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
        const dayTasks = getTasksForDay(day);
        const dayMilestones = getMilestonesForDay(day);
        const isToday = isSameDay(day, new Date());

        return (
          <div
            key={i}
            className={`h-24 overflow-auto rounded-md border p-1 ${
              isToday ? 'border-orange-600 bg-orange-50' : ''
            }`}>
            <div className="text-right text-sm font-medium">{format(day, 'd')}</div>
            <div className="mt-1 space-y-1">
              {dayTasks.map((task, j) => {
                const isDueDate = task.dueDate && isSameDay(new Date(task.dueDate), day);

                return (
                  <div key={`task-${j}`} className="rounded-sm px-1 py-0.5 text-xs">
                    <Badge className={getStatusColor(task.status)} variant="outline">
                      {isDueDate ? 'Due' : 'Start'}
                    </Badge>
                    <div className="truncate font-medium">{task.title}</div>
                    <div className="truncate text-muted-foreground">
                      {getClientName(task.clientId)}
                    </div>
                  </div>
                );
              })}

              {dayMilestones.map((client, j) => {
                const isStartDate = client.startDate && isSameDay(new Date(client.startDate), day);
                const isEndDate = client.endDate && isSameDay(new Date(client.endDate), day);

                return (
                  <React.Fragment key={`milestone-${j}`}>
                    {isStartDate && (
                      <div className="rounded-sm px-1 py-0.5 text-xs">
                        <Badge className={getMilestoneColor('start')} variant="outline">
                          Project Start
                        </Badge>
                        <div className="truncate font-medium">{client.project}</div>
                        <div className="truncate text-muted-foreground">{client.name}</div>
                      </div>
                    )}

                    {isEndDate && (
                      <div className="rounded-sm px-1 py-0.5 text-xs">
                        <Badge className={getMilestoneColor('end')} variant="outline">
                          Project End
                        </Badge>
                        <div className="truncate font-medium">{client.project}</div>
                        <div className="truncate text-muted-foreground">{client.name}</div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
