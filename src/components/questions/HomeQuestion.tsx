import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AnimationState } from '@/types/carbonCalculator';
import { Home, Users } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { InteractiveTile } from '@/components/animations/MicroInteractions';

interface HomeData {
  type: string;
  occupants: number;
  hasSolar: boolean;
  solarPercentage: number;
}

interface HomeQuestionProps {
  data: HomeData;
  animationTier: AnimationState;
  onChange: (data: HomeData) => void;
}

const HOME_TYPES = [
  { id: '1rk', name: '1 RK / 1 BHK', area: 200, description: 'Compact Apartment' },
  { id: '2bhk', name: '2 BHK', area: 400, description: 'Medium Apartment' },
  { id: '3bhk', name: '3+ BHK', area: 600, description: 'Large Apartment' },
  { id: 'villa', name: 'Independent Villa', area: 1000, description: 'Bungalow/House' },
];

export const HomeQuestion: React.FC<HomeQuestionProps> = ({
  data,
  animationTier,
  onChange,
}) => {
  const selectedHomeType = HOME_TYPES.find(type => type.id === data.type);
  
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
    <PageTransition backgroundType="home" animationTier={animationTier}>
      <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Home Type & Occupancy
        </h2>
        <p className="text-muted-foreground">
          Tell us about your living situation
        </p>
      </div>

      {/* Home Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Home Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOME_TYPES.map((homeType, index) => (
            <InteractiveTile
              key={homeType.id}
              isSelected={data.type === homeType.id}
              onClick={() => onChange({ ...data, type: homeType.id })}
              animationTier={animationTier}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <Home className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h4 className="font-medium text-foreground mb-1">
                  {homeType.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {homeType.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  ~{homeType.area} sq ft
                </Badge>
              </div>
            </InteractiveTile>
          ))}
        </div>
      </Card>

      {/* Occupancy Slider */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Number of People Living
            </label>
            <Badge className={getTierClassName(animationTier)}>
              {data.occupants} people - {animationTier}
            </Badge>
          </div>
          <Slider
            value={[data.occupants]}
            onValueChange={([value]) => onChange({ ...data, occupants: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 person</span>
            <span>5 people</span>
            <span>10+ people</span>
          </div>
        </div>
      </Card>

      {/* Home Efficiency Visualization */}
      <Card className="p-8 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getTierClassName(animationTier)} pulse-eco`}>
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Home Efficiency: {animationTier}
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-card/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Area per Person</p>
              <p className="text-lg font-semibold text-foreground">
                {selectedHomeType ? Math.round(selectedHomeType.area / data.occupants) : 0} sq ft
              </p>
            </div>
            <div className="bg-card/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Efficiency Rating</p>
              <p className="text-lg font-semibold text-foreground">
                {animationTier === AnimationState.LOW ? '⭐⭐⭐' : 
                 animationTier === AnimationState.MEDIUM ? '⭐⭐' : '⭐'}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {animationTier === AnimationState.LOW && 'Excellent space efficiency! More people sharing reduces per-person impact.'}
            {animationTier === AnimationState.MEDIUM && 'Good balance of space and occupancy.'}
            {animationTier === AnimationState.HIGH && 'Consider sharing space or optimizing home energy usage.'}
          </p>
        </div>
      </Card>
      </div>
    </PageTransition>
  );
};