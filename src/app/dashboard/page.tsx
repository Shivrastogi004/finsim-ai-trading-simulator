
"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { PaperTradingCard } from "@/components/dashboard/paper-trading-card";
import { MarketNewsCard } from "@/components/dashboard/market-news-card";
import { DollarSign, Percent, TrendingUp, TrendingDown, Bot, Wallet, Briefcase } from "lucide-react";
import { AiSignalCard } from "@/components/dashboard/ai-signal-card";
import { DashboardTour } from '@/components/dashboard/dashboard-tour';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
import type { PortfolioItem } from '@/data/portfolio';

const stocks = ["AAPL", "GOOGL", "TSLA", "MSFT"];

export default function DashboardPage() {
  const [isTourOpen, setIsTourOpen] = useState(true);
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/portfolio`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const stocks: PortfolioItem[] = [];
        let totalValue = 0;
        querySnapshot.forEach((doc) => {
            const data = doc.data() as Omit<PortfolioItem, 'symbol'>;
            const stock = { ...data, symbol: doc.id };
            stocks.push(stock);
            totalValue += stock.shares * stock.currentPrice;
        });
        setPortfolio(stocks);
        setPortfolioValue(totalValue);
      });
      return () => unsubscribe();
    }
  }, [user]);

   useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        setCashBalance(doc.data()?.cashBalance || 0);
      });
      return () => unsub();
    }
  }, [user]);

  const totalAccountValue = portfolioValue + cashBalance;

  return (
    <DashboardLayout>
       {isTourOpen && <DashboardTour onComplete={() => setIsTourOpen(false)} />}
      <div className="grid auto-rows-max items-start gap-8 lg:col-span-2">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4" id="tour-dash-1">
           <MetricCard
            title="Account Value"
            value={totalAccountValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change="Value of stocks + cash"
            icon={DollarSign}
          />
          <MetricCard
            title="Portfolio Value"
            value={portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change={`${portfolio.length} holdings`}
            icon={Briefcase}
          />
           <MetricCard
            title="Cash Balance"
            value={cashBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change="Ready to invest"
            icon={Wallet}
          />
           <MetricCard
            title="Simulated ROI"
            value="--"
            change="Not yet calculated"
            icon={Percent}
          />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2" id="tour-dash-2">
            <PortfolioChart portfolioValue={totalAccountValue} />
          </div>
          <div id="tour-dash-3">
            <PaperTradingCard portfolio={portfolio} />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-8" id="tour-dash-4">
            <MarketNewsCard />
          </div>
          <div className="lg:col-span-4" id="tour-dash-5">
             <AiSignalCard ticker="NVDA" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
