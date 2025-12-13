import { useState, useMemo } from 'react';
import { Species } from '@/hooks/useSpecies';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ArrowUpDown, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SpeciesTokenListProps {
  species: Species[];
  isLoading?: boolean;
  className?: string;
}

type SortField = 'name' | 'symbol' | 'marketCap' | 'holders' | 'rarity';
type SortOrder = 'asc' | 'desc';

const rarityOrder: Record<string, number> = {
  'Legendary': 5,
  'Epic': 4,
  'Rare': 3,
  'Uncommon': 2,
  'Common': 1,
};

export function SpeciesTokenList({ species, isLoading, className }: SpeciesTokenListProps) {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [preSnapshot, setPreSnapshot] = useState(false);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(species.map(s => s.status));
    return Array.from(statuses).filter(Boolean);
  }, [species]);

  const filteredAndSortedSpecies = useMemo(() => {
    let filtered = species.filter(
      (s) =>
        (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.symbol.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === 'all' || s.status === statusFilter)
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'holders':
          comparison = a.holders - b.holders;
          break;
        case 'rarity':
          const aRarity = rarityOrder[a.rarity.split(' ')[0]] || 0;
          const bRarity = rarityOrder[b.rarity.split(' ')[0]] || 0;
          comparison = aRarity - bRarity;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [species, search, sortField, sortOrder, statusFilter]);

  const displayedSpecies = filteredAndSortedSpecies.slice(0, visibleCount);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getRarityColor = (rarity: string) => {
    const r = rarity.split(' ')[0];
    switch (r) {
      case 'Legendary': return 'text-warning';
      case 'Epic': return 'text-purple-400';
      case 'Rare': return 'text-primary';
      case 'Uncommon': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className={cn("rounded-lg bg-card shadow-card p-8", className)}>
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading species data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg bg-card shadow-card", className)}>
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold">Species Tokens</h3>
        <span className="text-sm text-muted-foreground font-mono">
          {species.length.toLocaleString()} tokens
        </span>
      </div>
      
      {/* Filters Row */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted border-0"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-muted border-0">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
            <SelectTrigger className="w-full sm:w-[160px] bg-muted border-0">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="symbol">Ticker</SelectItem>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="holders">Holders</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="shrink-0"
          >
            <ArrowUpDown className={cn("h-4 w-4 transition-transform", sortOrder === 'desc' && "rotate-180")} />
          </Button>
        </div>

        {/* Snapshot Toggle */}
        <div className="flex items-center gap-3 pt-2">
          <Switch
            id="snapshot-toggle"
            checked={preSnapshot}
            onCheckedChange={setPreSnapshot}
          />
          <Label htmlFor="snapshot-toggle" className="text-sm cursor-pointer">
            {preSnapshot ? 'Pre-Snapshot Data' : 'Post-Snapshot Data'}
          </Label>
          <span className="text-xs text-muted-foreground ml-2">
            {preSnapshot ? '(Historical view)' : '(Current live data)'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="p-4 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('name')}>
                Species {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('symbol')}>
                Ticker {sortField === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('rarity')}>
                Rarity {sortField === 'rarity' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium text-right">Status</th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('holders')}>
                Holders {sortField === 'holders' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('marketCap')}>
                Market Cap {sortField === 'marketCap' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedSpecies.map((token) => (
              <tr
                key={token.tokenAddress}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground overflow-hidden">
                      {token.image ? (
                        <img src={token.image} alt={token.name} className="h-full w-full object-cover" />
                      ) : (
                        token.symbol.slice(0, 2)
                      )}
                    </div>
                    <p className="font-medium">{token.name}</p>
                  </div>
                </td>
                <td className="p-4 font-mono text-muted-foreground">
                  ${token.symbol}
                </td>
                <td className={cn("p-4 text-right font-medium", getRarityColor(token.rarity))}>
                  {token.rarity.split(' ')[0]}
                </td>
                <td className="p-4 text-right text-sm text-muted-foreground">
                  {token.status}
                </td>
                <td className="p-4 text-right font-mono">
                  {token.holders}
                </td>
                <td className="p-4 text-right font-mono font-medium">
                  {token.marketCapFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleCount < filteredAndSortedSpecies.length && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Load more ({filteredAndSortedSpecies.length - visibleCount} remaining)</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
