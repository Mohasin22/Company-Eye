import type { AnalyzeCompanyInsightsOutput } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SentimentPieChart } from "./sentiment-pie-chart"
import { SentimentTrendChart } from "./sentiment-trend-chart"
import { KeyAspectsGrid } from "./key-aspects-grid"
import { Badge } from "./ui/badge"
import { Smile, Frown, Meh } from "lucide-react"

function OverallSentiment({ sentiment }: { sentiment: string }) {
    const sentimentConfig = {
        positive: {
            icon: <Smile className="w-16 h-16 text-green-500" />,
            text: "Overwhelmingly Positive",
            badge: "default" as const,
        },
        negative: {
            icon: <Frown className="w-16 h-16 text-red-500" />,
            text: "Overwhelmingly Negative",
            badge: "destructive" as const,
        },
        neutral: {
            icon: <Meh className="w-16 h-16 text-yellow-500" />,
            text: "Largely Neutral",
            badge: "secondary" as const,
        },
    }

    const config = sentimentConfig[sentiment as keyof typeof sentimentConfig] || sentimentConfig.neutral

    return (
        <Card className="flex flex-col items-center justify-center text-center">
            <CardHeader>
                <CardTitle>Overall Sentiment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                {config.icon}
                <p className="text-2xl font-bold font-headline">{config.text}</p>
                <Badge variant={config.badge} className="capitalize">{sentiment}</Badge>
            </CardContent>
        </Card>
    )
}

export function InsightsDashboard({ analysis }: { analysis: AnalyzeCompanyInsightsOutput }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}
