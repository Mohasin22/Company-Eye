'use server';

import { aggregateCompanyInsights } from '@/ai/flows/aggregate-company-insights';
import { analyzeCompanyInsights } from '@/ai/flows/analyze-company-insights';
import { getStockPrice } from '@/ai/flows/get-stock-price';
import type { AnalyzeCompanyInsightsOutput, StockData } from '@/lib/types';
import { z } from 'zod';

const FormSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
});

export interface FormState {
  message: string;
  analysis?: AnalyzeCompanyInsightsOutput;
  comparisonAnalysis?: StockData[];
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

const ComparisonFormSchema = z.object({
  companyNames: z.array(z.string().min(2, { message: 'Company name must be at least 2 characters.' })).min(1, { message: 'Please enter at least one company name.' }),
});

export async function getStockComparison(prevState: FormState, formData: FormData): Promise<FormState> {
    const companyNames = formData.getAll('companyNames[]').map(String);
    const validatedFields = ComparisonFormSchema.safeParse({ companyNames });
    
    if (!validatedFields.success) {
        return {
        ...prevState,
        message: validatedFields.error.flatten().fieldErrors.companyNames?.[0] || 'Invalid input.',
        error: true,
        };
    }
    
    try {
        const stockResults = await Promise.allSettled(
            companyNames.map(companyName => getStockPrice({ companyName }))
        );
    
        const comparisonAnalysis: StockData[] = stockResults.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.warn(`Could not fetch stock price for ${companyNames[index]}:`, result.reason);
                // Return a placeholder or error object if a fetch fails
                return { 
                    ticker: `${companyNames[index].substring(0,4).toUpperCase()}`,
                    price: 0,
                    change: 0,
                    changePercent: 0,
                    currency: 'USD',
                    dayHigh: 0,
                    dayLow: 0,
                    marketCap: 'N/A',
                    historical: [],
                    error: `Could not fetch data for ${companyNames[index]}`,
                };
            }
        });
    
        return { ...prevState, message: 'Comparison complete.', comparisonAnalysis };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { ...prevState, message: `An error occurred during comparison: ${errorMessage}. Please try again.`, error: true };
    }
}
