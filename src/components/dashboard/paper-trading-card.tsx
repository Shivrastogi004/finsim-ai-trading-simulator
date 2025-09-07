
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PortfolioItem } from "@/data/portfolio";
import { Info } from "lucide-react";

interface PaperTradingCardProps {
  portfolio?: PortfolioItem[];
  id?: string;
}

export function PaperTradingCard({ portfolio = [], id }: PaperTradingCardProps) {
  return (
    <Card id={id} className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Paper Trading Portfolio</CardTitle>
        <CardDescription>Your simulated trading positions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[300px]">
         {portfolio.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">P/L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.map((stock) => (
                <TableRow key={stock.symbol} className="transition-colors hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {stock.name}
                    </div>
                  </TableCell>
                  <TableCell>{stock.shares}</TableCell>
                   <TableCell className="text-right">${(stock.shares * stock.currentPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      stock.profit >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {stock.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <Info className="h-8 w-8 mb-4"/>
              <p className="font-semibold">Your Portfolio is Empty</p>
              <p className="text-sm">Start by making a new trade to see your positions here.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
