import type { AnalyzeCompanyInsightsOutput as AIOutput } from '@/ai/flows/analyze-company-insights';

export type AnalyzeCompanyInsightsOutput = AIOutput;
export type Trend = AIOutput['sentimentTrends'][number];
export type KeyAspect = AIOutput['keyAspects'][number];
