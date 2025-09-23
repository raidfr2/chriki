import React from 'react';
import { usePageTransitionContext } from './PageTransition';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const { navigateWithTransition } = usePageTransitionContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call any additional onClick handler
    if (onClick) {
      onClick();
    }
    
    // Start the transition
    navigateWithTransition(href);
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
