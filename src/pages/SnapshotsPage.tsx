import { useState, useEffect } from 'react';
import { Box, Lock, Unlock, Clock, Info, Check, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Crown, Sparkles, TrendingUp, Flame, Users, Coins, Wallet, DollarSign, Dna, Heart } from 'lucide-react';
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

const initialBoxes: MysteryBox[] = Array.from({
  length: 10
}, (_, i) => ({
  id: i + 1,
  status: i < 6 ? 'blind' : 'empty',
  hint: i < 6 ? hints[i % hints.length] : undefined
}));

// Species images mapping
const speciesImages: Record<string, string> = {
  'FCBC121': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop',
  'FCBC203': 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=120&h=120&fit=crop',
  'FCBC156': 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=120&h=120&fit=crop',
  'FCBC312': 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=120&h=120&fit=crop',
  'FCBC167': 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=120&h=120&fit=crop',
  'FCBC45': 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=120&h=120&fit=crop',
  'FCBC89': 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=120&h=120&fit=crop',
  'FCBC38': 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=120&h=120&fit=crop',
  'FCBC12': 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=120&h=120&fit=crop',
  'FCBC200': 'https://images.unsplash.com/photo-1511222328814-01c6ed72b35e?w=120&h=120&fit=crop',
  'FCBC122': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=120&h=120&fit=crop',
  'FCBC19': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop',
  'FCBC56': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=120&h=120&fit=crop',
  'FCBC2': 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=120&h=120&fit=crop',
};

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

// Most Profitable Purebreeds Data
const profitablePurebreeds = [
  {
    symbol: 'FCBC121',
    name: 'Javan Rhinoceros',
    totalRevenue: '234.5 ETH',
    supplyBurnt: '45.2M',
    burnPercentage: 23,
    hybridsSpun: 156,
    custodianEarnings: '12.3 ETH',
    hybrids: [
      { name: 'Rhino-Tiger Hybrid', symbol: 'HYBRID-RT1', revenue: '45.2 ETH', minted: 2340 },
      { name: 'Rhino-Eagle Fusion', symbol: 'HYBRID-RE1', revenue: '32.1 ETH', minted: 1890 },
      { name: 'Ancient Rhino Variant', symbol: 'HYBRID-AR1', revenue: '28.7 ETH', minted: 1456 },
    ],
    breeders: [
      { address: '0x1234...5678', name: 'JariusOS.base.eth', contributions: 45, activity: 'High', wealth: { eth: '12.5', usdc: '45,000', fcbc: '2.3M', dna: '890K', hybrids: 23 }},
      { address: '0x8765...4321', name: 'cryptowhale.base.eth', contributions: 32, activity: 'Medium', wealth: { eth: '8.2', usdc: '32,000', fcbc: '1.8M', dna: '560K', hybrids: 15 }},
      { address: '0xABCD...EFGH', name: 'wildkeeper.base.eth', contributions: 28, activity: 'High', wealth: { eth: '5.4', usdc: '21,000', fcbc: '950K', dna: '320K', hybrids: 9 }},
    ],
    communityWealth: { eth: '156.7', usdc: '520,000', fcbc: '45.2M', dna: '12.3M', hybrids: 234 }
  },
  {
    symbol: 'FCBC203',
    name: 'Amur Leopard',
    totalRevenue: '189.2 ETH',
    supplyBurnt: '38.1M',
    burnPercentage: 19,
    hybridsSpun: 98,
    custodianEarnings: '9.8 ETH',
    hybrids: [
      { name: 'Leopard-Whale Mix', symbol: 'HYBRID-LW1', revenue: '38.9 ETH', minted: 1780 },
      { name: 'Snow Leopard Cross', symbol: 'HYBRID-SL1', revenue: '29.4 ETH', minted: 1234 },
    ],
    breeders: [
      { address: '0x5555...6666', name: 'dnamaster.base.eth', contributions: 38, activity: 'Very High', wealth: { eth: '18.9', usdc: '67,000', fcbc: '3.1M', dna: '1.2M', hybrids: 31 }},
      { address: '0x7777...8888', name: null, contributions: 22, activity: 'Medium', wealth: { eth: '4.1', usdc: '15,000', fcbc: '780K', dna: '210K', hybrids: 7 }},
    ],
    communityWealth: { eth: '98.4', usdc: '340,000', fcbc: '28.9M', dna: '8.7M', hybrids: 156 }
  },
  {
    symbol: 'FCBC156',
    name: 'Vaquita Porpoise',
    totalRevenue: '145.8 ETH',
    supplyBurnt: '29.7M',
    burnPercentage: 15,
    hybridsSpun: 67,
    custodianEarnings: '7.2 ETH',
    hybrids: [
      { name: 'Vaquita-Dolphin Blend', symbol: 'HYBRID-VD1', revenue: '25.3 ETH', minted: 890 },
    ],
    breeders: [
      { address: '0x9999...1111', name: 'oceanlover.base.eth', contributions: 51, activity: 'Very High', wealth: { eth: '22.1', usdc: '89,000', fcbc: '4.5M', dna: '1.8M', hybrids: 42 }},
    ],
    communityWealth: { eth: '67.3', usdc: '210,000', fcbc: '18.4M', dna: '5.2M', hybrids: 89 }
  }
];

