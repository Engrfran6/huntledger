import {getFirestore} from 'firebase/firestore';

import type {Job, UserPreferences} from '@/lib/types';
import {isTomorrow} from 'date-fns';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import {sendOfferReminder} from '../templates/offer-reminder';

export async function processOfferReminders(db: ReturnType<typeof getFirestore>): Promise<number> {
  let sentCount = 0;

  try {
    const jobsRef = collection(db, 'jobs');
    const jobsQuery = query(jobsRef, where('status', '==', 'offer'));
    const jobsSnapshot = await getDocs(jobsQuery);
    const jobDocs = jobsSnapshot.docs;

    for (const jobDoc of jobDocs) {
      const job = {id: jobDoc.id, ...jobDoc.data()} as Job;

      if (job.startDate && isTomorrow(new Date(job.startDate))) {
        const userPrefsRef = doc(db, 'userPreferences', job.userId);
        const userPrefsSnapshot = await getDoc(userPrefsRef);

        if (userPrefsSnapshot.exists()) {
          const userPrefs = userPrefsSnapshot.data() as UserPreferences;

          if (userPrefs.notifications?.offerDeadlineReminders) {
            const userRef = doc(db, 'users', job.userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();

              const remindersRef = collection(db, 'reminders');
              const reminderQuery = query(
                remindersRef,
                where('userId', '==', job.userId),
                where('type', '==', 'offer'),
                where('entityId', '==', job.id),
                where('sent', '==', true)
              );
              const reminderSnapshot = await getDocs(reminderQuery);

              if (reminderSnapshot.empty) {
                const success = await sendOfferReminder(
                  job,
                  userData.email,
                  userData.displayName || 'there'
                );

                if (success) {
                  await addDoc(collection(db, 'reminders'), {
                    userId: job.userId,
                    type: 'offer',
                    entityId: job.id,
                    scheduledFor: Timestamp.fromDate(new Date(job.startDate)),
                    sent: true,
                    sentAt: serverTimestamp(),
                  });

                  sentCount++;
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing offer reminders:', error);
  }

  return sentCount;
}
