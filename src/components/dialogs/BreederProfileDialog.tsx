import { ExternalLink, Crown, Coins, Dna, Users, TrendingUp, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface BreederProfile {
  rank: number;
  address: string;
  baseName?: string;
  custodies: number;
  totalUnits: string;
  isCurrentUser?: boolean;
  // Extended data
  joinedEpoch?: number;
  totalEarnings?: string;
  topPurebreeds?: { symbol: string; name: string; units: string }[];
  activityLevel?: string;
  wealth?: {
    eth: string;
    usdc: string;
    fcbc: string;
    dna: string;
    hybrids: number;
  };
}

interface BreederProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breeder: BreederProfile | null;
}

export function BreederProfileDialog({ open, onOpenChange, breeder }: BreederProfileDialogProps) {
  if (!breeder) return null;

  // Mock extended data
  const extendedData = {
    joinedEpoch: 0,
    totalEarnings: '45.2 ETH',
    topPurebreeds: [
      { symbol: 'FCBC121', name: 'Javan Rhinoceros', units: '12.5M' },
      { symbol: 'FCBC203', name: 'Amur Leopard', units: '8.3M' },
      { symbol: 'FCBC156', name: 'Vaquita Porpoise', units: '5.1M' },
    ],
    activityLevel: 'Very High',
    wealth: {
      eth: '18.9',
      usdc: '67,000',
      fcbc: '3.1M',
      dna: '1.2M',
      hybrids: 31,
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Breeder Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold",
              breeder.rank <= 3 ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              #{breeder.rank}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <a
                  href={`https://basescan.org/address/${breeder.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm hover:text-primary transition-colors flex items-center gap-1"
                >
                  {breeder.baseName || breeder.address}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
                {breeder.isCurrentUser && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0 text-primary border-primary/30">You</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {breeder.custodies} custodies
                </span>
                <span className="flex items-center gap-1">
                  <Dna className="h-3 w-3" />
                  {breeder.totalUnits}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-success/5 border border-success/20 p-3 text-center">
              <p className="text-lg font-bold text-success">{extendedData.totalEarnings}</p>
              <p className="text-[10px] text-muted-foreground">Total Earnings</p>
            </div>
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
              <p className="text-lg font-bold text-primary">Epoch {extendedData.joinedEpoch}</p>
              <p className="text-[10px] text-muted-foreground">Joined</p>
            </div>
          </div>

          {/* Activity Level */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Activity Level
            </span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                extendedData.activityLevel === 'Very High' && "border-success/50 text-success",
                extendedData.activityLevel === 'High' && "border-primary/50 text-primary"
              )}
            >
              {extendedData.activityLevel}
            </Badge>
          </div>

          {/* Wealth Breakdown */}
          <div>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <Wallet className="h-3 w-3 text-primary" />
              Portfolio Wealth
            </h4>
            <div className="grid grid-cols-5 gap-1">
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <p className="text-xs font-bold">{extendedData.wealth.eth}</p>
                <p className="text-[8px] text-muted-foreground">ETH</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <p className="text-xs font-bold">{extendedData.wealth.usdc}</p>
                <p className="text-[8px] text-muted-foreground">USDC</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <p className="text-xs font-bold">{extendedData.wealth.fcbc}</p>
                <p className="text-[8px] text-muted-foreground">FCBC</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <p className="text-xs font-bold">{extendedData.wealth.dna}</p>
                <p className="text-[8px] text-muted-foreground">DNA</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <p className="text-xs font-bold">{extendedData.wealth.hybrids}</p>
                <p className="text-[8px] text-muted-foreground">Hybrids</p>
              </div>
            </div>
          </div>

          {/* Top Custodied Purebreeds */}
          <div>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <Crown className="h-3 w-3 text-primary" />
              Top Custodied Purebreeds
            </h4>
            <div className="space-y-2">
              {extendedData.topPurebreeds.map((purebreed, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {purebreed.symbol.replace('FCBC', '').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-medium">{purebreed.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">${purebreed.symbol}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono">{purebreed.units}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
