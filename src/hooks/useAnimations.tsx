import { useEffect, useRef, useCallback } from 'react';
import { AnimationState } from '@/types/carbonCalculator';

interface AnimationOptions {
  respectMotionPreference?: boolean;
  pauseOnHidden?: boolean;
  targetFPS?: number;
}

export const useAnimations = (options: AnimationOptions = {}) => {
  const {
    respectMotionPreference = true,
    pauseOnHidden = true,
    targetFPS = 60
  } = options;

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (respectMotionPreference) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mediaQuery.matches;
      
      const handleChange = (event: MediaQueryListEvent) => {
        prefersReducedMotion.current = event.matches;
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [respectMotionPreference]);

  // Monitor visibility
  useEffect(() => {
    if (pauseOnHidden) {
      const handleVisibilityChange = () => {
        isVisibleRef.current = !document.hidden;
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [pauseOnHidden]);

  const createAnimation = useCallback((
    callback: (timestamp: number, deltaTime: number) => void,
    shouldContinue?: () => boolean
  ) => {
    const frameInterval = 1000 / targetFPS;
    
    const animate = (timestamp: number) => {
      if (pauseOnHidden && !isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (prefersReducedMotion.current) {
        return; // Skip animations if reduced motion is preferred
      }

      const deltaTime = timestamp - lastTimeRef.current;
      
      if (deltaTime >= frameInterval) {
        callback(timestamp, deltaTime);
        lastTimeRef.current = timestamp;
      }

      if (!shouldContinue || shouldContinue()) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetFPS, pauseOnHidden]);

  const getTierAnimation = useCallback((tier: AnimationState) => {
    const animations = {
      [AnimationState.LOW]: 'animate-pulse-eco opacity-70',
      [AnimationState.MEDIUM]: 'animate-pulse opacity-85',
      [AnimationState.HIGH]: 'animate-bounce opacity-100'
    };
    return animations[tier] || '';
  }, []);

  return {
    createAnimation,
    getTierAnimation,
    prefersReducedMotion: prefersReducedMotion.current,
    isVisible: isVisibleRef.current
  };
};