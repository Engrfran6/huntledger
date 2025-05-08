import type {Subcontractor} from '@/lib/types';
import {create} from 'zustand';

interface SubcontractorsState {
  subcontractors: Subcontractor[];
  setSubcontractors: (subcontractors: Subcontractor[]) => void;
  addSubcontractor: (subcontractor: Subcontractor) => void;
  updateSubcontractor: (id: string, subcontractor: Partial<Subcontractor>) => void;
  deleteSubcontractor: (id: string) => void;
}

export const useSubcontractorsStore = create<SubcontractorsState>((set) => ({
  subcontractors: [],
  setSubcontractors: (subcontractors) => set({subcontractors}),
  addSubcontractor: (subcontractor) =>
    set((state) => ({
      subcontractors: [...state.subcontractors, subcontractor],
    })),
  updateSubcontractor: (id, updatedSubcontractor) =>
    set((state) => ({
      subcontractors: state.subcontractors.map((subcontractor) =>
        subcontractor.id === id ? {...subcontractor, ...updatedSubcontractor} : subcontractor
      ),
    })),
  deleteSubcontractor: (id) =>
    set((state) => ({
      subcontractors: state.subcontractors.filter((subcontractor) => subcontractor.id !== id),
    })),
}));
