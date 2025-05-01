import {CheckCircle} from 'lucide-react';
import Link from 'next/link';
import {Button} from '../ui/button';

const Pricing = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Start for free, upgrade when you need more features.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {[
            {
              name: 'Free',
              price: '$0',
              description: 'Perfect for getting started with your job search',
              features: [
                'Track up to 20 applications',
                'Basic analytics',
                'Email notifications',
                'Calendar view',
              ],
              cta: 'Get Started',
              popular: false,
            },
            {
              name: 'Pro',
              price: '$9/month',
              description: 'For serious job seekers who need more features',
              features: [
                'Unlimited applications',
                'Advanced analytics',
                'Priority support',
                'Resume tracking',
                'Custom status labels',
              ],
              cta: 'Upgrade to Pro',
              popular: true,
            },
            {
              name: 'Team',
              price: '$19/month',
              description: 'For career coaches and teams',
              features: [
                'Everything in Pro',
                'Team collaboration',
                'Shared dashboards',
                'API access',
                'Dedicated support',
              ],
              cta: 'Contact Sales',
              popular: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`flex flex-col rounded-lg border ${
                plan.popular ? 'border-orange-600 shadow-lg' : 'border-border'
              } bg-background p-6`}>
              {plan.popular && (
                <div className="mb-4 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 w-fit">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                {plan.price !== '$0' && (
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex text-sm">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/auth/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-gray-900 dark:bg-gray-100 dark:text-gray-900'
                    }`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Pricing;
