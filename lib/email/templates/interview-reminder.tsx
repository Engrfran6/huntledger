import type {Job} from '@/lib/types';
import {sendEmail} from '../brevo';

export async function sendInterviewReminder(
  job: Job,
  email: string,
  name: string
): Promise<boolean> {
  const interviewDate = new Date(job.interviewDate!);
  const formattedDate = interviewDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = interviewDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="background-color: #ff6b35; padding: 15px; border-radius: 5px 5px 0 0;">
        <h1 style="color: white; margin: 0;">Interview Reminder</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello ${name},</p>
        <p>This is a friendly reminder that you have an interview scheduled for tomorrow:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Position:</strong> ${job.position}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          ${job.location ? `<p><strong>Location:</strong> ${job.location}</p>` : ''}
        </div>
        <p>Good luck with your interview! Remember to:</p>
        <ul>
          <li>Review the company and position details</li>
          <li>Prepare questions to ask the interviewer</li>
          <li>Plan your route to arrive on time</li>
          <li>Get a good night's sleep</li>
        </ul>
        <p>You can view more details about this job application in your dashboard.</p>
        <p>Best regards,<br>Your Job Tracker Team</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; border-radius: 0 0 5px 5px;">
        <p>This is an automated reminder from your Job Tracker application.</p>
        <p>You can manage your notification preferences in your account settings.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: `Interview Reminder: ${job.company} - ${job.position}`,
    html,
  });
}
