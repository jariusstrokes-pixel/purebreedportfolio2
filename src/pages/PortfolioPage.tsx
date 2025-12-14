import { StatCard } from '@/components/portfolio/StatCard';
import { SpeciesTokenList } from '@/components/portfolio/SpeciesTokenList';
import { NFTCollections } from '@/components/portfolio/NFTCollections';
import { useSpecies } from '@/hooks/useSpecies';
import { Wallet, TrendingUp, Coins, Dna, ShoppingCart, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PortfolioPage() {
  const { data: species = [], isLoading } = useSpecies(100);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">FCBCC Portfolio Manager</h1>
        <p className="text-muted-foreground">View and Manage your FYRE Pre-assets.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total Portfolio Value"
          value="$732,463"
          icon={<Wallet className="h-4 w-4" />}
          delay={0}
        />
        <StatCard
          label="Total PnL"
          value="+$729,765"
          icon={<TrendingUp className="h-4 w-4" />}
          valueClassName="text-success"
          delay={100}
        />
        <StatCard
          label="Pre-Assets Held"
          value="122"
          icon={<Coins className="h-4 w-4" />}
          delay={200}
        />
        <StatCard
          label="PureBreeds DNA Units"
          value="122M"
          icon={<Dna className="h-4 w-4" />}
          delay={300}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 gap-2">
          <ShoppingCart className="h-4 w-4" />
          QuickBuy
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Layers className="h-4 w-4" />
          MultiBuy
        </Button>
      </div>

      {/* Fyre DNA Pre-Assets List */}
      <SpeciesTokenList species={species} isLoading={isLoading} />

      {/* NFT Collections */}
      <NFTCollections />
    </div>
  );
}
