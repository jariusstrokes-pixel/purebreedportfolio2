import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WalletPopover } from '@/components/WalletPopover';
import { FooterNav } from '@/components/FooterNav';
import { TasksDropdown } from '@/components/TasksDropdown';
import { AnimatedTitle } from '@/components/AnimatedTitle';
import { AppFooter } from '@/components/AppFooter';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

import fcbcWhiteLogo from '@/assets/fcbc_white.png';
import fcbcDarkLogo from '@/assets/fcbc_dark.png';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: 'portfolio' | 'snapshots';
}

export function AppLayout({ children, currentPage }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const logo = theme === 'dark' ? fcbcDarkLogo : fcbcWhiteLogo;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handlePageChange = (page: 'portfolio' | 'snapshots') => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <img src={logo} alt="FCBC" className="h-8 w-8" />
          <AnimatedTitle currentPage={currentPage} />
        </div>

        <div className="flex items-center gap-1">
          <TasksDropdown />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <WalletPopover />
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-4xl mx-auto">
        {children}
      </main>

      {/* App Footer */}
      <AppFooter />

      {/* Footer Navigation */}
      <FooterNav currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}
