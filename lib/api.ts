import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import type { Job } from "@/lib/types"

// Fetch all jobs for the current user
export async function fetchJobs(): Promise<Job[]> {
  if (!auth.currentUser) {
    return []
  }

  const jobsRef = collection(db, "jobs")
  const q = query(jobsRef, where("userId", "==", auth.currentUser.uid))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Job[]
}

// Fetch a single job by ID
export async function fetchJob(id: string): Promise<Job> {
  const docRef = doc(db, "jobs", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    throw new Error("Job not found")
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Job
}

// Add a new job
export async function addJob(job: Omit<Job, "id" | "userId" | "createdAt">): Promise<string> {
  if (!auth.currentUser) {
    throw new Error("You must be logged in to add a job")
  }

  const docRef = await addDoc(collection(db, "jobs"), {
    ...job,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

// Update a job
export async function updateJob({ id, ...job }: Partial<Job> & { id: string }): Promise<void> {
  const docRef = doc(db, "jobs", id)
  await updateDoc(docRef, job)
}

// Delete a job
export async function deleteJob(id: string): Promise<void> {
  const docRef = doc(db, "jobs", id)
  await deleteDoc(docRef)
}
