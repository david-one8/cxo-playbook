export interface Product {
  id: string;
  grade: string;
  dimension: string;
  createdAt: Date;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
}

export interface DowntimeCode {
  id: string;
  code: string;
  category: 'MECHANICAL' | 'ELECTRICAL' | 'OPERATIONAL';
  description: string;
  createdAt: Date;
}

export interface RawMaterialBatch {
  id: string;
  batchId: string;
  heatNumber: string;
  weight: number;
}

export interface FurnaceLog {
  id: string;
  furnaceId: string;
  startReading: number;
  endReading: number;
  coalConsumption: number;
}

export interface ProductionRun {
  id: string;
  productId: string;
  productGrade: string;
  goodProduction: number;
  scrap: number;
}

export interface ProductionLog {
  id: string;
  date: Date;
  shiftId: string;
  shiftName: string;
  rawMaterials: RawMaterialBatch[];
  furnaceLogs: FurnaceLog[];
  productionRuns: ProductionRun[];
  totalInput: number;
  totalOutput: number;
  burningLoss: number;
  burningLossPercent: number;
  yieldPercent: number;
  createdAt: Date;
}

export interface DowntimeEvent {
  id: string;
  startTime: string;
  endTime: string;
  reasonCode: string;
  reasonDescription: string;
  durationMinutes: number;
}

export interface DowntimeLog {
  id: string;
  date: Date;
  shiftId: string;
  shiftName: string;
  events: DowntimeEvent[];
  totalDowntime: number;
  totalRuntime: number;
  createdAt: Date;
}
