import {Star} from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don&apos;t just take our word for it. Here&apos;s what job seekers have to say about
              HuntLedger.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {[
            {
              quote:
                'HuntLedger helped me stay organized during my job search. I landed a remote position at a tech startup within 2 months!',
              author: 'Sarah K.',
              role: 'Frontend Developer',
            },
            {
              quote:
                'The analytics feature gave me insights into which applications were most successful. Game changer for my job search strategy.',
              author: 'Michael T.',
              role: 'Product Manager',
            },
            {
              quote:
                "I was applying to so many jobs that I couldn't keep track. HuntLedger solved that problem and helped me land my dream job.",
              author: 'Jessica L.',
              role: 'UX Designer',
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
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
  );
};
export default Testimonials;
