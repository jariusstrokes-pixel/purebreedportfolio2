import { useState, useEffect } from 'react';
import { Box, Lock, Unlock, Clock, Info, Check, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Crown, Sparkles, TrendingUp, Flame, Users, Coins, Wallet, Dna, Gift } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { FavouritePurebreedsSection } from '@/components/FavouritePurebreedsSection';

interface MysteryBox {
  id: number;
  status: 'blind' | 'revealed' | 'empty';
  hint?: string;
}

const hints = ["This species loves the deep ocean...", "Look for creatures with scales of gold...", "Ancient DNA from the forest realm...", "Wings that shimmer in moonlight...", "Born from volcanic ash...", "The rarest of the aquatic beings..."];

const initialBoxes: MysteryBox[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  status: i < 6 ? 'blind' : 'empty',
  hint: i < 6 ? hints[i % hints.length] : undefined
}));

// Extended genome list (49+ species with 18+ custodied)
const allGenomesHeld = [
  { symbol: '$FCBC121', name: 'Javan Rhinoceros', units: '12.5M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC203', name: 'Amur Leopard', units: '15.1M', isCustodian: true, type: 'post' as const },
  { symbol: '$FCBC156', name: 'Vaquita Porpoise', units: '9.3M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC312', name: 'Hawksbill Turtle', units: '22.3M', isCustodian: true, type: 'custodian' as const },
  { symbol: '$FCBC167', name: 'Yangtze Finless Porpoise', units: '11.2M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC45', name: 'Sumatran Tiger', units: '5.8M', isCustodian: true, type: 'post' as const },
  { symbol: '$FCBC89', name: 'Mountain Gorilla', units: '3.2M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC38', name: 'Golden Eagle', units: '7.4M', isCustodian: true, type: 'custodian' as const },
  { symbol: '$FCBC12', name: 'Snow Leopard', units: '2.1M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC200', name: 'Blue Whale', units: '18.9M', isCustodian: true, type: 'post' as const },
  { symbol: '$FCBC301', name: 'Siberian Tiger', units: '8.7M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC188', name: 'Orangutan', units: '6.2M', isCustodian: true, type: 'custodian' as const },
  { symbol: '$FCBC277', name: 'Komodo Dragon', units: '4.5M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC333', name: 'Red Panda', units: '9.1M', isCustodian: true, type: 'post' as const },
  { symbol: '$FCBC444', name: 'Cheetah', units: '7.8M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC555', name: 'Polar Bear', units: '12.3M', isCustodian: true, type: 'custodian' as const },
  { symbol: '$FCBC666', name: 'Gorilla', units: '5.4M', isCustodian: true, type: 'pre' as const },
  { symbol: '$FCBC777', name: 'Leopard', units: '8.9M', isCustodian: true, type: 'post' as const },
  // Non-custodied species
  ...Array.from({ length: 31 }, (_, i) => ({
    symbol: `$FCBC${800 + i}`,
    name: ['Tiger', 'Elephant', 'Rhino', 'Hippo', 'Giraffe', 'Zebra', 'Lion', 'Jaguar', 'Cougar', 'Lynx'][i % 10],
    units: `${(Math.random() * 10 + 1).toFixed(1)}M`,
    isCustodian: false,
    type: (i % 2 === 0 ? 'pre' : 'post') as 'pre' | 'post'
  }))
];

const epoch0Snaps = ['$FCBC121', '$FCBC19', '$FCBC56', '$FCBC2'];

const leadingPreSnapshots = [
  { id: '#122', symbol: 'FCBC122', name: 'Syrian Wild Ass', units: '12.5M', rank: '#1' },
  { id: '#38', symbol: 'FCBC38', name: 'Golden Eagle', units: '8.2M', rank: '#1' },
  { id: '#12', symbol: 'FCBC12', name: 'Snow Leopard', units: '15.1M', rank: '#1' },
  { id: '#200', symbol: 'FCBC200', name: 'Blue Whale', units: '9.3M', rank: '#1' }
];

