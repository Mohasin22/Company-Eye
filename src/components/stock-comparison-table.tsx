
'use client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StockData } from "@/lib/types"
import { ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"


function StockRow({ stock }: { stock: StockData & { error?: string } }) {
    if (stock.error) {
        return (
            <TableRow>
                <TableCell className="font-medium">{stock.ticker}</TableCell>
                <TableCell colSpan={5} className="text-center text-muted-foreground">{stock.error}</TableCell>
            </TableRow>
        )
    }

    const isPositive = stock.change >= 0;
    return (
        <TableRow>
            <TableCell className="font-medium">{stock.ticker}</TableCell>
            <TableCell>{stock.price.toFixed(2)} {stock.currency}</TableCell>
            <TableCell className={cn(isPositive ? "text-green-500" : "text-red-500", "flex items-center gap-1")}>
                {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </TableCell>
            <TableCell>{stock.dayLow.toFixed(2)}</TableCell>
            <TableCell>{stock.dayHigh.toFixed(2)}</TableCell>
            <TableCell>{stock.marketCap}</TableCell>
        </TableRow>
    )
}

export function StockComparisonTable({ stocks }: { stocks: Array<StockData & { error?: string }> }) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Stock Comparison Results</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableCaption>Simulated stock market data for comparison.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ticker</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Day Low</TableHead>
                        <TableHead>Day High</TableHead>
                        <TableHead>Market Cap</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock) => (
                        <StockRow key={stock.ticker} stock={stock} />
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
