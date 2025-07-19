import type { AnalyzeCompanyInsightsOutput, StockData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SentimentPieChart } from "./sentiment-pie-chart"
import { SentimentTrendChart } from "./sentiment-trend-chart"
import { KeyAspectsGrid } from "./key-aspects-grid"
import { Badge } from "./ui/badge"
import { Smile, Frown, Meh, Blend } from "lucide-react"
import { StockPriceChart } from "./stock-price-chart"
import { StockComparisonForm } from "./stock-comparison-form"
import { StockComparisonTable } from "./stock-comparison-table"

function OverallSentiment({ sentiment }: { sentiment: string }) {
    const sentimentConfig = {
        positive: {
            icon: <Smile className="w-10 h-10 text-green-500" />,
            text: "Overwhelmingly Positive",
            badge: "default" as const,
        },
        negative: {
            icon: <Frown className="w-10 h-10 text-red-500" />,
            text: "Overwhelmingly Negative",
            badge: "destructive" as const,
        },
        neutral: {
            icon: <Meh className="w-10 h-10 text-yellow-500" />,
            text: "Largely Neutral",
            badge: "secondary" as const,
        },
        mixed: {
            icon: <Blend className="w-10 h-10 text-blue-500" />,
            text: "Largely Mixed",
            badge: "outline" as const,
        },
    }

    const config = sentimentConfig[sentiment.toLowerCase() as keyof typeof sentimentConfig] || sentimentConfig.neutral

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overall Sentiment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 text-center">
                {config.icon}
                <p className="text-xl font-bold font-headline">{config.text}</p>
                <Badge variant={config.badge} className="capitalize">{sentiment}</Badge>
            </CardContent>
        </Card>
    )
}

export function InsightsDashboard({ analysis, comparisonAnalysis }: { analysis: AnalyzeCompanyInsightsOutput, comparisonAnalysis?: StockData[] }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analysis.stock && (
          <div className="lg:col-span-3">
            <StockPriceChart stock={analysis.stock} />
          </div>
        )}
        <div className="lg:col-span-2">
            <SentimentTrendChart trends={analysis.sentimentTrends} />
        </div>
        <div className="grid grid-rows-2 gap-6">
            <OverallSentiment sentiment={analysis.overallSentiment} />
            <SentimentPieChart trends={analysis.sentimentTrends} />
        </div>
      </div>
      <div>
        <KeyAspectsGrid aspects={analysis.keyAspects} />
      </div>
      <div className="space-y-6">
        <StockComparisonForm initialCompany={analysis.stock?.ticker} />
        {comparisonAnalysis && <StockComparisonTable stocks={comparisonAnalysis} />}
      </div>
    </div>
  )
}
