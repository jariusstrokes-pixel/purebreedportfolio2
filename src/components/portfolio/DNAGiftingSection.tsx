import { useState } from 'react';
import { Gift, Send, Users, Trophy, Share2, Layers, Tag } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const purebreeds = [
  { symbol: 'FCBC121', name: 'Javan Rhinoceros', balance: '12.5M' },
  { symbol: 'FCBC203', name: 'Amur Leopard', balance: '8.3M' },
  { symbol: 'FCBC156', name: 'Vaquita Porpoise', balance: '5.1M' },
  { symbol: 'FCBC45', name: 'Sumatran Tiger', balance: '3.2M' },
  { symbol: 'FCBC89', name: 'Mountain Gorilla', balance: '2.8M' },
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

interface DNAGiftingSectionProps {
  className?: string;
}

export function DNAGiftingSection({ className }: DNAGiftingSectionProps) {
  const [recipient, setRecipient] = useState('');
  const [selectedPurebreed, setSelectedPurebreed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!recipient || !selectedPurebreed || !quantity) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Gift sent! ${quantity} DNA units of $${selectedPurebreed} to ${recipient}`);
      // Reset form
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

  return (
    <div className={cn("rounded-xl bg-card shadow-card border border-border/50", className)}>
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">DNA Gifting</h3>
            <p className="text-xs text-muted-foreground">Share purebreed tokens with others</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            <Trophy className="h-3 w-3 mr-1" />
            Leaderboard
          </Button>
        </div>
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
                <SelectContent>
                  {purebreeds.map((pb) => (
                    <SelectItem key={pb.symbol} value={pb.symbol}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">${pb.symbol}</span>
                        <span className="text-muted-foreground text-xs">({pb.balance})</span>
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

        {/* Leaderboard */}
        {showLeaderboard && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
            <h4 className="text-xs font-semibold flex items-center gap-1">
              <Trophy className="h-3 w-3 text-primary" />
              Top Gifters
            </h4>
            <div className="space-y-2">
              {topGifters.map((gifter, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                      i === 0 && "bg-yellow-500/20 text-yellow-500",
                      i === 1 && "bg-gray-400/20 text-gray-400",
                      i === 2 && "bg-amber-600/20 text-amber-600",
                      i > 2 && "bg-muted text-muted-foreground"
                    )}>
                      {i + 1}
                    </div>
                    <span className="text-xs font-mono">{gifter.address}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{gifter.totalGifts} gifts</p>
                    <p className="text-[10px] text-muted-foreground">{gifter.totalUnits} units</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Tag Stats */}
            <div className="mt-3">
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
          </div>
        )}
      </div>
    </div>
  );
}
