import { useState, useMemo } from 'react';
import { Species } from '@/hooks/useSpecies';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ArrowUpDown, ExternalLink, LayoutGrid, Table as TableIcon, Crown, Sparkles, TrendingUp, Users, Wallet, Coins, Flame } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PurebreedsDashboardProps {
  species: Species[];
  isLoading?: boolean;
  className?: string;
}

type SortField = 'name' | 'units' | 'value' | 'marketCap' | 'holders';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'pre' | 'post' | 'custodian';

// Generate extended species data (49+ species with 18+ custodied)
const generateExtendedTokens = () => {
  const animalNames = [
    'Javan Rhinoceros', 'Sumatran Tiger', 'Amur Leopard', 'Mountain Gorilla', 'Vaquita Porpoise',
    'Hawksbill Turtle', 'Saola', 'Cross River Gorilla', 'Yangtze Finless Porpoise', 'Black Rhino',
    'Philippine Eagle', 'Sumatran Elephant', 'Siberian Tiger', 'Giant Panda', 'Snow Leopard',
    'African Wild Dog', 'Blue Whale', 'Orangutan', 'Komodo Dragon', 'Red Panda',
    'Cheetah', 'Polar Bear', 'Gorilla', 'Leopard', 'Tiger',
    'Elephant', 'Rhinoceros', 'Hippopotamus', 'Giraffe', 'Zebra',
    'Lion', 'Jaguar', 'Cougar', 'Lynx', 'Ocelot',
    'Wolf', 'Fox', 'Bear', 'Seal', 'Walrus',
    'Dolphin', 'Whale', 'Shark', 'Manta Ray', 'Sea Turtle',
    'Eagle', 'Falcon', 'Hawk', 'Owl', 'Condor', 'Pangolin', 'Kakapo'
  ];
  
  const types: ('pre' | 'post' | 'custodian')[] = ['pre', 'post', 'custodian'];
  const tokens = [];
  
  for (let i = 0; i < 52; i++) {
    const isCustodian = i < 18; // First 18 are custodied
    const type = isCustodian ? 'custodian' : types[i % 2] as 'pre' | 'post';
    const isAdminCustodian = i === 5 || i === 12; // warplette is custodian
    
    tokens.push({
      id: String(i + 1),
      name: animalNames[i % animalNames.length],
      ticker: `FCBC${100 + i}`,
      units: Math.floor(Math.random() * 100000) + 10000,
      value: Math.floor(Math.random() * 50000) + 1000,
      mcap: `$${(Math.random() * 3 + 0.2).toFixed(1)}M`,
      holders: Math.floor(Math.random() * 500) + 50,
      type,
      isCustodian,
      isAdminCustodian,
      imageUrl: `https://images.unsplash.com/photo-${1518709766631 + i}?w=120&h=120&fit=crop`,
      // Syndicate data
      totalRevenue: `${(Math.random() * 100 + 10).toFixed(1)} ETH`,
      supplyBurnt: `${(Math.random() * 50).toFixed(1)}M`,
      burnPercentage: Math.floor(Math.random() * 30) + 5,
      hybridsSpun: Math.floor(Math.random() * 100) + 10,
      communityWealth: {
        eth: (Math.random() * 100).toFixed(1),
        usdc: `${Math.floor(Math.random() * 500)}K`,
        fcbc: `${(Math.random() * 30).toFixed(1)}M`,
        dna: `${(Math.random() * 10).toFixed(1)}M`,
        hybrids: Math.floor(Math.random() * 200)
      }
    });
  }
  
  return tokens;
};

const dummyTokens = generateExtendedTokens();

const getTypeColor = (type: string, isCustodian: boolean, isAdminCustodian: boolean) => {
  if (isAdminCustodian) return 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-purple-500/5';
  if (isCustodian && type === 'pre') return 'border-l-4 border-l-amber-500 border-success/50 bg-gradient-to-r from-amber-500/10 via-transparent to-success/10';
  if (isCustodian) return 'border-success/50 bg-gradient-to-br from-success/10 to-success/5';
  switch (type) {
    case 'pre': return 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-amber-500/5';
    case 'post': return 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5';
    default: return 'border-border';
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'pre': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    case 'post': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    case 'custodian': return 'bg-success/10 text-success border-success/30';
    default: return '';
  }
};

