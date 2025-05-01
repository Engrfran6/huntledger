import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">RemoteHunt</span>
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Track Your Remote Job Hunt Journey
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Stay organized, never miss a deadline, and increase your chances of landing your dream remote job.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
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
                      <div className="ml-2 text-sm font-medium">RemoteHunt Dashboard</div>
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
                          { company: "Acme Inc", position: "Frontend Developer", status: "Applied" },
                          { company: "Globex Corp", position: "React Engineer", status: "Interview" },
                          { company: "Stark Industries", position: "Full Stack Developer", status: "Offer" },
                        ].map((job, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-2 text-xs">
                            <div>
                              <div className="font-medium">{job.company}</div>
                              <div className="text-muted-foreground">{job.position}</div>
                            </div>
                            <div
                              className={`rounded-full px-2 py-1 text-xs ${
                                job.status === "Applied"
                                  ? "bg-gray-100 text-gray-800"
                                  : job.status === "Interview"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to organize your remote job search in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  title: "Track Applications",
                  description: "Keep all your job applications organized in one place with status updates.",
                },
                {
                  title: "Application Analytics",
                  description: "Get insights into your job search with detailed statistics and charts.",
                },
                {
                  title: "Never Miss a Deadline",
                  description: "Set reminders for interviews, follow-ups, and important deadlines.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don&apos;t just take our word for it. Here&apos;s what job seekers have to say about RemoteHunt.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  quote:
                    "RemoteHunt helped me stay organized during my job search. I landed a remote position at a tech startup within 2 months!",
                  author: "Sarah K.",
                  role: "Frontend Developer",
                },
                {
                  quote:
                    "The analytics feature gave me insights into which applications were most successful. Game changer for my job search strategy.",
                  author: "Michael T.",
                  role: "Product Manager",
                },
                {
                  quote:
                    "I was applying to so many jobs that I couldn't keep track. RemoteHunt solved that problem and helped me land my dream job.",
                  author: "Jessica L.",
                  role: "UX Designer",
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex space-x-1 text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.quote}"</p>
                  </div>
                  <div className="mt-6 flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Pricing Section */}
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
                  name: "Free",
                  price: "$0",
                  description: "Perfect for getting started with your job search",
                  features: ["Track up to 20 applications", "Basic analytics", "Email notifications", "Calendar view"],
                  cta: "Get Started",
                  popular: false,
                },
                {
                  name: "Pro",
                  price: "$9/month",
                  description: "For serious job seekers who need more features",
                  features: [
                    "Unlimited applications",
                    "Advanced analytics",
                    "Priority support",
                    "Resume tracking",
                    "Custom status labels",
                  ],
                  cta: "Upgrade to Pro",
                  popular: true,
                },
                {
                  name: "Team",
                  price: "$19/month",
                  description: "For career coaches and teams",
                  features: [
                    "Everything in Pro",
                    "Team collaboration",
                    "Shared dashboards",
                    "API access",
                    "Dedicated support",
                  ],
                  cta: "Contact Sales",
                  popular: false,
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`flex flex-col rounded-lg border ${
                    plan.popular ? "border-orange-600 shadow-lg" : "border-border"
                  } bg-background p-6`}
                >
                  {plan.popular && (
                    <div className="mb-4 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 w-fit">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                    <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                    {plan.price !== "$0" && <span className="ml-1 text-sm text-muted-foreground">/month</span>}
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
                    <Link href="/signup">
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-gray-900 dark:bg-gray-100 dark:text-gray-900"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about RemoteHunt.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-4 py-12">
              {[
                {
                  question: "Is RemoteHunt really free to use?",
                  answer:
                    "Yes! Our basic plan is completely free and includes all the essential features you need to track your job applications. We offer premium plans with advanced features for power users.",
                },
                {
                  question: "Can I import my existing job applications?",
                  answer:
                    "Absolutely. RemoteHunt allows you to import your job applications from CSV files or spreadsheets, making it easy to transition from your current tracking method.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "We take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent.",
                },
                {
                  question: "Can I use RemoteHunt on my mobile device?",
                  answer:
                    "Yes! RemoteHunt is fully responsive and works on all devices, including smartphones and tablets. You can track your job applications on the go.",
                },
                {
                  question: "How do I cancel my subscription?",
                  answer:
                    "You can cancel your subscription at any time from your account settings. If you cancel, you'll still have access to your premium features until the end of your billing period.",
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-lg border bg-background p-6">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Land Your Dream Remote Job?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of job seekers who have streamlined their job search with RemoteHunt.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-700">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
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
