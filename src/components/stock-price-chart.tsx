'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ArrowDown, ArrowUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { StockData } from "@/lib/types"
import { cn } from "@/lib/utils"

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function StockPriceChart({ stock }: { stock: StockData }) {
  const isPositive = stock.change >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle>Stock Performance ({stock.ticker})</CardTitle>
                <CardDescription>Simulated day-trading data</CardDescription>
            </div>
            <div className="text-right">
                <p className="text-3xl font-bold font-headline">
                    {stock.price.toFixed(2)}
                    <span className="text-lg ml-2 text-muted-foreground">{stock.currency}</span>
                </p>
                <div className={cn("flex items-center justify-end gap-1 text-sm", isPositive ? "text-green-500" : "text-red-500")}>
                    {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%) Today</span>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart
            data={stock.historical}
            margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
            >
            <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "var(--color-price)" : "hsl(var(--chart-5))"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={isPositive ? "var(--color-price)" : "hsl(var(--chart-5))"} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => index % 4 === 0 ? value : ''}
            />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
            <ChartTooltip
                cursor={{stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '3 3'}}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke={isPositive ? "var(--color-price)" : "hsl(var(--chart-5))"}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
