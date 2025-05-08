import {auth, db} from '@/lib/firebase';
import type {Client, Job, Subcontractor, Task, UserPreferences} from '@/lib/types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

// JOBS

export async function fetchJobs(): Promise<Job[]> {
  if (!auth.currentUser) return [];
  const q = query(collection(db, 'jobs'), where('userId', '==', auth.currentUser.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Job[];
}

export async function fetchJob(id: string): Promise<Job> {
  const docSnap = await getDoc(doc(db, 'jobs', id));
  if (!docSnap.exists()) throw new Error('Job not found');
  return {id: docSnap.id, ...docSnap.data()} as Job;
}

export async function addJob(job: Omit<Job, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  if (!auth.currentUser) throw new Error('You must be logged in to add a job');
  const docRef = await addDoc(collection(db, 'jobs'), {
    ...job,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateJob({id, ...job}: Partial<Job> & {id: string}): Promise<void> {
  await updateDoc(doc(db, 'jobs', id), job);
}

export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, 'jobs', id));
}

// CLIENTS

export async function fetchClients(): Promise<Client[]> {
  if (!auth.currentUser) return [];
  const q = query(collection(db, 'clients'), where('userId', '==', auth.currentUser.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Client[];
}

export async function fetchClient(id: string): Promise<Client> {
  const docSnap = await getDoc(doc(db, 'clients', id));
  if (!docSnap.exists()) throw new Error('Client not found');
  return {id: docSnap.id, ...docSnap.data()} as Client;
}

export async function addClient(
  client: Omit<Client, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  if (!auth.currentUser) throw new Error('You must be logged in to add a client');
  const docRef = await addDoc(collection(db, 'clients'), {
    ...client,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateClient({id, ...client}: Partial<Client> & {id: string}): Promise<void> {
  await updateDoc(doc(db, 'clients', id), client);
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, 'clients', id));
}

// SUBCONTRACTORS

export async function fetchSubcontractors(): Promise<Subcontractor[]> {
  if (!auth.currentUser) return [];
  const q = query(collection(db, 'subcontractors'), where('userId', '==', auth.currentUser.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Subcontractor[];
}

export async function fetchSubcontractor(id: string): Promise<Subcontractor> {
  const docSnap = await getDoc(doc(db, 'subcontractors', id));
  if (!docSnap.exists()) throw new Error('Subcontractor not found');
  return {id: docSnap.id, ...docSnap.data()} as Subcontractor;
}

export async function addSubcontractor(
  subcontractor: Omit<Subcontractor, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  if (!auth.currentUser) throw new Error('You must be logged in to add a subcontractor');
  const docRef = await addDoc(collection(db, 'subcontractors'), {
    ...subcontractor,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSubcontractor({
  id,
  ...subcontractor
}: Partial<Subcontractor> & {id: string}): Promise<void> {
  await updateDoc(doc(db, 'subcontractors', id), subcontractor);
}

export async function deleteSubcontractor(id: string): Promise<void> {
  await deleteDoc(doc(db, 'subcontractors', id));
}

// TASKS

export async function fetchTasks(): Promise<Task[]> {
  if (!auth.currentUser) return [];
  const q = query(collection(db, 'tasks'), where('userId', '==', auth.currentUser.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Task[];
}

export async function fetchTasksByClient(clientId: string): Promise<Task[]> {
  if (!auth.currentUser) return [];
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', auth.currentUser.uid),
    where('clientId', '==', clientId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Task[];
}

export async function fetchTasksBySubcontractor(subcontractorId: string): Promise<Task[]> {
  if (!auth.currentUser) return [];
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', auth.currentUser.uid),
    where('subcontractorId', '==', subcontractorId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Task[];
}

export async function fetchTask(id: string): Promise<Task> {
  const docSnap = await getDoc(doc(db, 'tasks', id));
  if (!docSnap.exists()) throw new Error('Task not found');
  return {id: docSnap.id, ...docSnap.data()} as Task;
}

export async function addTask(task: Omit<Task, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  if (!auth.currentUser) throw new Error('You must be logged in to add a task');
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateTask({id, ...task}: Partial<Task> & {id: string}): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), task);
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', id));
}

// USER PREFERENCES

export async function fetchUserPreferences(): Promise<UserPreferences | null> {
  if (!auth.currentUser) return null;
  const docSnap = await getDoc(doc(db, 'userPreferences', auth.currentUser.uid));
  return docSnap.exists() ? (docSnap.data() as UserPreferences) : null;
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
  if (!auth.currentUser) throw new Error('You must be logged in to update preferences');
  const docRef = doc(db, 'userPreferences', auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, preferences);
  } else {
    await updateDoc(docRef, preferences);
  }
}
