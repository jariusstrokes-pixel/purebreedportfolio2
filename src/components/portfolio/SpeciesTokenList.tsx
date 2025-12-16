import { useState, useMemo } from 'react';
import { Species } from '@/hooks/useSpecies';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ArrowUpDown, Filter, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

type SortField2 = 'name' | 'symbol' | 'units' | 'value' | 'marketCap' | 'holders';
type SortOrder = 'asc' | 'desc';

// 10 dummy tokens with pre/post snapshot and custodian status
const dummyTokens = [
  { id: '1', name: 'Javan Rhinoceros', ticker: '$FCBC121', units: 45000, value: 12500, mcap: '$2.4M', holders: 234, isPreSnapshot: true, isCustodian: true },
  { id: '2', name: 'Sumatran Tiger', ticker: '$FCBC45', units: 32000, value: 8200, mcap: '$1.8M', holders: 189, isPreSnapshot: true, isCustodian: false },
  { id: '3', name: 'Amur Leopard', ticker: '$FCBC203', units: 28000, value: 6700, mcap: '$1.5M', holders: 156, isPreSnapshot: false, isCustodian: true },
  { id: '4', name: 'Mountain Gorilla', ticker: '$FCBC89', units: 51000, value: 15100, mcap: '$1.2M', holders: 278, isPreSnapshot: true, isCustodian: false },
  { id: '5', name: 'Vaquita Porpoise', ticker: '$FCBC156', units: 19000, value: 4500, mcap: '$980K', holders: 98, isPreSnapshot: false, isCustodian: false },
  { id: '6', name: 'Hawksbill Turtle', ticker: '$FCBC312', units: 67000, value: 22300, mcap: '$850K', holders: 312, isPreSnapshot: true, isCustodian: true },
  { id: '7', name: 'Saola', ticker: '$FCBC78', units: 23000, value: 5800, mcap: '$720K', holders: 145, isPreSnapshot: false, isCustodian: false },
  { id: '8', name: 'Cross River Gorilla', ticker: '$FCBC234', units: 38000, value: 9300, mcap: '$650K', holders: 201, isPreSnapshot: true, isCustodian: false },
  { id: '9', name: 'Yangtze Finless Porpoise', ticker: '$FCBC167', units: 41000, value: 11200, mcap: '$580K', holders: 167, isPreSnapshot: false, isCustodian: true },
  { id: '10', name: 'Black Rhino', ticker: '$FCBC99', units: 29000, value: 7100, mcap: '$420K', holders: 134, isPreSnapshot: true, isCustodian: false },
];

export function SpeciesTokenList({ species, isLoading, className }: SpeciesTokenListProps) {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortField, setSortField] = useState<SortField2>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [preSnapshot, setPreSnapshot] = useState(true);

  // Calculate total value - must be before any conditional returns
  const totalValue = useMemo(() => {
    return dummyTokens.reduce((total, token) => total + token.value, 0);
  }, []);

  const filteredTokens = useMemo(() => {
    let filtered = dummyTokens.filter(
      (t) =>
        (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.ticker.toLowerCase().includes(search.toLowerCase()))
    );

    if (statusFilter === 'pre') {
      filtered = filtered.filter(t => t.isPreSnapshot);
    } else if (statusFilter === 'post') {
      filtered = filtered.filter(t => !t.isPreSnapshot);
    } else if (statusFilter === 'custodian') {
      filtered = filtered.filter(t => t.isCustodian);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'symbol':
          comparison = a.ticker.localeCompare(b.ticker);
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
  }, [search, sortField, sortOrder, statusFilter]);

  const displayedTokens = filteredTokens.slice(0, visibleCount);

  const toggleSort = (field: SortField2) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className={cn("rounded-lg bg-card shadow-card p-8", className)}>
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading Fyre PureBreeds data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg bg-card shadow-card", className)}>
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <a 
            href="https://zora.co" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <h3 className="font-semibold group-hover:text-primary transition-colors">Fyre PureBreeds Genomes</h3>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <span className="text-xs text-muted-foreground font-mono">
            10 tokens
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="font-semibold text-success font-mono">${totalValue.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Legend */}
      <div className="px-4 pt-3 flex flex-wrap gap-2 text-xs">
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">Pre-Snapshot</Badge>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Post-Snapshot</Badge>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">Custodian</Badge>
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
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value="pre">Pre-Snapshot</SelectItem>
              <SelectItem value="post">Post-Snapshot</SelectItem>
              <SelectItem value="custodian">My Custodian</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={(v) => setSortField(v as SortField2)}>
            <SelectTrigger className="w-full sm:w-[160px] bg-muted border-0">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="symbol">Ticker</SelectItem>
              <SelectItem value="units">Units Held</SelectItem>
              <SelectItem value="value">Value</SelectItem>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="holders">Holders</SelectItem>
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
          <Label htmlFor="snapshot-toggle" className="text-sm cursor-pointer font-medium">
            Pre-Snapshot Data
          </Label>
          <span className="text-xs text-muted-foreground ml-2">
            {preSnapshot ? '(Historical snapshot view)' : '(Current live data)'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="p-4 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('name')}>
                Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('symbol')}>
                Ticker {sortField === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('units')}>
                Units Held {sortField === 'units' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('value')}>
                Value {sortField === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('marketCap')}>
                Mcap {sortField === 'marketCap' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('holders')}>
                Holders {sortField === 'holders' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedTokens.map((token) => (
              <tr
                key={token.id}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/30 transition-colors",
                  token.isPreSnapshot ? "bg-amber-500/5" : "bg-blue-500/5",
                  token.isCustodian && "ring-1 ring-inset ring-success/30"
                )}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground overflow-hidden",
                      token.isCustodian ? "bg-gradient-to-br from-success to-success/70" : "bg-gradient-primary"
                    )}>
                      {token.ticker.replace('$FCBC', '').slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <div className="flex gap-1 mt-0.5">
                        {token.isCustodian && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 bg-success/10 text-success border-success/30">
                            Custodian
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-muted-foreground">
                  {token.ticker}
                </td>
                <td className="p-4 text-right font-mono">
                  {token.units.toLocaleString()}
                </td>
                <td className="p-4 text-right font-mono text-success">
                  ${token.value.toLocaleString()}
                </td>
                <td className="p-4 text-right font-mono text-muted-foreground">
                  {token.mcap}
                </td>
                <td className="p-4 text-right font-mono">
                  {token.holders}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleCount < filteredTokens.length && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setVisibleCount((c) => c + 10)}
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
