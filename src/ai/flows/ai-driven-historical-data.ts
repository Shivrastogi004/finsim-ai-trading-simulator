'use server';
/**
 * @fileOverview AI-driven historical data retrieval flow.
 *
 * - aiDrivenHistoricalData - A function that retrieves historical market data based on AI-selected sentiments.
 * - AIDrivenHistoricalDataInput - The input type for the aiDrivenHistoricalData function.
 * - AIDrivenHistoricalDataOutput - The return type for the aiDrivenHistoricalData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDrivenHistoricalDataInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  startDate: z.string().describe('The start date for historical data (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for historical data (YYYY-MM-DD).'),
  apiKey: z.string().describe('API Key for finnhub.'),
});
export type AIDrivenHistoricalDataInput = z.infer<typeof AIDrivenHistoricalDataInputSchema>;

const AIDrivenHistoricalDataOutputSchema = z.object({
  sentiment: z.string().describe('The sentiment to consider when fetching historical data.'),
  explanation: z.string().describe('Explanation of why the sentiment was chosen.'),
  data: z.any().describe('Historical market data with the specified sentiment.'),
});
export type AIDrivenHistoricalDataOutput = z.infer<typeof AIDrivenHistoricalDataOutputSchema>;

export async function aiDrivenHistoricalData(
  input: AIDrivenHistoricalDataInput
): Promise<AIDrivenHistoricalDataOutput> {
  return aiDrivenHistoricalDataFlow(input);
}

const sentimentSelectionPrompt = ai.definePrompt({
  name: 'sentimentSelectionPrompt',
  input: {schema: AIDrivenHistoricalDataInputSchema},
  output: {schema: z.object({sentiment: z.string(), explanation: z.string()})},
  prompt: `Given the ticker symbol {{ticker}}, start date {{startDate}}, and end date {{endDate}}, determine which market sentiment (positive, negative, or neutral) would be most relevant for analyzing historical stock data for potential trading strategies. Explain your choice.

Output format: { sentiment: "chosen_sentiment", explanation: "why it was chosen" }`,
});

const aiDrivenHistoricalDataFlow = ai.defineFlow(
  {
    name: 'aiDrivenHistoricalDataFlow',
    inputSchema: AIDrivenHistoricalDataInputSchema,
    outputSchema: AIDrivenHistoricalDataOutputSchema,
  },
  async input => {
    const {output: sentimentOutput} = await sentimentSelectionPrompt(input);
    if (!sentimentOutput) {
      throw new Error('Could not determine sentiment.');
    }

    try {
        const from = Math.floor(new Date(input.startDate).getTime() / 1000);
        const to = Math.floor(new Date(input.endDate).getTime() / 1000);
        const candleUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${input.ticker}&resolution=D&from=${from}&to=${to}&token=${input.apiKey}`;
        const candleResponse = await fetch(candleUrl);
        
        if (!candleResponse.ok) {
             const errorBody = await candleResponse.text();
             throw new Error(`Finnhub API request failed with status ${candleResponse.status}: ${errorBody}`);
        }

        const historicalData = await candleResponse.json();

        if (historicalData.s === 'no_data') {
            return {
                sentiment: sentimentOutput.sentiment,
                explanation: sentimentOutput.explanation,
                data: { error: `No historical data found for ticker ${input.ticker} in the specified date range.` },
            };
        }

        return {
          sentiment: sentimentOutput.sentiment,
          explanation: sentimentOutput.explanation,
          data: historicalData,
        };
    } catch(error: any) {
         return {
            sentiment: sentimentOutput.sentiment,
            explanation: sentimentOutput.explanation,
            data: { error: `An error occurred while fetching historical data: ${error.message}` },
        };
    }
  }
);
