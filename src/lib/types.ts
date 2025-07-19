import type { AnalyzeCompanyInsightsOutput as AIOutput } from '@/ai/flows/analyze-company-insights';
import { z } from 'zod';

export const StockDataSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol.'),
  price: z.number().describe('The current stock price.'),
  currency: z.string().describe('The currency of the stock price.'),
  change: z.number().describe('The change in stock price.'),
  changePercent: z.number().describe('The percentage change in stock price.'),
  dayHigh: z.number().describe("The stock's highest price for the day."),
  dayLow: z.number().describe("The stock's lowest price for the day."),
  marketCap: z.string().describe('The market capitalization of the company.'),
  historical: z.array(z.object({ time: z.string(), price: z.number() })).describe('Historical price data for the day.'),
});

export type AnalyzeCompanyInsightsOutput = Omit<AIOutput, 'overallSentiment'> & {
    overallSentiment: string;
};
export type Trend = AIOutput['sentimentTrends'][number];
export type KeyAspect = AIOutput['keyAspects'][number];
export type StockData = z.infer<typeof StockDataSchema>;
