import { RawMaterialBatch, ProductionRun, DowntimeEvent } from '@/lib/types';

export function calculateTotalInput(materials: RawMaterialBatch[]): number {
  return materials.reduce((sum, material) => sum + material.weight, 0);
}

export function calculateTotalOutput(runs: ProductionRun[]): number {
  return runs.reduce((sum, run) => sum + run.goodProduction + run.scrap, 0);
}

export function calculateBurningLoss(totalInput: number, totalOutput: number): number {
  return totalInput - totalOutput;
}

export function calculateBurningLossPercent(burningLoss: number, totalInput: number): number {
  if (totalInput === 0) return 0;
  return (burningLoss / totalInput) * 100;
}

export function calculateYieldPercent(totalOutput: number, totalInput: number): number {
  if (totalInput === 0) return 0;
  return (totalOutput / totalInput) * 100;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return end >= start ? end - start : 1440 - start + end; // Handle overnight shifts
}

export function detectOverlaps(events: DowntimeEvent[]): boolean {
  if (events.length < 2) return false;
  
  const sorted = [...events].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = timeToMinutes(sorted[i].endTime);
    const nextStart = timeToMinutes(sorted[i + 1].startTime);
    
    if (currentEnd > nextStart) {
      return true;
    }
  }
  
  return false;
}

export function calculateTotalDowntime(events: DowntimeEvent[]): number {
  return events.reduce((sum, event) => sum + event.durationMinutes, 0);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
