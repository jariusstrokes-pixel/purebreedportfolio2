import { ExternalLink } from 'lucide-react';

// Custom social icons as inline SVGs
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FarcasterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.24 2.4H5.76c-1.86 0-3.36 1.5-3.36 3.36v12.48c0 1.86 1.5 3.36 3.36 3.36h12.48c1.86 0 3.36-1.5 3.36-3.36V5.76c0-1.86-1.5-3.36-3.36-3.36zm-6.24 15.6c-3.6 0-6.48-2.88-6.48-6.48 0-3.6 2.88-6.48 6.48-6.48 3.6 0 6.48 2.88 6.48 6.48 0 3.6-2.88 6.48-6.48 6.48z" />
  </svg>
);

const ZoraIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const BaseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);

const quickLinks = [
  { name: 'FCBC.FUN', url: 'https://fcbc.fun' },
  { name: 'FyreApp 0', url: 'https://fyreapp0.fcbc.fun' },
  { name: 'FyreApp 1', url: 'https://fyreapp1.fcbc.fun' },
  { name: 'FyreApp 2', url: '#', active: true },
  { name: 'FyreApp 3', url: 'https://fyreapp3.fcbc.fun' },
  { name: 'FyreApp 4', url: 'https://fyreapp4.fcbc.fun' },
  { name: 'FyreApp 5', url: 'https://fyreapp5.fcbc.fun' },
];

const socialLinks = [
  { name: 'X', icon: XIcon, url: 'https://x.com/fcbcfun' },
  { name: 'Base', icon: BaseIcon, url: 'https://base.org' },
  { name: 'Farcaster', icon: FarcasterIcon, url: 'https://warpcast.com/fcbc' },
  { name: 'Zora', icon: ZoraIcon, url: 'https://zora.co/fcbc' },
];

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card/50 py-6 px-4 mb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* FCBC Club Header */}
        <div className="text-center">
          <h3 className="font-bold text-lg text-primary">FCBC Club</h3>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
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
          © 2024 FCBC Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
