
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Newspaper } from "lucide-react"

const newsItems = [
    {
        source: "Bloomberg",
        title: "Tech Stocks Rally as Inflation Fears Subside",
        time: "2h ago",
    },
    {
        source: "Reuters",
        title: "Federal Reserve Signals Steady Interest Rates",
        time: "4h ago",
    },
    {
        source: "The Wall Street Journal",
        title: "NVIDIA's New Chip Heralds AI Revolution",
        time: "5h ago",
    },
    {
        source: "Financial Times",
        title: "Oil Prices Surge Amid Geopolitical Tensions",
        time: "1d ago",
    },
    {
        source: "MarketWatch",
        title: "Meme Stocks See Resurgence in Retail Trading Frenzy",
        time: "1d ago",
    }
]

export function MarketNewsCard({id}: {id?: string}) {
  return (
    <Card id={id} className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Newspaper className="h-6 w-6" /> Market News</CardTitle>
        <CardDescription>Latest headlines impacting the market.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.source}</p>
              </div>
              <p className="text-sm text-muted-foreground whitespace-nowrap">{item.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
