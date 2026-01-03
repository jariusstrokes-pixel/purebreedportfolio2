import { useState, useMemo } from 'react';
import { Species } from '@/hooks/useSpecies';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ArrowUpDown, ExternalLink, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface PurebreedsDashboardProps {
  species: Species[];
  isLoading?: boolean;
  className?: string;
}

type SortField = 'name' | 'units' | 'value' | 'marketCap' | 'holders';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'pre' | 'post' | 'custodian';

// Species images
const speciesImages: Record<string, string> = {
  'FCBC121': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop',
  'FCBC203': 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=120&h=120&fit=crop',
  'FCBC156': 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=120&h=120&fit=crop',
  'FCBC312': 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=120&h=120&fit=crop',
  'FCBC45': 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=120&h=120&fit=crop',
  'FCBC89': 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=120&h=120&fit=crop',
  'FCBC78': 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=120&h=120&fit=crop',
  'FCBC234': 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=120&h=120&fit=crop',
  'FCBC167': 'https://images.unsplash.com/photo-1511222328814-01c6ed72b35e?w=120&h=120&fit=crop',
  'FCBC99': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=120&h=120&fit=crop',
};

const dummyTokens = [
  { id: '1', name: 'Javan Rhinoceros', ticker: 'FCBC121', units: 45000, value: 12500, mcap: '$2.4M', holders: 234, type: 'pre' as const, isCustodian: true },
  { id: '2', name: 'Sumatran Tiger', ticker: 'FCBC45', units: 32000, value: 8200, mcap: '$1.8M', holders: 189, type: 'pre' as const, isCustodian: false },
  { id: '3', name: 'Amur Leopard', ticker: 'FCBC203', units: 28000, value: 6700, mcap: '$1.5M', holders: 156, type: 'post' as const, isCustodian: true },
  { id: '4', name: 'Mountain Gorilla', ticker: 'FCBC89', units: 51000, value: 15100, mcap: '$1.2M', holders: 278, type: 'pre' as const, isCustodian: false },
  { id: '5', name: 'Vaquita Porpoise', ticker: 'FCBC156', units: 19000, value: 4500, mcap: '$980K', holders: 98, type: 'post' as const, isCustodian: false },
  { id: '6', name: 'Hawksbill Turtle', ticker: 'FCBC312', units: 67000, value: 22300, mcap: '$850K', holders: 312, type: 'pre' as const, isCustodian: true },
  { id: '7', name: 'Saola', ticker: 'FCBC78', units: 23000, value: 5800, mcap: '$720K', holders: 145, type: 'post' as const, isCustodian: false },
  { id: '8', name: 'Cross River Gorilla', ticker: 'FCBC234', units: 38000, value: 9300, mcap: '$650K', holders: 201, type: 'pre' as const, isCustodian: false },
  { id: '9', name: 'Yangtze Finless Porpoise', ticker: 'FCBC167', units: 41000, value: 11200, mcap: '$580K', holders: 167, type: 'custodian' as const, isCustodian: true },
  { id: '10', name: 'Black Rhino', ticker: 'FCBC99', units: 29000, value: 7100, mcap: '$420K', holders: 134, type: 'pre' as const, isCustodian: false },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'pre': return 'border-amber-500/50 bg-amber-500/5';
    case 'post': return 'border-blue-500/50 bg-blue-500/5';
    case 'custodian': return 'border-success/50 bg-success/5';
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
            152 genomes
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="font-semibold text-success font-mono">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter Buttons */}
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
            <LayoutGrid className="h-4 w-4" />
            View as Syndicates
          </Label>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={cn(
        "p-4 grid gap-3",
        syndicateView ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      )}>
        {displayedTokens.map((token) => (
          <div
            key={token.id}
            className={cn(
              "group rounded-xl p-3 border-2 transition-all duration-200 hover:shadow-md cursor-pointer",
              getTypeColor(token.isCustodian ? 'custodian' : token.type)
            )}
          >
            <div className="flex items-start gap-3">
              <img 
                src={speciesImages[token.ticker] || 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop'} 
                alt={token.name}
                className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{token.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">${token.ticker}</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className={cn("text-[10px] px-1 py-0", getTypeBadgeColor(token.type))}>
                    {token.type === 'pre' ? 'Pre' : token.type === 'post' ? 'Post' : 'Custodian'}
                  </Badge>
                  {token.isCustodian && token.type !== 'custodian' && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 bg-success/10 text-success border-success/30">
                      👑
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {syndicateView && (
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
            )}
          </div>
        ))}
      </div>

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
  );
}
