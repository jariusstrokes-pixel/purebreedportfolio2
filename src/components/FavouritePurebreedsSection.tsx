import { useState } from 'react';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TickerHoverCard } from '@/components/TickerHoverCard';

// Extended list for 25+ pre-snapshot purebreeds
const favouritePurebreeds = [
  { rank: 1, symbol: 'FCBC121', name: 'Javan Rhinoceros', votes: 2345, holders: 234 },
  { rank: 2, symbol: 'FCBC203', name: 'Amur Leopard', votes: 1987, holders: 189 },
  { rank: 3, symbol: 'FCBC156', name: 'Vaquita Porpoise', votes: 1654, holders: 156 },
  { rank: 4, symbol: 'FCBC45', name: 'Sumatran Tiger', votes: 1432, holders: 145 },
  { rank: 5, symbol: 'FCBC89', name: 'Mountain Gorilla', votes: 1298, holders: 132 },
  { rank: 6, symbol: 'FCBC312', name: 'Hawksbill Turtle', votes: 1156, holders: 121 },
  { rank: 7, symbol: 'FCBC78', name: 'Snow Leopard', votes: 1045, holders: 112 },
  { rank: 8, symbol: 'FCBC234', name: 'Blue Whale', votes: 987, holders: 98 },
  { rank: 9, symbol: 'FCBC167', name: 'Giant Panda', votes: 876, holders: 87 },
  { rank: 10, symbol: 'FCBC99', name: 'African Elephant', votes: 765, holders: 76 },
  { rank: 11, symbol: 'FCBC412', name: 'Philippine Eagle', votes: 723, holders: 72 },
  { rank: 12, symbol: 'FCBC55', name: 'Sumatran Elephant', votes: 698, holders: 69 },
  { rank: 13, symbol: 'FCBC301', name: 'Siberian Tiger', votes: 654, holders: 65 },
  { rank: 14, symbol: 'FCBC188', name: 'Orangutan', votes: 621, holders: 62 },
  { rank: 15, symbol: 'FCBC277', name: 'Komodo Dragon', votes: 589, holders: 58 },
  { rank: 16, symbol: 'FCBC333', name: 'Red Panda', votes: 556, holders: 55 },
  { rank: 17, symbol: 'FCBC444', name: 'Cheetah', votes: 523, holders: 52 },
  { rank: 18, symbol: 'FCBC555', name: 'Polar Bear', votes: 498, holders: 49 },
  { rank: 19, symbol: 'FCBC666', name: 'Gorilla', votes: 467, holders: 46 },
  { rank: 20, symbol: 'FCBC777', name: 'Leopard', votes: 445, holders: 44 },
  { rank: 21, symbol: 'FCBC888', name: 'Tiger', votes: 423, holders: 42 },
  { rank: 22, symbol: 'FCBC999', name: 'Elephant', votes: 398, holders: 39 },
  { rank: 23, symbol: 'FCBC111', name: 'Rhinoceros', votes: 376, holders: 37 },
  { rank: 24, symbol: 'FCBC222', name: 'Hippopotamus', votes: 354, holders: 35 },
  { rank: 25, symbol: 'FCBC333', name: 'Giraffe', votes: 332, holders: 33 },
  { rank: 26, symbol: 'FCBC444', name: 'Zebra', votes: 298, holders: 29 },
  { rank: 27, symbol: 'FCBC555', name: 'Lion', votes: 276, holders: 27 },
  { rank: 28, symbol: 'FCBC666', name: 'Jaguar', votes: 254, holders: 25 },
  { rank: 29, symbol: 'FCBC777', name: 'Pangolin', votes: 232, holders: 23 },
  { rank: 30, symbol: 'FCBC888', name: 'Kakapo', votes: 210, holders: 21 },
];

export function FavouritePurebreedsSection() {
  const [visibleCount, setVisibleCount] = useState(10);
  const displayedItems = favouritePurebreeds.slice(0, visibleCount);

  return (
    <div className="rounded-xl bg-card shadow-card border border-border/50">
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-pink-500" />
          <h2 className="font-semibold text-sm">Favourite Purebreeds</h2>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">• Pre-snapshot votes</span>
        </div>
        <div className="flex gap-1">
          {[10, 25, 50].map((count) => (
            <Button key={count} variant={visibleCount === count ? "default" : "ghost"} size="sm" className="h-6 text-[10px] px-2" onClick={() => setVisibleCount(count)} disabled={count > favouritePurebreeds.length}>
              {count}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-3">
        {displayedItems.map((item, i) => (
          <TickerHoverCard key={i} ticker={item.symbol}>
            <div className={cn(
              "group rounded-lg p-2 border transition-all duration-200 cursor-pointer hover:shadow-md",
              "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent",
              item.rank <= 3 && "border-pink-500/40"
            )}>
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className={cn(
                  "text-[9px] px-1 py-0 h-4",
                  item.rank === 1 && "text-yellow-500 border-yellow-500/30",
                  item.rank === 2 && "text-gray-400 border-gray-400/30",
                  item.rank === 3 && "text-amber-600 border-amber-600/30"
                )}>#{item.rank}</Badge>
                {item.rank <= 3 && <Heart className="h-2.5 w-2.5 text-pink-500 fill-pink-500" />}
              </div>
              <div className="w-full h-10 rounded bg-muted flex items-center justify-center text-lg mb-1">🦁</div>
              <p className="text-[10px] font-medium truncate">{item.name}</p>
              <p className="text-[9px] text-muted-foreground font-mono">${item.symbol}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{item.votes.toLocaleString()} votes</p>
            </div>
          </TickerHoverCard>
        ))}
      </div>
    </div>
  );
}