export function SnapshotsPage() {
  const [boxes, setBoxes] = useState<MysteryBox[]>(initialBoxes);
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [showCustodiedOnly, setShowCustodiedOnly] = useState(false);
  const [genomesExpanded, setGenomesExpanded] = useState(false);
  const [earningsDialogOpen, setEarningsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{ ticker: string; name: string } | null>(null);
  const [expandedPurebreed, setExpandedPurebreed] = useState<string | null>(null);
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
      {/* Header */}
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
      <div className="rounded-xl bg-gradient-to-br from-card to-muted/30 p-6 shadow-card border border-border/50">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">EPOCH 1 ENDS IN</span>
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
            <div key={i} className="flex flex-col items-center bg-background/80 backdrop-blur rounded-lg p-3 min-w-[70px] border border-border/50 shadow-sm">
              <span className="text-2xl font-bold font-mono text-primary">{item.value}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        {/* Epoch 0 Snaps */}
        <div className="flex flex-wrap justify-center gap-2 items-center">
          <span className="text-xs text-muted-foreground mr-1">Epoch 0 snaps:</span>
          {epoch0Snaps.map(snap => (
            <TickerHoverCard key={snap} ticker={snap.replace('$', '')}>
              <Badge 
                variant="secondary" 
                className="text-xs font-mono cursor-pointer transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-md"
              >
                {snap}
              </Badge>
            </TickerHoverCard>
          ))}
        </div>
      </div>

      {/* How Snapshots Work - Moved above Leading Pre-Snapshots */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-card border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-semibold">How Snapshots Work</h2>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>A snapshot event is a scheduled moment where the system records blockchain holdings to identify the top holder of randomly selected FCBC Pre-assets.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Snapshots occur once every week',
              'Each event selects 3 to 10 random Pre-assets',
              'Only the top holder of each selected species is recognized as the Custodian',
              'Selection is random, so users cannot predict which species will be snapped'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-background/50">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-Snapshots Leading */}
      <div className="rounded-xl bg-card p-4 shadow-card border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-success/10">
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
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
        <div className="grid grid-cols-2 gap-3">
          {leadingPreSnapshots.map((species, i) => (
            <TickerHoverCard key={i} ticker={species.symbol}>
              <div className="group bg-gradient-to-br from-success/5 to-transparent rounded-xl p-3 border border-success/20 cursor-pointer hover:border-success/40 hover:shadow-md transition-all duration-200">
                <div className="flex gap-3">
                  <img 
                    src={speciesImages[species.symbol]} 
                    alt={species.name}
                    className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
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

      {/* Mystery Boxes - Modernized */}
      <div className="rounded-xl bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-card border border-border/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Mystery Boxes</h2>
                <p className="text-xs text-muted-foreground">Tap to reveal species hints</p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">$1 each</Badge>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {boxes.map(box => (
              <button 
                key={box.id} 
                onClick={() => handleBoxClick(box)} 
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group",
                  box.status === 'empty' && "bg-muted/20 border-2 border-dashed border-border/50 cursor-not-allowed opacity-50",
                  box.status === 'blind' && "bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105",
                  box.status === 'revealed' && "bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30"
                )}
              >
                {box.status === 'empty' ? (
                  <span className="text-muted-foreground text-[10px]">Empty</span>
                ) : box.status === 'revealed' ? (
                  <>
                    <Unlock className="h-5 w-5 text-success" />
                    <span className="text-[10px] text-success font-medium">Open</span>
                  </>
                ) : (
                  <>
                    <div className="absolute -top-1 -right-1 z-10">
                      <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center">
                          <span className="text-[8px] text-primary-foreground font-bold">?</span>
                        </span>
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
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Dna className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-semibold">My Purebreed Genomes</h2>
          </div>
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
              {visibleGenomes.slice(0, 6).map((genome, i) => {
                const ticker = genome.symbol.replace('$', '');
                return (
                  <TickerHoverCard key={i} ticker={ticker}>
                    <div 
                      onClick={() => handleAssetClick(genome)}
                      className={cn(
                        "group rounded-xl p-3 border transition-all duration-200 cursor-pointer hover:shadow-md",
                        genome.isCustodian 
                          ? "bg-gradient-to-br from-success/5 to-transparent border-success/30 hover:border-success/50" 
                          : "bg-muted/30 border-border hover:border-border/80"
                      )}
                    >
                      <div className="flex gap-3">
                        <img 
                          src={speciesImages[ticker] || 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop'} 
                          alt={genome.name}
                          className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-0.5">
                            <p className={cn(
                              "font-mono text-sm font-bold truncate",
                              genome.isCustodian ? "text-success" : "text-foreground"
                            )}>
                              {genome.symbol}
                            </p>
                            {genome.isCustodian && (
                              <Crown className="h-3 w-3 text-success shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{genome.name}</p>
                          <p className="text-xs font-mono mt-0.5">{genome.units}</p>
                        </div>
                      </div>
                    </div>
                  </TickerHoverCard>
                );
              })}
            </div>
            
            <CollapsibleContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {visibleGenomes.slice(6).map((genome, i) => {
                  const ticker = genome.symbol.replace('$', '');
                  return (
                    <TickerHoverCard key={i} ticker={ticker}>
                      <div 
                        onClick={() => handleAssetClick(genome)}
                        className={cn(
                          "group rounded-xl p-3 border transition-all duration-200 cursor-pointer hover:shadow-md",
                          genome.isCustodian 
                            ? "bg-gradient-to-br from-success/5 to-transparent border-success/30 hover:border-success/50" 
                            : "bg-muted/30 border-border hover:border-border/80"
                        )}
                      >
                        <div className="flex gap-3">
                          <img 
                            src={speciesImages[ticker] || 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop'} 
                            alt={genome.name}
                            className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-0.5">
                              <p className={cn(
                                "font-mono text-sm font-bold truncate",
                                genome.isCustodian ? "text-success" : "text-foreground"
                              )}>
                                {genome.symbol}
                              </p>
                              {genome.isCustodian && (
                                <Crown className="h-3 w-3 text-success shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{genome.name}</p>
                            <p className="text-xs font-mono mt-0.5">{genome.units}</p>
                          </div>
                        </div>
                      </div>
                    </TickerHoverCard>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Custodian Leaderboard - Moved under My Purebreed Genomes */}
      <CustodianLeaderboard />

      {/* Favourite Pre-Snapshot Purebreeds - New Section */}
      <FavouritePurebreedsSection />

      {/* Most Profitable Purebreeds Syndicate */}
      <div className="rounded-xl bg-card shadow-card border border-border/50">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-warning/10">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h2 className="font-semibold">Most Profitable Purebreeds Syndicate</h2>
              <p className="text-xs text-muted-foreground">Revenue, hybrids & community breakdown</p>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-border/50">
          {profitablePurebreeds.map((purebreed) => (
            <div key={purebreed.symbol} className="p-4">
              <button
                onClick={() => setExpandedPurebreed(expandedPurebreed === purebreed.symbol ? null : purebreed.symbol)}
                className="w-full"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={speciesImages[purebreed.symbol]} 
                    alt={purebreed.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-primary">${purebreed.symbol}</p>
                      <Badge variant="outline" className="text-[10px]">{purebreed.hybridsSpun} hybrids</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{purebreed.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-success">
                        <Coins className="h-3 w-3" />
                        <span className="text-xs font-medium">{purebreed.totalRevenue}</span>
                      </div>
                      <div className="flex items-center gap-1 text-destructive">
                        <Flame className="h-3 w-3" />
                        <span className="text-xs">{purebreed.supplyBurnt} burnt</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    expandedPurebreed === purebreed.symbol && "rotate-180"
                  )} />
                </div>
              </button>
              
              {expandedPurebreed === purebreed.symbol && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  {/* Stats Overview */}
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

                  {/* Burn Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Supply Burnt Progress</span>
                      <span className="font-medium">{purebreed.supplyBurnt}</span>
                    </div>
                    <Progress value={purebreed.burnPercentage} className="h-2" />
                  </div>

                  {/* Hybrids Spun */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Hybrids Created
                    </h4>
                    <div className="space-y-2">
                      {purebreed.hybrids.map((hybrid, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-2">
                          <div>
                            <p className="text-xs font-medium">{hybrid.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{hybrid.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-success">{hybrid.revenue}</p>
                            <p className="text-[10px] text-muted-foreground">{hybrid.minted.toLocaleString()} minted</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Community Wealth */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                      <Wallet className="h-3 w-3 text-primary" />
                      Community Wealth
                    </h4>
                    <div className="grid grid-cols-5 gap-1">
                      <div className="rounded-lg bg-muted/30 p-2 text-center">
                        <p className="text-xs font-bold">{purebreed.communityWealth.eth}</p>
                        <p className="text-[9px] text-muted-foreground">ETH</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-2 text-center">
                        <p className="text-xs font-bold">{purebreed.communityWealth.usdc}</p>
                        <p className="text-[9px] text-muted-foreground">USDC</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-2 text-center">
                        <p className="text-xs font-bold">{purebreed.communityWealth.fcbc}</p>
                        <p className="text-[9px] text-muted-foreground">FCBC</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-2 text-center">
                        <p className="text-xs font-bold">{purebreed.communityWealth.dna}</p>
                        <p className="text-[9px] text-muted-foreground">DNA</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-2 text-center">
                        <p className="text-xs font-bold">{purebreed.communityWealth.hybrids}</p>
                        <p className="text-[9px] text-muted-foreground">Hybrids</p>
                      </div>
                    </div>
                  </div>

                  {/* Breeders Breakdown */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                      <Users className="h-3 w-3 text-primary" />
                      Top Breeders
                    </h4>
                    <div className="space-y-2">
                      {purebreed.breeders.map((breeder, i) => (
                        <div key={i} className="rounded-lg bg-muted/30 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <a 
                                href={`https://basescan.org/address/${breeder.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs hover:text-primary transition-colors flex items-center gap-1"
                              >
                                {breeder.name || breeder.address}
                                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                              </a>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] px-1.5",
                                breeder.activity === 'Very High' && "border-success/50 text-success",
                                breeder.activity === 'High' && "border-primary/50 text-primary",
                                breeder.activity === 'Medium' && "border-warning/50 text-warning"
                              )}
                            >
                              {breeder.activity}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                            <span>{breeder.contributions} contributions</span>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            <div className="text-center">
                              <p className="text-[10px] font-medium">{breeder.wealth.eth}</p>
                              <p className="text-[8px] text-muted-foreground">ETH</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-medium">{breeder.wealth.usdc}</p>
                              <p className="text-[8px] text-muted-foreground">USDC</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-medium">{breeder.wealth.fcbc}</p>
                              <p className="text-[8px] text-muted-foreground">FCBC</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-medium">{breeder.wealth.dna}</p>
                              <p className="text-[8px] text-muted-foreground">DNA</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-medium">{breeder.wealth.hybrids}</p>
                              <p className="text-[8px] text-muted-foreground">Hybrids</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
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
            <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
              <Box className="h-12 w-12 text-primary relative z-10" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setSelectedBox(null)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={revealHint}>
              <Lock className="h-4 w-4 mr-2" />
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
