'use client';

import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import type {Client, Task} from '@/lib/types';
import {formatDistanceToNow} from 'date-fns';
import {CalendarDays, Clock, DollarSign} from 'lucide-react';

interface ProjectCardProps {
  project: Client;
  tasks: Task[];
  onClick?: () => void;
}

export function ProjectCard({project, tasks, onClick}: ProjectCardProps) {
  // Calculate project progress based on completed tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get status color
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

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {addSuffix: true});
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">{project.project}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {project.company ? `${project.name} (${project.company})` : project.name}
            </p>
          </div>
          <Badge className={getStatusColor(project.status)} variant="outline">
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="mr-1 h-4 w-4" />
              <span>Started {formatDate(project.startDate)}</span>
            </div>
            {project.endDate && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>Due {formatDate(project.endDate)}</span>
              </div>
            )}
          </div>

          {project.budget && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-1 h-4 w-4" />
              <span>Budget: {project.budget}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center text-sm">
          <span>{totalTasks} tasks</span>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
              {tasks.filter((task) => task.status === 'pending').length} pending
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-800">
              {tasks.filter((task) => task.status === 'in-progress').length} in progress
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
