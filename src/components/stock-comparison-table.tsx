'use client';

import type { StockData } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StockComparisonTable({ stocks }: { stocks: StockData[] }) {
  if (stocks.length === 0) {
    return <p className="text-muted-foreground text-center p-4">No data available for the requested companies.</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Metric</TableHead>
            {stocks.map(stock => (
              <TableHead key={stock.ticker} className="text-right font-semibold">{stock.ticker}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Price</TableCell>
            {stocks.map(stock => (
              <TableCell key={stock.ticker} className="text-right font-mono">{stock.price.toFixed(2)} {stock.currency}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Change</TableCell>
            {stocks.map(stock => {
              const isPositive = stock.change >= 0;
              return (
                <TableCell key={stock.ticker} className={cn("text-right font-mono flex items-center justify-end gap-1", isPositive ? "text-green-500" : "text-red-500")}>
                  {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </TableCell>
              );
            })}
          </TableRow>
           <TableRow>
            <TableCell>Day High</TableCell>
            {stocks.map(stock => (
              <TableCell key={stock.ticker} className="text-right font-mono">{stock.dayHigh.toFixed(2)}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Day Low</TableCell>
            {stocks.map(stock => (
              <TableCell key={stock.ticker} className="text-right font-mono">{stock.dayLow.toFixed(2)}</TableCell>
            ))}
          </TableRow>
           <TableRow>
            <TableCell>Market Cap</TableCell>
            {stocks.map(stock => (
              <TableCell key={stock.ticker} className="text-right font-mono">{stock.marketCap}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
