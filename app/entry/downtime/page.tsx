'use client';

import React from 'react';
import { DowntimeForm } from '@/components/features/downtime/downtime-form';

export default function DowntimeEntryPage() {
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
