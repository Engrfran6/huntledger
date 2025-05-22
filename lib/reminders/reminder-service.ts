// lib/reminders/reminder-service.ts
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithCustomToken} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

import type {Client, Job, Task, UserPreferences} from '@/lib/types';
import {endOfWeek, format, isTomorrow, isWithinInterval, startOfWeek} from 'date-fns';
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
import {
  sendInterviewReminder,
  sendOfferReminder,
  sendTaskDeadlineReminder,
  sendWeeklyDigest,
} from '../email/send-email';
import {firebaseConfig} from '../firebase';

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
    console.error('Error in processAllReminders:', error);
    throw error;
  }
}

async function processInterviewReminders(db: ReturnType<typeof getFirestore>) {
  let sentCount = 0;
  try {
    const jobsRef = collection(db, 'jobs');
    const jobsQuery = query(jobsRef, where('status', '==', 'interview'));
    const jobsSnapshot = await getDocs(jobsQuery);

    for (const jobDoc of jobsSnapshot.docs) {
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

export async function processOfferReminders(db: ReturnType<typeof getFirestore>): Promise<number> {
  let sentCount = 0;

  try {
    const jobsRef = collection(db, 'jobs');
    const jobsQuery = query(jobsRef, where('status', '==', 'offer'));
    const jobsSnapshot = await getDocs(jobsQuery);

    for (const jobDoc of jobsSnapshot.docs) {
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

export async function processTaskReminders(db: ReturnType<typeof getFirestore>): Promise<number> {
  let sentCount = 0;

  try {
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef);
    const tasksSnapshot = await getDocs(tasksQuery);

    for (const taskDoc of tasksSnapshot.docs) {
      const task = {id: taskDoc.id, ...taskDoc.data()} as Task;

      if (task.dueDate && isTomorrow(new Date(task.dueDate))) {
        const userPrefsRef = doc(db, 'userPreferences', task.userId);
        const userPrefsSnapshot = await getDoc(userPrefsRef);

        if (userPrefsSnapshot.exists()) {
          const userPrefs = userPrefsSnapshot.data() as UserPreferences;

          if (userPrefs.notifications?.deadlineReminders) {
            const userRef = doc(db, 'users', task.userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();

              const clientRef = doc(db, 'clients', task.clientId);
              const clientSnapshot = await getDoc(clientRef);

              if (clientSnapshot.exists()) {
                const client = {
                  id: clientSnapshot.id,
                  ...clientSnapshot.data(),
                } as Client;

                const remindersRef = collection(db, 'reminders');
                const reminderQuery = query(
                  remindersRef,
                  where('userId', '==', task.userId),
                  where('type', '==', 'task'),
                  where('entityId', '==', task.id),
                  where('sent', '==', true)
                );
                const reminderSnapshot = await getDocs(reminderQuery);

                if (reminderSnapshot.empty) {
                  const success = await sendTaskDeadlineReminder(
                    task,
                    client,
                    userData.email,
                    userData.displayName || 'there'
                  );

                  if (success) {
                    await addDoc(collection(db, 'reminders'), {
                      userId: task.userId,
                      type: 'task',
                      entityId: task.id,
                      scheduledFor: Timestamp.fromDate(new Date(task.dueDate)),
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
    }
  } catch (error) {
    console.error('Error processing task reminders:', error);
  }

  return sentCount;
}

export async function processWeeklyDigests(db: ReturnType<typeof getFirestore>): Promise<number> {
  let sentCount = 0;
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  try {
    const userPrefsRef = collection(db, 'userPreferences');
    const userPrefsSnapshot = await getDocs(userPrefsRef);

    for (const userPrefDoc of userPrefsSnapshot.docs) {
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
