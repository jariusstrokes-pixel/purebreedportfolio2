import { useState } from 'react';
import { ShoppingCart, Square, Key, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { BuyAmountDialog } from './BuyAmountDialog';

interface Recommendation {
  id: string;
  name: string;
  ticker: string;
  stars: number;
  mcap: string;
  imageUrl: string;
}

const allRecommendations: Recommendation[] = [
  { id: '1', name: 'Javan Rhinoceros', ticker: '$FCBC121', stars: 5, mcap: '$2.4M', imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=80&h=80&fit=crop' },
  { id: '2', name: 'Sumatran Tiger', ticker: '$FCBC45', stars: 5, mcap: '$1.8M', imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=80&h=80&fit=crop' },
  { id: '3', name: 'Amur Leopard', ticker: '$FCBC203', stars: 4, mcap: '$1.5M', imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=80&h=80&fit=crop' },
  { id: '4', name: 'Mountain Gorilla', ticker: '$FCBC89', stars: 4, mcap: '$1.2M', imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=80&h=80&fit=crop' },
  { id: '5', name: 'Vaquita Porpoise', ticker: '$FCBC156', stars: 4, mcap: '$980K', imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=80&h=80&fit=crop' },
  { id: '6', name: 'Hawksbill Turtle', ticker: '$FCBC312', stars: 3, mcap: '$850K', imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=80&h=80&fit=crop' },
  { id: '7', name: 'Saola', ticker: '$FCBC78', stars: 3, mcap: '$720K', imageUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=80&h=80&fit=crop' },
  { id: '8', name: 'Cross River Gorilla', ticker: '$FCBC234', stars: 3, mcap: '$650K', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=80&h=80&fit=crop' },
  { id: '9', name: 'Yangtze Finless Porpoise', ticker: '$FCBC167', stars: 3, mcap: '$580K', imageUrl: 'https://images.unsplash.com/photo-1511222328814-01c6ed72b35e?w=80&h=80&fit=crop' },
  { id: '10', name: 'Black Rhino', ticker: '$FCBC99', stars: 2, mcap: '$420K', imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=80&h=80&fit=crop' },
  { id: '11', name: 'Philippine Eagle', ticker: '$FCBC412', stars: 5, mcap: '$390K', imageUrl: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=80&h=80&fit=crop' },
  { id: '12', name: 'Sumatran Elephant', ticker: '$FCBC55', stars: 4, mcap: '$350K', imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=80&h=80&fit=crop' },
];

const userHoldings = new Set(['$FCBC121', '$FCBC45', '$FCBC203']);

const FYRE_KEYS_BALANCE = 5;
const KEYS_REQUIRED = 1;

interface QuickBuyDialogProps {
  children: React.ReactNode;
}

export function QuickBuyDialog({ children }: QuickBuyDialogProps) {
  const [page, setPage] = useState(0);
  const [fyreKeys] = useState(FYRE_KEYS_BALANCE);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState('');
  const itemsPerPage = 10;
  
  const availableRecs = allRecommendations.filter(r => !userHoldings.has(r.ticker));
  const totalPages = Math.ceil(availableRecs.length / itemsPerPage);
  const currentRecs = availableRecs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleUnlock = () => {
    if (fyreKeys >= KEYS_REQUIRED) {
      setIsUnlocked(true);
      toast.success('QuickBuy unlocked!');
    } else {
      toast.error('Not enough Fyre Keys');
    }
  };

  const handleBuyAll = () => {
    toast.success(`Bought ${currentRecs.length} pre-assets!`);
  };

  const handleBuySingle = (ticker: string) => {
    setSelectedTicker(ticker.replace('$', ''));
    setShowBuyDialog(true);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                QuickBuy Recommendations
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
                <h3 className="font-semibold">Unlock QuickBuy</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Requires {KEYS_REQUIRED} Fyre Key to unlock
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleUnlock} className="gap-2">
                  <Key className="h-4 w-4" />
                  Unlock with Fyre Key
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px]">
                      <p className="text-xs">Fyre Keys are utility tokens that unlock premium features like QuickBuy and MultiBuy. Earn keys by participating in snapshot events, gifting DNA, or purchasing from the marketplace.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2 mt-4 flex-1 overflow-y-auto">
                {currentRecs.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={rec.imageUrl} 
                        alt={rec.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{rec.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{rec.ticker}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-mono">{rec.mcap}</p>
                        <div className="flex items-center gap-0.5 justify-end">
                          {Array.from({ length: rec.stars }).map((_, i) => (
                            <Square key={i} className="h-2 w-2 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleBuySingle(rec.ticker)}>
                        Buy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                  >
                    Prev 10
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  >
                    Next 10
                  </Button>
                </div>
                <Button onClick={handleBuyAll} className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Buy All ({currentRecs.length})
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <BuyAmountDialog 
        open={showBuyDialog} 
        onOpenChange={setShowBuyDialog}
        ticker={selectedTicker}
      />
    </>
  );
}
