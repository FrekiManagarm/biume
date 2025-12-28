import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/style";

type MetricCardProps = {
  title: string;
  description?: string;
  value: string | number;
  delta?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
};

export function MetricCard({
  title,
  description,
  value,
  delta,
  icon,
  className,
}: MetricCardProps) {
  const trendColor =
    delta?.trend === "up"
      ? "text-emerald-600"
      : delta?.trend === "down"
        ? "text-rose-600"
        : "text-muted-foreground";

  return (
    <Card
      className={cn(
        "h-full border-border/70 bg-card/80 backdrop-blur-sm transition-shadow",
        "hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-md">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-muted-foreground/90">
              {description}
            </CardDescription>
          ) : null}
        </div>
        {icon ? (
          <div aria-hidden className="text-muted-foreground">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div className="text-4xl font-bold tabular-nums tracking-tight">
          {value}
        </div>
        {delta ? (
          <div
            className={cn("text-sm font-medium", trendColor)}
            title={delta.value}
          >
            {delta.trend === "up" && <span>▲</span>}
            {delta.trend === "down" && <span>▼</span>}
            {delta.trend === "neutral" && <span>■</span>}
            <span className="ml-1">{delta.value}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

type MetricsGridProps = React.PropsWithChildren<{
  className?: string;
  columns?: 2 | 3 | 4;
}>;

export function MetricsGrid({
  children,
  className,
  columns = 4,
}: MetricsGridProps) {
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-4";
  return (
    <div className={cn("grid grid-cols-1 gap-4", cols, className)}>
      {children}
    </div>
  );
}
