'use client';

import React from 'react';
import { ProductionWizard } from '@/components/features/production/production-wizard';

export default function ProductionEntryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Production Entry</h1>
        <p className="text-muted-foreground mt-2">
          Log daily production data with raw materials, furnace operations, and output
        </p>
      </div>

      <ProductionWizard />
    </div>
  );
}
