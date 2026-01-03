import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  category: 'oocytes' | 'enzymes' | 'purebreeds' | 'hybrids';
  subtitle: string;
  totalItems: number;
  floorPrice: number;
  volume: number;
  myHoldings: number;
  myHoldingsValue: number;
  status: 'active' | 'coming-soon';
  openseaUrl?: string;
  imageUrl?: string;
}

const collections: Collection[] = [
  {
    id: 'fcbrwa-oocytes',
    name: 'FCbRWA Oocytes',
    subtitle: 'multiparent',
    category: 'oocytes',
    totalItems: 1234,
    floorPrice: 0.65,
    volume: 332.8,
    myHoldings: 12,
    myHoldingsValue: 7.8,
    status: 'active',
    openseaUrl: 'https://opensea.io/collection/fcbrwa-oocytes',
    imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop',
  },
  {
    id: 'fcbrwa-enzyme',
    name: 'FCbRWA Enzyme',
    subtitle: 'burnsaver',
    category: 'enzymes',
    totalItems: 10000,
    floorPrice: 0.85,
    volume: 275.4,
    myHoldings: 8,
    myHoldingsValue: 6.8,
    status: 'active',
    openseaUrl: 'https://opensea.io/collection/fcbrwa-enzyme',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=120&h=120&fit=crop',
  },
  {
    id: 'fyre-purebreds',
    name: 'Fyre PureBreeds',
    subtitle: 'endangered animals on base',
    category: 'purebreeds',
    totalItems: 0,
    floorPrice: 0,
    volume: 0,
    myHoldings: 0,
    myHoldingsValue: 0,
    status: 'coming-soon',
    openseaUrl: 'https://opensea.io/collection/fyre-purebreeds',
    imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=120&h=120&fit=crop',
  },
  {
    id: 'fyre-hybrids',
    name: 'Fyre Hybrids',
    subtitle: 'cross-species creations',
    category: 'hybrids',
    totalItems: 0,
    floorPrice: 0,
    volume: 0,
    myHoldings: 0,
    myHoldingsValue: 0,
    status: 'coming-soon',
    openseaUrl: 'https://opensea.io/collection/fyre-hybrids',
    imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=120&h=120&fit=crop',
  },
];

const userBalances = {
  oocytes: { count: 12, value: 7.8 },
  enzymes: { count: 8, value: 6.8 },
  purebreeds: { count: 0, value: 0 },
  hybrids: { count: 0, value: 0 },
};

interface FyreCollectiblesProps {
  className?: string;
}

export function FyreCollectibles({ className }: FyreCollectiblesProps) {
  const formatValue = (value: number) => {
    if (value === 0) return '-';
    return value < 1000 ? `$${(value * 2400).toLocaleString()}` : `$${(value * 2400 / 1000).toFixed(1)}K`;
  };

  return (
    <div className={cn("rounded-xl bg-card shadow-card border border-border/50", className)}>
      <div className="flex flex-col border-b border-border p-4 gap-3">
        <a 
          href="https://opensea.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <h3 className="font-semibold group-hover:text-primary transition-colors">Fyre Collectibles</h3>
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        
        {/* Holdings Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-[10px] text-muted-foreground">Oocytes</p>
            <p className="text-sm font-bold">{userBalances.oocytes.count}</p>
            <p className="text-[10px] text-success">{userBalances.oocytes.value} ETH</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <p className="text-[10px] text-muted-foreground">Enzymes</p>
            <p className="text-sm font-bold">{userBalances.enzymes.count}</p>
            <p className="text-[10px] text-success">{userBalances.enzymes.value} ETH</p>
          </div>
          <div className="rounded-lg bg-muted/50 border border-border p-2 opacity-50">
            <p className="text-[10px] text-muted-foreground">PureBreeds</p>
            <p className="text-sm font-bold">{userBalances.purebreeds.count}</p>
            <p className="text-[10px] text-muted-foreground">soon</p>
          </div>
          <div className="rounded-lg bg-muted/50 border border-border p-2 opacity-50">
            <p className="text-[10px] text-muted-foreground">Hybrids</p>
            <p className="text-sm font-bold">{userBalances.hybrids.count}</p>
            <p className="text-[10px] text-muted-foreground">soon</p>
          </div>
        </div>
      </div>

      {/* Collection Cards Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {collections.map((collection) => (
          <a
            key={collection.id}
            href={collection.openseaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group rounded-xl p-3 border transition-all duration-200 hover:shadow-md",
              collection.status === 'coming-soon' 
                ? "bg-muted/30 border-border opacity-60" 
                : "bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-primary/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img 
                  src={collection.imageUrl} 
                  alt={collection.name}
                  className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                />
                {collection.status === 'coming-soon' && (
                  <Badge 
                    variant="outline" 
                    className="absolute -top-1 -right-1 text-[8px] px-1 py-0 bg-warning/10 text-warning border-warning/30"
                  >
                    Soon
                  </Badge>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{collection.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{collection.subtitle}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
              <div>
                <p className="text-muted-foreground">Total Items</p>
                <p className="font-mono font-medium">{collection.status === 'coming-soon' ? '-' : collection.totalItems.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Floor Price</p>
                <p className="font-mono font-medium">{collection.status === 'coming-soon' ? '-' : `${collection.floorPrice} ETH`}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-mono font-medium">{collection.status === 'coming-soon' ? '-' : `${collection.volume} ETH`}</p>
              </div>
              <div>
                <p className="text-muted-foreground">My Holdings</p>
                <p className="font-mono font-medium text-success">
                  {collection.status === 'coming-soon' ? '-' : formatValue(collection.myHoldingsValue)}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
