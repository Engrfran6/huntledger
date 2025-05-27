import {getFirestore} from 'firebase/firestore';

import type {Client, Task, UserPreferences} from '@/lib/types';
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
import {sendTaskDeadlineReminder} from '../templates/task-deadline-reminder';

export async function processTaskReminders(db: ReturnType<typeof getFirestore>): Promise<number> {
  let sentCount = 0;

  try {
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef);
    const tasksSnapshot = await getDocs(tasksQuery);
    const taskDocs = tasksSnapshot.docs;

    for (const taskDoc of taskDocs) {
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
