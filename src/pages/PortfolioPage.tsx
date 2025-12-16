import { useState } from 'react';
import { StatCard } from '@/components/portfolio/StatCard';
import { SpeciesTokenList } from '@/components/portfolio/SpeciesTokenList';
import { NFTCollections } from '@/components/portfolio/NFTCollections';
import { useSpecies } from '@/hooks/useSpecies';
import { Wallet, Coins, Dna, ShoppingCart, Layers, CircleDollarSign, Search, X, Loader2, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QuickBuyDialog } from '@/components/dialogs/QuickBuyDialog';
import { MultiBuyDialog } from '@/components/dialogs/MultiBuyDialog';
import { toast } from 'sonner';

interface WalletSearchResult {
  address: string;
  totalValue: string;
  preAssets: number;
  custodiedCount: number;
  topHoldings: { symbol: string; units: string }[];
}

const mockSearchResults: Record<string, WalletSearchResult> = {
  '0x1234': {
    address: '0x1234...5678',
    totalValue: '$245,320',
    preAssets: 87,
    custodiedCount: 3,
    topHoldings: [
      { symbol: 'FCBC121', units: '12.5M' },
      { symbol: 'FCBC45', units: '15.1M' },
      { symbol: 'FCBC203', units: '9.3M' },
    ],
  },
};

const FREE_SEARCHES_PER_DAY = 5;
const VOTE_TICKETS_BALANCE = 36;

export function PortfolioPage() {
  const { data: species = [], isLoading } = useSpecies(100);
  const [addressSearch, setAddressSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<WalletSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [freeSearchesUsed, setFreeSearchesUsed] = useState(0);
  const [voteTickets, setVoteTickets] = useState(VOTE_TICKETS_BALANCE);

  const freeSearchesRemaining = FREE_SEARCHES_PER_DAY - freeSearchesUsed;

  const handleSearch = () => {
    if (!addressSearch.trim()) return;
    
    // Check if user needs to use vote tickets
    if (freeSearchesRemaining <= 0 && voteTickets <= 0) {
      toast.error('No free searches or vote tickets remaining');
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      
      // Deduct search cost
      if (freeSearchesRemaining > 0) {
        setFreeSearchesUsed(prev => prev + 1);
        toast.info(`Free search used. ${freeSearchesRemaining - 1} remaining today.`);
      } else {
        setVoteTickets(prev => prev - 1);
        toast.info(`Vote ticket used. ${voteTickets - 1} remaining.`);
      }
      
      if (addressSearch.toLowerCase().includes('0x1234')) {
        setSearchResult(mockSearchResults['0x1234']);
      } else if (addressSearch.length >= 4) {
        setSearchResult({
          address: addressSearch.length > 10 ? `${addressSearch.slice(0, 6)}...${addressSearch.slice(-4)}` : addressSearch,
          totalValue: `$${(Math.random() * 100000).toFixed(0)}`,
          preAssets: Math.floor(Math.random() * 50) + 10,
          custodiedCount: Math.floor(Math.random() * 3),
          topHoldings: [
            { symbol: 'FCBC' + Math.floor(Math.random() * 500), units: `${(Math.random() * 10).toFixed(1)}M` },
            { symbol: 'FCBC' + Math.floor(Math.random() * 500), units: `${(Math.random() * 5).toFixed(1)}M` },
          ],
        });
      } else {
        setSearchError('Address not found or invalid format');
      }
    }, 800);
  };

  const clearSearch = () => {
    setAddressSearch('');
    setSearchResult(null);
    setSearchError(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">FCBCC Portfolio Manager</h1>
        <p className="text-muted-foreground">View and Manage your FYRE Pre-assets.</p>
      </div>

      {/* Address Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Free searches: {freeSearchesRemaining}/{FREE_SEARCHES_PER_DAY} today</span>
          <span className="flex items-center gap-1">
            <Ticket className="h-3 w-3" />
            Vote Tickets: {voteTickets}
          </span>
        </div>
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wallet address..."
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-10"
            />
            {addressSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !addressSearch.trim()}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>

        {searchResult && (
          <div className="rounded-lg bg-card p-4 shadow-card border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm text-primary">{searchResult.address}</span>
              <Badge variant="secondary">Found</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="font-bold">{searchResult.totalValue}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Pre-Assets</p>
                <p className="font-bold">{searchResult.preAssets}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Custodied</p>
                <p className="font-bold">{searchResult.custodiedCount}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Top Holdings</p>
              <div className="flex flex-wrap gap-2">
                {searchResult.topHoldings.map((h, i) => (
                  <Badge key={i} variant="outline" className="font-mono text-xs">
                    ${h.symbol}: {h.units}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {searchError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {searchError}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total Portfolio Value"
          value="$732,463"
          subValue="+$729,765"
          subValueClassName="text-success"
          icon={<Wallet className="h-4 w-4" />}
          delay={0}
        />
        <a 
          href="https://zora.co/coin/base:0x1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <StatCard
            label="$FCBCC Creator Coin"
            value="2,450"
            icon={<CircleDollarSign className="h-4 w-4" />}
            delay={100}
          />
        </a>
        <StatCard
          label="Pre-Assets Held"
          value="122"
          icon={<Coins className="h-4 w-4" />}
          delay={200}
        />
        <StatCard
          label="PureBreeds DNA Units"
          value="122M"
          icon={<Dna className="h-4 w-4" />}
          delay={300}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <QuickBuyDialog>
          <Button className="flex-1 gap-2">
            <ShoppingCart className="h-4 w-4" />
            QuickBuy
          </Button>
        </QuickBuyDialog>
        <MultiBuyDialog>
          <Button variant="outline" className="flex-1 gap-2">
            <Layers className="h-4 w-4" />
            MultiBuy
          </Button>
        </MultiBuyDialog>
      </div>

      {/* Fyre PureBreeds Genomes List */}
      <SpeciesTokenList species={species} isLoading={isLoading} />

      {/* NFT Collections */}
      <NFTCollections />
    </div>
  );
}
