import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Job } from "@/lib/types"
import { BriefcaseBusiness, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"

interface StatsCardsProps {
  jobs: Job[]
}

export function StatsCards({ jobs }: StatsCardsProps) {
  // Calculate statistics
  const totalJobs = jobs.length
  const appliedJobs = jobs.filter((job) => job.status === "applied").length
  const interviewJobs = jobs.filter((job) => job.status === "interview").length
  const offerJobs = jobs.filter((job) => job.status === "offer").length
  const rejectedJobs = jobs.filter((job) => job.status === "rejected").length

  // Calculate application rate (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentApplications = jobs.filter((job) => {
    const appliedDate = new Date(job.appliedDate)
    return appliedDate >= thirtyDaysAgo
  }).length

  const stats = [
    {
      title: "Total Applications",
      value: totalJobs,
      icon: BriefcaseBusiness,
      description: "All time",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Applications",
      value: appliedJobs + interviewJobs,
      icon: Clock,
      description: "Awaiting response",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Interview Rate",
      value: totalJobs ? `${Math.round((interviewJobs / totalJobs) * 100)}%` : "0%",
      icon: Calendar,
      description: "Of all applications",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Success Rate",
      value: totalJobs ? `${Math.round((offerJobs / totalJobs) * 100)}%` : "0%",
      icon: CheckCircle2,
      description: "Offers received",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Rejection Rate",
      value: totalJobs ? `${Math.round((rejectedJobs / totalJobs) * 100)}%` : "0%",
      icon: XCircle,
      description: "Applications rejected",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Monthly Activity",
      value: recentApplications,
      icon: Calendar,
      description: "Last 30 days",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
  )
}
