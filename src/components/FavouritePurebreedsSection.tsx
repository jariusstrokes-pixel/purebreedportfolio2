import { useState } from 'react';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TickerHoverCard } from '@/components/TickerHoverCard';

const speciesImages: Record<string, string> = {
  'FCBC121': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop',
  'FCBC203': 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=120&h=120&fit=crop',
  'FCBC156': 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=120&h=120&fit=crop',
  'FCBC45': 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=120&h=120&fit=crop',
  'FCBC89': 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=120&h=120&fit=crop',
  'FCBC312': 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=120&h=120&fit=crop',
};

const favouritePurebreeds = [
  { rank: 1, symbol: 'FCBC121', name: 'Javan Rhinoceros', votes: 2345, holders: 234 },
  { rank: 2, symbol: 'FCBC203', name: 'Amur Leopard', votes: 1987, holders: 189 },
  { rank: 3, symbol: 'FCBC156', name: 'Vaquita Porpoise', votes: 1654, holders: 156 },
  { rank: 4, symbol: 'FCBC45', name: 'Sumatran Tiger', votes: 1432, holders: 145 },
  { rank: 5, symbol: 'FCBC89', name: 'Mountain Gorilla', votes: 1298, holders: 132 },
  { rank: 6, symbol: 'FCBC312', name: 'Hawksbill Turtle', votes: 1156, holders: 121 },
  { rank: 7, symbol: 'FCBC121', name: 'Snow Leopard', votes: 1045, holders: 112 },
  { rank: 8, symbol: 'FCBC203', name: 'Blue Whale', votes: 987, holders: 98 },
  { rank: 9, symbol: 'FCBC156', name: 'Giant Panda', votes: 876, holders: 87 },
  { rank: 10, symbol: 'FCBC45', name: 'African Elephant', votes: 765, holders: 76 },
];

export function FavouritePurebreedsSection() {
  const [visibleCount, setVisibleCount] = useState(10);

  const displayedItems = favouritePurebreeds.slice(0, visibleCount);

  const handleExpand = (count: number) => {
    setVisibleCount(count);
  };

  return (
    <div className="rounded-xl bg-card shadow-card border border-border/50">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <Heart className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <h2 className="font-semibold">Favourite Pre-Snapshot Purebreeds</h2>
            <p className="text-xs text-muted-foreground">Community voted favourites</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[10, 25, 50].map((count) => (
            <Button
              key={count}
              variant={visibleCount === count ? "default" : "outline"}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => handleExpand(count)}
            >
              Top {count}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-4">
        {displayedItems.map((item, i) => (
          <TickerHoverCard key={i} ticker={item.symbol}>
            <div className={cn(
              "group rounded-xl p-3 border transition-all duration-200 cursor-pointer hover:shadow-md",
              item.rank <= 3 
                ? "bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/30 hover:border-pink-500/50" 
                : "bg-muted/30 border-border hover:border-border/80"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    item.rank === 1 && "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
                    item.rank === 2 && "bg-gray-400/10 text-gray-400 border-gray-400/30",
                    item.rank === 3 && "bg-amber-600/10 text-amber-600 border-amber-600/30"
                  )}
                >
                  #{item.rank}
                </Badge>
                <Heart className={cn(
                  "h-3 w-3",
                  item.rank <= 3 ? "text-pink-500 fill-pink-500" : "text-muted-foreground"
                )} />
              </div>
              <img 
                src={speciesImages[item.symbol] || 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=120&h=120&fit=crop'} 
                alt={item.name}
                className="w-full h-16 rounded-lg object-cover mb-2 group-hover:scale-105 transition-transform"
              />
              <p className="text-xs font-medium truncate">{item.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">${item.symbol}</p>
              <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                <span>{item.votes.toLocaleString()} votes</span>
                <span>{item.holders} holders</span>
              </div>
            </div>
          </TickerHoverCard>
        ))}
      </div>
    </div>
  );
}
