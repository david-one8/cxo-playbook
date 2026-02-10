'use client';

import React, { useState, useEffect } from 'react';
import { useProductionStore } from '@/lib/stores/productionStore';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardSkeleton } from '@/components/shared/loading-skeleton'; // ✅ ADD THIS
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { TrendingUp, Zap, Activity, Factory, AlertTriangle, CheckCircle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardPage() {
  const { productionLogs, downtimeLogs } = useProductionStore();

  //Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Show skeleton for 800ms
    
    return () => clearTimeout(timer);
  }, []);

  //  Show skeleton while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const recentLogs = productionLogs.slice(-5).reverse();
  const allLogs = productionLogs;

  // Calculate comprehensive KPIs
  const avgYield = recentLogs.length > 0
    ? recentLogs.reduce((sum, log) => sum + log.yieldPercent, 0) / recentLogs.length
    : 0;

  const totalProduction = recentLogs.reduce((sum, log) => sum + log.totalOutput, 0);

  const avgBurningLoss = recentLogs.length > 0
    ? recentLogs.reduce((sum, log) => sum + log.burningLossPercent, 0) / recentLogs.length
    : 0;

  const totalDowntimeMinutes = downtimeLogs.reduce((sum, log) => sum + log.totalDowntime, 0);
  const totalRuntimeMinutes = downtimeLogs.reduce((sum, log) => sum + log.totalRuntime, 0);
  const plantAvailability = totalRuntimeMinutes + totalDowntimeMinutes > 0
    ? (totalRuntimeMinutes / (totalRuntimeMinutes + totalDowntimeMinutes)) * 100
    : 0;

  // Calculate previous period for trends
  const previousLogs = productionLogs.slice(-10, -5);
  const prevAvgYield = previousLogs.length > 0
    ? previousLogs.reduce((sum, log) => sum + log.yieldPercent, 0) / previousLogs.length
    : avgYield;
  const yieldTrend = avgYield - prevAvgYield;

  // Downtime analysis with sorting (Pareto principle)
  const downtimeByCategory = downtimeLogs.reduce((acc, log) => {
    log.events.forEach((event) => {
      const code = event.reasonDescription.split(':')[0].trim();
      const category = code.startsWith('MEC') ? 'Mechanical' : 
                      code.startsWith('ELE') ? 'Electrical' : 'Operational';
      acc[category] = (acc[category] || 0) + event.durationMinutes;
    });
    return acc;
  }, {} as Record<string, number>);

  // Sort by descending order (Pareto)
  const chartData = Object.entries(downtimeByCategory)
    .map(([name, value]) => ({
      name,
      minutes: value,
      percentage: totalDowntimeMinutes > 0 
        ? ((value / totalDowntimeMinutes) * 100).toFixed(1) 
        : '0',
    }))
    .sort((a, b) => b.minutes - a.minutes);

  // Category colors
  const CATEGORY_COLORS: Record<string, string> = {
    Mechanical: '#ef4444',
    Electrical: '#f59e0b',
    Operational: '#3b82f6',
  };

  // Yield trend data for line chart
  const yieldTrendData = allLogs.slice(-7).map((log, idx) => ({
    day: `Day ${idx + 1}`,
    yieldValue: parseFloat(log.yieldPercent.toFixed(2)), // Ensure numeric value
    target: 97,
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">
            {payload[0].value} minutes
          </p>
          {payload[0].payload.percentage && (
            <p className="text-xs text-muted-foreground">
              {payload[0].payload.percentage}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for line chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0]?.payload?.date || label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Efficiency status
  const getEfficiencyStatus = (yieldValue: number) => {
    if (yieldValue > 95) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (yieldValue > 90) return { label: 'Good', color: 'text-blue-600', icon: TrendingUp };
    return { label: 'Needs Attention', color: 'text-orange-600', icon: AlertTriangle };
  };

  const efficiencyStatus = getEfficiencyStatus(avgYield);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time production analytics and performance metrics
          </p>
        </div>
      </div>

      {/* Alert for issues */}
      {avgYield < 90 && productionLogs.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Performance Alert</AlertTitle>
          <AlertDescription>
            Average yield is below target (90%). Current: {formatNumber(avgYield)}%. 
            Burning loss: {formatNumber(avgBurningLoss)}%
          </AlertDescription>
        </Alert>
      )}

      {/* Alert for high burning loss */}
      {avgBurningLoss > 5 && productionLogs.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Burning Loss Alert</AlertTitle>
          <AlertDescription>
            Burning loss is {formatNumber(avgBurningLoss)}%, significantly above target (3%). 
            Please review production data and process parameters.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Yield %"
          value={`${formatNumber(avgYield)}%`}
          subtitle="Last 5 production logs"
          icon={TrendingUp}
          trend={{
            value: Math.abs(yieldTrend),
            isPositive: yieldTrend >= 0,
          }}
        />
        <StatCard
          title="Total Production"
          value={`${formatNumber(totalProduction)} MT`}
          subtitle="Recent period output"
          icon={Factory}
        />
        <StatCard
          title="Plant Availability"
          value={`${formatNumber(plantAvailability)}%`}
          subtitle={`${totalRuntimeMinutes} min runtime`}
          icon={Activity}
        />
        <StatCard
          title="Plant Efficiency"
          value={efficiencyStatus.label}
          subtitle="Based on yield performance"
          icon={efficiencyStatus.icon}
          className={efficiencyStatus.color}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Burning Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(avgBurningLoss)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgBurningLoss < 3 ? '✅ Within target (<3%)' : '⚠️ Above target'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Downtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDowntimeMinutes} min
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {downtimeLogs.length} shifts logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Production Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionLogs.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total entries recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pareto Chart - Enhanced */}
        <Card>
          <CardHeader>
            <CardTitle>Downtime Analysis (Pareto)</CardTitle>
            <CardDescription>
              Top downtime categories sorted by duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No downtime data available</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Log downtime events to see analysis
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Downtime (Minutes)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'hsl(var(--foreground))', fontSize: 12 }
                    }}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar 
                    dataKey="minutes" 
                    name="Downtime (min)"
                    radius={[8, 8, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name] || 'hsl(var(--primary))'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Yield Trend Chart - FIXED */}
        <Card>
          <CardHeader>
            <CardTitle>Yield Trend Analysis</CardTitle>
            <CardDescription>
              Last 7 production logs vs 97% target
            </CardDescription>
          </CardHeader>
          <CardContent>
            {yieldTrendData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No production data available</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Log production data to see trends
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yieldTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 97, 100]}
                    label={{ 
                      value: 'Yield (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'hsl(var(--foreground))', fontSize: 12 }
                    }}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="yieldValue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Actual Yield %"
                    dot={{ fill: '#3b82f6', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target (97%)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Production Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Production Logs</CardTitle>
          <CardDescription>
            Last 5 production entries with detailed metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Input (MT)</TableHead>
                <TableHead>Output (MT)</TableHead>
                <TableHead>Yield %</TableHead>
                <TableHead>Burning Loss</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Factory className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">No production logs available</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Start logging production data to see analytics
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                recentLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      {new Date(log.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.shiftName}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatNumber(log.totalInput)}</TableCell>
                    <TableCell className="font-medium">{formatNumber(log.totalOutput)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          log.yieldPercent > 95 ? 'default' : 
                          log.yieldPercent > 90 ? 'secondary' : 
                          'destructive'
                        }
                        className="font-semibold"
                      >
                        {formatNumber(log.yieldPercent)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={
                        log.burningLossPercent > 5 ? 'text-red-600 font-bold' :
                        log.burningLossPercent > 3 ? 'text-orange-600 font-medium' : 
                        'text-muted-foreground'
                      }>
                        {formatNumber(log.burningLossPercent)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.yieldPercent > 95 ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Excellent
                        </Badge>
                      ) : log.yieldPercent > 90 ? (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Good
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Review
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
