import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ExternalLink, Users, TrendingUp, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReactNode } from 'react';

export interface TickerData {
  ticker: string;
  name: string;
  mcap: string;
  baseSquareRank: number;
  holders: number;
  supply: string;
  priceChange24h: number;
}

// Mock data for tickers - would come from API
const tickerDataMap: Record<string, TickerData> = {
  'FCBC121': { ticker: '$FCBC121', name: 'Javan Rhinoceros', mcap: '$1.2M', baseSquareRank: 45, holders: 234, supply: '100M', priceChange24h: 12.5 },
  'FCBC45': { ticker: '$FCBC45', name: 'Sumatran Tiger', mcap: '$890K', baseSquareRank: 72, holders: 189, supply: '100M', priceChange24h: -3.2 },
  'FCBC203': { ticker: '$FCBC203', name: 'Amur Leopard', mcap: '$2.1M', baseSquareRank: 23, holders: 456, supply: '100M', priceChange24h: 8.7 },
  'FCBC89': { ticker: '$FCBC89', name: 'Mountain Gorilla', mcap: '$567K', baseSquareRank: 98, holders: 123, supply: '100M', priceChange24h: -1.4 },
  'FCBC156': { ticker: '$FCBC156', name: 'Vaquita Porpoise', mcap: '$1.8M', baseSquareRank: 31, holders: 345, supply: '100M', priceChange24h: 15.3 },
  'FCBC122': { ticker: '$FCBC122', name: 'Syrian Wild Ass', mcap: '$750K', baseSquareRank: 67, holders: 167, supply: '100M', priceChange24h: 5.2 },
  'FCBC38': { ticker: '$FCBC38', name: 'Golden Eagle', mcap: '$1.5M', baseSquareRank: 38, holders: 289, supply: '100M', priceChange24h: 9.8 },
  'FCBC12': { ticker: '$FCBC12', name: 'Snow Leopard', mcap: '$3.2M', baseSquareRank: 12, holders: 567, supply: '100M', priceChange24h: 22.1 },
  'FCBC200': { ticker: '$FCBC200', name: 'Blue Whale', mcap: '$980K', baseSquareRank: 56, holders: 201, supply: '100M', priceChange24h: -0.5 },
  'FCBC312': { ticker: '$FCBC312', name: 'Hawksbill Turtle', mcap: '$1.1M', baseSquareRank: 49, holders: 278, supply: '100M', priceChange24h: 7.3 },
  'FCBC167': { ticker: '$FCBC167', name: 'Yangtze Finless Porpoise', mcap: '$620K', baseSquareRank: 83, holders: 145, supply: '100M', priceChange24h: 3.1 },
};

interface TickerHoverCardProps {
  ticker: string;
  children: ReactNode;
}

export function TickerHoverCard({ ticker, children }: TickerHoverCardProps) {
  // Extract ticker ID from formats like "$FCBC121" or "FCBC121"
  const tickerId = ticker.replace('$', '');
  const data = tickerDataMap[tickerId];
  
  if (!data) {
    return <>{children}</>;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-72" side="top" align="center">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono font-bold text-primary">{data.ticker}</p>
              <p className="text-sm text-muted-foreground">{data.name}</p>
            </div>
            <a 
              href={`https://zora.co/coin/base:${tickerId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-[10px] text-muted-foreground uppercase">Market Cap</p>
              <p className="font-mono text-sm font-medium">{data.mcap}</p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-[10px] text-muted-foreground uppercase">Base Square</p>
              <p className="font-mono text-sm font-medium flex items-center gap-1">
                <Layers className="h-3 w-3" />
                #{data.baseSquareRank}
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-[10px] text-muted-foreground uppercase">Holders</p>
              <p className="font-mono text-sm font-medium flex items-center gap-1">
                <Users className="h-3 w-3" />
                {data.holders}
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-[10px] text-muted-foreground uppercase">24h Change</p>
              <p className={`font-mono text-sm font-medium flex items-center gap-1 ${data.priceChange24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                <TrendingUp className={`h-3 w-3 ${data.priceChange24h < 0 ? 'rotate-180' : ''}`} />
                {data.priceChange24h >= 0 ? '+' : ''}{data.priceChange24h}%
              </p>
            </div>
          </div>

          {/* Supply */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
            <span>Total Supply</span>
            <span className="font-mono">{data.supply}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
