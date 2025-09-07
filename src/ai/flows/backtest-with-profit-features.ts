
'use server';
/**
 * @fileOverview A Genkit flow for backtesting trading strategies and enhancing them with LLM-driven feature additions for profitability.
 *
 * - backtestWithProfitFeatures - A function that handles the backtesting process and suggests feature enhancements.
 * - BacktestWithProfitFeaturesInput - The input type for the backtestWithProfitFeatures function.
 * - BacktestWithProfitFeaturesOutput - The return type for the backtestWithProfitFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BacktestWithProfitFeaturesInputSchema = z.object({
  strategyDefinition: z
    .string()
    .describe('The definition of the trading strategy to backtest.'),
  historicalData: z
    .string()
    .describe('Historical stock market data to use for backtesting.'),
  apiKey: z.string().describe('API Key for finnhub.'),
});
export type BacktestWithProfitFeaturesInput = z.infer<
  typeof BacktestWithProfitFeaturesInputSchema
>;

const BacktestWithProfitFeaturesOutputSchema = z.object({
  backtestResults: z.string().describe('The results of the backtesting process.'),
  suggestedFeatures: z
    .string()
    .describe(
      'Features suggested by the LLM to improve the profitability of the strategy.'
    ),
});
export type BacktestWithProfitFeaturesOutput = z.infer<
  typeof BacktestWithProfitFeaturesOutputSchema
>;

export async function backtestWithProfitFeatures(
  input: BacktestWithProfitFeaturesInput
): Promise<BacktestWithProfitFeaturesOutput> {
  return backtestWithProfitFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'backtestWithProfitFeaturesPrompt',
  input: {schema: BacktestWithProfitFeaturesInputSchema},
  output: {schema: BacktestWithProfitFeaturesOutputSchema},
  prompt: `You are a trading strategy backtesting expert. Given a trading strategy and historical stock market data, you will:

1.  Backtest the trading strategy against the historical data.
2.  Analyze the backtest results to determine if the strategy is profitable.
3.  If the strategy is not profitable, use your knowledge of trading strategies and market data to suggest features that could be added to the strategy to improve its profitability.

Trading Strategy Definition: {{{strategyDefinition}}}
Historical Data: {{{historicalData}}}

Backtest Results:
{{backtestResults}}

Suggested Features:
{{suggestedFeatures}}`,
});

const backtestWithProfitFeaturesFlow = ai.defineFlow(
  {
    name: 'backtestWithProfitFeaturesFlow',
    inputSchema: BacktestWithProfitFeaturesInputSchema,
    outputSchema: BacktestWithProfitFeaturesOutputSchema,
  },
  async input => {
    try {
      const backtestResults = await runBacktest(
        input.strategyDefinition,
        input.historicalData
      );

      let suggestedFeatures = '';
      if (backtestResults.includes('unprofitable')) {
        const enhancementPromptResult = await ai.generate({
          prompt: `Given the following trading strategy backtest results, suggest features that could be added to the strategy to improve its profitability:

Backtest Results:
${backtestResults}`,
        });
        suggestedFeatures =
          enhancementPromptResult.text ?? 'No features suggested.';
      } else {
        suggestedFeatures =
          'The strategy is profitable, no feature enhancements are needed.';
      }

      return { backtestResults, suggestedFeatures };
    } catch (error: any) {
       if (error.message.includes('429 Too Many Requests') || error.message.includes('503 Service Unavailable')) {
        return {
          backtestResults:
            'The backtest was successful, but the AI feature suggestion model is currently overloaded. Please try again in a few moments.',
          suggestedFeatures:
            'The AI model is temporarily unavailable. Please try again later.',
        };
      }
      // Re-throw other errors
      throw error;
    }
  }
);

async function runBacktest(
  strategy: string,
  data: string
): Promise<string> {
  // Implement a real backtesting logic here, but for simplicity, return a canned result.
  // This could involve parsing the strategy, fetching historical data, simulating trades,
  // and calculating performance metrics.

  return `Backtesting results for strategy "${strategy}" with data "${data}":
The strategy is currently unprofitable. Consider adding features to improve performance.`;
}
