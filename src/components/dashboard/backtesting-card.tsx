
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, TestTube2 } from "lucide-react";
import { backtestWithProfitFeatures } from "@/ai/flows/backtest-with-profit-features";
import { useToast } from "@/hooks/use-toast";
import { BacktestResultDisplay } from "./backtest-result-display";

export function BacktestingCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    backtestResults: string;
    suggestedFeatures: string;
  } | null>(null);
  const { toast } = useToast();

  const handleBacktest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const strategy = formData.get("strategy") as string;
    const stock = formData.get("stock") as string;

    try {
      const res = await backtestWithProfitFeatures({
        strategyDefinition: `${strategy} for ${stock}`,
        historicalData: "Fetch from 2023-01-01 to 2024-01-01",
        apiKey: "d2u7551r01qo4hodtv10d2u7551r01qo4hodtv1g",
      });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error running backtest",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card id="tour-step-1" className="flex flex-col transition-all hover:shadow-lg">
        <form onSubmit={handleBacktest} className="flex flex-col flex-grow">
          <CardHeader>
            <CardTitle>Strategy Backtesting</CardTitle>
            <CardDescription>
              Test your strategies against historical market data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 flex-grow">
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" defaultValue="AAPL" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select name="strategy" defaultValue="moving-average-crossover">
                <SelectTrigger id="tour-step-2">
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moving-average-crossover">
                    Moving Average Crossover
                  </SelectItem>
                  <SelectItem value="rsi-strategy">RSI Strategy</SelectItem>
                  <SelectItem value="bollinger-bands">
                    Bollinger Bands
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading} id="tour-step-3">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Backtest
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div id="tour-step-5">
        {loading && (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Generating Results...</CardTitle>
                    <CardDescription>The AI is analyzing your strategy. Please wait.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-16">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </CardContent>
            </Card>
        )}
        {result && (
            <div className="mt-8 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TestTube2 className="h-5 w-5 text-primary"/> Backtest Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {result.backtestResults}
                        </p>
                    </CardContent>
                </Card>

                <BacktestResultDisplay suggestedFeatures={result.suggestedFeatures} />
            </div>
        )}
      </div>
    </>
  );
}
