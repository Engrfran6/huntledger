'use client';

import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {Button} from '../ui/button';

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Track Your Remote Job Hunt Journey
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Stay organized, never miss a deadline, and increase your chances of landing your
                dream remote job.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  Try Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="font-medium">✓</span>
                <span className="text-muted-foreground">Free to use</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">✓</span>
                <span className="text-muted-foreground">Track applications</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">✓</span>
                <span className="text-muted-foreground">Insightful analytics</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-full overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
              <div className="flex h-full flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-sm font-medium">HuntLedger Dashboard</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex h-24 flex-col items-center justify-center rounded-lg bg-orange-100 p-4 text-orange-600">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs">Applications</div>
                  </div>
                  <div className="flex h-24 flex-col items-center justify-center rounded-lg bg-blue-100 p-4 text-blue-600">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-xs">Interviews</div>
                  </div>
                  <div className="flex h-24 flex-col items-center justify-center rounded-lg bg-green-100 p-4 text-green-600">
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-xs">Offers</div>
                  </div>
                </div>
                <div className="flex-1 rounded-lg border p-4">
                  <div className="mb-4 text-sm font-medium">Recent Applications</div>
                  <div className="space-y-3">
                    {[
                      {company: 'Acme Inc', position: 'Frontend Developer', status: 'Applied'},
                      {company: 'Globex Corp', position: 'React Engineer', status: 'Interview'},
                      {
                        company: 'Stark Industries',
                        position: 'Full Stack Developer',
                        status: 'Offer',
                      },
                    ].map((job, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-2 text-xs">
                        <div>
                          <div className="font-medium">{job.company}</div>
                          <div className="text-muted-foreground">{job.position}</div>
                        </div>
                        <div
                          className={`rounded-full px-2 py-1 text-xs ${
                            job.status === 'Applied'
                              ? 'bg-gray-100 text-gray-800'
                              : job.status === 'Interview'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                          {job.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
