import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductionLog, DowntimeLog } from '@/lib/types';

interface ProductionStore {
  productionLogs: ProductionLog[];
  downtimeLogs: DowntimeLog[];
  
  addProductionLog: (log: Omit<ProductionLog, 'id' | 'createdAt'>) => void;
  updateProductionLog: (id: string, log: Partial<ProductionLog>) => void;
  deleteProductionLog: (id: string) => void;
  
  addDowntimeLog: (log: Omit<DowntimeLog, 'id' | 'createdAt'>) => void;
  updateDowntimeLog: (id: string, log: Partial<DowntimeLog>) => void;
  deleteDowntimeLog: (id: string) => void;
  
  getRecentLogs: (count: number) => ProductionLog[];
}

export const useProductionStore = create<ProductionStore>()(
  persist(
    (set, get) => ({
      productionLogs: [],
      downtimeLogs: [],
      
      addProductionLog: (log) =>
        set((state) => ({
          productionLogs: [
            ...state.productionLogs,
            {
              ...log,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      
      updateProductionLog: (id, log) =>
        set((state) => ({
          productionLogs: state.productionLogs.map((l) =>
            l.id === id ? { ...l, ...log } : l
          ),
        })),
      
      deleteProductionLog: (id) =>
        set((state) => ({
          productionLogs: state.productionLogs.filter((l) => l.id !== id),
        })),
      
      addDowntimeLog: (log) =>
        set((state) => ({
          downtimeLogs: [
            ...state.downtimeLogs,
            {
              ...log,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      
      updateDowntimeLog: (id, log) =>
        set((state) => ({
          downtimeLogs: state.downtimeLogs.map((l) =>
            l.id === id ? { ...l, ...log } : l
          ),
        })),
      
      deleteDowntimeLog: (id) =>
        set((state) => ({
          downtimeLogs: state.downtimeLogs.filter((l) => l.id !== id),
        })),
      
      getRecentLogs: (count) => {
        const logs = get().productionLogs;
        return logs.slice(-count).reverse();
      },
    }),
    {
      name: 'production-storage',
    }
  )
);
