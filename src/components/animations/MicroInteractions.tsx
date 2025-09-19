import React from 'react';
import { AnimationState } from '@/types/carbonCalculator';

interface InteractiveTileProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  animationTier?: AnimationState;
  style?: React.CSSProperties;
}

export const InteractiveTile: React.FC<InteractiveTileProps> = ({
  children,
  isSelected = false,
  onClick,
  className = '',
  animationTier = AnimationState.MEDIUM,
  style
}) => {
  const tierGlow = {
    [AnimationState.LOW]: 'hover:shadow-eco-low/20',
    [AnimationState.MEDIUM]: 'hover:shadow-eco-medium/20', 
    [AnimationState.HIGH]: 'hover:shadow-eco-high/20'
  }[animationTier];

  return (
    <div
      className={`
        transport-tile group cursor-pointer
        ${isSelected ? 'selected animate-pulse-eco' : ''}
        ${tierGlow}
        hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-200 ease-out
        ${className}
      `}
      onClick={onClick}
      style={style}
    >
      <div className="group-hover:animate-float">
        {children}
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-scale-in">
          <svg className="w-4 h-4 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

interface AnimatedSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  animationTier?: AnimationState;
  className?: string;
}

export const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  animationTier = AnimationState.MEDIUM,
  className = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const tierColor = {
    [AnimationState.LOW]: 'bg-eco-low',
    [AnimationState.MEDIUM]: 'bg-eco-medium',
    [AnimationState.HIGH]: 'bg-eco-high'
  }[animationTier];

  return (
    <div className={`relative ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, hsl(var(--${animationTier === AnimationState.LOW ? 'eco-low' : animationTier === AnimationState.MEDIUM ? 'eco-medium' : 'eco-high'})) ${percentage}%, hsl(var(--secondary)) ${percentage}%)`
        }}
      />
      <div 
        className={`absolute top-0 h-2 ${tierColor} rounded-lg transition-all duration-300 ease-out pointer-events-none`}
        style={{ width: `${percentage}%` }}
      />
      <div 
        className={`absolute top-1/2 w-4 h-4 ${tierColor} rounded-full transform -translate-y-1/2 transition-all duration-200 ease-out shadow-lg hover:scale-110`}
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
};

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  animationTier?: AnimationState;
  className?: string;
  disabled?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  animationTier = AnimationState.MEDIUM,
  className = '',
  disabled = false
}) => {
  const tierGlow = {
    [AnimationState.LOW]: 'shadow-eco-low/40',
    [AnimationState.MEDIUM]: 'shadow-eco-medium/40',
    [AnimationState.HIGH]: 'shadow-eco-high/40'
  }[animationTier];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out
        ${variant === 'primary' ? 'bg-gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : `hover:scale-105 active:scale-95 hover:${tierGlow}`}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg animate-shimmer" />
      )}
    </button>
  );
};