import React, { useEffect, useState } from 'react';
import { AnimationState } from '@/types/carbonCalculator';

interface PageTransitionProps {
  children: React.ReactNode;
  animationTier?: AnimationState;
  backgroundType: 'transport' | 'home' | 'solar' | 'cooling' | 'shopping' | 'results';
  isActive?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  animationTier = AnimationState.MEDIUM,
  backgroundType,
  isActive = true
}) => {
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const getBackgroundElements = () => {
    const tierClass = {
      [AnimationState.LOW]: 'tier-low',
      [AnimationState.MEDIUM]: 'tier-medium', 
      [AnimationState.HIGH]: 'tier-high'
    }[animationTier];

    switch (backgroundType) {
      case 'transport':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-10 left-10 w-8 h-8 rounded-full ${tierClass} animate-float`} />
            <div className={`absolute top-20 right-20 w-6 h-6 rounded-full bg-success/30 animate-pulse`} />
            <div className={`absolute bottom-20 left-1/4 w-4 h-4 rounded-full bg-primary/20 animate-bounce`} 
                 style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-success/5" />
          </div>
        );
      case 'home':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 right-10 w-12 h-12 ${tierClass} rounded-lg animate-pulse-eco`} />
            <div className="absolute bottom-10 left-10 w-16 h-8 bg-primary/10 rounded-full animate-float" />
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 via-transparent to-primary/5" />
          </div>
        );
      case 'solar':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-5 right-5 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full animate-pulse" />
            <div className={`absolute bottom-1/4 left-1/3 w-6 h-6 ${tierClass} animate-bounce`} />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-transparent to-orange-50/30" />
          </div>
        );
      case 'cooling':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/3 w-10 h-10 bg-blue-200/30 rounded-full animate-pulse" />
            <div className={`absolute bottom-20 right-20 w-8 h-8 ${tierClass} animate-float`} />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20" />
          </div>
        );
      case 'shopping':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-6 h-6 bg-success/30 rounded-full animate-bounce" />
            <div className={`absolute bottom-10 right-1/3 w-12 h-6 ${tierClass} rounded-full animate-pulse-eco`} />
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-accent/5" />
          </div>
        );
      case 'results':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-8 h-8 bg-success/40 rounded-full animate-pulse" />
            <div className="absolute top-20 right-10 w-6 h-6 bg-primary/30 rounded-full animate-float" />
            <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-accent/20 rounded-full animate-bounce" />
            <div className="absolute bottom-10 right-20 w-4 h-4 bg-eco-low rounded-full animate-pulse-eco" />
            <div className="absolute inset-0 bg-gradient-to-br from-success/15 via-primary/5 to-accent/10" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative transition-all duration-400 ease-in-out ${
      isEntering ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
    } ${isActive ? '' : 'pointer-events-none'}`}>
      {getBackgroundElements()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};