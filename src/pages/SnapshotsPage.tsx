import { useState, useEffect } from 'react';
import { Box, Lock, Unlock, Clock, Info, Check, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CustodianLeaderboard } from '@/components/CustodianLeaderboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TickerHoverCard } from '@/components/TickerHoverCard';
import { EarningsDashboardDialog } from '@/components/dialogs/EarningsDashboardDialog';

interface MysteryBox {
  id: number;
  status: 'blind' | 'revealed' | 'empty';
  hint?: string;
}

const hints = ["This species loves the deep ocean...", "Look for creatures with scales of gold...", "Ancient DNA from the forest realm...", "Wings that shimmer in moonlight...", "Born from volcanic ash...", "The rarest of the aquatic beings..."];

const initialBoxes: MysteryBox[] = Array.from({
  length: 10
}, (_, i) => ({
  id: i + 1,
  status: i < 6 ? 'blind' : 'empty',
  hint: i < 6 ? hints[i % hints.length] : undefined
}));

// All purebreed genomes held by user
const allGenomesHeld = [
  { symbol: '$FCBC121', name: 'Javan Rhinoceros', units: '12.5M', isCustodian: true },
  { symbol: '$FCBC203', name: 'Amur Leopard', units: '15.1M', isCustodian: true },
  { symbol: '$FCBC156', name: 'Vaquita Porpoise', units: '9.3M', isCustodian: true },
  { symbol: '$FCBC312', name: 'Hawksbill Turtle', units: '22.3M', isCustodian: false },
  { symbol: '$FCBC167', name: 'Yangtze Finless Porpoise', units: '11.2M', isCustodian: false },
  { symbol: '$FCBC45', name: 'Sumatran Tiger', units: '5.8M', isCustodian: false },
  { symbol: '$FCBC89', name: 'Mountain Gorilla', units: '3.2M', isCustodian: false },
  { symbol: '$FCBC38', name: 'Golden Eagle', units: '7.4M', isCustodian: false },
  { symbol: '$FCBC12', name: 'Snow Leopard', units: '2.1M', isCustodian: false },
  { symbol: '$FCBC200', name: 'Blue Whale', units: '18.9M', isCustodian: false },
];

const epoch0Snaps = ['$FCBC121', '$FCBC19', '$FCBC56', '$FCBC2'];

const leadingPreSnapshots = [{
  id: '#122',
  symbol: 'FCBC122',
  name: 'Syrian Wild Ass',
  units: '12.5M',
  rank: '#1'
}, {
  id: '#38',
  symbol: 'FCBC38',
  name: 'Golden Eagle',
  units: '8.2M',
  rank: '#1'
}, {
  id: '#12',
  symbol: 'FCBC12',
  name: 'Snow Leopard',
  units: '15.1M',
  rank: '#1'
}, {
  id: '#200',
  symbol: 'FCBC200',
  name: 'Blue Whale',
  units: '9.3M',
  rank: '#1'
}];

