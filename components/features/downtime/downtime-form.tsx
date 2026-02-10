'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { downtimeLogSchema, DowntimeLogFormData } from '@/lib/schemas/downtimeSchemas';
import { useProductionStore } from '@/lib/stores/productionStore';
import { useMasterStore } from '@/lib/stores/masterStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Trash2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  calculateDuration,
  calculateTotalDowntime,
  detectOverlaps,
} from '@/lib/utils/calculations';

const SHIFT_DURATION = 480; // 8 hours = 480 minutes

export function DowntimeForm() {
  const addDowntimeLog = useProductionStore((state) => state.addDowntimeLog);
  const shifts = useMasterStore((state) => state.shifts);
  const downtimeCodes = useMasterStore((state) => state.downtimeCodes);

  const form = useForm<DowntimeLogFormData>({
    resolver: zodResolver(downtimeLogSchema),
    defaultValues: {
      date: new Date(),
      shiftId: '',
      events: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'events',
  });

  const events = form.watch('events');

  // Calculate metrics
  const eventsWithDuration = events.map((event) => ({
    ...event,
    id: crypto.randomUUID(),
    reasonDescription: downtimeCodes.find((dc) => dc.id === event.reasonCode)?.description || '',
    durationMinutes: calculateDuration(event.startTime, event.endTime),
  }));

  const totalDowntime = calculateTotalDowntime(eventsWithDuration);
  const totalRuntime = SHIFT_DURATION - totalDowntime;
  const hasOverlaps = detectOverlaps(eventsWithDuration);
  const isValid = totalDowntime + totalRuntime === SHIFT_DURATION && !hasOverlaps;

  const onSubmit = (data: DowntimeLogFormData) => {
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: hasOverlaps
          ? 'Overlapping time periods detected'
          : 'Total runtime and downtime must equal 480 minutes',
        variant: 'destructive',
      });
      return;
    }

    const selectedShift = shifts.find((s) => s.id === data.shiftId);

    addDowntimeLog({
      ...data,
      shiftName: selectedShift?.name || '',
      events: eventsWithDuration,
      totalDowntime,
      totalRuntime,
    });

    toast({
      title: 'Success',
      description: 'Downtime log saved successfully',
    });

    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Downtime Event Logging</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shiftId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shifts.map((shift) => (
                          <SelectItem key={shift.id} value={shift.id}>
                            {shift.name} ({shift.startTime} - {shift.endTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Downtime Events</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ startTime: '', endTime: '', reasonCode: '' })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="p-8 border border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    No downtime events recorded. Add events if there were any stoppages during the
                    shift.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-4 gap-4 p-4 border rounded-lg bg-card"
                    >
                      <FormField
                        control={form.control}
                        name={`events.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`events.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`events.${index}.reasonCode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason Code</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {downtimeCodes.map((code) => (
                                  <SelectItem key={code.id} value={code.id}>
                                    {code.code} - {code.description}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-muted-foreground">Duration</label>
                          <div className="text-sm font-medium mt-2">
                            {eventsWithDuration[index]?.durationMinutes || 0} min
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Time Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="text-sm text-muted-foreground">Total Shift Duration</div>
                <div className="text-2xl font-bold">{SHIFT_DURATION} min</div>
              </div>
              <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                <div className="text-sm text-muted-foreground">Total Downtime</div>
                <div className="text-2xl font-bold">{totalDowntime} min</div>
              </div>
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="text-sm text-muted-foreground">Total Runtime</div>
                <div className="text-2xl font-bold">{totalRuntime} min</div>
              </div>
            </div>

            {/* Validation Alerts */}
            {hasOverlaps && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Overlapping Time Periods Detected!</AlertTitle>
                <AlertDescription>
                  Two or more downtime events have overlapping time periods. Please adjust the
                  timings.
                </AlertDescription>
              </Alert>
            )}

            {!hasOverlaps && totalDowntime + totalRuntime !== SHIFT_DURATION && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Time Mismatch Error</AlertTitle>
                <AlertDescription>
                  Total runtime ({totalRuntime} min) + downtime ({totalDowntime} min) must equal
                  480 minutes. Current total: {totalDowntime + totalRuntime} min
                </AlertDescription>
              </Alert>
            )}

            {isValid && events.length > 0 && (
              <Alert className="border-green-500">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Validation Passed</AlertTitle>
                <AlertDescription>
                  All time periods are valid and total duration matches shift length.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={!isValid || !form.watch('shiftId')}>
              Submit Downtime Log
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
