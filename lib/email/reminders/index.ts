import {initializeApp} from 'firebase/app';
import {getAuth, signInWithCustomToken} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

import {firebaseConfig} from '../../firebase';
import {processInterviewReminders} from './process-interview-reminders';
import {processOfferReminders} from './process-offer-reminders';
import {processTaskReminders} from './process-task-reminders';
import {processWeeklyDigests} from './process-weekly-digest-reminders';

let cronDb: ReturnType<typeof getFirestore> | null = null;

async function getCronDb(customToken: string) {
  if (!cronDb) {
    const cronApp = initializeApp(firebaseConfig, 'cron-job-instance');
    const auth = getAuth(cronApp);
    await signInWithCustomToken(auth, customToken);
    cronDb = getFirestore(cronApp);
  }
  return cronDb;
}

export async function processAllReminders(customToken: string) {
  try {
    const db = await getCronDb(customToken);
    const [interviews, offers, tasks, digests] = await Promise.all([
      processInterviewReminders(db),
      processOfferReminders(db),
      processTaskReminders(db),
      processWeeklyDigests(db),
    ]);

    return {interviews, offers, tasks, digests};
  } catch (error) {
    console.error('Error in processing Reminders:', error);
    throw error;
  }
}
