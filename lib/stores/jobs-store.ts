import { create } from "zustand"
import type { Job } from "@/lib/types"

interface JobsState {
  jobs: Job[]
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (id: string, job: Partial<Job>) => void
  deleteJob: (id: string) => void
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) =>
    set((state) => ({
      jobs: [...state.jobs, job],
    })),
  updateJob: (id, updatedJob) =>
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updatedJob } : job)),
    })),
  deleteJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),
}))
