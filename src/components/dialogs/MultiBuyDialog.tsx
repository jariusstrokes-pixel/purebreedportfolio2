import { useState, useMemo } from 'react';
import { Layers, Search, X, Check, Key, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PreAsset {
  id: string;
  name: string;
  ticker: string;
  mcap: string;
  imageUrl: string;
}

// Generate list of purebreeds for selection
const allPurebreeds: PreAsset[] = [
  { id: '1', name: 'Javan Rhinoceros', ticker: '$FCBC121', mcap: '$2.4M', imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=80&h=80&fit=crop' },
  { id: '2', name: 'Sumatran Tiger', ticker: '$FCBC45', mcap: '$1.8M', imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=80&h=80&fit=crop' },
  { id: '3', name: 'Amur Leopard', ticker: '$FCBC203', mcap: '$1.5M', imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=80&h=80&fit=crop' },
  { id: '4', name: 'Mountain Gorilla', ticker: '$FCBC89', mcap: '$1.2M', imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=80&h=80&fit=crop' },
  { id: '5', name: 'Vaquita Porpoise', ticker: '$FCBC156', mcap: '$980K', imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=80&h=80&fit=crop' },
  { id: '6', name: 'Hawksbill Turtle', ticker: '$FCBC312', mcap: '$850K', imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=80&h=80&fit=crop' },
  { id: '7', name: 'Saola', ticker: '$FCBC78', mcap: '$720K', imageUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=80&h=80&fit=crop' },
  { id: '8', name: 'Cross River Gorilla', ticker: '$FCBC234', mcap: '$650K', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=80&h=80&fit=crop' },
  { id: '9', name: 'Yangtze Finless Porpoise', ticker: '$FCBC167', mcap: '$580K', imageUrl: 'https://images.unsplash.com/photo-1511222328814-01c6ed72b35e?w=80&h=80&fit=crop' },
  { id: '10', name: 'Black Rhino', ticker: '$FCBC99', mcap: '$420K', imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=80&h=80&fit=crop' },
  { id: '11', name: 'Philippine Eagle', ticker: '$FCBC412', mcap: '$390K', imageUrl: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=80&h=80&fit=crop' },
  { id: '12', name: 'Sumatran Elephant', ticker: '$FCBC55', mcap: '$350K', imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=80&h=80&fit=crop' },
];

const FYRE_KEYS_BALANCE = 5;
const KEYS_REQUIRED = 1;

interface MultiBuyDialogProps {
  children: React.ReactNode;
}

export function MultiBuyDialog({ children }: MultiBuyDialogProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [fyreKeys] = useState(FYRE_KEYS_BALANCE);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const filteredAssets = useMemo(() => {
    if (!search) return allPurebreeds;
    const term = search.toLowerCase();
    return allPurebreeds.filter(
      a => a.name.toLowerCase().includes(term) || a.ticker.toLowerCase().includes(term)
    );
  }, [search]);

  const toggleAsset = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 100) {
        next.add(id);
      } else {
        toast.error('Maximum 100 purebreeds allowed');
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filteredAssets.length) {
      setSelected(new Set());
    } else {
      const maxToSelect = Math.min(filteredAssets.length, 100);
      setSelected(new Set(filteredAssets.slice(0, maxToSelect).map(a => a.id)));
    }
  };

  const removeAsset = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleUnlock = () => {
    if (fyreKeys >= KEYS_REQUIRED) {
      setIsUnlocked(true);
      toast.success('MultiBuy unlocked!');
    } else {
      toast.error('Not enough Fyre Keys');
    }
  };

  const handleBuyAll = () => {
    if (selected.size === 0) {
      toast.error('Select at least one purebreed');
      return;
    }
    toast.success(`Bought ${selected.size} purebreeds in 1 click!`);
    setSelected(new Set());
  };

  const selectedAssets = allPurebreeds.filter(a => selected.has(a.id));
  const allSelected = selected.size === filteredAssets.length && filteredAssets.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              MultiBuy Purebreeds
            </div>
            <Badge variant="outline" className="gap-1">
              <Key className="h-3 w-3" />
              {fyreKeys} Fyre Keys
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {!isUnlocked ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Lock className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Unlock MultiBuy</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Requires {KEYS_REQUIRED} Fyre Key to unlock
              </p>
            </div>
            <Button onClick={handleUnlock} className="gap-2">
              <Key className="h-4 w-4" />
              Unlock with Fyre Key
            </Button>
          </div>
        ) : (
          <>
            {/* Selected Items */}
            {selected.size > 0 && (
              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted">
                {selectedAssets.map((asset) => (
                  <Badge
                    key={asset.id}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {asset.ticker}
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="ml-1 p-0.5 rounded hover:bg-background/50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mark All Checkbox */}
            <div 
              className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={toggleAll}
            >
              <Checkbox checked={allSelected} />
              <span className="font-medium text-sm">Mark All ({filteredAssets.length})</span>
            </div>

            {/* Asset List */}
            <ScrollArea className="flex-1 max-h-[250px]">
              <div className="space-y-1 pr-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => toggleAsset(asset.id)}
                  >
                    <Checkbox checked={selected.has(asset.id)} />
                    <img 
                      src={asset.imageUrl} 
                      alt={asset.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{asset.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{asset.ticker}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{asset.mcap}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                {selected.size} / 100 selected
              </span>
              <Button onClick={handleBuyAll} disabled={selected.size === 0} className="gap-2">
                <Check className="h-4 w-4" />
                Buy All ({selected.size})
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