// Extended Most Profitable Purebreeds (25+)
const profitablePurebreeds = Array.from({ length: 28 }, (_, i) => ({
  symbol: `FCBC${100 + i}`,
  name: ['Javan Rhinoceros', 'Amur Leopard', 'Vaquita Porpoise', 'Sumatran Tiger', 'Mountain Gorilla', 'Snow Leopard', 'Blue Whale', 'Giant Panda'][i % 8],
  totalRevenue: `${(Math.random() * 200 + 50).toFixed(1)} ETH`,
  supplyBurnt: `${(Math.random() * 50 + 10).toFixed(1)}M`,
  burnPercentage: Math.floor(Math.random() * 30) + 10,
  hybridsSpun: Math.floor(Math.random() * 150) + 20,
  custodianEarnings: `${(Math.random() * 15 + 2).toFixed(1)} ETH`,
  hybrids: [
    { name: 'Hybrid Alpha', symbol: `HYBRID-${i}A`, revenue: `${(Math.random() * 40 + 10).toFixed(1)} ETH`, minted: Math.floor(Math.random() * 2000) + 500 }
  ],
  breeders: [
    { address: '0x1234...5678', name: 'breeder.base.eth', contributions: Math.floor(Math.random() * 50) + 10, activity: 'High', wealth: { eth: (Math.random() * 20).toFixed(1), usdc: `${Math.floor(Math.random() * 50)}K`, fcbc: `${(Math.random() * 3).toFixed(1)}M`, dna: `${(Math.random() * 1).toFixed(1)}M`, hybrids: Math.floor(Math.random() * 30) } }
  ],
  communityWealth: { eth: (Math.random() * 150).toFixed(1), usdc: `${Math.floor(Math.random() * 500)}K`, fcbc: `${(Math.random() * 40).toFixed(1)}M`, dna: `${(Math.random() * 12).toFixed(1)}M`, hybrids: Math.floor(Math.random() * 200) + 50 }
}));

const getCardBorderColor = (type: string, isCustodian: boolean) => {
  if (isCustodian && type === 'pre') return 'border-l-4 border-l-amber-500 border-success/40 bg-gradient-to-r from-amber-500/5 to-success/5';
  if (isCustodian) return 'border-success/40 bg-gradient-to-br from-success/5 to-transparent';
  if (type === 'pre') return 'border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent';
  return 'border-blue-500/40 bg-gradient-to-br from-blue-500/5 to-transparent';
};

