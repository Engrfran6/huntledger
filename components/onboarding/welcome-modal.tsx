'use client';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import type {UserType} from '@/lib/types';
import {Briefcase, CheckCircle, FileSearch} from 'lucide-react';
import {useEffect, useState} from 'react';

interface WelcomeModalProps {
  userType: UserType;
  onClose: () => void;
}

export function WelcomeModal({userType, onClose}: WelcomeModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    // Show modal after a short delay
    const timer = setTimeout(() => {
      setOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleNext = () => {
    const nextTab = String(Number(activeTab) + 1);
    if (Number(nextTab) <= 3) {
      setActiveTab(nextTab);
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to {userType === 'jobSeeker' ? 'Job Seeker' : 'Freelancer'} Mode
          </DialogTitle>
          <DialogDescription>
            Let's get you started with the{' '}
            {userType === 'jobSeeker' ? 'job hunting' : 'freelancing'} tools
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1">Getting Started</TabsTrigger>
            <TabsTrigger value="2">Key Features</TabsTrigger>
            <TabsTrigger value="3">Next Steps</TabsTrigger>
          </TabsList>

          {userType === 'jobSeeker' ? (
            <>
              <TabsContent value="1" className="py-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <FileSearch className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Job Seeker Dashboard</h3>
                    <p className="text-muted-foreground">
                      Track your entire job search in one place
                    </p>
                  </div>
                </div>
                <p className="mb-2">With HuntLedger's Job Seeker tools, you can:</p>
                <ul className="space-y-2 list-disc pl-5 mb-4">
                  <li>Track all your job applications in one place</li>
                  <li>Set reminders for interviews and follow-ups</li>
                  <li>Monitor your application statuses</li>
                  <li>Analyze your job search with detailed analytics</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  You can always switch to Freelancer mode using the switcher in the top navigation
                  bar.
                </p>
              </TabsContent>

              <TabsContent value="2" className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Application Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Log all your applications and track their progress from applied to offer.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Interview Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep track of upcoming interviews with automatic reminders.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualize your job search progress with detailed charts and metrics.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Calendar Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      See all your job-related events in a convenient calendar view.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="3" className="py-4">
                <h3 className="font-medium text-lg mb-4">Get Started in 3 Easy Steps</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Add your first job application</p>
                      <p className="text-sm text-muted-foreground">
                        Click on "Add Job" to log your first application
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Update application statuses</p>
                      <p className="text-sm text-muted-foreground">
                        Keep your applications up-to-date as you progress
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Check your analytics</p>
                      <p className="text-sm text-muted-foreground">
                        Visit the Analytics page to see your job search metrics
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="1" className="py-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Freelancer Dashboard</h3>
                    <p className="text-muted-foreground">
                      Manage your clients and projects efficiently
                    </p>
                  </div>
                </div>
                <p className="mb-2">With HuntLedger's Freelancer tools, you can:</p>
                <ul className="space-y-2 list-disc pl-5 mb-4">
                  <li>Track clients and their projects</li>
                  <li>Manage subcontractors for your projects</li>
                  <li>Assign and monitor tasks</li>
                  <li>Track project timelines and budgets</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  You can always switch to Job Seeker mode using the switcher in the top navigation
                  bar.
                </p>
              </TabsContent>

              <TabsContent value="2" className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Client Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep track of all your clients and their contact information.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Project Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor project progress, timelines, and budgets.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Task Assignment</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and assign tasks to yourself or subcontractors.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Subcontractor Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your team of subcontractors and their assignments.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="3" className="py-4">
                <h3 className="font-medium text-lg mb-4">Get Started in 3 Easy Steps</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Add your first client</p>
                      <p className="text-sm text-muted-foreground">
                        Click on "Add Client" to create your first client profile
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Create a project</p>
                      <p className="text-sm text-muted-foreground">
                        Set up your first project with timeline and budget
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Add tasks to your project</p>
                      <p className="text-sm text-muted-foreground">
                        Break down your project into manageable tasks
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Skip
          </Button>
          <Button onClick={handleNext} className="bg-orange-600 hover:bg-orange-700">
            {activeTab === '3' ? 'Get Started' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
