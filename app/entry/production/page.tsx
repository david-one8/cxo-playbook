'use client';

import React, { useState, useEffect } from 'react';
import { ProductionEntrySkeleton } from '@/components/shared/loading-skeleton';
import { ProductionWizard } from '@/components/features/production/production-wizard';

export default function ProductionEntryPage() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Show skeleton for 500ms
    
    return () => clearTimeout(timer);
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    return <ProductionEntrySkeleton />;
  }

  // Render actual page content
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
