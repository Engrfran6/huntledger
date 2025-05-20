import {processAllReminders} from '@/lib/reminders/reminder-service';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const secretToken = process.env.CRON_SECRET_TOKEN;
  const authHeader = req.headers.authorization;

  if (!secretToken || !authHeader || authHeader !== `Bearer ${secretToken}`) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  try {
    // Process all reminders
    const results = await processAllReminders();

    return res.status(200).json({
      success: true,
      processed: {
        interviewReminders: results.interviews,
        offerReminders: results.offers,
        taskReminders: results.tasks,
        weeklyDigests: results.digests,
      },
    });
  } catch (error: any) {
    console.error('Error processing reminders:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing reminders',
    });
  }
}
