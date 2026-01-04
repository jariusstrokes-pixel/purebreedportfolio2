import { useState } from 'react';
import { Gift, Send, Users, Trophy, Share2, Layers, Tag, Search, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { BuyAmountDialog } from '@/components/dialogs/BuyAmountDialog';

const purebreeds = [
  { symbol: 'FCBC121', name: 'Javan Rhinoceros', balance: '12.5M', imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=40&h=40&fit=crop' },
  { symbol: 'FCBC203', name: 'Amur Leopard', balance: '8.3M', imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=40&h=40&fit=crop' },
  { symbol: 'FCBC156', name: 'Vaquita Porpoise', balance: '5.1M', imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=40&h=40&fit=crop' },
  { symbol: 'FCBC45', name: 'Sumatran Tiger', balance: '3.2M', imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=40&h=40&fit=crop' },
  { symbol: 'FCBC89', name: 'Mountain Gorilla', balance: '2.8M', imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=40&h=40&fit=crop' },
];

const topGifters = [
  { address: 'JariusOS.base.eth', totalGifts: 156, totalUnits: '45.2M' },
  { address: 'cryptowhale.base.eth', totalGifts: 98, totalUnits: '32.1M' },
  { address: 'wildkeeper.base.eth', totalGifts: 67, totalUnits: '18.9M' },
  { address: 'dnamaster.base.eth', totalGifts: 45, totalUnits: '12.3M' },
  { address: '0x5555...6666', totalGifts: 34, totalUnits: '8.7M' },
];

const giftTags = [
  { label: 'Birthday 🎂', count: 45 },
  { label: 'Thank You 🙏', count: 38 },
  { label: 'Welcome 👋', count: 29 },
  { label: 'Congratulations 🎉', count: 24 },
  { label: 'Random Act 💚', count: 18 },
];

const quantityPresets = ['100K', '1M', '5M', '10M'];

interface DNAGiftingSectionProps {
  className?: string;
}

export function DNAGiftingSection({ className }: DNAGiftingSectionProps) {
  const [recipient, setRecipient] = useState('');
  const [selectedPurebreed, setSelectedPurebreed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showLeaderboardDialog, setShowLeaderboardDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [buyingSpecies, setBuyingSpecies] = useState<string | null>(null);

  const filteredPurebreeds = purebreeds.filter(pb => 
    pb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pb.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!recipient || !selectedPurebreed || !quantity) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Gift sent! ${quantity} DNA units of $${selectedPurebreed} to ${recipient}`);
      setRecipient('');
      setSelectedPurebreed('');
      setQuantity('');
      setSelectedTag('');
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`I just gifted DNA tokens on FCBC! Join me: https://fcbc.fun`);
    toast.success('Share link copied!');
  };

  const handleQuickBuy = (symbol: string) => {
    setBuyingSpecies(symbol);
    setShowBuyDialog(true);
  };

  return (
    <>
      <div className={cn("rounded-xl bg-card shadow-card border border-border/50", className)}>
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Gift DNA tokens to friends</h3>
              <p className="text-xs text-muted-foreground">Share purebreed tokens with others</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowLeaderboardDialog(true)}
          >
            <Trophy className="h-3 w-3 mr-1" />
            Leaderboard
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Gift Form */}
          <div className="grid gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Recipient (basename or address)</label>
              <Input
                placeholder="name.base.eth or 0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-muted border-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Purebreed</label>
                <Select value={selectedPurebreed} onValueChange={setSelectedPurebreed}>
                  <SelectTrigger className="bg-muted border-0">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {/* Search input */}
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-7 pl-7 text-xs bg-background"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {filteredPurebreeds.map((pb) => (
                      <SelectItem key={pb.symbol} value={pb.symbol}>
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex items-center gap-2">
                            <img src={pb.imageUrl} alt={pb.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-mono text-xs">${pb.symbol}</span>
                            <span className="text-muted-foreground text-xs">({pb.balance})</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 px-1.5 text-[10px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickBuy(pb.symbol);
                            }}
                          >
                            <ShoppingCart className="h-3 w-3" />
                          </Button>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                <Input
                  placeholder="e.g. 100K"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-muted border-0"
                />
              </div>
            </div>

            {/* Quick quantity tags */}
            <div className="flex flex-wrap gap-1">
              {quantityPresets.map((preset) => (
                <Badge
                  key={preset}
                  variant={quantity === preset ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setQuantity(preset)}
                >
                  {preset}
                </Badge>
              ))}
              <Badge
                variant={!quantityPresets.includes(quantity) && quantity ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setQuantity('')}
              >
                Custom
              </Badge>
            </div>

            {/* Gift Tags */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Gift Tag (optional)
              </label>
              <div className="flex flex-wrap gap-1">
                {giftTags.map((tag) => (
                  <Badge
                    key={tag.label}
                    variant={selectedTag === tag.label ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => setSelectedTag(selectedTag === tag.label ? '' : tag.label)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleSend} 
                disabled={isSending || !recipient || !selectedPurebreed || !quantity}
                className="flex-1 gap-2"
              >
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Gift
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Dialog */}
      <Dialog open={showLeaderboardDialog} onOpenChange={setShowLeaderboardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top Gifters Leaderboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {topGifters.map((gifter, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                    i === 0 && "bg-yellow-500/20 text-yellow-500",
                    i === 1 && "bg-gray-400/20 text-gray-400",
                    i === 2 && "bg-amber-600/20 text-amber-600",
                    i > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {i + 1}
                  </div>
                  <span className="text-sm font-mono">{gifter.address}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{gifter.totalGifts} gifts</p>
                  <p className="text-xs text-muted-foreground">{gifter.totalUnits} units</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gift Tag Stats */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <Tag className="h-3 w-3 text-primary" />
              Popular Tags
            </h4>
            <div className="flex flex-wrap gap-1">
              {giftTags.map((tag) => (
                <Badge key={tag.label} variant="outline" className="text-[10px]">
                  {tag.label} ({tag.count})
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy Amount Dialog */}
      {buyingSpecies && (
        <BuyAmountDialog 
          open={showBuyDialog} 
          onOpenChange={setShowBuyDialog}
          ticker={buyingSpecies}
        />
      )}
    </>
  );
}
