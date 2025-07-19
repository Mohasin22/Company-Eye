'use server';

import { aggregateCompanyInsights } from '@/ai/flows/aggregate-company-insights';
import { analyzeCompanyInsights } from '@/ai/flows/analyze-company-insights';
import { getStockPrice } from '@/ai/flows/get-stock-price';
import { getMultiStockPrices } from '@/ai/flows/get-multi-stock-prices';
import type { AnalyzeCompanyInsightsOutput, StockData } from '@/lib/types';
import { z } from 'zod';

const FormSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
});

const ComparisonFormSchema = z.object({
    companyNames: z.string().min(2, { message: 'Please enter at least one company name.' }),
});

export interface FormState {
  message: string;
  analysis?: AnalyzeCompanyInsightsOutput;
  error?: boolean;
}

export interface ComparisonFormState {
    message: string;
    comparison?: StockData[];
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
    
    let stockData: StockData | undefined = undefined;
    if (stockResult.status === 'fulfilled') {
      stockData = stockResult.value;
    } else {
      console.warn("Could not fetch stock price:", stockResult.reason)
    }

    const analysis = await analyzeCompanyInsights({ 
      companyName, 
      insights: aggregatedResult.value.insights,
      stock: stockData
    });

    return { message: 'Analysis complete.', analysis };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `An error occurred during analysis: ${errorMessage}. Please try again.`, error: true };
  }
}

export async function getStockComparison(prevState: ComparisonFormState, formData: FormData): Promise<ComparisonFormState> {
    const validatedFields = ComparisonFormSchema.safeParse({
        companyNames: formData.get('companyNames'),
    });

    if (!validatedFields.success) {
        return {
            message: validatedFields.error.flatten().fieldErrors.companyNames?.[0] || 'Invalid input.',
            error: true,
        };
    }

    const { companyNames } = validatedFields.data;
    const companyNameList = companyNames.split(',').map(name => name.trim()).filter(Boolean);

    if (companyNameList.length === 0) {
        return { message: 'Please enter at least one company name.', error: true };
    }

    try {
        const { stocks } = await getMultiStockPrices({ companyNames: companyNameList });
        return { message: 'Comparison complete.', comparison: stocks };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { message: `An error occurred during comparison: ${errorMessage}. Please try again.`, error: true };
    }
}
