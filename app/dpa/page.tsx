import {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Data Processing Agreement - HuntLedger',
  description: 'GDPR-compliant Data Processing Agreement for HuntLedger users',
};

export default function DPAPage() {
  return (
    <div className="prose mx-auto py-8 px-4">
      <div className="w-full  border p-6 rounded-lg">
        <h1>Data Processing Agreement</h1>
        <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <p className="mt-6">
        This Data Processing Agreement ("DPA") forms part of the Terms of Service between you
        ("Controller") and HuntLedger ("Processor"). This DPA reflects the parties' agreement with
        regard to the Processing of Personal Data.
      </p>

      <section>
        <h2>1. Definitions</h2>
        <ul>
          <li>
            <strong>GDPR</strong> means the General Data Protection Regulation (EU) 2016/679.
          </li>
          <li>
            <strong>Data Subject</strong> means an identified or identifiable natural person.
          </li>
          <li>
            <strong>Personal Data</strong> means any information relating to a Data Subject.
          </li>
          <li>
            <strong>Processing</strong> means any operation performed on Personal Data.
          </li>
          <li>
            <strong>Subprocessor</strong> means any third party engaged by Processor to process
            Personal Data.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Scope and Responsibilities</h2>
        <p>
          This DPA applies where and only to the extent that HuntLedger processes Personal Data on
          behalf of the Controller that is subject to GDPR.
        </p>
      </section>

      <section>
        <h2>3. Processing Details</h2>
        <p>
          <strong>Subject Matter:</strong> Provision of job application tracking services
        </p>
        <p>
          <strong>Duration:</strong> For the term of the service agreement
        </p>
        <p>
          <strong>Nature and Purpose:</strong> Storage and organization of job application data
        </p>
        <p>
          <strong>Types of Personal Data:</strong>
        </p>
        <ul>
          <li>Contact information (email addresses)</li>
          <li>Job application details (company names, dates, notes)</li>
          <li>Technical data (IP addresses, device information)</li>
        </ul>
        <p>
          <strong>Categories of Data Subjects:</strong> Job applicants using the HuntLedger service
        </p>
      </section>

      <section>
        <h2>4. Processor Obligations</h2>
        <ul>
          <li>Process Personal Data only on documented instructions from Controller</li>
          <li>Ensure persons authorized to process the data are committed to confidentiality</li>
          <li>Implement appropriate technical and organizational security measures</li>
          <li>Assist Controller in fulfilling Data Subject rights requests</li>
          <li>Notify Controller without undue delay of any data breach</li>
          <li>Make available all information necessary to demonstrate compliance</li>
        </ul>
      </section>

      <section>
        <h2>5. Subprocessing</h2>
        <p>
          Controller grants Processor general authorization to engage Subprocessors. Current
          Subprocessors include:
        </p>
        <ul>
          <li>Google Firebase (Cloud infrastructure and authentication)</li>
          <li>GitHub (OAuth authentication provider, if used)</li>
          <li>Vercel (Hosting provider)</li>
        </ul>
        <p>
          Processor will notify Controller of any intended changes concerning addition/replacement
          of Subprocessors.
        </p>
      </section>

      <section>
        <h2>6. Data Transfers</h2>
        <p>
          Where Personal Data is transferred outside the EEA, Processor shall ensure appropriate
          safeguards are in place, including:
        </p>
        <ul>
          <li>Standard Contractual Clauses approved by the European Commission</li>
          <li>Processing only in countries with adequacy decisions</li>
        </ul>
      </section>

      <section>
        <h2>7. Security Measures</h2>
        <p>Processor implements measures including:</p>
        <ul>
          <li>Encryption of data in transit (TLS 1.2+)</li>
          <li>Regular security testing and vulnerability assessments</li>
          <li>Access controls and authentication systems</li>
          <li>Data minimization principles</li>
        </ul>
      </section>

      <section>
        <h2>8. Audit Rights</h2>
        <p>
          Controller may request an audit no more than once annually to verify Processor's
          compliance. Such audits will:
        </p>
        <ul>
          <li>Be conducted at Controller's expense</li>
          <li>Provide reasonable notice</li>
          <li>Not interfere unreasonably with Processor's operations</li>
        </ul>
      </section>

      <section>
        <h2>9. Duration and Termination</h2>
        <p>
          This DPA terminates automatically upon termination of the Terms of Service or when
          Processor no longer processes Personal Data on behalf of Controller.
        </p>
        <p>
          Upon termination, Processor will either delete or return all Personal Data at Controller's
          choice.
        </p>
      </section>

      <section>
        <h2>10. Governing Law</h2>
        <p>
          This DPA shall be governed by and construed in accordance with the governing law of the
          Terms of Service, unless required otherwise by GDPR.
        </p>
      </section>

      <p className="border-t pt-4 mt-6">
        To request a signed copy of this DPA or for any questions regarding our data processing
        practices, please contact us at{' '}
        <a href="mailto:privacy@huntledger.com" className="text-primary underline">
          privacy@huntledger.com
        </a>
        .
      </p>
    </div>
  );
}
