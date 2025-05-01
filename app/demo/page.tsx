"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import Link from "next/link"

// Demo data
const demoJobs = [
  {
    id: "demo1",
    company: "TechCorp",
    position: "Senior Frontend Developer",
    location: "Remote, US",
    status: "interview",
    appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Had first interview, waiting for technical round",
  },
  {
    id: "demo2",
    company: "StartupXYZ",
    position: "Full Stack Engineer",
    location: "Remote, Worldwide",
    status: "applied",
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Applied through their careers page",
  },
  {
    id: "demo3",
    company: "Global Solutions Inc",
    position: "React Developer",
    location: "Remote, Europe",
    status: "offer",
    appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Received offer: $95k/year",
  },
  {
    id: "demo4",
    company: "Digital Innovations",
    position: "Frontend Engineer",
    location: "Remote, US",
    status: "rejected",
    appliedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Rejected after technical interview",
  },
  {
    id: "demo5",
    company: "Future Technologies",
    position: "UI/UX Developer",
    location: "Remote, Canada",
    status: "applied",
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Referred by John",
  },
]

export default function DemoPage() {
  // Calculate statistics
  const totalJobs = demoJobs.length
  const appliedJobs = demoJobs.filter((job) => job.status === "applied").length
  const interviewJobs = demoJobs.filter((job) => job.status === "interview").length
  const offerJobs = demoJobs.filter((job) => job.status === "offer").length
  const rejectedJobs = demoJobs.filter((job) => job.status === "rejected").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-gray-100 hover:bg-gray-200 text-gray-800"
      case "interview":
        return "bg-blue-100 hover:bg-blue-200 text-blue-800"
      case "offer":
        return "bg-green-100 hover:bg-green-200 text-green-800"
      case "rejected":
        return "bg-red-100 hover:bg-red-200 text-red-800"
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">
                <span className="text-orange-600">Remote</span>Hunt
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Demo Dashboard</h1>
            <div className="flex items-center gap-2">
              <Link href="/signup">
                <Button className="bg-orange-600 hover:bg-orange-700">Sign Up for Free</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
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
                    className="h-4 w-4"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalJobs}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                <div className="bg-orange-100 text-orange-600 rounded-full p-2">
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
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appliedJobs + interviewJobs}</div>
                <p className="text-xs text-muted-foreground">Awaiting response</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
                <div className="bg-purple-100 text-purple-600 rounded-full p-2">
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
                    className="h-4 w-4"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round((interviewJobs / totalJobs) * 100)}%</div>
                <p className="text-xs text-muted-foreground">Of all applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
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
                    className="h-4 w-4"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round((offerJobs / totalJobs) * 100)}%</div>
                <p className="text-xs text-muted-foreground">Offers received</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold">Job Applications</h2>
              <p className="text-sm text-muted-foreground">Demo data - sign up to track your own applications!</p>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.company}</TableCell>
                      <TableCell>{job.position}</TableCell>
                      <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)} variant="outline">
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(job.appliedDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Application Analytics</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Application Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-gray-500 h-2.5 rounded-full"
                          style={{ width: `${(appliedJobs / totalJobs) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium">Applied ({appliedJobs})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${(interviewJobs / totalJobs) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium">Interview ({interviewJobs})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: `${(offerJobs / totalJobs) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium">Offer ({offerJobs})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: `${(rejectedJobs / totalJobs) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium">Rejected ({rejectedJobs})</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="relative h-32 w-32 rounded-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{Math.round((interviewJobs / totalJobs) * 100)}%</div>
                        <div className="text-sm text-muted-foreground">Response Rate</div>
                      </div>
                    </div>
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted opacity-25"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset={283 - 283 * (interviewJobs / totalJobs)}
                        className="text-orange-600 transform -rotate-90 origin-center"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/signup">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="mr-2 h-4 w-4" /> Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 RemoteHunt. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
