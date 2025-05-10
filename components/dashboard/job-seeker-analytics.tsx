'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import type {Job} from '@/lib/types';

interface JobSeekerAnalyticsProps {
  jobs: Job[];
}

export function JobSeekerAnalytics({jobs}: JobSeekerAnalyticsProps) {
  // Calculate application timeline data
  const getTimelineData = () => {
    if (!jobs || jobs.length === 0) return [];

    const months: Record<string, number> = {};

    jobs.forEach((job) => {
      const date = new Date(job.appliedDate);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!months[monthYear]) {
        months[monthYear] = 0;
      }

      months[monthYear]++;
    });

    return Object.entries(months).map(([month, count]) => ({
      month,
      count,
    }));
  };

  const timelineData = getTimelineData();

  // Calculate stats
  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter((job) => job.status === 'applied').length;
  const interviewJobs = jobs.filter((job) => job.status === 'interview').length;
  const offerJobs = jobs.filter((job) => job.status === 'offer').length;
  const rejectedJobs = jobs.filter((job) => job.status === 'rejected').length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
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
                className="h-4 w-4">
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
                className="h-4 w-4">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((interviewJobs / totalJobs) * 100) || 0}%
            </div>
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
                className="h-4 w-4">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((offerJobs / totalJobs) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Offers received</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
            <CardDescription>Number of applications submitted over time</CardDescription>
          </CardHeader>
          <CardContent>
            {timelineData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No application data available
              </div>
            ) : (
              <div className="h-64 space-y-4">
                {timelineData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-20 text-sm text-muted-foreground">{item.month}</div>
                    <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 bg-orange-600"
                        style={{
                          width: `${Math.min(
                            100,
                            (item.count / Math.max(...timelineData.map((d) => d.count))) * 100
                          )}%`,
                        }}
                      />
                      <div className="absolute inset-y-0 flex items-center px-2 text-sm font-medium">
                        {item.count} applications
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
            <CardTitle>Response Rate</CardTitle>
            <CardDescription>Percentage of applications that received a response</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs && jobs.length > 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4">
                <div className="relative h-40 w-40 rounded-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {Math.round(
                          (jobs.filter((job) => job.status !== 'applied').length / jobs.length) *
                            100
                        )}
                        %
                      </div>
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
                      strokeDashoffset={
                        283 -
                        283 * (jobs.filter((job) => job.status !== 'applied').length / jobs.length)
                      }
                      className="text-orange-600 transform -rotate-90 origin-center"
                    />
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground">
                  {jobs.filter((job) => job.status !== 'applied').length} responses out of{' '}
                  {jobs.length} applications
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No application data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
