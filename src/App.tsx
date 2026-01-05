import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi-config';
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPortfolio } from "./pages/OnboardingPortfolio";
import { OnboardingSnapshots } from "./pages/OnboardingSnapshots";
import { PortfolioPage } from "./pages/PortfolioPage";
import { SnapshotsPage } from "./pages/SnapshotsPage";
import { AppLayout } from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding/portfolio" element={<OnboardingPortfolio />} />
            <Route path="/onboarding/snapshots" element={<OnboardingSnapshots />} />
            <Route path="/portfolio" element={<AppLayout currentPage="portfolio"><PortfolioPage /></AppLayout>} />
            <Route path="/snapshots" element={<AppLayout currentPage="snapshots"><SnapshotsPage /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
