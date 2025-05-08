import CTA from '@/components/home/cta';
import Features from '@/components/home/features';
import FrequentlyAskedQuestions from '@/components/home/frequently-asked-questions';
import Hero from '@/components/home/hero';
import Testimonials from '@/components/home/testimonials';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />

        <Testimonials />

        {/* <Pricing /> */}

        <FrequentlyAskedQuestions />

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
