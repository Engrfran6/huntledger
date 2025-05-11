import type {Job} from '@/lib/types';
import {format} from 'date-fns';
import type React from 'react';

interface InterviewReminderProps {
  job: Job;
  userName: string;
}

export const InterviewReminderTemplate: React.FC<InterviewReminderProps> = ({job, userName}) => {
  const interviewDate = job.interviewDate ? new Date(job.interviewDate) : null;
  const formattedDate = interviewDate
    ? format(interviewDate, "EEEE, MMMM d, yyyy 'at' h:mm a")
    : 'Not specified';

  return (
    <div>
      <h1>Interview Reminder</h1>
      <p>Hello {userName},</p>
      <p>
        This is a reminder that you have an interview scheduled for tomorrow with{' '}
        <strong>{job.company}</strong> for the <strong>{job.position}</strong> position.
      </p>
      <div
        style={{margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '5px'}}>
        <h2>Interview Details</h2>
        <p>
          <strong>Company:</strong> {job.company}
        </p>
        <p>
          <strong>Position:</strong> {job.position}
        </p>
        <p>
          <strong>Date & Time:</strong> {formattedDate}
        </p>
        {job.location && (
          <p>
            <strong>Location:</strong> {job.location}
          </p>
        )}
      </div>
      <p>Good luck with your interview!</p>
      <p>
        <em>
          You're receiving this email because you've enabled interview reminders in your
          notification settings. You can update your preferences in the settings page of your
          account.
        </em>
      </p>
    </div>
  );
};

export function renderInterviewReminderEmail(job: Job, userName: string): string {
  // In a real implementation, you would use a library like React DOM Server
  // to render this component to an HTML string
  // For now, we'll return a simplified HTML version
  const interviewDate = job.interviewDate ? new Date(job.interviewDate) : null;
  const formattedDate = interviewDate
    ? format(interviewDate, "EEEE, MMMM d, yyyy 'at' h:mm a")
    : 'Not specified';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Interview Reminder</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello ${userName},</p>
        <p>
          This is a reminder that you have an interview scheduled for tomorrow with <strong>${
            job.company
          }</strong> for the
          <strong>${job.position}</strong> position.
        </p>
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #f97316; margin-top: 0;">Interview Details</h2>
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Position:</strong> ${job.position}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
          ${job.location ? `<p><strong>Location:</strong> ${job.location}</p>` : ''}
          ${
            job.url
              ? `<p><a href="${job.url}" style="color: #f97316; text-decoration: none;">View Job Details</a></p>`
              : ''
          }
        </div>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
          <p>Good luck with your interview!</p>
          <p style="font-size: 12px; color: #666;">
            You're receiving this email because you've enabled interview reminders in your notification settings. 
            You can update your preferences in the settings page of your account.
          </p>
        </div>
      </div>
    </div>
  `;
}
