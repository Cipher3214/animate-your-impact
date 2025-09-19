import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AnimationState } from '@/types/carbonCalculator';

// Import transport images
import trainImg from '@/assets/transport-train.png';
import busImg from '@/assets/transport-bus.png';
import autoImg from '@/assets/transport-auto.png';
import carImg from '@/assets/transport-car.png';
import bikeImg from '@/assets/transport-bike.png';
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
  { id: 'train', name: 'Local Train / Metro', image: trainImg, emissionFactor: 0.04 },
  { id: 'bus', name: 'BEST Bus', image: busImg, emissionFactor: 0.08 },
  { id: 'auto', name: 'Shared Auto/Cab', image: autoImg, emissionFactor: 0.15 },
  { id: 'car', name: 'Private Car - Solo', image: carImg, emissionFactor: 0.25 },
  { id: 'bike', name: 'Motorcycle', image: bikeImg, emissionFactor: 0.12 },
  { id: 'walk', name: 'Walk / Cycle', image: walkCycleImg, emissionFactor: 0.0 },
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

  const handleModeToggle = (modeId: string) => {
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
    <div className="space-y-6 slide-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Daily Commute - Transport Modes
        </h2>
        <p className="text-muted-foreground">
          Select your primary modes of transport and daily distance
        </p>
      </div>

      {/* Transport Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {TRANSPORT_MODES.map((mode) => (
          <Card
            key={mode.id}
            className={`transport-tile ${
              data.selectedModes.includes(mode.id) ? 'selected' : ''
            }`}
            onClick={() => handleModeToggle(mode.id)}
          >
            <div className="text-center">
              <img
                src={mode.image}
                alt={mode.name}
                className="w-16 h-16 mx-auto mb-3 object-contain rounded-lg"
              />
              <h3 className="font-medium text-sm text-foreground mb-1">
                {mode.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {mode.emissionFactor} kg CO₂/km
              </Badge>
            </div>
          </Card>
        ))}
      </div>

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

      {/* Real-time Animation Background */}
      <Card className="p-8 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getTierClassName(animationTier)} pulse-eco`}>
            <span className="text-2xl font-bold">
              {animationTier === AnimationState.LOW && '🌱'}
              {animationTier === AnimationState.MEDIUM && '⚡'}
              {animationTier === AnimationState.HIGH && '🚨'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your transport emissions are <strong>{animationTier.toLowerCase()}</strong>
            {data.selectedModes.includes('walk') && (
              <span className="block text-success font-medium mt-1">
                🌿 Great choice including walking/cycling!
              </span>
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};