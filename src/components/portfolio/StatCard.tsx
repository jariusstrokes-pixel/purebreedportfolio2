import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
  valueClassName?: string;
  subValue?: string;
  subValueClassName?: string;
}

export function StatCard({ label, value, change, icon, className, delay = 0, valueClassName, subValue, subValueClassName }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg bg-card p-4 shadow-card animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <p className="text-xs font-medium">{label}</p>
          </div>
          <p className={cn("text-xl font-bold font-mono", valueClassName)}>{value}</p>
          {subValue && (
            <p className={cn("text-xs font-mono", subValueClassName)}>{subValue}</p>
          )}
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive ? "text-success" : "text-destructive"
            )}>
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
    </div>
  );
}
