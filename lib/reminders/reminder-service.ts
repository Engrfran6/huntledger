import {db} from '@/lib/firebase';
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

// Interface for reminder records
interface Reminder {
  id?: string;
  userId: string;
  type: 'interview' | 'offer' | 'task' | 'weekly';
  entityId: string; // ID of the job or task
  scheduledFor: Timestamp;
  sent: boolean;
  sentAt?: Timestamp;
}

// Check for and send interview reminders
export async function processInterviewReminders(): Promise<number> {
  let sentCount = 0;

  try {
    // Get all jobs with interview status and interview date
    const jobsRef = collection(db, 'jobs');
    const jobsQuery = query(jobsRef, where('status', '==', 'interview'));
    const jobsSnapshot = await getDocs(jobsQuery);

    // Process each job
    for (const jobDoc of jobsSnapshot.docs) {
      const job = {id: jobDoc.id, ...jobDoc.data()} as Job;

      // Check if interview is tomorrow
      if (job.interviewDate && isTomorrow(new Date(job.interviewDate))) {
        // Get user preferences
        const userPrefsRef = doc(db, 'userPreferences', job.userId);
        const userPrefsSnapshot = await getDoc(userPrefsRef);

        if (userPrefsSnapshot.exists()) {
          const userPrefs = userPrefsSnapshot.data() as UserPreferences;

          // Check if user wants interview reminders
          if (userPrefs.notifications?.interviewReminders) {
            // Get user email
            const userRef = doc(db, 'users', job.userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();

              // Check if we've already sent this reminder
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
                // Send the reminder
                const success = await sendInterviewReminder(
                  job,
                  userData.email,
                  userData.displayName || 'there'
                );

                if (success) {
                  // Record that we sent the reminder
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
    }
  } catch (error) {
    console.error('Error processing interview reminders:', error);
  }

  return sentCount;
}

// Check for and send offer/start date reminders
export async function processOfferReminders(): Promise<number> {
  let sentCount = 0;

  try {
    // Get all jobs with offer status and start date
    const jobsRef = collection(db, 'jobs');
    const jobsQuery = query(jobsRef, where('status', '==', 'offer'));
    const jobsSnapshot = await getDocs(jobsQuery);

    // Process each job
    for (const jobDoc of jobsSnapshot.docs) {
      const job = {id: jobDoc.id, ...jobDoc.data()} as Job;

      // Check if start date is tomorrow
      if (job.startDate && isTomorrow(new Date(job.startDate))) {
        // Get user preferences
        const userPrefsRef = doc(db, 'userPreferences', job.userId);
        const userPrefsSnapshot = await getDoc(userPrefsRef);

        if (userPrefsSnapshot.exists()) {
          const userPrefs = userPrefsSnapshot.data() as UserPreferences;

          // Check if user wants offer reminders
          if (userPrefs.notifications?.offerDeadlineReminders) {
            // Get user email
            const userRef = doc(db, 'users', job.userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();

              // Check if we've already sent this reminder
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
                // Send the reminder
                const success = await sendOfferReminder(
                  job,
                  userData.email,
                  userData.displayName || 'there'
                );

                if (success) {
                  // Record that we sent the reminder
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

// Check for and send task deadline reminders
export async function processTaskReminders(): Promise<number> {
  let sentCount = 0;

  try {
    // Get all tasks with due dates
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef);
    const tasksSnapshot = await getDocs(tasksQuery);

    // Process each task
    for (const taskDoc of tasksSnapshot.docs) {
      const task = {id: taskDoc.id, ...taskDoc.data()} as Task;

      // Check if due date is tomorrow
      if (task.dueDate && isTomorrow(new Date(task.dueDate))) {
        // Get user preferences
        const userPrefsRef = doc(db, 'userPreferences', task.userId);
        const userPrefsSnapshot = await getDoc(userPrefsRef);

        if (userPrefsSnapshot.exists()) {
          const userPrefs = userPrefsSnapshot.data() as UserPreferences;

          // Check if user wants deadline reminders
          if (userPrefs.notifications?.deadlineReminders) {
            // Get user email
            const userRef = doc(db, 'users', task.userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();

              // Get client info
              const clientRef = doc(db, 'clients', task.clientId);
              const clientSnapshot = await getDoc(clientRef);

              if (clientSnapshot.exists()) {
                const client = {id: clientSnapshot.id, ...clientSnapshot.data()} as Client;

                // Check if we've already sent this reminder
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
                  // Send the reminder
                  const success = await sendTaskDeadlineReminder(
                    task,
                    client,
                    userData.email,
                    userData.displayName || 'there'
                  );

                  if (success) {
                    // Record that we sent the reminder
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

// Process weekly digests (typically run once a week)
export async function processWeeklyDigests(): Promise<number> {
  let sentCount = 0;
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  try {
    // Get all user preferences
    const userPrefsRef = collection(db, 'userPreferences');
    const userPrefsSnapshot = await getDocs(userPrefsRef);

    // Process each user
    for (const userPrefDoc of userPrefsSnapshot.docs) {
      const userPrefs = userPrefDoc.data() as UserPreferences;
      const userId = userPrefDoc.id;

      // Check if user wants weekly digests
      if (userPrefs.notifications?.weeklyDigest) {
        // Get user data
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          // Check if we've already sent this week's digest
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
            // Prepare digest data based on user type
            if (userPrefs.userType === 'jobSeeker') {
              // Get job seeker data
              const jobsRef = collection(db, 'jobs');
              const jobsQuery = query(jobsRef, where('userId', '==', userId));
              const jobsSnapshot = await getDocs(jobsQuery);
              const jobs = jobsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Job[];

              // Calculate stats
              const applicationsThisWeek = jobs.filter((job) => {
                const appliedDate = new Date(job.appliedDate);
                return isWithinInterval(appliedDate, {start: weekStart, end: weekEnd});
              }).length;

              const interviewsThisWeek = jobs.filter(
                (job) =>
                  job.status === 'interview' &&
                  job.interviewDate &&
                  isWithinInterval(new Date(job.interviewDate), {start: weekStart, end: weekEnd})
              ).length;

              const offersThisWeek = jobs.filter(
                (job) =>
                  job.status === 'offer' &&
                  job.startDate &&
                  isWithinInterval(new Date(job.startDate), {start: weekStart, end: weekEnd})
              ).length;

              // Send the digest
              const success = await sendWeeklyDigest(
                userData.email,
                userData.displayName || 'there',
                'jobSeeker',
                jobs,
                undefined,
                undefined,
                {applicationsThisWeek, interviewsThisWeek, offersThisWeek}
              );

              if (success) {
                // Record that we sent the digest
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
              // Get freelancer data
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

              // Calculate stats
              const tasksCompletedThisWeek = tasks.filter(
                (task) =>
                  task.status === 'completed' &&
                  task.completedDate &&
                  isWithinInterval(new Date(task.completedDate), {start: weekStart, end: weekEnd})
              ).length;

              const tasksUpcoming = tasks.filter(
                (task) =>
                  task.status !== 'completed' && task.dueDate && new Date(task.dueDate) > today
              ).length;

              // Calculate revenue (simplified)
              const revenueThisMonth = 1250.0; // Placeholder

              // Send the digest
              const success = await sendWeeklyDigest(
                userData.email,
                userData.displayName || 'there',
                'freelancer',
                undefined,
                tasks,
                clients,
                {tasksCompletedThisWeek, tasksUpcoming, revenueThisMonth}
              );

              if (success) {
                // Record that we sent the digest
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

// Main function to process all reminders
export async function processAllReminders(): Promise<{
  interviews: number;
  offers: number;
  tasks: number;
  digests: number;
}> {
  const interviews = await processInterviewReminders();
  const offers = await processOfferReminders();
  const tasks = await processTaskReminders();
  const digests = await processWeeklyDigests();

  return {interviews, offers, tasks, digests};
}
