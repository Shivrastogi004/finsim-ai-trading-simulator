
"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { PaperTradingContainer } from "@/components/dashboard/paper-trading-container";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PaperTradingTour } from "@/components/dashboard/paper-trading-tour";
import { DollarSign, Wallet, TrendingDown, Briefcase } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, getDocs, writeBatch } from 'firebase/firestore';
import type { PortfolioItem } from '@/data/portfolio';

export default function PaperTradingPage() {
  const [isTourOpen, setIsTourOpen] = useState(true);
  const { user } = useAuth();
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [openPositions, setOpenPositions] = useState(0);

  useEffect(() => {
    if (user) {
      // Listen for cash balance updates
      const userDocUnsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        setCashBalance(doc.data()?.cashBalance || 0);
      });

      // Listen for portfolio updates
      const portfolioQuery = query(collection(db, `users/${user.uid}/portfolio`));
      const portfolioUnsub = onSnapshot(portfolioQuery, (querySnapshot) => {
        let totalValue = 0;
        let positionCount = 0;
        querySnapshot.forEach((doc) => {
            const stock = doc.data() as PortfolioItem;
            totalValue += stock.shares * stock.currentPrice;
            positionCount++;
        });
        setPortfolioValue(totalValue);
        setOpenPositions(positionCount);
      });

      return () => {
        userDocUnsub();
        portfolioUnsub();
      };
    }
  }, [user]);

  // Effect for simulating real-time price updates
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const portfolioQuery = query(collection(db, `users/${user.uid}/portfolio`));
      const querySnapshot = await getDocs(portfolioQuery);
      
      if (querySnapshot.empty) return;

      const batch = writeBatch(db);
      querySnapshot.forEach(docSnap => {
        const stock = docSnap.data() as PortfolioItem;
        const priceChange = (Math.random() - 0.5) * (stock.currentPrice * 0.01); // Fluctuate by +/- 0.5%
        const newPrice = Math.max(0.01, stock.currentPrice + priceChange); // Ensure price doesn't go below 0.01
        
        const newProfit = (newPrice * stock.shares) - stock.totalCost;

        const docRef = doc(db, `users/${user.uid}/portfolio`, docSnap.id);
        batch.update(docRef, { 
            currentPrice: newPrice,
            profit: newProfit
        });
      });
      await batch.commit();

    }, 3000); // Update prices every 3 seconds

    return () => clearInterval(interval);
  }, [user]);

  const totalAccountValue = portfolioValue + cashBalance;

  return (
    <DashboardLayout>
      {isTourOpen && <PaperTradingTour onComplete={() => setIsTourOpen(false)} />}
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" id="tour-pt-1">
          <MetricCard
            title="Account Value"
            value={totalAccountValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change="Stocks + Cash"
            icon={DollarSign}
          />
          <MetricCard
            title="Cash Balance"
            value={cashBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change="Ready to trade"
            icon={Wallet}
          />
          <MetricCard
            title="Portfolio Value"
            value={portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            change="Value of all holdings"
            icon={Briefcase}
          />
          <MetricCard
            title="Open Positions"
            value={openPositions.toString()}
            change="Total unique stocks"
            icon={Briefcase}
          />
        </div>
        <PaperTradingContainer />
      </div>
    </DashboardLayout>
  );
}
