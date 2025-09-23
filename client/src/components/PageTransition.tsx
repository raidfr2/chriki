import React, { createContext, useContext } from 'react';
import { usePageTransition } from '@/hooks/use-page-transition';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransitionContext = createContext<ReturnType<typeof usePageTransition> | null>(null);

export const usePageTransitionContext = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransitionContext must be used within PageTransition');
  }
  return context;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const transitionState = usePageTransition();
  const { isTransitioning, targetPage } = transitionState;

  return (
    <PageTransitionContext.Provider value={transitionState}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Main content */}
        <div 
          className={`transition-all duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {children}
        </div>

        {/* Transition overlay */}
        {isTransitioning && targetPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Cover animation */}
            <div 
              className="absolute inset-0 transition-all duration-600 ease-in-out page-transition-cover"
              style={{ 
                backgroundColor: targetPage.color,
                animation: 'coverSlideIn 0.6s ease-in-out forwards'
              }}
            />
            
            {/* Page name display */}
            <div className="relative z-10 text-center">
              <h1 
                className="font-mono text-6xl font-bold tracking-wider text-white animate-fade-in-scale"
                style={{ 
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  animation: 'pageNameAppear 0.4s ease-out 0.2s both'
                }}
              >
                {targetPage.name}
              </h1>
              <div 
                className="w-24 h-1 bg-white/80 mx-auto mt-4"
                style={{ 
                  animation: 'underlineExpand 0.3s ease-out 0.4s both'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </PageTransitionContext.Provider>
  );
}
