
"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "January", portfolio: 10000 },
  { month: "February", portfolio: 10000 },
  { month: "March", portfolio: 10000 },
  { month: "April", portfolio: 10000 },
  { month: "May", portfolio: 10000 },
  { month: "June", portfolio: 10000 },
];

const chartConfig = {
  portfolio: {
    label: "Account Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface PortfolioChartProps {
    portfolioValue: number;
    id?: string;
}

export function PortfolioChart({ portfolioValue, id }: PortfolioChartProps) {

  // A real implementation would fetch historical data.
  // For this demo, we'll create a simplified dynamic chart.
  const dynamicChartData = chartData.map((d, i) => ({
      ...d,
      portfolio: i < 5 ? 10000 : portfolioValue
  }));


  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Account Performance</CardTitle>
        <CardDescription>
          Your account value over the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={dynamicChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickFormatter={(value) =>
                `$${new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(Number(value))}`
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
            />
            <Tooltip
              cursor={{
                stroke: "hsl(var(--border))",
                strokeWidth: 2,
                strokeDasharray: "3 3",
              }}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${Number(value).toLocaleString("en-US")}`
                  }
                  indicator="dot"
                />
              }
            />
            <defs>
              <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="portfolio"
              type="natural"
              fill="url(#fillPortfolio)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
                Your portfolio is ready for trading.
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Add funds and start paper trading.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
