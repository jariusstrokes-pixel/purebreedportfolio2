import { useState } from 'react';
import { DollarSign, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const amountPresets = ['0.01 ETH', '0.05 ETH', '0.1 ETH', '0.5 ETH', '1 ETH'];

interface BuyAmountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker: string;
}

export function BuyAmountDialog({ open, onOpenChange, ticker }: BuyAmountDialogProps) {
  const [amount, setAmount] = useState('');

  const handleBuy = () => {
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }
    toast.success(`Buying $${ticker} for ${amount}!`);
    onOpenChange(false);
    setAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Buy ${ticker}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Select Amount</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {amountPresets.map((preset) => (
                <Badge
                  key={preset}
                  variant={amount === preset ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setAmount(preset)}
                >
                  {preset}
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Input
                placeholder="Custom amount (e.g., 0.25 ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-muted border-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0" />
            <span>Transaction will be processed on Base network</span>
          </div>

          <Button onClick={handleBuy} className="w-full" disabled={!amount}>
            Buy Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
