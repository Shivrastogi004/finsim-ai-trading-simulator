
"use client";

import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { NewsSentimentCard } from "@/components/dashboard/news-sentiment-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Newspaper, Rss, Twitter } from "lucide-react";
import { SentimentTour } from "@/components/dashboard/sentiment-tour";

const stocks = ["AAPL", "GOOGL", "TSLA", "MSFT", "NVDA", "AMZN"];

export default function SentimentPage() {
  const [isTourOpen, setIsTourOpen] = useState(true);

  return (
    <DashboardLayout>
      {isTourOpen && <SentimentTour onComplete={() => setIsTourOpen(false)} />}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Market Sentiment Analysis
          </h1>
          <p className="text-muted-foreground">
            Gauge the market's mood by analyzing news, social media, and more.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stocks.map((stock, index) => (
            <NewsSentimentCard key={stock} ticker={stock} isFirst={index === 0} />
          ))}
        </div>
        <Card id="tour-sentiment-5">
          <CardHeader>
            <CardTitle>Alternative Data Sources</CardTitle>
            <CardDescription>
              We analyze various alternative data sources to provide a holistic
              sentiment view.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Newspaper className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">News Headlines</h3>
                <p className="text-sm text-muted-foreground">
                  Major financial news outlets.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Twitter className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Social Media</h3>
                <p className="text-sm text-muted-foreground">
                  Sentiment from X (formerly Twitter).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Rss className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Financial Blogs</h3>
                <p className="text-sm text-muted-foreground">
                  Analysis from popular trading blogs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
