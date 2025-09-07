
"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout-demo";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { PaperTradingCard } from "@/components/dashboard/paper-trading-card";
import { MarketNewsCard } from "@/components/dashboard/market-news-card";
import { DollarSign, Percent, Briefcase, Wallet } from "lucide-react";
import { AiSignalCard } from "@/components/dashboard/ai-signal-card";
import type { PortfolioItem } from '@/data/portfolio';

const demoPortfolio: PortfolioItem[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, currentPrice: 172.50, profit: 1250.75 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', shares: 20, currentPrice: 230.10, profit: -340.50 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 15, currentPrice: 950.30, profit: 5600.00 },
];

const demoPortfolioValue = demoPortfolio.reduce((acc, item) => acc + (item.shares * item.currentPrice), 0);
const demoCashBalance = 25430.50;
const demoTotalValue = demoPortfolioValue + demoCashBalance;

export default function DemoPage() {
  return (
    <DashboardLayout>
      <div className="grid auto-rows-max items-start gap-8 lg:col-span-2">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
           <MetricCard
            title="Account Value"
            value={demoTotalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change="Value of stocks + cash"
            icon={DollarSign}
          />
          <MetricCard
            title="Portfolio Value"
            value={demoPortfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change={`${demoPortfolio.length} holdings`}
            icon={Briefcase}
          />
           <MetricCard
            title="Cash Balance"
            value={demoCashBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change="Ready to invest"
            icon={Wallet}
          />
           <MetricCard
            title="Simulated ROI"
            value="+12.5%"
            change="+1,150.23 (30d)"
            icon={Percent}
          />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioChart portfolioValue={demoTotalValue} />
          </div>
          <div>
            <PaperTradingCard portfolio={demoPortfolio} />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MarketNewsCard />
          </div>
          <div className="lg:col-span-4">
             <AiSignalCard ticker="NVDA" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
