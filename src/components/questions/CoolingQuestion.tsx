import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimationState } from '@/types/carbonCalculator';
import { Fan, Wind, Snowflake, Thermometer } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { InteractiveTile } from '@/components/animations/MicroInteractions';

interface CoolingQuestionProps {
  coolingType: 'fan' | 'cooler' | 'ac-few' | 'ac-most';
  animationTier: AnimationState;
  onChange: (type: 'fan' | 'cooler' | 'ac-few' | 'ac-most') => void;
}

const COOLING_OPTIONS = [
  {
    id: 'fan' as const,
    name: 'Ceiling Fans / Natural Ventilation',
    icon: Fan,
    description: 'Low energy, natural cooling',
    consumption: 'Very Low',
    color: 'text-success',
  },
  {
    id: 'cooler' as const,
    name: 'Air Cooler / Desert Cooler',
    icon: Wind,
    description: 'Water-based cooling',
    consumption: 'Low',
    color: 'text-accent',
  },
  {
    id: 'ac-few' as const,
    name: 'AC for Few Hours Daily',
    icon: Snowflake,
    description: 'Limited air conditioning',
    consumption: 'Medium',
    color: 'text-eco-medium',
  },
  {
    id: 'ac-most' as const,
    name: 'AC Most of Day/Night',
    icon: Thermometer,
    description: 'Extensive air conditioning',
    consumption: 'High',
    color: 'text-eco-high',
  },
];

export const CoolingQuestion: React.FC<CoolingQuestionProps> = ({
  coolingType,
  animationTier,
  onChange,
}) => {
  const selectedOption = COOLING_OPTIONS.find(opt => opt.id === coolingType);
  
  const getTierClassName = (tier: AnimationState) => {
    switch (tier) {
      case AnimationState.LOW:
        return 'tier-low';
      case AnimationState.MEDIUM:
        return 'tier-medium';
      case AnimationState.HIGH:
        return 'tier-high';
      default:
        return '';
    }
  };

  return (
    <PageTransition backgroundType="cooling" animationTier={animationTier}>
      <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Summer Cooling Preference
        </h2>
        <p className="text-muted-foreground">
          How do you primarily cool your home during summer?
        </p>
      </div>

      {/* Cooling Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COOLING_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          return (
            <InteractiveTile
              key={option.id}
              isSelected={coolingType === option.id}
              onClick={() => onChange(option.id)}
              animationTier={animationTier}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <Icon className={`w-8 h-8 ${option.color} group-hover:scale-110 transition-transform duration-200`} />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  {option.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {option.description}
                </p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${option.color}`}
                >
                  {option.consumption} Energy
                </Badge>
              </div>
            </InteractiveTile>
          );
        })}
      </div>

      {/* Cooling Impact Visualization */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getTierClassName(animationTier)} pulse-eco`}>
            {selectedOption && (
              <selectedOption.icon 
                className={`w-8 h-8 ${selectedOption.color} ${
                  coolingType === 'fan' ? 'animate-float' : ''
                }`} 
              />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Cooling Impact: {animationTier}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-card/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Energy Usage</p>
              <p className={`text-lg font-semibold ${selectedOption?.color}`}>
                {selectedOption?.consumption}
              </p>
            </div>
            <div className="bg-card/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Efficiency</p>
              <p className="text-lg font-semibold text-foreground">
                {animationTier === AnimationState.LOW ? '⭐⭐⭐' : 
                 animationTier === AnimationState.MEDIUM ? '⭐⭐' : '⭐'}
              </p>
            </div>
          </div>

          {/* Cooling Method Animation */}
          <div className="mt-4 space-y-2">
            {coolingType === 'fan' && (
              <div className="flex justify-center items-center gap-2">
                <Wind className="w-4 h-4 text-success animate-float" />
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 h-1 bg-success rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {coolingType === 'ac-most' && (
              <div className="flex justify-center">
                <div className="w-20 h-2 bg-gradient-warning rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-eco-medium to-eco-high animate-pulse" />
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {animationTier === AnimationState.LOW && '🌿 Excellent choice! Natural cooling is the most eco-friendly.'}
            {animationTier === AnimationState.MEDIUM && '⚡ Moderate energy usage - consider upgrading to energy-efficient units.'}
            {animationTier === AnimationState.HIGH && '🔥 High energy usage - try combining with fans or optimizing AC temperature.'}
          </p>
        </div>
      </Card>
      </div>
    </PageTransition>
  );
};