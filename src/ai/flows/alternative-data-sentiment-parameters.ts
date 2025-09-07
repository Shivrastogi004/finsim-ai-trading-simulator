'use server';
/**
 * @fileOverview This flow uses alternative data (news headlines) to perform sentiment analysis and make trading decisions.
 *
 * - getSentimentBasedDecision - A function that takes a stock symbol, fetches news headlines, analyzes sentiment, and returns a trading decision.
 * - SentimentAnalysisInput - The input type for the getSentimentBasedDecision function.
 * - SentimentAnalysisOutput - The return type for the getSentimentBasedDecision function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentAnalysisInputSchema = z.object({
  symbol: z.string().describe('The stock symbol to analyze.'),
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentAnalysisOutputSchema = z.object({
  tradeDecision: z
    .string()
    .describe(
      'A trading decision (buy, sell, or hold) based on the sentiment analysis of news headlines.'
    ),
  explanation: z.string().describe('Explanation of why the trading decision was made.'),
});
export type SentimentAnalysisOutput = z.infer<typeof SentimentAnalysisOutputSchema>;

export async function getSentimentBasedDecision(
  input: SentimentAnalysisInput
): Promise<SentimentAnalysisOutput> {
  return alternativeDataSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'alternativeDataSentimentPrompt',
  input: {schema: SentimentAnalysisInputSchema},
  output: {schema: SentimentAnalysisOutputSchema},
  prompt: `You are an AI-powered trading strategy assistant. 

Based on the provided stock symbol, you will fetch the latest news headlines, analyze the sentiment of these headlines, and provide a trading decision. 

Consider using multiple parameters before making decisions so that it is robust and fit.

Stock Symbol: {{{symbol}}}

Based on the news sentiment, provide a trade decision (buy, sell, or hold) and explain the reasoning behind your decision. Be sure to provide a human readable explanation to go along with your descision.
`,
});

const alternativeDataSentimentFlow = ai.defineFlow(
  {
    name: 'alternativeDataSentimentFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
