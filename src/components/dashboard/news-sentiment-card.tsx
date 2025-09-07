
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { analyzeNewsSentiment } from "@/ai/flows/analyze-news-sentiment";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NewsSentimentCardProps {
  ticker: string;
  isFirst?: boolean;
}

function SentimentIcon({ score }: { score: number }) {
  if (score > 0.3)
    return <TrendingUp className="h-6 w-6 text-green-600" />;
  if (score < -0.3) return <TrendingDown className="h-6 w-6 text-red-600" />;
  return <Minus className="h-6 w-6 text-muted-foreground" />;
}

function getSentimentLabel(score: number) {
    if (score > 0.6) return "Very Positive";
    if (score > 0.2) return "Positive";
    if (score < -0.6) return "Very Negative";
    if (score < -0.2) return "Negative";
    return "Neutral"
}

export function NewsSentimentCard({ ticker = "AAPL", isFirst = false }: NewsSentimentCardProps) {
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState<{
    sentimentScore: number;
    correlation: number;
    explanation: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSentiment = async () => {
      setLoading(true);
      try {
        const res = await analyzeNewsSentiment({ symbol: ticker });
        setSentiment(res);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error fetching sentiment",
          description: `Could not retrieve news sentiment data for ${ticker}.`,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSentiment();
  }, [ticker]);

  const sentimentScore = sentiment?.sentimentScore ?? 0;
  const isPositive = sentimentScore > 0;
  const sentimentLabel = getSentimentLabel(sentimentScore);

  return (
    <Card id={isFirst ? "tour-sentiment-1" : undefined} className="transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle>News Sentiment</CardTitle>
        <CardDescription>
          Analysis of recent news headlines for {ticker}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {loading ? (
          <>
            <div className="flex items-center justify-between space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </>
        ) : sentiment ? (
          <>
            <div className="flex items-center justify-between space-x-4">
              <div id={isFirst ? "tour-sentiment-2" : undefined} className="flex items-center space-x-4">
                <SentimentIcon score={sentiment.sentimentScore} />
                <div>
                  <p className="text-sm font-medium leading-none">
                    {sentimentLabel}
                  </p>
                  <p className={cn("text-sm", isPositive ? "text-green-600" : "text-red-600")}>{sentiment.sentimentScore.toFixed(2)}</p>
                </div>
              </div>
              <div id={isFirst ? "tour-sentiment-3" : undefined} className="text-right">
                <p className="text-sm font-medium leading-none">Correlation</p>
                <p className="text-sm text-muted-foreground">
                  {sentiment.correlation.toFixed(2)}
                </p>
              </div>
            </div>
            <div id={isFirst ? "tour-sentiment-4" : undefined}>
              <h4 className="mb-1 font-semibold">AI Summary</h4>
              <p className="text-sm text-muted-foreground">
                {sentiment.explanation}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            No sentiment data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
