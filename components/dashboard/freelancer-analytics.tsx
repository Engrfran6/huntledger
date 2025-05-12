'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {Activity, CheckCircle2, Clock, DollarSign, FileText} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type {Client, Task} from '@/lib/types';
import {useEffect, useState} from 'react';

interface FreelancerAnalyticsProps {
  clients: Client[];
  tasks: Task[];
}

interface RevenueDataPoint {
  month: string;
  amount: number;
}

export function FreelancerAnalytics({clients, tasks}: FreelancerAnalyticsProps) {
  const [revenueChartData, setRevenueChartData] = useState<RevenueDataPoint[]>([]);

  // Calculate all status counts
  const statusCounts = {
    coldPitch: clients.filter((c) => c.status === 'cold-pitch').length,
    proposal: clients.filter((c) => c.status === 'proposal').length,
    negotiation: clients.filter((c) => c.status === 'negotiation').length,
    active: clients.filter((c) => c.status === 'active').length,
    delivered: clients.filter((c) => c.status === 'delivered').length,
    completed: clients.filter((c) => c.status === 'completed').length,
    paid: clients.filter((c) => c.status === 'paid').length,
    onHold: clients.filter((c) => c.status === 'on-hold').length,
    cancelled: clients.filter((c) => c.status === 'cancelled').length,
    lost: clients.filter((c) => c.status === 'lost').length,
  };

  // Task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  ).length;

  // Financial metrics
  const totalRevenue = clients.reduce((sum, client) => {
    const amount = client.budget ? parseFloat(client.budget.replace(/[^0-9.-]+/g, '')) : 0;
    return isNaN(amount) ? sum : sum + amount;
  }, 0);

  const pendingPayments = clients
    .filter((c) => c.status === 'delivered')
    .reduce((sum, c) => {
      const amount = c.budget ? parseFloat(c.budget.replace(/[^0-9.-]+/g, '')) : 0;
      return isNaN(amount) ? sum : sum + amount;
    }, 0);

  // Time-based metrics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newClients = clients.filter((c) => {
    const date = new Date(c.startDate || c.sentDate || c.createdAt);
    return date >= thirtyDaysAgo;
  }).length;

  // Revenue by month (enhanced)
  const monthlyRevenue = clients.reduce((acc, client) => {
    if (!client.budget || !client.startDate) return acc;

    const date = new Date(client.startDate);
    const monthYear = `${date.toLocaleString('default', {month: 'short'})} ${date.getFullYear()}`;
    const amount = parseFloat(client.budget.replace(/[^0-9.-]+/g, ''));

    if (isNaN(amount)) return acc;

    acc[monthYear] = (acc[monthYear] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate revenue data
  useEffect(() => {
    const monthlyRevenue = clients.reduce((acc, client) => {
      if (!client.budget || !client.startDate) return acc;

      const date = new Date(client.startDate);
      const monthYear = `${date.toLocaleString('default', {month: 'short'})} ${date.getFullYear()}`;
      const amount = parseFloat(client.budget.replace(/[^0-9.-]+/g, ''));

      if (isNaN(amount)) return acc;

      acc[monthYear] = (acc[monthYear] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedRevenue = Object.entries(monthlyRevenue)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-6)
      .map(([month, amount]) => ({month, amount}));

    setRevenueChartData(sortedRevenue);
  }, [clients]);

  // Data for charts
  const pipelineData = [
    {name: 'Outreach', value: statusCounts.coldPitch + statusCounts.proposal},
    {name: 'Negotiation', value: statusCounts.negotiation},
    {name: 'Active', value: statusCounts.active},
    {name: 'Delivered', value: statusCounts.delivered},
    {name: 'Paid', value: statusCounts.paid},
    {name: 'Lost', value: statusCounts.lost + statusCounts.cancelled},
  ];

  const COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#10B981', '#EF4444'];

  const taskData = [
    {name: 'Completed', value: completedTasks, color: '#10B981'},
    {name: 'Pending', value: totalTasks - completedTasks, color: '#3B82F6'},
    {name: 'Overdue', value: overdueTasks, color: '#EF4444'},
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[
          {
            title: 'Pipeline Value',
            value: `$${clients
              .filter((c) => ['proposal', 'negotiation', 'active'].includes(c.status))
              .reduce((sum, c) => {
                const amount = c.budget ? parseFloat(c.budget.replace(/[^0-9.-]+/g, '')) : 0;
                return isNaN(amount) ? sum : sum + amount;
              }, 0)
              .toLocaleString()}`,
            icon: DollarSign,
            description: 'Potential revenue',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100',
          },
          {
            title: 'Active Projects',
            value: statusCounts.active,
            icon: Activity,
            description: `${statusCounts.delivered} delivered`,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
          },
          {
            title: 'Task Completion',
            value: totalTasks ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%',
            icon: CheckCircle2,
            description: `${completedTasks}/${totalTasks} tasks`,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
          },
          {
            title: 'Pending Payments',
            value: pendingPayments ? `$${pendingPayments.toLocaleString()}` : 'N/A',
            icon: Clock,
            description: `${statusCounts.delivered} projects`,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100',
          },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} ${stat.color} rounded-full p-2`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart - Fixed value labels */}
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Last 6 months of project revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueChartData}
                  margin={{top: 20, right: 20, left: 20, bottom: 20}}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" tick={{fontSize: 12}} />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{fontSize: 12}} />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                    label={{
                      position: 'top',
                      formatter: (value: number) => `$${value.toLocaleString()}`,
                      fill: '#111827',
                      fontSize: 12,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Status - Fixed with proper color mapping */}
        <Card>
          <CardHeader>
            <CardTitle>Project Pipeline</CardTitle>
            <CardDescription>Breakdown by project status</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [value, `${props.payload.name} Projects`]}
                />
                <Legend
                  formatter={(value, entry, index) => (
                    <span className="text-xs">
                      {value} ({pipelineData[index]?.value})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Task Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Task Overview</CardTitle>
          <CardDescription>Current workload and completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskData}
                layout="vertical"
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="value" name="Tasks">
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t ">
          <div className="grid gap-6 md:grid-cols-3 pt-4 md:pt-6">
            {[
              {
                title: 'Total Tasks',
                value: totalTasks,
                icon: FileText,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
              },
              {
                title: 'Completed',
                value: completedTasks,
                icon: CheckCircle2,
                color: 'text-green-600',
                bgColor: 'bg-green-100',
              },
              {
                title: 'Overdue',
                value: overdueTasks,
                icon: Clock,
                color: 'text-red-600',
                bgColor: 'bg-red-100',
              },
            ].map((stat, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className={`${stat.bgColor} ${stat.color} rounded-full p-3`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>Tasks completed over time</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          {/* Example - you would need to prepare this data from your tasks */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                {month: 'Jan', completed: 12, overdue: 2},
                {month: 'Feb', completed: 19, overdue: 1},
                {month: 'Mar', completed: 15, overdue: 3},
                {month: 'Apr', completed: 22, overdue: 0},
                {month: 'May', completed: 18, overdue: 2},
              ]}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10B981"
                strokeWidth={2}
                name="Completed Tasks"
              />
              <Line
                type="monotone"
                dataKey="overdue"
                stroke="#EF4444"
                strokeWidth={2}
                name="Overdue Tasks"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
