import type {Job} from '@/lib/types';
import {format} from 'date-fns';
import type React from 'react';

interface OfferReminderProps {
  job: Job;
  userName: string;
}

export const OfferReminderTemplate: React.FC<OfferReminderProps> = ({job, userName}) => {
  const startDate = job.startDate ? new Date(job.startDate) : null;
  const formattedDate = startDate ? format(startDate, 'EEEE, MMMM d, yyyy') : 'Not specified';

  return (
    <div>
      <h1>Job Start Date Reminder</h1>
      <p>Hello {userName},</p>
      <p>
        This is a reminder that your start date for the <strong>{job.position}</strong> position at{' '}
        <strong>{job.company}</strong> is tomorrow.
      </p>
      <div
        style={{margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '5px'}}>
        <h2>Job Details</h2>
        <p>
          <strong>Company:</strong> {job.company}
        </p>
        <p>
          <strong>Position:</strong> {job.position}
        </p>
        <p>
          <strong>Start Date:</strong> {formattedDate}
        </p>
        {job.location && (
          <p>
            <strong>Location:</strong> {job.location}
          </p>
        )}
      </div>
      <p>Congratulations on your new position!</p>
      <p>
        <em>
          You're receiving this email because you've enabled offer deadline reminders in your
          notification settings. You can update your preferences in the settings page of your
          account.
        </em>
      </p>
    </div>
  );
};

export function renderOfferReminderEmail(job: Job, userName: string): string {
  // In a real implementation, you would use a library like React DOM Server
  // to render this component to an HTML string
  const startDate = job.startDate ? new Date(job.startDate) : null;
  const formattedDate = startDate ? format(startDate, 'EEEE, MMMM d, yyyy') : 'Not specified';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Job Start Date Reminder</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello ${userName},</p>
        <p>
          This is a reminder that your start date for the <strong>${
            job.position
          }</strong> position at
          <strong>${job.company}</strong> is tomorrow.
        </p>
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #f97316; margin-top: 0;">Job Details</h2>
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Position:</strong> ${job.position}</p>
          <p><strong>Start Date:</strong> ${formattedDate}</p>
          ${job.location ? `<p><strong>Location:</strong> ${job.location}</p>` : ''}
        </div>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
          <p>Congratulations on your new position!</p>
          <p style="font-size: 12px; color: #666;">
            You're receiving this email because you've enabled offer deadline reminders in your notification settings. 
            You can update your preferences in the settings page of your account.
          </p>
        </div>
      </div>
    </div>
  `;
}
