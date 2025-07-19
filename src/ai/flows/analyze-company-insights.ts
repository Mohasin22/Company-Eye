'use server';

/**
 * @fileOverview A flow for analyzing company insights to determine sentiment, trends, and key aspects.
 *
 * - analyzeCompanyInsights - A function that analyzes company insights.
 * - AnalyzeCompanyInsightsInput - The input type for the analyzeCompanyInsights function.
 * - AnalyzeCompanyInsightsOutput - The return type for the analyzeCompanyInsights function.
 */

import {ai} from '@/ai/genkit';
import { StockDataSchema } from '@/lib/types';
import {z} from 'genkit';

const AnalyzeCompanyInsightsInputSchema = z.object({
  companyName: z.string().describe('The name of the company to analyze.'),
  insights: z.string().describe('The aggregated insights about the company.'),
  stock: StockDataSchema.optional().describe('The stock data for the company.'),
});
export type AnalyzeCompanyInsightsInput = z.infer<
  typeof AnalyzeCompanyInsightsInputSchema
>;

const SentimentSchema = z.enum(['positive', 'negative', 'neutral', 'mixed']);

const TrendSchema = z.object({
  aspect: z.string().describe('The aspect of the company being discussed.'),
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The sentiment expressed about the aspect.'),
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
  input: {schema: AnalyzeCompanyInsightsInputSchema.pick({ companyName: true, insights: true })},
  output: {schema: AnalyzeCompanyInsightsOutputSchema.pick({ overallSentiment: true, sentimentTrends: true, keyAspects: true })},
  prompt: `You are an AI analyst specializing in understanding company user feedback.

You are given aggregated insights about a company.

Analyze the insights for overall sentiment, trends, and key aspects.

Company Name: {{{companyName}}}
Insights: {{{insights}}}

Consider these instructions when producing the output:
- sentimentTrends: determine the trend of the sentiment for a particular aspect of the company.
- keyAspects: identify the key aspects that the insights are talking about.
- overallSentiment: Calculate the overall sentiment based on the sentimentTrends. To do this, sum the occurrences for positive, negative, and neutral sentiments across all trends. 
  - If positive occurrences are significantly higher than negative, the overall sentiment is 'positive'.
  - If negative occurrences are significantly higher than positive, it's 'negative'.
  - If positive and negative are very close, the sentiment is 'mixed'.
  - Otherwise, it's 'neutral'.

Output should be structured as a JSON object.
`,
});

const analyzeCompanyInsightsFlow = ai.defineFlow(
  {
    name: 'analyzeCompanyInsightsFlow',
    inputSchema: AnalyzeCompanyInsightsInputSchema,
    outputSchema: AnalyzeCompanyInsightsOutputSchema,
  },
  async input => {
    const {output} = await analyzeCompanyInsightsPrompt(input);

    if (!output) {
      throw new Error("Could not analyze company insights.");
    }
    
    return {
        ...output,
        stock: input.stock,
    };
  }
);
