import { Wallet, Copy, ExternalLink, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

export function WalletPopover() {
  const mockWallet = {
    address: '0x1234...5678',
    fullAddress: '0x1234567890abcdef1234567890abcdef12345678',
    ethBalance: '2.45',
    portfolioValue: '$732,463',
    pnl: '+$729,765',
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
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
