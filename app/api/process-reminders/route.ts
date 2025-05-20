import {processAllReminders} from '@/lib/reminders/reminder-service';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  const secretToken = process.env.CRON_SECRET_TOKEN;
  const authHeader = req.headers.get('authorization');

  if (!secretToken || !authHeader || authHeader !== `Bearer ${secretToken}`) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const results = await processAllReminders();

    return NextResponse.json({
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
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while processing reminders',
      },
      {status: 500}
    );
  }
}

export const dynamic = 'force-dynamic';
