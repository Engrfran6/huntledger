import type {Job} from '@/lib/types';
import {sendEmail} from '../brevo';

export async function sendOfferReminder(job: Job, email: string, name: string): Promise<boolean> {
  const startDate = new Date(job.startDate!);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="background-color: #ff6b35; padding: 15px; border-radius: 5px 5px 0 0;">
        <h1 style="color: white; margin: 0;">Job Start Date Reminder</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello ${name},</p>
        <p>This is a friendly reminder that your new job starts tomorrow:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Position:</strong> ${job.position}</p>
          <p><strong>Start Date:</strong> ${formattedDate}</p>
          ${job.location ? `<p><strong>Location:</strong> ${job.location}</p>` : ''}
        </div>
        <p>Congratulations on your new position! Here are some tips for your first day:</p>
        <ul>
          <li>Arrive 15 minutes early</li>
          <li>Bring any required documentation</li>
          <li>Dress professionally</li>
          <li>Be ready to meet your new team</li>
        </ul>
        <p>Best of luck on your first day!</p>
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
    subject: `Reminder: Your job at ${job.company} starts tomorrow`,
    html,
  });
}
