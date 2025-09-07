
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  id?: string;
};

export function MetricCard({ title, value, change, icon: Icon, id }: MetricCardProps) {
  const isPositive = change.startsWith("+");
  return (
    <Card id={id} className="transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription>{title}</CardDescription>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-4xl font-bold">{value}</CardTitle>
        <div
          className={cn(
            "text-xs text-muted-foreground",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {change}
        </div>
      </CardContent>
    </Card>
  );
}
