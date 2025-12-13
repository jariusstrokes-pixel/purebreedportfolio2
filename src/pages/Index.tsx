import { StatCard } from '@/components/portfolio/StatCard';
import { SpeciesTokenList } from '@/components/portfolio/SpeciesTokenList';
import { NFTCollections } from '@/components/portfolio/NFTCollections';
import { PortfolioChart } from '@/components/portfolio/PortfolioChart';
import { HoldingsBreakdown } from '@/components/portfolio/HoldingsBreakdown';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { AddonsDialog } from '@/components/dialogs/AddonsDialog';
import { useSpecies } from '@/hooks/useSpecies';
import { useTheme } from '@/hooks/useTheme';
import {
  mockChartData,
  holdingsBreakdown,
} from '@/lib/mockData';
import { Coins, Image, TrendingUp, Wallet, Sun, Moon, Settings, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Index = () => {
  const { data: species = [], isLoading } = useSpecies(100);
  const { theme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  
  const walletAddress = '0x742d...F8e9';
  const fullAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438F8e9';

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalMarketCap = species.reduce((acc, s) => acc + s.marketCap, 0);
  const totalHolders = species.reduce((acc, s) => acc + s.holders, 0);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">FC</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-semibold">FCBC Portfolio</h1>
            <p className="text-xs text-muted-foreground">Track your holdings</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="shrink-0"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <AddonsDialog>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Sparkles className="h-5 w-5" />
            </Button>
          </AddonsDialog>
          
          <SettingsDialog>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Settings className="h-5 w-5" />
            </Button>
          </SettingsDialog>

          <Button
            variant="outline"
            className="gap-2 font-mono text-sm hidden sm:flex"
            onClick={copyAddress}
          >
            <Wallet className="h-4 w-4" />
            {walletAddress}
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>

          <a
            href="https://fcbc.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex"
          >
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </header>

      <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Market Cap"
            value={formatValue(totalMarketCap)}
            icon={<Wallet className="h-5 w-5" />}
            delay={0}
          />
          <StatCard
            label="Species Tokens"
            value={species.length.toLocaleString()}
            icon={<Coins className="h-5 w-5" />}
            delay={100}
          />
          <StatCard
            label="Total Holders"
            value={totalHolders.toLocaleString()}
            icon={<Image className="h-5 w-5" />}
            delay={200}
          />
          <StatCard
            label="NFT Collections"
            value="4"
            icon={<TrendingUp className="h-5 w-5" />}
            delay={300}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PortfolioChart data={mockChartData} className="lg:col-span-2 animate-slide-up" />
          <HoldingsBreakdown data={holdingsBreakdown} className="animate-slide-up" />
        </div>

        {/* Species Token List with Live API Data */}
        <SpeciesTokenList 
          species={species} 
          isLoading={isLoading}
          className="animate-slide-up" 
        />

        {/* NFT Collections */}
        <NFTCollections className="animate-slide-up" />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <a href="https://fcbc.fun" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
          fcbc.fun
        </a>
      </footer>
    </div>
  );
};

export default Index;
