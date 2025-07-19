'use server';

import { aggregateCompanyInsights } from '@/ai/flows/aggregate-company-insights';
import { analyzeCompanyInsights } from '@/ai/flows/analyze-company-insights';
import { getStockPrice } from '@/ai/flows/get-stock-price';
import type { AnalyzeCompanyInsightsOutput } from '@/lib/types';
import { z } from 'zod';

const FormSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
});

export interface FormState {
  message: string;
  analysis?: AnalyzeCompanyInsightsOutput;
  error?: boolean;
}

export async function getCompanyAnalysis(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    companyName: formData.get('companyName'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.companyName?.[0] || 'Invalid input.',
      error: true,
    };
  }

  const { companyName } = validatedFields.data;

  try {
    const [aggregatedResult, stockResult] = await Promise.allSettled([
        aggregateCompanyInsights({ companyName }),
        getStockPrice({ companyName }),
    ]);

    if (aggregatedResult.status === 'rejected' || !aggregatedResult.value.insights || aggregatedResult.value.insights.length < 50) {
        return { message: 'Could not find enough information about this company. Please try a different one.', error: true };
    }
    
    const analysis = await analyzeCompanyInsights({ companyName, insights: aggregatedResult.value.insights });

    if (stockResult.status === 'fulfilled') {
      analysis.stock = stockResult.value;
    } else {
      console.warn("Could not fetch stock price:", stockResult.reason)
    }

    return { message: 'Analysis complete.', analysis };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `An error occurred during analysis: ${errorMessage}. Please try again.`, error: true };
  }
}
