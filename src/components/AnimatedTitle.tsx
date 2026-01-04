import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Page = 'portfolio' | 'snapshots';

interface AnimatedTitleProps {
  currentPage: Page;
}

const portfolioTitles = ['FyreApp 2', 'Portfolio Manager'];
const snapshotsTitles = ['FyreApp 3', 'Custody Snapshots'];

export function AnimatedTitle({ currentPage }: AnimatedTitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const titles = currentPage === 'portfolio' ? portfolioTitles : snapshotsTitles;

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % titles.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <span 
      className={cn(
        "font-semibold text-sm transition-all duration-300",
        isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      )}
    >
      {titles[currentIndex]}
    </span>
  );
}
