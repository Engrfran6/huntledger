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
import {sendInterviewReminder} from '../templates/interview-reminder';

export async function processInterviewReminders(db: ReturnType<typeof getFirestore>) {
  let sentCount = 0;
  try {
    const jobsRef = collection(db, 'jobs');
    const jobsQuery = query(jobsRef, where('status', '==', 'interview'));
    const jobsSnapshot = await getDocs(jobsQuery);
    const jobDocs = jobsSnapshot.docs;

    for (const jobDoc of jobDocs) {
      const job = {id: jobDoc.id, ...jobDoc.data()} as Job;

      if (job.interviewDate && isTomorrow(new Date(job.interviewDate))) {
        const [userPrefsSnapshot, userSnapshot] = await Promise.all([
          getDoc(doc(db, 'userPreferences', job.userId)),
          getDoc(doc(db, 'users', job.userId)),
        ]);

        if (userPrefsSnapshot.exists() && userSnapshot.exists()) {
          const userPrefs = userPrefsSnapshot.data() as UserPreferences;
          const userData = userSnapshot.data();

          if (userPrefs.notifications?.interviewReminders) {
            const remindersRef = collection(db, 'reminders');
            const reminderQuery = query(
              remindersRef,
              where('userId', '==', job.userId),
              where('type', '==', 'interview'),
              where('entityId', '==', job.id),
              where('sent', '==', true)
            );
            const reminderSnapshot = await getDocs(reminderQuery);

            if (reminderSnapshot.empty) {
              const success = await sendInterviewReminder(
                job,
                userData.email,
                userData.displayName || 'there'
              );

              if (success) {
                await addDoc(collection(db, 'reminders'), {
                  userId: job.userId,
                  type: 'interview',
                  entityId: job.id,
                  scheduledFor: Timestamp.fromDate(new Date(job.interviewDate)),
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
  } catch (error) {
    console.error('Error processing interview reminders:', error);
  }
  return sentCount;
}
