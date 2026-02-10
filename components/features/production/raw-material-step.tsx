'use client';

import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ProductionLogFormData } from '@/lib/schemas/productionSchemas';
import { Button } from '@/components/ui/button';
import {
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
import { Plus, Trash2 } from 'lucide-react';
import { useMasterStore } from '@/lib/stores/masterStore';

interface RawMaterialStepProps {
  form: UseFormReturn<ProductionLogFormData>;
}

export function RawMaterialStep({ form }: RawMaterialStepProps) {
  const shifts = useMasterStore((state) => state.shifts);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rawMaterials',
  });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Raw Material Batches</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ batchId: '', heatNumber: '', weight: 0 })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Batch
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
            <FormField
              control={form.control}
              name={`rawMaterials.${index}.batchId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch ID</FormLabel>
                  <FormControl>
                    <Input placeholder="B001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`rawMaterials.${index}.heatNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heat Number</FormLabel>
                  <FormControl>
                    <Input placeholder="H12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`rawMaterials.${index}.weight`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (MT)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
