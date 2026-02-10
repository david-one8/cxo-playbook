import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { formatNumber } from '@/lib/utils/calculations';

interface YieldSummaryProps {
  totalInput: number;
  totalOutput: number;
  burningLoss: number;
  burningLossPercent: number;
  yieldPercent: number;
}

export function YieldSummary({
  totalInput,
  totalOutput,
  burningLoss,
  burningLossPercent,
  yieldPercent,
}: YieldSummaryProps) {
  const isError = burningLoss < 0;
  const isWarning = burningLossPercent > 3 && !isError;
  const isNormal = !isError && !isWarning;

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Input</div>
          <div className="text-2xl font-bold">{formatNumber(totalInput)} MT</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Output</div>
          <div className="text-2xl font-bold">{formatNumber(totalOutput)} MT</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Yield %</div>
          <div className="text-2xl font-bold">{formatNumber(yieldPercent)}%</div>
        </div>
      </div>

      {isError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Physics Violation Detected!</AlertTitle>
          <AlertDescription>
            Burning loss is negative ({formatNumber(burningLoss)} MT). Output cannot exceed input.
            Please verify your entries.
          </AlertDescription>
        </Alert>
      )}

      {isWarning && (
        <Alert className="border-yellow-500 text-yellow-900 dark:text-yellow-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Burning Loss Warning</AlertTitle>
          <AlertDescription>
            Burning loss is {formatNumber(burningLossPercent)}% which exceeds the normal threshold
            of 3%. Burning Loss: {formatNumber(burningLoss)} MT
          </AlertDescription>
        </Alert>
      )}

      {isNormal && totalInput > 0 && (
        <Alert className="border-green-500">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Production Data Valid</AlertTitle>
          <AlertDescription>
            Burning Loss: {formatNumber(burningLoss)} MT ({formatNumber(burningLossPercent)}%)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
