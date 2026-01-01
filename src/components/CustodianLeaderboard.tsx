import { Trophy, Medal, Crown, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  address: string;
  custodies: number;
  totalUnits: string;
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, address: '0x1234...5678', custodies: 12, totalUnits: '145.2M', isCurrentUser: false },
  { rank: 2, address: '0x8765...4321', custodies: 9, totalUnits: '98.7M', isCurrentUser: false },
  { rank: 3, address: '0x1234...5678', custodies: 7, totalUnits: '76.3M', isCurrentUser: true },
  { rank: 4, address: '0xABCD...EFGH', custodies: 5, totalUnits: '54.1M', isCurrentUser: false },
  { rank: 5, address: '0x9999...1111', custodies: 4, totalUnits: '43.8M', isCurrentUser: false },
  { rank: 6, address: '0x5555...6666', custodies: 3, totalUnits: '32.5M', isCurrentUser: false },
  { rank: 7, address: '0x7777...8888', custodies: 3, totalUnits: '28.9M', isCurrentUser: false },
  { rank: 8, address: '0x2222...3333', custodies: 2, totalUnits: '21.4M', isCurrentUser: false },
  { rank: 9, address: '0x4444...5555', custodies: 2, totalUnits: '18.2M', isCurrentUser: false },
  { rank: 10, address: '0x6666...7777', custodies: 1, totalUnits: '12.8M', isCurrentUser: false },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Medal className="h-4 w-4 text-amber-600" />;
    default:
      return <span className="w-4 text-center text-xs text-muted-foreground">{rank}</span>;
  }
};

export function CustodianLeaderboard() {
  return (
    <div className="rounded-lg bg-card shadow-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Custodian Leaderboard</h2>
        </div>
        <Badge variant="secondary" className="text-xs">Season 1</Badge>
      </div>
      
      <div className="divide-y divide-border/50">
        {leaderboardData.map((entry) => (
          <div 
            key={entry.rank}
            className={cn(
              "flex items-center justify-between p-3 hover:bg-muted/30 transition-colors",
              entry.isCurrentUser && "bg-primary/5 border-l-2 border-primary"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`https://basescan.org/address/${entry.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {entry.address}
                    <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                  </a>
                  {entry.isCurrentUser && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 text-primary border-primary/30">You</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-sm font-medium">{entry.custodies}</p>
                <p className="text-[10px] text-muted-foreground">custodies</p>
              </div>
              <div>
                <p className="text-sm font-mono">{entry.totalUnits}</p>
                <p className="text-[10px] text-muted-foreground">units</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
