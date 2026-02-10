import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Shift, DowntimeCode } from '@/lib/types';

interface MasterStore {
  products: Product[];
  shifts: Shift[];
  downtimeCodes: DowntimeCode[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Shift actions
  addShift: (shift: Omit<Shift, 'id' | 'createdAt'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  
  // Downtime Code actions
  addDowntimeCode: (code: Omit<DowntimeCode, 'id' | 'createdAt'>) => void;
  updateDowntimeCode: (id: string, code: Partial<DowntimeCode>) => void;
  deleteDowntimeCode: (id: string) => void;
}

export const useMasterStore = create<MasterStore>()(
  persist(
    (set) => ({
      products: [],
      shifts: [],
      downtimeCodes: [],
      
      // Product actions
      addProduct: (product) =>
        set((state) => {
          const isDuplicate = state.products.some(
            (p) => p.grade === product.grade && p.dimension === product.dimension
          );
          if (isDuplicate) {
            throw new Error('Product with same grade and dimension already exists');
          }
          return {
            products: [
              ...state.products,
              {
                ...product,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          };
        }),
      
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        })),
      
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      
      // Shift actions
      addShift: (shift) =>
        set((state) => {
          const isDuplicate = state.shifts.some((s) => s.name === shift.name);
          if (isDuplicate) {
            throw new Error('Shift with same name already exists');
          }
          return {
            shifts: [
              ...state.shifts,
              {
                ...shift,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          };
        }),
      
      updateShift: (id, shift) =>
        set((state) => ({
          shifts: state.shifts.map((s) => (s.id === id ? { ...s, ...shift } : s)),
        })),
      
      deleteShift: (id) =>
        set((state) => ({
          shifts: state.shifts.filter((s) => s.id !== id),
        })),
      
      // Downtime Code actions
      addDowntimeCode: (code) =>
        set((state) => {
          const isDuplicate = state.downtimeCodes.some(
            (dc) => dc.code === code.code
          );
          if (isDuplicate) {
            throw new Error('Downtime code already exists');
          }
          return {
            downtimeCodes: [
              ...state.downtimeCodes,
              {
                ...code,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          };
        }),
      
      updateDowntimeCode: (id, code) =>
        set((state) => ({
          downtimeCodes: state.downtimeCodes.map((dc) =>
            dc.id === id ? { ...dc, ...code } : dc
          ),
        })),
      
      deleteDowntimeCode: (id) =>
        set((state) => ({
          downtimeCodes: state.downtimeCodes.filter((dc) => dc.id !== id),
        })),
    }),
    {
      name: 'master-storage',
    }
  )
);
