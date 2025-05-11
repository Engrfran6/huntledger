'use client';

import {ClientsTable} from '@/components/dashboard/clients-table';
import {JobsTable} from '@/components/dashboard/jobs-table';
import {StatsCards} from '@/components/dashboard/stats-cards';
import {WelcomeModal} from '@/components/onboarding/welcome-modal';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {fetchClients, fetchJobs} from '@/lib/api';
import {useClientsStore} from '@/lib/stores/client-store';
import {useJobsStore} from '@/lib/stores/jobs-store';
import {useUserStore} from '@/lib/stores/user-store';
import {PlusCircle} from 'lucide-react';
import Link from 'next/link';
import {useEffect, useState} from 'react';

export default function DashboardPage() {
  const {userType} = useUserStore();
  const {setJobs, jobs} = useJobsStore();
  const {setClients, clients} = useClientsStore();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first visit to the dashboard
    const hasVisitedDashboard = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisitedDashboard) {
      setIsFirstVisit(true);
      setShowWelcomeModal(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, []);

  // Fetch data when the dashboard loads
  useEffect(() => {
    const loadData = async () => {
      try {
        if (userType === 'jobSeeker') {
          const jobsData = await fetchJobs();
          setJobs(jobsData);
        } else {
          const clientsData = await fetchClients();
          setClients(clientsData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
      }
    };

    loadData();
  }, [userType, setJobs, setClients]);

  return (
    <>
      {showWelcomeModal && (
        <WelcomeModal userType={userType} onClose={() => setShowWelcomeModal(false)} />
      )}

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          {userType === 'jobSeeker' ? (
            <Link href="/dashboard/jobs/new">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/clients/new">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </Link>
          )}
        </div>

        <StatsCards items={userType === 'jobSeeker' ? jobs : clients} type={userType} />

        {userType === 'jobSeeker' ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Applications</CardTitle>
              <CardDescription>
                Track and manage your recent job applications. Click on a job to view details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobsTable jobs={jobs.slice(0, 5)} />
              {jobs.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href="/dashboard/applications">
                    <Button variant="outline">View All Applications</Button>
                  </Link>
                </div>
              )}
              {jobs.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    You haven't added any job applications yet.
                  </p>
                  <Link href="/dashboard/jobs/new">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Job
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>
                View and manage your recent clients. Click on a client to view details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientsTable clients={clients.slice(0, 5)} />
              {clients.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href="/dashboard/clients">
                    <Button variant="outline">View All Clients</Button>
                  </Link>
                </div>
              )}
              {clients.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You haven't added any clients yet.</p>
                  <Link href="/dashboard/clients/new">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Client
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isFirstVisit && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-300">
                Getting Started
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-400">
                Here are some tips to help you get started with HuntLedger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userType === 'jobSeeker' ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-2">1. Add Job Applications</h3>
                      <p className="text-sm text-muted-foreground">
                        Start by adding the jobs you've applied to or plan to apply for.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-2">2. Update Statuses</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep your application statuses up to date as you progress.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-2">3. Check Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Visit the Analytics page to track your job search progress.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-2">1. Add Clients</h3>
                      <p className="text-sm text-muted-foreground">
                        Start by adding your clients and their contact information.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-2">2. Create Projects</h3>
                      <p className="text-sm text-muted-foreground">
                        Set up projects with timelines, budgets, and descriptions.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-2">3. Manage Tasks</h3>
                      <p className="text-sm text-muted-foreground">
                        Break down projects into tasks and track their progress.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={() => setShowWelcomeModal(true)}>
                    Show Welcome Guide Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
