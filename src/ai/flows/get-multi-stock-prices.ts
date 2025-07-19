'use server';
/**
 * @fileOverview A flow for fetching stock data for multiple companies.
 *
 * - getMultiStockPrices - A function that fetches stock data for a list of companies.
 * - GetMultiStockPricesInput - The input type for the getMultiStockPrices function.
 * - GetMultiStockPricesOutput - The return type for the getMultiStockPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { StockDataSchema } from '@/lib/types';
import { getStockPrice } from './get-stock-price';

const GetMultiStockPricesInputSchema = z.object({
  companyNames: z.array(z.string()).describe('The names of the companies.'),
});
export type GetMultiStockPricesInput = z.infer<typeof GetMultiStockPricesInputSchema>;

const GetMultiStockPricesOutputSchema = z.object({
  stocks: z.array(StockDataSchema).describe('A list of stock data for the requested companies.'),
});
export type GetMultiStockPricesOutput = z.infer<typeof GetMultiStockPricesOutputSchema>;


export async function getMultiStockPrices(input: GetMultiStockPricesInput): Promise<GetMultiStockPricesOutput> {
    return getMultiStockPricesFlow(input);
}


const getMultiStockPricesFlow = ai.defineFlow(
  {
    name: 'getMultiStockPricesFlow',
    inputSchema: GetMultiStockPricesInputSchema,
    outputSchema: GetMultiStockPricesOutputSchema,
  },
  async ({ companyNames }) => {
    const stockPromises = companyNames.map(companyName => getStockPrice({ companyName }));
    const results = await Promise.allSettled(stockPromises);
    
    const stocks = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<z.infer<typeof StockDataSchema>>).value);

    return { stocks };
  }
);
