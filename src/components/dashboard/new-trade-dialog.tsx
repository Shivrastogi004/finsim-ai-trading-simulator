
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewTradeDialogProps {
    onNewTrade: (trade: { symbol: string, shares: number, type: 'buy' | 'sell' }) => void;
}

export function NewTradeDialog({ onNewTrade }: NewTradeDialogProps) {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [type, setType] = useState<"buy" | "sell">("buy");
  const { toast } = useToast();

  const handleSubmit = () => {
    const sharesNum = parseInt(shares);
    if (!symbol || !shares || isNaN(sharesNum) || sharesNum <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid stock symbol and a positive number of shares.",
      });
      return;
    }

    onNewTrade({
      symbol: symbol.toUpperCase(),
      shares: sharesNum,
      type,
    });
    
    setOpen(false);
    setSymbol("");
    setShares("");
    setType("buy");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Trade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a New Trade</DialogTitle>
          <DialogDescription>
            Enter the details for your new paper trade. This will use your cash balance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="symbol" className="text-right">
              Symbol
            </Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="col-span-3"
              placeholder="e.g. AAPL"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shares" className="text-right">
              Shares
            </Label>
            <Input
              id="shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="col-span-3"
              placeholder="e.g. 100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={(value: "buy" | "sell") => setType(value)} defaultValue={type}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Place Trade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
