import { Wallet, Copy, ExternalLink, LogOut, Settings, Sparkles, Search, Ticket, Coins, Database, Crown, Link2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { AddonsDialog } from '@/components/dialogs/AddonsDialog';
import { QuickBuyDialog } from '@/components/dialogs/QuickBuyDialog';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export function WalletPopover() {
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data that would come from blockchain/API
  const walletData = {
    usdcBalance: '1,245.50',
    portfolioValue: '$732,463',
    totalDnaUnits: '1.2M',
    totalGenomes: 47,
    custodies: 3,
    voteTickets: 36,
    freeSearchesRemaining: 5,
    referrals: 12,
    inviteCode: 'FCBC-XYZ123',
  };

  const displayAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '0x1234...5678';

  const fullAddress = address || '0x1234567890abcdef1234567890abcdef12345678';

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    toast.success('Address copied to clipboard');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://fyreapp2.fcbc.fun?ref=${walletData.inviteCode}`);
    toast.success('Invite link copied!');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.info(`Searching wallet: ${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  const handleConnect = () => {
    open();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Wallet className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-popover" align="end">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wallet</span>
            {isConnected ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-destructive hover:text-destructive"
                onClick={handleDisconnect}
              >
                <LogOut className="h-3 w-3 mr-1" />
                Disconnect
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-primary"
                onClick={handleConnect}
              >
                Connect
              </Button>
            )}
          </div>
          
          {/* Address */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {displayAddress.charAt(2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm">{displayAddress}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
              <Copy className="h-3 w-3" />
            </Button>
            <a href={`https://basescan.org/address/${fullAddress}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>

          <Separator />

          {/* Balances Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Coins className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">ETH</p>
                <p className="font-mono font-medium">
                  {ethBalance ? (Number(ethBalance.value) / 1e18).toFixed(4) : '0.0000'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Coins className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">USDC</p>
                <p className="font-mono font-medium">{walletData.usdcBalance}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Database className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Portfolio</p>
                <p className="font-mono font-medium">{walletData.portfolioValue}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Database className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">DNA Units</p>
                <p className="font-mono font-medium">{walletData.totalDnaUnits}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Database className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Genomes</p>
                <p className="font-mono font-medium">{walletData.totalGenomes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Crown className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Custodies</p>
                <p className="font-mono font-medium">{walletData.custodies}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Ticket className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Vote Tickets</p>
                <p className="font-mono font-medium">{walletData.voteTickets}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Users className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Referrals</p>
                <p className="font-mono font-medium">{walletData.referrals}</p>
              </div>
            </div>
          </div>

          {/* Invite Link */}
          <div className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/20">
            <Link2 className="h-3 w-3 text-primary" />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground">Invite Code</p>
              <p className="font-mono text-xs">{walletData.inviteCode}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={copyInviteLink}>
              Copy Link
            </Button>
          </div>

          <Separator />

          {/* Wallet Search */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Search className="h-3 w-3" />
                Wallet Search
              </span>
              <span className="text-xs text-muted-foreground">{walletData.freeSearchesRemaining}/5 free</span>
            </div>
            <div className="flex gap-1">
              <Input 
                placeholder="0x..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 text-xs"
              />
              <Button size="sm" className="h-7 px-2" onClick={handleSearch}>
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <span className="text-xs text-muted-foreground">Quick Actions</span>
            <div className="flex items-center gap-1 mt-1">
              <QuickBuyDialog>
                <Button variant="outline" size="sm" className="h-7 text-xs flex-1">
                  Quick Buy
                </Button>
              </QuickBuyDialog>
              
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
      </PopoverContent>
    </Popover>
  );
}
