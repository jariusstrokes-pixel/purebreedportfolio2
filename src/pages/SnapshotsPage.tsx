import { useState, useEffect } from 'react';
import { Box, Lock, Unlock, Clock, Info, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CustodianLeaderboard } from '@/components/CustodianLeaderboard';

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

const custodiedAssets = [{
  name: 'Javan Rhinoceros',
  symbol: '$FCBC121',
  units: '12.5M',
  custodian: '0x1234...5678',
  isMine: true
}, {
  name: 'Sumatran Tiger',
  symbol: '$FCBC45',
  units: '8.2M',
  custodian: '0x8765...4321',
  isMine: false
}, {
  name: 'Amur Leopard',
  symbol: '$FCBC203',
  units: '15.1M',
  custodian: '0x1234...5678',
  isMine: true
}, {
  name: 'Mountain Gorilla',
  symbol: '$FCBC89',
  units: '6.7M',
  custodian: '0x9999...1111',
  isMine: false
}, {
  name: 'Vaquita Porpoise',
  symbol: '$FCBC156',
  units: '9.3M',
  custodian: '0x1234...5678',
  isMine: true
}];

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

const myCustodiedSpecies = [
  { symbol: '$FCBC121', name: 'Javan Rhinoceros', units: '12.5M', rank: '#1' },
  { symbol: '$FCBC203', name: 'Amur Leopard', units: '15.1M', rank: '#1' },
  { symbol: '$FCBC156', name: 'Vaquita Porpoise', units: '9.3M', rank: '#1' },
  { symbol: '$FCBC312', name: 'Hawksbill Turtle', units: '22.3M', rank: '#1' },
  { symbol: '$FCBC167', name: 'Yangtze Finless Porpoise', units: '11.2M', rank: '#1' },
];

export function SnapshotsPage() {
  const [boxes, setBoxes] = useState<MysteryBox[]>(initialBoxes);
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [showMyHoldings, setShowMyHoldings] = useState(false);
  const [custodiedExpanded, setCustodiedExpanded] = useState(false);
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

  const filteredAssets = showMyHoldings ? custodiedAssets.filter(a => a.isMine) : custodiedAssets;
  const visibleCustodied = custodiedExpanded ? myCustodiedSpecies : myCustodiedSpecies.slice(0, 3);

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
            <Badge key={snap} variant="secondary" className="text-xs font-mono">
              {snap}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pre-Snapshots Leading */}
      <div className="rounded-lg bg-card p-4 shadow-card">
        <h2 className="font-semibold mb-3">Leading Pre-Snapshots</h2>
        <div className="grid grid-cols-2 gap-2">
          {leadingPreSnapshots.map((species, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3 border border-success/20">
              <p className="text-xs text-muted-foreground truncate">{species.name}</p>
              <p className="font-mono text-sm font-bold">${species.symbol}</p>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="outline" className="text-[10px] px-1 py-0 text-success border-success/30">{species.rank}</Badge>
                <span className="text-xs text-muted-foreground">{species.units}</span>
              </div>
            </div>
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

      {/* Custodied Assets */}
      <div className="rounded-lg bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-semibold">Custodied Assets</h2>
          <div className="flex items-center gap-2">
            <Switch id="my-holdings" checked={showMyHoldings} onCheckedChange={setShowMyHoldings} />
            <Label htmlFor="my-holdings" className="text-sm cursor-pointer">
              My Holdings Only
            </Label>
          </div>
        </div>
        
        {/* My Custodied Species Cards - Expandable */}
        <div className="p-4 border-b border-border">
          <Collapsible open={custodiedExpanded} onOpenChange={setCustodiedExpanded}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">My Custodied Species ({myCustodiedSpecies.length})</p>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  {custodiedExpanded ? (
                    <>
                      <span className="text-xs mr-1">Less</span>
                      <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs mr-1">More</span>
                      <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {visibleCustodied.slice(0, 3).map((species, i) => (
                <a 
                  key={i} 
                  href={`https://zora.co/coin/base:${species.symbol.replace('$', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-success/5 rounded-lg p-2 text-center border border-success/20 hover:bg-success/10 transition-colors group"
                >
                  <p className="font-mono text-xs font-bold text-success flex items-center justify-center gap-1">
                    {species.symbol}
                    <ExternalLink className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{species.name}</p>
                </a>
              ))}
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {visibleCustodied.slice(3).map((species, i) => (
                  <a 
                    key={i} 
                    href={`https://zora.co/coin/base:${species.symbol.replace('$', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-success/5 rounded-lg p-2 text-center border border-success/20 hover:bg-success/10 transition-colors group"
                  >
                    <p className="font-mono text-xs font-bold text-success flex items-center justify-center gap-1">
                      {species.symbol}
                      <ExternalLink className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{species.name}</p>
                  </a>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Ticker</th>
                <th className="p-4 font-medium text-right">Units</th>
                <th className="p-4 font-medium text-right">Custodian</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4 font-medium">{asset.name}</td>
                  <td className="p-4">
                    <a 
                      href={`https://zora.co/coin/base:${asset.symbol.replace('$', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-muted-foreground hover:text-primary transition-colors"
                    >
                      {asset.symbol}
                    </a>
                  </td>
                  <td className="p-4 text-right font-mono">{asset.units}</td>
                  <td className="p-4 text-right">
                    <span className={cn(
                      "font-mono text-xs px-2 py-1 rounded",
                      asset.isMine ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    )}>
                      {asset.isMine ? 'You' : asset.custodian}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
