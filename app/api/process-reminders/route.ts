// app/api/process-reminders/route.ts
import {adminAuth} from '@/lib/firebase-admin';
import {processAllReminders} from '@/lib/reminders/reminder-service';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  const secretToken = process.env.CRON_SECRET_TOKEN;
  const authHeader = req.headers.get('authorization');

  if (!secretToken || !authHeader || authHeader !== `Bearer ${secretToken}`) {
    console.warn(
      'Unauthorized cron job attempt from IP:',
      req.headers.get('x-forwarded-for') || 'unknown'
    );
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const customToken = await adminAuth.createCustomToken('cron-job-worker', {
      cronJob: true,
      uid: 'cron-job-worker',
    });

    const results = await processAllReminders(customToken);

    return NextResponse.json({
      success: true,
      processedAt: new Date().toISOString(),
      stats: results,
    });
  } catch (error: any) {
    console.error('Cron job processing failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Processing failed',
      },
      {status: 500}
    );
  }
}

export const dynamic = 'force-dynamic';
