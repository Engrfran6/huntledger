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

// Fetch all jobs for the current user
export async function fetchJobs(): Promise<Job[]> {
  if (!auth.currentUser) {
    return [];
  }

  const jobsRef = collection(db, 'jobs');
  const q = query(jobsRef, where('userId', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Job[];
}

// Fetch a single job by ID
export async function fetchJob(id: string): Promise<Job> {
  const docRef = doc(db, 'jobs', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Job not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Job;
}

// Add a new job
export async function addJob(job: Omit<Job, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('You must be logged in to add a job');
  }

  const docRef = await addDoc(collection(db, 'jobs'), {
    ...job,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update a job
export async function updateJob({id, ...job}: Partial<Job> & {id: string}): Promise<void> {
  const docRef = doc(db, 'jobs', id);
  await updateDoc(docRef, job);
}

// Delete a job
export async function deleteJob(id: string): Promise<void> {
  const docRef = doc(db, 'jobs', id);
  await deleteDoc(docRef);
}

// CLIENTS API

// Fetch all clients for the current user
export async function fetchClients(): Promise<Client[]> {
  if (!auth.currentUser) {
    return [];
  }

  const clientsRef = collection(db, 'clients');
  const q = query(clientsRef, where('userId', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Client[];
}

// Fetch a single client by ID
export async function fetchClient(id: string): Promise<Client> {
  const docRef = doc(db, 'clients', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Client not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Client;
}

// Add a new client
export async function addClient(
  client: Omit<Client, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('You must be logged in to add a client');
  }

  const docRef = await addDoc(collection(db, 'clients'), {
    ...client,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update a client
export async function updateClient({id, ...client}: Partial<Client> & {id: string}): Promise<void> {
  const docRef = doc(db, 'clients', id);
  await updateDoc(docRef, client);
}

// Delete a client
export async function deleteClient(id: string): Promise<void> {
  const docRef = doc(db, 'clients', id);
  await deleteDoc(docRef);
}

// SUBCONTRACTORS API

// Fetch all subcontractors for the current user
export async function fetchSubcontractors(): Promise<Subcontractor[]> {
  if (!auth.currentUser) {
    return [];
  }

  const subcontractorsRef = collection(db, 'subcontractors');
  const q = query(subcontractorsRef, where('userId', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Subcontractor[];
}

// Fetch a single subcontractor by ID
export async function fetchSubcontractor(id: string): Promise<Subcontractor> {
  const docRef = doc(db, 'subcontractors', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Subcontractor not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Subcontractor;
}

// Add a new subcontractor
export async function addSubcontractor(
  subcontractor: Omit<Subcontractor, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('You must be logged in to add a subcontractor');
  }

  const docRef = await addDoc(collection(db, 'subcontractors'), {
    ...subcontractor,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update a subcontractor
export async function updateSubcontractor({
  id,
  ...subcontractor
}: Partial<Subcontractor> & {id: string}): Promise<void> {
  const docRef = doc(db, 'subcontractors', id);
  await updateDoc(docRef, subcontractor);
}

// Delete a subcontractor
export async function deleteSubcontractor(id: string): Promise<void> {
  const docRef = doc(db, 'subcontractors', id);
  await deleteDoc(docRef);
}

// TASKS API

// Fetch all tasks for the current user
export async function fetchTasks(): Promise<Task[]> {
  if (!auth.currentUser) {
    return [];
  }

  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('userId', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
}

// Fetch tasks for a specific client
export async function fetchTasksByClient(clientId: string): Promise<Task[]> {
  if (!auth.currentUser) {
    return [];
  }

  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('userId', '==', auth.currentUser.uid),
    where('clientId', '==', clientId)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
}

// Fetch tasks for a specific subcontractor
export async function fetchTasksBySubcontractor(subcontractorId: string): Promise<Task[]> {
  if (!auth.currentUser) {
    return [];
  }

  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('userId', '==', auth.currentUser.uid),
    where('subcontractorId', '==', subcontractorId)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
}

// Fetch a single task by ID
export async function fetchTask(id: string): Promise<Task> {
  const docRef = doc(db, 'tasks', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Task not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Task;
}

// Add a new task
export async function addTask(task: Omit<Task, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('You must be logged in to add a task');
  }

  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update a task
export async function updateTask({id, ...task}: Partial<Task> & {id: string}): Promise<void> {
  const docRef = doc(db, 'tasks', id);
  await updateDoc(docRef, task);
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  const docRef = doc(db, 'tasks', id);
  await deleteDoc(docRef);
}

// USER PREFERENCES

// Fetch user preferences
export async function fetchUserPreferences(): Promise<UserPreferences | null> {
  if (!auth.currentUser) {
    return null;
  }

  const docRef = doc(db, 'userPreferences', auth.currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as UserPreferences;
}

// Update user preferences
export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('You must be logged in to update preferences');
  }

  const docRef = doc(db, 'userPreferences', auth.currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    await setDoc(docRef, preferences);
  } else {
    await updateDoc(docRef, preferences);
  }
}
