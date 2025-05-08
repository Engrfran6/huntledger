import type {Task} from '@/lib/types';
import {create} from 'zustand';

interface TasksState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({tasks}),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? {...task, ...updatedTask} : task)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));
