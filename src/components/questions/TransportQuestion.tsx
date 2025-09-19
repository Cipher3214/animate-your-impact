import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AnimationState } from '@/types/carbonCalculator';
import { PageTransition } from '@/components/animations/PageTransition';
import { InteractiveTile } from '@/components/animations/MicroInteractions';

// Import transport images
import trainImg from '@/assets/local.png';
import busImg from '@/assets/best.png';
import autoImg from '@/assets/auto.png';
import carImg from '@/assets/cab.png';
import bikeImg from '@/assets/bike.png';
import walkCycleImg from '@/assets/transport-walk-cycle.png';

interface TransportData {
  selectedModes: string[];
  dailyKm: number;
  modeDistribution: Record<string, number>;
}

interface TransportQuestionProps {
  data: TransportData;
  animationTier: AnimationState;
  onChange: (data: TransportData) => void;
}

const TRANSPORT_MODES = [
  { id: 'train', name: 'Local Train / Metro', icon: trainImg, emissionFactor: 0.04, description: 'Mass transit system' },
  { id: 'bus', name: 'BEST Bus', icon: busImg, emissionFactor: 0.08, description: 'Public bus transport' },
  { id: 'auto', name: 'Shared Auto/Cab', icon: autoImg, emissionFactor: 0.15, description: 'Shared ride service' },
  { id: 'car', name: 'Private Car - Solo', icon: carImg, emissionFactor: 0.25, description: 'Personal vehicle' },
  { id: 'bike', name: 'Motorcycle', icon: bikeImg, emissionFactor: 0.12, description: 'Two-wheeler' },
  { id: 'walk', name: 'Walk / Cycle', icon: walkCycleImg, emissionFactor: 0.0, description: 'Zero emission' },
];

export const TransportQuestion: React.FC<TransportQuestionProps> = ({
  data,
  animationTier,
  onChange,
}) => {
  const [showDistribution, setShowDistribution] = useState(false);

  useEffect(() => {
    setShowDistribution(data.selectedModes.length > 1);
  }, [data.selectedModes.length]);

  const toggleMode = (modeId: string) => {
    const newSelectedModes = data.selectedModes.includes(modeId)
      ? data.selectedModes.filter(id => id !== modeId)
      : [...data.selectedModes, modeId];

    // Reset distribution when modes change
    const newDistribution: Record<string, number> = {};
    if (newSelectedModes.length > 0) {
      const evenSplit = Math.floor(100 / newSelectedModes.length);
      let remaining = 100;
      
      newSelectedModes.forEach((mode, index) => {
        if (index === newSelectedModes.length - 1) {
          newDistribution[mode] = remaining;
        } else {
          newDistribution[mode] = evenSplit;
          remaining -= evenSplit;
        }
      });
    }

    onChange({
      ...data,
      selectedModes: newSelectedModes,
      modeDistribution: newDistribution,
    });
  };

  const handleDistributionChange = (modeId: string, value: number) => {
    const newDistribution = { ...data.modeDistribution };
    const oldValue = newDistribution[modeId] || 0;
    const difference = value - oldValue;
    
    newDistribution[modeId] = value;
    
    // Adjust other modes proportionally
    const otherModes = data.selectedModes.filter(id => id !== modeId);
    const totalOthers = otherModes.reduce((sum, id) => sum + (newDistribution[id] || 0), 0);
    
    if (totalOthers > 0) {
      otherModes.forEach(id => {
        const currentValue = newDistribution[id] || 0;
        const proportion = currentValue / totalOthers;
        newDistribution[id] = Math.max(0, currentValue - (difference * proportion));
      });
    }
    
    // Ensure total is 100%
    const total = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      const adjustment = (100 - total) / otherModes.length;
      otherModes.forEach(id => {
        newDistribution[id] = Math.max(0, (newDistribution[id] || 0) + adjustment);
      });
    }

    onChange({
      ...data,
      modeDistribution: newDistribution,
    });
  };

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
    <PageTransition 
      backgroundType="transport" 
      animationTier={animationTier}
    >
      <div className="space-y-6">

        {/* Transport Mode Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Select Your Transport Modes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRANSPORT_MODES.map((mode, index) => (
              <InteractiveTile
                key={mode.id}
                isSelected={data.selectedModes.includes(mode.id)}
                onClick={() => toggleMode(mode.id)}
                animationTier={animationTier}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-primary/5 group-hover:bg-primary/10 transition-colors duration-200">
                    <img 
                      src={mode.icon} 
                      alt={mode.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{mode.name}</h3>
                  <p className="text-xs text-muted-foreground">{mode.description}</p>
                </div>
              </InteractiveTile>
            ))}
          </div>
        </Card>

      {/* Daily Distance Slider */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">
              Daily Distance (Total)
            </label>
            <Badge className={getTierClassName(animationTier)}>
              {data.dailyKm} km/day - {animationTier}
            </Badge>
          </div>
          <Slider
            value={[data.dailyKm]}
            onValueChange={([value]) => onChange({ ...data, dailyKm: value })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 km</span>
            <span>50 km</span>
            <span>100 km</span>
          </div>
        </div>
      </Card>

      {/* Mode Distribution (shown when multiple modes selected) */}
      {showDistribution && (
        <Card className="p-6 float-gentle">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Mode Distribution
          </h3>
          <div className="space-y-4">
            {data.selectedModes.map((modeId) => {
              const mode = TRANSPORT_MODES.find(m => m.id === modeId);
              if (!mode) return null;
              
              return (
                <div key={modeId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{mode.name}</span>
                    <Badge variant="outline">
                      {Math.round(data.modeDistribution[modeId] || 0)}%
                    </Badge>
                  </div>
                  <Slider
                    value={[data.modeDistribution[modeId] || 0]}
                    onValueChange={([value]) => handleDistributionChange(modeId, value)}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        </Card>
      )}


      </div>
    </PageTransition>
  );
};