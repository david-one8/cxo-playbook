'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/schemas/masterSchemas';
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

interface ProductFormProps {
  onSuccess?: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const addProduct = useMasterStore((state) => state.addProduct);
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      grade: '',
      dimension: '',
    },
  });

  const onSubmit = (data: ProductFormData) => {
    try {
      addProduct(data);
      toast({
        title: 'Success',
        description: 'Product added successfully',
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add product',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Steel Grade</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Fe500D" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dimension"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dimension</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 8mm Wire Rod" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Add Product</Button>
      </form>
    </Form>
  );
}
