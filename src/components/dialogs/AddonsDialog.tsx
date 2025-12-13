import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bell, BarChart3, Users, MessageSquare, Gift, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const addons = [
  {
    id: 'price-alerts',
    name: 'Price Alerts',
    description: 'Get notified when tokens hit your targets',
    icon: Bell,
    status: 'active' as const,
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Deep portfolio analysis and insights',
    icon: BarChart3,
    status: 'available' as const,
  },
  {
    id: 'whale-tracking',
    name: 'Whale Tracking',
    description: 'Monitor large wallet movements',
    icon: Users,
    status: 'available' as const,
  },
  {
    id: 'social-feed',
    name: 'Social Feed',
    description: 'Community updates and sentiment',
    icon: MessageSquare,
    status: 'coming' as const,
  },
  {
    id: 'rewards',
    name: 'Rewards Hub',
    description: 'Claim airdrops and rewards',
    icon: Gift,
    status: 'coming' as const,
  },
  {
    id: 'insurance',
    name: 'Portfolio Insurance',
    description: 'Protect against market volatility',
    icon: Shield,
    status: 'coming' as const,
  },
];

const statusConfig = {
  active: { label: 'Active', className: 'bg-success/20 text-success border-success/30' },
  available: { label: 'Available', className: 'bg-primary/20 text-primary border-primary/30' },
  coming: { label: 'Coming Soon', className: 'bg-muted text-muted-foreground border-border' },
};

interface AddonsDialogProps {
  children?: React.ReactNode;
}

export function AddonsDialog({ children }: AddonsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Sparkles className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add-ons & Features</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {addons.map((addon) => {
            const config = statusConfig[addon.status];
            return (
              <div
                key={addon.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg transition-colors",
                  addon.status === 'coming' ? "bg-muted/20 opacity-60" : "bg-muted/30 hover:bg-muted/50 cursor-pointer"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  addon.status === 'active' ? "bg-success/20 text-success" :
                  addon.status === 'available' ? "bg-primary/20 text-primary" :
                  "bg-muted text-muted-foreground"
                )}>
                  <addon.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{addon.name}</p>
                    <Badge variant="outline" className={cn("text-xs", config.className)}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
