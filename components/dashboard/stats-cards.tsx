import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import type {Client, Job, UserType} from '@/lib/types';
import {
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Megaphone,
  Pause,
  RefreshCw,
  TrendingUp,
  UserPlus,
  XCircle,
} from 'lucide-react';

interface StatsCardsProps {
  items: Job[] | Client[];
  type: UserType;
}

export function StatsCards({items, type}: StatsCardsProps) {
  if (type === 'jobSeeker') {
    return <JobSeekerStats jobs={items as Job[]} />;
  } else {
    return <FreelancerStats clients={items as Client[]} />;
  }
}

function JobSeekerStats({jobs}: {jobs: Job[]}) {
  // Calculate statistics
  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter((job) => job.status === 'applied').length;
  const interviewJobs = jobs.filter((job) => job.status === 'interview').length;
  const offerJobs = jobs.filter((job) => job.status === 'offer').length;
  const rejectedJobs = jobs.filter((job) => job.status === 'rejected').length;

  // Calculate application rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentApplications = jobs.filter((job) => {
    const appliedDate = new Date(job.appliedDate);
    return appliedDate >= thirtyDaysAgo;
  }).length;

  const stats = [
    {
      title: 'Total Applications',
      value: totalJobs,
      icon: BriefcaseBusiness,
      description: 'All time',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Applications',
      value: appliedJobs + interviewJobs,
      icon: Clock,
      description: 'Awaiting response',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Interview Rate',
      value: totalJobs ? `${Math.round((interviewJobs / totalJobs) * 100)}%` : '0%',
      icon: Calendar,
      description: 'Of all applications',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Success Rate',
      value: totalJobs ? `${Math.round((offerJobs / totalJobs) * 100)}%` : '0%',
      icon: CheckCircle2,
      description: 'Offers received',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Rejection Rate',
      value: totalJobs ? `${Math.round((rejectedJobs / totalJobs) * 100)}%` : '0%',
      icon: XCircle,
      description: 'Applications rejected',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Monthly Activity',
      value: recentApplications,
      icon: Calendar,
      description: 'Last 30 days',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2  lg:grid-cols-3">
      {stats.map((stat, i) => (
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
  );
}

// function FreelancerStats({clients}: {clients: Client[]}) {
//   if (!clients) return [];
//   // Calculate statistics
//   const totalClients = clients.length;

//   // Count clients by status
//   const activeClients = clients.filter((client) => client.status === 'active').length;
//   const completedClients = clients.filter((client) => client.status === 'completed').length;
//   const onHoldClients = clients.filter((client) => client.status === 'on-hold').length;

//   // Calculate new clients in the last 30 days
//   const thirtyDaysAgo = new Date();
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//   const newClients = clients.filter((client) => {
//     const startDate = new Date(client.startDate);
//     return startDate >= thirtyDaysAgo;
//   }).length;

//   // Calculate total budget/revenue (if available)
//   const totalBudget = clients.reduce((sum, client) => {
//     if (client.budget) {
//       const budget = Number.parseFloat(client.budget.replace(/[^0-9.-]+/g, ''));
//       return isNaN(budget) ? sum : sum + budget;
//     }
//     return sum;
//   }, 0);

//   const stats = [
//     {
//       title: 'Total Clients',
//       value: totalClients,
//       icon: Users,
//       description: 'All time',
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100',
//     },
//     {
//       title: 'Active Projects',
//       value: activeClients,
//       icon: Briefcase,
//       description: 'Currently working',
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//     },
//     {
//       title: 'Completed Projects',
//       value: completedClients,
//       icon: CheckCircle2,
//       description: 'Successfully delivered',
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//     },
//     {
//       title: 'On Hold',
//       value: onHoldClients,
//       icon: Clock,
//       description: 'Temporarily paused',
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100',
//     },
//     {
//       title: 'New Clients',
//       value: newClients,
//       icon: Calendar,
//       description: 'Last 30 days',
//       color: 'text-indigo-600',
//       bgColor: 'bg-indigo-100',
//     },
//     {
//       title: 'Total Revenue',
//       value: totalBudget > 0 ? `$${totalBudget.toLocaleString()}` : 'N/A',
//       icon: DollarSign,
//       description: 'From all projects',
//       color: 'text-emerald-600',
//       bgColor: 'bg-emerald-100',
//     },
//   ];

//   return (
//     <div className="grid gap-4 grid-cols-2  lg:grid-cols-3">
//       {stats.map((stat, i) => (
//         <Card key={i}>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//             <div className={`${stat.bgColor} ${stat.color} rounded-full p-2`}>
//               <stat.icon className="h-4 w-4" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stat.value}</div>
//             <p className="text-xs text-muted-foreground">{stat.description}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

function FreelancerStats({clients}: {clients: Client[]}) {
  if (!clients) return [];

  // Calculate all status counts (using all your status options)
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

  // Pipeline metrics
  const outreachTotal = statusCounts.coldPitch + statusCounts.proposal;
  const inProgressTotal = statusCounts.negotiation + statusCounts.active;
  const completedTotal = statusCounts.completed + statusCounts.paid;

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

  const stats = [
    // Pipeline Overview
    {
      title: 'Outreach',
      value: outreachTotal,
      icon: Megaphone,
      description: `${statusCounts.coldPitch} pitches • ${statusCounts.proposal} proposals`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'In Progress',
      value: inProgressTotal,
      icon: RefreshCw,
      description: `${statusCounts.negotiation} negotiating • ${statusCounts.active} active`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Completed',
      value: completedTotal,
      icon: CheckCircle2,
      description: `${statusCounts.completed} done • ${statusCounts.paid} paid`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },

    // Financial Health
    {
      title: 'Total Revenue',
      value: totalRevenue ? `$${totalRevenue.toLocaleString()}` : 'N/A',
      icon: DollarSign,
      description: 'All completed work',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Pending Payments',
      value: pendingPayments ? `$${pendingPayments.toLocaleString()}` : 'N/A',
      icon: Clock,
      description: `${statusCounts.delivered} delivered projects`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },

    // Client Status
    {
      title: 'On Hold',
      value: statusCounts.onHold,
      icon: Pause,
      description: 'Potential future work',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Lost/Cancelled',
      value: statusCounts.lost + statusCounts.cancelled,
      icon: XCircle,
      description: `${statusCounts.lost} lost • ${statusCounts.cancelled} cancelled`,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },

    // Activity
    {
      title: 'New Clients',
      value: newClients,
      icon: UserPlus,
      description: 'Last 30 days',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Success Rate',
      value: outreachTotal ? `${Math.round((statusCounts.paid / outreachTotal) * 100)}%` : '0%',
      icon: TrendingUp,
      description: 'Pitch to paid conversion',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
  );
}
