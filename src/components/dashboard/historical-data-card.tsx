
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
import { Loader2, Bot, Info, History } from "lucide-react";
import { aiDrivenHistoricalData } from "@/ai/flows/ai-driven-historical-data";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export function HistoricalDataCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    sentiment: string;
    explanation: string;
    data: any;
  } | null>(null);
  const { toast } = useToast();

  const handleFetchData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const ticker = formData.get("ticker") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    try {
      const res = await aiDrivenHistoricalData({
        ticker,
        startDate,
        endDate,
        apiKey: "d2u7551r01qo4hodtv10d2u7551r01qo4hodtv1g",
      });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg" id="tour-hd-1">
      <form onSubmit={handleFetchData} className="flex flex-col flex-grow">
        <CardHeader>
          <CardTitle>Get AI-Driven Historical Data</CardTitle>
          <CardDescription>
            Fetch historical data with AI-selected sentiment analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="tour-hd-2">
            <div className="grid gap-2">
              <Label htmlFor="ticker">Stock Ticker</Label>
              <Input id="ticker" name="ticker" defaultValue="TSLA" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue="2023-01-01" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue="2023-12-31" />
            </div>
          </div>
          {loading && (
             <div className="mt-4 flex justify-center items-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
          )}
          {result && (
            <div className="mt-4 space-y-4 rounded-lg border bg-secondary/50 p-4 text-sm" id="tour-hd-4">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" /> AI Sentiment Analysis
                </h4>
                <p className="text-muted-foreground">
                  Sentiment: <span className="font-medium text-foreground">{result.sentiment}</span>
                </p>
                <p className="text-muted-foreground mt-2">
                  {result.explanation}
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Historical Data
                </h4>
                <div className="text-muted-foreground mt-2 p-4 bg-background rounded-md max-h-60 overflow-y-auto">
                    <pre className="text-xs">{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading} id="tour-hd-3">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Fetch Data
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

