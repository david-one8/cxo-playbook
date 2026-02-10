export function minutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function hoursToMinutes(hours: number): number {
  return hours * 60;
}

export function parseTimeString(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end}`;
}
