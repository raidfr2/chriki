import { useState } from 'react';
import { useLocation } from 'wouter';

interface PageInfo {
  path: string;
  name: string;
  color: string;
}

const pageInfo: Record<string, PageInfo> = {
  '/chat': { path: '/chat', name: 'CHRIKI', color: '#3b82f6' },
  '/tariqi': { path: '/tariqi', name: 'TARIQI', color: '#f97316' },
  '/wraqi': { path: '/wraqi', name: 'AWRAQI', color: '#10b981' },
  '/admin': { path: '/admin', name: 'ADMIN', color: '#8b5cf6' },
  '/': { path: '/', name: 'HOME', color: '#3b82f6' }
};

export const usePageTransition = () => {
  const [, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPage, setTargetPage] = useState<PageInfo | null>(null);

  const navigateWithTransition = (path: string) => {
    // Don't start transition if already transitioning or if it's the same page
    if (isTransitioning) return;
    
    const target = pageInfo[path] || { path, name: 'PAGE', color: '#3b82f6' };
    
    // Start the transition animation
    setTargetPage(target);
    setIsTransitioning(true);

    // After the cover animation completes, navigate to the new page
    setTimeout(() => {
      setLocation(path);
      
      // After a brief moment, start the reveal animation
      setTimeout(() => {
        setIsTransitioning(false);
        setTargetPage(null);
      }, 300);
    }, 600);
  };

  return {
    navigateWithTransition,
    isTransitioning,
    targetPage
  };
};
