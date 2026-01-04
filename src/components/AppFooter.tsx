import { ExternalLink } from 'lucide-react';

// Custom social icons matching the uploaded reference
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FarcasterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ZoraIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <circle cx="12" cy="12" r="9" fill="url(#zoraGradient)" />
    <defs>
      <linearGradient id="zoraGradient" x1="3" y1="3" x2="21" y2="21">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
);

const BaseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#0052FF" />
    <circle cx="12" cy="12" r="4" fill="white" />
  </svg>
);

const quickLinks = [
  { name: 'FCBC.FUN', url: 'https://fcbc.fun' },
  { name: 'FyreApp 0', url: 'https://fyreapp0.fcbc.fun' },
  { name: 'FyreApp 1', url: 'https://fyreapp1.fcbc.fun' },
  { name: 'FyreApp 2', url: '#', active: true },
  { name: 'FyreApp 3', url: '#', active: true },
  { name: 'FyreApp 4', url: 'https://fyreapp4.fcbc.fun' },
  { name: 'FyreApp 5', url: 'https://fyreapp5.fcbc.fun' },
];

const socialLinks = [
  { name: 'X', icon: XIcon, url: 'https://x.com/fcbcfun' },
  { name: 'Farcaster', icon: FarcasterIcon, url: 'https://warpcast.com/fcbc' },
  { name: 'Zora', icon: ZoraIcon, url: 'https://zora.co/fcbc' },
  { name: 'Base', icon: BaseIcon, url: 'https://base.org' },
];

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card/50 py-6 px-4 mb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* FCBC Club Header */}
        <div className="text-center">
          <h3 className="font-bold text-lg text-primary">FCBC Club</h3>
        </div>

        {/* Social Icons - matching uploaded reference style */}
        <div className="flex justify-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-lg bg-muted/80 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
              title={social.name}
            >
              <social.icon />
            </a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.active ? undefined : '_blank'}
                rel={link.active ? undefined : 'noopener noreferrer'}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                  link.active 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.name}
                {!link.active && <ExternalLink className="h-2.5 w-2.5" />}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border/50">
          © 2026 FCBC Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
