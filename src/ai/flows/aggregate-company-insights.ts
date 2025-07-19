'use server';

/**
 * @fileOverview Aggregates company insights from the web using an AI tool.
 *
 * - aggregateCompanyInsights - A function that handles the aggregation of company insights.
 * - AggregateCompanyInsightsInput - The input type for the aggregateCompanyInsights function.
 * - AggregateCompanyInsightsOutput - The return type for the aggregateCompanyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AggregateCompanyInsightsInputSchema = z.object({
  companyName: z.string().describe('The name of the software company to analyze.'),
});
export type AggregateCompanyInsightsInput = z.infer<typeof AggregateCompanyInsightsInputSchema>;

const AggregateCompanyInsightsOutputSchema = z.object({
  insights: z.string().describe('Aggregated insights about the company from the web.'),
});
export type AggregateCompanyInsightsOutput = z.infer<typeof AggregateCompanyInsightsOutputSchema>;

export async function aggregateCompanyInsights(input: AggregateCompanyInsightsInput): Promise<AggregateCompanyInsightsOutput> {
  return aggregateCompanyInsightsFlow(input);
}

const aggregateCompanyInsightsPrompt = ai.definePrompt({
  name: 'aggregateCompanyInsightsPrompt',
  input: {schema: AggregateCompanyInsightsInputSchema},
  output: {schema: AggregateCompanyInsightsOutputSchema},
  prompt: `You are an AI assistant tasked with aggregating insights about software companies from the web.

  Based on the company name provided, search the web and gather relevant information about the company's public sentiment and key themes.

  Company Name: {{{companyName}}}

  Aggregated Insights:`,
});

const aggregateCompanyInsightsFlow = ai.defineFlow(
  {
    name: 'aggregateCompanyInsightsFlow',
    inputSchema: AggregateCompanyInsightsInputSchema,
    outputSchema: AggregateCompanyInsightsOutputSchema,
  },
  async input => {
    const {output} = await aggregateCompanyInsightsPrompt(input);
    return output!;
  }
);
