'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ResumeDashboardSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Top Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>

      {/* Analytics Widget Skeleton Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hero Active Resume Card Skeleton */}
      <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-3.5 w-72 rounded-md" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card
            key={i}
            className="space-y-4 border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-7 w-20 rounded-lg" />
              <Skeleton className="h-7 w-24 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
