'use client'

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"

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
  sentiment: {
    label: "Sentiment",
  },
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

export function SentimentPieChart({ trends }: { trends: Trend[] }) {
  const sentimentCounts = trends.reduce((acc, trend) => {
    acc[trend.sentiment] = (acc[trend.sentiment] || 0) + trend.occurrences
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    sentiment,
    count,
    fill: chartConfig[sentiment as keyof typeof chartConfig]?.color || 'hsl(var(--muted))'
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Sentiment Breakdown</CardTitle>
        <CardDescription>Overall distribution of sentiment</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="sentiment"
              innerRadius={60}
              strokeWidth={5}
            >
               {chartData.map((entry) => (
                <Cell key={`cell-${entry.sentiment}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend
                content={<ChartLegendContent nameKey="sentiment" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
