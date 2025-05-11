'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import type {Client, Task} from '@/lib/types';

interface FreelancerAnalyticsProps {
  clients: Client[];
  tasks: Task[];
}

export function FreelancerAnalytics({clients, tasks}: FreelancerAnalyticsProps) {
  // Calculate revenue by month
  const getRevenueData = () => {
    if (!clients || clients.length === 0) return [];

    const months: Record<string, number> = {};

    clients.forEach((client) => {
      if (!client.budget) return;

      const date = new Date(client.startDate);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!months[monthYear]) {
        months[monthYear] = 0;
      }

      // Extract numeric value from budget string
      const budget = Number.parseFloat(client.budget.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(budget)) {
        months[monthYear] += budget;
      }
    });

    return Object.entries(months).map(([month, amount]) => ({
      month,
      amount,
    }));
  };

  const revenueData = getRevenueData();

  // Calculate task completion rate
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate client stats
  const totalClients = clients.length;
  const activeClients = clients.filter((client) => client.status === 'active').length;
  const completedProjects = clients.filter((client) => client.status === 'completed').length;

  // Calculate total revenue
  const totalRevenue = clients.reduce((sum, client) => {
    if (!client.budget) return sum;
    const budget = Number.parseFloat(client.budget.replace(/[^0-9.-]+/g, ''));
    return isNaN(budget) ? sum : sum + budget;
  }, 0);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <div className="bg-blue-100 text-blue-600 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">Out of {totalClients} total clients</p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 md:col-span-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              <div className="bg-green-100 text-green-600 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="bg-emerald-100 text-emerald-600 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From all projects</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Month</CardTitle>
            <CardDescription>Project revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            ) : (
              <div className="h-64 space-y-4">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-20 text-sm text-muted-foreground">{item.month}</div>
                    <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 bg-emerald-600"
                        style={{
                          width: `${Math.min(
                            100,
                            (item.amount / Math.max(...revenueData.map((d) => d.amount))) * 100
                          )}%`,
                        }}
                      />
                      <div className="absolute inset-y-0 flex items-center px-2 text-sm font-medium">
                        ${item.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Overview of all client projects</CardDescription>
          </CardHeader>
          <CardContent>
            {clients && clients.length > 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-6">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <span className="text-sm font-medium">{activeClients}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-600"
                      style={{width: `${(activeClients / totalClients) * 100}%`}}
                    />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{completedProjects}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-green-600"
                      style={{width: `${(completedProjects / totalClients) * 100}%`}}
                    />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">On Hold</span>
                    <span className="text-sm font-medium">
                      {clients.filter((client) => client.status === 'on-hold').length}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-yellow-600"
                      style={{
                        width: `${
                          (clients.filter((client) => client.status === 'on-hold').length /
                            totalClients) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No project data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
