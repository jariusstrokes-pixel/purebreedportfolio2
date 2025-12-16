import { useState } from 'react';
import { ShoppingCart, Star, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  name: string;
  ticker: string;
  stars: number;
  mcap: string;
}

// Generate 100 recommendations (10 pages of 10)
const allRecommendations: Recommendation[] = [
  { id: '1', name: 'Javan Rhinoceros', ticker: '$FCBC121', stars: 5, mcap: '$2.4M' },
  { id: '2', name: 'Sumatran Tiger', ticker: '$FCBC45', stars: 5, mcap: '$1.8M' },
  { id: '3', name: 'Amur Leopard', ticker: '$FCBC203', stars: 4, mcap: '$1.5M' },
  { id: '4', name: 'Mountain Gorilla', ticker: '$FCBC89', stars: 4, mcap: '$1.2M' },
  { id: '5', name: 'Vaquita Porpoise', ticker: '$FCBC156', stars: 4, mcap: '$980K' },
  { id: '6', name: 'Hawksbill Turtle', ticker: '$FCBC312', stars: 3, mcap: '$850K' },
  { id: '7', name: 'Saola', ticker: '$FCBC78', stars: 3, mcap: '$720K' },
  { id: '8', name: 'Cross River Gorilla', ticker: '$FCBC234', stars: 3, mcap: '$650K' },
  { id: '9', name: 'Yangtze Finless Porpoise', ticker: '$FCBC167', stars: 3, mcap: '$580K' },
  { id: '10', name: 'Black Rhino', ticker: '$FCBC99', stars: 2, mcap: '$420K' },
  { id: '11', name: 'Philippine Eagle', ticker: '$FCBC412', stars: 5, mcap: '$390K' },
  { id: '12', name: 'Sumatran Elephant', ticker: '$FCBC55', stars: 4, mcap: '$350K' },
  { id: '13', name: 'Red Wolf', ticker: '$FCBC188', stars: 4, mcap: '$320K' },
  { id: '14', name: 'Kakapo Parrot', ticker: '$FCBC267', stars: 3, mcap: '$290K' },
  { id: '15', name: 'Addax Antelope', ticker: '$FCBC134', stars: 3, mcap: '$260K' },
  { id: '16', name: 'Asian Elephant', ticker: '$FCBC401', stars: 3, mcap: '$240K' },
  { id: '17', name: 'Sunda Pangolin', ticker: '$FCBC23', stars: 2, mcap: '$220K' },
  { id: '18', name: 'African Wild Dog', ticker: '$FCBC356', stars: 2, mcap: '$200K' },
  { id: '19', name: 'Indochinese Tiger', ticker: '$FCBC178', stars: 2, mcap: '$180K' },
  { id: '20', name: 'Bornean Orangutan', ticker: '$FCBC289', stars: 2, mcap: '$160K' },
  { id: '21', name: 'Snow Leopard', ticker: '$FCBC445', stars: 5, mcap: '$155K' },
  { id: '22', name: 'Giant Panda', ticker: '$FCBC12', stars: 5, mcap: '$150K' },
  { id: '23', name: 'Blue Whale', ticker: '$FCBC378', stars: 4, mcap: '$145K' },
  { id: '24', name: 'Leatherback Sea Turtle', ticker: '$FCBC67', stars: 4, mcap: '$140K' },
  { id: '25', name: 'Bengal Tiger', ticker: '$FCBC501', stars: 4, mcap: '$135K' },
  { id: '26', name: 'Malayan Tiger', ticker: '$FCBC223', stars: 3, mcap: '$130K' },
  { id: '27', name: 'Galapagos Penguin', ticker: '$FCBC89', stars: 3, mcap: '$125K' },
  { id: '28', name: 'Iberian Lynx', ticker: '$FCBC334', stars: 3, mcap: '$120K' },
  { id: '29', name: 'Ethiopian Wolf', ticker: '$FCBC156', stars: 2, mcap: '$115K' },
  { id: '30', name: 'Arabian Oryx', ticker: '$FCBC467', stars: 2, mcap: '$110K' },
  // More species...
  { id: '31', name: 'Spix Macaw', ticker: '$FCBC512', stars: 5, mcap: '$105K' },
  { id: '32', name: 'Pygmy Sloth', ticker: '$FCBC34', stars: 4, mcap: '$100K' },
  { id: '33', name: 'California Condor', ticker: '$FCBC245', stars: 4, mcap: '$95K' },
  { id: '34', name: 'Sumatran Orangutan', ticker: '$FCBC78', stars: 3, mcap: '$90K' },
  { id: '35', name: 'Polar Bear', ticker: '$FCBC389', stars: 3, mcap: '$85K' },
  { id: '36', name: 'Clouded Leopard', ticker: '$FCBC123', stars: 3, mcap: '$80K' },
  { id: '37', name: 'Whooping Crane', ticker: '$FCBC456', stars: 2, mcap: '$75K' },
  { id: '38', name: 'Komodo Dragon', ticker: '$FCBC567', stars: 2, mcap: '$70K' },
  { id: '39', name: 'Dugong', ticker: '$FCBC678', stars: 2, mcap: '$65K' },
  { id: '40', name: 'Tapir', ticker: '$FCBC789', stars: 2, mcap: '$60K' },
  { id: '41', name: 'Okapi', ticker: '$FCBC890', stars: 5, mcap: '$55K' },
  { id: '42', name: 'Pangolin', ticker: '$FCBC901', stars: 4, mcap: '$50K' },
  { id: '43', name: 'Axolotl', ticker: '$FCBC1012', stars: 4, mcap: '$48K' },
  { id: '44', name: 'Gharial', ticker: '$FCBC1123', stars: 3, mcap: '$46K' },
  { id: '45', name: 'Markhor', ticker: '$FCBC1234', stars: 3, mcap: '$44K' },
  { id: '46', name: 'Proboscis Monkey', ticker: '$FCBC1345', stars: 3, mcap: '$42K' },
  { id: '47', name: 'Tasmanian Devil', ticker: '$FCBC1456', stars: 2, mcap: '$40K' },
  { id: '48', name: 'Numbat', ticker: '$FCBC1567', stars: 2, mcap: '$38K' },
  { id: '49', name: 'Quokka', ticker: '$FCBC1678', stars: 2, mcap: '$36K' },
  { id: '50', name: 'Kakapo', ticker: '$FCBC1789', stars: 2, mcap: '$34K' },
];

// Simulate user's existing holdings
const userHoldings = new Set(['$FCBC121', '$FCBC45', '$FCBC203']);

interface QuickBuyDialogProps {
  children: React.ReactNode;
}

export function QuickBuyDialog({ children }: QuickBuyDialogProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  
  // Filter out assets user already owns
  const availableRecs = allRecommendations.filter(r => !userHoldings.has(r.ticker));
  const totalPages = Math.ceil(availableRecs.length / itemsPerPage);
  const currentRecs = availableRecs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleBuyAll = () => {
    toast.success(`Bought ${currentRecs.length} pre-assets!`);
  };

  const handleBuySingle = (ticker: string) => {
    toast.success(`Bought ${ticker}!`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            QuickBuy Recommendations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-4 flex-1 overflow-y-auto">
          {currentRecs.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {rec.ticker.replace('$FCBC', '').slice(0, 3)}
                </div>
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
      </DialogContent>
    </Dialog>
  );
}
