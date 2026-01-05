import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Wallet, Camera } from 'lucide-react';
import fcbcWhiteLogo from '@/assets/fcbc_white.png';
import fcbcDarkLogo from '@/assets/fcbc_dark.png';

export function LandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const logo = theme === 'dark' ? fcbcDarkLogo : fcbcWhiteLogo;
  const [showCaption, setShowCaption] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setShowCaption(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: 'center center',
          }}
        />
        {/* Grid dots at intersections */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 2px, transparent 2px)',
            backgroundSize: '60px 60px',
            backgroundPosition: 'center center',
          }}
        />
      </div>

      {/* Floating blue squares */}
      <div className="absolute top-20 left-[15%] w-12 h-12 bg-primary/80 rounded-md animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
      <div className="absolute top-32 right-[20%] w-8 h-8 bg-primary/60 rounded-md animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.4)]" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 left-[10%] w-10 h-10 bg-primary/70 rounded-md animate-pulse shadow-[0_0_25px_rgba(59,130,246,0.45)]" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 right-[15%] w-14 h-14 bg-primary/50 rounded-md animate-pulse shadow-[0_0_35px_rgba(59,130,246,0.3)]" style={{ animationDelay: '0.7s' }} />
      <div className="absolute top-[60%] right-[8%] w-6 h-6 bg-muted/50 rounded-md animate-pulse" style={{ animationDelay: '1.2s' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        {/* Logo */}
        <img src={logo} alt="FCBC" className="h-16 w-16 mb-6 animate-fade-in" />

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight animate-fade-in">
          FyreApp 2 and 3
        </h1>

        {/* Caption with typing animation */}
        <p 
          className={`text-lg md:text-xl text-muted-foreground mb-2 transition-all duration-1000 ${
            showCaption ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Portfolio, Snapshots and Custody Manager
        </p>
        <p 
          className={`text-lg md:text-xl text-muted-foreground mb-8 transition-all duration-1000 delay-300 ${
            showCaption ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          of Fyre PureBreed Collectibles.
        </p>

        {/* Subtitle */}
        <p 
          className={`text-sm text-muted-foreground/70 mb-10 transition-all duration-1000 delay-500 ${
            showCaption ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          a product of{' '}
          <a 
            href="https://fcbc.fun" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            fcbc.fun
          </a>
        </p>

        {/* Two Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 w-full max-w-md transition-all duration-1000 ${
            showCaption ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <Button
            onClick={() => navigate('/onboarding/portfolio')}
            size="lg"
            className="flex-1 px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-all duration-300 gap-2"
          >
            <Wallet className="h-5 w-5" />
            Portfolio Manager
          </Button>
          <Button
            onClick={() => navigate('/onboarding/snapshots')}
            size="lg"
            variant="outline"
            className="flex-1 px-8 py-6 text-lg rounded-full border-primary/50 text-primary hover:bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 gap-2"
          >
            <Camera className="h-5 w-5" />
            Snapshot Custody
          </Button>
        </div>
      </div>
    </div>
  );
}
