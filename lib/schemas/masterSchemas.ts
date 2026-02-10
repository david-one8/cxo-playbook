import { z } from 'zod';

export const productSchema = z.object({
  grade: z.string().min(1, 'Grade is required').max(50),
  dimension: z.string().min(1, 'Dimension is required').max(50),
});

export const shiftSchema = z.object({
  name: z.string().min(1, 'Shift name is required').max(50),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
});

export const downtimeCodeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(20),
  category: z.enum(['MECHANICAL', 'ELECTRICAL', 'OPERATIONAL']),
  description: z.string().min(1, 'Description is required').max(200),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ShiftFormData = z.infer<typeof shiftSchema>;
export type DowntimeCodeFormData = z.infer<typeof downtimeCodeSchema>;
