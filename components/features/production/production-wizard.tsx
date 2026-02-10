'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productionLogSchema, ProductionLogFormData } from '@/lib/schemas/productionSchemas';
import { useProductionStore } from '@/lib/stores/productionStore';
import { useMasterStore } from '@/lib/stores/masterStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';  // ← ADD THIS IMPORT
import { RawMaterialStep } from './raw-material-step';
import { FurnaceStep } from './furnace-step';
import { ProductionRunStep } from './production-run-step';
import { YieldSummary } from './yield-summary';
import { toast } from '@/components/ui/use-toast';
import {
  calculateTotalInput,
  calculateTotalOutput,
  calculateBurningLoss,
  calculateBurningLossPercent,
  calculateYieldPercent,
} from '@/lib/utils/calculations';

export function ProductionWizard() {
  const [step, setStep] = useState(1);
  const addProductionLog = useProductionStore((state) => state.addProductionLog);
  const shifts = useMasterStore((state) => state.shifts);
  
  const form = useForm<ProductionLogFormData>({
    resolver: zodResolver(productionLogSchema),
    defaultValues: {
      date: new Date(),
      shiftId: '',
      rawMaterials: [{ batchId: '', heatNumber: '', weight: 0 }],
      furnaceLogs: [{ furnaceId: '', startReading: 0, endReading: 0, coalConsumption: 0 }],
      productionRuns: [{ productId: '', goodProduction: 0, scrap: 0 }],
    },
  });

  const { watch } = form;
  const rawMaterials = watch('rawMaterials');
  const productionRuns = watch('productionRuns');

  const totalInput = calculateTotalInput(rawMaterials.map((rm, idx) => ({
    id: String(idx),
    ...rm,
  })));
  
  const totalOutput = calculateTotalOutput(productionRuns.map((pr, idx) => ({
    id: String(idx),
    productGrade: '',
    ...pr,
  })));
  
  const burningLoss = calculateBurningLoss(totalInput, totalOutput);
  const burningLossPercent = calculateBurningLossPercent(burningLoss, totalInput);
  const yieldPercent = calculateYieldPercent(totalOutput, totalInput);

  const onSubmit = (data: ProductionLogFormData) => {
    if (burningLoss < 0) {
      toast({
        title: 'Validation Error',
        description: 'Burning loss cannot be negative. Output exceeds input!',
        variant: 'destructive',
      });
      return;
    }

    const selectedShift = shifts.find((s) => s.id === data.shiftId);
    
    addProductionLog({
      ...data,
      shiftName: selectedShift?.name || '',
      rawMaterials: data.rawMaterials.map((rm) => ({
        id: crypto.randomUUID(),
        ...rm,
      })),
      furnaceLogs: data.furnaceLogs.map((fl) => ({
        id: crypto.randomUUID(),
        ...fl,
      })),
      productionRuns: data.productionRuns.map((pr) => {
        const product = useMasterStore.getState().products.find((p) => p.id === pr.productId);
        return {
          id: crypto.randomUUID(),
          ...pr,
          productGrade: product ? `${product.grade} ${product.dimension}` : '',
        };
      }),
      totalInput,
      totalOutput,
      burningLoss,
      burningLossPercent,
      yieldPercent,
    });

    toast({
      title: 'Success',
      description: 'Production log saved successfully',
    });
    
    form.reset();
    setStep(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Log Entry - Step {step} of 3</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 1 && <RawMaterialStep form={form} />}
              {step === 2 && <FurnaceStep form={form} />}
              {step === 3 && <ProductionRunStep form={form} />}
              
              <YieldSummary
                totalInput={totalInput}
                totalOutput={totalOutput}
                burningLoss={burningLoss}
                burningLossPercent={burningLossPercent}
                yieldPercent={yieldPercent}
              />

              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="button" onClick={() => setStep(step + 1)} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto" disabled={burningLoss < 0}>
                    Submit Log
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
