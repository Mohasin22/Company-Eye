'use server';
/**
 * @fileOverview A flow for fetching stock data for a given company.
 *
 * - getStockPrice - A function that fetches stock data.
 * - GetStockPriceInput - The input type for the getStockPrice function.
 * - GetStockPriceOutput - The return type for the getStockPrice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { StockDataSchema } from './analyze-company-insights';

export type StockData = z.infer<typeof StockDataSchema>;

const GetStockPriceInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
});
export type GetStockPriceInput = z.infer<typeof GetStockPriceInputSchema>;

const GetStockPriceOutputSchema = StockDataSchema;
export type GetStockPriceOutput = z.infer<typeof GetStockPriceOutputSchema>;

const getCompanyTicker = ai.defineTool(
  {
    name: 'getCompanyTicker',
    description: 'Get the stock ticker for a company. Returns a common ticker, not exchange-specific.',
    inputSchema: z.object({ companyName: z.string() }),
    outputSchema: z.string(),
  },
  async ({ companyName }) => {
    // In a real app, you'd use an API to find the ticker.
    // Here we'll simulate it.
    const name = companyName.toLowerCase();
    if (name.includes('google') || name.includes('alphabet')) return 'GOOGL';
    if (name.includes('microsoft')) return 'MSFT';
    if (name.includes('apple')) return 'AAPL';
    if (name.includes('meta') || name.includes('facebook')) return 'META';
    if (name.includes('amazon')) return 'AMZN';
    if (name.includes('netflix')) return 'NFLX';
    if (name.includes('tesla')) return 'TSLA';
    if (name.includes('vercel')) return 'VCL'; // Not a real ticker
    if (name.includes('openai')) return 'OPAI'; // Not a real ticker
    return `${companyName.substring(0, 4).toUpperCase()}`;
  }
);

const getStockData = ai.defineTool(
  {
    name: 'getStockData',
    description: "Get the current stock price data and historical data for a given ticker symbol. This is a simulation and does not return real-time data.",
    inputSchema: z.object({ ticker: z.string() }),
    outputSchema: StockDataSchema,
  },
  async ({ ticker }) => {
    // This is a simulation of a stock data API.
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * 10;
    const price = basePrice + change;
    const changePercent = (change / basePrice) * 100;

    const historical = Array.from({ length: 24 }, (_, i) => {
      const time = `${String(9 + Math.floor(i/2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
      const price = basePrice + (Math.random() - 0.5) * 5 + (i/24) * change;
      return { time, price: parseFloat(price.toFixed(2)) };
    });

    return {
      ticker,
      price: parseFloat(price.toFixed(2)),
      currency: 'USD',
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      dayHigh: parseFloat(Math.max(...historical.map(p => p.price), price).toFixed(2)),
      dayLow: parseFloat(Math.min(...historical.map(p => p.price), price).toFixed(2)),
      marketCap: `${(Math.random() * 2 + 0.5).toFixed(2)}T`,
      historical,
    };
  }
);

export async function getStockPrice(input: GetStockPriceInput): Promise<GetStockPriceOutput> {
  return getStockPriceFlow(input);
}

const getStockPriceFlow = ai.defineFlow(
  {
    name: 'getStockPriceFlow',
    inputSchema: GetStockPriceInputSchema,
    outputSchema: GetStockPriceOutputSchema,
    tools: [getCompanyTicker, getStockData],
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Get the stock price for ${input.companyName}. First find the ticker, then get the stock data.`,
      model: 'googleai/gemini-2.0-flash',
      tools: [getCompanyTicker, getStockData],
      output: {
        schema: GetStockPriceOutputSchema,
      }
    });

    if (!output) {
      throw new Error("Could not retrieve stock data.");
    }
    return output;
  }
);
