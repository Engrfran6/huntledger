import type {Client, Job, Task} from '@/lib/types';
import {sendEmail} from './brevo';

// Send an interview reminder
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

// Send an offer/start date reminder
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

// Send a task deadline reminder
export async function sendTaskDeadlineReminder(
  task: Task,
  client: Client,
  email: string,
  name: string
): Promise<boolean> {
  const dueDate = new Date(task.dueDate!);
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="background-color: #ff6b35; padding: 15px; border-radius: 5px 5px 0 0;">
        <h1 style="color: white; margin: 0;">Task Deadline Reminder</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello ${name},</p>
        <p>This is a friendly reminder that you have a task due tomorrow:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Task:</strong> ${task.title}</p>
          <p><strong>Client:</strong> ${client.name}</p>
          <p><strong>Project:</strong> ${client.project}</p>
          <p><strong>Due Date:</strong> ${formattedDate}</p>
          <p><strong>Priority:</strong> ${
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
          }</p>
          ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
        </div>
        <p>Current status: <strong>${task.status.toUpperCase()}</strong></p>
        <p>Please ensure this task is completed by the deadline. You can update the task status in your dashboard.</p>
        <p>Best regards,<br>Your Freelance Tracker Team</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; border-radius: 0 0 5px 5px;">
        <p>This is an automated reminder from your Freelance Tracker application.</p>
        <p>You can manage your notification preferences in your account settings.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: `Task Due Tomorrow: ${task.title} for ${client.name}`,
    html,
  });
}

// Send a weekly digest
export async function sendWeeklyDigest(
  email: string,
  name: string,
  userType: 'jobSeeker' | 'freelancer',
  jobs?: Job[],
  tasks?: Task[],
  clients?: Client[],
  stats?: any
): Promise<boolean> {
  let html = '';

  if (userType === 'jobSeeker') {
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #ff6b35; padding: 15px; border-radius: 5px 5px 0 0;">
          <h1 style="color: white; margin: 0;">Your Weekly Job Search Digest</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${name},</p>
          <p>Here's a summary of your job search activity this week:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h2 style="margin-top: 0;">Weekly Stats</h2>
            <p><strong>Applications Submitted:</strong> ${stats?.applicationsThisWeek || 0}</p>
            <p><strong>Interviews Scheduled:</strong> ${stats?.interviewsThisWeek || 0}</p>
            <p><strong>Offers Received:</strong> ${stats?.offersThisWeek || 0}</p>
          </div>
          
          ${
            jobs && jobs.length > 0
              ? `
            <h2>Recent Applications</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Company</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Position</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Status</th>
              </tr>
              ${jobs
                .slice(0, 5)
                .map(
                  (job) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${job.company}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${job.position}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${job.status}</td>
                </tr>
              `
                )
                .join('')}
            </table>
            `
              : `<p>No recent job applications to display.</p>`
          }
          
          <div style="margin-top: 20px;">
            <p>Keep up the good work! Remember to:</p>
            <ul>
              <li>Follow up on your applications</li>
              <li>Prepare for upcoming interviews</li>
              <li>Update your job tracker with new applications</li>
            </ul>
          </div>
          
          <p>Best regards,<br>Your Job Tracker Team</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; border-radius: 0 0 5px 5px;">
          <p>This is an automated weekly digest from your Job Tracker application.</p>
          <p>You can manage your notification preferences in your account settings.</p>
        </div>
      </div>
    `;
  } else {
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #ff6b35; padding: 15px; border-radius: 5px 5px 0 0;">
          <h1 style="color: white; margin: 0;">Your Weekly Freelance Digest</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${name},</p>
          <p>Here's a summary of your freelance activity this week:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h2 style="margin-top: 0;">Weekly Stats</h2>
            <p><strong>Tasks Completed:</strong> ${stats?.tasksCompletedThisWeek || 0}</p>
            <p><strong>Upcoming Tasks:</strong> ${stats?.tasksUpcoming || 0}</p>
            <p><strong>Revenue This Month:</strong> $${stats?.revenueThisMonth || 0}</p>
          </div>
          
          ${
            tasks && tasks.length > 0
              ? `
            <h2>Recent Tasks</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Task</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Status</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Due Date</th>
              </tr>
              ${tasks
                .slice(0, 5)
                .map(
                  (task) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${task.title}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${task.status}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${
                    task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'
                  }</td>
                </tr>
              `
                )
                .join('')}
            </table>
            `
              : `<p>No recent tasks to display.</p>`
          }
          
          ${
            clients && clients.length > 0
              ? `
            <h2>Active Clients</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Client</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Project</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Status</th>
              </tr>
              ${clients
                .slice(0, 5)
                .map(
                  (client) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${client.name}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${client.project}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${client.status}</td>
                </tr>
              `
                )
                .join('')}
            </table>
            `
              : `<p>No active clients to display.</p>`
          }
          
          <div style="margin-top: 20px;">
            <p>Keep up the good work! Remember to:</p>
            <ul>
              <li>Follow up on pending tasks</li>
              <li>Invoice completed work</li>
              <li>Update your task tracker with new assignments</li>
            </ul>
          </div>
          
          <p>Best regards,<br>Your Freelance Tracker Team</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; border-radius: 0 0 5px 5px;">
          <p>This is an automated weekly digest from your Freelance Tracker application.</p>
          <p>You can manage your notification preferences in your account settings.</p>
        </div>
      </div>
    `;
  }

  return await sendEmail({
    to: email,
    subject:
      userType === 'jobSeeker' ? 'Your Weekly Job Search Digest' : 'Your Weekly Freelance Digest',
    html,
  });
}
