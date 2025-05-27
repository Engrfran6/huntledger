import {getFirestore} from 'firebase/firestore';

import type {Client, Job, Task, UserPreferences} from '@/lib/types';
import {endOfWeek, format, isWithinInterval, startOfWeek} from 'date-fns';
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
import {sendWeeklyDigest} from '../templates/weekly-digest';

export async function processWeeklyDigests(db: ReturnType<typeof getFirestore>): Promise<number> {
  let sentCount = 0;
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  try {
    const userPrefsRef = collection(db, 'userPreferences');
    const userPrefsSnapshot = await getDocs(userPrefsRef);
    const userPrefsDocs = userPrefsSnapshot.docs;

    for (const userPrefDoc of userPrefsDocs) {
      const userPrefs = userPrefDoc.data() as UserPreferences;
      const userId = userPrefDoc.id;

      if (userPrefs.notifications?.weeklyDigest) {
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          const remindersRef = collection(db, 'reminders');
          const reminderQuery = query(
            remindersRef,
            where('userId', '==', userId),
            where('type', '==', 'weekly'),
            where('scheduledFor', '>=', Timestamp.fromDate(weekStart)),
            where('scheduledFor', '<=', Timestamp.fromDate(weekEnd)),
            where('sent', '==', true)
          );
          const reminderSnapshot = await getDocs(reminderQuery);

          if (reminderSnapshot.empty) {
            if (userPrefs.userType === 'jobSeeker') {
              const jobsRef = collection(db, 'jobs');
              const jobsQuery = query(jobsRef, where('userId', '==', userId));
              const jobsSnapshot = await getDocs(jobsQuery);
              const jobs = jobsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Job[];

              const applicationsThisWeek = jobs.filter((job) => {
                const appliedDate = new Date(job.appliedDate);
                return isWithinInterval(appliedDate, {
                  start: weekStart,
                  end: weekEnd,
                });
              }).length;

              const interviewsThisWeek = jobs.filter(
                (job) =>
                  job.status === 'interview' &&
                  job.interviewDate &&
                  isWithinInterval(new Date(job.interviewDate), {
                    start: weekStart,
                    end: weekEnd,
                  })
              ).length;

              const offersThisWeek = jobs.filter(
                (job) =>
                  job.status === 'offer' &&
                  job.startDate &&
                  isWithinInterval(new Date(job.startDate), {
                    start: weekStart,
                    end: weekEnd,
                  })
              ).length;

              const success = await sendWeeklyDigest(
                userData.email,
                userData.displayName || 'there',
                'jobSeeker',
                jobs,
                undefined,
                undefined,
                {
                  applicationsThisWeek,
                  interviewsThisWeek,
                  offersThisWeek,
                }
              );

              if (success) {
                await addDoc(collection(db, 'reminders'), {
                  userId,
                  type: 'weekly',
                  entityId: 'weekly-digest-' + format(today, 'yyyy-MM-dd'),
                  scheduledFor: Timestamp.fromDate(today),
                  sent: true,
                  sentAt: serverTimestamp(),
                });

                sentCount++;
              }
            } else if (userPrefs.userType === 'freelancer') {
              const tasksRef = collection(db, 'tasks');
              const tasksQuery = query(tasksRef, where('userId', '==', userId));
              const tasksSnapshot = await getDocs(tasksQuery);
              const tasks = tasksSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Task[];

              const clientsRef = collection(db, 'clients');
              const clientsQuery = query(clientsRef, where('userId', '==', userId));
              const clientsSnapshot = await getDocs(clientsQuery);
              const clients = clientsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Client[];

              const tasksCompletedThisWeek = tasks.filter(
                (task) =>
                  task.status === 'completed' &&
                  task.completedDate &&
                  isWithinInterval(new Date(task.completedDate), {
                    start: weekStart,
                    end: weekEnd,
                  })
              ).length;

              const tasksUpcoming = tasks.filter(
                (task) =>
                  task.status !== 'completed' && task.dueDate && new Date(task.dueDate) > today
              ).length;

              const revenueThisMonth = 1250.0; // Placeholder

              const success = await sendWeeklyDigest(
                userData.email,
                userData.displayName || 'there',
                'freelancer',
                undefined,
                tasks,
                clients,
                {
                  tasksCompletedThisWeek,
                  tasksUpcoming,
                  revenueThisMonth,
                }
              );

              if (success) {
                await addDoc(collection(db, 'reminders'), {
                  userId,
                  type: 'weekly',
                  entityId: 'weekly-digest-' + format(today, 'yyyy-MM-dd'),
                  scheduledFor: Timestamp.fromDate(today),
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
    console.error('Error processing weekly digests:', error);
  }

  return sentCount;
}
