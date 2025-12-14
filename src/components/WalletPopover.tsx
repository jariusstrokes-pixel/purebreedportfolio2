import { Wallet, Copy, ExternalLink, LogOut, Settings, Sparkles, Sun, Moon, Search, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { AddonsDialog } from '@/components/dialogs/AddonsDialog';

export function WalletPopover() {
  const { theme, toggleTheme } = useTheme();
  
  const mockWallet = {
    address: '0x1234...5678',
    fullAddress: '0x1234567890abcdef1234567890abcdef12345678',
    ethBalance: '2.45',
    portfolioValue: '$732,463',
    pnl: '+$729,765',
    voteTickets: 36,
    freeSearchesRemaining: 5,
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(mockWallet.fullAddress);
    toast.success('Address copied to clipboard');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Wallet className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connected Wallet</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive hover:text-destructive">
              <LogOut className="h-3 w-3 mr-1" />
              Disconnect
            </Button>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              W
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm">{mockWallet.address}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
              <Copy className="h-3 w-3" />
            </Button>
            <a href={`https://basescan.org/address/${mockWallet.fullAddress}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Portfolio Value</span>
              <span className="font-mono font-medium">{mockWallet.portfolioValue}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total PnL</span>
              <span className="font-mono font-medium text-success">{mockWallet.pnl}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ETH Balance</span>
              <span className="font-mono font-medium">{mockWallet.ethBalance} ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Ticket className="h-3 w-3" />
                Vote Tickets
              </span>
              <span className="font-mono font-medium">{mockWallet.voteTickets}</span>
            </div>
          </div>

          {/* Wallet Search */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Search className="h-3 w-3" />
                Wallet Search
              </span>
              <span className="text-xs text-muted-foreground">{mockWallet.freeSearchesRemaining}/5 free today</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">1 Vote Ticket per search after free limit</p>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Quick Actions</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </Button>
                
                <AddonsDialog>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Sparkles className="h-3.5 w-3.5" />
                  </Button>
                </AddonsDialog>
                
                <SettingsDialog>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </SettingsDialog>

                <a href="https://fcbc.fun" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
