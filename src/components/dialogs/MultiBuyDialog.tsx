import { useState, useMemo } from 'react';
import { Layers, Search, X, Check } from 'lucide-react';
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
}

// Generate list of purebreeds for selection
const allPurebreeds: PreAsset[] = [
  { id: '1', name: 'Javan Rhinoceros', ticker: '$FCBC121', mcap: '$2.4M' },
  { id: '2', name: 'Sumatran Tiger', ticker: '$FCBC45', mcap: '$1.8M' },
  { id: '3', name: 'Amur Leopard', ticker: '$FCBC203', mcap: '$1.5M' },
  { id: '4', name: 'Mountain Gorilla', ticker: '$FCBC89', mcap: '$1.2M' },
  { id: '5', name: 'Vaquita Porpoise', ticker: '$FCBC156', mcap: '$980K' },
  { id: '6', name: 'Hawksbill Turtle', ticker: '$FCBC312', mcap: '$850K' },
  { id: '7', name: 'Saola', ticker: '$FCBC78', mcap: '$720K' },
  { id: '8', name: 'Cross River Gorilla', ticker: '$FCBC234', mcap: '$650K' },
  { id: '9', name: 'Yangtze Finless Porpoise', ticker: '$FCBC167', mcap: '$580K' },
  { id: '10', name: 'Black Rhino', ticker: '$FCBC99', mcap: '$420K' },
  { id: '11', name: 'Philippine Eagle', ticker: '$FCBC412', mcap: '$390K' },
  { id: '12', name: 'Sumatran Elephant', ticker: '$FCBC55', mcap: '$350K' },
  { id: '13', name: 'Red Wolf', ticker: '$FCBC188', mcap: '$320K' },
  { id: '14', name: 'Kakapo Parrot', ticker: '$FCBC267', mcap: '$290K' },
  { id: '15', name: 'Addax Antelope', ticker: '$FCBC134', mcap: '$260K' },
  { id: '16', name: 'Asian Elephant', ticker: '$FCBC401', mcap: '$240K' },
  { id: '17', name: 'Sunda Pangolin', ticker: '$FCBC23', mcap: '$220K' },
  { id: '18', name: 'African Wild Dog', ticker: '$FCBC356', mcap: '$200K' },
  { id: '19', name: 'Indochinese Tiger', ticker: '$FCBC178', mcap: '$180K' },
  { id: '20', name: 'Bornean Orangutan', ticker: '$FCBC289', mcap: '$160K' },
];

interface MultiBuyDialogProps {
  children: React.ReactNode;
}

export function MultiBuyDialog({ children }: MultiBuyDialogProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            MultiBuy Purebreeds
          </DialogTitle>
        </DialogHeader>

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
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {asset.ticker.replace('$FCBC', '').slice(0, 3)}
                </div>
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
      </DialogContent>
    </Dialog>
  );
}
