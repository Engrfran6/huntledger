import {Metadata} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - HuntLedger',
  description: 'How we collect, use, and protect your data',
};

export default function PrivacyPage() {
  return (
    <div className="prose mx-auto py-8 px-4">
      <div className="w-full  border p-6 rounded-lg">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section>
        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong>Account Data:</strong> Email, name, profile picture (via Google/GitHub OAuth)
          </li>
          <li>
            <strong>Job Tracking Data:</strong> Company names, application dates, interview notes
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, device type, browser, usage analytics (via
            Firebase)
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Data</h2>
        <ul>
          <li>Provide and maintain service</li>
          <li>Personalize user experience</li>
          <li>Analyze aggregated usage trends (never individual data)</li>
          <li>Communicate updates (opt-out anytime)</li>
        </ul>
      </section>

      <section>
        <h2>3. Data Sharing</h2>
        <p>Never sold to third parties</p>
        <p>Limited sharing with:</p>
        <ul>
          <li>Firebase (hosting/auth)</li>
          <li>GitHub (if using OAuth)</li>
          <li>Legal compliance (if required)</li>
        </ul>
      </section>

      <section>
        <h2>4. Security</h2>
        <ul>
          <li>Encryption in transit (SSL/TLS)</li>
          <li>Firebase Auth protection</li>
          <li>Regular security audits</li>
        </ul>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <ul>
          <li>
            Access, correct, or delete data (
            <span className="underline text-orange-600">email support@huntledger.com</span>)
          </li>
          <li>Export your job tracking data (JSON/CSV)</li>
          <li>Disable account permanently</li>
        </ul>
      </section>

      <section>
        <h2>6. Data Processing Agreement</h2>
        <p>
          For users subject to GDPR, our{' '}
          <Link href="/dpa" className="underline text-orange-600">
            Data Processing Agreement
          </Link>{' '}
          outlines additional obligations regarding the processing of personal data.
        </p>
      </section>

      <p className="mt-8">
        For any questions about this policy, please contact us at{' '}
        <a className="text-orange-600 underline" href="mailto:support@huntledger.com">
          support@huntledger.com
        </a>
        .
      </p>
    </div>
  );
}
