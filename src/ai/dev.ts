import { config } from 'dotenv';
config();

import '@/ai/flows/aggregate-company-insights.ts';
import '@/ai/flows/analyze-company-insights.ts';
import '@/ai/flows/get-stock-price.ts';
import '@/ai/flows/get-multi-stock-prices.ts';
