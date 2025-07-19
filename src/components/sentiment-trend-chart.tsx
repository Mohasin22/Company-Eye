'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { Trend } from "@/lib/types"

const chartConfig = {
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-2))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--chart-5))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function SentimentTrendChart({ trends }: { trends: Trend[] }) {
    const processedData = trends.reduce((acc, trend) => {
        let aspectEntry = acc.find(item => item.aspect === trend.aspect);
        if (!aspectEntry) {
            aspectEntry = { aspect: trend.aspect, positive: 0, negative: 0, neutral: 0 };
            acc.push(aspectEntry);
        }
        aspectEntry[trend.sentiment] = trend.occurrences;
        return acc;
    }, [] as Array<{ aspect: string; positive: number; negative: number; neutral: number }>);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Aspect Sentiment Analysis</CardTitle>
        <CardDescription>Sentiment occurrences for key company aspects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={processedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="aspect"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="positive" stackId="a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="neutral" stackId="a" />
            <Bar dataKey="negative" stackId="a" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
