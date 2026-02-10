'use client';

import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ProductionLogFormData } from '@/lib/schemas/productionSchemas';
import { useMasterStore } from '@/lib/stores/masterStore';
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

interface ProductionRunStepProps {
  form: UseFormReturn<ProductionLogFormData>;
}

export function ProductionRunStep({ form }: ProductionRunStepProps) {
  const products = useMasterStore((state) => state.products);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'productionRuns',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Finished Goods & Output</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ productId: '', goodProduction: 0, scrap: 0 })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Production Run
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            No products defined. Please add products in Master Data first.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 gap-4 p-4 border rounded-lg bg-card">
              <FormField
                control={form.control}
                name={`productionRuns.${index}.productId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Grade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.grade} - {product.dimension}
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
                name={`productionRuns.${index}.goodProduction`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Good Production (MT)</FormLabel>
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
                name={`productionRuns.${index}.scrap`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miss Roll / Scrap (MT)</FormLabel>
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
      )}

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Total output (Good Production + Scrap) should not exceed total
          input. The system will calculate burning loss automatically.
        </p>
      </div>
    </div>
  );
}
