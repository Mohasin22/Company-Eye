'use server';

/**
 * @fileOverview A flow for analyzing company insights to determine sentiment, trends, and key aspects.
 *
 * - analyzeCompanyInsights - A function that analyzes company insights.
 * - AnalyzeCompanyInsightsInput - The input type for the analyzeCompanyInsights function.
 * - AnalyzeCompanyInsightsOutput - The return type for the analyzeCompanyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const AnalyzeCompanyInsightsInputSchema = z.object({
  companyName: z.string().describe('The name of the company to analyze.'),
  insights: z.string().describe('The aggregated insights about the company.'),
});
export type AnalyzeCompanyInsightsInput = z.infer<
  typeof AnalyzeCompanyInsightsInputSchema
>;

const SentimentSchema = z.enum(['positive', 'negative', 'neutral']);

const TrendSchema = z.object({
  aspect: z.string().describe('The aspect of the company being discussed.'),
  sentiment: SentimentSchema.describe('The sentiment expressed about the aspect.'),
  occurrences: z.number().describe('The number of times this sentiment was expressed.'),
});

const KeyAspectSchema = z.object({
  aspect: z.string().describe('The key aspect of the company.'),
  description: z.string().describe('A summary of user perceptions of this aspect.'),
});

const AnalyzeCompanyInsightsOutputSchema = z.object({
  overallSentiment: SentimentSchema.describe(
    'The overall sentiment towards the company.'
  ),
  sentimentTrends: z
    .array(TrendSchema)
    .describe('Trends in sentiment for different aspects of the company.'),
  keyAspects: z
    .array(KeyAspectSchema)
    .describe('Key aspects of the company and user perceptions.'),
  stock: StockDataSchema.optional().describe('The stock data for the company.'),
});
export type AnalyzeCompanyInsightsOutput = z.infer<
  typeof AnalyzeCompanyInsightsOutputSchema
>;

export async function analyzeCompanyInsights(
  input: AnalyzeCompanyInsightsInput
): Promise<AnalyzeCompanyInsightsOutput> {
  return analyzeCompanyInsightsFlow(input);
}

const analyzeCompanyInsightsPrompt = ai.definePrompt({
  name: 'analyzeCompanyInsightsPrompt',
  input: {schema: AnalyzeCompanyInsightsInputSchema},
  output: {schema: AnalyzeCompanyInsightsOutputSchema.pick({ overallSentiment: true, sentimentTrends: true, keyAspects: true })},
  prompt: `You are an AI analyst specializing in understanding company user feedback.

You are given aggregated insights about a company.

Analyze the insights for overall sentiment, trends, and key aspects.

Company Name: {{{companyName}}}
Insights: {{{insights}}}

Consider these instructions when producing the output:
- sentimentTrends: determine the trend of the sentiment for a particular aspect of the company.
- keyAspects: identify the key aspects that the insights are talking about.
- overallSentiment: Calculate the overall sentiment based on the sentimentTrends. To do this, sum the occurrences for positive, negative, and neutral sentiments across all trends. If positive occurrences are highest, the overall sentiment is 'positive'. If negative is highest, it's 'negative'. Otherwise, it's 'neutral'.

Output should be structured as a JSON object.
`,
});

const analyzeCompanyInsightsFlow = ai.defineFlow(
  {
    name: 'analyzeCompanyInsightsFlow',
    inputSchema: AnalyzeCompanyInsightsInputSchema,
    outputSchema: AnalyzeCompanyInsightsOutputSchema.pick({ overallSentiment: true, sentimentTrends: true, keyAspects: true }),
  },
  async input => {
    const {output} = await analyzeCompanyInsightsPrompt(input);
    return output!;
  }
);
