import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Eye, Wallet } from 'lucide-react';
import { useState } from 'react';

interface SettingsDialogProps {
  children?: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [hideSmallBalances, setHideSmallBalances] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Bell className="h-4 w-4" />
              Notifications
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Price Alerts</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>

          {/* Display */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Eye className="h-4 w-4" />
              Display
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact">Compact Mode</Label>
              <Switch
                id="compact"
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hide-small">Hide Small Balances</Label>
              <Switch
                id="hide-small"
                checked={hideSmallBalances}
                onCheckedChange={setHideSmallBalances}
              />
            </div>
          </div>

          {/* Wallet */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Wallet className="h-4 w-4" />
              Wallet
            </div>
            <Button variant="outline" className="w-full">
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
