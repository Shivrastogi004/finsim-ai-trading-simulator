
'use server';

/**
 * @fileOverview A flow to provide explainable AI signals for trading.
 *
 * - explainableAISignals - A function that generates buy/sell signals with human-readable explanations.
 * - ExplainableAISignalsInput - The input type for the explainableAISignals function.
 * - ExplainableAISignalsOutput - The return type for the explainableAISignals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainableAISignalsInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  strategy: z.string().describe('The trading strategy being used.'),
  historicalData: z.string().describe('Historical market data as a JSON string.'),
  sentimentScore: z.number().describe('Sentiment score from alternative data sources.'),
});
export type ExplainableAISignalsInput = z.infer<typeof ExplainableAISignalsInputSchema>;

const ExplainableAISignalsOutputSchema = z.object({
  signal: z.string().describe('The buy/sell signal (buy, sell, or hold).'),
  explanation: z.string().describe('A human-readable explanation of the signal.'),
});
export type ExplainableAISignalsOutput = z.infer<typeof ExplainableAISignalsOutputSchema>;

export async function explainableAISignals(input: ExplainableAISignalsInput): Promise<ExplainableAISignalsOutput> {
  return explainableAISignalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainableAISignalsPrompt',
  input: {schema: ExplainableAISignalsInputSchema},
  output: {schema: ExplainableAISignalsOutputSchema},
  prompt: `You are an AI trading signal generator that provides clear, human-readable explanations for each signal.

  Based on the following information, generate a buy, sell, or hold signal and explain your reasoning:

  Ticker Symbol: {{{ticker}}}
  Trading Strategy: {{{strategy}}}
  Historical Market Data: {{{historicalData}}}
  Sentiment Score: {{{sentimentScore}}}

  Consider the trading strategy, historical data, and sentiment score to arrive at a well-reasoned signal.  The explanation should be understandable by a non-expert.

  Signal:`, // the LLM is expected to return buy, sell, or hold as the 'signal'.
});

const explainableAISignalsFlow = ai.defineFlow(
  {
    name: 'explainableAISignalsFlow',
    inputSchema: ExplainableAISignalsInputSchema,
    outputSchema: ExplainableAISignalsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      if (error.message.includes('429 Too Many Requests') || error.message.includes('503 Service Unavailable')) {
        return {
          signal: 'Unavailable',
          explanation: 'The AI model is currently overloaded or you have exceeded your quota. Please try again in a few moments.',
        };
      }
      // Re-throw other errors
      throw error;
    }
  }
);
