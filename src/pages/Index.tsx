import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi-config';
import { useState } from 'react';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { SnapshotsPage } from '@/pages/SnapshotsPage';
import { LandingPage } from '@/pages/LandingPage';
import { WalletPopover } from '@/components/WalletPopover';
import { FooterNav } from '@/components/FooterNav';
import { useTheme } from '@/hooks/useTheme';

import fcbcWhiteLogo from '@/assets/fcbc_white.png';
import fcbcDarkLogo from '@/assets/fcbc_dark.png';

type Page = 'snapshots' | 'portfolio';

const queryClient = new QueryClient();

const Index = () => {
  const { theme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('snapshots');

  const logo = theme === 'dark' ? fcbcDarkLogo : fcbcWhiteLogo;

  if (!isConnected) {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <LandingPage onConnect={() => setIsConnected(true)} />
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-2">
              <img src={logo} alt="FCBC" className="h-8 w-8" />
              <span className="font-semibold text-sm">Fyre App 2</span>
            </div>

            <div className="flex items-center gap-1">
              <WalletPopover />
            </div>
          </header>

          <main className="p-4 space-y-4 max-w-4xl mx-auto">
            {currentPage === 'snapshots' ? <SnapshotsPage /> : <PortfolioPage />}
          </main>

          {/* Footer Navigation */}
          <FooterNav currentPage={currentPage} onPageChange={setCurrentPage} />

          {/* Footer */}
          <footer className="border-t border-border py-3 px-4 text-center text-xs text-muted-foreground mb-14">
            <a href="https://fcbc.fun" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              fcbc.fun
            </a>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Index;
