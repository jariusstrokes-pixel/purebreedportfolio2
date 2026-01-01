import { ArrowLeft, Coins, Flame, Dna, DollarSign, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EarningsData {
  ticker: string;
  name: string;
  totalSupply: string;
  circulatingSupply: string;
  burnedAmount: string;
  burnedPercentage: number;
  hybridsCreated: number;
  earningsInToken: string;
  earningsUsdValue: string;
  custodianSince: string;
  epochsHeld: number;
}

interface EarningsDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    ticker: string;
    name: string;
  } | null;
}

// Mock earnings data - would come from API
const getEarningsData = (ticker: string): EarningsData => ({
  ticker,
  name: ticker.replace('$FCBC', 'Species '),
  totalSupply: '100,000,000',
  circulatingSupply: '87,234,567',
  burnedAmount: '12,765,433',
  burnedPercentage: 12.77,
  hybridsCreated: 23,
  earningsInToken: '45,678.90',
  earningsUsdValue: '$1,234.56',
  custodianSince: 'Epoch 0',
  epochsHeld: 3,
});

export function EarningsDashboardDialog({ open, onOpenChange, asset }: EarningsDashboardDialogProps) {
  if (!asset) return null;
  
  const data = getEarningsData(asset.ticker);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-2 space-y-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-primary">{asset.ticker}</span>
              <Badge variant="secondary" className="text-xs">Custodian</Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{asset.name}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Custodian Status */}
          <div className="rounded-lg bg-success/5 border border-success/20 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Custodian Since</p>
                <p className="font-medium text-success">{data.custodianSince}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Epochs Held</p>
                <p className="font-mono font-bold text-success">{data.epochsHeld}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Earnings Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Custodian Earnings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Token Earnings</p>
                <p className="font-mono font-bold">{data.earningsInToken}</p>
                <p className="text-[10px] text-muted-foreground">{asset.ticker}</p>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <p className="text-xs text-muted-foreground">USDC Value</p>
                <p className="font-mono font-bold text-primary">{data.earningsUsdValue}</p>
                <p className="text-[10px] text-success flex items-center gap-1">
                  <TrendingUp className="h-2 w-2" />
                  +12.5% this epoch
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Supply Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              Supply Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">Total Supply</span>
                <span className="font-mono text-sm">{data.totalSupply}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">Circulating</span>
                <span className="font-mono text-sm">{data.circulatingSupply}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Burn Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4 text-destructive" />
              Burn Details
            </h3>
            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Tokens Burned</p>
                  <p className="font-mono font-medium">{data.burnedAmount}</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {data.burnedPercentage}%
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Hybrid Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Dna className="h-4 w-4 text-primary" />
              Hybrid Creation
            </h3>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Hybrids Created</p>
                  <p className="font-mono font-bold text-lg">{data.hybridsCreated}</p>
                </div>
                <p className="text-xs text-muted-foreground text-right max-w-[50%]">
                  Using this genome's DNA
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
