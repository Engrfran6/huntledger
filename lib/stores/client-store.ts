import type {Client} from '@/lib/types';
import {create} from 'zustand';

interface ClientsState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  setClients: (clients) => set({clients}),
  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, client],
    })),
  updateClient: (id, updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? {...client, ...updatedClient} : client
      ),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
}));