export function PurebreedsDashboard({ species, isLoading, className }: PurebreedsDashboardProps) {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [syndicateView, setSyndicateView] = useState(false);
  const [selectedSyndicate, setSelectedSyndicate] = useState<typeof dummyTokens[0] | null>(null);

  const totalValue = useMemo(() => {
    return dummyTokens.reduce((total, token) => total + token.value, 0);
  }, []);

  const filteredTokens = useMemo(() => {
    let filtered = dummyTokens.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.ticker.toLowerCase().includes(search.toLowerCase())
    );

    if (activeFilter !== 'all') {
      if (activeFilter === 'custodian') {
        filtered = filtered.filter(t => t.isCustodian);
      } else {
        filtered = filtered.filter(t => t.type === activeFilter);
      }
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'units':
          comparison = a.units - b.units;
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'marketCap':
          comparison = parseFloat(a.mcap.replace(/[$KM]/g, '')) - parseFloat(b.mcap.replace(/[$KM]/g, ''));
          break;
        case 'holders':
          comparison = a.holders - b.holders;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [search, sortField, sortOrder, activeFilter]);

  const displayedTokens = filteredTokens.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className={cn("rounded-xl bg-card shadow-card p-8", className)}>
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("rounded-xl bg-card shadow-card border border-border/50", className)}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <a 
              href="https://zora.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <h3 className="font-semibold group-hover:text-primary transition-colors">My PureBreeds Dashboard</h3>
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <span className="text-xs text-muted-foreground">
              {dummyTokens.length} genomes
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="font-semibold text-success font-mono">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Buttons - Color coded */}
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', color: 'bg-muted text-foreground border-border' },
            { key: 'pre', label: 'Pre-Snapshot', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
            { key: 'post', label: 'Post-Snapshot', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
            { key: 'custodian', label: 'Custodian', color: 'bg-success/10 text-success border-success/30' },
          ].map((filter) => (
            <Badge
              key={filter.key}
              variant="outline"
              className={cn(
                "cursor-pointer transition-all",
                activeFilter === filter.key ? filter.color + " ring-1 ring-offset-1" : "opacity-60 hover:opacity-100"
              )}
              onClick={() => setActiveFilter(filter.key as FilterType)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        {/* Controls Row */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted border-0"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="gap-2"
            >
              <ArrowUpDown className={cn("h-4 w-4 transition-transform", sortOrder === 'desc' && "rotate-180")} />
              {sortField}
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="syndicate-toggle"
              checked={syndicateView}
              onCheckedChange={setSyndicateView}
            />
            <Label htmlFor="syndicate-toggle" className="text-sm cursor-pointer font-medium flex items-center gap-2">
              {syndicateView ? <LayoutGrid className="h-4 w-4" /> : <TableIcon className="h-4 w-4" />}
              View as Syndicates
            </Label>
          </div>
        </div>

        {/* Table View (when syndicateView is OFF) */}
        {!syndicateView ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="text-right">Holders</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTokens.map((token) => (
                  <TableRow 
                    key={token.id}
                    className={cn(
                      "cursor-pointer",
                      token.isAdminCustodian && "bg-purple-500/5",
                      token.isCustodian && !token.isAdminCustodian && "bg-success/5"
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1 h-8 rounded-full",
                          token.isAdminCustodian ? "bg-purple-500" :
                          token.isCustodian && token.type === 'pre' ? "bg-gradient-to-b from-amber-500 to-success" :
                          token.isCustodian ? "bg-success" :
                          token.type === 'pre' ? "bg-amber-500" : "bg-blue-500"
                        )} />
                        <div>
                          <p className="font-medium text-sm">{token.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">${token.ticker}</p>
                        </div>
                        {token.isCustodian && <Crown className="h-3 w-3 text-success" />}
                        {token.isAdminCustodian && <Badge variant="outline" className="text-[8px] px-1 py-0 border-purple-500/30 text-purple-500">warplette</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{token.units.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-success">${token.value.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{token.mcap}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{token.holders}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", getTypeBadgeColor(token.type))}>
                        {token.type === 'pre' ? 'Pre' : token.type === 'post' ? 'Post' : 'Custodian'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Cards Grid (Syndicate View) */
          <div className="p-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTokens.map((token) => (
              <div
                key={token.id}
                onClick={() => setSelectedSyndicate(token)}
                className={cn(
                  "group rounded-xl p-3 border-2 transition-all duration-200 hover:shadow-md cursor-pointer",
                  getTypeColor(token.type, token.isCustodian, token.isAdminCustodian)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg">
                    🦁
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm truncate">{token.name}</p>
                      {token.isCustodian && <Crown className="h-3 w-3 text-success shrink-0" />}
                      {token.isAdminCustodian && <Badge variant="outline" className="text-[8px] px-1 py-0 border-purple-500/30 text-purple-500">warplette</Badge>}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">${token.ticker}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className={cn("text-[10px] px-1 py-0", getTypeBadgeColor(token.type))}>
                        {token.type === 'pre' ? 'Pre' : token.type === 'post' ? 'Post' : 'Custodian'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
                  <div>
                    <p className="text-muted-foreground">Units Held</p>
                    <p className="font-mono font-medium">{token.units.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Value</p>
                    <p className="font-mono font-medium text-success">${token.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Market Cap</p>
                    <p className="font-mono font-medium">{token.mcap}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Holders</p>
                    <p className="font-mono font-medium">{token.holders}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {visibleCount < filteredTokens.length && (
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Load more ({filteredTokens.length - visibleCount} remaining)</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Syndicate Details Dialog */}
      <Dialog open={!!selectedSyndicate} onOpenChange={() => setSelectedSyndicate(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {selectedSyndicate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">🦁</span>
                  {selectedSyndicate.name}
                  {selectedSyndicate.isCustodian && <Crown className="h-4 w-4 text-success" />}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-success/5 border border-success/20 p-3 text-center">
                    <p className="text-lg font-bold text-success">{selectedSyndicate.totalRevenue}</p>
                    <p className="text-[10px] text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
                    <p className="text-lg font-bold text-primary">{selectedSyndicate.hybridsSpun}</p>
                    <p className="text-[10px] text-muted-foreground">Hybrids Spun</p>
                  </div>
                  <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-center">
                    <p className="text-lg font-bold text-destructive">{selectedSyndicate.burnPercentage}%</p>
                    <p className="text-[10px] text-muted-foreground">Supply Burnt</p>
                  </div>
                </div>

                {/* Burn Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Supply Burnt Progress</span>
                    <span className="font-medium">{selectedSyndicate.supplyBurnt}</span>
                  </div>
                  <Progress value={selectedSyndicate.burnPercentage} className="h-2" />
                </div>

                {/* Community Wealth */}
                <div>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-primary" />
                    Community Wealth
                  </h4>
                  <div className="grid grid-cols-5 gap-1">
                    <div className="rounded-lg bg-muted/30 p-2 text-center">
                      <p className="text-xs font-bold">{selectedSyndicate.communityWealth.eth}</p>
                      <p className="text-[9px] text-muted-foreground">ETH</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-2 text-center">
                      <p className="text-xs font-bold">{selectedSyndicate.communityWealth.usdc}</p>
                      <p className="text-[9px] text-muted-foreground">USDC</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-2 text-center">
                      <p className="text-xs font-bold">{selectedSyndicate.communityWealth.fcbc}</p>
                      <p className="text-[9px] text-muted-foreground">FCBC</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-2 text-center">
                      <p className="text-xs font-bold">{selectedSyndicate.communityWealth.dna}</p>
                      <p className="text-[9px] text-muted-foreground">DNA</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-2 text-center">
                      <p className="text-xs font-bold">{selectedSyndicate.communityWealth.hybrids}</p>
                      <p className="text-[9px] text-muted-foreground">Hybrids</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
