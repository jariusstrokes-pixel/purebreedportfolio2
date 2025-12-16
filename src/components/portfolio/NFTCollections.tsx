import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface NFTCollection {
  id: string;
  name: string;
  category: 'oocytes' | 'enzymes' | 'purebreeds' | 'hybrids';
  totalItems: number;
  floorPrice: number;
  totalVolume: number;
  myHoldings: number;
  myHoldingsValue: number;
  status: 'active' | 'coming-soon';
  openseaUrl?: string;
}

const collections: NFTCollection[] = [
  {
    id: 'fcbrwa-oocytes',
    name: 'FCBRWA Oocytes',
    category: 'oocytes',
    totalItems: 1234,
    floorPrice: 0.65,
    totalVolume: 332.8,
    myHoldings: 12,
    myHoldingsValue: 7.8,
    status: 'active',
    openseaUrl: 'https://opensea.io/collection/fcbrwa-oocytes',
  },
  {
    id: 'fcbrwa-enzyme',
    name: 'FCBRWA Enzyme',
    category: 'enzymes',
    totalItems: 10000,
    floorPrice: 0.85,
    totalVolume: 275.4,
    myHoldings: 8,
    myHoldingsValue: 6.8,
    status: 'active',
    openseaUrl: 'https://opensea.io/collection/fcbrwa-enzyme',
  },
  {
    id: 'fyre-purebreds',
    name: 'Fyre PureBreeds',
    category: 'purebreeds',
    totalItems: 0,
    floorPrice: 0,
    totalVolume: 0,
    myHoldings: 0,
    myHoldingsValue: 0,
    status: 'coming-soon',
    openseaUrl: 'https://opensea.io/collection/fyre-purebreeds',
  },
  {
    id: 'fyre-hybrids',
    name: 'Fyre Hybrids',
    category: 'hybrids',
    totalItems: 0,
    floorPrice: 0,
    totalVolume: 0,
    myHoldings: 0,
    myHoldingsValue: 0,
    status: 'coming-soon',
    openseaUrl: 'https://opensea.io/collection/fyre-hybrids',
  },
];

// User balances for each category
const userBalances = {
  oocytes: { count: 12, value: 7.8 },
  enzymes: { count: 8, value: 6.8 },
  purebreeds: { count: 0, value: 0 },
  hybrids: { count: 0, value: 0 },
};

interface NFTCollectionsProps {
  className?: string;
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'oocytes': return 'Oocytes';
    case 'enzymes': return 'Enzymes';
    case 'purebreeds': return 'PureBreeds';
    case 'hybrids': return 'Hybrids';
    default: return category;
  }
};

export function NFTCollections({ className }: NFTCollectionsProps) {
  return (
    <div className={cn("rounded-lg bg-card shadow-card", className)}>
      <div className="flex flex-col border-b border-border p-4 gap-3">
        <a 
          href="https://opensea.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <h3 className="font-semibold group-hover:text-primary transition-colors">NFT Pre-Assets</h3>
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        {/* My Holdings Breakdown with balance values */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            Oocytes: {userBalances.oocytes.count} ({userBalances.oocytes.value} ETH)
          </Badge>
          <Badge variant="outline" className="text-xs">
            Enzymes: {userBalances.enzymes.count} ({userBalances.enzymes.value} ETH)
          </Badge>
          <Badge variant="outline" className="text-xs opacity-50">
            PureBreeds: {userBalances.purebreeds.count}
          </Badge>
          <Badge variant="outline" className="text-xs opacity-50">
            Hybrids: {userBalances.hybrids.count}
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium text-right">Total Items</th>
              <th className="p-4 font-medium text-right">Floor</th>
              <th className="p-4 font-medium text-right">Volume</th>
              <th className="p-4 font-medium text-right">My Holdings</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr 
                key={collection.id} 
                className={cn(
                  "border-b border-border/50 hover:bg-muted/30 transition-colors",
                  collection.status === 'coming-soon' && "opacity-60"
                )}
              >
                <td className="p-4">
                  <a
                    href={collection.openseaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 group",
                      !collection.openseaUrl && "pointer-events-none"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                      collection.status === 'coming-soon' 
                        ? "bg-muted text-muted-foreground" 
                        : "bg-gradient-primary text-primary-foreground"
                    )}>
                      {collection.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{collection.name}</span>
                        {collection.status === 'coming-soon' && (
                          <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">
                            Soon
                          </Badge>
                        )}
                        {collection.openseaUrl && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{getCategoryLabel(collection.category)}</span>
                    </div>
                  </a>
                </td>
                <td className="p-4 text-right font-mono">
                  {collection.status === 'coming-soon' ? '-' : collection.totalItems.toLocaleString()}
                </td>
                <td className="p-4 text-right font-mono">
                  {collection.status === 'coming-soon' ? '-' : `${collection.floorPrice} ETH`}
                </td>
                <td className="p-4 text-right font-mono">
                  {collection.status === 'coming-soon' ? '-' : `${collection.totalVolume.toFixed(1)} ETH`}
                </td>
                <td className="p-4 text-right">
                  {collection.status === 'coming-soon' ? (
                    <span className="font-mono">-</span>
                  ) : (
                    <div>
                      <span className="font-mono font-medium">{collection.myHoldings}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({collection.myHoldingsValue} ETH)
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
