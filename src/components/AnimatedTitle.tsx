import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const titles = ['FyreApp 2', 'Custody Snapshots'];

export function AnimatedTitle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % titles.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
