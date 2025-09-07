
"use client";

import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { HistoricalDataCard } from "@/components/dashboard/historical-data-card";
import { HistoricalDataTour } from "@/components/dashboard/historical-data-tour";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Calendar, Search } from "lucide-react";

export default function HistoricalDataPage() {
  const [isTourOpen, setIsTourOpen] = useState(true);

  return (
    <DashboardLayout>
       {isTourOpen && <HistoricalDataTour onComplete={() => setIsTourOpen(false)} />}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI-Driven Historical Data
          </h1>
          <p className="text-muted-foreground">
            Let our AI help you find historical data based on market sentiment.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <HistoricalDataCard />
          </div>
          <Card className="transition-all hover:shadow-lg" id="tour-hd-5">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Using AI to find data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-muted-foreground">
              <p>
                Instead of just fetching raw price data, our AI analyzes your
                request to determine the prevailing market sentiment during your
                chosen timeframe. This allows you to backtest strategies in
                specific market conditions (e.g., bullish, bearish, or neutral periods).
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Define Ticker & Dates</h4>
                    <p>
                      Specify the stock and the date range you're interested in.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">AI Sentiment Analysis</h4>
                    <p>
                      The AI determines the most relevant market sentiment for that period.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Retrieve Data</h4>
                    <p>
                      We fetch and display the historical data, along with the AI's reasoning.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
