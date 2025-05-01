'use client";';

import Link from 'next/link';
import {Button} from '../ui/button';

const CTA = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-600 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to Land Your Dream Remote Job?
            </h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of job seekers who have streamlined their job search with HuntLedger.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-orange-700">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CTA;
