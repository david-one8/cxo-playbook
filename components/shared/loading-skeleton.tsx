import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Generic loading skeleton
export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// Card/KPI skeleton
export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-3 bg-card">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="space-y-2 mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-md" />
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="space-y-2 mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-3">
        {/* Table header */}
        <Skeleton className="h-10 w-full" />
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

// Dashboard skeleton (complete page)
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      {/* Alert placeholder */}
      <Skeleton className="h-20 w-full rounded-lg" />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Table */}
      <TableSkeleton rows={5} />
    </div>
  );
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Stat card grid skeleton
export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Master Data Management skeleton (with tabs + table)
export function MasterDataSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-96 mb-2" />
        <Skeleton className="h-5 w-[450px]" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Skeleton className="h-10 w-24 mb-[-1px]" />
        <Skeleton className="h-10 w-20 mb-[-1px]" />
        <Skeleton className="h-10 w-36 mb-[-1px]" />
      </div>

      {/* Card */}
      <div className="border rounded-lg bg-card">
        {/* Card Header with button */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>

        {/* Table */}
        <div className="px-6 pb-6">
          {/* Table Header */}
          <div className="flex gap-4 pb-3 border-b mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Table Rows */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center py-3 border-b">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-48 flex-1" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
