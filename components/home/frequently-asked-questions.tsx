const FrequentlyAskedQuestions = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to know about HuntLedger.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          {[
            {
              question: 'Is HuntLedger really free to use?',
              answer:
                'Yes! Our basic plan is completely free and includes all the essential features you need to track your job applications. We offer premium plans with advanced features for power users.',
            },
            {
              question: 'Can I import my existing job applications?',
              answer:
                'Absolutely. HuntLedger allows you to import your job applications from CSV files or spreadsheets, making it easy to transition from your current tracking method.',
            },
            {
              question: 'Is my data secure?',
              answer:
                'We take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent.',
            },
            {
              question: 'Can I use HuntLedger on my mobile device?',
              answer:
                'Yes! HuntLedger is fully responsive and works on all devices, including smartphones and tablets. You can track your job applications on the go.',
            },
            {
              question: 'How do I cancel my subscription?',
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
  );
};
export default FrequentlyAskedQuestions;
