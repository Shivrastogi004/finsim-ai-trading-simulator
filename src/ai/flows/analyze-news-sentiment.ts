'use server';

/**
 * @fileOverview An AI agent that analyzes news sentiment and correlates it with stock price movements.
 *
 * - analyzeNewsSentiment - A function that handles the news sentiment analysis process.
 * - AnalyzeNewsSentimentInput - The input type for the analyzeNewsSentiment function.
 * - AnalyzeNewsSentimentOutput - The return type for the analyzeNewsSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsSentimentInputSchema = z.object({
  symbol: z.string().describe('The stock symbol to analyze.'),
});
export type AnalyzeNewsSentimentInput = z.infer<typeof AnalyzeNewsSentimentInputSchema>;

const AnalyzeNewsSentimentOutputSchema = z.object({
  sentimentScore: z.number().describe('The overall sentiment score from -1 to 1.'),
  correlation: z
    .number()
    .describe(
      'The correlation between news sentiment and stock price movements. A positive value indicates a positive correlation, while a negative value indicates a negative correlation.'
    ),
  explanation: z.string().describe('An explanation of the sentiment and its correlation to the stock.'),
});
export type AnalyzeNewsSentimentOutput = z.infer<typeof AnalyzeNewsSentimentOutputSchema>;

export async function analyzeNewsSentiment(
  input: AnalyzeNewsSentimentInput
): Promise<AnalyzeNewsSentimentOutput> {
  return analyzeNewsSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNewsSentimentPrompt',
  input: {schema: AnalyzeNewsSentimentInputSchema},
  output: {schema: AnalyzeNewsSentimentOutputSchema},
  prompt: `You are an expert financial analyst. You will analyze the recent news sentiment for a given stock and correlate it with recent stock price movements.

  Based on this information, determine the sentiment score and correlation.  If no news data or price movements, return a score of 0 and correlation of 0. Return the sentiment score from -1 to 1, and the correlation using the following:

  Sentiment Score:
  - -1: Very Negative
  - -0.5: Negative
  - 0: Neutral
  - 0.5: Positive
  - 1: Very Positive

  Correlation:
  - -1: Very Negative Correlation
  - -0.5: Negative Correlation
  - 0: No Correlation
  - 0.5: Positive Correlation
  - 1: Very Positive Correlation

  Symbol: {{{symbol}}}`,
});

const analyzeNewsSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeNewsSentimentFlow',
    inputSchema: AnalyzeNewsSentimentInputSchema,
    outputSchema: AnalyzeNewsSentimentOutputSchema,
  },
  async input => {
    // TODO: Call Finnhub API to get news sentiment and stock price data.
    // Calculate correlation and sentiment score.
    // You may call other flows or services to get this data

    const {output} = await prompt(input);
    // const {symbol} = input;

    // const apiKey = process.env.FINNHUB_API_KEY;

    // if (!apiKey) {
    //   throw new Error('Finnhub API key is missing. Please set the FINNHUB_API_KEY environment variable.');
    // }

    // Example usage of Finnhub API to fetch social sentiment data
    // const socialSentimentUrl = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${symbol}&token=${apiKey}`;
    // const socialSentimentResponse = await fetch(socialSentimentUrl);
    // const socialSentimentData = await socialSentimentResponse.json();
    // console.log(socialSentimentData);

    // Example usage of Finnhub API to fetch company news
    // const companyNewsUrl = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2023-01-01&to=2023-12-31&token=${apiKey}`;
    // const companyNewsResponse = await fetch(companyNewsUrl);
    // const companyNewsData = await companyNewsResponse.json();
    // console.log(companyNewsData);

    // const sentimentScore = 0;
    // const correlation = 0;
    // const explanation = `Sentiment analysis for ${symbol} is currently not fully implemented.`;

    // return {sentimentScore, correlation, explanation};

    return output!;
  }
);
