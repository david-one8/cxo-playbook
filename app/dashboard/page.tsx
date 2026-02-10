'use client';

import React from 'react';
import { useProductionStore } from '@/lib/stores/productionStore';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Zap, Activity, Factory } from 'lucide-react';
import { formatNumber } from '@/lib/utils/calculations';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { productionLogs, downtimeLogs } = useProductionStore();
  const recentLogs = productionLogs.slice(-5).reverse();

  // Calculate KPIs
  const avgYield = recentLogs.length > 0
    ? recentLogs.reduce((sum, log) => sum + log.yieldPercent, 0) / recentLogs.length
    : 0;

  const totalProduction = recentLogs.reduce((sum, log) => sum + log.totalOutput, 0);

  // Downtime analysis
  const downtimeByCategory = downtimeLogs.reduce((acc, log) => {
    log.events.forEach((event) => {
      const code = event.reasonDescription.split(':')[0];
      const category = code.startsWith('MEC') ? 'Mechanical' : 
                      code.startsWith('ELE') ? 'Electrical' : 'Operational';
      acc[category] = (acc[category] || 0) + event.durationMinutes;
    });
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(downtimeByCategory).map(([name, value]) => ({
    name,
    minutes: value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Executive Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Real-time production analytics and performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Yield %"
          value={`${formatNumber(avgYield)}%`}
          subtitle="Last 5 logs"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Production"
          value={`${formatNumber(totalProduction)} MT`}
          subtitle="Recent period"
          icon={Factory}
        />
        <StatCard
          title="Active Shifts"
          value={productionLogs.length}
          subtitle="Logged entries"
          icon={Activity}
        />
        <StatCard
          title="Efficiency"
          value={avgYield > 95 ? 'Excellent' : avgYield > 90 ? 'Good' : 'Fair'}
          subtitle="Plant performance"
          icon={Zap}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Downtime Analysis (Pareto)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="minutes" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Production Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Yield %</TableHead>
                  <TableHead>Output (MT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No production logs available
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                      <TableCell>{log.shiftName}</TableCell>
                      <TableCell>
                        <Badge variant={log.yieldPercent > 95 ? 'default' : 'secondary'}>
                          {formatNumber(log.yieldPercent)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{formatNumber(log.totalOutput)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
