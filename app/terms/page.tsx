import {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - HuntLedger',
  description: 'Legal terms governing use of our service',
};

export default function TermsPage() {
  return (
    <div className="prose mx-auto py-8 px-4">
      <div className="w-full  border p-6 rounded-lg">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section>
        <h2>1. Eligibility</h2>
        <p>Must be 16+ years old (or age of majority in your jurisdiction)</p>
      </section>

      <section>
        <h2>2. Account Responsibilities</h2>
        <ul>
          <li>Accurate information</li>
          <li>No impersonation</li>
          <li>Secure credentials</li>
        </ul>
      </section>

      <section>
        <h2>3. Acceptable Use</h2>
        <p>Prohibited:</p>
        <ul>
          <li>Scraping/data mining</li>
          <li>Spamming recruiters</li>
          <li>Illegal/job fraud activities</li>
        </ul>
      </section>

      <section>
        <h2>4. Termination</h2>
        <p>We may suspend accounts for:</p>
        <ul>
          <li>Violations of terms</li>
          <li>Suspicious activity</li>
        </ul>
      </section>

      <section>
        <h2>5. Disclaimers</h2>
        <ul>
          <li>"As-is" service (no uptime guarantees)</li>
          <li>Not liable for job application outcomes</li>
        </ul>
      </section>

      <section>
        <h2>6. Changes</h2>
        <p>30-day notice for major changes (email notification)</p>
      </section>

      <p>
        By using HuntLedger, you agree to these terms. If you have any questions, please contact us
        at{' '}
        <a href="mailto:support@huntledger.com" className="underline text-orange-600">
          support@huntledger.com
        </a>
        .
      </p>
    </div>
  );
}
