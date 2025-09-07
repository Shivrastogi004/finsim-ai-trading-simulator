
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { explainableAISignals } from "@/ai/flows/explainable-ai-signals";
import { Loader2, Bot, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AiSignalCardProps {
  ticker: string;
  isFirst?: boolean;
}

export function AiSignalCard({ ticker = "AAPL", isFirst = false }: AiSignalCardProps) {
  const [loading, setLoading] = useState(true);
  const [signal, setSignal] = useState<{
    signal: string;
    explanation: string;
  } | null>(null);
  const { toast } = useToast();

  const fetchSignal = async () => {
    setLoading(true);
    try {
      const res = await explainableAISignals({
        ticker: ticker,
        strategy: "LSTM Forecasting & Sentiment Analysis",
        historicalData: JSON.stringify({
          message: "Recent price uptrend noted.",
        }),
        sentimentScore: 0.65,
      });
      setSignal(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error fetching AI signal",
        description: `Could not retrieve the latest signal for ${ticker}.`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignal();
  }, [ticker]);

  const getSignalBadgeVariant = (signalStr: string | undefined) => {
    if (!signalStr) return "secondary";
    const lowerSignal = signalStr.toLowerCase();
    if (lowerSignal.includes("buy")) return "default";
    if (lowerSignal.includes("sell")) return "destructive";
    return "secondary";
  };

  return (
    <Card id={isFirst ? "tour-ai-signal-1" : undefined} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle>AI-Driven Signal</CardTitle>
          <CardDescription>Generated for {ticker}</CardDescription>
        </div>
        <div className="p-2 bg-primary/10 rounded-full">
            <Bot className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
          <div className="flex h-[130px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : signal ? (
          <div className="space-y-4">
            <Badge
              id={isFirst ? "tour-ai-signal-2" : undefined}
              variant={getSignalBadgeVariant(signal.signal)}
              className="px-3 py-1 text-sm font-semibold"
            >
              {signal.signal.toUpperCase()}
            </Badge>
            <div id={isFirst ? "tour-ai-signal-3" : undefined}>
              <h4 className="mb-1 font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Explanation (XAI)</h4>
              <p className="text-sm text-muted-foreground">
                {signal.explanation}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-[130px] items-center justify-center text-muted-foreground">
            No signal available.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          id={isFirst ? "tour-ai-signal-4" : undefined}
          variant="outline"
          className="w-full"
          onClick={fetchSignal}
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Refresh Signal
        </Button>
      </CardFooter>
    </Card>
  );
}
