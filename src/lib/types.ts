import type { AnalyzeCompanyInsightsOutput as AIOutput, StockDataSchema } from '@/ai/flows/analyze-company-insights';
import type { z } from 'zod';

export type AnalyzeCompanyInsightsOutput = AIOutput;
export type Trend = AIOutput['sentimentTrends'][number];
export type KeyAspect = AIOutput['keyAspects'][number];
export type StockData = z.infer<typeof StockDataSchema>;
