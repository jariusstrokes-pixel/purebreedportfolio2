import { Briefcase, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

type Page = 'snapshots' | 'portfolio';

interface FooterNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function FooterNav({ currentPage, onPageChange }: FooterNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="max-w-4xl mx-auto flex">
        {/* Snapshots is TAB 1 */}
        <button
          onClick={() => onPageChange('snapshots')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 transition-colors relative",
            currentPage === 'snapshots' 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Camera className="h-5 w-5" />
          <span className="text-sm font-medium">Snapshots</span>
          {/* Attention indicator when not on snapshots */}
          {currentPage !== 'snapshots' && (
            <span className="absolute top-2 right-[30%] h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </button>
        {/* Portfolio is TAB 2 */}
        <button
          onClick={() => onPageChange('portfolio')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
            currentPage === 'portfolio' 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Briefcase className="h-5 w-5" />
          <span className="text-sm font-medium">Portfolio</span>
        </button>
      </div>
    </div>
  );
}
