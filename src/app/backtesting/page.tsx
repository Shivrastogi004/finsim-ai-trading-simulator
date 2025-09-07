
"use client";

import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { BacktestingCard } from "@/components/dashboard/backtesting-card";
import { BacktestingTour } from "@/components/dashboard/backtesting-tour";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, History, Bot, BarChart } from "lucide-react";


export default function BacktestingPage() {
  const [isTourOpen, setIsTourOpen] = useState(true);

  return (
    <DashboardLayout>
       {isTourOpen && <BacktestingTour onComplete={() => setIsTourOpen(false)} />}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Strategy Backtesting
          </h1>
          <p className="text-muted-foreground">
            Test your trading strategies against historical market data to see
            how they would have performed.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <BacktestingCard />
          </div>
          <Card className="transition-all hover:shadow-lg" id="tour-step-4">
            <CardHeader>
              <CardTitle>How it Works</CardTitle>
              <CardDescription>
                Understand the backtesting process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Our backtesting engine uses historical price data to simulate
                trades based on your selected strategy. The AI then analyzes
                the performance and suggests potential improvements.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Select a Stock & Strategy</h4>
                    <p>Choose the security and strategy you want to test.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Run Backtest</h4>
                    <p>The system simulates trades over a historical period.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Analyze Results</h4>
                    <p>Review the performance metrics like ROI and win rate.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">AI Suggestions</h4>
                    <p>Get AI-driven tips to refine and improve your approach.</p>
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
