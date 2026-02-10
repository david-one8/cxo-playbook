import { z } from 'zod';

export const downtimeEventSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  reasonCode: z.string().min(1, 'Reason code is required'),
});

export const downtimeLogSchema = z.object({
  date: z.date(),
  shiftId: z.string().min(1, 'Shift is required'),
  events: z.array(downtimeEventSchema).min(0),
});

export type DowntimeEventFormData = z.infer<typeof downtimeEventSchema>;
export type DowntimeLogFormData = z.infer<typeof downtimeLogSchema>;