export function SnapshotsPage() {
  const [boxes, setBoxes] = useState<MysteryBox[]>(initialBoxes);
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [showCustodiedOnly, setShowCustodiedOnly] = useState(false);
  const [genomesExpanded, setGenomesExpanded] = useState(false);
  const [earningsDialogOpen, setEarningsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{ ticker: string; name: string } | null>(null);
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 30,
    seconds: 39
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 6;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBoxClick = (box: MysteryBox) => {
    if (box.status === 'empty') {
      toast.info('This box is empty. Check back next snapshot!');
      return;
    }
    setSelectedBox(box);
  };

  const revealHint = () => {
    if (!selectedBox) return;
    setBoxes(prev => prev.map(b => b.id === selectedBox.id ? {
      ...b,
      status: 'revealed' as const
    } : b));
    toast.success(`Hint revealed for $1! "${selectedBox.hint}"`);
    setSelectedBox(null);
  };

  const handleAssetClick = (asset: { symbol: string; name: string; isCustodian: boolean }) => {
    if (asset.isCustodian) {
      setSelectedAsset({ ticker: asset.symbol, name: asset.name });
      setEarningsDialogOpen(true);
    }
  };

  const filteredGenomes = showCustodiedOnly 
    ? allGenomesHeld.filter(g => g.isCustodian) 
    : allGenomesHeld;
  
  const visibleGenomes = genomesExpanded ? filteredGenomes : filteredGenomes.slice(0, 6);

  return (
    <div className="space-y-6 pb-20">
      {/* Header - 2 lines */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold font-serif">
          FCBC PUREBREEDS
        </h1>
        <h2 className="text-xl font-semibold text-primary">
          Snapshots and Custody
        </h2>
        <p className="text-muted-foreground text-center text-sm px-[25px] font-sans">
          Monitor Snapshot Events and earn custodian rights of the digital genomic signature of endangered species.
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="rounded-lg bg-card p-6 shadow-card">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">EPOCH 1 ENDS IN </span>
        </div>
        <div className="flex justify-center gap-3 mb-4">
          {[{
            value: countdown.days,
            label: 'DAYS'
          }, {
            value: countdown.hours,
            label: 'HOURS'
          }, {
            value: countdown.minutes,
            label: 'MIN'
          }, {
            value: countdown.seconds,
            label: 'SEC'
          }].map((item, i) => (
            <div key={i} className="flex flex-col items-center bg-muted rounded-lg p-3 min-w-[70px]">
              <span className="text-2xl font-bold font-mono">{item.value}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        {/* Epoch 0 Snaps */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Epoch 0 snaps:</span>
          {epoch0Snaps.map(snap => (
            <TickerHoverCard key={snap} ticker={snap.replace('$', '')}>
              <Badge variant="secondary" className="text-xs font-mono cursor-pointer hover:bg-secondary/80">
                {snap}
              </Badge>
            </TickerHoverCard>
          ))}
        </div>
      </div>

      {/* Pre-Snapshots Leading */}
      <div className="rounded-lg bg-card p-4 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-semibold">Leading Pre-Snapshots</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p className="text-xs">These are pre-snapshot purebreeds where you are currently the top holder (#1). If a snapshot occurs, you become the custodian!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {leadingPreSnapshots.map((species, i) => (
            <TickerHoverCard key={i} ticker={species.symbol}>
              <div className="bg-muted/50 rounded-lg p-3 border border-success/20 cursor-pointer hover:bg-muted/70 transition-colors">
                <p className="text-xs text-muted-foreground truncate">{species.name}</p>
                <p className="font-mono text-sm font-bold">${species.symbol}</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline" className="text-[10px] px-1 py-0 text-success border-success/30">{species.rank}</Badge>
                  <span className="text-xs text-muted-foreground">{species.units}</span>
                </div>
              </div>
            </TickerHoverCard>
          ))}
        </div>
      </div>

      {/* Mystery Boxes */}
      <div className="rounded-lg bg-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Mystery Boxes</h2>
          <span className="text-xs text-muted-foreground">Tap to reveal hints ($1 each)</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {boxes.map(box => (
            <button 
              key={box.id} 
              onClick={() => handleBoxClick(box)} 
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all relative",
                box.status === 'empty' && "bg-muted/30 border border-dashed border-border cursor-not-allowed",
                box.status === 'blind' && "bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/50",
                box.status === 'revealed' && "bg-success/10 border border-success/30"
              )}
            >
              {box.status === 'empty' ? (
                <span className="text-muted-foreground text-xs">Empty</span>
              ) : box.status === 'revealed' ? (
                <>
                  <Unlock className="h-5 w-5 text-success" />
                  <span className="text-[10px] text-success">Revealed</span>
                </>
              ) : (
                <>
                  <Badge className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground">
                    Blind
                  </Badge>
                  <Box className="h-6 w-6 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Box #{box.id}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* How Snapshots Work */}
      <div className="rounded-lg bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">How Snapshots Work</h2>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>A snapshot event is a scheduled moment where the system records blockchain holdings to identify the top holder of randomly selected FCBC Pre-assets.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Snapshots occur once every week</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Each event selects 3 to 10 random Pre-assets</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Only the top holder of each selected species is recognized as the Custodian</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Selection is random, so users cannot predict which species will be snapped</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Custodian Leaderboard */}
      <CustodianLeaderboard />

      {/* Custodied Assets / Genomes Held */}
      <div className="rounded-lg bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-semibold">My Purebreed Genomes</h2>
          <div className="flex items-center gap-2">
            <Switch 
              id="custodied-only" 
              checked={showCustodiedOnly} 
              onCheckedChange={setShowCustodiedOnly} 
            />
            <Label htmlFor="custodied-only" className="text-sm cursor-pointer">
              Custodied Only
            </Label>
          </div>
        </div>
        
        {/* Genomes Grid - Card View */}
        <div className="p-4">
          <Collapsible open={genomesExpanded} onOpenChange={setGenomesExpanded}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">
                {showCustodiedOnly 
                  ? `${allGenomesHeld.filter(g => g.isCustodian).length} Custodied Purebreeds`
                  : `${allGenomesHeld.length} Total Genomes Held`
                }
              </p>
              {filteredGenomes.length > 6 && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    {genomesExpanded ? (
                      <>
                        <span className="text-xs mr-1">Less</span>
                        <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        <span className="text-xs mr-1">More ({filteredGenomes.length - 6})</span>
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visibleGenomes.slice(0, 6).map((genome, i) => (
                <TickerHoverCard key={i} ticker={genome.symbol.replace('$', '')}>
                  <div 
                    onClick={() => handleAssetClick(genome)}
                    className={cn(
                      "rounded-lg p-3 border transition-colors cursor-pointer",
                      genome.isCustodian 
                        ? "bg-success/5 border-success/30 hover:bg-success/10" 
                        : "bg-muted/50 border-border hover:bg-muted/70"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className={cn(
                        "font-mono text-sm font-bold",
                        genome.isCustodian ? "text-success" : "text-foreground"
                      )}>
                        {genome.symbol}
                      </p>
                      {genome.isCustodian && (
                        <Crown className="h-3 w-3 text-success" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{genome.name}</p>
                    <p className="text-xs font-mono mt-1">{genome.units}</p>
                  </div>
                </TickerHoverCard>
              ))}
            </div>
            
            <CollapsibleContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {visibleGenomes.slice(6).map((genome, i) => (
                  <TickerHoverCard key={i} ticker={genome.symbol.replace('$', '')}>
                    <div 
                      onClick={() => handleAssetClick(genome)}
                      className={cn(
                        "rounded-lg p-3 border transition-colors cursor-pointer",
                        genome.isCustodian 
                          ? "bg-success/5 border-success/30 hover:bg-success/10" 
                          : "bg-muted/50 border-border hover:bg-muted/70"
                      )}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className={cn(
                          "font-mono text-sm font-bold",
                          genome.isCustodian ? "text-success" : "text-foreground"
                        )}>
                          {genome.symbol}
                        </p>
                        {genome.isCustodian && (
                          <Crown className="h-3 w-3 text-success" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{genome.name}</p>
                      <p className="text-xs font-mono mt-1">{genome.units}</p>
                    </div>
                  </TickerHoverCard>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Reveal Dialog */}
      <Dialog open={!!selectedBox} onOpenChange={() => setSelectedBox(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reveal Mystery Box #{selectedBox?.id}</DialogTitle>
            <DialogDescription>
              Spend $1 to receive a randomized, non-revealing hint about which species might be included in the upcoming snapshot.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="h-24 w-24 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Box className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setSelectedBox(null)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={revealHint}>
              Reveal for $1
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Earnings Dashboard Dialog */}
      <EarningsDashboardDialog 
        open={earningsDialogOpen}
        onOpenChange={setEarningsDialogOpen}
        asset={selectedAsset}
      />
    </div>
  );
}
