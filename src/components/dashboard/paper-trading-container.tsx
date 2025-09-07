
"use client";

import { useState, useEffect } from "react";
import { PaperTradingCard } from "./paper-trading-card";
import { NewTradeDialog } from "./new-trade-dialog";
import type { PortfolioItem } from "@/data/portfolio";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, writeBatch, runTransaction, onSnapshot, query, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const stockData: Record<string, { name: string; price: number }> = {
    "AAPL": { name: "Apple Inc.", price: 172.50 },
    "GOOGL": { name: "Alphabet Inc.", price: 140.75 },
    "TSLA": { name: "Tesla, Inc.", price: 230.10 },
    "AMZN": { name: "Amazon.com, Inc.", price: 175.50 },
    "MSFT": { name: "Microsoft Corp.", price: 420.70 },
    "NVDA": { name: "NVIDIA Corp.", price: 950.30 },
    "META": { name: "Meta Platforms, Inc.", price: 330.25 },
    "JPM": { name: "JPMorgan Chase & Co.", price: 155.60 },
    "V": { name: "Visa Inc.", price: 240.80 },
    "DIS": { name: "The Walt Disney Company", price: 95.40 }
};

export function PaperTradingContainer() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/portfolio`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const stocks: PortfolioItem[] = [];
        querySnapshot.forEach((doc) => {
          stocks.push({ ...doc.data(), symbol: doc.id } as PortfolioItem);
        });
        setPortfolio(stocks);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleNewTrade = async (trade: { symbol: string, shares: number, type: 'buy' | 'sell' }) => {
    if (!user) return;

    const stockInfo = stockData[trade.symbol] || { name: `${trade.symbol} Stock`, price: Math.random() * 1000 };
    const tradeValue = trade.shares * stockInfo.price;
    const userDocRef = doc(db, 'users', user.uid);
    const portfolioDocRef = doc(db, `users/${user.uid}/portfolio`, trade.symbol);
    const transactionDocRef = doc(collection(db, `users/${user.uid}/transactions`));

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            const portfolioDoc = await transaction.get(portfolioDocRef);

            if (!userDoc.exists()) {
                throw "User document does not exist!";
            }

            const cashBalance = userDoc.data().cashBalance || 0;

            if (trade.type === 'buy') {
                if (cashBalance < tradeValue) {
                    throw "Insufficient funds to complete this purchase.";
                }

                const newCashBalance = cashBalance - tradeValue;
                const existingShares = portfolioDoc.exists() ? portfolioDoc.data().shares : 0;
                const newShares = existingShares + trade.shares;
                
                transaction.update(userDocRef, { cashBalance: newCashBalance });
                transaction.set(portfolioDocRef, { 
                    name: stockInfo.name, 
                    shares: newShares,
                    currentPrice: stockInfo.price,
                    profit: portfolioDoc.exists() ? portfolioDoc.data().profit : 0
                });
                 transaction.set(transactionDocRef, {
                    type: 'buy',
                    symbol: trade.symbol,
                    shares: trade.shares,
                    price: stockInfo.price,
                    total: tradeValue,
                    date: serverTimestamp()
                });


            } else { // Sell
                const existingShares = portfolioDoc.exists() ? portfolioDoc.data().shares : 0;
                if (existingShares < trade.shares) {
                    throw "You cannot sell more shares than you own.";
                }

                const newCashBalance = cashBalance + tradeValue;
                const newShares = existingShares - trade.shares;

                transaction.update(userDocRef, { cashBalance: newCashBalance });

                if (newShares > 0) {
                    transaction.update(portfolioDocRef, { shares: newShares });
                } else {
                    transaction.delete(portfolioDocRef);
                }
                 transaction.set(transactionDocRef, {
                    type: 'sell',
                    symbol: trade.symbol,
                    shares: trade.shares,
                    price: stockInfo.price,
                    total: tradeValue,
                    date: serverTimestamp()
                });
            }
        });

        toast({
            title: "Trade Successful",
            description: `Successfully placed a ${trade.type} order for ${trade.shares} shares of ${trade.symbol}.`,
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Trade Failed",
            description: typeof error === 'string' ? error : "An unexpected error occurred.",
        });
        console.error("Trade transaction failed: ", error);
    }
  };

  return (
    <Card id="tour-pt-2">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Portfolio</CardTitle>
                <CardDescription>
                Practice trading with virtual funds in a simulated market environment.
                </CardDescription>
            </div>
            <div id="tour-pt-3">
             <NewTradeDialog onNewTrade={handleNewTrade} />
            </div>
        </CardHeader>
        <CardContent>
            <PaperTradingCard portfolio={portfolio} />
        </CardContent>
    </Card>
  );
}
