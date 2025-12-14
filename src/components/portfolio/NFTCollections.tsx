import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface NFTCollection {
  id: string;
  name: string;
  category: 'oocytes' | 'enzymes' | 'purebreeds';
  totalItems: number;
  floorPrice: number;
  totalVolume: number;
  myHoldings: number;
  status: 'active' | 'coming-soon';
  openseaUrl?: string;
}

const collections: NFTCollection[] = [
  {
    id: 'fcbrwa-oocytes',
    name: 'FCBRWA Oocytes',
    category: 'oocytes',
    totalItems: 512,
    floorPrice: 0.65,
    totalVolume: 332.8,
    myHoldings: 12,
    status: 'active',
    openseaUrl: 'https://opensea.io/collection/fcbrwa-enzyme',
  },
  {
    id: 'fcbrwa-enzyme',
    name: 'FCBRWA Enzyme',
    category: 'enzymes',
    totalItems: 324,
    floorPrice: 0.85,
    totalVolume: 275.4,
    myHoldings: 8,
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
    status: 'coming-soon',
  },
];

interface NFTCollectionsProps {
  className?: string;
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'oocytes': return 'Oocytes';
    case 'enzymes': return 'Enzymes';
    case 'purebreeds': return 'PureBreeds';
    default: return category;
  }
};

export function NFTCollections({ className }: NFTCollectionsProps) {
  return (
    <div className={cn("rounded-lg bg-card shadow-card", className)}>
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold">NFT Pre-Assets</h3>
        <span className="text-sm text-muted-foreground font-mono">
          {collections.length} collections
        </span>
      </div>
      
      {/* Category Breakdown */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2 flex-wrap">
          {['oocytes', 'enzymes', 'purebreeds'].map((cat) => {
            const count = collections.filter(c => c.category === cat).length;
            return (
              <Badge key={cat} variant="outline" className="text-xs">
                {getCategoryLabel(cat)}: {count}
              </Badge>
            );
          })}
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
                <td className="p-4 text-right font-mono font-medium">
                  {collection.status === 'coming-soon' ? '-' : collection.myHoldings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}