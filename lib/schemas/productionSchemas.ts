import { z } from 'zod';

export const rawMaterialSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  heatNumber: z.string().min(1, 'Heat number is required'),
  weight: z.number().min(0.01, 'Weight must be greater than 0'),
});

export const furnaceLogSchema = z.object({
  furnaceId: z.string().min(1, 'Furnace ID is required'),
  startReading: z.number().min(0, 'Start reading must be positive'),
  endReading: z.number().min(0, 'End reading must be positive'),
  coalConsumption: z.number().min(0, 'Coal consumption must be positive'),
}).refine((data) => data.endReading > data.startReading, {
  message: 'End reading must be greater than start reading',
  path: ['endReading'],
});

export const productionRunSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  goodProduction: z.number().min(0, 'Good production must be positive'),
  scrap: z.number().min(0, 'Scrap must be positive'),
});

export const productionLogSchema = z.object({
  date: z.date(),
  shiftId: z.string().min(1, 'Shift is required'),
  rawMaterials: z.array(rawMaterialSchema).min(1, 'At least one raw material batch is required'),
  furnaceLogs: z.array(furnaceLogSchema).min(1, 'At least one furnace log is required'),
  productionRuns: z.array(productionRunSchema).min(1, 'At least one production run is required'),
});

export type RawMaterialFormData = z.infer<typeof rawMaterialSchema>;
export type FurnaceLogFormData = z.infer<typeof furnaceLogSchema>;
export type ProductionRunFormData = z.infer<typeof productionRunSchema>;
export type ProductionLogFormData = z.infer<typeof productionLogSchema>;
