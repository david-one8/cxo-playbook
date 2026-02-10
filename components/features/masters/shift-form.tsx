'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/hookform/resolvers/zod';
import { shiftSchema, ShiftFormData } from '@/lib/schemas/masterSchemas';
import { useMasterStore } from '@/lib/stores/masterStore';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface ShiftFormProps {
  onSuccess?: () => void;
}

export function ShiftForm({ onSuccess }: ShiftFormProps) {
  const addShift = useMasterStore((state) => state.addShift);
  
  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      name: '',
      startTime: '',
      endTime: '',
    },
  });

  const onSubmit = (data: ShiftFormData) => {
    try {
      addShift(data);
      toast({
        title: 'Success',
        description: 'Shift added successfully',
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add shift',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Shift A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
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
          name="endTime"
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
        <Button type="submit" className="w-full">Add Shift</Button>
      </form>
    </Form>
  );
}
