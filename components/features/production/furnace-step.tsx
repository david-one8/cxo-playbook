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

interface FurnaceStepProps {
  form: UseFormReturn<ProductionLogFormData>;
}

const FURNACES = [
  { id: 'G1', name: 'Gasifier 1' },
  { id: 'G2', name: 'Gasifier 2' },
  { id: 'F1', name: 'Furnace 1' },
  { id: 'F2', name: 'Furnace 2' },
  { id: 'F3', name: 'Furnace 3' },
];

export function FurnaceStep({ form }: FurnaceStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'furnaceLogs',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Furnace Operations</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ furnaceId: '', startReading: 0, endReading: 0, coalConsumption: 0 })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Furnace Log
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-5 gap-4 p-4 border rounded-lg bg-card">
            <FormField
              control={form.control}
              name={`furnaceLogs.${index}.furnaceId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furnace</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FURNACES.map((furnace) => (
                        <SelectItem key={furnace.id} value={furnace.id}>
                          {furnace.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`furnaceLogs.${index}.startReading`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Reading</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`furnaceLogs.${index}.endReading`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Reading</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`furnaceLogs.${index}.coalConsumption`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coal (Kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
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

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> End reading must be greater than start reading. Each furnace can be
          logged multiple times if operations are done in batches.
        </p>
      </div>
    </div>
  );
}