export function SnapshotsPage() {
  const [boxes, setBoxes] = useState<MysteryBox[]>(initialBoxes);
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [showCustodiedOnly, setShowCustodiedOnly] = useState(false);
  const [genomesExpanded, setGenomesExpanded] = useState(false);
  const [earningsDialogOpen, setEarningsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{ ticker: string; name: string } | null>(null);
  const [expandedPurebreed, setExpandedPurebreed] = useState<string | null>(null);
  const [syndicateVisibleCount, setSyndicateVisibleCount] = useState(10);
  const [countdown, setCountdown] = useState({ days: 2, hours: 14, minutes: 30, seconds: 39 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 6; hours = 23; minutes = 59; seconds = 59; }
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
    setBoxes(prev => prev.map(b => b.id === selectedBox.id ? { ...b, status: 'revealed' as const } : b));
    toast.success(`Hint revealed for $1! "${selectedBox.hint}"`);
    setSelectedBox(null);
  };

  const handleAssetClick = (asset: { symbol: string; name: string; isCustodian: boolean }) => {
    if (asset.isCustodian) {
      setSelectedAsset({ ticker: asset.symbol, name: asset.name });
      setEarningsDialogOpen(true);
    }
  };

  const filteredGenomes = showCustodiedOnly ? allGenomesHeld.filter(g => g.isCustodian) : allGenomesHeld;
  const visibleGenomes = genomesExpanded ? filteredGenomes : filteredGenomes.slice(0, 6);
  const displayedSyndicates = profitablePurebreeds.slice(0, syndicateVisibleCount);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold font-serif">FCBC PUREBREEDS</h1>
        <h2 className="text-xl font-semibold text-primary">Snapshots and Custody</h2>
        <p className="text-muted-foreground text-center text-sm px-[25px] font-sans">
          Monitor Snapshot Events and earn custodian rights of the digital genomic signature of endangered species.
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="rounded-xl bg-gradient-to-br from-card to-muted/30 p-6 shadow-card border border-border/50">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">EPOCH 1 ENDS IN</span>
        </div>
        <div className="flex justify-center gap-3 mb-4">
          {[{ value: countdown.days, label: 'DAYS' }, { value: countdown.hours, label: 'HOURS' }, { value: countdown.minutes, label: 'MIN' }, { value: countdown.seconds, label: 'SEC' }].map((item, i) => (
            <div key={i} className="flex flex-col items-center bg-background/80 backdrop-blur rounded-lg p-3 min-w-[70px] border border-border/50 shadow-sm">
              <span className="text-2xl font-bold font-mono text-primary">{item.value}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 items-center">
          <span className="text-xs text-muted-foreground mr-1">Epoch 0 snaps:</span>
          {epoch0Snaps.map(snap => (
            <TickerHoverCard key={snap} ticker={snap.replace('$', '')}>
              <Badge variant="secondary" className="text-xs font-mono cursor-pointer transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                {snap}
              </Badge>
            </TickerHoverCard>
          ))}
        </div>
      </div>

      {/* How Snapshots Work */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-card border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10"><Info className="h-5 w-5 text-primary" /></div>
          <h2 className="font-semibold">How Snapshots Work</h2>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>A snapshot event is a scheduled moment where the system records blockchain holdings to identify the top holder of randomly selected FCBC Pre-assets.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['Snapshots occur once every week', 'Each event selects 3 to 10 random Pre-assets', 'Only the top holder of each selected species is recognized as the Custodian', 'Selection is random, so users cannot predict which species will be snapped'].map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-background/50">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leading Pre-Snapshots */}
      <div className="rounded-xl bg-card p-4 shadow-card border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-success/10"><TrendingUp className="h-4 w-4 text-success" /></div>
          <h2 className="font-semibold">Leading Pre-Snapshots</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {leadingPreSnapshots.map((species, i) => (
            <TickerHoverCard key={i} ticker={species.symbol}>
              <div className="group bg-gradient-to-br from-success/5 to-transparent rounded-xl p-3 border border-success/20 cursor-pointer hover:border-success/40 hover:shadow-md transition-all duration-200">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg group-hover:scale-105 transition-transform">🦁</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{species.name}</p>
                    <p className="font-mono text-sm font-bold text-success">${species.symbol}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 text-success border-success/30">{species.rank}</Badge>
                      <span className="text-xs text-muted-foreground">{species.units}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TickerHoverCard>
          ))}
        </div>
      </div>

      {/* Snapshot Hint BlindBoxes */}
      <div className="rounded-xl bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-card border border-border/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-warning/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-warning/20 animate-pulse">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Snapshot Hint BlindBoxes</h2>
                <p className="text-xs text-muted-foreground">Tap to reveal species hints</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-primary/20 to-warning/20 text-primary border-primary/30 animate-pulse">$1 each</Badge>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {boxes.map(box => (
              <button key={box.id} onClick={() => handleBoxClick(box)} className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group",
                box.status === 'empty' && "bg-muted/20 border-2 border-dashed border-border/50 cursor-not-allowed opacity-50",
                box.status === 'blind' && "bg-gradient-to-br from-primary/10 to-warning/10 border-2 border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105",
                box.status === 'revealed' && "bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30"
              )}>
                {box.status === 'empty' ? (
                  <span className="text-muted-foreground text-[10px]">Empty</span>
                ) : box.status === 'revealed' ? (
                  <><Unlock className="h-5 w-5 text-success" /><span className="text-[10px] text-success font-medium">Open</span></>
                ) : (
                  <>
                    <div className="absolute -top-1 -right-1 z-10">
                      <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center"><span className="text-[8px] text-primary-foreground font-bold">?</span></span>
                      </span>
                    </div>
                    <Box className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-muted-foreground font-mono">#{box.id}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My Purebreed Genomes */}
      <div className="rounded-xl bg-card shadow-card border border-border/50">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10"><Dna className="h-4 w-4 text-primary" /></div>
            <h2 className="font-semibold">My Purebreed Genomes</h2>
            <Badge variant="outline" className="text-[10px]">{allGenomesHeld.length} genomes</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="custodied-only" checked={showCustodiedOnly} onCheckedChange={setShowCustodiedOnly} />
            <Label htmlFor="custodied-only" className="text-sm cursor-pointer">Custodied Only</Label>
          </div>
        </div>
        <div className="p-4">
          <Collapsible open={genomesExpanded} onOpenChange={setGenomesExpanded}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{showCustodiedOnly ? `${allGenomesHeld.filter(g => g.isCustodian).length} Custodied` : `${allGenomesHeld.length} Total`} • Total Supply: 1B</p>
              {filteredGenomes.length > 6 && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    {genomesExpanded ? <><span className="text-xs mr-1">Less</span><ChevronUp className="h-3 w-3" /></> : <><span className="text-xs mr-1">More ({filteredGenomes.length - 6})</span><ChevronDown className="h-3 w-3" /></>}
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visibleGenomes.slice(0, 6).map((genome, i) => (
                <div key={i} onClick={() => handleAssetClick(genome)} className={cn("group rounded-xl p-3 border-2 transition-all duration-200 cursor-pointer hover:shadow-md", getCardBorderColor(genome.type, genome.isCustodian))}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg group-hover:scale-105 transition-transform">🦁</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-0.5">
                        <p className={cn("font-mono text-sm font-bold truncate", genome.isCustodian ? "text-success" : "text-foreground")}>{genome.symbol}</p>
                        {genome.isCustodian && <Crown className="h-3 w-3 text-success shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{genome.name}</p>
                      <p className="text-xs font-mono mt-0.5">{genome.units}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {visibleGenomes.slice(6).map((genome, i) => (
                  <div key={i} onClick={() => handleAssetClick(genome)} className={cn("group rounded-xl p-3 border-2 transition-all duration-200 cursor-pointer hover:shadow-md", getCardBorderColor(genome.type, genome.isCustodian))}>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">🦁</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <p className={cn("font-mono text-sm font-bold truncate", genome.isCustodian ? "text-success" : "text-foreground")}>{genome.symbol}</p>
                          {genome.isCustodian && <Crown className="h-3 w-3 text-success shrink-0" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{genome.name}</p>
                        <p className="text-xs font-mono mt-0.5">{genome.units}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <CustodianLeaderboard />
      <FavouritePurebreedsSection />

      {/* Syndicate */}
      <div className="rounded-xl bg-card shadow-card border border-border/50">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-warning/10"><TrendingUp className="h-5 w-5 text-warning" /></div>
            <div>
              <h2 className="font-semibold">Syndicate</h2>
              <p className="text-xs text-muted-foreground">Revenue, hybrids & community breakdown</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[10, 25, 50].map((count) => (
              <Button key={count} variant={syndicateVisibleCount === count ? "default" : "outline"} size="sm" className="h-6 text-xs px-2" onClick={() => setSyndicateVisibleCount(count)}>
                Top {count}
              </Button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {displayedSyndicates.map((purebreed) => (
            <div key={purebreed.symbol} className="p-4">
              <button onClick={() => setExpandedPurebreed(expandedPurebreed === purebreed.symbol ? null : purebreed.symbol)} className="w-full">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl">🦁</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-primary">${purebreed.symbol}</p>
                      <Badge variant="outline" className="text-[10px]">{purebreed.hybridsSpun} hybrids</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{purebreed.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-success"><Coins className="h-3 w-3" /><span className="text-xs font-medium">{purebreed.totalRevenue}</span></div>
                      <div className="flex items-center gap-1 text-destructive"><Flame className="h-3 w-3" /><span className="text-xs">{purebreed.supplyBurnt} burnt</span></div>
                    </div>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", expandedPurebreed === purebreed.symbol && "rotate-180")} />
                </div>
              </button>
              {expandedPurebreed === purebreed.symbol && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-success/5 border border-success/20 p-3 text-center">
                      <p className="text-lg font-bold text-success">{purebreed.totalRevenue}</p>
                      <p className="text-[10px] text-muted-foreground">Total Revenue</p>
                    </div>
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
                      <p className="text-lg font-bold text-primary">{purebreed.custodianEarnings}</p>
                      <p className="text-[10px] text-muted-foreground">Custodian Earnings</p>
                    </div>
                    <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-center">
                      <p className="text-lg font-bold text-destructive">{purebreed.burnPercentage}%</p>
                      <p className="text-[10px] text-muted-foreground">Supply Burnt</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Supply Burnt Progress</span><span className="font-medium">{purebreed.supplyBurnt}</span></div>
                    <Progress value={purebreed.burnPercentage} className="h-2" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={!!selectedBox} onOpenChange={() => setSelectedBox(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader><DialogTitle>Reveal Hint?</DialogTitle><DialogDescription>Pay $1 to reveal a clue about which species might be snapped next.</DialogDescription></DialogHeader>
          <div className="flex gap-2 mt-4"><Button variant="outline" onClick={() => setSelectedBox(null)} className="flex-1">Cancel</Button><Button onClick={revealHint} className="flex-1">Pay $1</Button></div>
        </DialogContent>
      </Dialog>
      <EarningsDashboardDialog open={earningsDialogOpen} onOpenChange={setEarningsDialogOpen} asset={selectedAsset} />
    </div>
  );
}
