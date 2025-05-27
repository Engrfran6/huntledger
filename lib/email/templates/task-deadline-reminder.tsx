import type {Client, Task} from '@/lib/types';
import {sendEmail} from '../brevo';

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
