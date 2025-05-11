import type {Client, Task} from '@/lib/types';
import {format} from 'date-fns';
import type React from 'react';

interface TaskDeadlineReminderProps {
  task: Task;
  client: Client;
  userName: string;
}

export const TaskDeadlineReminderTemplate: React.FC<TaskDeadlineReminderProps> = ({
  task,
  client,
  userName,
}) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const formattedDate = dueDate ? format(dueDate, 'EEEE, MMMM d, yyyy') : 'Not specified';

  return (
    <div>
      <h1>Task Deadline Reminder</h1>
      <p>Hello {userName},</p>
      <p>
        This is a reminder that your task <strong>{task.title}</strong> for client{' '}
        <strong>{client.name}</strong> is due tomorrow.
      </p>
      <div
        style={{margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '5px'}}>
        <h2>Task Details</h2>
        <p>
          <strong>Task:</strong> {task.title}
        </p>
        <p>
          <strong>Client:</strong> {client.name}
        </p>
        <p>
          <strong>Project:</strong> {client.project}
        </p>
        <p>
          <strong>Due Date:</strong> {formattedDate}
        </p>
        <p>
          <strong>Priority:</strong> {task.priority}
        </p>
        {task.description && (
          <p>
            <strong>Description:</strong> {task.description}
          </p>
        )}
      </div>
      <p>Please ensure this task is completed on time.</p>
      <p>
        <em>
          You're receiving this email because you've enabled deadline reminders in your notification
          settings. You can update your preferences in the settings page of your account.
        </em>
      </p>
    </div>
  );
};

export function renderTaskDeadlineReminderEmail(
  task: Task,
  client: Client,
  userName: string
): string {
  // In a real implementation, you would use a library like React DOM Server
  // to render this component to an HTML string
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const formattedDate = dueDate ? format(dueDate, 'EEEE, MMMM d, yyyy') : 'Not specified';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Task Deadline Reminder</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello ${userName},</p>
        <p>
          This is a reminder that your task <strong>${task.title}</strong> for client <strong>${
    client.name
  }</strong> is due
          tomorrow.
        </p>
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #f97316; margin-top: 0;">Task Details</h2>
          <p><strong>Task:</strong> ${task.title}</p>
          <p><strong>Client:</strong> ${client.name}</p>
          <p><strong>Project:</strong> ${client.project}</p>
          <p><strong>Due Date:</strong> ${formattedDate}</p>
          <p><strong>Priority:</strong> ${
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
          }</p>
          ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
        </div>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
          <p>Please ensure this task is completed on time.</p>
          <p style="font-size: 12px; color: #666;">
            You're receiving this email because you've enabled deadline reminders in your notification settings. 
            You can update your preferences in the settings page of your account.
          </p>
        </div>
      </div>
    </div>
  `;
}
