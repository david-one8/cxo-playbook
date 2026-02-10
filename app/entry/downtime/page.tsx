'use client';

import React, { useState, useEffect } from 'react';
import { DowntimeEntrySkeleton } from '@/components/shared/loading-skeleton';
import { DowntimeForm } from '@/components/features/downtime/downtime-form';

export default function DowntimeEntryPage() {
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
    return <DowntimeEntrySkeleton />;
  }

  // Render actual page content
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Downtime Entry</h1>
        <p className="text-muted-foreground mt-2">
          Account for every minute of the 480-minute shift with downtime event tracking
        </p>
      </div>

      <DowntimeForm />
    </div>
  );
}
