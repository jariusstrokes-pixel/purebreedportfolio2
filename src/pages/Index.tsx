import { useState } from 'react';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { SnapshotsPage } from '@/pages/SnapshotsPage';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { AddonsDialog } from '@/components/dialogs/AddonsDialog';
import { WalletPopover } from '@/components/WalletPopover';
import { FooterNav } from '@/components/FooterNav';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Settings, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

import fcbcWhiteLogo from '@/assets/fcbc_white.png';
import fcbcDarkLogo from '@/assets/fcbc_dark.png';

type Page = 'portfolio' | 'snapshots';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('portfolio');

  const logo = theme === 'dark' ? fcbcDarkLogo : fcbcWhiteLogo;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <img src={logo} alt="FCBC" className="h-8 w-8" />
          <span className="font-semibold text-sm">Fyre App 2</span>
        </div>

        <div className="flex items-center gap-1">
          <WalletPopover />
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <AddonsDialog>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Sparkles className="h-4 w-4" />
            </Button>
          </AddonsDialog>
          
          <SettingsDialog>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </SettingsDialog>

          <a href="https://fcbc.fun" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-4xl mx-auto">
        {currentPage === 'portfolio' ? <PortfolioPage /> : <SnapshotsPage />}
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
  );
};

export default Index;
