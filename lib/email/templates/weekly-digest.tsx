import type {Client, Job, Task} from '@/lib/types';
import {format} from 'date-fns';
import type React from 'react';

interface WeeklyDigestProps {
  userName: string;
  userType: 'jobSeeker' | 'freelancer';
  jobs?: Job[];
  tasks?: Task[];
  clients?: Client[];
  stats?: {
    applicationsThisWeek?: number;
    interviewsThisWeek?: number;
    offersThisWeek?: number;
    tasksCompletedThisWeek?: number;
    tasksUpcoming?: number;
    revenueThisMonth?: number;
  };
}

export const WeeklyDigestTemplate: React.FC<WeeklyDigestProps> = ({
  userName,
  userType,
  jobs,
  tasks,
  clients,
  stats,
}) => {
  return (
    <div>
      <h1>Your Weekly Digest</h1>
      <p>Hello {userName},</p>
      <p>Here's your weekly summary for the week of {format(new Date(), 'MMMM d, yyyy')}:</p>

      {userType === 'jobSeeker' && jobs && stats && (
        <div>
          <h2>Job Search Summary</h2>
          <div
            style={{
              margin: '20px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}>
            <p>
              <strong>Applications This Week:</strong> {stats.applicationsThisWeek}
            </p>
            <p>
              <strong>Interviews This Week:</strong> {stats.interviewsThisWeek}
            </p>
            <p>
              <strong>Offers This Week:</strong> {stats.offersThisWeek}
            </p>
          </div>

          <h3>Upcoming Interviews</h3>
          {jobs.filter((job) => job.status === 'interview' && job.interviewDate).length > 0 ? (
            <ul>
              {jobs
                .filter((job) => job.status === 'interview' && job.interviewDate)
                .map((job) => (
                  <li key={job.id}>
                    {job.company} - {job.position} on{' '}
                    {format(new Date(job.interviewDate!), "MMMM d, yyyy 'at' h:mm a")}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No upcoming interviews this week.</p>
          )}
        </div>
      )}

      {userType === 'freelancer' && tasks && clients && stats && (
        <div>
          <h2>Freelance Work Summary</h2>
          <div
            style={{
              margin: '20px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}>
            <p>
              <strong>Tasks Completed This Week:</strong> {stats.tasksCompletedThisWeek}
            </p>
            <p>
              <strong>Upcoming Tasks:</strong> {stats.tasksUpcoming}
            </p>
            <p>
              <strong>Revenue This Month:</strong> ${stats.revenueThisMonth?.toFixed(2)}
            </p>
          </div>

          <h3>Upcoming Deadlines</h3>
          {tasks.filter((task) => task.dueDate).length > 0 ? (
            <ul>
              {tasks
                .filter((task) => task.dueDate)
                .map((task) => {
                  const client = clients.find((c) => c.id === task.clientId);
                  return (
                    <li key={task.id}>
                      {task.title} for {client?.name} due on{' '}
                      {format(new Date(task.dueDate!), 'MMMM d, yyyy')}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <p>No upcoming deadlines this week.</p>
          )}
        </div>
      )}

      <p>
        <em>
          You're receiving this email because you've enabled weekly digest in your notification
          settings. You can update your preferences in the settings page of your account.
        </em>
      </p>
    </div>
  );
};

export function renderWeeklyDigestEmail(props: WeeklyDigestProps): string {
  // In a real implementation, you would use a library like React DOM Server
  // to render this component to an HTML string
  const {userName, userType, jobs, tasks, clients, stats} = props;

  let jobSeekerContent = '';
  let freelancerContent = '';

  if (userType === 'jobSeeker' && jobs && stats) {
    const upcomingInterviews = jobs
      .filter((job) => job.status === 'interview' && job.interviewDate)
      .map(
        (job) =>
          `<li>${job.company} - ${job.position} on ${format(
            new Date(job.interviewDate!),
            "MMMM d, yyyy 'at' h:mm a"
          )}</li>`
      )
      .join('');

    jobSeekerContent = `
      <h2 style="color: #f97316; margin-top: 30px;">Job Search Summary</h2>
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
        <p><strong>Applications This Week:</strong> ${stats.applicationsThisWeek || 0}</p>
        <p><strong>Interviews This Week:</strong> ${stats.interviewsThisWeek || 0}</p>
        <p><strong>Offers This Week:</strong> ${stats.offersThisWeek || 0}</p>
      </div>

      <h3 style="color: #f97316;">Upcoming Interviews</h3>
      ${
        upcomingInterviews
          ? `<ul style="padding-left: 20px;">${upcomingInterviews}</ul>`
          : `<p>No upcoming interviews this week.</p>`
      }
    `;
  }

  if (userType === 'freelancer' && tasks && clients && stats) {
    const upcomingDeadlines = tasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const client = clients.find((c) => c.id === task.clientId);
        return `<li>${task.title} for ${client?.name || 'Unknown Client'} due on ${format(
          new Date(task.dueDate!),
          'MMMM d, yyyy'
        )}</li>`;
      })
      .join('');

    freelancerContent = `
      <h2 style="color: #f97316; margin-top: 30px;">Freelance Work Summary</h2>
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
        <p><strong>Tasks Completed This Week:</strong> ${stats.tasksCompletedThisWeek || 0}</p>
        <p><strong>Upcoming Tasks:</strong> ${stats.tasksUpcoming || 0}</p>
        <p><strong>Revenue This Month:</strong> $${(stats.revenueThisMonth || 0).toFixed(2)}</p>
      </div>

      <h3 style="color: #f97316;">Upcoming Deadlines</h3>
      ${
        upcomingDeadlines
          ? `<ul style="padding-left: 20px;">${upcomingDeadlines}</ul>`
          : `<p>No upcoming deadlines this week.</p>`
      }
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Your Weekly Digest</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello ${userName},</p>
        <p>Here's your weekly summary for the week of ${format(new Date(), 'MMMM d, yyyy')}:</p>
        
        ${userType === 'jobSeeker' ? jobSeekerContent : freelancerContent}
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            You're receiving this email because you've enabled weekly digest in your notification settings. 
            You can update your preferences in the settings page of your account.
          </p>
        </div>
      </div>
    </div>
  `;
}
