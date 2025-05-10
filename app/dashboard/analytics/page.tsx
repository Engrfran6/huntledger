// "use client"

// import { useQuery } from "@tanstack/react-query"
// import { fetchJobs } from "@/lib/api"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { StatsCards } from "@/components/dashboard/stats-cards"

// export default function AnalyticsPage() {
//   const { data: jobs, isLoading } = useQuery({
//     queryKey: ["jobs"],
//     queryFn: fetchJobs,
//   })

//   // Calculate application timeline data
//   const getTimelineData = () => {
//     if (!jobs || jobs.length === 0) return []

//     const months: Record<string, number> = {}

//     jobs.forEach((job) => {
//       const date = new Date(job.appliedDate)
//       const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

//       if (!months[monthYear]) {
//         months[monthYear] = 0
//       }

//       months[monthYear]++
//     })

//     return Object.entries(months).map(([month, count]) => ({
//       month,
//       count,
//     }))
//   }

//   const timelineData = getTimelineData()

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
//       </div>

//       {isLoading ? (
//         <div className="grid gap-4 md:grid-cols-3">
//           {Array(3)
//             .fill(0)
//             .map((_, i) => (
//               <Skeleton key={i} className="h-32 w-full" />
//             ))}
//         </div>
//       ) : (
//         <StatsCards jobs={jobs || []} />
//       )}

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Application Timeline</CardTitle>
//             <CardDescription>Number of applications submitted over time</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <Skeleton className="h-64 w-full" />
//             ) : timelineData.length === 0 ? (
//               <div className="flex h-64 items-center justify-center text-muted-foreground">
//                 No application data available
//               </div>
//             ) : (
//               <div className="h-64 space-y-4">
//                 {timelineData.map((item, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <div className="w-20 text-sm text-muted-foreground">{item.month}</div>
//                     <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted">
//                       <div
//                         className="absolute inset-y-0 left-0 bg-orange-600"
//                         style={{
//                           width: `${Math.min(100, (item.count / Math.max(...timelineData.map((d) => d.count))) * 100)}%`,
//                         }}
//                       />
//                       <div className="absolute inset-y-0 flex items-center px-2 text-sm font-medium">
//                         {item.count} applications
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Response Rate</CardTitle>
//             <CardDescription>Percentage of applications that received a response</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <Skeleton className="h-64 w-full" />
//             ) : jobs && jobs.length > 0 ? (
//               <div className="flex h-64 flex-col items-center justify-center space-y-4">
//                 <div className="relative h-40 w-40 rounded-full">
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="text-center">
//                       <div className="text-3xl font-bold">
//                         {Math.round((jobs.filter((job) => job.status !== "applied").length / jobs.length) * 100)}%
//                       </div>
//                       <div className="text-sm text-muted-foreground">Response Rate</div>
//                     </div>
//                   </div>
//                   <svg className="h-full w-full" viewBox="0 0 100 100">
//                     <circle
//                       cx="50"
//                       cy="50"
//                       r="45"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="10"
//                       className="text-muted opacity-25"
//                     />
//                     <circle
//                       cx="50"
//                       cy="50"
//                       r="45"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="10"
//                       strokeDasharray="283"
//                       strokeDashoffset={
//                         283 - 283 * (jobs.filter((job) => job.status !== "applied").length / jobs.length)
//                       }
//                       className="text-orange-600 transform -rotate-90 origin-center"
//                     />
//                   </svg>
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {jobs.filter((job) => job.status !== "applied").length} responses out of {jobs.length} applications
//                 </div>
//               </div>
//             ) : (
//               <div className="flex h-64 items-center justify-center text-muted-foreground">
//                 No application data available
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
'use client';

import {FreelancerAnalytics} from '@/components/dashboard/freelancer-analytics';
import {JobSeekerAnalytics} from '@/components/dashboard/job-seeker-analytics';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchClients, fetchJobs, fetchTasks} from '@/lib/api';
import {useUserStore} from '@/lib/stores/user-store';
import {useQuery} from '@tanstack/react-query';

export default function AnalyticsPage() {
  const {userType} = useUserStore();

  // Fetch jobs for job seekers
  const {data: jobs, isLoading: isLoadingJobs} = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    enabled: userType === 'jobSeeker',
  });

  // Fetch clients and tasks for freelancers
  const {data: clients, isLoading: isLoadingClients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    enabled: userType === 'freelancer',
  });

  const {data: tasks, isLoading: isLoadingTasks} = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: userType === 'freelancer',
  });

  const isLoading =
    (userType === 'jobSeeker' && isLoadingJobs) ||
    (userType === 'freelancer' && (isLoadingClients || isLoadingTasks));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight ">Analytics</h1>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      ) : userType === 'jobSeeker' ? (
        <JobSeekerAnalytics jobs={jobs || []} />
      ) : (
        <FreelancerAnalytics clients={clients || []} tasks={tasks || []} />
      )}
    </div>
  );
}
